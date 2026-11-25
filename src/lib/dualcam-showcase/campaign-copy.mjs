const labels = [
  'title', 'mainland', 'overseas', 'countdown', 'remaining', 'ends', 'updated', 'closed', 'soldOut',
  'download', 'claim', 'onXiaohongshu', 'onX', 'redeem', 'redeemHelp', 'guide',
];

const strings = {
  'zh-Hans': [
    '100 份终身会员免费领取', '中国大陆', '海外', '距活动结束', '剩余 {n} 份', '截止时间', '名额更新', '活动已结束', '名额已领完',
    '下载 DualCam', '领取兑换码', '关注小红书账号，私信', '打开 DinoAI 的 X 主页，查看领取方式。', '兑换终身会员',
    '在 DualCam 打开「设置 → 意见反馈 → 兑换优惠码」。输入码并确认免费兑换。回到 Pro 页点「恢复购买」，显示「永久买断 · 已拥有」即可使用会员功能。', '查看图文兑换步骤',
  ],
  'zh-Hant': [
    '100 份終身會員免費領取', '中國大陸', '海外', '距活動結束', '剩餘 {n} 份', '截止時間', '名額更新', '活動已結束', '名額已領完',
    '下載 DualCam', '領取兌換碼', '追蹤小紅書帳號，私訊', '開啟 DinoAI 的 X 主頁，查看領取方式。', '兌換終身會員',
    '在 DualCam 開啟「設定 → 意見回饋 → 兌換優惠碼」。輸入代碼並確認免費兌換。回到 Pro 頁面點選「恢復購買」。看到終身會員已擁有，即可使用會員功能。', '查看圖文兌換步驟',
  ],
  'en-US': [
    'Claim 100 free lifetime memberships', 'Mainland China', 'International', 'Time left', '{n} spots left', 'Ends', 'Stock updated', 'Giveaway ended', 'All spots claimed',
    'Download DualCam', 'Get a code', 'Follow on Xiaohongshu and send the message', 'Visit DinoAI on X for claiming instructions.', 'Redeem lifetime Pro',
    'In DualCam, open Settings → Feedback → Redeem Offer Code. Enter your code and confirm the free offer. On the Pro screen, tap Restore Purchases. Your Pro features are ready once Lifetime is shown as owned.', 'See the illustrated guide',
  ],
  th: [
    'รับสมาชิกตลอดชีพฟรี 100 สิทธิ์', 'จีนแผ่นดินใหญ่', 'ต่างประเทศ', 'เวลาที่เหลือ', 'เหลือ {n} สิทธิ์', 'สิ้นสุด', 'อัปเดตจำนวนสิทธิ์', 'กิจกรรมสิ้นสุดแล้ว', 'ครบจำนวนสิทธิ์แล้ว',
    'ดาวน์โหลด DualCam', 'รับรหัส', 'ติดตามบัญชี Xiaohongshu แล้วส่งข้อความ', 'ไปที่โปรไฟล์ DinoAI บน X เพื่อดูวิธีรับรหัส', 'แลกสมาชิก Pro ตลอดชีพ',
    'ใน DualCam เปิดการตั้งค่า → ความคิดเห็น → แลกรหัสข้อเสนอ กรอกรหัสและยืนยันข้อเสนอฟรี จากนั้นแตะกู้คืนการซื้อในหน้า Pro เมื่อแสดงว่าเป็นเจ้าของสิทธิ์ตลอดชีพก็ใช้ฟีเจอร์ Pro ได้', 'ดูคู่มือพร้อมภาพ',
  ],
  ja: [
    '永久会員を100名に無料プレゼント', '中国本土', '海外', '終了まで', '残り{n}枠', '締め切り', '残数更新', 'キャンペーンは終了しました', '配布枠は終了しました',
    'DualCamをダウンロード', 'コードを受け取る', '小紅書のアカウントをフォローし、次のメッセージを送信', 'XのDinoAIプロフィールで受け取り方を確認できます。', '永久Proを引き換える',
    'DualCamで「設定 → フィードバック → オファーコードを引き換える」を開き、コードを入力して無料オファーを確定します。Pro画面で「購入を復元」をタップし、永久版が購入済みと表示されたら利用できます。', '画像付きガイドを見る',
  ],
  de: [
    '100 kostenlose lebenslange Mitgliedschaften', 'Chinesisches Festland', 'International', 'Noch verbleibend', '{n} Plätze frei', 'Aktionsende', 'Kontingent aktualisiert', 'Aktion beendet', 'Alle Plätze vergeben',
    'DualCam herunterladen', 'Code erhalten', 'Folge dem Konto auf Xiaohongshu und sende die Nachricht', 'Auf dem X-Profil von DinoAI findest du die Teilnahmeinfos.', 'Lebenslanges Pro einlösen',
    'Öffne in DualCam Einstellungen → Feedback → Angebotscode einlösen. Gib den Code ein und bestätige das kostenlose Angebot. Tippe auf der Pro-Seite auf „Käufe wiederherstellen“. Sobald die lebenslange Mitgliedschaft als vorhanden angezeigt wird, sind die Pro-Funktionen freigeschaltet.', 'Bildanleitung ansehen',
  ],
  fr: [
    '100 abonnements à vie offerts', 'Chine continentale', 'International', 'Temps restant', '{n} places restantes', 'Fin de l’offre', 'Disponibilité mise à jour', 'Offre terminée', 'Toutes les places sont prises',
    'Télécharger DualCam', 'Obtenir un code', 'Suivez le compte sur Xiaohongshu et envoyez le message', 'Consultez le profil de DinoAI sur X pour savoir comment obtenir un code.', 'Activer Pro à vie',
    'Dans DualCam, ouvrez Réglages → Commentaires → Utiliser un code d’offre. Saisissez le code et confirmez l’offre gratuite. Sur la page Pro, touchez « Restaurer les achats ». Les fonctions Pro sont disponibles dès que l’accès à vie apparaît comme acquis.', 'Voir le guide illustré',
  ],
  es: [
    '100 membresías de por vida gratis', 'China continental', 'Internacional', 'Tiempo restante', 'Quedan {n} plazas', 'Fin de la promoción', 'Cupo actualizado', 'Promoción finalizada', 'Todas las plazas están asignadas',
    'Descargar DualCam', 'Conseguir un código', 'Sigue la cuenta en Xiaohongshu y envía el mensaje', 'Visita el perfil de DinoAI en X para saber cómo conseguir un código.', 'Canjear Pro de por vida',
    'En DualCam, abre Ajustes → Comentarios → Canjear código de oferta. Introduce el código y confirma la oferta gratuita. En la pantalla Pro, pulsa «Restaurar compras». Cuando el acceso de por vida aparezca como adquirido, se activarán las funciones Pro.', 'Ver la guía ilustrada',
  ],
  'pt-BR': [
    '100 acessos vitalícios grátis', 'China continental', 'Internacional', 'Tempo restante', 'Restam {n} vagas', 'Fim da campanha', 'Vagas atualizadas', 'Campanha encerrada', 'Todas as vagas foram preenchidas',
    'Baixar DualCam', 'Obter um código', 'Siga a conta no Xiaohongshu e envie a mensagem', 'Acesse o perfil do DinoAI no X para saber como obter um código.', 'Resgatar o Pro vitalício',
    'No DualCam, abra Configurações → Feedback → Resgatar código da oferta. Digite o código e confirme a oferta gratuita. Na tela Pro, toque em “Restaurar compras”. Quando o acesso vitalício aparecer como adquirido, os recursos Pro estarão disponíveis.', 'Ver o guia ilustrado',
  ],
  id: [
    '100 keanggotaan seumur hidup gratis', 'Tiongkok Daratan', 'Internasional', 'Waktu tersisa', 'Tersisa {n} kuota', 'Berakhir', 'Kuota diperbarui', 'Promosi berakhir', 'Kuota habis',
    'Unduh DualCam', 'Dapatkan kode', 'Ikuti akun Xiaohongshu dan kirim pesan', 'Buka profil DinoAI di X untuk melihat cara mendapatkan kode.', 'Tukarkan Pro seumur hidup',
    'Di DualCam, buka Pengaturan → Masukan → Tukarkan Kode Penawaran. Masukkan kode dan konfirmasi penawaran gratis. Di halaman Pro, ketuk “Pulihkan Pembelian”. Setelah akses seumur hidup ditampilkan sebagai dimiliki, fitur Pro siap digunakan.', 'Lihat panduan bergambar',
  ],
  ms: [
    '100 keahlian seumur hidup percuma', 'Tanah Besar China', 'Antarabangsa', 'Baki masa', 'Baki {n} tempat', 'Tamat pada', 'Kuota dikemas kini', 'Promosi tamat', 'Semua tempat telah diambil',
    'Muat turun DualCam', 'Dapatkan kod', 'Ikuti akaun Xiaohongshu dan hantar mesej', 'Lawati profil DinoAI di X untuk mengetahui cara mendapatkan kod.', 'Tebus Pro seumur hidup',
    'Dalam DualCam, buka Tetapan → Maklum balas → Tebus Kod Tawaran. Masukkan kod dan sahkan tawaran percuma. Pada halaman Pro, ketik “Pulihkan Pembelian”. Ciri Pro tersedia apabila akses seumur hidup dipaparkan sebagai dimiliki.', 'Lihat panduan bergambar',
  ],
  vi: [
    '100 suất thành viên trọn đời miễn phí', 'Trung Quốc đại lục', 'Quốc tế', 'Thời gian còn lại', 'Còn {n} suất', 'Hạn chót', 'Cập nhật số suất', 'Chương trình đã kết thúc', 'Đã hết suất',
    'Tải DualCam', 'Nhận mã', 'Theo dõi tài khoản Xiaohongshu và nhắn', 'Vào trang cá nhân DinoAI trên X để xem cách nhận mã.', 'Đổi mã Pro trọn đời',
    'Trong DualCam, mở Cài đặt → Phản hồi → Đổi mã ưu đãi. Nhập mã và xác nhận ưu đãi miễn phí. Trên trang Pro, chọn “Khôi phục giao dịch mua”. Khi quyền trọn đời hiển thị là đã sở hữu, bạn có thể dùng các tính năng Pro.', 'Xem hướng dẫn bằng hình ảnh',
  ],
  ru: [
    '100 бесплатных пожизненных доступов', 'Материковый Китай', 'Другие страны и регионы', 'До конца акции', 'Осталось мест: {n}', 'Окончание акции', 'Остаток обновлён', 'Акция завершена', 'Все места заняты',
    'Скачать DualCam', 'Получить код', 'Подпишитесь на аккаунт в Xiaohongshu и отправьте сообщение', 'Условия получения кода есть в профиле DinoAI в X.', 'Активировать пожизненный Pro',
    'В DualCam откройте «Настройки → Обратная связь → Активировать код предложения». Введите код и подтвердите бесплатное предложение. На экране Pro нажмите «Восстановить покупки». Когда отобразится пожизненный доступ, функции Pro будут доступны.', 'Посмотреть инструкцию с изображениями',
  ],
  ko: [
    '평생 멤버십 100개 무료 제공', '중국 본토', '해외', '남은 시간', '{n}개 남음', '마감', '잔여 수량 업데이트', '이벤트 종료', '준비된 수량이 모두 소진되었습니다',
    'DualCam 다운로드', '코드 받기', '샤오홍슈 계정을 팔로우하고 다음 메시지를 보내세요', 'X의 DinoAI 프로필에서 코드 받는 방법을 확인하세요.', '평생 Pro 활성화',
    'DualCam에서 설정 → 의견 보내기 → 혜택 코드 교환을 엽니다. 코드를 입력하고 무료 혜택을 확인하세요. Pro 화면에서 ‘구매 복원’을 누르고 평생 이용권 보유가 표시되면 Pro 기능을 사용할 수 있습니다.', '이미지 안내 보기',
  ],
  km: [
    'សមាជិកភាពពេញមួយជីវិតឥតគិតថ្លៃ 100 កន្លែង', 'ចិនដីគោក', 'អន្តរជាតិ', 'ពេលវេលានៅសល់', 'នៅសល់ {n} កន្លែង', 'ថ្ងៃផុតកំណត់', 'បានធ្វើបច្ចុប្បន្នភាពចំនួន', 'កម្មវិធីបានបញ្ចប់', 'អស់កន្លែងហើយ',
    'ទាញយក DualCam', 'ទទួលលេខកូដ', 'តាមដានគណនី Xiaohongshu ហើយផ្ញើសារ', 'ចូលមើលប្រវត្តិរូប DinoAI លើ X ដើម្បីដឹងពីរបៀបទទួលលេខកូដ។', 'ប្ដូរយក Pro ពេញមួយជីវិត',
    'ក្នុង DualCam សូមបើក ការកំណត់ → មតិយោបល់ → ប្ដូរលេខកូដ។ បញ្ចូលលេខកូដ និងបញ្ជាក់ការផ្តល់ជូនឥតគិតថ្លៃ។ នៅទំព័រ Pro ចុចស្ដារការទិញ។ ពេលឃើញថាបានកាន់កាប់សិទ្ធិពេញមួយជីវិត អ្នកអាចប្រើមុខងារ Pro បាន។', 'មើលការណែនាំជារូបភាព',
  ],
  ar: [
    '100 عضوية مدى الحياة مجانًا', 'برّ الصين الرئيسي', 'دولي', 'الوقت المتبقي', 'المتبقي {n}', 'موعد الانتهاء', 'آخر تحديث للعدد', 'انتهت الحملة', 'نفدت العضويات المتاحة',
    'تنزيل DualCam', 'الحصول على رمز', 'تابع حساب Xiaohongshu وأرسل الرسالة', 'زُر الملف الشخصي لـ DinoAI على X لمعرفة طريقة الحصول على الرمز.', 'استرداد Pro مدى الحياة',
    'في DualCam، افتح الإعدادات ← الملاحظات ← استرداد رمز العرض. أدخل الرمز وأكّد العرض المجاني. في صفحة Pro، اضغط على «استعادة المشتريات». يمكنك استخدام مزايا Pro عند ظهور العضوية مدى الحياة على أنها مملوكة.', 'عرض الدليل المصوّر',
  ],
};

export function campaignCopy(locale) {
  const values = strings[locale === 'en-GB' ? 'en-US' : locale];
  if (values?.length !== labels.length) throw new Error('Incomplete campaign copy for ' + locale);
  return Object.fromEntries(labels.map((label, index) => [label, values[index]]));
}
