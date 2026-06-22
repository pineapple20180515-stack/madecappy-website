---
date: 2026-06-22
title: "从产品经理视角拆一遍 Cappy 的架构 —— 我是怎么「定义」和「抽象」这套系统的"
tag: 架构
emoji: 🧩
summary: 我不写代码，但我花最多时间的地方，是「怎么定义这个系统」。代码可以让 AI 写，但「把系统切成哪几块、每块的边界在哪、它们怎么拼」—— 这件事 AI 替不了我，也是整个项目最值钱的部分。这一篇我从产品经理 + 模块化的角度，把 Cappy 的架构完整拆一遍：为什么把「一个 AI」拆成听/想/说/看四种能力、为什么一个 Cappy 要分身份/模式/上下文三层、为什么记忆要分能力/关系/个性、为什么绘本不直接喂给 Cappy 而要中间夹一个「备课老师」、为什么学情数据是「叠加重建」而不是「攒」出来的。全程图文并茂。一句话总结：好的抽象 = 定义一次、到处生效、还能随时换零件。
---

做了这么多版 Cappy，我越来越确信一件事：

> **对一个不写代码的人来说，最该花时间的不是代码 —— 是「怎么切这个系统」。**

代码可以让 AI 写。但「把这个东西切成哪几块、每一块的边界画在哪、它们之间怎么拼」—— 这是 AI 替不了我的，也是整个项目里**最值钱**的部分。切对了，AI 填实现填得飞快、加功能不打架；切错了，越填越乱，最后推倒重来。

这一篇，我把 Cappy 的架构完整拆一遍。不讲代码，只讲**定义和抽象** —— 一个产品经理是怎么把一个「会陪孩子读绘本、练口语的 AI」想清楚的。

---

## 抽象一：Cappy 不是「一个 AI」，是「听 / 想 / 说 / 看」四种能力

大多数人想「用 AI 做个 app」，脑子里是**调一个大模型**。但我很早就决定：**Cappy 不是一个 AI，是四种能力拼起来的。**

<svg viewBox="0 0 780 244" style="width:100%;height:auto;font-family:-apple-system,BlinkMacSystemFont,sans-serif" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="ah1" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#b89a6a"/></marker></defs>
  <!-- 看图 -->
  <rect x="300" y="18" width="180" height="58" rx="12" fill="#f3edff" stroke="#cab8f0"/>
  <text x="390" y="42" text-anchor="middle" font-size="15" font-weight="700" fill="#5a44a0">📖 看图 · VL</text>
  <text x="390" y="62" text-anchor="middle" font-size="12.5" fill="#6b6356">豆包视觉（绘本备课）</text>
  <!-- 听 -->
  <rect x="30" y="120" width="190" height="70" rx="12" fill="#e6f3f5" stroke="#9fcbd2"/>
  <text x="125" y="148" text-anchor="middle" font-size="15" font-weight="700" fill="#1d6e7a">👂 听 · ASR</text>
  <text x="125" y="170" text-anchor="middle" font-size="12.5" fill="#6b6356">火山流式（孩子说→字）</text>
  <!-- 想 -->
  <rect x="295" y="120" width="190" height="70" rx="12" fill="#fdf0e1" stroke="#e8b27a"/>
  <text x="390" y="148" text-anchor="middle" font-size="15" font-weight="700" fill="#c26a16">💭 想 · LLM</text>
  <text x="390" y="170" text-anchor="middle" font-size="12.5" fill="#6b6356">DeepSeek（生成 Cappy 的话）</text>
  <!-- 说 -->
  <rect x="560" y="120" width="190" height="70" rx="12" fill="#e9f4ea" stroke="#a7d2ab"/>
  <text x="655" y="148" text-anchor="middle" font-size="15" font-weight="700" fill="#3c7a45">🔊 说 · TTS</text>
  <text x="655" y="170" text-anchor="middle" font-size="12.5" fill="#6b6356">火山多情感（字→声）</text>
  <!-- arrows -->
  <line x1="222" y1="155" x2="290" y2="155" stroke="#b89a6a" stroke-width="2" marker-end="url(#ah1)"/>
  <line x1="487" y1="155" x2="555" y2="155" stroke="#b89a6a" stroke-width="2" marker-end="url(#ah1)"/>
  <line x1="390" y1="78" x2="390" y2="116" stroke="#b89a6a" stroke-width="2" marker-end="url(#ah1)"/>
  <!-- loop back 说->听 -->
  <path d="M655 192 L655 222 L125 222 L125 194" fill="none" stroke="#c9b58e" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#ah1)"/>
  <text x="390" y="238" text-anchor="middle" font-size="11.5" fill="#998">说完接着听 —— 一来一回，像打电话</text>
