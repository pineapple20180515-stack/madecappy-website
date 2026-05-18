import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const timeline = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/timeline' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    tag: z.enum([
      '架构',
      'Prompt',
      '翻车',
      '用户反馈',
      '视觉',
      '教学法',
      '工具链',
      '里程碑',
    ]),
    emoji: z.string().optional(),
    summary: z.string(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { timeline };
