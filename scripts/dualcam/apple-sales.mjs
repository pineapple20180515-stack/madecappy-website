import {readFile} from 'node:fs/promises';
import {createPrivateKey,sign} from 'node:crypto';
import {basename} from 'node:path';
import {gunzipSync} from 'node:zlib';

export const APP_ID='6774681432';
const origin='https://api.appstoreconnect.apple.com';
export async function createClient(){
  const {ASC_KEY_PATH:path,ASC_ISSUER_ID:issuer,ASC_VENDOR_NUMBER:vendor,ASC_PRIVATE_KEY:privateKey}=process.env;
  const id=process.env.ASC_KEY_ID||/^AuthKey_([A-Za-z0-9]+)\.p8$/.exec(basename(path||''))?.[1];
  if((!path&&!privateKey)||!issuer||!vendor||!id||!/^\d+$/.test(vendor))throw new Error('Missing App Store Connect report credentials');
  const key=createPrivateKey(privateKey ? privateKey.replaceAll('\\n','\n') : await readFile(path));
  function jwt(){
    const encode=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
    const now=Math.floor(Date.now()/1000);
    const message=`${encode({alg:'ES256',kid:id,typ:'JWT'})}.${encode({iss:issuer,iat:now,exp:now+300,aud:'appstoreconnect-v1'})}`;
    return `${message}.${sign('sha256',Buffer.from(message),{key,dsaEncoding:'ieee-p1363'}).toString('base64url')}`;
  }
  async function report(date){
    const url=new URL('/v1/salesReports',origin);
    url.search=new URLSearchParams({'filter[frequency]':'DAILY','filter[reportDate]':date,'filter[reportType]':'SALES','filter[reportSubType]':'SUMMARY','filter[vendorNumber]':vendor,'filter[version]':'1_0'});
    for(let attempt=0;attempt<3;attempt++){
      let response;
      try {
        response=await fetch(url,{redirect:'error',headers:{Authorization:`Bearer ${jwt()}`,Accept:'application/a-gzip'},signal:AbortSignal.timeout(22000)});
      } catch(error) {
        if(attempt===2)throw new Error(`${date}: could not reach Apple (${error.cause?.code||error.name})`);
        await new Promise(r=>setTimeout(r,(attempt+1)*1100));continue;
      }
      if(response.status===404)return null;
      if((response.status===429||response.status>=500)&&attempt<2){
        const wait=Number(response.headers.get('retry-after'))||2+2*attempt;
        await response.body?.cancel().catch(()=>{});
        await new Promise(r=>setTimeout(r,Math.min(wait,20)*1000));continue;
      }
      if(!response.ok){
        const result=await response.json().catch(()=>null);
        const code=result?.errors?.[0]?.code;
        throw new Error(`${date}: Apple HTTP ${response.status}${typeof code==='string'?` ${code}`:''}`);
      }
      const raw=Buffer.from(await response.arrayBuffer());
      return (raw[0]===0x1f&&raw[1]===0x8b?gunzipSync(raw):raw).toString('utf8');
    }
  }
  return {report};
}

const normalize=text=>text.replace(/[^A-Za-z0-9]/g,'').toLowerCase();
export function reportColumns(tsv){
  const lines=tsv.trimStart().split(/\r?\n/);
  const index=lines.findIndex(row=>row.split('\t').map(normalize).includes('appleidentifier'));
  if(index<0)throw new Error('Apple report is missing its expected header');
  const names=lines[index].split('\t').map(normalize);
  const col=(...options)=>{
    for(const option of options){const pos=names.indexOf(option);if(pos>=0)return pos;}
    throw new Error(`Apple report missing ${options[0]}`);
  };
  return {rows:lines.slice(index+1).filter(line=>line.trim()).map(line=>line.split('\t').map(field=>field.trim())),id:col('appleidentifier'),sku:col('sku'),parent:col('parentidentifier'),type:col('producttypeidentifier'),units:col('units'),unitProceeds:col('developerproceeds','developerproceedsperunit'),currency:col('currencyofproceeds'),date:col('begindate')};
}

export function targetSkus(data){
  return new Set(data.rows.filter(row=>row[data.id]===APP_ID&&!row[data.parent]&&/^(?:1|3|7|F1|F7)/.test(row[data.type]||'')).map(row=>row[data.sku]).filter(Boolean));
}
