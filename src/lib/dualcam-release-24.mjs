import {locales, showcasePath} from './dualcam-showcase/locales.mjs';

export const release24Locales = Object.fromEntries(Object.entries(locales).map(([code, entry]) => [
  code,
  {home: showcasePath(code), archive: `${entry.legacy === 'zh' ? '/dualcam/' : `/dualcam/${entry.legacy}/`}releases/2.3/`, label: entry.name, dir: entry.dir},
]));

export function release24Path(locale) {
  return `${showcasePath(locale)}releases/2.4/`;
}

export const release24Devices = [
  {id: 'iphone', width: 452, height: 980},
  {id: 'ipad-13', width: 980, height: 735},
  {id: 'duo-cover', width: 674, height: 980},
  {id: 'duo-inner', width: 980, height: 689},
];

export const release24Media = '/dualcam/media/release-24/';
export function screenshot24Path(locale, device, number) {
  const galleryLocale = locale === 'km' ? 'en-US' : locale;
  return `${release24Media}gallery/${galleryLocale}/${device}/${String(number).padStart(2,'0')}.webp`;
}
