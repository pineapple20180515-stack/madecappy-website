import * as THREE from 'three';
import { World, Body, Box, Cylinder, Plane, Vec3, Quaternion } from 'cannon-es';

const tau = Math.PI*2;
const billGeometry = new THREE.BoxGeometry(.87,.062,.38);
const coinGeometry = new THREE.CylinderGeometry(.105,.105,.047,28);
const paper = new THREE.MeshStandardMaterial({color:0xb5b69f,roughness:.93});
const materials = new Map();
const colorByDenom = new Map([[10000,'#b4c4c5'],[5000,'#d2c0b5'],[2000,'#b8c5a7'],[1000,'#d3bda0'],[500,'#c7bcd0'],[200,'#d5cbb1'],[100,'#c4c6aa']]);

function noteMaterial(cents) {
  const canvas=document.createElement('canvas');
  canvas.width=512;canvas.height=224;
  const g=canvas.getContext('2d');
  g.fillStyle=colorByDenom.get(cents)||'#c8c4aa';g.fillRect(0,0,512,224);
  g.strokeStyle='#3f4a40';g.lineWidth=3;g.strokeRect(10,10,492,204);
  g.lineWidth=1;g.strokeRect(18,18,476,188);
  for(let i=0;i<8;i++){
    g.strokeStyle=i%2?'#596354':'#73796a';
    g.beginPath();g.ellipse(256,112,202-i*6,94-i*5,i%2?.08:-.08,0,tau);g.stroke();
  }
  g.fillStyle='#424c43';g.beginPath();g.ellipse(256,112,63,76,0,0,tau);g.fill();
  g.fillStyle='#d9d6bd';g.beginPath();g.ellipse(256,112,54,67,0,0,tau);g.fill();
  g.fillStyle='#3f4a42';g.textAlign='center';g.textBaseline='middle';
  g.font='bold 61px Georgia';g.fillText('$',256,115);
  g.font='bold 70px Georgia';g.fillText(cents/100,100,104);g.fillText(cents/100,412,124);
  g.font='bold 17px Georgia';g.fillText('USD',99,166);g.fillText('USD',415,64);
  if(cents===10000){g.fillStyle='#668ca2';g.globalAlpha=.72;g.fillRect(331,13,16,198);}
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
  return new THREE.MeshBasicMaterial({map:tex,toneMapped:false});
}

function coinMaterial(cents) {
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;
  const g=canvas.getContext('2d');
  g.fillStyle=cents===1?'#c08d6e':'#cfd1d8';g.fillRect(0,0,128,128);
  g.strokeStyle='#777880';
  for(const radius of [48,56]){g.beginPath();g.arc(64,64,radius,0,tau);g.stroke();}
  g.fillStyle='#55555d';g.font='bold 36px Georgia';g.textAlign='center';g.textBaseline='middle';g.fillText(cents+'¢',64,65);
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
  const metal=new THREE.MeshStandardMaterial({color:cents===1?0xbc886e:0xcbd0dc,metalness:.62,roughness:.32});
  const face=new THREE.MeshStandardMaterial({map:tex,metalness:.36,roughness:.38});
  return [metal,face,face];
}

function getMaterial(cents) {
  if(!materials.has(cents)){
    if(cents<100) materials.set(cents,coinMaterial(cents));
    else {
      const note=noteMaterial(cents);
      materials.set(cents,[paper,paper,note,note,paper,paper]);
    }
  }
  return materials.get(cents);
}

