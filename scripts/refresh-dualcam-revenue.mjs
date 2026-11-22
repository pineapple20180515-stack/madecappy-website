import { rename, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { salesSnapshot } from '../src/lib/dualcam-showcase/revenue-data.js';
import { createClient, reportColumns, targetSkus } from './dualcam/apple-sales.mjs';
import { aggregate, ecbRates, rateFromUSD, toDollars } from './dualcam/sales-summary.mjs';

const destination = new URL('../src/lib/dualcam-showcase/revenue-data.js', import.meta.url);
const dayMs = 86_400_000;
const toDay = (time) => new Date(time).toISOString().slice(0, 10);
const californiaDay = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit'
});
const ecbUrl = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist.xml';

function summarize(days) {
  const reported = days.filter(day => day.usdCents !== null && day.downloads !== null);
  return {
    usdCents: reported.reduce((value, day) => value + day.usdCents, 0),
    downloads: reported.reduce((value, day) => value + day.downloads, 0),
    reported: reported.length,
    expected: days.length,
  };
}

function summarizeMonths(days) {
  const months = new Map();
  for (const day of days) {
    const month = day.day.slice(0, 7);
    if (!months.has(month)) months.set(month, []);
    months.get(month).push(day);
  }
  return [...months].map(([month, rows]) => {
    const lastDay = rows.at(-1).day;
    return {
      month, ...summarize(rows), lastDay,
      ongoing: lastDay === days.at(-1).day && toDay(Date.parse(lastDay) + dayMs).startsWith(month),
    };
  });
}

export async function refresh(snapshot, getReport, getRates, now = new Date()) {
  const yesterday = Date.parse(californiaDay.format(now)) - dayMs;
  const cutoff = Date.parse(snapshot.end);
  if (yesterday <= cutoff) return snapshot;

  const reports = new Map();
  const skus = new Set();
  // Reports include the account's apps. Discover DualCam's parent SKU from
  // rows carrying its Apple ID before attributing any in-app purchases.
  for (let time = Math.max(Date.parse(snapshot.start), cutoff - 6 * dayMs); time <= yesterday; time += dayMs) {
    const day = toDay(time);
    const report = await getReport(day);
    if (report === null) continue;
    const parsed = reportColumns(report);
    reports.set(day, parsed);
    for (const sku of targetSkus(parsed)) skus.add(sku);
  }

  if (!reports.has(toDay(cutoff + dayMs))) return snapshot;
  if (skus.size !== 1) throw new Error('Could not verify one DualCam SKU in Apple reports');
  const rates = await getRates();
  const additions = [];
  for (let time = cutoff + dayMs; time <= yesterday; time += dayMs) {
    const day = toDay(time);
    const report = reports.get(day);
    // Keep the public cutoff at the last consecutive day we can verify.
    if (!report) break;
    const { downloads, currencyTenThousandths, partialRefund } = aggregate(report, day, skus);
    const { usdCents } = toDollars(currencyTenThousandths, day, rates);
    if (partialRefund || usdCents === null) {
      throw new Error(`${day}: proceeds require verification before publishing`);
    }
    additions.push({ day, downloads, usdCents });
  }

  const end = additions.at(-1).day;
  const fx = rateFromUSD(end, rates);
  if (!fx) throw new Error(`${end}: no recent USD/CNY reference rate`);
  const days = [...snapshot.days, ...additions];
  return { start: snapshot.start, end, fx, summary: summarize(days), days, months: summarizeMonths(days) };
}

async function main() {
  const client = await createClient();
  const snapshot = await refresh(salesSnapshot, client.report, async () => {
    // The historical feed also covers weekends, holidays and days missed by a previous run.
    const response = await fetch(ecbUrl, { redirect: 'error', signal: AbortSignal.timeout(25_000) });
    if (!response.ok) throw new Error(`ECB HTTP ${response.status}`);
    return ecbRates(await response.text());
  });
  if (snapshot === salesSnapshot) {
    console.log(`No new complete Apple report. Website data remains current through ${snapshot.end}.`);
    return;
  }
  const temp = new URL(`./revenue-data.${process.pid}.tmp`, destination);
  await writeFile(temp, `export const salesSnapshot = ${JSON.stringify(snapshot)};\n`, { flag: 'wx' });
  await rename(temp, destination);
  console.log(`DualCam website snapshot updated through ${snapshot.end}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
