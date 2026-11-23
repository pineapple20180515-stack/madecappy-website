import * as THREE from 'three';
import { buildPhone, makeStudio, softShadow } from './model.js';
import { buildPad, buildDuo, canvasSurface, drawCamera, loadCapturePhotos } from './devices.js';
import { startDeviceMotion } from './device-motion.js';

const rest = {
  iphone:{x:-3.12,y:-.11,z:.55,yaw:.21,pitch:-.09,roll:-.083,scale:.55},
  ipad:{x:-.27,y:.20,z:-.28,yaw:.08,pitch:-.12,roll:-.025,scale:1},
  duo:{x:2.96,y:-.14,z:.6,yaw:-.25,pitch:-.09,roll:.07,scale:.91},
};
const compact = {
  iphone:{x:-1.68,y:-.43,z:.67,yaw:.24,pitch:-.08,roll:-.095,scale:.48},
  ipad:{x:-.08,y:.59,z:-.55,yaw:.08,pitch:-.06,roll:-.035,scale:1},
  duo:{x:1.28,y:-.5,z:.72,yaw:-.20,pitch:-.055,roll:.07,scale:.82},
};
const focusScale={iphone:.82,ipad:1.27,duo:1.24};
const mouseYaw=(view,angle)=>view==='front'?.04:view==='rear'?Math.PI-.22:view==='explode'?-.67:angle;

export async function makeDeviceLineup(host,media,onView) {
  const target=host.querySelector('#phone-render');
  const photos=await loadCapturePhotos(media);
  const screens=[canvasSurface(360,740),canvasSurface(690,460),canvasSurface(580,490),canvasSurface(350,620)];
  screens.forEach((screen,i)=>drawCamera(screen,photos,[1,2].includes(i)?'side':'inset'));
  const phone=buildPhone(screens[0].texture);
  const pad=buildPad(screens[1].material);
  const duo=buildDuo(screens[2].material,screens[3].material);
  const {scene,camera,renderer,resize}=makeStudio(target,{fov:42,distance:7.2,fit:aspect=>aspect<1.35?8.9:13.4});
  scene.add(phone.group,pad,duo.group);
  softShadow(scene,7.6,1.40,0,-1.72);
  const devices={iphone:phone.group, ipad:pad, duo:duo.group};
  let selected='all',view='front',turn=0,pitch=0,amount=0,spread=0,folded=false;
  let drag;
  function pose(device) {
    const layout=camera.aspect<1.35?compact:rest;
    const p=layout[device], inspecting=selected===device, groupView=selected==='all';
    if(groupView)return {...p,yaw:p.yaw+turn,pitch:p.pitch+pitch};
    const offscreen=p.x<0?-1:1;
    if(!inspecting)return {...p,x:offscreen*(8.9+Math.abs(p.x)*.35),scale:p.scale*.6,z:-.4};
    const folding=selected==='duo'&&folded;
    return {x:0,y:0,z:.30,yaw:folding?-1.54+(view==='orbit'||view==='manual'?turn:0):mouseYaw(view,turn),
      pitch:-.065+pitch,roll:folding?.025:0,scale:focusScale[device]};
  }
  function paintPose(now,dt,reduced,instant=false){
    const t=instant||reduced?1:1-Math.exp(-dt*8.8);
    if(view==='orbit'&&!drag&&!reduced) turn+=dt*.73;
    for(const [name,group] of Object.entries(devices)){
      const p=pose(name);
      group.position.x=THREE.MathUtils.lerp(group.position.x,p.x,t);
      group.position.y=THREE.MathUtils.lerp(group.position.y,p.y,t);
      group.position.z=THREE.MathUtils.lerp(group.position.z,p.z,t);
      group.rotation.x=THREE.MathUtils.lerp(group.rotation.x,p.pitch,t);
      const angle=THREE.MathUtils.euclideanModulo(p.yaw-group.rotation.y+Math.PI,Math.PI*2)-Math.PI;
      group.rotation.y+=angle*t;
      group.rotation.z=THREE.MathUtils.lerp(group.rotation.z,p.roll,t);
      group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x,p.scale,t));
    }
    amount=THREE.MathUtils.lerp(amount,folded?1:0,t);
    spread=THREE.MathUtils.lerp(spread,view==='explode'?1:0,t);
    duo.setFold(amount);
    phone.setSpread(spread);
    renderer.render(scene,camera);
    return view==='orbit';
  }
  const motion=startDeviceMotion(target,paintPose);
  resize();
  paintPose(0,0,false,true);
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    Object.values(devices).forEach((group,i)=>{
      group.position.y-=.21+i*.10;
      group.position.z-=.15;
      group.rotation.y+=i===2?-.16:.14;
    });
    renderer.render(scene,camera);
    motion.wake(1050);
  }

  function selectDevice(key){
    selected=key;view='front';turn=0;pitch=0;folded=false;
    onView(view);
    motion.wake();
  }
  function selectView(next) {
    const current=devices[selected];
    turn=current?.rotation.y??0;
    view=next;
    pitch=0;
    if(folded)turn+=1.54;
    onView(view);
    motion.wake();
  }
  function setFold(next) {
    folded=next;
    view='front';turn=0;pitch=0;
    onView(view);
    motion.wake(990);
  }
  function spin(dx,dy) {
    if(view!=='manual'){
      view='manual';
      turn=selected==='all'?turn:(devices[selected].rotation.y+(folded?1.54:0));
      onView(view);
    }
    turn+=dx*.009;
    pitch=THREE.MathUtils.clamp(pitch+dy*.005,-.52,.50);
    motion.wake();
  }
  host.addEventListener('pointerdown',event=>{
    if(!event.isPrimary||event.button!==0)return;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY};
    host.setPointerCapture(event.pointerId);
  });
  host.addEventListener('pointermove',event=>{
    if(event.pointerId!==drag?.id)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(!host.hasAttribute('data-dragging')&&Math.hypot(dx,dy)<4)return;
    host.dataset.dragging='';
    drag.x=event.clientX;drag.y=event.clientY;
    spin(dx,dy);
  });
  function finishDrag(event){
    if(event.pointerId!==drag?.id)return;
    drag=undefined;delete host.dataset.dragging;
  }
  host.addEventListener('pointerup',finishDrag);
  host.addEventListener('pointercancel',finishDrag);
  host.addEventListener('keydown',event=>{
    if(['ArrowLeft','ArrowRight'].includes(event.key)){
      event.preventDefault();
      spin(event.key==='ArrowRight'?26:-26,0);
    }
  });
  renderer.domElement.addEventListener('webglcontextlost',()=>{
    motion.dispose();
    host.dataset.renderer='fallback';
    host.dispatchEvent(new Event('lineupfallback'));
  },{once:true});
  return {selectDevice,selectView,setFold,setFinish(value){phone.setFinish(value);motion.wake();},
    snapshot:()=>renderer.domElement.toDataURL('image/png')};
}
