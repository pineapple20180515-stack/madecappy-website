import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { posterData } from './poster-data.js';

const motion = matchMedia('(prefers-reduced-motion: reduce)');
const dimensions = { width: 5.75, height: 2.756, radius: .34 };
const fullTurn = Math.PI * 2;

function roundedPath(path, width, height, radius) {
  const x = width / 2;
  const y = height / 2;
  path.moveTo(-x + radius, -y);
  path.lineTo(x - radius, -y);
  path.quadraticCurveTo(x, -y, x, -y + radius);
  path.lineTo(x, y - radius);
  path.quadraticCurveTo(x, y, x - radius, y);
  path.lineTo(-x + radius, y);
  path.quadraticCurveTo(-x, y, -x, y - radius);
  path.lineTo(-x, -y + radius);
  path.quadraticCurveTo(-x, -y, -x + radius, -y);
  path.closePath();
  return path;
}

function plate(width, height, radius, thickness, material, bevel = .018, inner) {
  const shape = roundedPath(new THREE.Shape(), width, height, radius);
  if (inner) shape.holes.push(roundedPath(new THREE.Path(), inner.width, inner.height, inner.radius));
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel,
    bevelSegments: 3, curveSegments: 16, steps: 1,
  });
  geometry.translate(0, 0, -thickness / 2);
  return new THREE.Mesh(geometry, material);
}

function paint(color, roughness, metalness = 0, extra = {}) {
  return new THREE.MeshPhysicalMaterial({ color, roughness, metalness, ...extra });
}
function addMesh(parent, geometry, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x,y,z);
  parent.add(mesh);
  return mesh;
}

function makeStudio(target, framing = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'low-power', preserveDrawingBuffer:true });
  renderer.setPixelRatio(Math.min(1.75, window.devicePixelRatio));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.domElement.setAttribute('aria-hidden','true');
  target.append(renderer.domElement);
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const studio = new RoomEnvironment();
  const environment = pmrem.fromScene(studio, .04);
  scene.environment = environment.texture;
  scene.environmentIntensity = .77;
  studio.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xf8faff, 0x818792, 1.0));
  const key = new THREE.DirectionalLight(0xfff5e3, 2.05);
  key.position.set(-3, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xdce5ff, 1.4);
  rim.position.set(3, 3, -4); scene.add(rim);
  const camera = new THREE.PerspectiveCamera(framing.fov ?? 37,1,.1,100);
  camera.position.set(0, 0, 12);
  const resize = () => {
    const {width,height} = target.getBoundingClientRect();
    if (width < 1 || height < 1) return;
    camera.aspect = width / height;
    camera.position.z = Math.max(framing.distance ?? 9.05, (framing.fit ?? 11.75) / camera.aspect);
    camera.updateProjectionMatrix();
    renderer.setSize(width,height,false);
    renderer.render(scene,camera);
  };
  new ResizeObserver(resize).observe(target);
  return { renderer, scene, camera, resize };
}

function softShadow(scene, width, height, x, y) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64,64,0,64,64,62);
  gradient.addColorStop(0,'rgba(33,36,47,0.24)');
  gradient.addColorStop(.40,'rgba(33,36,47,0.13)');
  gradient.addColorStop(1,'rgba(33,36,47,0)');
  ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  addMesh(scene,new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false}),x,y,-2.9);
}

function addLens(part, x, y, side, radius, z, baseMetal) {
  const optic = new THREE.Group();
  optic.position.set(x,y,z);
  if (side === 'rear') optic.rotation.y = Math.PI;
  part.add(optic);
  const body = paint(0x0f2422,.23,.58);
  const rim = baseMetal ?? paint(0xa3c3b6,.20,.75);
  const green = paint(0x368174,.24,.37,{clearcoat:1});
  const glass = paint(0x051b22,.08,.57,{clearcoat:1,iridescence:.6,iridescenceIOR:1.32,iridescenceThicknessRange:[125,285]});
  const disc = (r,h,m,offset) => {
    const item = addMesh(optic,new THREE.CylinderGeometry(r,r,h,48),m,0,0,offset);
    item.rotation.x = Math.PI / 2;
  };
  disc(radius*1.04,radius*.29,rim,.0);
  disc(radius*.91,radius*.22,body,radius*.14);
  disc(radius*.73,radius*.09,green,radius*.29);
  const globe = addMesh(optic,new THREE.SphereGeometry(radius*.57,36,20),glass,0,0,radius*.32);
  globe.scale.z=.38;
  return optic;
}

