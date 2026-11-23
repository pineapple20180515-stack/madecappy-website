import * as THREE from 'three';
import {buildPhone,makeStudio,plate,paint,softShadow} from './model.js';
import {block,canvasSurface,clippedPhoto,drawCamera,drawCover,loadCapturePhotos,surface} from './devices.js';
import {startDeviceMotion} from './device-motion.js';

function postcard(screen,photos){
  const {ctx,width:w,height:h}=screen;
  block(ctx,'#f7e8c5',0,0,w,h);
  const border=w*.035;
  const inset=border*1.25;
  ctx.lineWidth=border/3;
  ctx.strokeStyle='#9c392b';
  ctx.setLineDash([border*.55,border*.38]);
  ctx.strokeRect(border*.58,border*.58,w-border*1.16,h-border*1.16);
  ctx.setLineDash([]);
  clippedPhoto(ctx,photos.scenery,inset,inset,w-2*inset,h*.61-inset,4,.52);
  const stampW=w*.245,stampH=h*.28;
  const x=w-stampW-inset*1.30,y=h*.659;
  block(ctx,'#fff8e6',x-inset*.25,y-inset*.25,stampW+inset*.5,stampH+inset*.5,3);
  drawCover(ctx,photos.portrait,x,y,stampW,stampH,.32);
  for (let i=0;i<3;i++) block(ctx,'#887064',inset*1.25,h*.77+i*border*.68,w*(.31-i*.027),Math.max(1,border*.078),2);
  screen.texture.needsUpdate=true;
}

function updatePhone(screen,photos,step,layout,length){
  if(step<2){
    drawCamera(screen,step===0?photos:{...photos,scenery:photos.friends,portrait:photos.scenery},step===0?'single':'inset');
    return;
  }
  const {ctx,width:w,height:h}=screen;
  block(ctx,'#101216',0,0,w,h);
  const x=12,y=51,ww=w-24,hh=h-162;
  if(step===3){
    const artwork=canvasSurface(430,325);
    postcard(artwork,photos);
    ctx.drawImage(artwork.ctx.canvas,x,y+(hh-ww*.756)*.47,ww,ww*.756);
    artwork.texture.dispose();artwork.material.dispose();
    screen.texture.needsUpdate=true;
    return;
  }
  if(layout==='stacked'){
    clippedPhoto(ctx,photos.scenery,x,y,ww,hh/2-2,5);
    clippedPhoto(ctx,photos.friends,x,y+hh/2+2,ww,hh/2-2,5,.27);
  }else if(layout==='side'){
    clippedPhoto(ctx,photos.scenery,x,y,ww/2-2,hh,5);
    clippedPhoto(ctx,photos.friends,x+ww/2+2,y,ww/2-2,hh,5,.25);
  }else{
    clippedPhoto(ctx,photos.scenery,x,y,ww,hh,5);
    const inset=ww*.35;
    block(ctx,'#f3f2e8',x+12,y+12,inset+4,inset+4,8);
    clippedPhoto(ctx,photos.portrait,x+14,y+14,inset,inset,6,.22);
  }
  const timelineY=h-96;
  const segment=(ww-15)/6;
  for(let i=0;i<6;i++){
    clippedPhoto(ctx,i%2?photos.friends:photos.scenery,x+i*(segment+3),timelineY,segment,45,3,.24);
  }
  const selected=ww*length/6;
  block(ctx,'#171819a0',x+selected,timelineY,ww-selected,45);
  ctx.strokeStyle='#ebbd63';ctx.lineWidth=2;ctx.strokeRect(x,timelineY,selected,45);
  for(const edge of [x,x+selected-3]) block(ctx,'#ebbd63',edge,timelineY,3,45,1);
  screen.texture.needsUpdate=true;
}

function photoCard(width,height,img) {
  const screen=canvasSurface(480,Math.round(480*height/width));
  drawCover(screen.ctx,img,0,0,screen.width,screen.height,.32);
  screen.texture.needsUpdate=true;
  const group=new THREE.Group();
  group.add(plate(width+.035,height+.035,.105,.036,paint(0x9e9386,.38,.25),.012));
  const panel=surface(width,height,.095,screen.material);
  panel.position.z=.034;
  group.add(panel);
  return group;
}

