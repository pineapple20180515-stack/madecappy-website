import { dualcamBlogPath } from './dualcam-blog.mjs';

export const christmasStoryMedia = '/dualcam/media/christmas-photo-card/';
export const christmasStoryPath = locale => dualcamBlogPath(locale) + 'christmas-photo-card/';
export const christmasStoryDate = '2026-11-24';

export const christmasShorts = {
  'zh-Hans': { label: '简体中文', id: 'CkGjs-KFkcY', poster: 'short-poster.jpg' },
  en: { label: 'English', id: 'JIk8WyG4Ip0', poster: 'short-en-poster.jpg' },
  th: { label: 'ไทย', id: 'MAsUmxYPjvI', poster: 'short-th-poster.jpg' },
  km: { label: 'ភាសាខ្មែរ', id: 'bK5pLNXSIB0', poster: 'short-km-poster.jpg' },
};
const shortLocales = {
  'zh-Hans': 'zh-Hans', 'zh-Hant': 'zh-Hans', 'en-US': 'en', 'en-GB': 'en', th: 'th', km: 'km',
};
export const christmasShortLocale = locale => shortLocales[locale] || 'en';
export const christmasShortUrl = id => 'https://www.youtube.com/shorts/' + id;
