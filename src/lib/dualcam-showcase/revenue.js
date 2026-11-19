import { salesSnapshot } from './revenue-data.js';
import { actualCnyCents, goalCnyCents, projectedDate, reached } from './cash-values.js';
import { defaultLocale, locales } from './locales.mjs';
import { getCopy } from './copy.js';

const forecast=projectedDate();
const elements={
  proceeds:document.querySelector('#asc-proceeds'),
  cnyValue:document.querySelector('#asc-cny-value'),
  cnyTarget:document.querySelector('#asc-cny-target'),
  forecast:document.querySelector('#asc-forecast'),
  total:document.querySelector('#asc-total'),
  progress:document.querySelector('#asc-progress'),
  coverage:document.querySelector('#asc-coverage'),
  latest:document.querySelector('#asc-latest'),
  status:document.querySelector('#monthly-status'),
  results:document.querySelector('#monthly-results'),
  period:document.querySelector('#sales-period'),
  rows:document.querySelector('#monthly-rows'),
  views:[...document.querySelectorAll('[data-sales-view]')]
};

let language=defaultLocale;
let view='daily';
const money=(currency,value,fractionDigits=2)=>new Intl.NumberFormat(locales[language].format,{
  style:'currency',currency,currencyDisplay:currency==='USD'||currency==='CNY'?'narrowSymbol':'code',
  minimumFractionDigits:fractionDigits,maximumFractionDigits:fractionDigits
}).format(value);
const number=value=>new Intl.NumberFormat(locales[language].format).format(value);
const percentText=value=>new Intl.NumberFormat(locales[language].format,{style:'percent',maximumFractionDigits:2}).format(value/100);
const salesCopy = () => getCopy(language).sales;
function message(value,...args){
  if(typeof value==='function')return value(...args);
  if(locales[language].dir!=='rtl')return value.replace(/\{(\d+)\}/g,(_,index)=>args[index]);
  return value.replace(/\{(\d+)\}/g,(_,index)=>{
    const text=args[index];
    return `\u2068${/^\d{4}-\d\d-\d\d$/.test(text)?text.replaceAll('-','‑'):text}\u2069`;
  });
}

function amountText(row, strings) {
  if(row.downloads===null) return strings.missing;
  if(row.usdCents!==null) return money('USD',row.usdCents/100);
  return Object.entries(row.amounts || {}).map(([code,value])=>money(code,value/10000)).join(' · ')||'—';
}

function renderRows() {
  const strings=salesCopy();
  const isDaily=view==='daily';
  elements.period.textContent=isDaily?strings.dates:strings.months;
  for(const button of elements.views) button.setAttribute('aria-pressed',String(button.dataset.salesView===view));
  const entries=(isDaily?salesSnapshot?.days:salesSnapshot?.months)||[];
  const fragment=document.createDocumentFragment();
  for(const row of [...entries].reverse()) {
    const tr=document.createElement('tr');
    const period=tr.insertCell();
    period.textContent=isDaily?row.day:row.month;
    if(row.ongoing||row.reported<row.expected) {
      const small=document.createElement('small');
      small.textContent=row.reported<row.expected ? strings.partial : `${strings.ongoing} ${row.lastDay}`;
      period.append(small);
    }
    tr.insertCell().textContent=row.downloads===null?'—':number(row.downloads);
    tr.insertCell().textContent=amountText(row,strings);
    fragment.append(tr);
  }
  elements.rows.replaceChildren(fragment);
  elements.results.scrollTop=0;
}

export function renderRevenue(nextLanguage) {
  language=nextLanguage;
  const strings=salesCopy();
  for(const el of document.querySelectorAll('[data-sales-text]')) el.textContent=strings[el.dataset.salesText];
  const summary=salesSnapshot?.summary;
  const hasData=Boolean(summary?.reported);
  elements.results.hidden=!hasData;
  const fxDate=salesSnapshot?.fx?.date;
  elements.status.textContent=hasData?[strings.method,fxDate?message(strings.fx,fxDate):''].filter(Boolean).join(' '):strings.empty;
  elements.latest.hidden=!hasData;
  elements.proceeds.hidden=summary?.usdCents==null;
  elements.cnyValue.textContent=actualCnyCents===null?'—':money('CNY',actualCnyCents/100);
  elements.cnyTarget.textContent=`/ ${money('CNY',goalCnyCents/100,0)}`;
  elements.forecast.hidden=!reached&&!forecast;
  elements.forecast.textContent=reached?strings.reached:forecast?message(strings.forecast,forecast):'';
  const percent=Math.max(0,Math.min(100,(actualCnyCents||0)*100/goalCnyCents));
  elements.progress.style.setProperty('--goal-progress',`${percent}%`);
  elements.coverage.textContent=strings.empty;
  if(hasData) {
    const latest=salesSnapshot.days.at(-1);
    elements.total.textContent=summary.usdCents==null?'':money('USD',summary.usdCents/100);
    const range = summary.reported===summary.expected
      ? message(strings.coverage,salesSnapshot.start,salesSnapshot.end)
      : strings.partial;
    elements.coverage.textContent=actualCnyCents===null ? range : `${range} · ${percentText(percent)}`;
    elements.latest.textContent=message(strings.latest,latest.day,number(latest.downloads),amountText(latest,strings));
  }
  renderRows();
}

for(const button of elements.views) button.addEventListener('click',()=>{
  view=button.dataset.salesView;
  renderRows();
});
