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

## DualCam sales refresh

The workflow checks App Store Connect every day at 02:17 Beijing time. It writes
only DualCam's public daily and monthly totals, then calls the production Deploy
Hook for `main`. Apple report dates use Pacific Time. The task keeps the existing
snapshot if Apple's next report is unavailable or the proceeds cannot be verified.

In the repository's Actions settings, add these secrets:

| Secret | Value |
| --- | --- |
| `DUALCAM_ASC_ISSUER_ID` | App Store Connect team Issuer ID |
| `DUALCAM_ASC_KEY_ID` | Team key ID with the Sales and Reports role |
| `DUALCAM_ASC_PRIVATE_KEY` | Content of that team's `.p8` key |
| `DUALCAM_ASC_VENDOR_NUMBER` | Vendor number for the account that owns DualCam |
| `DUALCAM_VERCEL_DEPLOY_HOOK` | Vercel Deploy Hook for the production branch `main` |

Set the Actions repository variable `DUALCAM_REVENUE_ENABLED` to `true` after
adding the secrets and allowing the workflow to commit to `main`. Run
**Update DualCam website revenue** manually from Actions to verify the first
pull and deployment. Check the public revenue section's data cutoff after the
deployment succeeds.

## ⚠️ Privacy notice (for contributors / forks)
This is a public repo. Never commit:
- API keys (DeepSeek, 火山引擎, etc.)
- Kid's real name (use placeholder 小波)
- Family address / phone / personal email
- Real device IDs / logids from app logs

## License
Content (Markdown in `src/content/`): CC BY-NC 4.0
Code: MIT
