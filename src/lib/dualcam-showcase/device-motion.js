export function startDeviceMotion(host,draw) {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,activeUntil=0,last=0;
  let visible=true;
  const schedule=()=>{
    if(!frame&&visible&&!document.hidden) frame=requestAnimationFrame(tick);
  };
  const tick=now=>{
    frame=0;
    const delta=last?Math.min((now-last)/1000,.05):.016;
    last=now;
    const keepGoing=draw(now,delta,reduced.matches);
    if((keepGoing||now<activeUntil)&&!reduced.matches) schedule();
  };
  function wake(ms=840) {
    activeUntil=performance.now()+ms;
    if(!frame) last=0;
    schedule();
  }
  const observer=new IntersectionObserver(([entry])=>{
    visible=entry.isIntersecting;
    if(visible) wake();
    else if(frame){cancelAnimationFrame(frame);frame=0;}
  },{rootMargin:'80px'});
  observer.observe(host);
  const refresh=()=>{if(!document.hidden) wake();};
  const resize=new ResizeObserver(refresh);
  resize.observe(host);
  reduced.addEventListener('change',refresh);
  document.addEventListener('visibilitychange',refresh);
  return {wake,dispose(){
    observer.disconnect();resize.disconnect();
    document.removeEventListener('visibilitychange',refresh);
    reduced.removeEventListener('change',refresh);
    if(frame) cancelAnimationFrame(frame);
  }};
}
