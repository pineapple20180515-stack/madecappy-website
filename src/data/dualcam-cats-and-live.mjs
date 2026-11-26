const catMedia = '/dualcam/media/cat-giveaway/';
const liveMedia = '/dualcam/media/live-photo/';

export const catStory = {
  slug: 'dualcam-cat-giveaway',
  date: '2026-11-26',
  cover: catMedia + 'cat-cover.jpg',
  poster: catMedia + 'cat-cover.jpg',
  mp4: { 'zh-Hans': catMedia + 'cat-zh.mp4', 'en-US': catMedia + 'cat-en.mp4' },
  relatedSlug: 'dual-camera-live-photo',
  translations: {
    'zh-Hans': {
      title: '我拍橘猫跳舞，自己也入镜了',
      searchTitle: '我拍橘猫跳舞，自己也入镜了 | DualCam 前后双摄',
      description: '黑猫用 DualCam 记录橘猫跳舞，也录下了自己的反应。看 18.5 秒前后双摄短片和永久会员活动。',
      paragraphs: [
        'Hello，我是 DualCam 的小猫 🐈‍⬛',
        '那天我在海边给我家橘猫拍了段跳舞的视频。它一举爪，我就忍不住跟着摇头。回放时我才发现，左上角跟得最起劲的那只，原来是我。',
        '后摄拍它的舞步，前摄拍我的表情。用 DualCam「画中画相机」，两路画面可以一起录进同一条视频。下次拍宠物、舞台或朋友吹蜡烛，不妨也把举手机的自己拍进去。',
      ],
      video: '小猫双摄短片',
      videoLanguage: '选择短片语言',
      videoNote: '前摄小窗和后摄同屏。部分猫咪画面由 AI 生成。',
      cta: '在 App Store 下载 DualCam',
      offerTitle: '小猫送 100 份免费永久会员',
      offerIntro: '我找开发者准备了 DualCam Pro 永久会员码。欢迎在社媒活动帖留言，告诉我你想拍什么，或给我们提点意见。我会联系获得名额的朋友发兑换码。',
      offerDeadline: '活动到 2026 年 12 月 31 日 23:59（北京时间）。中文和英文各 100 份，同语种跨平台共用名额，发完提前结束。参与方式见对应活动帖。',
      related: '再看一组双摄 Live Photo 样片',
    },
    'en-US': {
      title: 'I filmed my cat dancing and caught my own reaction',
      searchTitle: 'Two Dancing Cats, One Dual-Camera Video | DualCam',
      description: 'A black cat records a dancing ginger cat and its own reaction in one 18.5-second DualCam video. See how to enter the lifetime Pro giveaway.',
      paragraphs: [
        'Hello, I’m the DualCam cat 🐈‍⬛',
        'I took my ginger cat down to the waterfront and filmed a little dance. Every time he raised a paw, I couldn’t help bobbing my head. When I watched it back, I realized the cat dancing hardest was me, up in the corner.',
        'The rear camera caught his dance moves, and the front camera caught my reaction. DualCam records both views in one video. Next time you film a pet, a performance, or a friend blowing out their candles, try catching your own reaction too.',
      ],
      video: 'Two dancing cats, filmed with DualCam',
      videoLanguage: 'Choose video language',
      videoNote: 'The front-camera inset plays alongside the rear-camera view. Some cat footage was AI-generated.',
      cta: 'Download DualCam on the App Store',
      offerTitle: '100 free lifetime DualCam Pro memberships',
      offerIntro: 'The DualCam developer and I have lifetime Pro codes to give away. Comment on your language’s giveaway post and tell me what you’d film, or leave us some feedback. I’ll contact recipients with a redemption code.',
      offerDeadline: 'Ends December 31, 2026, at 11:59 p.m. Beijing time (UTC+8), or when all codes are claimed. There are 100 codes per language, Chinese and English. Each language shares its allocation across platforms. See the giveaway post for entry details.',
      related: 'See four dual-camera Live Photo examples',
    },
  },
};

export const liveStory = {
  slug: 'dual-camera-live-photo',
  date: '2026-11-26',
  cover: liveMedia + 'cafe-cat.jpg',
  samples: ['cafe-cat', 'flower', 'alpaca', 'birthday'].map(name => ({
    src: liveMedia + name + '.mp4',
    poster: liveMedia + name + '.jpg',
  })),
  relatedSlug: 'dualcam-cat-giveaway',
  translations: {
    'zh-Hans': {
      title: '拍下眼前，也留下自己的反应',
      searchTitle: '双摄实况怎么拍 | DualCam Live Photo 样片',
      description: '四个前后双摄 Live Photo 拍摄场景。从咖啡店外的三花猫到生日蜡烛，把眼前的画面和自己的反应同时留下。',
      paragraphs: ['在咖啡店门口遇到一只猫，最想留住的可能是它探头的那一秒，也可能是自己突然笑出来的样子。双摄实况可以一起留下这两件事。'],
      examples: [
        ['店猫探头', '后摄拍三花猫，前摄留住看到它时的笑。'],
        ['夜里经过花墙', '后摄交代花与灯光，前摄留住停下来闻花的表情。'],
        ['羊驼来凑镜头', '后摄朝下拍它仰头，前摄里的人也低眼看它。'],
        ['烛光里许愿', '一边拍蛋糕上的蜡烛，一边留住闭眼许愿的瞬间。'],
      ],
      note: '网站里展示的是五秒视频预览，四组场景为 AI 创意样片。',
      stepsTitle: '自己拍一张',
      steps: '在支持双摄的 iPhone 上打开 DualCam，进入拍照，开启 Live Photo（Pro）。把后摄对准事件发生的位置，留出角落给前摄小窗。按下快门后，到「照片」里长按看实况。拍动物时，最好等它快要凑过来的时候再拍。',
      cta: '在 App Store 下载 DualCam',
      related: '看小猫的双摄短片和会员活动',
    },
    'en-US': {
      title: 'Capture the moment and your reaction in a Live Photo',
      searchTitle: 'How to Take Dual-Camera Live Photos | DualCam',
      description: 'Four ways to use the front and rear cameras for dual-camera Live Photos, from a café cat to birthday candles.',
      paragraphs: ['When a cat pokes its head out of a café, there are two things I want to remember: the cat peeking out and the smile I couldn’t hold back. A dual-camera Live Photo can capture both.'],
      examples: [
        ['The café cat peeks out', 'The rear camera catches the calico. The front camera catches the smile.'],
        ['Flowers after dark', 'The rear camera gets the flowers and lights as the front camera catches me stopping to smell them.'],
        ['An alpaca leans in', 'The rear camera looks down as the alpaca looks up. In the front-camera inset, I’m looking right back.'],
        ['A wish by candlelight', 'One camera frames the candles, and the other catches me closing my eyes to make a wish.'],
      ],
      note: 'These four AI-created scenes are presented as five-second video previews.',
      stepsTitle: 'Take one yourself',
      steps: 'Open DualCam on a compatible iPhone, switch to Photo mode, and enable Live Photo (Pro). Aim the rear camera at the scene and leave some room for the front-camera inset. Take the photo, then play it by touching and holding it in Photos. With animals, try to press the shutter just as they lean in.',
      cta: 'Download DualCam on the App Store',
      related: 'Watch the dancing cats and see the Pro giveaway',
    },
  },
};
