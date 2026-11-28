import summit from '../data/dualcam-summit-story.json';
import marathon from '../data/dualcam-marathon-story.json';
import { catStory, liveStory } from '../data/dualcam-cats-and-live.mjs';
import wedding from '../data/dualcam-wedding-story.json';
import { dualcamBlogPath } from './dualcam-blog.mjs';

export const sceneArticles = [summit, marathon, catStory, liveStory, wedding];
export const scenePath = (locale, slug) => dualcamBlogPath(locale) + slug + '/';
export const sceneLocale = (article, locale) => Object.hasOwn(article.translations, locale) ? locale : 'en-US';
