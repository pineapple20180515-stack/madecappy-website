# madecappy.com

> A father building an English-practice iOS app for his 8-year-old son, in public.

This is the source code for [madecappy.com](https://madecappy.com).

## Stack
- Astro 5 + Tailwind CSS 4
- Content Collections for timeline entries
- Hosted on Vercel

## Local development
```bash
npm install
npm run dev
```

## Adding a new entry
Create `src/content/timeline/YYYY-MM-DD-slug.md` with frontmatter:
```yaml
---
date: YYYY-MM-DD
title: "标题"
tag: 架构 | Prompt | 翻车 | 用户反馈 | 视觉 | 教学法 | 工具链 | 里程碑
emoji: 🎯
summary: 一句话摘要
---
```

## ⚠️ Privacy notice (for contributors / forks)
This is a public repo. Never commit:
- API keys (DeepSeek, 火山引擎, etc.)
- Kid's real name (use placeholder 小波)
- Family address / phone / personal email
- Real device IDs / logids from app logs

## License
Content (Markdown in `src/content/`): CC BY-NC 4.0
Code: MIT