</svg>

每一种能力，都是一个**插槽**。我在每个插槽里，插**最适合它的那个模型**：
- **听**和**说**，火山引擎最稳（中文语音是字节的强项）；
- **想**，我用 DeepSeek（难度可控、便宜、关掉思考链够快）；
- **看图**，火山方舟的豆包视觉。

**这个抽象的回报，在我踩坑时才真正显现出来。** 有一阵我用豆包的端到端实时语音（听想说一体），结果它「想」出来的英文**太难、压不住**。如果是个一体化的黑盒，我只能整个换掉。但因为我把「想」单独切出来了 —— **我只换了「想」那一块**（换成 DeepSeek），听和说一行没动。

> 🧩 **模块化的第一个好处：坏了能单独换。** 把能力切成独立插槽，你就拥有了「哪块不行换哪块」的自由度，而不是「不行就推倒」。

---

## 抽象二：一个 Cappy，多副面孔 —— 身份 / 模式 / 上下文 三层

Cappy 要在**数学岛、绘本岛、聊天岛**里出现，还要能跟**家长**说话、收**反馈**。但它必须是**同一个 Cappy** —— 同样的性格、记得同样的事。

如果我给每个场景各写一套 prompt，那就有五个「人格」各漂各的，改一个忘一个。所以我把 Cappy 的「大脑」（一段喂给 DeepSeek 的 system prompt）切成了**三层**：

<svg viewBox="0 0 720 322" style="width:100%;height:auto;font-family:-apple-system,BlinkMacSystemFont,sans-serif" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="ah2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#b89a6a"/></marker></defs>
  <!-- Layer 3 上下文 -->
  <rect x="60" y="20" width="600" height="62" rx="12" fill="#fff7e9" stroke="#ecd9af"/>
  <text x="80" y="46" font-size="13.5" font-weight="700" fill="#c26a16">Layer 3 · 上下文（每一轮都在变）</text>
  <text x="80" y="68" font-size="12.5" fill="#6b6356">这一页的文字 · 他已经会的词 · 这次该悄悄复习的 · 家长今天布置练什么</text>
  <!-- Layer 2 模式 -->
  <rect x="60" y="98" width="600" height="62" rx="12" fill="#fdeede" stroke="#e8b27a"/>
  <text x="80" y="124" font-size="13.5" font-weight="700" fill="#c26a16">Layer 2 · 模式（这次在干嘛）</text>
  <text x="80" y="146" font-size="12.5" fill="#6b6356">数学 / 绘本精读 / 自由聊 / 跟家长汇报 / 收反馈 —— 换场景，不换人</text>
  <!-- Layer 1 身份 -->
  <rect x="60" y="176" width="600" height="66" rx="12" fill="#f6e6cf" stroke="#dcb985"/>
  <text x="80" y="203" font-size="13.5" font-weight="700" fill="#9a5a1e">Layer 1 · 身份（所有场景共享，只定义一次）</text>
  <text x="80" y="225" font-size="12.5" fill="#6b6356">「冒险伙伴」人设：记得他、不说套话、会犯傻、是朋友不是老师 + 健康边界</text>
  <!-- merge arrow -->
  <line x1="360" y1="242" x2="360" y2="270" stroke="#b89a6a" stroke-width="2" marker-end="url(#ah2)"/>
  <rect x="250" y="276" width="220" height="38" rx="19" fill="#c26a16"/>
  <text x="360" y="300" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">→ DeepSeek → Cappy 说的那句话</text>
