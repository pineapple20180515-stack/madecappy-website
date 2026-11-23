const entries = {};

function add(locale, ui, scenes) {
  const names = 'language demo gallery notes play pause first second combine stacked side inset artwork cover inner'.split(' ');
  const values = ui.split('|');
  const captions = scenes.split('|');
  if (values.length !== names.length || captions.length !== 9 ||
      [...values, ...captions].some(value => !value.trim())) {
    throw new Error(`Incomplete DualCam 2.4 editorial copy for ${locale}`);
  }
  entries[locale] = {...Object.fromEntries(names.map((name,i)=>[name,values[i]])), captions};
}

add('zh-Hans',
  '语言|动手试试看|商店截图|开发手记|播放演示|暂停|第一拍|第二拍|合成|上下|左右|小窗|商店宣传图使用示例场景。|外屏|内屏',
  '录演唱会与观众反应|聚会碰杯合影|球赛和现场反应|旅行合影|生日聚会|两次拍摄拼成一份|旅行邮戳明信片|爱心小窗和宠物|圣诞明信片');

add('zh-Hant',
  '語言|動手試試|商店圖片|開發手記|播放示範|暫停|第一拍|第二拍|合成|上下|左右|子母畫面|商店宣傳圖使用示例場景。|外螢幕|內螢幕',
  '演唱會和觀眾反應|朋友聚會碰杯|球賽和現場反應|旅行合照|生日聚會|兩次拍攝合成一份|旅行郵戳明信片|愛心小視窗和寵物|聖誕明信片');

const englishUI = 'Language|Try the demo|App Store screenshots|Development notes|Play demo|Pause|First take|Second take|Combine|Stacked|Side by side|Picture in picture|Store artwork uses illustrative scenes.|Cover display|Inner display';
const englishScenes = 'Concert and audience reaction|Friends raising a toast|Match and spectator reaction|Travel portrait|Birthday gathering|Two takes in a single layout|Travel stamp postcard|Pet and heart inset|Christmas postcard';
add('en-US',englishUI,englishScenes);
add('en-GB',englishUI,englishScenes);

add('ko',
  '언어|직접 체험하기|App Store 스크린샷|개발 노트|데모 재생|일시 정지|첫 번째 촬영|두 번째 촬영|합치기|위아래|좌우|작은 창|스토어 이미지에는 예시 장면을 사용했습니다.|커버 디스플레이|내부 디스플레이',
  '공연과 관객 반응|친구들과 건배|경기와 응원|여행 인물 사진|생일 모임|두 장면을 한 레이아웃으로|여행 우표 엽서|반려동물과 하트 창|크리스마스 엽서');

add('th',
  'ภาษา|ลองสาธิต|ภาพหน้าจอ App Store|บันทึกการพัฒนา|เล่นการสาธิต|หยุดชั่วคราว|ถ่ายครั้งแรก|ถ่ายครั้งที่สอง|รวมภาพ|บนล่าง|ซ้ายขวา|ภาพซ้อนภาพ|ภาพโปรโมตใช้ฉากตัวอย่าง|จอนอก|จอด้านใน',
  'คอนเสิร์ตและปฏิกิริยาคนดู|ชนแก้วกับเพื่อน|การแข่งขันและเสียงเชียร์|ภาพบุคคลระหว่างเที่ยว|งานวันเกิด|รวมสองครั้งในเลย์เอาต์เดียว|โปสการ์ดแสตมป์ท่องเที่ยว|สัตว์เลี้ยงในกรอบหัวใจ|โปสการ์ดคริสต์มาส');

add('ja',
  '言語|デモを試す|App Storeのスクリーンショット|開発ノート|デモを再生|一時停止|1回目|2回目|合成|上下|左右|子画面|ストア画像には使用イメージを含みます。|外側画面|内側画面',
  'ライブと観客の表情|友人との乾杯|試合と観客の反応|旅先でのポートレート|誕生日会|2回撮った場面を合成|旅の切手絵はがき|ペットとハートの子画面|クリスマスカード');

add('de',
  'Sprache|Demo ausprobieren|App Store-Screenshots|Entwicklungsnotizen|Demo abspielen|Pause|Erste Aufnahme|Zweite Aufnahme|Kombinieren|Übereinander|Nebeneinander|Bild im Bild|Die Store-Grafiken zeigen Beispielszenen.|Außendisplay|Innendisplay',
  'Konzert und Publikumsreaktion|Mit Freunden anstoßen|Spiel und Reaktion auf der Tribüne|Reiseporträt|Geburtstagsfeier|Zwei Aufnahmen in einem Layout|Reisepostkarte mit Briefmarke|Haustier im Herzfenster|Weihnachtspostkarte');

add('fr',
  'Langue|Essayer la démo|Captures d’écran App Store|Carnet de développement|Lancer la démo|Pause|Première prise|Deuxième prise|Assembler|Superposées|Côte à côte|Image dans l’image|Les visuels du store utilisent des scènes d’illustration.|Écran externe|Écran interne',
  'Concert et réaction du public|Un toast entre amis|Match et réaction en tribune|Portrait de voyage|Fête d’anniversaire|Deux prises dans une disposition|Carte de voyage avec timbre|Animal dans une fenêtre en cœur|Carte de Noël');

add('es',
  'Idioma|Prueba la demo|Capturas del App Store|Notas de desarrollo|Reproducir demo|Pausa|Primera toma|Segunda toma|Combinar|Arriba y abajo|En paralelo|Imagen sobre imagen|Las imágenes de la tienda usan escenas ilustrativas.|Pantalla exterior|Pantalla interior',
  'Concierto y reacción del público|Brindis entre amigos|Partido y reacción en la grada|Retrato de viaje|Fiesta de cumpleaños|Dos tomas en un diseño|Postal de viaje con sello|Mascota en una ventana de corazón|Postal navideña');

