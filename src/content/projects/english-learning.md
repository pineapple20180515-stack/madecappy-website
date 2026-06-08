---
title: 小学英语学习
slug: english-learning
tagline: 给上小学的小菠萝做英语启蒙——第一步，把他喜欢的英文绘本变成会动的动画
status: building
startedAt: 2026-06-02
updatedAt: 2026-06-08
coverEmoji: 📚
color: green
techStack:
  - Pixnova · HappyHorse 图生视频
  - 首尾帧 / 参考生视频
  - ffmpeg 拼接转场
  - AI 提示词工程
forWhom: 学英语的小学生，和想陪孩子英语启蒙的家长
order: 20
---

> 这是我给小菠萝（8 岁）做英语启蒙的一块「自留地」。比起背单词、刷课本，我更想让英语和**他真正喜欢的东西**绑在一起。第一个动手做的，就是把他爱翻的英文绘本，变成会动、有旁白、有音效的动画。

## 为什么做这个

小菠萝在学英语，但对着课本提不起劲。我们家有几本特别可爱的英文绘本，主角是一只又胖又懒、表情高冷的猫，叫 **Flubby**。他喜欢翻，但「翻完就放下」。

我冒出一个念头：**如果书里的画会动起来，小猫真的会逃跑、会打哈欠、会被雷吓到，他会不会更愿意一遍遍看、跟着读？** 于是有了下面这套「会动的绘本」。

## 一个周末，一只会动的猫

我没有动画基础。整个过程其实是「我当导演、AI 当摄制组」：我决定每一页该发生什么，AI 负责把它画活。最让我意外的是，AI 对画风和这只猫的还原度非常高——胖乎乎的身材、灰棕色的「眼罩」花纹、浣熊一样的尾巴，从平静到炸毛都没崩。

小菠萝第一次看到那只猫「嗖」地逃出画面、又被雷吓得炸毛时，笑出了声——然后主动说：「再放一遍。」那一刻我就知道，这事儿成了。

## 我是怎么做的（方法可复用到任何绘本）

1. **拆页**：把绘本每页导成图。竖版直接用，横版大跨页保持整张，多格漫画用一整张表现连续动作。
2. **给角色立「人设」**：把猫和小主人的长相、性格、声音先写死，这样每页的角色才不会「变脸」。
3. **一页一句「动作脚本」**：根据前一页发生了什么，推这一页该怎么动，写成提示词。**旁白严格用书上的原文**。
4. **AI 出片**：把每页的图 + 脚本喂给图生视频模型，生成 5 秒小动画（带旁白和音效）。
5. **拼起来**：所有片段按故事顺序拼成一整条，页与页之间用轻轻的「翻页白光」过渡。

声音上我立了一条规矩：**旁白是讲故事的小女孩声音，猫从头到尾不说人话**——它的「喵」「打呼」「被吓到的叫」都是音效。既好笑，又不出戏。

## 比「看动画」更重要的：一起读

动画只是钩子。真正让英语长进去的，是**家长陪着一起看、一边问问题**。这套绘本句型不断重复，看到第三页孩子就能自己接话。所以下面每一本，我都把**动画 + 这本专属的「陪读卡」放在一起**——边看边用。

---

## ① 不会才艺的好猫咪 · *Flubby Is NOT a Good Pet!*

<video controls preload="metadata" poster="/videos/flubby/book1.jpg" style="width:100%;border-radius:14px;background:#000"><source src="/videos/flubby/book1.mp4" type="video/mp4" />你的浏览器不支持视频播放。</video>

朋友们的宠物会唱歌、会接球、会跳高，Kami 也想让自家这只懒猫露一手，结果 Flubby 全程不配合。直到一场雷雨，一人一猫互相依偎……

> 💛 **它想说的**：不会才艺，也可以是最好的伙伴。比起本领，「我需要你、你也需要我」才最珍贵。

**陪孩子一起读**（英文可直接念给孩子，中文是给你看的引导）

