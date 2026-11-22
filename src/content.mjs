// Saytdagi barcha matnlar: uz (asosiy), ru, en.
// {brand}, {city}, {hours} build vaqtida site.config.json dan to'ldiriladi.

export const brands = {
  robots: ['ABB', 'KUKA', 'FANUC', 'Yaskawa', 'Kawasaki', 'Estun', 'Efort'],
  german: ['Siemens', 'Bosch Rexroth', 'Festo', 'SEW-Eurodrive', 'Lenze', 'Beckhoff', 'Pilz', 'Heidenhain', 'Trumpf'],
  chinese: ['Inovance', 'Delta', 'INVT', 'Haitian', 'Hikvision', 'Kinco', 'Leadshine'],
  other: ['Schneider Electric', 'Mitsubishi Electric', 'Omron', 'Danfoss']
};

export const content = {
  uz: {
    htmlLang: 'uz',
    ogLocale: 'uz_UZ',
    langName: 'O‘zbekcha',
    langShort: 'UZ',
    meta: {
      title: 'ABB va KUKA robotlarini ta’mirlash, sanoat uskunalari servisi | {brand}',
      description: 'ABB va KUKA sanoat robotlarini ta’mirlash va servis, Xitoy va Germaniya uskunalarini remont qilish, sanoat elektronikasi, chastota o‘zgartirgich va servo drayverlarni tiklash, ishlab chiqarish hujjatlarini avtomatlashtirish. {city} va butun O‘zbekiston bo‘ylab.',
      keywords: 'ABB robot ta’mirlash, KUKA robot servis, sanoat robotlari remonti, robot ta’miri Toshkent, sanoat uskunalari ta’mirlash, Xitoy uskunalari remonti, nemis uskunalari servisi, Siemens PLC dasturlash, chastota o‘zgartirgich ta’mirlash, inverter remonti, servo drayver ta’mirlash, elektron plata ta’mirlash, sanoat elektronikasi, uskuna nosozligini tez bartaraf qilish, avariya servisi, texnik xizmat ko‘rsatish, profilaktik ta’mirlash, ishlab chiqarishni avtomatlashtirish, hujjatlarni raqamlashtirish, CNC stanok ta’miri, IRC5, KR C4, O‘zbekiston'
    },
    a11y: { skip: 'Asosiy mazmunga o‘tish', menu: 'Menyu', theme: 'Yorug‘ yoki qorong‘i rejim', lang: 'Til', close: 'Yopish', copy: 'Nusxa olish', copied: 'Nusxa olindi' },
    nav: { services: 'Xizmatlar', process: 'Ish tartibi', industries: 'Sohalar', faq: 'Savollar', contact: 'Aloqa', cta: 'Ariza qoldirish' },
    hero: {
      tbDrawing: 'Chizma', tbEngineer: 'Muhandis', tbScale: 'Masshtab',
      eyebrow: 'Sanoat robotlari · Elektronika · Avtomatlashtirish',
      h1a: 'Uskuna to‘xtadimi?',
      h1b: 'Tez tiklaymiz.',
      lead: 'ABB va KUKA sanoat robotlari, Xitoy va Germaniya uskunalari, sanoat elektronikasi bo‘yicha diagnostika, ta’mirlash va servis. Ishlab chiqarish hujjatlarini onlayn tizimga o‘tkazib, jarayonni aniq va nazoratli qilamiz.',
      cta1: 'Muammoni yuborish',
      cta2: 'Xizmatlarni ko‘rish',
      badges: ['{hours} soat ichida birinchi javob', 'Masofaviy va joyida', 'Yozma hisobot va kafolat']
    },
    term: { title: 'diagnostika jurnali', status: 'tiklandi' },
    stats: [
      { v: 24, s: '/7', l: 'arizalar qabul qilinadi' },
      { v: '{hours}', s: ' soat', l: 'ichida birinchi javob' },
      { v: 30, s: '+', l: 'uskuna brendi bilan ish' },
      { v: '{wm}', s: ' oy', l: 'bajarilgan ishga kafolat' }
    ],
    services: {
      eyebrow: 'Xizmatlar',
      title: 'Liniyangiz qayta ishlashi uchun kerak bo‘lgan hamma narsa',
      lead: 'Bitta muhandis bilan: robotdan tortib plata va hujjatlargacha. Har bir ish diagnostikadan boshlanadi va hisobot bilan tugaydi.',
      items: [
        { icon: 'robot', title: 'ABB va KUKA robotlari servisi', text: 'IRC5, OmniCore, KR C4, KR C5 kontrollerlari. Xato kodlarini tahlil qilish, mastering va kalibrovka, backup va tiklash, reduktor, servo motor va kabel paketlarini almashtirish, RAPID va KRL dasturlarini tuzatish.', tags: ['IRC5', 'OmniCore', 'KR C4', 'KR C5'] },
        { icon: 'gear', title: 'Xitoy va Germaniya uskunalari remonti', text: 'Qadoqlash liniyalari, termoplast avtomatlari, CNC stanoklar, konveyerlar va ekstruderlar. Siemens, Bosch Rexroth, Festo, Inovance, Delta va boshqa brendlar.', tags: ['CNC', 'Qadoqlash', 'Termoplast'] },
        { icon: 'chip', title: 'Sanoat elektronikasi', text: 'Chastota o‘zgartirgichlar, servo drayverlar, quvvat bloklari, HMI panellar va enkoderlarni komponent darajasida ta’mirlash. Plata diagnostikasi va qayta tiklash.', tags: ['Inverter', 'Servo', 'HMI', 'Plata'] },
        { icon: 'bolt', title: 'Nosozlikni tezkor bartaraf qilish', text: 'Liniya to‘xtaganda avval masofadan yordam beramiz, kerak bo‘lsa joyiga chiqamiz. Maqsad: to‘xtab qolish vaqtini qisqartirish va asl sababni topish.', tags: ['Avariya chaqiruvi', 'Masofaviy yordam'] },
        { icon: 'doc', title: 'Hujjatlarni avtomatlashtirish', text: 'Smena hisobotlari, texnik xizmat jurnallari, nazorat varaqalari va uskuna pasportlarini onlayn tizimga o‘tkazamiz. QR kodli pasport, ehtiyot qismlar hisobi, OEE va to‘xtashlar tahlili.', tags: ['Raqamlashtirish', 'QR pasport', 'OEE'] },
        { icon: 'wrench', title: 'Texnik xizmat ko‘rsatish', text: 'Profilaktik xizmat shartnomalari, uskunani o‘rnatish va ishga tushirish, ko‘chirish, texnik audit va holat bahosi. Rejalashtirilgan xizmat kutilmagan to‘xtashlarni kamaytiradi.', tags: ['Profilaktika', 'Ishga tushirish', 'Audit'] }
      ]
    },
    extra: {
      eyebrow: 'Qo‘shimcha xizmatlar',
      title: 'Kengaytirilgan yechimlar',
      items: [
        { title: 'PLC, HMI va SCADA', text: 'Siemens S7, TIA Portal, Delta, Inovance dasturlash va eskirgan tizimlarni modernizatsiya qilish (retrofit).' },
        { title: 'Masofaviy monitoring', text: 'Datchiklar va IIoT orqali uskuna holatini kuzatish, nosozlikdan oldin ogohlantirish.' },
        { title: 'Ehtiyot qismlar', text: 'Xitoy va Yevropadan original yoki mos ehtiyot qismlarni topish va yetkazishda yordam.' },
        { title: 'Xodimlarni o‘qitish', text: 'Operator va texniklar uchun robot va uskunadan to‘g‘ri foydalanish, xavfsizlik va birlamchi diagnostika.' }
      ]
    },
    brandsBlock: { title: 'Ishlaydigan brendlar', note: 'Brend nomlari ularning egalariga tegishli. {brand} mustaqil servis xizmati bo‘lib, ishlab chiqaruvchilarning rasmiy vakili emas.' },
    process: {
      eyebrow: 'Ish tartibi',
      title: 'Arizadan ishlaydigan liniyagacha 4 qadam',
      steps: [
        { title: 'Ariza', text: 'Xato kodi, uskuna modeli va muammoning foto yoki videosini yuborasiz.' },
        { title: 'Diagnostika va narx', text: 'Masofadan dastlabki tahlil qilamiz, ish hajmi va narxini oldindan kelishamiz.' },
        { title: 'Ta’mirlash', text: 'Joyida yoki ustaxonada ta’mirlaymiz, sinovdan o‘tkazamiz.' },
        { title: 'Hisobot va kafolat', text: 'Bajarilgan ish, almashtirilgan qismlar va tavsiyalar yozma hisobotda. Ishga kafolat beriladi.' }
      ]
    },
    industries: {
      eyebrow: 'Sohalar',
      title: 'Qaysi ishlab chiqarishlarga xizmat ko‘rsatamiz',
      items: ['Avtomobil va yig‘uv', 'Oziq-ovqat va qadoqlash', 'Plastmassa va polimer', 'Metallga ishlov berish va payvandlash', 'To‘qimachilik', 'Qurilish materiallari', 'Farmatsevtika', 'Logistika va omborlar']
    },
    why: {
      eyebrow: 'Nega biz',
      title: 'Ishlab chiqarish tilida gaplashamiz',
      items: [
        { title: 'Muhandis bilan to‘g‘ridan-to‘g‘ri', text: 'Vositachi va menejerlar yo‘q. Muammoni ta’mirlaydigan odamga aytasiz.' },
        { title: 'Oldindan kelishilgan narx', text: 'Diagnostikadan keyin narx va muddat aytiladi. Kutilmagan qo‘shimcha to‘lovlar yo‘q.' },
        { title: 'Sababni topamiz', text: 'Faqat belgini emas, nosozlik sababini bartaraf qilamiz, takrorlanmasligi uchun tavsiya beramiz.' },
        { title: 'Maxfiylik', text: 'Zavod dasturlari, backup va texnologik ma’lumotlar uchinchi shaxslarga berilmaydi.' }
      ]
    },
    faq: {
      eyebrow: 'Savollar',
      title: 'Ko‘p beriladigan savollar',
      items: [
        { q: 'Qaysi robot va uskunalar bilan ishlaysiz?', a: 'Asosiy yo‘nalish ABB (IRC5, OmniCore) va KUKA (KR C4, KR C5) sanoat robotlari. Shuningdek Siemens, Bosch Rexroth, Festo, Inovance, Delta va boshqa Xitoy hamda Germaniya uskunalari, chastota o‘zgartirgichlar va servo drayverlar.' },
        { q: 'Viloyatlarga chiqasizmi?', a: 'Ha. {city} va butun O‘zbekiston bo‘ylab joyiga chiqamiz. Ko‘p muammolarni avval masofadan, video qo‘ng‘iroq yoki masofaviy ulanish orqali hal qilishga harakat qilamiz.' },
        { q: 'Qancha tez javob berasiz?', a: 'Arizaga {hours} soat ichida javob beramiz. Avariya holatida masofaviy yordam darhol boshlanadi, joyiga chiqish vaqti masofaga bog‘liq.' },
        { q: 'Narx qanday aniqlanadi?', a: 'Dastlabki masofaviy tahlil asosida ish hajmi baholanadi va narx oldindan kelishiladi. Ehtiyot qismlar alohida ko‘rsatiladi.' },
        { q: 'Kafolat berasizmi?', a: 'Ha. Bajarilgan ishga kafolat beriladi, muddati ish turiga qarab hisobotda yoziladi.' },
        { q: 'Hujjatlarni avtomatlashtirish nimani beradi?', a: 'Qog‘oz jurnallar va Excel fayllar o‘rniga yagona onlayn tizim: smena hisobotlari, nosozliklar tarixi, ehtiyot qismlar va xizmat rejasi bir joyda. Rahbar real vaqtda ko‘radi, xatolar va yo‘qolgan ma’lumotlar kamayadi.' }
      ]
    },
    contact: {
      eyebrow: 'Aloqa',
      title: 'Muammoni yozing, yechimini topamiz',
      lead: 'Formani to‘ldiring va qulay kanalni tanlang: xabar Telegram, WhatsApp yoki email orqali tayyor holda ochiladi.',
      name: 'Ismingiz', phone: 'Telefon', company: 'Korxona (ixtiyoriy)', service: 'Xizmat turi', equipment: 'Uskuna va model', equipmentPh: 'Masalan: KUKA KR 210, KR C4', message: 'Muammo tavsifi', messagePh: 'Xato kodi, qachondan beri, nima qilib ko‘rildi',
      choose: 'Tanlang', consent: 'Ma’lumotlarim faqat ushbu murojaatga javob berish uchun ishlatilishiga roziman.',
      sendTg: 'Telegram orqali', sendWa: 'WhatsApp orqali', sendMail: 'Email orqali',
      errName: 'Ismingizni kiriting (kamida 2 harf).', errPhone: 'Telefon raqamini to‘g‘ri kiriting.', errMsg: 'Muammoni qisqacha yozing (kamida 10 belgi).', errConsent: 'Davom etish uchun rozilik belgisini qo‘ying.', errRate: 'Juda tez. Bir necha soniyadan keyin qayta urinib ko‘ring.',
      okTg: 'Xabar matni nusxalandi va Telegram ochilmoqda. Chatga joylashtiring va yuboring.', okTgNoCopy: 'Telegram ochilmoqda. Quyidagi matnni nusxalab yuboring.', okWa: 'WhatsApp tayyor xabar bilan ochilmoqda. Yuborish tugmasini bosing.', okMail: 'Pochta dasturi tayyor xat bilan ochilmoqda.',
      direct: 'Yoki to‘g‘ridan-to‘g‘ri', hours: 'Arizalar 24/7 qabul qilinadi',
      msgHeader: 'Yangi ariza (sayt)', other: 'Boshqa'
    },
    footer: { tagline: 'Sanoat robotlari va uskunalari servisi', rights: 'Barcha huquqlar himoyalangan.', privacyTitle: 'Maxfiylik', privacy: 'Sayt cookie va kuzatuv skriptlaridan foydalanmaydi. Formaga kiritilgan ma’lumotlar serverga yuborilmaydi: ular faqat siz tanlagan Telegram, WhatsApp yoki email orqali bizga yetib keladi va faqat murojaatingizga javob berish uchun ishlatiladi.' },
    notFound: { title: 'Sahifa topilmadi', text: 'Bu manzilda sahifa yo‘q. Bosh sahifaga qayting.', back: 'Bosh sahifa' }
  },

  ru: {
    htmlLang: 'ru',
    ogLocale: 'ru_RU',
    langName: 'Русский',
    langShort: 'RU',
    meta: {
      title: 'Ремонт роботов ABB и KUKA, сервис промышленного оборудования | {brand}',
      description: 'Ремонт и сервис промышленных роботов ABB и KUKA, ремонт китайского и немецкого оборудования, промышленная электроника, ремонт частотных преобразователей и сервоприводов, автоматизация производственной документации. {city} и весь Узбекистан.',
      keywords: 'ремонт роботов ABB, сервис роботов KUKA, ремонт промышленных роботов, ремонт роботов Ташкент, ремонт промышленного оборудования Узбекистан, ремонт китайского оборудования, сервис немецкого оборудования, программирование ПЛК Siemens, ремонт частотных преобразователей, ремонт инверторов, ремонт сервоприводов, ремонт электронных плат, промышленная электроника, срочный ремонт оборудования, аварийный выезд, техническое обслуживание оборудования, автоматизация документооборота производства, цифровизация производства, ремонт станков ЧПУ, IRC5, KR C4'
    },
    a11y: { skip: 'Перейти к содержанию', menu: 'Меню', theme: 'Светлая или тёмная тема', lang: 'Язык', close: 'Закрыть', copy: 'Копировать', copied: 'Скопировано' },
    nav: { services: 'Услуги', process: 'Как работаем', industries: 'Отрасли', faq: 'Вопросы', contact: 'Контакты', cta: 'Оставить заявку' },
    hero: {
      tbDrawing: 'Чертёж', tbEngineer: 'Инженер', tbScale: 'Масштаб',
      eyebrow: 'Промышленные роботы · Электроника · Автоматизация',
      h1a: 'Оборудование встало?',
      h1b: 'Быстро восстановим.',
      lead: 'Диагностика, ремонт и сервис промышленных роботов ABB и KUKA, китайского и немецкого оборудования, промышленной электроники. Переводим производственную документацию в онлайн, чтобы процессы стали точными и прозрачными.',
      cta1: 'Описать проблему',
      cta2: 'Смотреть услуги',
      badges: ['Первый ответ в течение {hours} ч', 'Удалённо и на объекте', 'Письменный отчёт и гарантия']
    },
    term: { title: 'журнал диагностики', status: 'восстановлено' },
    stats: [
      { v: 24, s: '/7', l: 'приём заявок' },
      { v: '{hours}', s: ' ч', l: 'до первого ответа' },
      { v: 30, s: '+', l: 'брендов оборудования' },
      { v: '{wm}', s: ' мес.', l: 'гарантия на работу' }
    ],
    services: {
      eyebrow: 'Услуги',
      title: 'Всё, что нужно, чтобы линия снова работала',
      lead: 'Один инженер: от робота до платы и документации. Каждая работа начинается с диагностики и заканчивается отчётом.',
      items: [
        { icon: 'robot', title: 'Сервис роботов ABB и KUKA', text: 'Контроллеры IRC5, OmniCore, KR C4, KR C5. Анализ кодов ошибок, мастеринг и калибровка, резервное копирование и восстановление, замена редукторов, серводвигателей и кабельных пакетов, правка программ RAPID и KRL.', tags: ['IRC5', 'OmniCore', 'KR C4', 'KR C5'] },
        { icon: 'gear', title: 'Ремонт китайского и немецкого оборудования', text: 'Упаковочные линии, термопластавтоматы, станки ЧПУ, конвейеры и экструдеры. Siemens, Bosch Rexroth, Festo, Inovance, Delta и другие бренды.', tags: ['ЧПУ', 'Упаковка', 'ТПА'] },
        { icon: 'chip', title: 'Промышленная электроника', text: 'Компонентный ремонт частотных преобразователей, сервоусилителей, блоков питания, HMI-панелей и энкодеров. Диагностика и восстановление плат.', tags: ['Инвертор', 'Серво', 'HMI', 'Платы'] },
        { icon: 'bolt', title: 'Срочное устранение неисправностей', text: 'Когда линия стоит, сначала помогаем удалённо, при необходимости выезжаем на объект. Цель: сократить простой и найти первопричину.', tags: ['Аварийный выезд', 'Удалённая помощь'] },
        { icon: 'doc', title: 'Автоматизация документации', text: 'Переводим сменные отчёты, журналы ТО, чек-листы и паспорта оборудования в онлайн-систему. QR-паспорта, учёт запчастей, анализ OEE и простоев.', tags: ['Цифровизация', 'QR-паспорт', 'OEE'] },
        { icon: 'wrench', title: 'Техническое обслуживание', text: 'Договоры планово-предупредительного обслуживания, монтаж и пусконаладка, перенос оборудования, технический аудит и оценка состояния. Плановое ТО снижает внезапные простои.', tags: ['ППР', 'Пусконаладка', 'Аудит'] }
      ]
    },
    extra: {
      eyebrow: 'Дополнительно',
      title: 'Расширенные решения',
      items: [
        { title: 'ПЛК, HMI и SCADA', text: 'Программирование Siemens S7, TIA Portal, Delta, Inovance и модернизация устаревших систем (ретрофит).' },
        { title: 'Удалённый мониторинг', text: 'Контроль состояния оборудования через датчики и IIoT, предупреждение до отказа.' },
        { title: 'Запчасти', text: 'Помощь в подборе и поставке оригинальных или совместимых запчастей из Китая и Европы.' },
        { title: 'Обучение персонала', text: 'Правильная эксплуатация роботов и оборудования, безопасность и первичная диагностика для операторов и техников.' }
      ]
    },
    brandsBlock: { title: 'С чем работаем', note: 'Названия брендов принадлежат их владельцам. {brand} является независимым сервисом и не является официальным представителем производителей.' },
    process: {
      eyebrow: 'Как работаем',
      title: '4 шага от заявки до работающей линии',
      steps: [
        { title: 'Заявка', text: 'Присылаете код ошибки, модель оборудования и фото или видео проблемы.' },
        { title: 'Диагностика и цена', text: 'Проводим удалённый первичный анализ, заранее согласуем объём и стоимость.' },
        { title: 'Ремонт', text: 'Ремонтируем на объекте или в мастерской, проводим испытания.' },
        { title: 'Отчёт и гарантия', text: 'Выполненные работы, заменённые детали и рекомендации в письменном отчёте. На работу даётся гарантия.' }
      ]
    },
    industries: {
      eyebrow: 'Отрасли',
      title: 'Каким производствам помогаем',
      items: ['Автомобильная сборка', 'Пищевая промышленность и упаковка', 'Пластмассы и полимеры', 'Металлообработка и сварка', 'Текстильная промышленность', 'Стройматериалы', 'Фармацевтика', 'Логистика и склады']
    },
    why: {
      eyebrow: 'Почему мы',
      title: 'Говорим на языке производства',
      items: [
        { title: 'Напрямую с инженером', text: 'Без посредников и менеджеров. Вы говорите с тем, кто будет ремонтировать.' },
        { title: 'Цена согласуется заранее', text: 'После диагностики называем стоимость и срок. Без неожиданных доплат.' },
        { title: 'Находим причину', text: 'Устраняем не симптом, а причину неисправности и даём рекомендации, чтобы она не повторилась.' },
        { title: 'Конфиденциальность', text: 'Программы завода, бэкапы и технологические данные не передаются третьим лицам.' }
      ]
    },
    faq: {
      eyebrow: 'Вопросы',
      title: 'Частые вопросы',
      items: [
        { q: 'С какими роботами и оборудованием вы работаете?', a: 'Основное направление: промышленные роботы ABB (IRC5, OmniCore) и KUKA (KR C4, KR C5). Также Siemens, Bosch Rexroth, Festo, Inovance, Delta и другое китайское и немецкое оборудование, частотные преобразователи и сервоприводы.' },
        { q: 'Выезжаете в регионы?', a: 'Да. Работаем на объектах: {city} и весь Узбекистан. Многие проблемы сначала пытаемся решить удалённо: по видеосвязи или через удалённое подключение.' },
        { q: 'Как быстро вы отвечаете?', a: 'Отвечаем на заявку в течение {hours} ч. При аварии удалённая помощь начинается сразу, время выезда зависит от расстояния.' },
        { q: 'Как определяется стоимость?', a: 'По итогам удалённого первичного анализа оцениваем объём работ и заранее согласуем цену. Запчасти указываются отдельно.' },
        { q: 'Даёте гарантию?', a: 'Да. На выполненные работы даётся гарантия, срок указывается в отчёте в зависимости от вида работ.' },
        { q: 'Что даёт автоматизация документации?', a: 'Вместо бумажных журналов и разрозненных Excel-файлов единая онлайн-система: сменные отчёты, история неисправностей, запчасти и план ТО в одном месте. Руководитель видит всё в реальном времени, ошибок и потерянных данных становится меньше.' }
      ]
    },
    contact: {
      eyebrow: 'Контакты',
      title: 'Опишите проблему, найдём решение',
      lead: 'Заполните форму и выберите удобный канал: сообщение откроется готовым в Telegram, WhatsApp или почте.',
      name: 'Ваше имя', phone: 'Телефон', company: 'Компания (необязательно)', service: 'Вид услуги', equipment: 'Оборудование и модель', equipmentPh: 'Например: KUKA KR 210, KR C4', message: 'Описание проблемы', messagePh: 'Код ошибки, с какого момента, что уже пробовали',
      choose: 'Выберите', consent: 'Согласен, что мои данные используются только для ответа на это обращение.',
      sendTg: 'Через Telegram', sendWa: 'Через WhatsApp', sendMail: 'По email',
      errName: 'Введите имя (минимум 2 буквы).', errPhone: 'Введите корректный номер телефона.', errMsg: 'Кратко опишите проблему (минимум 10 символов).', errConsent: 'Отметьте согласие, чтобы продолжить.', errRate: 'Слишком быстро. Попробуйте через несколько секунд.',
      okTg: 'Текст сообщения скопирован, открывается Telegram. Вставьте его в чат и отправьте.', okTgNoCopy: 'Открывается Telegram. Скопируйте текст ниже и отправьте.', okWa: 'WhatsApp открывается с готовым сообщением. Нажмите «Отправить».', okMail: 'Почтовая программа открывается с готовым письмом.',
      direct: 'Или напрямую', hours: 'Заявки принимаются 24/7',
      msgHeader: 'Новая заявка (сайт)', other: 'Другое'
    },
    footer: { tagline: 'Сервис промышленных роботов и оборудования', rights: 'Все права защищены.', privacyTitle: 'Конфиденциальность', privacy: 'Сайт не использует cookie и скрипты слежения. Данные из формы не отправляются на сервер: они попадают к нам только через выбранный вами Telegram, WhatsApp или email и используются только для ответа на ваше обращение.' },
    notFound: { title: 'Страница не найдена', text: 'По этому адресу страницы нет. Вернитесь на главную.', back: 'На главную' }
  },

  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    langName: 'English',
    langShort: 'EN',
    meta: {
      title: 'ABB & KUKA Robot Repair, Industrial Equipment Service | {brand}',
      description: 'Repair and service of ABB and KUKA industrial robots, Chinese and German machinery repair, industrial electronics, VFD and servo drive repair, production document automation. {city} and all of Uzbekistan.',
      keywords: 'ABB robot repair, KUKA robot service, industrial robot repair, robot repair Tashkent, industrial equipment repair Uzbekistan, Chinese machinery repair, German equipment service, Siemens PLC programming, VFD repair, inverter repair, servo drive repair, PCB repair, industrial electronics repair, emergency breakdown service, preventive maintenance, production digitalization, maintenance documentation software, CNC machine repair, IRC5, KR C4'
    },
    a11y: { skip: 'Skip to content', menu: 'Menu', theme: 'Light or dark theme', lang: 'Language', close: 'Close', copy: 'Copy', copied: 'Copied' },
    nav: { services: 'Services', process: 'How it works', industries: 'Industries', faq: 'FAQ', contact: 'Contact', cta: 'Request service' },
    hero: {
      tbDrawing: 'Drawing', tbEngineer: 'Engineer', tbScale: 'Scale',
      eyebrow: 'Industrial robots · Electronics · Automation',
      h1a: 'Line stopped?',
      h1b: 'We get it running.',
      lead: 'Diagnostics, repair and service for ABB and KUKA industrial robots, Chinese and German machinery and industrial electronics. We also move your production paperwork online so every process is accurate and traceable.',
      cta1: 'Describe the problem',
      cta2: 'See services',
      badges: ['First reply within {hours} h', 'Remote and on site', 'Written report and warranty']
    },
    term: { title: 'diagnostic log', status: 'restored' },
    stats: [
      { v: 24, s: '/7', l: 'requests accepted' },
      { v: '{hours}', s: ' h', l: 'to first reply' },
      { v: 30, s: '+', l: 'equipment brands' },
      { v: '{wm}', s: ' months', l: 'warranty on our work' }
    ],
    services: {
      eyebrow: 'Services',
      title: 'Everything your line needs to run again',
      lead: 'One engineer, from the robot to the circuit board and the paperwork. Every job starts with diagnostics and ends with a report.',
      items: [
        { icon: 'robot', title: 'ABB and KUKA robot service', text: 'IRC5, OmniCore, KR C4 and KR C5 controllers. Fault code analysis, mastering and calibration, backup and restore, gearbox, servo motor and dress pack replacement, RAPID and KRL program fixes.', tags: ['IRC5', 'OmniCore', 'KR C4', 'KR C5'] },
        { icon: 'gear', title: 'Chinese and German machinery repair', text: 'Packaging lines, injection molding machines, CNC machines, conveyors and extruders. Siemens, Bosch Rexroth, Festo, Inovance, Delta and more.', tags: ['CNC', 'Packaging', 'Injection molding'] },
        { icon: 'chip', title: 'Industrial electronics', text: 'Component-level repair of VFDs, servo drives, power supplies, HMI panels and encoders. Board diagnostics and restoration.', tags: ['VFD', 'Servo', 'HMI', 'PCB'] },
        { icon: 'bolt', title: 'Rapid troubleshooting', text: 'When the line is down we start with remote help and come on site when needed. The goal is less downtime and the real root cause.', tags: ['Emergency call-out', 'Remote support'] },
        { icon: 'doc', title: 'Document automation', text: 'We move shift reports, maintenance logs, checklists and equipment passports into an online system. QR equipment passports, spare parts tracking, OEE and downtime analysis.', tags: ['Digitalization', 'QR passport', 'OEE'] },
        { icon: 'wrench', title: 'Technical services', text: 'Preventive maintenance contracts, installation and commissioning, relocation, technical audits and condition assessment. Planned maintenance cuts unplanned stops.', tags: ['Preventive', 'Commissioning', 'Audit'] }
      ]
    },
    extra: {
      eyebrow: 'Also available',
      title: 'Extended solutions',
      items: [
        { title: 'PLC, HMI and SCADA', text: 'Siemens S7, TIA Portal, Delta and Inovance programming, plus retrofits of outdated control systems.' },
        { title: 'Remote monitoring', text: 'Condition monitoring with sensors and IIoT, with alerts before a failure.' },
        { title: 'Spare parts', text: 'Help sourcing original or compatible parts from China and Europe.' },
        { title: 'Staff training', text: 'Correct robot and machine operation, safety and first-line diagnostics for operators and technicians.' }
      ]
    },
    brandsBlock: { title: 'Brands we work with', note: 'Brand names belong to their owners. {brand} is an independent service provider and not an official representative of the manufacturers.' },
    process: {
      eyebrow: 'How it works',
      title: '4 steps from request to a running line',
      steps: [
        { title: 'Request', text: 'Send the fault code, equipment model and a photo or video of the problem.' },
        { title: 'Diagnosis and quote', text: 'We do a remote first analysis and agree the scope and price up front.' },
        { title: 'Repair', text: 'We repair on site or in the workshop and test the result.' },
        { title: 'Report and warranty', text: 'Work done, replaced parts and recommendations in a written report. The work is under warranty.' }
      ]
    },
    industries: {
      eyebrow: 'Industries',
      title: 'Who we work for',
      items: ['Automotive and assembly', 'Food and packaging', 'Plastics and polymers', 'Metalworking and welding', 'Textiles', 'Building materials', 'Pharmaceuticals', 'Logistics and warehousing']
    },
    why: {
      eyebrow: 'Why us',
      title: 'We speak the language of production',
      items: [
        { title: 'Direct line to the engineer', text: 'No middlemen or account managers. You talk to the person doing the repair.' },
        { title: 'Price agreed up front', text: 'After diagnostics you get a price and a deadline. No surprise extras.' },
        { title: 'We find the cause', text: 'We fix the cause of the fault, not just the symptom, and advise how to keep it from coming back.' },
        { title: 'Confidentiality', text: 'Your plant programs, backups and process data are never shared with third parties.' }
      ]
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions',
      items: [
        { q: 'Which robots and equipment do you work with?', a: 'Our main focus is ABB (IRC5, OmniCore) and KUKA (KR C4, KR C5) industrial robots. We also service Siemens, Bosch Rexroth, Festo, Inovance, Delta and other Chinese and German equipment, VFDs and servo drives.' },
        { q: 'Do you travel to the regions?', a: 'Yes. We work on site in {city} and across Uzbekistan. Many problems we first try to solve remotely, by video call or remote connection.' },
        { q: 'How fast do you respond?', a: 'We reply to every request within {hours} hours. In an emergency, remote help starts right away; on-site arrival depends on distance.' },
        { q: 'How is the price set?', a: 'After a remote first analysis we estimate the scope and agree the price in advance. Spare parts are listed separately.' },
        { q: 'Do you give a warranty?', a: 'Yes. Completed work is under warranty; the period depends on the type of work and is stated in the report.' },
        { q: 'What does document automation give us?', a: 'One online system instead of paper logs and scattered Excel files: shift reports, fault history, spare parts and the maintenance plan in one place. Managers see everything in real time, with fewer errors and no lost records.' }
      ]
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Describe the problem, we will find the fix',
      lead: 'Fill in the form and pick a channel: your message opens ready to send in Telegram, WhatsApp or email.',
      name: 'Your name', phone: 'Phone', company: 'Company (optional)', service: 'Service', equipment: 'Equipment and model', equipmentPh: 'For example: KUKA KR 210, KR C4', message: 'Problem description', messagePh: 'Fault code, since when, what you have tried',
      choose: 'Choose', consent: 'I agree that my data is used only to reply to this request.',
      sendTg: 'Via Telegram', sendWa: 'Via WhatsApp', sendMail: 'Via email',
      errName: 'Enter your name (at least 2 letters).', errPhone: 'Enter a valid phone number.', errMsg: 'Describe the problem briefly (at least 10 characters).', errConsent: 'Tick the consent box to continue.', errRate: 'Too fast. Try again in a few seconds.',
      okTg: 'Message copied and Telegram is opening. Paste it into the chat and send.', okTgNoCopy: 'Telegram is opening. Copy the text below and send it.', okWa: 'WhatsApp is opening with your message. Tap Send.', okMail: 'Your mail app is opening with the message.',
      direct: 'Or reach us directly', hours: 'Requests accepted 24/7',
      msgHeader: 'New request (website)', other: 'Other'
    },
    footer: { tagline: 'Industrial robot and equipment service', rights: 'All rights reserved.', privacyTitle: 'Privacy', privacy: 'This site uses no cookies or tracking scripts. Form data is never sent to a server: it reaches us only through the Telegram, WhatsApp or email you choose and is used only to reply to your request.' },
    notFound: { title: 'Page not found', text: 'There is no page at this address. Go back to the home page.', back: 'Home page' }
  }
};
