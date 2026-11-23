const labels={
  'zh-Hans':['全部设备','折叠','展开','设备示意'],
  'zh-Hant':['所有裝置','摺疊','展開','裝置示意'],
  'en-US':['All devices','Fold','Unfold','Device illustrations'],
  'en-GB':['All devices','Fold','Unfold','Device illustrations'],
  ja:['すべてのデバイス','折りたたむ','開く','デバイスのイメージ'],
  ko:['모든 기기','접기','펼치기','기기 예시'],
  th:['ทุกอุปกรณ์','พับ','กาง','ภาพจำลองอุปกรณ์'],
  de:['Alle Geräte','Falten','Aufklappen','Geräteillustrationen'],
  fr:['Tous les appareils','Plier','Déplier','Illustrations des appareils'],
  es:['Todos los dispositivos','Plegar','Desplegar','Ilustraciones de dispositivos'],
  'pt-BR':['Todos os dispositivos','Dobrar','Abrir','Ilustrações dos dispositivos'],
  ru:['Все устройства','Сложить','Раскрыть','Иллюстрации устройств'],
  ar:['كل الأجهزة','طي','فتح','صور توضيحية للأجهزة'],
  id:['Semua perangkat','Lipat','Buka lipatan','Ilustrasi perangkat'],
  ms:['Semua peranti','Lipat','Buka lipatan','Ilustrasi peranti'],
  vi:['Tất cả thiết bị','Gập','Mở','Hình minh họa thiết bị'],
  km:['ឧបករណ៍ទាំងអស់','បត់','បើក','រូបតំណាងឧបករណ៍'],
};

export const getDeviceWords=locale=>labels[locale];
