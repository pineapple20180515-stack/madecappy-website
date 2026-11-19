import { locales } from './locales.mjs';
import { getCopy } from './copy.js';

export function renderEditorial(language) {
  const copy=getCopy(language).editorial;
  for (const element of document.querySelectorAll('[data-editorial]')) element.textContent=copy[element.dataset.editorial];
  const media=locales[language].base==='zh'?'zh':locales[language].legacy==='th'?'th':'en';
  for(const image of document.querySelectorAll('[data-feature-media]')){
    const src=`/dualcam/media/ui29-${media}-${image.dataset.featureMedia}.webp`;
    if(image.getAttribute('src')!==src)image.src=src;
  }
}
