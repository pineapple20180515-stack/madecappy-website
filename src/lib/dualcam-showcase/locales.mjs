export const locales = {
  'zh-Hans': {name:'简体中文',base:'zh',legacy:'zh',format:'zh-CN'},
  'zh-Hant': {name:'繁體中文',legacy:'zh',format:'zh-TW'},
  'en-US': {name:'English (US)',base:'en',legacy:'en',format:'en-US'},
  'en-GB': {name:'English (UK)',base:'en',legacy:'en',format:'en-GB'},
  th: {name:'ไทย',base:'th',legacy:'th',format:'th-TH'},
  ja: {name:'日本語',legacy:'en',format:'ja-JP'},
  de: {name:'Deutsch',legacy:'en',format:'de-DE'},
  fr: {name:'Français',legacy:'en',format:'fr-FR'},
  es: {name:'Español',legacy:'en',format:'es-ES'},
  'pt-BR': {name:'Português (Brasil)',legacy:'en',format:'pt-BR'},
  id: {name:'Bahasa Indonesia',legacy:'en',format:'id-ID'},
  ms: {name:'Bahasa Melayu',legacy:'en',format:'ms-MY'},
  vi: {name:'Tiếng Việt',legacy:'en',format:'vi-VN'},
  ru: {name:'Русский',legacy:'en',format:'ru-RU'},
  ar: {name:'العربية',legacy:'en',format:'ar-SA',dir:'rtl'}
};

export const defaultLocale = 'zh-Hans';
const aliases = {zh:'zh-Hans',en:'en-US','zh-cn':'zh-Hans','zh-tw':'zh-Hant','es-es':'es'};
const codes = new Map(Object.keys(locales).map(code=>[code.toLowerCase(),code]));

export function resolveLocale(input) {
  const value=String(input||'').toLowerCase();
  return codes.get(value) || aliases[value] || defaultLocale;
}

export function showcasePath(locale) {
  if(locale===defaultLocale) return '/dualcam/';
  return '/dualcam/'+(locale==='en-US'?'en':locale.toLowerCase())+'/';
}
