import { getDeviceWords } from './device-words.js';
import { renderRevenue } from './revenue.js';
import { renderEditorial } from './editorial.js';
import { actualUsdCents, denominations, goalUsdCents, reached } from './cash-values.js';
import { defaultLocale, locales, resolveLocale } from './locales.mjs';
import { getCopy } from './copy.js';
import { showcasePath } from './locales.mjs';

let language = defaultLocale;
let view = 'front';
let device = 'all';
let folded = false;
let supported = true;
let finish = 'red';
let pigMode = 'current';
let pigSpins = false;
const controls = document.querySelector('#view-controls');
const hint = document.querySelector('#scene-hint');
const stage = document.querySelector('#phone-stage');
const state = document.querySelector('#view-state');
const finishControls=document.querySelector('#finish-controls');
const devices=document.querySelector('#device-controls');
const options=document.querySelector('#device-options');
const fold=document.querySelector('#device-fold');
const pigControls=document.querySelector('#pig-controls');
const pigStage=document.querySelector('#pig-stage');
const pigState=document.querySelector('#pig-state');
const pigPlay=document.querySelector('#pig-play');
const pigSpin=document.querySelector('#pig-spin');
const pigReset=document.querySelector('#pig-reset');
const pigGoal=document.querySelector('#pig-full');
const pigWithdraw=document.querySelector('#pig-withdraw');
const pigDenoms=document.querySelector('#pig-denominations');

function cashMix(list){
  const grouped=new Map();
  for(const value of list) grouped.set(value,(grouped.get(value)||0)+1);
  return [...grouped].sort(([a],[b])=>b-a).map(([value,count])=>`${value<100?value+'¢':'$'+value/100} × ${count}`).join(' · ');
}
const actualMix=cashMix(denominations(actualUsdCents,reached));
const goalMix=cashMix(denominations(goalUsdCents,true));
const monthly = document.querySelector('#monthly-dialog');
const languageSelector = document.querySelector('#language');
const viewMessages = {orbit:'statusOrbit',front:'statusFront',rear:'statusRear',explode:'statusExplode',manual:'statusManual'};
const interfaceCopy = () => getCopy(language).ui;

function legacyLink(link,url) {
  const legacy=locales[language].legacy;
  link.href='https://www.madecappy.com/dualcam/'+url(legacy);
  link.hreflang={zh:'zh-Hans',en:'en',th:'th'}[legacy];
}

function setView(mode) {
  view=mode;
  stage.dataset.view=mode;
  for(const button of controls.querySelectorAll('button')) button.setAttribute('aria-pressed',String(button.dataset.view===mode));
  state.textContent=supported?interfaceCopy()[viewMessages[mode]]:'';
}

function updateFinish(value){
  finish=value;
  const strings=interfaceCopy();
  stage.dataset.finish=finish;
  for(const button of finishControls.querySelectorAll('button')){
    button.setAttribute('aria-pressed',String(button.dataset.finish===finish));
    button.setAttribute('aria-label',strings[button.dataset.finish]);
  }
}
function updatePig(mode,spinning){
  pigMode=mode;pigSpins=spinning;
  const strings=interfaceCopy();
  const labels=getCopy(language).cash;
  pigStage.dataset.mode=mode;
  pigState.textContent=labels[mode];
  document.querySelector('#pig-play-label').textContent=labels[mode==='deposit'?'busy':'play'];
  document.querySelector('#pig-spin-label').textContent=strings[spinning?'pigStop':'pigSpin'];
  pigSpin.setAttribute('aria-pressed',String(spinning));
  const busy=mode==='deposit'||mode==='withdraw';
  pigPlay.disabled=busy||!actualMix;
  pigGoal.disabled=busy;
  pigGoal.hidden=!goalMix;
  pigGoal.textContent=labels.full;
  pigReset.hidden=!['goal','withdrawn'].includes(mode);
  pigReset.textContent=labels.reset;
  pigWithdraw.hidden=!reached||mode!=='current';
  pigWithdraw.textContent=labels.take;
  pigDenoms.textContent=mode==='goal'?goalMix:['current','fallback'].includes(mode)?actualMix:'';
  pigDenoms.hidden=!pigDenoms.textContent;
}

