import { salesSnapshot } from './revenue-data.js';

export const goalCnyCents = 1_000_000;
const summary = salesSnapshot?.summary;
const rate = salesSnapshot?.fx?.cnyPerUsd;
export const actualUsdCents = Number.isSafeInteger(summary?.usdCents) ? summary.usdCents : null;
export const actualCnyCents = actualUsdCents!==null && rate>0 ? Math.round(actualUsdCents*rate) : null;
export const goalUsdCents = rate>0 ? Math.ceil(goalCnyCents/rate) : null;
export const reached = actualCnyCents!==null && actualCnyCents>=goalCnyCents && summary.reported===summary.expected;

const notes = [10000,5000,2000,500,200,100];
const coins = [25,10,5,1];

// Use more small notes as the jar fills. Each element is one bill or coin.
export function denominations(cents, dense=false) {
  if (!Number.isSafeInteger(cents) || cents<=0) return [];
  const dollars=[];
  let remaining=cents;
  while (dense && remaining>=25000 && dollars.length<90) {
    const deposit = [10000,5000,2000,2000,1000,1000,500,500,500,200,200,100];
    dollars.push(...deposit);
    remaining-=deposit.reduce((sum,n)=>sum+n,0);
  }
  for(const face of [...notes,...coins]) {
    const count=Math.floor(remaining/face);
    dollars.push(...Array(count).fill(face));
    remaining-=count*face;
  }
  return dollars;
}

export function projectedDate() {
  if (actualCnyCents===null || reached || summary.reported!==summary.expected) return null;
  const days=salesSnapshot.days.slice(-30);
  if (days.length!==30 || days.some(day=>day.usdCents===null)) return null;
  const daily=days.reduce((sum,day)=>sum+day.usdCents,0)*rate/30;
  if (daily<=0) return null;
  const time=Date.parse(salesSnapshot.end)+Math.ceil((goalCnyCents-actualCnyCents)/daily)*86400000;
  return new Date(time).toISOString().slice(0,10);
}