</svg>

- **Layer 1 身份**：那份「冒险伙伴」人设 —— 记得他、每次反应都不一样、会卖萌、是朋友不是老师，外加「不假装真人 / 把成就感给他 / 见好就收」这些健康边界。**只写一次，所有模式都 prepend 上它。**
- **Layer 2 模式**：现在在干嘛 —— 读绘本？聊天？还是跟家长汇报？换的是**场景**，不是**人**。
- **Layer 3 上下文**：这一轮的实时数据 —— 这页绘本的文字、他已经会的词、这次该悄悄带回来复习的、家长布置的任务。

这么一切，「**一处改、处处生效**」就成立了：我把人设从「老师」拧成「朋友」，**只动了 Layer 1 一个文件**，数学岛、绘本岛、聊天岛的 Cappy 同时变成同一个朋友。

> 🧩 **模块化的第二个好处：定义一次，到处生效。** 把「不变的」（身份）和「变的」（模式、上下文）切开，共性就只用维护一份。

---

## 抽象三：记忆不是一坨，分「能力 / 关系 / 个性」三层

「让 Cappy 记得这个孩子」是我最在意的事（这是它像伙伴、而不是工具的关键）。但「记忆」如果是一个大杂烩，就既存不好也用不好。所以我按**记的是哪种东西**，把记忆切成三层：

<svg viewBox="0 0 760 228" style="width:100%;height:auto;font-family:-apple-system,BlinkMacSystemFont,sans-serif" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="ah3" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#b89a6a"/></marker></defs>
  <!-- 能力 -->
  <rect x="20" y="20" width="230" height="120" rx="14" fill="#fdf0e1" stroke="#e8b27a"/>
  <text x="135" y="48" text-anchor="middle" font-size="15" font-weight="700" fill="#c26a16">能力记忆</text>
  <text x="135" y="72" text-anchor="middle" font-size="12.5" fill="#6b6356">他会哪些词、哪些句式</text>
  <text x="135" y="92" text-anchor="middle" font-size="12.5" fill="#6b6356">卡在哪、该复习啥</text>
  <text x="135" y="118" text-anchor="middle" font-size="12" fill="#998">（LearnerModel）</text>
  <!-- 关系 -->
  <rect x="265" y="20" width="230" height="120" rx="14" fill="#e9f4ea" stroke="#a7d2ab"/>
  <text x="380" y="48" text-anchor="middle" font-size="15" font-weight="700" fill="#3c7a45">关系记忆</text>
  <text x="380" y="72" text-anchor="middle" font-size="12.5" fill="#6b6356">你俩一起读过的绘本</text>
  <text x="380" y="92" text-anchor="middle" font-size="12.5" fill="#6b6356">故事、寓意、他喜欢啥</text>
  <text x="380" y="118" text-anchor="middle" font-size="12" fill="#998">（book_memories）</text>
  <!-- 个性 -->
  <rect x="510" y="20" width="230" height="120" rx="14" fill="#f3edff" stroke="#cab8f0"/>
  <text x="625" y="48" text-anchor="middle" font-size="15" font-weight="700" fill="#5a44a0">个性记忆</text>
  <text x="625" y="72" text-anchor="middle" font-size="12.5" fill="#6b6356">他叫什么、几岁</text>
  <text x="625" y="92" text-anchor="middle" font-size="12.5" fill="#6b6356">兴趣、难度水平</text>
  <text x="625" y="118" text-anchor="middle" font-size="12" fill="#998">（profile）</text>
  <!-- arrows down -->
  <line x1="135" y1="140" x2="135" y2="178" stroke="#b89a6a" stroke-width="2" marker-end="url(#ah3)"/>
  <line x1="380" y1="140" x2="380" y2="178" stroke="#b89a6a" stroke-width="2" marker-end="url(#ah3)"/>
  <line x1="625" y1="140" x2="625" y2="178" stroke="#b89a6a" stroke-width="2" marker-end="url(#ah3)"/>
  <text x="135" y="200" text-anchor="middle" font-size="12.5" fill="#6b6356">→ 定难度</text>
  <text x="135" y="218" text-anchor="middle" font-size="11.5" fill="#998">只说他听得懂的</text>
  <text x="380" y="200" text-anchor="middle" font-size="12.5" fill="#6b6356">→ 做回扣</text>
  <text x="380" y="218" text-anchor="middle" font-size="11.5" fill="#998">「还记得 Flubby 吗」</text>
  <text x="625" y="200" text-anchor="middle" font-size="12.5" fill="#6b6356">→ 称呼 + 暖场</text>
  <text x="625" y="218" text-anchor="middle" font-size="11.5" fill="#998">用他的名字和兴趣</text>