function setLanguage(value) {
  language=resolveLocale(value);
  const translation=interfaceCopy();
  document.documentElement.lang=language;
  document.documentElement.dir=locales[language].dir||'ltr';
  languageSelector.value=language;
  document.title=translation.title;
  document.querySelector('meta[name="description"]').content=translation.description;
  for(const element of document.querySelectorAll('[data-text]')) element.textContent=translation[element.dataset.text];
  languageSelector.setAttribute('aria-label',translation.language);
  controls.setAttribute('aria-label',translation.controls);
  const [all]=getDeviceWords(language);
  devices.setAttribute('aria-label',all);
  devices.querySelector('[data-device="all"]').textContent=all;
  updateDeviceControls();
  document.querySelector('.site-nav').setAttribute('aria-label',translation.navigation);
  document.querySelector('#film-player').setAttribute('aria-label',translation.videoLabel);
  document.querySelector('.close-dialog').setAttribute('aria-label',translation.close);
  legacyLink(document.querySelector('#release-link'),legacy=>legacy==='zh'?'releases/2.3/':`${legacy}/releases/2.3/`);
  for(const [key,slug] of [['record','record-front-back'],['layout','choose-a-layout']]){
    legacyLink(document.querySelector(`[data-guide="${key}"]`),legacy=>`${legacy}/guides/${slug}/`);
  }
  legacyLink(document.querySelector('[data-guide="duo"]'),legacy=>legacy==='zh'?'iphone-duo/':`${legacy}/iphone-duo/`);
  finishControls.setAttribute('aria-label',translation.finish);
  pigControls.setAttribute('aria-label',translation.pigControlLabel);
  pigStage.setAttribute('aria-label',translation.pigLabel);
  renderRevenue(language);
  renderEditorial(language);
  updateFinish(finish);
  updatePig(pigMode,pigSpins);
  setView(view);
  if(!supported) hint.textContent=translation.fallback;
}

function updateDeviceControls(){
  stage.dataset.device=device;
  stage.dataset.folded=String(folded);
  options.hidden=!supported||device==='all';
  finishControls.hidden=device!=='iphone';
  fold.hidden=device!=='duo';
  controls.querySelector('[data-view="explode"]').hidden=device!=='iphone';
  controls.querySelector('[data-view="rear"]').hidden=device==='duo'&&folded;
  const words=getDeviceWords(language);
  fold.textContent=words[folded?2:1];
  fold.setAttribute('aria-pressed',String(folded));
  for(const button of devices.querySelectorAll('button')){
    button.setAttribute('aria-pressed',String(button.dataset.device===device));
  }
}

function useLineupFallback(){
  stage.dataset.renderer='fallback';
  supported=false;options.hidden=true;hint.hidden=true;stage.removeAttribute('tabindex');
  for(const button of devices.querySelectorAll('button')) button.disabled=true;
}

async function loadLineup(){
  try {
    const {makeDeviceLineup}=await import('./device-lineup.js');
    const model=await makeDeviceLineup(stage,stage.dataset.media,setView);
    stage.dataset.renderer='webgl';
    stage.tabIndex=0;
    hint.hidden=false;
    for(const button of devices.querySelectorAll('button')) button.disabled=false;
    devices.addEventListener('click',event=>{
      const button=event.target.closest('button[data-device]');
      if(!supported||!button) return;
      device=button.dataset.device;folded=false;
      model.selectDevice(device);
      updateDeviceControls();
    });
    finishControls.addEventListener('click',event=>{
      const button=event.target.closest('button[data-finish]');
      if(supported&&button){model.setFinish(button.dataset.finish);updateFinish(button.dataset.finish);}
    });
    controls.addEventListener('click',event=>{
      const button=event.target.closest('button[data-view]');
      if(supported&&button) model.selectView(button.dataset.view);
    });
    fold.addEventListener('click',()=>{
      if(!supported)return;
      folded=!folded;
      model.setFold(folded);
      updateDeviceControls();
    });
    stage.addEventListener('lineupfallback',useLineupFallback);
    window.dualcamPreview = {...window.dualcamPreview,phoneSnapshot:model.snapshot};
  }catch(error){
    console.warn('3D device lineup is unavailable.',error);
    useLineupFallback();
  }
}

loadLineup();

const jarTarget=document.querySelector('#jar-render');
const jarObserver=new IntersectionObserver(async(entries,observer)=>{
  if(!entries.at(-1).isIntersecting)return;
  observer.disconnect();
  try {
    const {makePig}=await import('./pig.js');
    const pig=makePig(jarTarget,updatePig);
    jarTarget.querySelector('img')?.remove();
    pigControls.hidden=false;
    pigPlay.addEventListener('click',pig.play);
    pigGoal.addEventListener('click',pig.showGoal);
    pigSpin.addEventListener('click',pig.toggleSpin);
    pigReset.addEventListener('click',pig.showActual);
    pigWithdraw.addEventListener('click',pig.withdraw);
    window.dualcamPreview = {...window.dualcamPreview,jarSnapshot:pig.snapshot};
  } catch(error){
    console.warn('3D jar is unavailable.',error);
    const image=new Image();image.src='/dualcam/showcase/jar-still.webp';image.alt='';jarTarget.replaceChildren(image);
    updatePig('fallback',false);
    document.querySelector('.pig-hint').hidden=true;
  }
},{rootMargin:'200px'});
jarObserver.observe(jarTarget);

setLanguage(new URLSearchParams(location.search).get('lang')||document.documentElement.lang);
languageSelector.addEventListener('change',event=>{
  const url=new URL(location.href);
  url.pathname=showcasePath(resolveLocale(event.target.value));
  url.searchParams.delete('lang');
  location.assign(url);
});
document.querySelector('#open-monthly').addEventListener('click',()=>monthly.showModal());
monthly.addEventListener('click',event=>{if(event.target===monthly)monthly.close();});