export async function makeReleaseStage(host,media){
  const target=host.querySelector('.capture-render');
  const photos=await loadCapturePhotos(media);
  const {scene,camera,renderer,resize}=makeStudio(target,{fov:38,distance:6.7,fit:8.5});
  const screen=canvasSurface(360,760);
  const phone=buildPhone(screen.texture);
  phone.setFinish('silver');
  phone.group.scale.setScalar(.63);
  const first=photoCard(2.24,1.38,photos.scenery);
  const second=photoCard(1.75,1.24,photos.portrait);
  const cardTexture=canvasSurface(540,410);
  postcard(cardTexture,photos);
  const finished=surface(2.47,1.86,.091,cardTexture.material);
  scene.add(first,second,finished,phone.group);
  softShadow(scene,5.3,1.52,0,-1.92);
  const poses=[
    [[-.77,0,.37,-.23,-.18],[.91,.34,-.82,-.16,-.06],[1.74,-.69,-.79,-.22,.12],[.9,.05,-1.4,.2,0]],
    [[-.93,0,.35,.19,-.08],[1.08,.55,-.7,-.17,-.11],[1.13,-.31,-.28,-.30,.10],[.9,.05,-1.4,.2,0]],
    [[-.81,0,.42,.045,-.11],[1.13,.63,-.68,-.20,-.06],[1.16,-.52,-.23,-.12,.10],[.9,.05,-1.4,.2,0]],
    [[-.93,-.05,.15,-.25,-.15],[.76,.48,-1.02,.10,.12],[1.09,-.11,-.70,-.14,-.05],[1.00,.01,.32,-.15,.09]],
  ];
  const items=[phone.group,first,second,finished];
  const scales=[.63,1,1,1];
  let state={step:0,layout:'stacked',length:6};
  let drift=0;
  let flashAt=-1000;
  const flash=new THREE.Mesh(new THREE.PlaneGeometry(1.51,3.45),new THREE.MeshBasicMaterial({
    color:0xffefcc,transparent:true,opacity:0,depthWrite:false,toneMapped:false,
  }));
  flash.position.z=.245/phone.group.scale.z;
  phone.group.add(flash);
  function render(now,dt,reduced,instant=false){
    const blend=reduced||instant?1:1-Math.exp(-dt*8.5);
    for(let i=0;i<items.length;i++){
      const group=items[i];
      const [x,y,z,yaw,roll]=poses[state.step][i];
      const reveal=i===2?state.step===1||state.step===2:i===3?state.step===3:i===1?state.step!==3:true;
      const wantedScale=reveal?scales[i]:.001;
      group.position.set(THREE.MathUtils.lerp(group.position.x,x,blend),THREE.MathUtils.lerp(group.position.y,y,blend),THREE.MathUtils.lerp(group.position.z,z,blend));
      group.rotation.y=THREE.MathUtils.lerp(group.rotation.y,yaw+drift,blend);
      group.rotation.z=THREE.MathUtils.lerp(group.rotation.z,roll,blend);
      group.rotation.x=THREE.MathUtils.lerp(group.rotation.x,-.07,blend);
      group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x,wantedScale,blend));
      group.visible=group.scale.x>.009;
    }
    flash.material.opacity=reduced?0:Math.max(0,1-(now-flashAt)/145)*.48;
    flash.visible=flash.material.opacity>0;
    renderer.render(scene,camera);
  }
  const motion=startDeviceMotion(target,render);
  updatePhone(screen,photos,0,'stacked',6);
  resize();render(performance.now(),0,false,true);
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    phone.group.position.y-=.19;
    phone.group.rotation.y-=.18;
    first.position.x+=.27;
    renderer.render(scene,camera);
    motion.wake();
  }
  let gesture;
  target.addEventListener('pointerdown',event=>{
    if(event.button!==0) return;
    gesture={id:event.pointerId,x:event.clientX,drift};
    target.setPointerCapture(event.pointerId);
  });
  target.addEventListener('pointermove',event=>{
    if(event.pointerId!==gesture?.id)return;
    drift=THREE.MathUtils.clamp(gesture.drift+(event.clientX-gesture.x)*.007,-.62,.62);
    motion.wake();
  });
  const end=event=>{if(event.pointerId===gesture?.id)gesture=undefined;};
  target.addEventListener('pointerup',end);target.addEventListener('pointercancel',end);
  renderer.domElement.addEventListener('webglcontextlost',()=>{
    motion.dispose();host.dataset.renderer='fallback';
    host.dispatchEvent(new Event('releasefallback'));
  },{once:true});
  return {update(step,layout,length){
    if(step!==state.step&&step<2) flashAt=performance.now();
    state={step,layout,length};
    updatePhone(screen,photos,step,layout,length);
    motion.wake(1000);
  }};
}