</svg>

- **能力记忆**：他会哪些词、哪些句式、哪个卡了、该复习啥。→ 喂给 Cappy **定难度**（永远只在他能听懂的边上加一点点）。
- **关系记忆**：你俩一起读过的书、故事、寓意。→ 喂给 Cappy **做回扣**（说到猫，自然提一句「还记得那只不肯洗澡的 Flubby 吗」）。
- **个性记忆**：他叫什么、几岁、喜欢什么。→ 喂给 Cappy **称呼和暖场**。

三种记忆，**更新的节奏、用的地方都不一样**。切开之后，每一种都能单独优化 —— 比如复习调度（遗忘曲线）只在「能力记忆」里做，不会跟「关系记忆」搅在一起。

---

## 抽象四：学情数据是「叠加重建」出来的，不是「攒」出来的

这一条是整个系统的**地基**，也是我自己最得意的一个决定。

一个很自然的做法是：孩子学一点，我就往他的「能力档案」里**改一笔**。但这样有个隐患 —— **档案会漂**。改着改着，你就不知道某个数据当初是怎么来的、对不对了，错了也回不去。

我用的是另一种思路：**LearnerModel 永远是「重建」出来的，不是「改」出来的。**

<svg viewBox="0 0 760 258" style="width:100%;height:auto;font-family:-apple-system,BlinkMacSystemFont,sans-serif" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="ah4" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#b89a6a"/></marker></defs>
  <!-- sources -->
  <rect x="20" y="20" width="180" height="40" rx="10" fill="#fbf6ec" stroke="#e7ddc9"/><text x="110" y="45" text-anchor="middle" font-size="12.5" fill="#6b6356">课程种子（课本学完的词）</text>
  <rect x="20" y="68" width="180" height="40" rx="10" fill="#fbf6ec" stroke="#e7ddc9"/><text x="110" y="93" text-anchor="middle" font-size="12.5" fill="#6b6356">手动种子（我标的）</text>
  <rect x="20" y="116" width="180" height="40" rx="10" fill="#fbf6ec" stroke="#e7ddc9"/><text x="110" y="141" text-anchor="middle" font-size="12.5" fill="#6b6356">用过的词（真说出来过）</text>
  <rect x="20" y="164" width="180" height="40" rx="10" fill="#fbf6ec" stroke="#e7ddc9"/><text x="110" y="189" text-anchor="middle" font-size="12.5" fill="#6b6356">卡壳的词（读磕巴了）</text>
  <rect x="20" y="212" width="180" height="40" rx="10" fill="#fbf6ec" stroke="#e7ddc9"/><text x="110" y="237" text-anchor="middle" font-size="12.5" fill="#6b6356">高光（说出的厉害句子）</text>
  <!-- rebuild -->
  <rect x="300" y="100" width="150" height="72" rx="14" fill="#c26a16"/>
  <text x="375" y="132" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">重建</text>
  <text x="375" y="153" text-anchor="middle" font-size="11.5" fill="#ffe9d0">幂等 · 随时可重跑</text>
  <!-- result -->
  <rect x="540" y="92" width="200" height="88" rx="14" fill="#fdf0e1" stroke="#e8b27a"/>
  <text x="640" y="124" text-anchor="middle" font-size="15" font-weight="700" fill="#c26a16">LearnerModel</text>
  <text x="640" y="148" text-anchor="middle" font-size="12.5" fill="#6b6356">单一事实源</text>
  <text x="640" y="167" text-anchor="middle" font-size="12" fill="#998">小菠萝的英语画像</text>
  <!-- arrows -->
  <line x1="200" y1="40" x2="298" y2="115" stroke="#b89a6a" stroke-width="1.6" marker-end="url(#ah4)"/>
  <line x1="200" y1="88" x2="298" y2="125" stroke="#b89a6a" stroke-width="1.6" marker-end="url(#ah4)"/>
  <line x1="200" y1="136" x2="298" y2="136" stroke="#b89a6a" stroke-width="1.6" marker-end="url(#ah4)"/>
  <line x1="200" y1="184" x2="298" y2="148" stroke="#b89a6a" stroke-width="1.6" marker-end="url(#ah4)"/>
  <line x1="200" y1="232" x2="298" y2="158" stroke="#b89a6a" stroke-width="1.6" marker-end="url(#ah4)"/>
  <line x1="450" y1="136" x2="535" y2="136" stroke="#b89a6a" stroke-width="2" marker-end="url(#ah4)"/>
