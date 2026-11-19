import { locales } from './locales.mjs';
import { translations } from './translated-copy.js';

const words = {
  zh: {
    navFilm:'样片',navBuild:'开发记录',navJar:'收入',language:'语言',kicker:'iPhone 前后摄同录',heroLineOne:'前摄是你。',heroLineTwo:'后摄是世界。',heroDescription:'同时拍下眼前的风景，和看到它的你。一次按下录制，留下同一个瞬间。',watch:'看双摄样片',sceneTitle:'一台手机，两个视角',sceneHint:'拖动查看正反面',orbit:'旋转',front:'前摄',rear:'后摄',explode:'拆解',statusOrbit:'自动旋转中',statusFront:'前摄 · 看见拍摄者',statusRear:'后摄 · 看见眼前的景',statusExplode:'沿机身厚度拆开',statusManual:'可继续拖动',frontLabel:'前置摄像头',rearLabel:'后置主摄 · 取景',chapterFilm:'双摄样片',filmHeading:'同一刻，两面。',filmDescription:'后摄沿着金边的江面追着游船，前摄留住拍摄者的反应。',rearView:'后摄 · 江畔',frontView:'前摄 · 拍摄者',mediaNote:'金边 · 双摄概念样片',chapterBuild:'开发记录',buildHeading:'一步一步做出来。',buildDescription:'每个版本都有自己的页面，记录当时为什么改、改了什么。',chapterJar:'收入目标',jarHeading:'存钱罐',privacy:'隐私',terms:'条款',fallback:'浏览器暂不支持 3D 旋转',close:'关闭',controls:'模型视角',videoLabel:'金边双摄样片',navigation:'网站导航',title:'DualCam｜前后摄像头同时录制',description:'DualCam 在同一台 iPhone 上同时录制前后摄像头，将风景和你的反应留在同一条视频里。'
  },
  en: {
    navFilm:'Sample',navBuild:'Build log',navJar:'Revenue',language:'Language',kicker:'Front and rear recording for iPhone',heroLineOne:'You, up front.',heroLineTwo:'The world behind.',heroDescription:'Record what you see and how it feels to be there. One tap keeps both sides of the same moment.',watch:'Watch the sample',sceneTitle:'One phone, two perspectives',sceneHint:'Drag to turn the phone',orbit:'Rotate',front:'Front',rear:'Rear',explode:'Explode',statusOrbit:'Rotating',statusFront:'Front camera · You',statusRear:'Rear camera · Your view',statusExplode:'Layers separated',statusManual:'Drag to explore',frontLabel:'Front camera',rearLabel:'Rear Main camera',chapterFilm:'CAMERA SAMPLE',filmHeading:'One moment, both sides.',filmDescription:'The rear camera follows a boat in Phnom Penh while the front camera catches the filmer’s reaction.',rearView:'Rear · The river',frontView:'Front · The filmer',mediaNote:'Phnom Penh · Concept footage',chapterBuild:'BUILD LOG',buildHeading:'Built in public.',buildDescription:'Every release has a page to keep what changed, why it changed, and what it looked like.',chapterJar:'REVENUE GOAL',jarHeading:'The savings jar',privacy:'Privacy',terms:'Terms',fallback:'3D rotation is unavailable in this browser',close:'Close',controls:'Model views',videoLabel:'Phnom Penh dual-camera sample',navigation:'Site navigation',title:'DualCam | Record front and rear cameras together',description:'DualCam records the view and your reaction with the front and rear cameras of one iPhone.'
  },
  th: {
    navFilm:'ตัวอย่าง',navBuild:'บันทึกการพัฒนา',navJar:'รายได้',language:'ภาษา',kicker:'บันทึกกล้องหน้าและหลังบน iPhone',heroLineOne:'กล้องหน้าเห็นคุณ',heroLineTwo:'กล้องหลังเห็นโลก',heroDescription:'ถ่ายภาพตรงหน้าและปฏิกิริยาของคุณพร้อมกัน เก็บทั้งสองมุมมองไว้ในวิดีโอเดียว',watch:'ดูวิดีโอตัวอย่าง',sceneTitle:'โทรศัพท์เครื่องเดียว สองมุมมอง',sceneHint:'ลากเพื่อหมุนโทรศัพท์',orbit:'หมุน',front:'กล้องหน้า',rear:'กล้องหลัง',explode:'แยกชิ้นส่วน',statusOrbit:'กำลังหมุน',statusFront:'กล้องหน้า · คุณ',statusRear:'กล้องหลัง · มุมมองของคุณ',statusExplode:'แสดงชิ้นส่วน',statusManual:'ลากเพื่อดูมุมอื่น',frontLabel:'กล้องหน้า',rearLabel:'กล้องหลักด้านหลัง',chapterFilm:'วิดีโอตัวอย่าง',filmHeading:'ช่วงเวลาเดียว สองมุมมอง',filmDescription:'กล้องหลังถ่ายเรือในพนมเปญ ส่วนกล้องหน้าบันทึกปฏิกิริยาของผู้ถ่าย',rearView:'กล้องหลัง · แม่น้ำ',frontView:'กล้องหน้า · ผู้ถ่าย',mediaNote:'พนมเปญ · วิดีโอจำลอง',chapterBuild:'บันทึกการพัฒนา',buildHeading:'บันทึกแต่ละก้าว',buildDescription:'แต่ละเวอร์ชันมีหน้าของตัวเอง เพื่อบันทึกสิ่งที่เปลี่ยนและเหตุผล',chapterJar:'เป้าหมายรายได้',jarHeading:'กระปุกออมสิน',privacy:'ความเป็นส่วนตัว',terms:'ข้อกำหนด',fallback:'เบราว์เซอร์นี้ไม่รองรับการหมุนสามมิติ',close:'ปิด',controls:'มุมมองโมเดล',videoLabel:'ตัวอย่างกล้องคู่ในพนมเปญ',navigation:'เมนูเว็บไซต์',title:'DualCam | บันทึกกล้องหน้าและหลังพร้อมกัน',description:'บันทึกวิวและปฏิกิริยาของคุณพร้อมกันด้วยกล้องหน้าและหลังของ iPhone เครื่องเดียว'
  }
};

