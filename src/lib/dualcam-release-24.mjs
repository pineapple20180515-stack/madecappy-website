export const release24Locales = {
  'zh-Hans': { home: '/dualcam/', archive: '/dualcam/releases/2.3/', label: '简体中文' },
  'zh-Hant': { home: '/dualcam/zh-hant/', archive: '/dualcam/releases/2.3/', label: '繁體中文' },
  'en-US': { home: '/dualcam/en/', archive: '/dualcam/en/releases/2.3/', label: 'English (US)' },
  'en-GB': { home: '/dualcam/en-gb/', archive: '/dualcam/en/releases/2.3/', label: 'English (UK)' },
  th: { home: '/dualcam/th/', archive: '/dualcam/th/releases/2.3/', label: 'ไทย' },
  ko: { home: '/dualcam/en/', archive: '/dualcam/en/releases/2.3/', label: '한국어' }
};

export function release24Path(locale) {
  if (locale === 'zh-Hans') return '/dualcam/releases/2.4/';
  return '/dualcam/' + (locale === 'en-US' ? 'en' : locale.toLowerCase()) + '/releases/2.4/';
}
