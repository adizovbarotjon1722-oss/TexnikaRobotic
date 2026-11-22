// 6-bosqich matnlari: bo'limlar yacheykalari, qo'llab-quvvatlash.
export const content5 = {
  uz: {
    hub: {
      eyebrow: 'Bo‘limlar', title: 'Kerakli bo‘limni tanlang', menu: 'Bo‘limlar',
      scene: 'Payvandlash yacheykasida to‘rtta sanoat roboti ishlayapti',
      items: {
        services: ['Xizmatlar', 'Robotlar, Xitoy va Germaniya uskunalari, elektronika'],
        plc: ['PLC ta’miri', 'CPU STOP, aloqa, I/O modullar, dastur'],
        monitoring: ['PLC monitoring', 'Liniya holati, OEE, avariyalar Telegramda'],
        ai: ['AI tashxis', 'Rasm va xato kodi bo‘yicha dastlabki tashxis'],
        support: ['Qo‘llab-quvvatlash', 'Masofaviy ulanish, avariya chaqiruvi'],
        errors: ['Xato kodlari', 'KUKA, ABB, FANUC va drayverlar'],
        warranty: ['Kafolat', 'Shartlar va kafolatni tekshirish'],
        academy: ['Akademiya', 'Operator va muhandislar uchun kurslar'],
        videos: ['Video qo‘llanmalar', 'Ko‘rsatmalar va video darslar'],
        portfolio: ['Portfel', 'Bajarilgan ishlar va natijalar'],
        track: ['Ariza holati', 'Arizangiz qaysi bosqichda'],
        calc: ['To‘xtash narxi', 'Liniya to‘xtashi zararini hisoblang']
      }
    },
    support: {
      eyebrow: 'Qo‘llab-quvvatlash',
      title: 'Liniya to‘xtadimi? Biz yoningizdamiz',
      lead: 'Avval masofadan yordam beramiz, kerak bo‘lsa joyiga chiqamiz. Har bir murojaat raqamlanadi va holatini o‘zingiz kuzatasiz.',
      homeLead: 'Telegram, sayt yoki masofaviy ulanish orqali. Har bir murojaat raqamlanadi va javob vaqti ustuvorlikka bog‘liq.',
      more: 'Qo‘llab-quvvatlash sahifasi',
      channelsTitle: 'Bog‘lanish yo‘llari',
      channels: [
        { k: 'tg', icon: 'send', title: 'Telegram bot', text: 'Rasm yoki xato kodini yuboring: ariza darhol yaratiladi, holati shu chatga keladi.', cta: 'Botni ochish' },
        { k: 'remote', icon: 'code', title: 'Masofaviy ulanish', text: 'AnyDesk yoki TeamViewer orqali dastur, parametr va xatolarni ko‘ramiz. Siz ekranda kuzatib turasiz.', cta: 'Qanday ishlaydi' },
        { k: 'ai', icon: 'probe', title: 'Saytda ariza', text: 'Muammoni tasvirlang, AI dastlabki tashxis beradi, muhandis {hours} soat ichida bog‘lanadi.', cta: 'Ariza qoldirish' },
        { k: 'onsite', icon: 'wrench', title: 'Joyiga chiqish', text: '{city} va viloyatlar. Masofadan hal bo‘lmasa yoki ehtiyot qism kerak bo‘lsa.', cta: 'Chaqirish' }
      ],
      prioTitle: 'Ustuvorlik va javob',
      prioCols: ['Daraja', 'Holat', 'Javob'],
      prio: [
        { k: 'critical', name: 'Kritik', when: 'Liniya to‘liq to‘xtagan yoki xavfsizlikka xavf bor', answer: 'Navbatsiz, avval masofadan yordam' },
        { k: 'high', name: 'Jiddiy', when: 'Unumdorlik pasaygan, xato qaytarilyapti', answer: '{hours} soat ichida javob' },
        { k: 'normal', name: 'Rejali', when: 'Profilaktika, sozlash, o‘qitish, maslahat', answer: 'Kelishilgan sanada' }
      ],
      remoteTitle: 'Masofaviy yordam qanday o‘tadi',
      remote: [
        { title: 'Murojaat', text: 'Telegram yoki saytda muammoni yozing, xato kodi va rasmini qo‘shing.' },
        { title: 'Ulanish', text: 'AnyDesk yoki TeamViewer ID va bir martalik parolni muhandisga yuborasiz.' },
        { title: 'Ish', text: 'Muhandis ulanadi, siz ekranda kuzatasiz va istalgan payt uzib qo‘yasiz.' },
        { title: 'Hisobot', text: 'Nima topildi va nima o‘zgartirildi, yozma ko‘rinishda. Ulanish yopiladi.' }
      ],
      safety: 'Ulanish faqat sizning roziligingiz bilan, har safar yangi parol bilan. Ishlab chiqarish tarmog‘ida doimiy kirish qoldirmaymiz va robotni masofadan harakatlantirmaymiz.',
      selfTitle: 'O‘zingiz tekshirib ko‘ring',
      self: [
        { k: 'errors', title: 'Xato kodlari ma’lumotnomasi', text: 'Kod nimani bildiradi va nimani xavfsiz tekshirish mumkin.' },
        { k: 'led', title: 'PLC chiroqlari tashxisi', text: 'RUN, SF, BF chiroqlari bo‘yicha ehtimoliy sabab.' },
        { k: 'academy', title: 'Akademiya', text: 'Operatorlar uchun qisqa kurslar va testlar.' },
        { k: 'track', title: 'Ariza holati', text: 'Murojaatingiz qaysi bosqichda.' }
      ],
      faq: [
        { q: 'Kechasi yoki dam olish kunida yozsam bo‘ladimi?', a: 'Ha. Bot va sayt doim qabul qiladi, kritik murojaat navbatsiz ko‘riladi.' },
        { q: 'Masofaviy ulanish xavfsizmi?', a: 'Har safar yangi parol beriladi, siz ekranda kuzatasiz va istalgan payt uzasiz. Doimiy kirish qoldirilmaydi.' },
        { q: 'Internet bo‘lmasa-chi?', a: 'Telefonda video qo‘ng‘iroq yoki rasm orqali ham ko‘p muammoni aniqlaymiz. Kerak bo‘lsa joyiga chiqamiz.' }
      ]
    },
    meta6: { supportTitle: 'Texnik qo‘llab-quvvatlash: masofaviy yordam va avariya chaqiruvi | {brand}', supportDesc: 'Sanoat robotlari va PLC uchun texnik qo‘llab-quvvatlash: Telegram, masofaviy ulanish, avariya chaqiruvi. {city} va butun O‘zbekiston.' }
  },
  ru: {
    hub: {
      eyebrow: 'Разделы', title: 'Выберите нужный раздел', menu: 'Разделы',
      scene: 'Четыре промышленных робота работают в сварочной ячейке',
      items: {
        services: ['Услуги', 'Роботы, китайское и немецкое оборудование, электроника'],
        plc: ['Ремонт ПЛК', 'CPU STOP, связь, модули I/O, программа'],
        monitoring: ['Мониторинг ПЛК', 'Состояние линии, OEE, аварии в Telegram'],
        ai: ['AI-диагностика', 'Предварительная диагностика по фото и коду ошибки'],
        support: ['Поддержка', 'Удалённое подключение, аварийный вызов'],
        errors: ['Коды ошибок', 'KUKA, ABB, FANUC и приводы'],
        warranty: ['Гарантия', 'Условия и проверка гарантии'],
        academy: ['Академия', 'Курсы для операторов и инженеров'],
        videos: ['Видеоинструкции', 'Инструкции и видеоуроки'],
        portfolio: ['Портфолио', 'Выполненные работы и результаты'],
        track: ['Статус заявки', 'На каком этапе ваша заявка'],
        calc: ['Цена простоя', 'Посчитайте убыток от остановки линии']
      }
    },
    support: {
      eyebrow: 'Поддержка',
      title: 'Линия встала? Мы рядом',
      lead: 'Сначала помогаем удалённо, при необходимости выезжаем. Каждое обращение получает номер, и вы сами следите за его статусом.',
      homeLead: 'Через Telegram, сайт или удалённое подключение. Каждое обращение получает номер, время ответа зависит от приоритета.',
      more: 'Страница поддержки',
      channelsTitle: 'Как связаться',
      channels: [
        { k: 'tg', icon: 'send', title: 'Telegram-бот', text: 'Пришлите фото или код ошибки: заявка создаётся сразу, статус приходит в этот чат.', cta: 'Открыть бота' },
        { k: 'remote', icon: 'code', title: 'Удалённое подключение', text: 'Через AnyDesk или TeamViewer смотрим программу, параметры и ошибки. Вы наблюдаете за экраном.', cta: 'Как это работает' },
        { k: 'ai', icon: 'probe', title: 'Заявка на сайте', text: 'Опишите проблему, AI даст предварительную диагностику, инженер свяжется в течение {hours} ч.', cta: 'Оставить заявку' },
        { k: 'onsite', icon: 'wrench', title: 'Выезд на объект', text: '{city} и области. Если удалённо не решается или нужна запчасть.', cta: 'Вызвать' }
      ],
      prioTitle: 'Приоритет и ответ',
      prioCols: ['Уровень', 'Ситуация', 'Ответ'],
      prio: [
        { k: 'critical', name: 'Критичный', when: 'Линия полностью стоит или есть угроза безопасности', answer: 'Вне очереди, сначала удалённая помощь' },
        { k: 'high', name: 'Серьёзный', when: 'Производительность упала, ошибка повторяется', answer: 'Ответ в течение {hours} ч' },
        { k: 'normal', name: 'Плановый', when: 'Профилактика, настройка, обучение, консультация', answer: 'В согласованную дату' }
      ],
      remoteTitle: 'Как проходит удалённая помощь',
      remote: [
        { title: 'Обращение', text: 'Опишите проблему в Telegram или на сайте, приложите код ошибки и фото.' },
        { title: 'Подключение', text: 'Отправляете инженеру ID AnyDesk или TeamViewer и одноразовый пароль.' },
        { title: 'Работа', text: 'Инженер подключается, вы наблюдаете за экраном и можете прервать в любой момент.' },
        { title: 'Отчёт', text: 'Что нашли и что изменили, письменно. Подключение закрывается.' }
      ],
      safety: 'Подключение только с вашего согласия и каждый раз с новым паролем. Мы не оставляем постоянного доступа в производственную сеть и не двигаем робота удалённо.',
      selfTitle: 'Проверьте сами',
      self: [
        { k: 'errors', title: 'Справочник кодов ошибок', text: 'Что означает код и что можно безопасно проверить.' },
        { k: 'led', title: 'Диагностика по индикаторам ПЛК', text: 'Вероятная причина по RUN, SF, BF.' },
        { k: 'academy', title: 'Академия', text: 'Короткие курсы и тесты для операторов.' },
        { k: 'track', title: 'Статус заявки', text: 'На каком этапе ваше обращение.' }
      ],
      faq: [
        { q: 'Можно писать ночью или в выходные?', a: 'Да. Бот и сайт принимают всегда, критичные обращения рассматриваются вне очереди.' },
        { q: 'Безопасно ли удалённое подключение?', a: 'Каждый раз новый пароль, вы наблюдаете за экраном и прерываете в любой момент. Постоянный доступ не остаётся.' },
        { q: 'А если нет интернета?', a: 'Многое определяем по видеозвонку или фото с телефона. При необходимости выезжаем.' }
      ]
    },
    meta6: { supportTitle: 'Техническая поддержка: удалённая помощь и аварийный вызов | {brand}', supportDesc: 'Техническая поддержка промышленных роботов и ПЛК: Telegram, удалённое подключение, аварийный вызов. {city} и весь Узбекистан.' }
  },
  en: {
    hub: {
      eyebrow: 'Sections', title: 'Pick the section you need', menu: 'Sections',
      scene: 'Four industrial robots working in a welding cell',
      items: {
        services: ['Services', 'Robots, Chinese and German equipment, electronics'],
        plc: ['PLC repair', 'CPU STOP, networks, I/O modules, programs'],
        monitoring: ['PLC monitoring', 'Line status, OEE, alarms in Telegram'],
        ai: ['AI diagnosis', 'First diagnosis from a photo and fault code'],
        support: ['Support', 'Remote access, emergency call-out'],
        errors: ['Fault codes', 'KUKA, ABB, FANUC and drives'],
        warranty: ['Warranty', 'Terms and warranty check'],
        academy: ['Academy', 'Courses for operators and engineers'],
        videos: ['Video guides', 'Instructions and video lessons'],
        portfolio: ['Portfolio', 'Completed jobs and results'],
        track: ['Request status', 'Which stage your request is at'],
        calc: ['Downtime cost', 'Work out what a line stop costs']
      }
    },
    support: {
      eyebrow: 'Support',
      title: 'Line down? We are right here',
      lead: 'We help remotely first and come on site when needed. Every request gets a number and you can follow its status yourself.',
      homeLead: 'Through Telegram, the website or remote access. Every request gets a number, and response time depends on priority.',
      more: 'Support page',
      channelsTitle: 'Ways to reach us',
      channels: [
        { k: 'tg', icon: 'send', title: 'Telegram bot', text: 'Send a photo or fault code: a request is created at once and status updates arrive in the same chat.', cta: 'Open the bot' },
        { k: 'remote', icon: 'code', title: 'Remote access', text: 'Through AnyDesk or TeamViewer we look at the program, parameters and faults. You watch the screen.', cta: 'How it works' },
        { k: 'ai', icon: 'probe', title: 'Request on the website', text: 'Describe the problem, AI gives a first diagnosis, an engineer contacts you within {hours} hours.', cta: 'Send a request' },
        { k: 'onsite', icon: 'wrench', title: 'On-site visit', text: '{city} and the regions, when it cannot be solved remotely or a part is needed.', cta: 'Call us out' }
      ],
      prioTitle: 'Priority and response',
      prioCols: ['Level', 'Situation', 'Response'],
      prio: [
        { k: 'critical', name: 'Critical', when: 'The line is fully down or there is a safety risk', answer: 'Out of turn, remote help first' },
        { k: 'high', name: 'Serious', when: 'Output has dropped, a fault keeps returning', answer: 'Reply within {hours} hours' },
        { k: 'normal', name: 'Planned', when: 'Maintenance, tuning, training, advice', answer: 'On an agreed date' }
      ],
      remoteTitle: 'How remote help works',
      remote: [
        { title: 'Request', text: 'Describe the problem in Telegram or on the website, add the fault code and a photo.' },
        { title: 'Connect', text: 'You send the engineer an AnyDesk or TeamViewer ID and a one-time password.' },
        { title: 'Work', text: 'The engineer connects, you watch the screen and can disconnect at any time.' },
        { title: 'Report', text: 'What was found and what was changed, in writing. The session is closed.' }
      ],
      safety: 'Connections happen only with your consent and a new password each time. We never leave permanent access to the production network and never move a robot remotely.',
      selfTitle: 'Check it yourself',
      self: [
        { k: 'errors', title: 'Fault code reference', text: 'What a code means and what is safe to check.' },
        { k: 'led', title: 'PLC light diagnosis', text: 'Likely cause from RUN, SF and BF lights.' },
        { k: 'academy', title: 'Academy', text: 'Short courses and tests for operators.' },
        { k: 'track', title: 'Request status', text: 'Which stage your request is at.' }
      ],
      faq: [
        { q: 'Can I write at night or at the weekend?', a: 'Yes. The bot and the website always accept requests, and critical ones are handled out of turn.' },
        { q: 'Is remote access safe?', a: 'A new password every time, you watch the screen and can disconnect whenever you like. No permanent access is left behind.' },
        { q: 'What if there is no internet?', a: 'We pin down many problems from a video call or phone photos, and come on site when needed.' }
      ]
    },
    meta6: { supportTitle: 'Technical support: remote help and emergency call-out | {brand}', supportDesc: 'Technical support for industrial robots and PLCs: Telegram, remote access, emergency call-out. {city} and all of Uzbekistan.' }
  }
};
