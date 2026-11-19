// Keep only coarse public source names; never store a full referrer URL.
export const sources = new Set(['website','youtube','x','instagram','tiktok','facebook','creator','google','chatgpt','doubao']);
const hostSources = [['chatgpt.com','chatgpt'],['chat.openai.com','chatgpt'],['doubao.com','doubao'],['youtube.com','youtube'],['youtu.be','youtube'],['x.com','x'],['twitter.com','x'],['instagram.com','instagram'],['tiktok.com','tiktok'],['facebook.com','facebook'],['google.com','google']];
function normalize(value) {
  if (!value) return null;
  const lower=value.toLowerCase().replace(/^www\./,'');
  if (sources.has(lower)) return lower;
  return hostSources.find(([host])=>lower===host)?.[1] || null;
}
export function attributionFor(search,referrer,stored) {
  const params=new URLSearchParams(search);
  let source=normalize(params.get('utm_source'));
  if (!source && referrer) {
    try {
      const url=new URL(referrer);
      if (['https:','http:'].includes(url.protocol)) source=hostSources.find(([host])=>url.hostname===host || url.hostname.endsWith('.'+host))?.[1] || null;
    } catch {}
  }
  if (source) return {source,campaign:(params.get('utm_campaign')||'').replace(/[^a-z0-9_-]/gi,'').slice(0,60)};
  return stored && sources.has(stored.source) ? {source:stored.source,campaign:typeof stored.campaign==='string'?stored.campaign.replace(/[^a-z0-9_-]/gi,'').slice(0,60):''} : {source:'website',campaign:''};
}