const modelWords = {
  zh:{silver:'银色',red:'概念红',finish:'机身配色',pigSpin:'旋转',pigStop:'停转',pigHint:'可拖动旋转',pigLabel:'3D 小猪存钱罐',pigControlLabel:'存钱罐演示控制'},
  en:{silver:'Silver',red:'Concept red',finish:'Phone finish',pigSpin:'Rotate',pigStop:'Stop',pigHint:'Drag to rotate',pigLabel:'3D piggy bank',pigControlLabel:'Piggy bank demo controls'},
  th:{silver:'สีเงิน',red:'แดง (แนวคิด)',finish:'สีตัวเครื่อง',pigSpin:'หมุน',pigStop:'หยุด',pigHint:'ลากเพื่อหมุน',pigLabel:'กระปุกหมู 3 มิติ',pigControlLabel:'ตัวควบคุมการสาธิต'}
};
for(const locale of Object.keys(words)) Object.assign(words[locale],modelWords[locale]);

const cashWords={
  zh:{play:'重播投钱',busy:'正在投放',full:'预览达标',reset:'回到实际',take:'播放取出',current:'当前所得',deposit:'正在落入',goal:'达标效果预览',withdraw:'正在取出',withdrawn:'取出演示完成',fallback:'3D 暂不可用'},
  en:{play:'Replay deposit',busy:'Depositing',full:'Preview full',reset:'Show actual',take:'Play withdrawal',current:'Actual proceeds',deposit:'Depositing',goal:'Goal preview',withdraw:'Taking cash out',withdrawn:'Withdrawal preview complete',fallback:'3D unavailable'},
  th:{play:'เล่นการหยอดเงินซ้ำ',busy:'กำลังหยอดเงิน',full:'ดูตัวอย่างเมื่อเต็ม',reset:'กลับสู่ยอดจริง',take:'เล่นภาพการนำเงินออก',current:'รายได้จริง',deposit:'กำลังหยอดเงิน',goal:'ตัวอย่างเมื่อถึงเป้าหมาย',withdraw:'กำลังนำเงินออก',withdrawn:'จบการจำลองนำเงินออก',fallback:'ไม่สามารถแสดง 3 มิติ'}
};