</svg>

左边是一堆**原始信号**：课本里学完的词、我手动标的、孩子真说出口用过的、读绘本时卡壳的、蹦出来的高光句子。它们各自**只管记录事实**。

右边的 LearnerModel（他的「英语画像」），是把左边这些信号**叠加、重新算一遍**得到的 —— 而且这个重建是**幂等**的：同样的信号，重跑一百遍结果一样。

> 🧩 **模块化的第三个好处：单一事实源 + 可重建 = 信任。** 我永远能从原始信号把画像重建出来，所以它不会漂、错了也能回滚。看板上那个「↻ 从课程重建」按钮，按下去就是干这件事。

---

## 抽象五：绘本不直接喂给 Cappy —— 中间夹一个「备课老师」

绘本岛是这次最大的升级。但「让 Cappy 陪读一本绘本」最难的，**不是读，是先让它看懂这本书**。

我没有让 Cappy 直接面对一本绘本，而是在中间夹了一个专门的 **「绘本 Agent」** —— 你可以把它理解成一个**备课老师**：它先把书读懂、备好课，Cappy 只是那个**照着课件上课的人**。

<svg viewBox="0 0 780 180" style="width:100%;height:auto;font-family:-apple-system,BlinkMacSystemFont,sans-serif" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="ah5" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#b89a6a"/></marker></defs>
  <rect x="14" y="70" width="120" height="60" rx="12" fill="#fbf6ec" stroke="#e7ddc9"/>
  <text x="74" y="98" text-anchor="middle" font-size="13" font-weight="700" fill="#6b6356">绘本 PDF</text>
  <text x="74" y="117" text-anchor="middle" font-size="11.5" fill="#998">一本书</text>
  <!-- 理解 -->
  <rect x="168" y="62" width="135" height="76" rx="12" fill="#f3edff" stroke="#cab8f0"/>
  <text x="235" y="88" text-anchor="middle" font-size="13.5" font-weight="700" fill="#5a44a0">① 理解</text>
  <text x="235" y="108" text-anchor="middle" font-size="11.5" fill="#6b6356">看图：哪页是正文</text>
  <text x="235" y="124" text-anchor="middle" font-size="11.5" fill="#6b6356">人物 / 风格 / 寓意</text>
  <!-- 清洗 -->
  <rect x="323" y="62" width="135" height="76" rx="12" fill="#e6f3f5" stroke="#9fcbd2"/>
  <text x="390" y="88" text-anchor="middle" font-size="13.5" font-weight="700" fill="#1d6e7a">② 清洗</text>
  <text x="390" y="108" text-anchor="middle" font-size="11.5" fill="#6b6356">按顺序挑要念的句</text>
  <text x="390" y="124" text-anchor="middle" font-size="11.5" fill="#6b6356">标语气 + 翻中文</text>
  <!-- 备课 -->
  <rect x="478" y="62" width="135" height="76" rx="12" fill="#fdf0e1" stroke="#e8b27a"/>
  <text x="545" y="88" text-anchor="middle" font-size="13.5" font-weight="700" fill="#c26a16">③ 备课</text>
  <text x="545" y="108" text-anchor="middle" font-size="11.5" fill="#6b6356">每页要点词</text>
  <text x="545" y="124" text-anchor="middle" font-size="11.5" fill="#6b6356">+ 几个小问题</text>
  <!-- course.json -->
  <rect x="646" y="70" width="120" height="60" rx="12" fill="#e9f4ea" stroke="#a7d2ab"/>
  <text x="706" y="95" text-anchor="middle" font-size="13" font-weight="700" fill="#3c7a45">课件</text>
  <text x="706" y="114" text-anchor="middle" font-size="11.5" fill="#998">Cappy 照着教</text>
  <line x1="134" y1="100" x2="164" y2="100" stroke="#b89a6a" stroke-width="2" marker-end="url(#ah5)"/>
  <line x1="303" y1="100" x2="319" y2="100" stroke="#b89a6a" stroke-width="2" marker-end="url(#ah5)"/>
  <line x1="458" y1="100" x2="474" y2="100" stroke="#b89a6a" stroke-width="2" marker-end="url(#ah5)"/>
  <line x1="613" y1="100" x2="642" y2="100" stroke="#b89a6a" stroke-width="2" marker-end="url(#ah5)"/>
  <text x="390" y="170" text-anchor="middle" font-size="12" fill="#998">备课只跑一次，结果存成课件；之后小朋友读多少次，都不用再备课</text>
