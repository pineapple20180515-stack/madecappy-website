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
    // 所属项目（把构建文章归到对应项目下）。默认 cappy（建造日记）。
    project: z.string().default('cappy'),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    tagline: z.string(),
    status: z.enum(['shipped', 'building', 'paused', 'abandoned']),
    startedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    coverEmoji: z.string().optional(),
    color: z.enum(['pineapple', 'blue', 'pink', 'green']).default('pineapple'),
    externalUrl: z.string().url().optional(),
    productPath: z.string().optional(),   // 站内产品宣传页路径，如 /dualcam
    techStack: z.array(z.string()).default([]),
    forWhom: z.string().optional(),
    draft: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

export const collections = { timeline, projects };