const content = {
  zh: {
    navFeatures:'功能',download:'在 App Store 下载',featuresTitle:'两个视角，由你安排。',layoutsVideo:'看布局演示 ↗',
    photo:'前后双摄',photoBody:'一张照片或一段视频，保留镜头前后的两个画面。',
    layouts:'自由布局',layoutsBody:'用画中画保留表情，也可以选上下或左右分屏。',
    prompter:'提词器 · Pro',prompterBody:'录制时读稿，可编辑台词和调整滚动速度。',
    releaseTitle:'DualCam 2.3 · 版本故事',releaseBody:'双摄设置、横屏构图与创作工具',storeHistory:'App Store 版本历史',storeHistoryBody:'查阅已发布版本的更新记录',
    jarIntent:'我和儿子小波罗约好，等 DualCam 攒到 ¥10,000，我们就取出这笔钱，启动采购计划。',
    guidesLabel:'使用指南',guidesTitle:'从一段短视频开始。',guideRecord:'如何同时录制前后摄像头',guideLayouts:'如何选择双摄布局',guideDuo:'iPhone Duo 双摄指南',
    faqTitle:'常见问题',faqDevices:'哪些 iPhone 可以使用？',faqDevicesAnswer:'需要支持多摄的 iPhone。可以先在 App Store 查看兼容要求，再试录一段视频。',
    faqPrivacy:'拍摄内容会上传吗？',faqPrivacyAnswer:'拍摄合成和视觉特效都在设备上处理。',
    faqPro:'可以无水印导出吗？',faqProAnswer:'DualCam Pro 支持无水印导出。功能和当地价格可在 App 内查看。',support:'联系支持'
  },
  en: {
    navFeatures:'Features',download:'Download for iPhone',featuresTitle:'Frame it your way.',layoutsVideo:'Watch the layout demo ↗',
    photo:'Front and rear',photoBody:'Keep both sides of the moment in one video or photo.',
    layouts:'Flexible layouts',layoutsBody:'Go picture-in-picture, side by side, or top and bottom.',
    prompter:'Teleprompter · Pro',prompterBody:'Follow an editable script at your own pace while recording.',
    releaseTitle:'DualCam 2.3 · Release story',releaseBody:'Camera settings, landscape framing and creative tools',storeHistory:'App Store version history',storeHistoryBody:'See the updates that have shipped',
    jarIntent:'My son Little Pineapple and I made a pact. When DualCam earns ¥10,000, we’ll take the money out and start buying the things we’ve planned for.',
    guidesLabel:'Guides',guidesTitle:'Start with a short clip.',guideRecord:'Record the front and rear cameras together',guideLayouts:'Choose a dual-camera layout',guideDuo:'Dual capture on iPhone Duo',
    faqTitle:'Common questions',faqDevices:'Which iPhones work with DualCam?',faqDevicesAnswer:'You’ll need an iPhone that supports multi-camera capture. Check App Store compatibility and try a short recording.',
    faqPrivacy:'Are my recordings uploaded?',faqPrivacyAnswer:'Camera compositing and effects are processed on your device.',
    faqPro:'Can I export without a watermark?',faqProAnswer:'DualCam Pro includes watermark-free export. See the app for features and local pricing.',support:'Contact support'
  },
  th: {
    navFeatures:'ฟีเจอร์',download:'ดาวน์โหลดสำหรับ iPhone',featuresTitle:'จัดสองมุมมองในแบบคุณ',layoutsVideo:'ดูวิดีโอสาธิตเลย์เอาต์ ↗',
    photo:'กล้องหน้าและหลัง',photoBody:'เก็บสองมุมมองในภาพถ่ายหรือวิดีโอเดียว',
    layouts:'เลือกเลย์เอาต์ได้',layoutsBody:'เลือกภาพซ้อนภาพ แบ่งจอซ้ายขวา หรือแบ่งจอบนล่าง',
    prompter:'เครื่องอ่านสคริปต์ · Pro',prompterBody:'แก้สคริปต์และปรับความเร็วในการเลื่อนข้อความขณะบันทึก',
    releaseTitle:'DualCam 2.3 · เรื่องราวเวอร์ชัน',releaseBody:'การตั้งค่ากล้อง การจัดเฟรมแนวนอน และเครื่องมือสร้างสรรค์',storeHistory:'ประวัติเวอร์ชันบน App Store',storeHistoryBody:'ดูรายการอัปเดตที่เผยแพร่แล้ว',
    jarIntent:'ผมกับลูกชายชื่อเล่นเสี่ยวโปหลัวตกลงกันว่า เมื่อ DualCam เก็บเงินได้ ¥10,000 เราจะนำเงินออกมาและเริ่มซื้อของตามที่วางแผนไว้',
    guidesLabel:'คู่มือ',guidesTitle:'เริ่มด้วยคลิปสั้น ๆ',guideRecord:'วิธีบันทึกด้วยกล้องหน้าและหลังพร้อมกัน',guideLayouts:'วิธีเลือกเลย์เอาต์กล้องคู่',guideDuo:'คู่มือกล้องคู่สำหรับ iPhone Duo',
    faqTitle:'คำถามที่พบบ่อย',faqDevices:'รองรับ iPhone รุ่นไหนบ้าง',faqDevicesAnswer:'ต้องใช้ iPhone ที่รองรับการถ่ายด้วยหลายกล้อง ดูความเข้ากันได้ใน App Store แล้วลองบันทึกคลิปสั้น ๆ',
    faqPrivacy:'วิดีโอที่ถ่ายถูกอัปโหลดไหม',faqPrivacyAnswer:'การรวมภาพและเอฟเฟกต์ประมวลผลบนอุปกรณ์ของคุณ',
    faqPro:'ส่งออกแบบไม่มีลายน้ำได้ไหม',faqProAnswer:'DualCam Pro ส่งออกแบบไม่มีลายน้ำได้ ดูฟีเจอร์และราคาท้องถิ่นในแอป',support:'ติดต่อฝ่ายสนับสนุน'
  }
};