</svg>

为什么要多夹这一层？因为**「读懂一本书」和「用这本书教孩子」是两件事**，混在一起就两件都做不好。拆开之后：
- **理解**：用豆包视觉**看整页图**，分清哪是正文、哪是封面/版权、人物和寓意是什么；
- **清洗**：按**真实阅读顺序**挑出该念的句子（瓶子上的字、拟声词、页码都丢掉），还顺手给每句标好语气、翻好中文；
- **备课**：按孩子的水平，给每页配一两个**超好回答的小问题**。

这一层还有个隐形的好处：**它把「加一本新书」变成了一件不用我管的事** —— 把 PDF 丢进去跑一遍，备课自动做好。新书源源不断进，我不用是瓶颈。

---

## 抽象六：学习是个「四步状态机」，外面套一个「飞轮」

最后两个抽象，是关于**流程**的。

读一本绘本，我没把它做成「放个音频」，而是一个清清楚楚的**四步状态机**：① Cappy 范读 → ② 自己读 → ③ 一起精读 → ④ 总结发月亮。每一步 Cappy 干的事、孩子干的事都不一样，边界清楚。

而这四步外面，套着一个我整个产品最核心的东西 —— **飞轮**：

<svg viewBox="0 0 560 318" style="width:100%;height:auto;font-family:-apple-system,BlinkMacSystemFont,sans-serif" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="ah6" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#c26a16"/></marker></defs>
  <!-- center -->
  <circle cx="280" cy="165" r="62" fill="#fdf0e1" stroke="#e8b27a"/>
  <text x="280" y="158" text-anchor="middle" font-size="15" font-weight="700" fill="#c26a16">越用</text>
  <text x="280" y="180" text-anchor="middle" font-size="15" font-weight="700" fill="#c26a16">越懂他</text>
  <!-- nodes -->
  <rect x="195" y="14" width="170" height="46" rx="23" fill="#fff" stroke="#e7ddc9"/><text x="280" y="42" text-anchor="middle" font-size="13.5" font-weight="600" fill="#4a4133">① 陪他学一次</text>
  <rect x="392" y="118" width="160" height="46" rx="23" fill="#fff" stroke="#e7ddc9"/><text x="472" y="146" text-anchor="middle" font-size="13.5" font-weight="600" fill="#4a4133">② 产生信号</text>
  <rect x="360" y="262" width="190" height="46" rx="23" fill="#fff" stroke="#e7ddc9"/><text x="455" y="290" text-anchor="middle" font-size="13.5" font-weight="600" fill="#4a4133">③ 更新记忆 + 复习表</text>
  <rect x="10" y="262" width="190" height="46" rx="23" fill="#fff" stroke="#e7ddc9"/><text x="105" y="290" text-anchor="middle" font-size="13.5" font-weight="600" fill="#4a4133">④ 下次难度 + 回扣更准</text>
  <rect x="8" y="118" width="160" height="46" rx="23" fill="#fff" stroke="#e7ddc9"/><text x="88" y="146" text-anchor="middle" font-size="13.5" font-weight="600" fill="#4a4133">⑤ 他更愿意说</text>
  <!-- circular arrows -->
  <path d="M362 44 C 410 60, 450 90, 462 114" fill="none" stroke="#c26a16" stroke-width="2" marker-end="url(#ah6)"/>
  <path d="M468 166 C 478 210, 470 240, 460 258" fill="none" stroke="#c26a16" stroke-width="2" marker-end="url(#ah6)"/>
  <path d="M358 290 C 300 300, 240 300, 200 290" fill="none" stroke="#c26a16" stroke-width="2" marker-end="url(#ah6)"/>
  <path d="M100 260 C 86 220, 84 195, 86 166" fill="none" stroke="#c26a16" stroke-width="2" marker-end="url(#ah6)"/>
  <path d="M96 116 C 120 84, 160 60, 198 46" fill="none" stroke="#c26a16" stroke-width="2" marker-end="url(#ah6)"/>
