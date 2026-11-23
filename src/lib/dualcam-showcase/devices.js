import * as THREE from 'three';
import {addLens,addMesh,paint,plate,roundedPath} from './model.js';

const dark=()=>paint(0x101317,.34,.36);

export function surface(width,height,corner,material) {
  const shape=roundedPath(new THREE.Shape(),width,height,corner);
  const geometry=new THREE.ShapeGeometry(shape,12);
  const positions=geometry.getAttribute('position');
  const uv=geometry.getAttribute('uv');
  for(let i=0;i<positions.count;i++) uv.setXY(i,positions.getX(i)/width+.5,positions.getY(i)/height+.5);
  return new THREE.Mesh(geometry,material);
}

function lensBump(parent,x,y,z) {
  const base=plate(.54,.61,.16,.07,paint(0x494d52,.27,.70),.016);
  base.position.set(x,y,z);
  parent.add(base);
  const metal=paint(0x9da7ad,.21,.8);
  addLens(parent,x-.10,y+.115,'rear',.105,z-.06,metal);
  addLens(parent,x+.103,y-.10,'rear',.105,z-.06,metal);
}

export function buildPad(material) {
  const group=new THREE.Group();
  const rail=plate(4.56,3.14,.23,.13,paint(0xb0b5be,.27,.82),.032);
  group.add(rail);
  const bezel=plate(4.49,3.07,.205,.037,dark(),.005);
  bezel.position.z=.08;
  group.add(bezel);
  const panel=surface(4.29,2.87,.143,material);
  panel.position.z=.104;
  group.add(panel);
  addLens(group,0,1.488,'front',.039,.099);
  lensBump(group,1.93,1.20,-.083);
  const key=plate(.38,.021,.009,.064,dark(),.004);
  key.position.set(-1.57,1.596,0);
  group.add(key);
  return group;
}

export function buildDuo(inner, cover) {
  const group=new THREE.Group();
  const chassis=paint(0x535b64,.29,.78);
  const hingeFinish=paint(0x949ca2,.24,.80);
  const bezel=dark();
  const width=1.77;
  const height=3.06;
  const halves=[-1,1].map((side,i)=>{
    const pivot=new THREE.Group();
    const part=new THREE.Group();
    part.position.x=side*(width/2+.014);
    pivot.add(part);
    group.add(pivot);
    part.add(plate(width,height,.169,.124,chassis,.025));
    const frame=plate(width-.037,height-.04,.152,.032,bezel,.008);
    frame.position.z=.07;
    part.add(frame);
    const panel=surface(width-.086,height-.092,.117,inner);
    const uv=panel.geometry.getAttribute('uv');
    for(let j=0;j<uv.count;j++) uv.setX(j,(uv.getX(j)+i)*.5);
    panel.position.z=.095;
    part.add(panel);
    if(i===0){
      lensBump(part,.46,1.16,-.082);
      addLens(part,.54,1.325,'front',.035,.097);
    }else{
      const rearGlass=plate(width-.066,height-.068,.142,.022,bezel,.005);
      rearGlass.position.z=-.083;
      part.add(rearGlass);
      const outer=surface(width-.13,height-.136,.115,cover);
      outer.rotation.y=Math.PI;
      outer.position.z=-.101;
      part.add(outer);
      addLens(part,0,1.352,'rear',.043,-.105);
    }
    return pivot;
  });
  const hinge=addMesh(group,new THREE.CylinderGeometry(.087,.087,3.025,18),hingeFinish,0,0,.008);
  const assembly=new THREE.Group();
  assembly.add(group);
  function setFold(amount) {
    const angle=.095+amount*1.423;
    halves[0].rotation.y=angle;
    halves[1].rotation.y=-angle;
    group.position.z=-.73*amount;
    hinge.position.z=-.024*amount;
  }
  setFold(0);
  return {group:assembly,setFold};
}

export function canvasSurface(width,height) {
  const canvas=document.createElement('canvas');
  canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d');
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=4;
  const material=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});
  return {ctx,texture,material,width,height};
}

export function drawCover(ctx,img,x,y,w,h,anchorY=.46) {
  const ratio=Math.max(w/img.width,h/img.height);
  const cropWidth=w/ratio,cropHeight=h/ratio;
  ctx.drawImage(img,(img.width-cropWidth)/2,(img.height-cropHeight)*anchorY,cropWidth,cropHeight,x,y,w,h);
}

export function block(ctx,fill,x,y,w,h,r=0) {
  ctx.fillStyle=fill;
  if(!r){ctx.fillRect(x,y,w,h);return;}
  ctx.beginPath();
  ctx.roundRect(x,y,w,h,r);
  ctx.fill();
}

export function clippedPhoto(ctx,img,x,y,w,h,r=0,anchorY) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x,y,w,h,r);
  ctx.clip();
  drawCover(ctx,img,x,y,w,h,anchorY);
  ctx.restore();
}

const loadImage=url=>new Promise((resolve,reject)=>{
  const image = new Image();
  image.onload=()=>resolve(image);
  image.onerror=()=>reject(Error(url));
  image.src=url;
});

export async function loadCapturePhotos(base) {
  const [scenery,portrait,friends]=await Promise.all([
    loadImage(base+'travel-rear.webp'),
    loadImage(base+'friends-front.webp'),
    loadImage(base+'friends-rear.webp'),
  ]);
  return {scenery,portrait,friends};
}

export function drawCamera(screen,photos,variant='inset') {
  const {ctx,width:w,height:h}=screen;
  const {scenery,portrait,friends}=photos;
  block(ctx,'#0b0c0e',0,0,w,h);
  const landscape=w>h;
  const margin=landscape?19:11;
  const area=landscape?{x:margin,y:margin,w:w-98,h:h-2*margin}:{x:margin,y:46,w:w-2*margin,h:h-153};
  const {x,y,w:ww,h:hh}=area;
  if(variant==='side'){
    drawCover(ctx,scenery,x,y,ww*.62-2,hh);
    drawCover(ctx,friends,x+ww*.62+2,y,ww*.38-2,hh,.27);
  }else{
    clippedPhoto(ctx,scenery,x,y,ww,hh,10,.48);
    if(variant==='inset') {
      const sw=ww*.295,sh=sw*.92;
      block(ctx,'#faf5e7',x+13,y+13,sw+4,sh+4,12);
      clippedPhoto(ctx,portrait,x+15,y+15,sw,sh,10,.32);
    }
  }
  const cx=landscape?w-36:w/2, cy=landscape?h/2:h-49;
  ctx.beginPath();ctx.arc(cx,cy,landscape?22:23,0,Math.PI*2);ctx.fillStyle='#f5f4ee';ctx.fill();
  ctx.beginPath();ctx.arc(cx,cy,landscape?26:27,0,Math.PI*2);ctx.strokeStyle='#f5f4ee';ctx.lineWidth=2;ctx.stroke();
  if(!landscape) block(ctx,'#ffffff9a',w*.36,h-12,w*.28,3,2);
  screen.texture.needsUpdate=true;
}