add('pt-BR',
  'Idioma|Experimente a demonstração|Capturas da App Store|Notas de desenvolvimento|Reproduzir demonstração|Pausar|Primeira captura|Segunda captura|Combinar|Uma acima da outra|Lado a lado|Imagem sobre imagem|As imagens da loja usam cenas ilustrativas.|Tela externa|Tela interna',
  'Show e reação do público|Brinde entre amigos|Jogo e reação da torcida|Retrato de viagem|Festa de aniversário|Duas capturas em um layout|Cartão de viagem com selo|Pet em uma janela de coração|Cartão de Natal');

add('ar',
  'اللغة|جرّب العرض|لقطات App Store|ملاحظات التطوير|تشغيل العرض|إيقاف مؤقت|اللقطة الأولى|اللقطة الثانية|دمج|أعلى وأسفل|جنبًا إلى جنب|صورة داخل صورة|تستخدم صور المتجر مشاهد توضيحية.|الشاشة الخارجية|الشاشة الداخلية',
  'حفل موسيقي ورد فعل الجمهور|نخب مع الأصدقاء|مباراة ورد فعل المشجعين|صورة في رحلة|حفلة عيد ميلاد|دمج لقطتين في تخطيط واحد|بطاقة سفر بطابع|حيوان أليف في نافذة قلب|بطاقة عيد الميلاد');

add('ru',
  'Язык|Попробовать демо|Скриншоты App Store|Заметки о разработке|Запустить демо|Пауза|Первый кадр|Второй кадр|Объединить|Друг над другом|Рядом|Картинка в картинке|Для изображений в магазине использованы демонстрационные сцены.|Внешний экран|Внутренний экран',
  'Концерт и реакция зрителей|Тост с друзьями|Матч и реакция болельщиков|Портрет в путешествии|День рождения|Два кадра в одном макете|Открытка из путешествия|Питомец в окошке-сердце|Рождественская открытка');

add('id',
  'Bahasa|Coba demonya|Tangkapan layar App Store|Catatan pengembangan|Putar demo|Jeda|Pengambilan pertama|Pengambilan kedua|Gabungkan|Atas dan bawah|Berdampingan|Jendela kecil|Gambar toko menggunakan adegan ilustrasi.|Layar luar|Layar dalam',
  'Konser dan reaksi penonton|Bersulang bersama teman|Pertandingan dan reaksi suporter|Potret perjalanan|Perayaan ulang tahun|Dua pengambilan dalam satu tata letak|Kartu pos perjalanan berperangko|Hewan peliharaan di jendela hati|Kartu pos Natal');

add('ms',
  'Bahasa|Cuba demonstrasi|Tangkapan skrin App Store|Catatan pembangunan|Mainkan demonstrasi|Jeda|Tangkapan pertama|Tangkapan kedua|Gabungkan|Atas dan bawah|Sebelah-menyebelah|Tetingkap kecil|Imej gedung menggunakan adegan ilustrasi.|Skrin luar|Skrin dalam',
  'Konsert dan reaksi penonton|Bersulang bersama rakan|Perlawanan dan reaksi penyokong|Potret perjalanan|Sambutan hari lahir|Dua tangkapan dalam satu susun atur|Poskad perjalanan bercop|Haiwan peliharaan dalam tetingkap hati|Poskad Krismas');

add('vi',
  'Ngôn ngữ|Thử bản mô phỏng|Ảnh chụp màn hình App Store|Ghi chép phát triển|Phát mô phỏng|Tạm dừng|Lần đầu|Lần hai|Ghép lại|Trên dưới|Song song|Hình trong hình|Ảnh trên cửa hàng sử dụng cảnh minh họa.|Màn hình ngoài|Màn hình trong',
  'Buổi diễn và biểu cảm khán giả|Nâng ly cùng bạn bè|Trận đấu và phản ứng của cổ động viên|Chân dung khi du lịch|Tiệc sinh nhật|Ghép hai lần ghi hình vào một bố cục|Bưu thiếp du lịch có tem|Thú cưng trong khung trái tim|Bưu thiếp Giáng sinh');

add('km',
  'ភាសា|សាកល្បងការបង្ហាញ|រូបភាពក្នុង App Store|កំណត់ហេតុអភិវឌ្ឍ|ចាក់ការបង្ហាញ|ផ្អាក|ថតលើកទីមួយ|ថតលើកទីពីរ|បញ្ចូលគ្នា|លើក្រោម|ឆ្វេងស្តាំ|រូបក្នុងរូប|រូបភាពផ្សព្វផ្សាយប្រើឈុតគំរូ។ សម្រាប់ភាសាខ្មែរ បង្ហាញរូប App Store ជាភាសាអង់គ្លេស។|អេក្រង់ខាងក្រៅ|អេក្រង់ខាងក្នុង',
  'ការប្រគុំតន្ត្រី និងទឹកមុខទស្សនិកជន|លើកកែវជាមួយមិត្តភក្តិ|ការប្រកួត និងអ្នកគាំទ្រ|រូបថតពេលធ្វើដំណើរ|ពិធីខួបកំណើត|បញ្ចូលការថតពីរដង|កាតធ្វើដំណើរមានតែម|សត្វចិញ្ចឹមក្នុងស៊ុមបេះដូង|កាតបុណ្យណូអែល');

export const release24Editorial = entries;