function textureOfBoard() {
  const board = document.createElement('canvas');board.width=768;board.height=384;
  const ctx = board.getContext('2d');
  ctx.fillStyle='#29463c';ctx.fillRect(0,0,768,384);
  for (let i=0;i<30;i++) {
    const y=18+i*11.6;
    const offset=(i%7)*9;
    ctx.strokeStyle=i%4===0?'#b6af80':i%3===0?'#829d87':'#4e7867';
    ctx.lineWidth=i%4===0?1.7:1;
    ctx.beginPath();ctx.moveTo(7,y);ctx.lineTo(40+offset,y);ctx.lineTo(115+offset,Math.min(360,y+48));ctx.lineTo(245,y);ctx.lineTo(342+offset,y);ctx.lineTo(405+offset,y+14);ctx.lineTo(760,y+14);ctx.stroke();
  }
  const image=new THREE.CanvasTexture(board);image.colorSpace=THREE.SRGBColorSpace;
  return image;
}

function makePhone(target, label, hint, onChange) {
  const {scene,camera,renderer,resize} = makeStudio(target,{distance:7.5,fit:10.1});
  softShadow(scene,6.8,1.43,.14,-1.64);
  const phone = new THREE.Group(); scene.add(phone);
  const metal = paint(0xc7d5cd,.21,.88,{clearcoat:.25});
  const polished = paint(0xe5eae0,.18,.68,{clearcoat:.82});
  const dark = paint(0x0b1818,.30,.44);
  const shellMaterial = paint(0xb8c7c4,.34,.54,{clearcoat:.64,clearcoatRoughness:.23});
  const tint = paint(0x92bba9,.12,.24,{transparent:true,opacity:.24,depthWrite:false,side:THREE.DoubleSide});
  const {width:w,height:h,radius:r}=dimensions;
  const core=new THREE.Group();const front=new THREE.Group();const rear=new THREE.Group();
  phone.add(core,front,rear);

  const rail=plate(w,h,r,.274,metal,.034,{width:w-.13,height:h-.13,radius:r-.04});
  core.add(rail);
  core.add(plate(w-.16,h-.16,r-.06,.12,dark,.012));
  for (const [x,y,length] of [[1.16,1.44,.72],[-1.06,1.44,.46],[-.43,1.44,.39]]) {
    const key=addMesh(core,new THREE.CapsuleGeometry(.039,length-.08,5,10),polished,x,y,0);
    key.rotation.z=Math.PI/2;
  }
  for (const y of [-.77,.76]) {
    for (let i=0;i<5;i++) {
      const grille=addMesh(core,new THREE.CylinderGeometry(.025,.025,.018,12),dark,2.904,y+(i-2)*.071,0);
      grille.rotation.z=Math.PI/2;
    }
  }
  const boardGroup = new THREE.Group(); core.add(boardGroup);
  const boardTexture=textureOfBoard();
  addMesh(boardGroup,new THREE.PlaneGeometry(2.83,2.23),new THREE.MeshStandardMaterial({map:boardTexture,roughness:.53}),.84,0,.081);
  const shield=plate(1.48,2.15,.14,.06,paint(0x515b55,.38,.58),.015);shield.position.set(-1.55,0,.092);boardGroup.add(shield);
  const batteryTop=plate(1.28,1.94,.12,.018,paint(0x95a197,.47,.46),.006);batteryTop.position.set(-1.55,0,.127);boardGroup.add(batteryTop);
  for (const [x,y,ww,hh] of [[.34,.2,.95,.87],[1.49,.57,.65,.60],[1.56,-.42,.64,.55],[.34,-.62,.63,.42]]) {
    const block=plate(ww,hh,.055,.094,paint(0x263630,.30,.66),.009);block.position.set(x,y,.135);boardGroup.add(block);
    const face=plate(ww-.09,hh-.09,.032,.011,paint(0x68796f,.51,.38),.003);face.position.set(x,y,.192);boardGroup.add(face);
  }
  const fastener=paint(0xc0c8bf,.22,.78);
  for (const x of [-2.5,-1.04,1.17,2.48]) for (const y of [-1.04,1.04]) {
    const pin=addMesh(boardGroup,new THREE.CylinderGeometry(.056,.056,.035,16),fastener,x,y,.115);pin.rotation.x=Math.PI/2;
    addMesh(boardGroup,new THREE.BoxGeometry(.064,.011,.008),dark,x,y,.138).rotation.z=Math.PI/6;
  }

  front.add(plate(w-.064,h-.064,r-.014,.059,dark,.016,{width:w-.22,height:h-.22,radius:r-.053}));
  const protector=plate(w-.076,h-.076,r-.018,.018,tint,.012);protector.position.z=.06;front.add(protector);
  const display=new THREE.Group();front.add(display);
  const displayShape=roundedPath(new THREE.Shape(),w-.24,h-.24,r-.062);
  const displayGeometry=new THREE.ShapeGeometry(displayShape,20);
  const attribute=displayGeometry.getAttribute('position');
  const uv=displayGeometry.getAttribute('uv');
  for(let i=0;i<attribute.count;i++) uv.setXY(i,attribute.getX(i)/(w-.24)+.5,attribute.getY(i)/(h-.24)*.833+.5835);
  const displayMaterial=new THREE.MeshBasicMaterial({color:0xcddad3,toneMapped:false});
  const screen=new THREE.Mesh(displayGeometry,displayMaterial); screen.position.z=.048;display.add(screen);
  new THREE.TextureLoader().load(posterData,texture=>{
    texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    displayMaterial.map=texture;displayMaterial.color.set(0xffffff);displayMaterial.needsUpdate=true;
  });
  const frontNotch=plate(.193,.49,.095,.012,dark,.003);frontNotch.position.set(-2.55,0,.075);front.add(frontNotch);
  const frontLens=addLens(front,-2.55,.104,'front',.050,.084);

  const rearFace=plate(w-.027,h-.027,r-.01,.081,shellMaterial,.031);rear.add(rearFace);
  const platformMetal=paint(0xbac8c5,.33,.71,{clearcoat:.42});
  const ringMetal=paint(0xa5b6b3,.17,.80,{clearcoat:.66});
  const plateau=plate(1.53,h-.15,.29,.119,platformMetal,.054);
  plateau.position.set(-2.02,0,-.098);rear.add(plateau);
  const rearLens=addLens(rear,-2.40,.72,'rear',.332,-.193,ringMetal);
  addLens(rear,-1.65,.72,'rear',.329,-.193,ringMetal);
  addLens(rear,-2.03,.020,'rear',.329,-.193,ringMetal);
  const sensor=new THREE.CylinderGeometry(.107,.107,.022,32);
  const flash=addMesh(rear,sensor,paint(0xe8e3cd,.29,.36),-2.43,-.944,-.177);flash.rotation.x=Math.PI/2;
  const lidar=addMesh(rear,sensor,paint(0x293333,.43,.28),-1.72,-.944,-.177);lidar.rotation.x=Math.PI/2;
  const mic=addMesh(rear,new THREE.SphereGeometry(.027,14,10),dark,-2.067,-.912,-.18);mic.scale.z=.45;
  const backGlass=plate(w-1.86,h-.195,.28,.018,paint(0xc6d3d1,.39,.27,{clearcoat:.55}),.01);
  backGlass.position.set(.825,0,-.056);rear.add(backGlass);

  const engraving=document.createElement('canvas');
  engraving.width=768;engraving.height=224;
  const engraver=engraving.getContext('2d');
  engraver.textAlign='center';engraver.textBaseline='middle';
  engraver.font='600 120px "Avenir Next", sans-serif';
  engraver.fillStyle='#ffffff';engraver.fillText('dualcam',384,115);
  const wordmarkTexture=new THREE.CanvasTexture(engraving);wordmarkTexture.colorSpace=THREE.SRGBColorSpace;
  const wordmarkMaterial=new THREE.MeshBasicMaterial({map:wordmarkTexture,transparent:true,depthWrite:false,toneMapped:false});
  const wordmark=addMesh(rear,new THREE.PlaneGeometry(2.03,.592),wordmarkMaterial,.77,0,-.084);
  wordmark.rotation.y=Math.PI;

  function setFinish(finish){
    const red=finish==='red';
    const colors=red
      ? [0xb1272f,0xf48674,0xa93037,0xad3236,0xb94943,0xae3339]
      : [0xc7d5cd,0xe5eae0,0xb8c7c4,0xbac8c5,0xa5b6b3,0xc6d3d1];
    [metal,polished,shellMaterial,platformMetal,ringMetal,backGlass.material].forEach((m,i)=>m.color.setHex(colors[i]));
    wordmarkMaterial.color.setHex(red?0xffc5bb:0x4e6660);
    wordmarkMaterial.opacity=red?.86:.82;
    renderer.render(scene,camera);
  }

  const stage=target.parentElement;
  const views={front:{yaw:-.27,pitch:-.17},rear:{yaw:Math.PI+.27,pitch:-.21},explode:{yaw:-.70,pitch:-.28}};
  let mode=motion.matches?'rear':'orbit';let yaw=Math.PI+.37;let pitch=-.25;
  let wantedYaw=yaw;let wantedPitch=pitch;let spread=0;let last=performance.now();let engaged=false;
  let drag=null;let visible=true;
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;},{rootMargin:'80px'}).observe(stage);
  const localizedLabel=()=>label.dataset[mode]||'';
  const select=(view)=>{
    mode=view;engaged=true;
    if(view!=='orbit'){
      const targetAngle=views[view].yaw;
      wantedYaw=targetAngle+Math.round((yaw-targetAngle)/fullTurn)*fullTurn;
      wantedPitch=views[view].pitch;
    }
    if(view==='orbit') wantedPitch=-.24;
    onChange(view);hint.hidden=view!=='orbit';
  };
  stage.addEventListener('pointerdown',event=>{
    if(!event.isPrimary||event.button!==0) return;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,yaw,pitch,moved:false};
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(!drag.moved&&Math.abs(dx)<5&&Math.abs(dy)<5)return;
    if(!drag.moved){drag.moved=true;stage.dataset.dragging='true';mode='manual';engaged=true;onChange(mode);hint.hidden=false;}
    wantedYaw=drag.yaw+dx*.010;
    wantedPitch=THREE.MathUtils.clamp(drag.pitch+dy*.007,-1,1);
  });
  function finishDrag(event){if(!drag||event.pointerId!==drag.id)return;drag=null;delete stage.dataset.dragging;}
  stage.addEventListener('pointerup',finishDrag);stage.addEventListener('pointercancel',finishDrag);
  window.addEventListener('keydown',event=>{
    if(document.activeElement!==stage||!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();mode='manual';engaged=true;wantedYaw+=event.key==='ArrowRight'?.3:-.3;onChange(mode);
  });
  stage.tabIndex=0;
  const origin=performance.now();
  const projected=new THREE.Vector3();
  const facing=new THREE.Vector3();
  const quaternion=new THREE.Quaternion();
  function animate(now){
    requestAnimationFrame(animate);
    const dt=Math.min(.05,(now-last)/1000);last=now;
    if(!visible||document.hidden)return;
    if(mode==='orbit'&&!drag&&(!motion.matches||engaged)) wantedYaw+=dt*.31;
    const speed=motion.matches?1:1-Math.exp(-dt*6.4);
    yaw=THREE.MathUtils.lerp(yaw,wantedYaw,speed);pitch=THREE.MathUtils.lerp(pitch,wantedPitch,speed);
    const introSpread=mode==='orbit'&&!engaged&&!motion.matches? .37*Math.pow(Math.max(0,1-(now-origin)/2250),2):0;
    spread=THREE.MathUtils.lerp(spread,mode==='explode'?1:introSpread,speed);
    phone.rotation.set(pitch,yaw,-.17);
    phone.position.y=mode==='orbit'&&!motion.matches?Math.sin(now*.0011)*.09:0;
    front.position.set(-spread*.38,spread*.07,.178+spread*.7);
    rear.position.set(spread*.38,-spread*.07,-.166-spread*.66);
    tint.opacity=.060+spread*.26;
    display.visible=spread<.62;
    boardGroup.visible=spread>.07;
    renderer.render(scene,camera);
    const activeLens=mode==='front'?frontLens:mode==='rear'?rearLens:null;
    if(activeLens){
      activeLens.getWorldQuaternion(quaternion);facing.set(0,0,1).applyQuaternion(quaternion);
      label.hidden=facing.z<.29;
      if(!label.hidden){activeLens.getWorldPosition(projected).project(camera);label.style.left=`${(projected.x*.5+.5)*100}%`;label.style.top=`${(-projected.y*.5+.5)*100}%`;label.textContent=localizedLabel();}
    }else {label.hidden=true;}
  }
  if(motion.matches){yaw=views.rear.yaw;wantedYaw=yaw;pitch=views.rear.pitch;wantedPitch=pitch;hint.hidden=true;}
  setFinish('red');resize();onChange(mode);requestAnimationFrame(animate);
  return { select, setFinish, snapshot:()=>renderer.domElement.toDataURL('image/png') };
}

export { makePhone, makeStudio, softShadow };
