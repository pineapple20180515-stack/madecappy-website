import * as THREE from 'three';

const WINDOW_TOP = 1.0;
const WINDOW_BOTTOM = -.81;
const TAU = Math.PI * 2;
const P = THREE.MathUtils;
const slotHalfAngle = .022;
const slotX = -.27;
const sections = [
  [-2.72,.16,.16,0],
  [-2.65,.43,-.27,.38],
  [-2.52,.66,-.55,.61],
  [-2.25,.93,-.79,.81],
  [-1.86,1.075,-.935,.94],
  [-1.28,1.16,-.988,1.015],
  [-.58,1.18,-1.00,1.04],
  [.15,1.17,-1.00,1.02],
  [.69,1.12,-.991,.97],
  [1.10,1.025,-.96,.885],
  [1.47,.94,-.826,.778],
  [1.71,.77,-.64,.686],
  [1.99,.50,-.46,.593],
  [2.26,.30,-.36,.516],
  [2.44,.285,-.345,.492],
  [2.60,.30,-.332,.479],
  [2.68,.268,-.298,.431],
  [2.72,.224,-.252,.377],
  [2.73,-.014,-.014,0]
];

export const chamber = {
  centerX:-.67, floorY:-.755, halfWidth:1.63, halfDepth:.86,
  ceilingY:.82, slotX, slotY:1.18
};

function interpolate(a,b,c,d,t) {
  const lo=Math.min(b,c),hi=Math.max(b,c);
  return P.clamp(.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t),lo,hi);
}

function outline(x) {
  x=P.clamp(x,sections[0][0],sections.at(-1)[0]);
  const index=Math.max(0,Math.min(sections.length-2,sections.findIndex(s=>s[0]>=x)-1));
  const [a,b,c,d]=[sections[Math.max(0,index-1)],sections[index],sections[index+1],sections[Math.min(index+2,sections.length-1)]];
  const t=P.clamp((x-b[0])/(c[0]-b[0]),0,1);
  return [1,2,3].map(axis=>interpolate(a[axis],b[axis],c[axis],d[axis],t));
}

function axisShape(value,power){
  return Math.sign(value)*Math.pow(Math.abs(value),power);
}

function point(x,angle,target=new THREE.Vector3()) {
  const [top,bottom,depth]=outline(x);
  const radius=(top-bottom)*.5;
  const y=(top+bottom)*.5+radius*axisShape(Math.sin(angle),.70);
  return target.set(x,y,depth*axisShape(Math.cos(angle),.71));
}

function normalAt(x,angle) {
  const start=sections[0][0],end=sections.at(-1)[0];
  const dx=point(Math.min(x+.004,end),angle).sub(point(Math.max(x-.004,start),angle));
  const tangent=point(x,angle+.002).sub(point(x,angle-.002));
  if(tangent.lengthSq()<1e-13) return new THREE.Vector3(x<0?-1:1,0,0);
  return dx.cross(tangent).normalize();
}

