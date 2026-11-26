import wedding from '../data/dualcam-wedding-story.json';
import { dualcamBlogPath } from './dualcam-blog.mjs';

export const sceneArticles = [wedding];
export const scenePath = (locale, slug) => dualcamBlogPath(locale) + slug + '/';
export const sceneLocale = (article, locale) => Object.hasOwn(article.translations, locale) ? locale : 'en-US';
