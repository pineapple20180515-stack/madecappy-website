import { APP_ID } from './apple-sales.mjs';

const ownAppTypes = new Set(['1','1E','1EP','1EU','1F','1T','F1']);
const toHundredths = value => {
  if (!/^-?(?:\d+\.?\d{0,2}|\.\d{1,2})$/.test(value || '')) throw new Error('Invalid numeric field in Apple summary');
  const result = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(result)) throw new Error('Apple summary number out of range');
  return result;
};

export function aggregate(data, day, skus) {
  const [year,month,date] = day.split('-');
  const reportDay = `${month}/${date}/${year}`;
  let downloadHundredths = 0;
  let partialRefund = false;
  const amounts = new Map();
  for (const row of data.rows) {
    const appRow = row[data.id] === APP_ID;
    if (!appRow && !skus.has(row[data.parent])) continue;
    if (row[data.date] !== reportDay) throw new Error(`Unexpected report date for ${day}`);
    const units = toHundredths(row[data.units]);
    const perUnit = toHundredths(row[data.unitProceeds]);
    if (appRow && ownAppTypes.has(row[data.type]) && units > 0) downloadHundredths += units;
    if (perUnit === 0) continue;
    if (units === 0) {
      partialRefund = true;
      continue;
    }
    const code = row[data.currency];
    if (!/^[A-Z]{3}$/.test(code || '')) throw new Error(`Missing proceeds currency for ${day}`);
    const amount = (amounts.get(code) || 0) + units * perUnit;
    if (!Number.isSafeInteger(amount)) throw new Error(`Proceeds out of range for ${day}`);
    amounts.set(code, amount);
  }
  return {day,downloads:downloadHundredths/100,currencyTenThousandths:Object.fromEntries([...amounts].filter(([,v])=>v!==0)),partialRefund};
}

export function ecbRates(xml) {
  const days = new Map();
  for (const [,day,entries] of xml.matchAll(/<Cube time=["'](\d{4}-\d\d-\d\d)["']>(.*?)<\/Cube>/gs)) {
    const pairs = [...entries.matchAll(/currency=["']([A-Z]{3})["']\s+rate=["']([\d.]+)["']/g)];
    days.set(day,new Map([['EUR',1],...pairs.map(([,currency,rate])=>[currency,Number(rate)])]));
  }
  if (!days.size) throw new Error('Invalid ECB historical rates');
  return days;
}

export function rateFromUSD(day, rates) {
  for (let offset=0;offset<=7;offset++) {
    const date = new Date(Date.parse(day)-offset*86400000).toISOString().slice(0,10);
    const entry = rates.get(date);
    if (entry?.get('CNY')>0 && entry.get('USD')>0) return {date,cnyPerUsd:entry.get('CNY')/entry.get('USD')};
  }
  return null;
}

export function toDollars(amounts, day, rates) {
  const pending = new Set();
  let usdTenThousandths = 0;
  for (const [currency,amount] of Object.entries(amounts)) {
    if (currency==='USD') {
      usdTenThousandths += amount;
      continue;
    }
    let found;
    for (let offset=0;offset<=7;offset++) {
      const date = new Date(Date.parse(day)-offset*86400000).toISOString().slice(0,10);
      const ratesForDay = rates.get(date);
      if (ratesForDay?.get(currency)>0 && ratesForDay?.get('USD')>0) {
        found = ratesForDay.get('USD')/ratesForDay.get(currency);
        break;
      }
    }
    if (found===undefined) pending.add(currency);
    else usdTenThousandths += amount*found;
  }
  return {usdCents:pending.size?null:Math.sign(usdTenThousandths)*Math.round(Math.abs(usdTenThousandths)/100),pending:[...pending]};
}