</svg>

陪他**学一次** → 产生**信号**（用过的词、卡壳、高光）→ 信号**更新记忆**、排出**复习表**（遗忘曲线）→ 下次 Cappy **难度更贴、回扣更准、还会悄悄带他复习该复习的** → 他更愿意说 → 又产生新信号……

**这个飞轮不只在绘本岛转 —— 它贯穿数学、绘本、聊天所有环节。** 因为前面那些抽象（统一的记忆、统一的身份、单一事实源）都是共享的，所以无论他在哪个岛学，都在喂同一个飞轮、被同一个越来越懂他的 Cappy 接住。这就是我最想要的那句话 —— **「你越用，它越懂你」**。

---

## 几个小总结：关于「抽象」这件事

**一、好的抽象 = 定义一次、到处生效、还能换零件。**
回头看，Cappy 里每一个让我后来省心的决定，都符合这三条：能力插槽（能换模型）、身份层（改一次全岛变）、单一事实源（随时重建）。如果一个抽象做不到这三条里的任何一条，多半是切错了。

**二、先划边界，再填实现。**
我花在「这个系统该切成哪几块」上的时间，远多于任何具体功能。「听/想/说/看」「身份/模式/上下文」「能力/关系/个性」—— 这些**边界**划对了，后面换模型、加家长模式、接反馈漏斗，都是往已有的格子里填东西，不打架。边界划错了，越填越乱。

**三、对不写代码的人，这恰恰是你最大的杠杆。**
我不写代码，但我能把系统想清楚、切干净。AI 填实现填得飞快 —— **前提是我先把格子划好**。换句话说：**「定义和抽象」是 AI 暂时还替不了产品经理的那部分，也正是非技术的人在 AI 时代最该练的肌肉。**

**四、抽象是为人服务的，别为抽象而抽象。**
我切这么多层，最终都指向一个特别朴素的目标：让 Cappy 像个**真的记得小菠萝、懂他、陪着他**的朋友。架构再漂亮，如果不能让他多笑一次、多开一次口，对我就没意义。所有这些「定义和抽象」，本质上都是在回答同一个问题 —— **怎么让一台机器，对一个 8 岁的孩子，是温柔的、记得他的、值得信任的。**
