// 16-bosqich: aniq maqsadli yangi tuzilma (bosh sahifa 7 blok, Ustalar, Robot servisi, Elektron hujjatlar, baholash)
export const content10 = {
  uz: {
    v2: {
      hub: { robots: ['Robot servisi', 'ABB va KUKA: ta’mir, dastur, o‘qitish'], documents: ['Elektron hujjatlar', 'Jurnallar, hisobotlar, QR pasport'], team: ['Ustalar', 'Tajriba va bajarilgan ishlar'] },
      metaTitle: 'PLC servis va o‘qitish, uskunalar monitoringi, ABB va KUKA robot servisi | {brand}',
      metaDesc: 'PLC bo‘yicha xodimlarni o‘qitish, uskunalarni avtomatik monitoring qilish tizimini joriy etish, ABB va KUKA robotlari servisi va dasturlarini tuzatish, ishlab chiqarish hujjatlarini elektron shaklga o‘tkazish. {city} va butun O‘zbekiston.',
      nav: { training: 'O‘qitish', mon: 'Monitoring', robots: 'Robot servisi', docs: 'Elektron hujjatlar', team: 'Ustalar', help: 'Yordam' },
      hero: {
        h1k: 'PLC servis, o‘qitish va uskunalarni avtomatik monitoring qilish',
        h1a: 'Uskunangiz ishlasin.',
        h1b: 'Xodimlaringiz bilsin.',
        lead: 'Liniyani monitoring tizimiga ulaymiz, xodimlaringizni PLC va robotlar bo‘yicha o‘qitamiz, ABB va KUKA robotlariga servis ko‘rsatamiz. Bir muhandislik jamoasi, bir mas’uliyat.',
        cta1: 'Ariza qoldirish',
        cta2: 'Kurslarni ko‘rish',
        tele: [['PLC', 'S7-1500 · onlayn'], ['OEE', '87%'], ['Avariya', '0'], ['Keyingi TO', '12 kun']]
      },
      dir: {
        eyebrow: 'Yo‘nalishlar',
        title: 'To‘rt yo‘nalish, bitta maqsad: liniya to‘xtamasin',
        items: [
          { key: 'training', icon: 'cap', title: 'PLC bo‘yicha o‘qitish', text: 'Operator, elektrik va muhandislar uchun amaliy kurslar: Siemens S7, TIA Portal, nosozlik qidirish.', points: ['Real stend va dasturlar', 'Korxonangizda yoki onlayn', 'Test va sertifikat'] },
          { key: 'mon', icon: 'chart', title: 'Avtomatik monitoring', text: 'PLC va datchiklardan ma’lumot olib, uskuna holati, OEE va to‘xtashlarni bitta panelda ko‘rsatamiz.', points: ['Mavjud PLC ga ulanadi', 'Avariya Telegramga keladi', 'Smena va oylik hisobot'] },
          { key: 'robots', icon: 'robot', title: 'ABB va KUKA servis', text: 'Robotlarni ta’mirlash, dasturiy xatolarni tuzatish, mastering va backup. Operator va dasturchilarni o‘qitish.', points: ['IRC5, OmniCore, KR C4, KR C5', 'RAPID va KRL dasturlar', 'Yozma hisobot va kafolat'] },
          { key: 'docs', icon: 'doc', title: 'Elektron hujjatlar', text: 'Smena hisobotlari, TO jurnallari, nazorat varaqalari va uskuna pasportlarini elektron shaklga o‘tkazamiz.', points: ['QR kodli uskuna pasporti', 'Telefondan to‘ldiriladi', 'Arxiv va qidiruv'] }
        ],
        more: 'Batafsil'
      },
      train: {
        eyebrow: 'O‘qitish',
        title: 'Xodimlaringiz nosozlikni o‘zi topadigan bo‘lsin',
        lead: 'Kurslar real ishlab chiqarish holatlariga qurilgan: avval nazariya, keyin stendda amaliyot, oxirida test. Har bir xodim natijasi rahbarga hisobot sifatida beriladi.',
        tracks: [
          { name: 'PLC asoslari: Siemens S7-1200/1500', level: 'Boshlang‘ich', dur: '5 kun', points: ['TIA Portal, loyiha va apparat konfiguratsiyasi', 'LAD/FBD, taymer, hisoblagich', 'Kiritish-chiqarish modullari va diagnostika'] },
          { name: 'PLC nosozliklarini qidirish', level: 'O‘rta', dur: '3 kun', points: ['CPU STOP, SF/BF xatolari, diagnostika buferi', 'Profinet va Profibus tarmoqlari', 'Dastur zaxirasi va tiklash'] },
          { name: 'HMI va monitoring', level: 'O‘rta', dur: '3 kun', points: ['WinCC panellari va alarmlar', 'Ma’lumot yig‘ish va OEE', 'Telegram ogohlantirishlari'] },
          { name: 'ABB va KUKA robot operatori', level: 'Boshlang‘ich', dur: '3 kun', points: ['Xavfsiz ishlash va qo‘lda boshqarish', 'Dasturni ishga tushirish va to‘xtatish', 'Oddiy xatolarni bartaraf qilish'] }
        ],
        level: 'Daraja', dur: 'Davomiyligi',
        formats: ['Korxonangizda, uskunangiz ustida', 'Onlayn kurslar va testlar', 'Sertifikat va rahbar uchun hisobot'],
        cta: 'O‘qitishga ariza', more: 'Barcha kurslar'
      },
      team: {
        eyebrow: 'Ustalar',
        title: 'Ishni kim bajarishini oldindan bilasiz',
        lead: 'Har bir usta haqida tajribasi, ishlagan uskunalari va bajargan ishlari ochiq ko‘rsatiladi.',
        years: 'yil tajriba', skills: 'Uskunalar va ko‘nikmalar', works: 'Bajargan ishlari', certs: 'Sertifikatlar',
        more: 'Barcha ustalar', empty: 'Ustalar ma’lumoti tez orada qo‘shiladi.',
        metaTitle: 'Ustalar va muhandislar: tajriba va bajarilgan ishlar | {brand}',
        metaDesc: 'PLC, ABB va KUKA robotlari, sanoat elektronikasi bo‘yicha ustalarimiz: tajribasi, sertifikatlari va bajargan ishlari.',
        casesTitle: 'Bajarilgan ishlardan namunalar', casesMore: 'Barcha ishlar'
      },
      trust: {
        eyebrow: 'Ishonch',
        title: 'Kafolat beramiz va bahongizni ochiq ko‘rsatamiz',
        warranty: [['{wm} oy', 'bajarilgan ishga kafolat'], ['{pm} oygacha', 'ehtiyot qismga kafolat'], ['Yozma', 'hisobot va dalolatnoma']],
        wLink: 'Kafolatni tekshirish',
        reviews: 'Mijozlar fikri',
        rateTitle: 'Bizni baholang',
        rateLead: 'Sayt qulayligi va xizmat sifati haqida fikringiz bizga yaxshilanish uchun kerak.',
        site: 'Sayt qulayligi', service: 'Xizmat sifati', serviceHint: 'Xizmatimizdan foydalangan bo‘lsangiz',
        text: 'Izoh (ixtiyoriy)', name: 'Ismingiz (ixtiyoriy)', send: 'Yuborish',
        thanks: 'Rahmat! Bahoyingiz qabul qilindi.', err: 'Yuborib bo‘lmadi. Keyinroq urinib ko‘ring.', need: 'Kamida bitta baho qo‘ying',
        avgSite: 'Sayt bahosi', avgService: 'Xizmat bahosi', votes: 'ta baho', stars: '{n} yulduz'
      },
      contact: { title: 'Arizangiz to‘g‘ridan-to‘g‘ri muhandisning Telegramiga keladi' },
      pages: {
        robots: {
          eyebrow: 'ABB va KUKA',
          title: 'ABB va KUKA robotlari: servis, dasturlarni tuzatish va o‘qitish',
          lead: 'Robot to‘xtadimi, dastur xato ishlayaptimi yoki operatorlar ishonchsizmi? Avval sababni topamiz, keyin tuzatamiz va xodimlaringizga qanday oldini olishni o‘rgatamiz.',
          cta: 'Robot bo‘yicha ariza', svc: 'ABB va KUKA robot servisi',
          whatTitle: 'Nimalar qilamiz',
          what: [
            ['Xatolarni tahlil qilish', 'Kontroller jurnali, xato kodlari va signallar bo‘yicha asl sababni aniqlaymiz.'],
            ['Dasturiy tuzatish', 'RAPID va KRL dasturlaridagi xatolar, traektoriya, tezlik va I/O mantiqini tuzatamiz.'],
            ['Mastering va kalibrovka', 'O‘qlarni nolga qo‘yish, asbob va baza koordinatalarini qayta o‘lchash.'],
            ['Backup va tiklash', 'To‘liq zaxira nusxa, tizimni qayta tiklash va versiyalarni hujjatlashtirish.'],
            ['Mexanik va elektr qismlar', 'Reduktor, servo motor, kabel paketi, enkoder va quvvat bloklarini almashtirish.'],
            ['Operator va dasturchilarni o‘qitish', 'Xavfsiz ishlash, dasturni o‘zgartirish va birlamchi diagnostika bo‘yicha amaliy mashg‘ulot.']
          ],
          stepsTitle: 'Ish tartibi',
          steps: [['Ariza', 'Xato kodi, model va video yuborasiz.'], ['Masofaviy tahlil', 'Dastlabki sabab va narxni kelishamiz.'], ['Joyida ish', 'Ta’mirlash, dasturni tuzatish va sinov.'], ['Hisobot', 'Bajarilgan ish, almashtirilgan qism va tavsiyalar.'], ['O‘qitish', 'Xodimlaringizga takrorlanmaslik uchun ko‘rsatma.']],
          pkgTitle: 'Hamkorlik shakllari', pkgLead: 'Bitta chaqiruvdan doimiy servis shartnomasigacha.',
          pkgs: [
            { name: 'Bir martalik servis', for: 'Robot to‘xtaganda yoki xato bo‘lganda', items: ['Diagnostika va ta’mir', 'Dasturni tuzatish', 'Yozma hisobot'] },
            { name: 'Servis shartnomasi', for: 'Robotlari doimiy ishlashi kerak korxonalar', items: ['Rejali profilaktika', 'Ustuvor chiqish', 'Backup nazorati'] },
            { name: 'O‘qitish kursi', for: 'Operator va dasturchilar', items: ['Korxonangizda amaliyot', 'Test va sertifikat', 'Rahbarga hisobot'] }
          ],
          faq: [
            { q: 'Qaysi kontrollerlar bilan ishlaysiz?', a: 'ABB IRC5 va OmniCore, KUKA KR C2, KR C4 va KR C5. Boshqa brendlar bo‘yicha alohida kelishamiz.' },
            { q: 'Dastur va sozlamalar yo‘qolmaydimi?', a: 'Har qanday ishdan oldin to‘liq zaxira nusxa olinadi va sizga beriladi.' },
            { q: 'Masofadan yordam bera olasizmi?', a: 'Ha. Ko‘p xatolarni jurnal va video orqali masofadan tahlil qilamiz, kerak bo‘lsa joyiga chiqamiz.' }
          ],
          metaTitle: 'ABB va KUKA robotlari servisi, dasturlarni tuzatish va o‘qitish | {brand}',
          metaDesc: 'ABB va KUKA sanoat robotlarini ta’mirlash, RAPID va KRL dasturlarini tuzatish, mastering, backup va operatorlarni o‘qitish. {city} va O‘zbekiston bo‘ylab.',
          kw: 'ABB robot servis, KUKA robot ta’miri, RAPID dastur, KRL dastur, robot mastering, IRC5, OmniCore, KR C4, KR C5, robot operatori kursi, robot dasturchisi o‘qitish, Toshkent'
        },
        docs: {
          eyebrow: 'Elektron hujjatlar',
          title: 'Ishlab chiqarish hujjatlarini elektron shaklga o‘tkazamiz',
          lead: 'Qog‘oz jurnallar yo‘qoladi, kech to‘ldiriladi va tahlil qilib bo‘lmaydi. Hujjatlaringizni telefon va kompyuterdan to‘ldiriladigan, avtomatik hisobot beradigan tizimga o‘tkazamiz.',
          cta: 'Hujjatlar bo‘yicha ariza', svc: 'Ishlab chiqarish hujjatlarini avtomatlashtirish',
          whatTitle: 'Qaysi hujjatlar',
          what: [
            ['Smena hisobotlari', 'Ishlab chiqarilgan mahsulot, to‘xtashlar va sabablar smena oxirida avtomatik yig‘iladi.'],
            ['TO jurnallari', 'Rejali texnik xizmat jadvali, bajarilgan ishlar va eslatmalar.'],
            ['Nazorat varaqalari', 'Uskunani ko‘rikdan o‘tkazish, xavfsizlik va sifat tekshiruvlari.'],
            ['Uskuna pasportlari', 'Har bir uskunaga QR kod: tarix, hujjatlar va nosozliklar bir joyda.'],
            ['Dalolatnoma va hisoblar', 'Bajarilgan ishlar dalolatnomasi, servis hisoboti va to‘lov hisobi imzo bilan.'],
            ['Tahlil va hisobotlar', 'OEE, to‘xtash sabablari va ehtiyot qismlar sarfi bo‘yicha oylik hisobot.']
          ],
          stepsTitle: 'Qanday joriy qilamiz',
          steps: [['Audit', 'Hozirgi hujjatlaringizni ko‘rib chiqamiz.'], ['Shablonlar', 'Elektron shakllarni sizning tartibingizga moslaymiz.'], ['Joriy etish', 'Telefon va kompyuterda ishga tushiramiz.'], ['O‘qitish', 'Xodimlarga qanday to‘ldirishni o‘rgatamiz.'], ['Qo‘llab-quvvatlash', 'O‘zgarishlar va yangi shakllar qo‘shamiz.']],
          pkgTitle: 'Hamkorlik shakllari', pkgLead: 'Bitta liniyadan butun zavodgacha.',
          pkgs: [
            { name: 'Start', for: 'Bitta sex yoki liniya', items: ['5 tagacha elektron shakl', 'QR pasportlar', 'Oylik hisobot'] },
            { name: 'Ishlab chiqarish', for: 'Bir nechta sex', items: ['Cheksiz shakllar', 'Telegram eslatmalari', 'Rahbar paneli'] },
            { name: 'Zavod', for: 'Butun korxona', items: ['Monitoring bilan birlashtirish', 'Ehtiyot qismlar hisobi', 'Shaxsiy qo‘llab-quvvatlash'] }
          ],
          faq: [
            { q: 'Internet bo‘lmasa ishlaydimi?', a: 'Shakl telefonda to‘ldiriladi va aloqa tiklanganda yuboriladi.' },
            { q: 'Ma’lumotlar kimda saqlanadi?', a: 'Sizning serveringizda yoki alohida himoyalangan serverda. Uchinchi shaxslarga berilmaydi.' },
            { q: 'Mavjud Excel fayllardan o‘tkazasizmi?', a: 'Ha, eski jurnallar va jadvallarni tizimga ko‘chiramiz.' }
          ],
          metaTitle: 'Ishlab chiqarish hujjatlarini avtomatlashtirish va elektron jurnallar | {brand}',
          metaDesc: 'Smena hisobotlari, texnik xizmat jurnallari, nazorat varaqalari va QR kodli uskuna pasportlarini elektron shaklga o‘tkazish. {city} va O‘zbekiston.',
          kw: 'hujjatlarni avtomatlashtirish, elektron jurnal, smena hisoboti, texnik xizmat jurnali, QR pasport, ishlab chiqarishni raqamlashtirish, elektron hujjat aylanishi, Toshkent'
        }
      }
    }
  },
  ru: {
    v2: {
      hub: { robots: ['Сервис роботов', 'ABB и KUKA: ремонт, программы, обучение'], documents: ['Электронные документы', 'Журналы, отчёты, QR-паспорт'], team: ['Мастера', 'Опыт и выполненные работы'] },
      metaTitle: 'Ремонт ПЛК и обучение, мониторинг оборудования, сервис роботов ABB и KUKA | {brand}',
      metaDesc: 'Обучение персонала работе с ПЛК, внедрение автоматического мониторинга оборудования, сервис и исправление программ роботов ABB и KUKA, перевод производственной документации в электронный вид. {city} и весь Узбекистан.',
      nav: { training: 'Обучение', mon: 'Мониторинг', robots: 'Сервис роботов', docs: 'Электронные документы', team: 'Мастера', help: 'Помощь' },
      hero: {
        h1k: 'Ремонт ПЛК, обучение и автоматический мониторинг оборудования',
        h1a: 'Оборудование работает.',
        h1b: 'Персонал знает как.',
        lead: 'Подключаем линию к системе мониторинга, обучаем ваших сотрудников работе с ПЛК и роботами, обслуживаем роботов ABB и KUKA. Одна инженерная команда, одна ответственность.',
        cta1: 'Оставить заявку',
        cta2: 'Смотреть курсы',
        tele: [['ПЛК', 'S7-1500 · онлайн'], ['OEE', '87%'], ['Аварии', '0'], ['Следующее ТО', '12 дн.']]
      },
      dir: {
        eyebrow: 'Направления',
        title: 'Четыре направления, одна цель: линия не стоит',
        items: [
          { key: 'training', icon: 'cap', title: 'Обучение ПЛК', text: 'Практические курсы для операторов, электриков и инженеров: Siemens S7, TIA Portal, поиск неисправностей.', points: ['Реальные стенды и программы', 'На вашем предприятии или онлайн', 'Тест и сертификат'] },
          { key: 'mon', icon: 'chart', title: 'Автоматический мониторинг', text: 'Собираем данные с ПЛК и датчиков и показываем состояние оборудования, OEE и простои на одной панели.', points: ['Подключение к существующим ПЛК', 'Аварии приходят в Telegram', 'Сменные и месячные отчёты'] },
          { key: 'robots', icon: 'robot', title: 'Сервис ABB и KUKA', text: 'Ремонт роботов, исправление программных ошибок, мастеринг и резервные копии. Обучение операторов и программистов.', points: ['IRC5, OmniCore, KR C4, KR C5', 'Программы RAPID и KRL', 'Письменный отчёт и гарантия'] },
          { key: 'docs', icon: 'doc', title: 'Электронные документы', text: 'Переводим сменные отчёты, журналы ТО, чек-листы и паспорта оборудования в электронный вид.', points: ['Паспорт оборудования с QR-кодом', 'Заполнение с телефона', 'Архив и поиск'] }
        ],
        more: 'Подробнее'
      },
      train: {
        eyebrow: 'Обучение',
        title: 'Пусть ваши сотрудники сами находят неисправность',
        lead: 'Курсы построены на реальных производственных ситуациях: теория, практика на стенде, затем тест. Результат каждого сотрудника передаётся руководителю в виде отчёта.',
        tracks: [
          { name: 'Основы ПЛК: Siemens S7-1200/1500', level: 'Начальный', dur: '5 дней', points: ['TIA Portal, проект и конфигурация', 'LAD/FBD, таймеры, счётчики', 'Модули ввода-вывода и диагностика'] },
          { name: 'Поиск неисправностей ПЛК', level: 'Средний', dur: '3 дня', points: ['CPU в STOP, ошибки SF/BF, буфер диагностики', 'Сети Profinet и Profibus', 'Резервная копия и восстановление программы'] },
          { name: 'HMI и мониторинг', level: 'Средний', dur: '3 дня', points: ['Панели WinCC и аварийные сообщения', 'Сбор данных и OEE', 'Оповещения в Telegram'] },
          { name: 'Оператор роботов ABB и KUKA', level: 'Начальный', dur: '3 дня', points: ['Безопасная работа и ручное управление', 'Запуск и остановка программы', 'Устранение простых ошибок'] }
        ],
        level: 'Уровень', dur: 'Длительность',
        formats: ['На вашем предприятии, на вашем оборудовании', 'Онлайн-курсы и тесты', 'Сертификат и отчёт для руководителя'],
        cta: 'Заявка на обучение', more: 'Все курсы'
      },
      team: {
        eyebrow: 'Мастера',
        title: 'Вы заранее знаете, кто выполнит работу',
        lead: 'По каждому мастеру открыто показаны опыт, оборудование, с которым он работал, и выполненные работы.',
        years: 'лет опыта', skills: 'Оборудование и навыки', works: 'Выполненные работы', certs: 'Сертификаты',
        more: 'Все мастера', empty: 'Информация о мастерах скоро появится.',
        metaTitle: 'Мастера и инженеры: опыт и выполненные работы | {brand}',
        metaDesc: 'Наши мастера по ПЛК, роботам ABB и KUKA и промышленной электронике: опыт, сертификаты и выполненные работы.',
        casesTitle: 'Примеры выполненных работ', casesMore: 'Все работы'
      },
      trust: {
        eyebrow: 'Доверие',
        title: 'Даём гарантию и открыто показываем оценки',
        warranty: [['{wm} мес.', 'гарантия на работу'], ['до {pm} мес.', 'гарантия на запчасти'], ['Письменный', 'отчёт и акт']],
        wLink: 'Проверить гарантию',
        reviews: 'Отзывы клиентов',
        rateTitle: 'Оцените нас',
        rateLead: 'Ваше мнение об удобстве сайта и качестве сервиса помогает нам становиться лучше.',
        site: 'Удобство сайта', service: 'Качество сервиса', serviceHint: 'Если вы пользовались нашими услугами',
        text: 'Комментарий (необязательно)', name: 'Ваше имя (необязательно)', send: 'Отправить',
        thanks: 'Спасибо! Ваша оценка принята.', err: 'Не удалось отправить. Попробуйте позже.', need: 'Поставьте хотя бы одну оценку',
        avgSite: 'Оценка сайта', avgService: 'Оценка сервиса', votes: 'оценок', stars: '{n} звёзд'
      },
      contact: { title: 'Ваша заявка приходит инженеру напрямую в Telegram' },
      pages: {
        robots: {
          eyebrow: 'ABB и KUKA',
          title: 'Роботы ABB и KUKA: сервис, исправление программ и обучение',
          lead: 'Робот остановился, программа работает с ошибками или операторы не уверены? Сначала находим причину, затем исправляем и учим ваших сотрудников, как это предотвратить.',
          cta: 'Заявка по роботу', svc: 'Сервис роботов ABB и KUKA',
          whatTitle: 'Что мы делаем',
          what: [
            ['Анализ ошибок', 'Находим первопричину по журналу контроллера, кодам ошибок и сигналам.'],
            ['Исправление программ', 'Исправляем ошибки в программах RAPID и KRL, траектории, скорости и логику I/O.'],
            ['Мастеринг и калибровка', 'Установка осей в ноль, повторное измерение координат инструмента и базы.'],
            ['Резервные копии', 'Полная резервная копия, восстановление системы и документирование версий.'],
            ['Механика и электрика', 'Замена редукторов, серводвигателей, кабельных пакетов, энкодеров и блоков питания.'],
            ['Обучение операторов и программистов', 'Практические занятия по безопасной работе, изменению программ и первичной диагностике.']
          ],
          stepsTitle: 'Порядок работы',
          steps: [['Заявка', 'Присылаете код ошибки, модель и видео.'], ['Удалённый анализ', 'Согласуем вероятную причину и цену.'], ['Работа на месте', 'Ремонт, исправление программы и испытание.'], ['Отчёт', 'Выполненные работы, заменённые детали и рекомендации.'], ['Обучение', 'Инструктаж сотрудников, чтобы не повторилось.']],
          pkgTitle: 'Форматы сотрудничества', pkgLead: 'От разового вызова до постоянного сервисного договора.',
          pkgs: [
            { name: 'Разовый сервис', for: 'Когда робот остановился или ошибка', items: ['Диагностика и ремонт', 'Исправление программы', 'Письменный отчёт'] },
            { name: 'Сервисный договор', for: 'Предприятия, где роботы должны работать постоянно', items: ['Плановая профилактика', 'Приоритетный выезд', 'Контроль резервных копий'] },
            { name: 'Курс обучения', for: 'Операторы и программисты', items: ['Практика на вашем предприятии', 'Тест и сертификат', 'Отчёт руководителю'] }
          ],
          faq: [
            { q: 'С какими контроллерами вы работаете?', a: 'ABB IRC5 и OmniCore, KUKA KR C2, KR C4 и KR C5. По другим брендам договариваемся отдельно.' },
            { q: 'Не потеряются ли программы и настройки?', a: 'Перед любой работой делается полная резервная копия, она передаётся вам.' },
            { q: 'Можете помочь удалённо?', a: 'Да. Многие ошибки анализируем удалённо по журналу и видео, при необходимости выезжаем.' }
          ],
          metaTitle: 'Сервис роботов ABB и KUKA, исправление программ и обучение | {brand}',
          metaDesc: 'Ремонт промышленных роботов ABB и KUKA, исправление программ RAPID и KRL, мастеринг, резервные копии и обучение операторов. {city} и весь Узбекистан.',
          kw: 'сервис роботов ABB, ремонт роботов KUKA, программа RAPID, программа KRL, мастеринг робота, IRC5, OmniCore, KR C4, KR C5, обучение оператора робота, обучение программиста роботов, Ташкент'
        },
        docs: {
          eyebrow: 'Электронные документы',
          title: 'Переводим производственную документацию в электронный вид',
          lead: 'Бумажные журналы теряются, заполняются задним числом и не поддаются анализу. Переводим документы в систему, которая заполняется с телефона и компьютера и сама формирует отчёты.',
          cta: 'Заявка по документам', svc: 'Автоматизация производственной документации',
          whatTitle: 'Какие документы',
          what: [
            ['Сменные отчёты', 'Выпуск продукции, простои и их причины собираются автоматически в конце смены.'],
            ['Журналы ТО', 'График планового обслуживания, выполненные работы и напоминания.'],
            ['Чек-листы', 'Осмотр оборудования, проверки безопасности и качества.'],
            ['Паспорта оборудования', 'QR-код на каждом станке: история, документы и неисправности в одном месте.'],
            ['Акты и счета', 'Акт выполненных работ, сервисный отчёт и счёт на оплату с подписью.'],
            ['Аналитика и отчёты', 'Месячный отчёт по OEE, причинам простоев и расходу запчастей.']
          ],
          stepsTitle: 'Как внедряем',
          steps: [['Аудит', 'Изучаем ваши текущие документы.'], ['Шаблоны', 'Настраиваем электронные формы под ваш порядок.'], ['Внедрение', 'Запускаем на телефонах и компьютерах.'], ['Обучение', 'Учим сотрудников заполнять формы.'], ['Поддержка', 'Вносим изменения и добавляем новые формы.']],
          pkgTitle: 'Форматы сотрудничества', pkgLead: 'От одной линии до всего завода.',
          pkgs: [
            { name: 'Старт', for: 'Один цех или линия', items: ['До 5 электронных форм', 'QR-паспорта', 'Месячный отчёт'] },
            { name: 'Производство', for: 'Несколько цехов', items: ['Неограниченно форм', 'Напоминания в Telegram', 'Панель руководителя'] },
            { name: 'Завод', for: 'Всё предприятие', items: ['Интеграция с мониторингом', 'Учёт запчастей', 'Персональная поддержка'] }
          ],
          faq: [
            { q: 'Работает без интернета?', a: 'Форма заполняется на телефоне и отправляется, когда связь восстановится.' },
            { q: 'Где хранятся данные?', a: 'На вашем сервере или на отдельном защищённом сервере. Третьим лицам не передаются.' },
            { q: 'Перенесёте данные из Excel?', a: 'Да, переносим старые журналы и таблицы в систему.' }
          ],
          metaTitle: 'Автоматизация производственной документации и электронные журналы | {brand}',
          metaDesc: 'Перевод сменных отчётов, журналов ТО, чек-листов и паспортов оборудования с QR-кодом в электронный вид. {city} и весь Узбекистан.',
          kw: 'автоматизация документооборота, электронный журнал, сменный отчёт, журнал ТО, QR паспорт оборудования, цифровизация производства, Ташкент'
        }
      }
    }
  },
  en: {
    v2: {
      hub: { robots: ['Robot service', 'ABB and KUKA: repair, programs, training'], documents: ['Digital documents', 'Logs, reports, QR passports'], team: ['Engineers', 'Experience and completed work'] },
      metaTitle: 'PLC Service & Training, Equipment Monitoring, ABB and KUKA Robot Service | {brand}',
      metaDesc: 'PLC training for your staff, automatic equipment monitoring systems, ABB and KUKA robot service and program fixes, and digital production documents. {city} and all of Uzbekistan.',
      nav: { training: 'Training', mon: 'Monitoring', robots: 'Robot service', docs: 'Digital documents', team: 'Engineers', help: 'Help' },
      hero: {
        h1k: 'PLC service, training and automatic equipment monitoring',
        h1a: 'Machines that run.',
        h1b: 'People who know why.',
        lead: 'We connect your line to a monitoring system, train your staff on PLCs and robots, and service ABB and KUKA robots. One engineering team, one point of responsibility.',
        cta1: 'Send a request',
        cta2: 'See courses',
        tele: [['PLC', 'S7-1500 · online'], ['OEE', '87%'], ['Alarms', '0'], ['Next service', '12 days']]
      },
      dir: {
        eyebrow: 'What we do',
        title: 'Four services, one goal: keep the line running',
        items: [
          { key: 'training', icon: 'cap', title: 'PLC training', text: 'Hands-on courses for operators, electricians and engineers: Siemens S7, TIA Portal, troubleshooting.', points: ['Real training rigs and programs', 'On your site or online', 'Test and certificate'] },
          { key: 'mon', icon: 'chart', title: 'Automatic monitoring', text: 'We collect data from PLCs and sensors and show machine status, OEE and downtime on one dashboard.', points: ['Connects to your existing PLCs', 'Alarms sent to Telegram', 'Shift and monthly reports'] },
          { key: 'robots', icon: 'robot', title: 'ABB and KUKA service', text: 'Robot repair, software fixes, mastering and backups. Training for operators and programmers.', points: ['IRC5, OmniCore, KR C4, KR C5', 'RAPID and KRL programs', 'Written report and warranty'] },
          { key: 'docs', icon: 'doc', title: 'Digital documents', text: 'We move shift reports, maintenance logs, checklists and equipment passports into digital form.', points: ['QR-coded equipment passport', 'Filled in from a phone', 'Archive and search'] }
        ],
        more: 'Learn more'
      },
      train: {
        eyebrow: 'Training',
        title: 'Let your people find the fault themselves',
        lead: 'Courses are built around real production cases: theory, practice on a rig, then a test. Each trainee’s result goes to the manager as a report.',
        tracks: [
          { name: 'PLC basics: Siemens S7-1200/1500', level: 'Beginner', dur: '5 days', points: ['TIA Portal, projects and hardware configuration', 'LAD/FBD, timers, counters', 'I/O modules and diagnostics'] },
          { name: 'PLC troubleshooting', level: 'Intermediate', dur: '3 days', points: ['CPU in STOP, SF/BF faults, diagnostic buffer', 'Profinet and Profibus networks', 'Program backup and restore'] },
          { name: 'HMI and monitoring', level: 'Intermediate', dur: '3 days', points: ['WinCC panels and alarms', 'Data collection and OEE', 'Telegram alerts'] },
          { name: 'ABB and KUKA robot operator', level: 'Beginner', dur: '3 days', points: ['Safe operation and jogging', 'Starting and stopping programs', 'Clearing common faults'] }
        ],
        level: 'Level', dur: 'Duration',
        formats: ['On your site, on your equipment', 'Online courses and tests', 'Certificate and manager report'],
        cta: 'Request training', more: 'All courses'
      },
      team: {
        eyebrow: 'Engineers',
        title: 'Know in advance who will do the work',
        lead: 'For every engineer we show their experience, the equipment they work on and the jobs they have done.',
        years: 'years of experience', skills: 'Equipment and skills', works: 'Completed work', certs: 'Certificates',
        more: 'All engineers', empty: 'Engineer profiles are coming soon.',
        metaTitle: 'Our engineers: experience and completed work | {brand}',
        metaDesc: 'Our engineers for PLCs, ABB and KUKA robots and industrial electronics: experience, certificates and completed work.',
        casesTitle: 'Selected completed work', casesMore: 'All work'
      },
      trust: {
        eyebrow: 'Trust',
        title: 'We give a warranty and show our ratings openly',
        warranty: [['{wm} months', 'warranty on work'], ['up to {pm} months', 'warranty on parts'], ['Written', 'report and certificate']],
        wLink: 'Check warranty',
        reviews: 'Customer reviews',
        rateTitle: 'Rate us',
        rateLead: 'Your view on the website and our service helps us improve.',
        site: 'Website usability', service: 'Service quality', serviceHint: 'If you have used our service',
        text: 'Comment (optional)', name: 'Your name (optional)', send: 'Submit',
        thanks: 'Thank you! Your rating has been received.', err: 'Could not send. Please try again later.', need: 'Please give at least one rating',
        avgSite: 'Website rating', avgService: 'Service rating', votes: 'ratings', stars: '{n} stars'
      },
      contact: { title: 'Your request goes straight to the engineer’s Telegram' },
      pages: {
        robots: {
          eyebrow: 'ABB and KUKA',
          title: 'ABB and KUKA robots: service, program fixes and training',
          lead: 'Robot stopped, program misbehaving, or operators unsure? We find the root cause first, fix it, then teach your staff how to prevent it.',
          cta: 'Robot service request', svc: 'ABB and KUKA robot service',
          whatTitle: 'What we do',
          what: [
            ['Fault analysis', 'We find the root cause from controller logs, error codes and signals.'],
            ['Program fixes', 'We fix errors in RAPID and KRL programs, paths, speeds and I/O logic.'],
            ['Mastering and calibration', 'Axis zeroing, re-measuring tool and base frames.'],
            ['Backup and restore', 'Full backups, system restore and version documentation.'],
            ['Mechanical and electrical parts', 'Gearboxes, servo motors, cable packages, encoders and power supplies.'],
            ['Operator and programmer training', 'Hands-on sessions on safe operation, program changes and first-line diagnostics.']
          ],
          stepsTitle: 'How it works',
          steps: [['Request', 'Send the error code, model and a video.'], ['Remote analysis', 'We agree the likely cause and price.'], ['On-site work', 'Repair, program fix and testing.'], ['Report', 'Work done, parts replaced and recommendations.'], ['Training', 'A briefing for your staff so it does not recur.']],
          pkgTitle: 'Ways to work with us', pkgLead: 'From a single call-out to an ongoing service contract.',
          pkgs: [
            { name: 'One-off service', for: 'When a robot stops or faults', items: ['Diagnostics and repair', 'Program fix', 'Written report'] },
            { name: 'Service contract', for: 'Plants where robots must run continuously', items: ['Scheduled maintenance', 'Priority call-out', 'Backup control'] },
            { name: 'Training course', for: 'Operators and programmers', items: ['Practice on your site', 'Test and certificate', 'Manager report'] }
          ],
          faq: [
            { q: 'Which controllers do you work with?', a: 'ABB IRC5 and OmniCore, KUKA KR C2, KR C4 and KR C5. Other brands by agreement.' },
            { q: 'Will programs and settings be lost?', a: 'A full backup is taken before any work and handed to you.' },
            { q: 'Can you help remotely?', a: 'Yes. Many faults are analysed remotely from logs and video; we come on site when needed.' }
          ],
          metaTitle: 'ABB and KUKA Robot Service, Program Fixes and Training | {brand}',
          metaDesc: 'ABB and KUKA industrial robot repair, RAPID and KRL program fixes, mastering, backups and operator training. {city} and all of Uzbekistan.',
          kw: 'ABB robot service, KUKA robot repair, RAPID program, KRL program, robot mastering, IRC5, OmniCore, KR C4, KR C5, robot operator training, robot programmer training, Tashkent'
        },
        docs: {
          eyebrow: 'Digital documents',
          title: 'We move your production paperwork into digital form',
          lead: 'Paper logs get lost, are filled in late and cannot be analysed. We move your documents into a system filled in from phones and computers that builds reports automatically.',
          cta: 'Documents request', svc: 'Production document automation',
          whatTitle: 'Which documents',
          what: [
            ['Shift reports', 'Output, downtime and its causes are collected automatically at shift end.'],
            ['Maintenance logs', 'Planned maintenance schedule, work done and reminders.'],
            ['Checklists', 'Equipment inspections, safety and quality checks.'],
            ['Equipment passports', 'A QR code on every machine: history, documents and faults in one place.'],
            ['Certificates and invoices', 'Completion certificates, service reports and invoices with signature.'],
            ['Analytics and reports', 'Monthly report on OEE, downtime causes and spare parts usage.']
          ],
          stepsTitle: 'How we roll it out',
          steps: [['Audit', 'We review your current documents.'], ['Templates', 'We fit digital forms to your procedures.'], ['Roll-out', 'We launch it on phones and computers.'], ['Training', 'We teach staff to fill in the forms.'], ['Support', 'We make changes and add new forms.']],
          pkgTitle: 'Ways to work with us', pkgLead: 'From one line to the whole plant.',
          pkgs: [
            { name: 'Start', for: 'One workshop or line', items: ['Up to 5 digital forms', 'QR passports', 'Monthly report'] },
            { name: 'Production', for: 'Several workshops', items: ['Unlimited forms', 'Telegram reminders', 'Manager dashboard'] },
            { name: 'Plant', for: 'The whole company', items: ['Integration with monitoring', 'Spare parts tracking', 'Dedicated support'] }
          ],
          faq: [
            { q: 'Does it work offline?', a: 'Forms are filled in on the phone and sent once the connection is back.' },
            { q: 'Where is the data stored?', a: 'On your own server or a separate secured server. It is never shared with third parties.' },
            { q: 'Can you migrate our Excel files?', a: 'Yes, we move old logs and spreadsheets into the system.' }
          ],
          metaTitle: 'Production Document Automation and Digital Logs | {brand}',
          metaDesc: 'Digital shift reports, maintenance logs, checklists and QR-coded equipment passports. {city} and all of Uzbekistan.',
          kw: 'document automation, digital logbook, shift report, maintenance log, QR equipment passport, production digitalisation, Tashkent'
        }
      }
    }
  }
};