const labels = {
  zh:{
    open:'查看下载与收入 ↗',title:'下载与收入',proceeds:'累计预估所得',daily:'按日',monthly:'按月',downloads:'首次下载',
    estimate:'预估所得',dates:'日期',months:'月份',missing:'报表未取得',ongoing:'截至',partial:'部分日报未取得',
    empty:'等待同步 App Store 销售和趋势日报。',
    method:'来源为苹果「销售和趋势」日报，日期按太平洋时间。所得已扣除苹果佣金与适用税费，并用欧洲央行参考汇率折算为美元。',
    latest:(date,count,money)=>`${date} 最新日报 · ${count} 次首次下载 · ${money}`,
    coverage:(first,last)=>`${first} 至 ${last}`, forecast:date=>`按近 30 天日均所得，预计 ${date} 达标`, reached:'已达标，可以播放取出动画', fx:date=>`人民币进度采用 ${date} 的欧洲央行参考汇率。`
  },
  en:{
    open:'Downloads & revenue ↗',title:'Downloads & revenue',proceeds:'Estimated proceeds to date',daily:'Daily',monthly:'Monthly',downloads:'First-time downloads',
    estimate:'Estimated proceeds',dates:'Date',months:'Month',missing:'Report unavailable',ongoing:'Through',partial:'Some daily reports are missing',
    empty:'Waiting for App Store Sales and Trends reports.',
    method:'Apple Sales and Trends daily reports, dated in Pacific Time. Proceeds are after Apple’s commission and applicable taxes, converted to USD at ECB reference rates.',
    latest:(date,count,money)=>`${date} · ${count} first-time downloads · ${money}`,
    coverage:(first,last)=>`${first} to ${last}`, forecast:date=>`On pace for ${date} using the past 30 days`, reached:'Goal reached. Play the withdrawal.', fx:date=>`CNY progress uses the ECB rate on ${date}.`
  },
  th:{
    open:'ดูยอดดาวน์โหลดและรายได้ ↗',title:'ยอดดาวน์โหลดและรายได้',proceeds:'รายได้สะสมโดยประมาณ',daily:'รายวัน',monthly:'รายเดือน',downloads:'ดาวน์โหลดครั้งแรก',
    estimate:'รายได้โดยประมาณ',dates:'วันที่',months:'เดือน',missing:'ยังไม่ได้รับรายงาน',ongoing:'ถึง',partial:'ขาดรายงานรายวันบางส่วน',
    empty:'กำลังรอรายงาน Sales and Trends จาก App Store',
    method:'อ้างอิงรายงานรายวัน Apple Sales and Trends ตามเวลาแปซิฟิก รายได้หักค่าคอมมิชชัน Apple และภาษีที่เกี่ยวข้อง แล้วแปลงเป็น USD ด้วยอัตราอ้างอิงของ ECB',
    latest:(date,count,money)=>`${date} · ดาวน์โหลดครั้งแรก ${count} ครั้ง · ${money}`,
    coverage:(first,last)=>`${first} ถึง ${last}`, forecast:date=>`คาดว่าจะถึงเป้าหมาย ${date} จากรายได้เฉลี่ย 30 วันล่าสุด`, reached:'ถึงเป้าหมายแล้ว เล่นภาพการนำเงินออกได้', fx:date=>`ยอดเงินหยวนใช้อัตราอ้างอิง ECB ณ ${date}`
  }
};

export function getCopy(locale) {
  if (translations[locale]) return translations[locale];
  const {base}=locales[locale];
  return {ui:words[base], cash:cashWords[base], editorial:content[base], sales:labels[base]};
}
