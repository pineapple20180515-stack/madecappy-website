#!/usr/bin/env node
// 从 App Store Connect 拉销售数据，写入 src/data/stats/<slug>.json。
// 由 GitHub Action 每日定时运行；也可本地手动跑一次核对（推荐首次先本地验证）。
//
// 需要的环境变量：
//   ASC_ISSUER_ID      App Store Connect API 的 Issuer ID
//   ASC_KEY_ID         API Key ID
//   ASC_PRIVATE_KEY    .p8 私钥内容（整段，含 BEGIN/END；换行可用真实换行或 \n）
//   ASC_VENDOR_NUMBER  销售报告的 Vendor Number（在「付款和财务报告」里看）
//   APP_LAUNCH_DATE    起始统计日期，如 2026-05-29
//   STATS_SLUG         可选，默认 dualcam（对应 src/data/stats/<slug>.json）
//   RATING / RATING_COUNT  可选，手填评分（API 无干净的综合星级接口）
//
// 说明：下载量较可靠；收入跨币种时按「占比最大的币种」汇总并在 source 标注，付费数为 IAP 单数（近似）。
// 因此首次启用前请本地跑一遍，和 ASC 后台数字核对后再公开。

import crypto from 'node:crypto';
import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SLUG = process.env.STATS_SLUG || 'dualcam';
const OUT = path.join(__dirname, '..', 'src', 'data', 'stats', `${SLUG}.json`);

const ISSUER = need('ASC_ISSUER_ID');
const KEY_ID = need('ASC_KEY_ID');
const PRIVATE_KEY = need('ASC_PRIVATE_KEY').replace(/\\n/g, '\n');
const VENDOR = need('ASC_VENDOR_NUMBER');
const LAUNCH = need('APP_LAUNCH_DATE');

function need(name) {
  const v = process.env[name];
  if (!v) { console.error(`Missing env ${name}`); process.exit(1); }
  return v;
}

function b64url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function makeJWT() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'ES256', kid: KEY_ID, typ: 'JWT' };
  const payload = { iss: ISSUER, iat: now, exp: now + 1000, aud: 'appstoreconnect-v1' };
  const data = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  // dsaEncoding: 'ieee-p1363' 直接产出 JOSE 需要的 r||s 原始签名。
  const sig = crypto.sign('sha256', Buffer.from(data), { key: PRIVATE_KEY, dsaEncoding: 'ieee-p1363' });
  return `${data}.${b64url(sig)}`;
}

async function fetchDailyReport(token, dateStr) {
  const params = new URLSearchParams({
    'filter[frequency]': 'DAILY',
    'filter[reportType]': 'SALES',
    'filter[reportSubType]': 'SUMMARY',
    'filter[vendorNumber]': VENDOR,
    'filter[reportDate]': dateStr,
    'filter[version]': '1_0',
  });
  const res = await fetch(`https://api.appstoreconnect.apple.com/v1/salesReports?${params}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/a-gzip' },
  });
  if (res.status === 404) return null;                // 当天无数据
  if (!res.ok) { console.warn(`  ${dateStr}: HTTP ${res.status}`); return null; }
  const buf = Buffer.from(await res.arrayBuffer());
  return zlib.gunzipSync(buf).toString('utf8');
}

function eachDate(from, to) {
  const out = [];
  const d = new Date(from + 'T00:00:00Z');
  const end = new Date(to + 'T00:00:00Z');
  while (d <= end) { out.push(d.toISOString().slice(0, 10)); d.setUTCDate(d.getUTCDate() + 1); }
  return out;
}

function parseReport(tsv, acc) {
  const lines = tsv.split('\n').filter(Boolean);
  if (lines.length < 2) return;
  const cols = lines[0].split('\t');
  const idx = (name) => cols.indexOf(name);
  const iUnits = idx('Units');
  const iProceeds = idx('Developer Proceeds');
  const iType = idx('Product Type Identifier');
  const iCur = idx('Currency of Proceeds');
  for (let i = 1; i < lines.length; i++) {
    const r = lines[i].split('\t');
    const units = parseInt(r[iUnits] || '0', 10) || 0;
    const proceeds = parseFloat(r[iProceeds] || '0') || 0;
    const type = (r[iType] || '').trim();
    const cur = (r[iCur] || 'USD').trim();
    if (type.startsWith('1')) acc.downloads += units;       // 首次下载（含付费/免费 App）
    if (type.startsWith('IA') || type.startsWith('FI')) acc.paidUnits += units; // 内购单数（近似）
    if (proceeds > 0 && units > 0) {
      acc.revenueByCur[cur] = (acc.revenueByCur[cur] || 0) + proceeds * units;
    }
  }
}

(async () => {
  const token = makeJWT();
  const yesterday = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);
  const dates = eachDate(LAUNCH, yesterday);
  console.log(`Fetching ${dates.length} daily reports (${LAUNCH} → ${yesterday})…`);

  const acc = { downloads: 0, paidUnits: 0, revenueByCur: {} };
  for (const d of dates) {
    const tsv = await fetchDailyReport(token, d);
    if (tsv) parseReport(tsv, acc);
  }

  // 收入：取占比最大的币种汇总（多币种时仅近似）。
  const curEntries = Object.entries(acc.revenueByCur).sort((a, b) => b[1] - a[1]);
  const topCur = curEntries[0]?.[0] || 'USD';
  const revenue = curEntries.length ? Math.round(curEntries.reduce((s, [, v]) => s + v, 0)) : 0;
  const multiCur = curEntries.length > 1;

  const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  const out = {
    ...prev,
    downloads: acc.downloads,
    paidUsers: acc.paidUnits,
    revenue,
    currency: topCur,
    rating: process.env.RATING != null ? Number(process.env.RATING) : (prev.rating ?? null),
    ratingCount: process.env.RATING_COUNT != null ? Number(process.env.RATING_COUNT) : (prev.ratingCount ?? null),
    updatedAt: new Date().toISOString(),
    source: multiCur ? 'App Store Connect（收入按主要币种近似）' : 'App Store Connect',
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log('Wrote', OUT);
  console.log(out);
})().catch((e) => { console.error(e); process.exit(1); });
