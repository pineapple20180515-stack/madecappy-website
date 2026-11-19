import * as THREE from 'three';
import { makeStudio, softShadow } from './model.js';
import { makeCash } from './cash.js';
import { makeLittleWhite, chamber } from './little-white.js';
import { denominations, actualUsdCents, goalUsdCents, reached } from './cash-values.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');


function makePig(target,onChange){
  const {scene,camera,renderer,resize}=makeStudio(target,{fov:32,distance:7.0,fit:11.35});
  renderer.toneMappingExposure=1.08;
  softShadow(scene,7.2,.61,-.11,-1.85);
  const pig=makeLittleWhite();
  pig.position.set(-.035,-.13,0);
  scene.add(pig);
  const cash=makeCash(pig,chamber);
  const surface=target.parentElement;
  const actual=denominations(actualUsdCents,reached);
  const goal=denominations(goalUsdCents,true);
  let status='current';
  let isSpinning=false;
  let yaw=-.52,wantedYaw=yaw,pitch=.22,wantedPitch=pitch;
  let last=performance.now(),elapsed=0,next=0;
  let drag=null,needsPaint=true;
  const notify=()=>onChange(status,isSpinning);
  const interval=Math.max(.06,Math.min(.29,2.65/Math.max(actual.length,1)));

  function updateTotal(){
    surface.dataset.cashCents=String(cash.items.reduce((sum,item)=>sum+item.cents,0));
    surface.dataset.deposited=String(cash.items.length);
  }
  function setStatus(nextStatus){
    status=nextStatus;
    elapsed=0;next=0;needsPaint=true;
    updateTotal();notify();
  }
  function showActual(){cash.settled(actual);setStatus('current');}
  function showGoal(){cash.settled(goal);setStatus('goal');}
  function start(){
    if(reducedMotion.matches&&!isSpinning){showActual();return;}
    cash.clear();wantedYaw=-.52;wantedPitch=.22;setStatus('deposit');
  }
  function withdraw(){
    if(!reached||status!=='current')return;
    if(reducedMotion.matches){cash.clear();setStatus('withdrawn');return;}
    setStatus('withdraw');
  }
  function toggleSpin(){isSpinning=!isSpinning;drag=null;needsPaint=true;notify();}
  surface.addEventListener('pointerdown',event=>{
    if(!event.isPrimary||event.button!==0)return;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,yaw,pitch,moved:false};surface.setPointerCapture(event.pointerId);
  });
  surface.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(!drag.moved&&Math.hypot(dx,dy)<4)return;
    if(!drag.moved){drag.moved=true;surface.dataset.dragging='true';if(isSpinning){isSpinning=false;notify();}}
    wantedYaw=drag.yaw+dx*.012;wantedPitch=THREE.MathUtils.clamp(drag.pitch+dy*.008,-.86,.64);needsPaint=true;
  });
  function endDrag(event){if(drag?.id===event.pointerId){drag=null;delete surface.dataset.dragging;}}
  surface.addEventListener('pointerup',endDrag);surface.addEventListener('pointercancel',endDrag);
  surface.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();
    if(event.key==='ArrowLeft'||event.key==='ArrowRight') wantedYaw+= event.key==='ArrowLeft'?-.27:.27;
    else wantedPitch=THREE.MathUtils.clamp(wantedPitch+(event.key==='ArrowUp'?-.22:.22),-.86,.64);
    isSpinning=false;needsPaint=true;notify();
  });
  surface.tabIndex=0;

  function tick(now){
    requestAnimationFrame(tick);
    const delta=Math.min(.06,(now-last)/1000);last=now;
    if(document.hidden)return;
    if(status==='deposit'){
      elapsed+=delta;
      if(next<actual.length && elapsed>=next*interval){
        cash.add(actual[next],next,true);next++;updateTotal();
      }
      cash.step(delta);needsPaint=true;
      if(elapsed>actual.length*interval+1.65)setStatus('current');
    }
    if(status==='withdraw'){
      elapsed+=delta;
      const gap=Math.max(.018,1.5/Math.max(1,actual.length));
      while(next<actual.length&&elapsed>=next*gap)cash.fling(next++);
      cash.step(delta);needsPaint=true;
      if(elapsed>actual.length*gap+1.1){cash.clear();setStatus('withdrawn');}
    }
    if(isSpinning&&!drag){
      const bounds=surface.getBoundingClientRect();
      if(bounds.bottom>0&&bounds.top<innerHeight){wantedYaw+=delta*.49;needsPaint=true;}
    }
    const moving=Math.abs(yaw-wantedYaw)+Math.abs(pitch-wantedPitch)>.0015;
    if(!needsPaint&&!moving)return;
    const t=reducedMotion.matches&&!isSpinning?1:1-Math.exp(-delta*9);
    yaw=THREE.MathUtils.lerp(yaw,wantedYaw,t);pitch=THREE.MathUtils.lerp(pitch,wantedPitch,t);
    pig.rotation.set(pitch,yaw,0);
    renderer.render(scene,camera);needsPaint=false;
  }
  showActual();resize();requestAnimationFrame(tick);
  return {play:start,showGoal,showActual,withdraw,toggleSpin,snapshot:()=>renderer.domElement.toDataURL('image/png')};
}

export { makePig };