export function makeCash(parent,{floorY:floor,centerX:center,halfWidth,halfDepth,ceilingY,slotX,slotY}) {
  const world=new World({gravity:new Vec3(0,-12,0),allowSleep:true});
  world.defaultContactMaterial.friction=.46;
  world.defaultContactMaterial.restitution=.08;
  world.solver.iterations=13;
  const items=[];
  function plane(x,y,z,nx,ny,nz){
    const normal=new Vec3(nx,ny,nz);normal.normalize();
    const orientation=new Quaternion();orientation.setFromVectors(new Vec3(0,0,1),normal);
    const body=new Body({mass:0,shape:new Plane(),position:new Vec3(x,y,z),quaternion:orientation});
    world.addBody(body);
    return body;
  }
  plane(center,floor,0,0,1,0);
  // Tangent planes keep the bills inside the curved belly.
  for(let i=0;i<12;i++){
    const angle=i*tau/12,c=Math.cos(angle),s=Math.sin(angle);
    const x=center+halfWidth*c,z=halfDepth*s;
    plane(x,0,z,-c/halfWidth,0,-s/halfDepth);
    plane(center+(halfWidth-.32)*c,floor,(halfDepth-.22)*s,-c/halfWidth,1.16,-s/halfDepth);
  }
  function add(cents,index,drop) {
    const coin=cents<100;
    const chip=new THREE.Mesh(coin?coinGeometry:billGeometry,getMaterial(cents));
    const angle=index*2.39996;
    const shape=coin?new Cylinder(.105,.105,.047,12):new Box(new Vec3(.435,.031,.19));
    const body=new Body({
      mass:coin?.10:.072,shape,linearDamping:.3,angularDamping:.50,
      position:new Vec3(drop?slotX:center+.83*Math.cos(angle),drop?slotY+.44:.56+(index%6)*.14,drop?0:.35*Math.sin(angle)),
      sleepSpeedLimit:.12,sleepTimeLimit:.44
    });
    body.quaternion.setFromEuler(drop?Math.PI/2:.25*Math.sin(angle),drop?0:angle,drop?0:.13);
    if(!drop){
      body.velocity.x=.51*Math.cos(angle);body.velocity.z=.48*Math.sin(angle);body.angularVelocity.y=.8*Math.sin(angle);
    }
    world.addBody(body);parent.add(chip);
    items.push({chip,body,cents,angle,atSlot:drop});
  }
  function paint(){
    for(const {chip,body} of items){chip.position.copy(body.position);chip.quaternion.copy(body.quaternion);}
  }
  function clear(){
    for(const {chip,body} of items){parent.remove(chip);world.removeBody(body);}
    items.length=0;
  }
  function settled(list){
    clear();
    // The still poses settle inside the glass dome. The replay keeps the slot open.
    const roof=plane(center,ceilingY,0,0,-1,0);
    const shoulders=Array.from({length:12},(_,i)=>{
      const angle=i*tau/12,c=Math.cos(angle),s=Math.sin(angle);
      return plane(center+(halfWidth-.11)*c,.42,(halfDepth-.10)*s,-c/halfWidth,-.48,-s/halfDepth);
    });
    for(let i=0;i<list.length;i++){
      add(list[i],i,false);
      if(i%4===3) for(let j=0;j<14;j++) world.step(1/90);
    }
    for(let i=0;i<150;i++) world.step(1/90);
    world.removeBody(roof);
    for(const shoulder of shoulders) world.removeBody(shoulder);
    paint();
  }
  function fling(index) {
    const item=items[index];
    if(!item)return;
    item.body.collisionResponse=false;item.body.wakeUp();
    item.body.velocity.set(1.45,8.2,.35*Math.sin(index));
    item.body.angularVelocity.set(2.0,2.7,1.5);
  }
  function step(delta){
    world.step(1/90,delta,7);
    for(const item of items){
      const {body,angle}=item;
      if(item.atSlot&&body.position.y<slotY-.22){
        item.atSlot=false;
        body.velocity.x=.88*Math.cos(angle)-.25;
        body.velocity.z=.45*Math.sin(angle);
        body.angularVelocity.set(3.2*Math.cos(angle),1.5*Math.sin(angle),1.7*Math.cos(angle));
      }
    }
    paint();
    for(const {chip,body} of items) chip.visible=body.position.y>-2&&body.position.y<3.3;
  }
  return {items,add,clear,settled,step,fling};
}