function panelGeometry(minX,maxX,startAngle,stopAngle,nx=38,ny=26){
  const positions=[], normals=[],indices=[];
  for(let j=0;j<=ny;j++){
    const angle=P.lerp(startAngle,stopAngle,j/ny);
    const first=typeof minX==='function'?minX(angle):minX;
    const last=typeof maxX==='function'?maxX(angle):maxX;
    for(let i=0;i<=nx;i++){
      const x=P.lerp(first,last,i/nx);
      const v=point(x,angle), n=normalAt(x,angle);
      positions.push(v.x,v.y,v.z);normals.push(n.x,n.y,n.z);
      if(i<nx&&j<ny){
        const a=j*(nx+1)+i,b=a+nx+1;
        indices.push(a,a+1,b,b,a+1,b+1);
      }
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geo.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
  geo.setIndex(indices);
  return geo;
}

function backEdge(angle) {
  return -2.645+.72*Math.pow(Math.abs(Math.sin(angle)),2.18);
}
function frontEdge(angle) {
  const h=Math.sin(angle);
  return 1.27-.43*Math.exp(-Math.pow((h-.48)/.36,2))-.25*Math.pow(Math.max(0,-h),3);
}

function opticalGlass(){
  return new THREE.ShaderMaterial({
    vertexShader:`varying vec3 vNormal, vView;
      void main(){
        vec4 p=modelViewMatrix*vec4(position,1.0);
        vNormal=normalize(normalMatrix*normal);
        vView=-p.xyz;
        gl_Position=projectionMatrix*p;
      }`,
    fragmentShader:`varying vec3 vNormal, vView;
      void main(){
        vec3 n=normalize(vNormal), v=normalize(vView);
        float grazing=pow(1.0-max(0.0,dot(n,v)),2.5);
        vec3 r=reflect(-v,n);
        float window=pow(max(0.0,dot(r,normalize(vec3(-.78,.10,.61)))),27.0);
        float strip=pow(max(0.0,dot(r,normalize(vec3(.20,.79,.58)))),32.0);
        float edge=pow(max(0.0,dot(r,normalize(vec3(.78,.19,.59)))),45.0);
        float gloss=clamp(window*.88+strip*.72+edge*.63,0.0,1.0);
        vec3 tint=mix(vec3(.78,.81,.85),vec3(.25,.28,.35),grazing);
        vec3 color=mix(tint,vec3(1.0),min(1.0,gloss*2.7));
        gl_FragColor=vec4(color,clamp(.072+.35*grazing+.78*gloss,0.0,.86));
        #include <colorspace_fragment>
      }`,
    depthWrite:false,transparent:true
  });
}

function boundary(a,b,inset){
  const path=[];
  function append(u,angle){
    const theta=P.lerp(angle,(a+b)*.5,inset);
    const x=P.lerp(backEdge(theta),frontEdge(theta),P.lerp(u,.5,inset*.9));
    path.push(point(x,theta).addScaledVector(normalAt(x,theta),.024+inset*.10));
  }
  for(let i=0;i<28;i++)append(i/28,a);
  for(let i=0;i<24;i++)append(1,P.lerp(a,b,i/24));
  for(let i=0;i<28;i++)append(1-i/28,b);
  for(let i=0;i<24;i++)append(0,P.lerp(b,a,i/24));
  return new THREE.CatmullRomCurve3(path,true);
}

function mesh(parent,geo,mat){
  const item=new THREE.Mesh(geo,mat);parent.add(item);return item;
}

function makeChassis(group,ceramic){
  const rear=sections[0][0],nose=sections.at(-1)[0];
  const snoutBase=2.58;
  const a=WINDOW_TOP,b=Math.PI-WINDOW_TOP;
  const farEnd=Math.PI-WINDOW_BOTTOM;
  const lip=new THREE.MeshPhysicalMaterial({color:0xb3b6bc,metalness:.53,roughness:.17,clearcoat:.85,envMapIntensity:1.05});
  const polished=new THREE.MeshPhysicalMaterial({color:0xe2e3e4,metalness:.22,roughness:.11,clearcoat:1,clearcoatRoughness:.07});
  const glaze=opticalGlass();
  for(const [lo,hi,side] of [[WINDOW_BOTTOM,a,1],[b,farEnd,-1]]){
    mesh(group,panelGeometry(rear,backEdge,lo,hi,17,34),ceramic);
    mesh(group,panelGeometry(frontEdge,snoutBase,lo,hi,36,34),ceramic);
    const pane=mesh(group,panelGeometry(backEdge,frontEdge,lo,hi,48,34),glaze);
    pane.renderOrder=6;
    for(const [source,inset,radius] of [[lip,.012,.036],[polished,.044,.022]]){
      const material=source.clone();
      material.transparent=true;
      material.depthWrite=false;
      const rim=mesh(group,new THREE.TubeGeometry(boundary(lo,hi,inset),148,radius,12,true),material);
      rim.renderOrder=7;
      rim.onBeforeRender=()=>{
        const facing=Math.cos(group.rotation.y)*side;
        material.opacity=P.lerp(.16,1,P.smoothstep(facing,-.58,.48));
      };
    }
  }
  const slotLo=Math.PI/2-slotHalfAngle,slotHi=Math.PI/2+slotHalfAngle;
  mesh(group,panelGeometry(rear,snoutBase,a,slotLo,76,9),ceramic);
  mesh(group,panelGeometry(rear,snoutBase,slotHi,b,76,9),ceramic);
  function offset(angle){
    const t=(angle-Math.PI/2)/slotHalfAngle;
    return .387+.076*Math.sqrt(Math.max(0,1-t*t));
  }
  mesh(group,panelGeometry(rear,angle=>slotX-offset(angle),slotLo,slotHi,42,10),ceramic);
  mesh(group,panelGeometry(angle=>slotX+offset(angle),snoutBase,slotLo,slotHi,42,10),ceramic);
  mesh(group,panelGeometry(rear,snoutBase,farEnd,TAU+WINDOW_BOTTOM,76,25),ceramic);
  mesh(group,panelGeometry(snoutBase,nose,0,TAU,22,104),ceramic);

  const matte=new THREE.MeshStandardMaterial({color:0x191a1d,roughness:.58});
  const lining=mesh(group,new THREE.CapsuleGeometry(.061,.79,6,20),matte);
  lining.scale.set(.30,1,.66);
  lining.rotation.z=Math.PI/2;
  lining.position.set(slotX,1.175,0);
}

function makeTray(group,ceramic) {
  const shape=new THREE.Shape();
  shape.moveTo(-2.32,0);
  shape.bezierCurveTo(-2.32,-.48,-1.98,-.65,-1.54,-.67);
  shape.lineTo(.70,-.67);
  shape.bezierCurveTo(1.05,-.66,1.21,-.43,1.21,0);
  shape.bezierCurveTo(1.21,.43,1.05,.66,.70,.67);
  shape.lineTo(-1.54,.67);
  shape.bezierCurveTo(-1.98,.65,-2.32,.48,-2.32,0);
  const geometry=new THREE.ExtrudeGeometry(shape,{
    depth:.085,bevelEnabled:true,bevelThickness:.04,bevelSize:.04,bevelSegments:4,curveSegments:20
  });
  const tray=mesh(group,geometry,ceramic);
  tray.rotation.x=-Math.PI/2;
  tray.position.y=-.895;
}

function makeFeet(group,ceramic) {
  const footShape=[
    [0,-1.265],[.80,-1.265],[.94,-1.248],[1,-1.207],
    [1.00,-1.151],[1.03,-1.085],[1.12,-1.009],[1.21,-.932],[1.24,-.855],[1.08,-.755],[.57,-.674],[0,-.673]
  ].map(([r,y])=>new THREE.Vector2(r,y));
  const geometry=new THREE.LatheGeometry(footShape,36);
  for(const [x,length] of [[-1.98,.35],[1.08,.36]])for(const side of [-1,1]){
    const foot=mesh(group,geometry,ceramic);
    foot.scale.set(length,1,.235);
    foot.position.set(x,0,side*.45);
  }
}

function makeTail(group,ceramic) {
  const path=new THREE.CatmullRomCurve3([
    [-2.43,.753,0],[-2.57,.785,0],[-2.72,.884,-.02],[-2.745,1.035,-.035],[-2.675,1.157,-.048],[-2.60,1.166,-.050]
  ].map(p=>new THREE.Vector3(...p)));
  const points=[],indices=[],length=40,sides=20;
  for(let i=0;i<=length;i++){
    const t=i/length,c=path.getPoint(t),v=path.getTangent(t);
    const a=new THREE.Vector3(-v.y,v.x,0).normalize();
    const b=v.clone().cross(a).normalize();
    const radius=.140*Math.pow(1-t,.79)+.006;
    for(let j=0;j<=sides;j++){
      const theta=j/sides*TAU;
      const p=c.clone().addScaledVector(a,Math.cos(theta)*radius).addScaledVector(b,Math.sin(theta)*radius*.78);
      points.push(p.x,p.y,p.z);
      if(i<length&&j<sides){const k=i*(sides+1)+j;indices.push(k,k+1,k+sides+1,k+1,k+sides+2,k+sides+1);}
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setIndex(indices);g.computeVertexNormals();
  mesh(group,g,ceramic);
}

function makeEar(group,ceramic,side){
  const outline=[
    [.91,.91,.674],[.99,1.064,.632],[1.21,1.151,.631],
    [1.48,1.159,.741],[1.74,1.033,.842],[1.80,.961,.951],
    [1.59,.868,1.045],[1.31,.669,1.054],[1.10,.541,.939],[.972,.646,.798]
  ];
  const path=new THREE.CatmullRomCurve3(outline.map(([x,y,z])=>new THREE.Vector3(x,y,z*side)),true);
  const center=new THREE.Vector3(1.32,.879,.795*side);
  const segments=58,rings=9;
  const geometry=new THREE.BufferGeometry(), positions=[], indices=[];
  for(let face=0;face<2;face++)for(let i=0;i<=rings;i++)for(let j=0;j<=segments;j++){
    const r=i/rings,border=path.getPoint(j/segments),v=center.clone().lerp(border,r);
    v.z+=(face===0?.17:-.097)*Math.sqrt(1-r*r)*side;
    v.y+=(face===0?.075:-.03)*(1-r)*Math.sin(r*Math.PI/2);
    positions.push(v.x,v.y,v.z);
    if(i<rings&&j<segments){
      const x=(face*(rings+1)+i)*(segments+1)+j,y=x+segments+1;
      if((side===1)!==(face===0))indices.push(x,y,x+1,x+1,y,y+1);
      else indices.push(x,x+1,y,x+1,y+1,y);
    }
  }
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setIndex(indices);geometry.computeVertexNormals();
  mesh(group,geometry,ceramic);
}

function makeFace(group){
  const glossy=new THREE.MeshPhysicalMaterial({color:0x111113,metalness:.1,roughness:.125,clearcoat:1,clearcoatRoughness:.075});
  const surround=new THREE.MeshStandardMaterial({color:0xc9c5bf,metalness:.30,roughness:.24});
  const nostril=new THREE.MeshStandardMaterial({color:0x625d57,roughness:.69});
  for(const sign of [-1,1]){
    const x=1.832,theta=sign===1?.315:Math.PI-.315;
    const lens=new THREE.Group();group.add(lens);
    const n=normalAt(x,theta);
    lens.position.copy(point(x,theta)).addScaledVector(n,.010);
    lens.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),n);
    const bevel=mesh(lens,new THREE.TorusGeometry(.082,.009,12,36),surround);
    bevel.position.z=.015;
    const eye=mesh(lens,new THREE.SphereGeometry(1,28,20),glossy);
    eye.scale.set(.078,.078,.032);
    const hole=mesh(group,new THREE.SphereGeometry(1,24,16),nostril);
    hole.position.set(2.729,-.026,.146*sign);
    hole.scale.set(.009,.064,.036);
  }
}

export function makeLittleWhite(){
  const group=new THREE.Group();
  group.name='Little White';
  const ceramic=new THREE.MeshPhysicalMaterial({
    color:0xe6e1d9,roughness:.31,metalness:.04,clearcoat:.30,clearcoatRoughness:.28,
    sheen:.06,sheenColor:0xffffff,envMapIntensity:.81,side:THREE.DoubleSide
  });
  makeChassis(group,ceramic);
  makeTray(group,ceramic);
  makeFeet(group,ceramic);
  makeTail(group,ceramic);
  for(const side of [-1,1])makeEar(group,ceramic,side);
  makeFace(group);
  return group;
}