- 魔法句型：`X's pet can ___.` / `Flubby does not ___.`
- ❓ *"What can Kim's / Sam's pet do?"* —— 引导孩子说 sing / catch / jump。
- ❓ *"Will Flubby do it?"* —— 让孩子大声喊 *"No! Flubby does NOT sing!"*
- ❓ *"Flubby can't sing or jump… but what CAN he do?"* —— 点题：他会爱、会陪伴。

📚 喜欢就[支持正版、去买原书](https://www.amazon.com/s?k=Flubby+Is+NOT+a+Good+Pet+Morris)。

---

## ② 最好的玩具是纸箱 · *Flubby Will Not Play with That!*

<video controls preload="metadata" poster="/videos/flubby/book2.jpg" style="width:100%;border-radius:14px;background:#000"><source src="/videos/flubby/book2.mp4" type="video/mp4" />你的浏览器不支持视频播放。</video>

Kami 买回一大袋玩具：会唱歌的鸟、会滚的发条老鼠、会摆的逗猫鱼，甚至一个「砰」地弹出来的疯狂弹簧机器人。可 Flubby 一个都不玩……最后却一头钻进了装玩具的空纸箱里。

> 💛 **它想说的**：再贵的玩具，也比不过一个能钻进去的纸箱。陪伴和想象力，才是孩子最爱的「玩具」。

**陪孩子一起读**

- 魔法句型：`This toy can ___.` / `Flubby will not play with that.`
- ❓ *"What can this toy do? Will Flubby like it?"* —— 每个玩具都让孩子先猜。
- ❓ *"What does Flubby like best — a toy, or the box?"* —— 引出纸箱。
- 聊聊：你最爱的玩具是什么？为什么？

📚 [支持正版、去买原书](https://www.amazon.com/s?k=Flubby+Will+Not+Play+with+That+Morris)。

---

## ③ 死活不肯洗澡的猫 · *Flubby Will Not Take a Bath*

<video controls preload="metadata" poster="/videos/flubby/book3.jpg" style="width:100%;border-radius:14px;background:#000"><source src="/videos/flubby/book3.mp4" type="video/mp4" />你的浏览器不支持视频播放。</video>

Flubby 脏兮兮的该洗澡了。Kami 用尽办法——温水、洗发水、满盆泡泡、逗猫鱼，甚至想直接把它按进盆里。可这只猫每次都「嗖」地逃走（ZOOM！PSHOOO！）。最后两个滚作一团、浑身湿透……没洗成澡，却意外洗成了一场「淋浴」。

> 💛 **它想说的**：养娃（养猫）的兵荒马乱里，计划永远赶不上变化——但那些手忙脚乱的瞬间，本身就很好笑、很珍贵。

**陪孩子一起读**

- 魔法句型：`Flubby will not take a bath.` + 逃跑拟声词 `ZOOM` / `PSHOOO`
- ❓ *"Is Flubby clean or dirty?"* —— 二选一，孩子好回答。
- ❓ *"Uh-oh! What is Flubby doing? Say it: ZOOM!"* —— 一起喊拟声词、配动作。
- ❓ *"Did Flubby take a bath?… He took a shower! Do you like baths?"* —— 区分 bath / shower，联系生活。

📚 [支持正版、去买原书](https://www.amazon.com/s?k=Flubby+Will+Not+Take+a+Bath+Morris)。

---

## 给家长的 3 个小贴士

- **先图后字**：每页先问「图里发生了什么」，孩子说完再读英文，理解更牢。
- **多用二选一**：开放题太难，「Happy or sad?」「Run or sleep?」孩子更敢开口。
- **重复就是力量**：每个魔法句型都让孩子接，读到第三遍他就能自己念整页。

## 还在路上

「会动的绘本」只是第一步。这个板块我会继续往里加给小菠萝做的英语小东西——更多绘本动画、生词卡、跟读练习……慢慢长。

---

*《Flubby》系列由 **J. E. Morris** 创作、Penguin Workshop 出版。这里的动画是我为自家孩子做的亲子学习记录；如果你也喜欢这只猫，请支持正版、去买原书——纸书的手感和陪孩子翻页的乐趣，是动画替代不了的。*
