// 21-bosqich: bosh sahifada "Sayt nima uchun kerak" bo'limi: kimga, qanday foyda, saytdagi bepul vositalar, odatiy usul bilan solishtirish
export const content14 = {
  uz: {
    why: {
      eyebrow: 'Sayt nima uchun kerak',
      title: 'Uskuna to‘xtaganda nima qilishni aniq bilasiz',
      lead: '{brand} sanoat uskunalari bilan ishlaydigan korxonalar uchun bitta joy: nosozlikni tez tuzatish, xodimlarni o‘qitish va liniyani doimiy kuzatish. Usta qidirib vaqt yo‘qotmaysiz, narx va natija oldindan aniq bo‘ladi.',
      forTitle: 'Kimga va qanday foyda',
      roles: [
        { icon: 'chart', role: 'Zavod rahbari va egasi', pain: 'Liniya to‘xtasa, har soati pul yo‘qotish.', gain: 'Muhandis {hours} soatda javob beradi, narx ishdan oldin yozma kelishiladi, ish uchun {wm} oy kafolat.', link: 'Xizmatlar va narxlar', href: 'services/' },
        { icon: 'wrench', role: 'Bosh muhandis va texnik xodim', pain: 'Xato kodi chiqdi, sababi noma’lum.', gain: 'Xato kodlari bazasi, AI tashxis va qo‘llanmalar bilan muammoni o‘zingiz tez aniqlaysiz.', link: 'Xato kodlari', href: 'errors/' },
        { icon: 'cap', role: 'Operator va yosh mutaxassis', pain: 'PLC va robot bilan ishlashni o‘rganish qiyin.', gain: 'Amaliy kurslar, video darslar va test, oxirida sertifikat.', link: 'O‘quv markazi', href: 'academy/' },
        { icon: 'probe', role: 'Ishlab chiqarish boshlig‘i', pain: 'To‘xtashlar va avariyalar sababi ko‘rinmaydi.', gain: 'Monitoring tizimi liniya holati, OEE va avariyalarni telefoningizga real vaqtda ko‘rsatadi.', link: 'Monitoring', href: 'monitoring/' }
      ],
      toolsTitle: 'Saytda bepul foydalanadigan vositalar',
      toolsLead: 'Ro‘yxatdan o‘tmasdan ham ishlaydi. Kabinet ochsangiz, hammasi bir joyda saqlanadi.',
      tools: [
        { icon: 'spark', name: 'AI tashxis', text: 'Nosozlikni yozing yoki rasmini yuboring, ehtimoliy sabab va keyingi qadamni darhol olasiz.', href: '#contact' },
        { icon: 'alert', name: 'Xato kodlari bazasi', text: 'ABB, KUKA, FANUC, Siemens va invertor xatolarining ma’nosi va nima qilish kerakligi.', href: 'errors/' },
        { icon: 'search', name: 'Ariza holati', text: 'Ariza raqami bo‘yicha ish qaysi bosqichda ekanini istalgan vaqtda ko‘rasiz.', href: 'track/' },
        { icon: 'book', name: 'Qo‘llanmalar', text: 'Uskunalar bo‘yicha PDF ko‘rsatmalar va muhandis tayyorlagan materiallar.', href: 'manuals/' },
        { icon: 'play', name: 'Video darslar', text: 'Real uskunada ko‘rsatilgan qisqa video ko‘rsatmalar.', href: 'videos/' },
        { icon: 'qr', name: 'Uskuna pasporti', text: 'Har bir uskunaga QR kod: ta’mir tarixi va keyingi texnik xizmat sanasi.', href: 'documents/' }
      ],
      cmpTitle: 'Odatiy usul va {brand} farqi',
      cmpHead: ['', 'Odatda', '{brand} bilan'],
      cmp: [
        ['Usta topish', 'Tanishlar orqali, kunlab qidiriladi', 'Sayt yoki telefon orqali, {hours} soatda javob'],
        ['Narx', 'Ish tugagach aytiladi', 'Ishdan oldin yozma kelishiladi'],
        ['Kafolat', 'Ko‘pincha yo‘q', 'Ishga {wm} oy, ehtiyot qismga {pm} oy'],
        ['Hisobot', 'Nima qilingani noma’lum', 'Dalolatnoma, foto va ariza tarixi saqlanadi'],
        ['Keyingi safar', 'Muammo yana qaytadi', 'Xodimlaringiz o‘qitiladi, liniya kuzatib boriladi']
      ],
      cta: 'Muammoni yozing', ctaCall: 'Qo‘ng‘iroq qilish'
    }
  },
  ru: {
    why: {
      eyebrow: 'Зачем этот сайт',
      title: 'Когда оборудование встало, вы точно знаете, что делать',
      lead: '{brand} — одно место для предприятий с промышленным оборудованием: быстрый ремонт, обучение персонала и постоянный мониторинг линии. Не тратите время на поиски мастера, цена и результат известны заранее.',
      forTitle: 'Кому и какая польза',
      roles: [
        { icon: 'chart', role: 'Руководитель и владелец завода', pain: 'Простой линии — каждый час это потери.', gain: 'Инженер отвечает за {hours} ч, цена согласуется письменно до начала работ, гарантия на работу {wm} мес.', link: 'Услуги и цены', href: 'services/' },
        { icon: 'wrench', role: 'Главный инженер и техперсонал', pain: 'Появился код ошибки, причина непонятна.', gain: 'База кодов ошибок, AI-диагностика и инструкции помогут быстро найти причину самостоятельно.', link: 'Коды ошибок', href: 'errors/' },
        { icon: 'cap', role: 'Оператор и молодой специалист', pain: 'Сложно научиться работать с ПЛК и роботами.', gain: 'Практические курсы, видеоуроки и тесты, в конце сертификат.', link: 'Учебный центр', href: 'academy/' },
        { icon: 'probe', role: 'Начальник производства', pain: 'Не видно причин простоев и аварий.', gain: 'Система мониторинга показывает состояние линии, OEE и аварии на телефоне в реальном времени.', link: 'Мониторинг', href: 'monitoring/' }
      ],
      toolsTitle: 'Бесплатные инструменты на сайте',
      toolsLead: 'Работают и без регистрации. В личном кабинете всё хранится в одном месте.',
      tools: [
        { icon: 'spark', name: 'AI-диагностика', text: 'Опишите неисправность или пришлите фото и сразу получите вероятную причину и следующий шаг.', href: '#contact' },
        { icon: 'alert', name: 'База кодов ошибок', text: 'Расшифровка ошибок ABB, KUKA, FANUC, Siemens и частотников и что с ними делать.', href: 'errors/' },
        { icon: 'search', name: 'Статус заявки', text: 'По номеру заявки в любой момент видно, на каком этапе работа.', href: 'track/' },
        { icon: 'book', name: 'Инструкции', text: 'PDF-инструкции по оборудованию и материалы от инженера.', href: 'manuals/' },
        { icon: 'play', name: 'Видеоуроки', text: 'Короткие видеоинструкции на реальном оборудовании.', href: 'videos/' },
        { icon: 'qr', name: 'Паспорт оборудования', text: 'QR-код на каждую единицу: история ремонтов и дата следующего ТО.', href: 'documents/' }
      ],
      cmpTitle: 'Обычный подход и {brand}',
      cmpHead: ['', 'Обычно', 'С {brand}'],
      cmp: [
        ['Поиск мастера', 'Через знакомых, днями', 'Через сайт или телефон, ответ за {hours} ч'],
        ['Цена', 'Называют после работы', 'Письменно согласуется до начала'],
        ['Гарантия', 'Часто нет', '{wm} мес. на работу, {pm} мес. на запчасти'],
        ['Отчёт', 'Непонятно, что сделали', 'Акт, фото и история заявки сохраняются'],
        ['В следующий раз', 'Проблема возвращается', 'Персонал обучен, линия под наблюдением']
      ],
      cta: 'Описать проблему', ctaCall: 'Позвонить'
    }
  },
  en: {
    why: {
      eyebrow: 'Why this site',
      title: 'When equipment stops, you know exactly what to do',
      lead: '{brand} is one place for plants that run industrial equipment: fast repair, staff training and continuous line monitoring. No time lost looking for a technician, and the price and result are clear up front.',
      forTitle: 'Who it is for and what you get',
      roles: [
        { icon: 'chart', role: 'Plant owner and director', pain: 'Every hour of downtime costs money.', gain: 'An engineer replies within {hours} h, the price is agreed in writing before work starts, and the work carries a {wm}-month warranty.', link: 'Services and prices', href: 'services/' },
        { icon: 'wrench', role: 'Chief engineer and maintenance staff', pain: 'An error code appears and the cause is unclear.', gain: 'The error code library, AI diagnosis and manuals help you find the cause yourself, fast.', link: 'Error codes', href: 'errors/' },
        { icon: 'cap', role: 'Operator and junior engineer', pain: 'PLCs and robots are hard to learn.', gain: 'Hands-on courses, video lessons and tests, with a certificate at the end.', link: 'Training centre', href: 'academy/' },
        { icon: 'probe', role: 'Production manager', pain: 'The causes of stops and alarms are invisible.', gain: 'Monitoring shows line status, OEE and alarms on your phone in real time.', link: 'Monitoring', href: 'monitoring/' }
      ],
      toolsTitle: 'Free tools on the site',
      toolsLead: 'They work without signing up. With an account, everything is kept in one place.',
      tools: [
        { icon: 'spark', name: 'AI diagnosis', text: 'Describe the fault or send a photo and get the likely cause and next step right away.', href: '#contact' },
        { icon: 'alert', name: 'Error code library', text: 'What ABB, KUKA, FANUC, Siemens and drive errors mean and what to do about them.', href: 'errors/' },
        { icon: 'search', name: 'Request status', text: 'Check which stage your job is at any time, by request number.', href: 'track/' },
        { icon: 'book', name: 'Manuals', text: 'PDF guides for equipment and material prepared by the engineer.', href: 'manuals/' },
        { icon: 'play', name: 'Video lessons', text: 'Short video guides recorded on real equipment.', href: 'videos/' },
        { icon: 'qr', name: 'Equipment passport', text: 'A QR code on each machine: repair history and the next service date.', href: 'documents/' }
      ],
      cmpTitle: 'The usual way and {brand}',
      cmpHead: ['', 'Usually', 'With {brand}'],
      cmp: [
        ['Finding a technician', 'Through contacts, takes days', 'Via the site or phone, reply within {hours} h'],
        ['Price', 'Named after the job', 'Agreed in writing before work starts'],
        ['Warranty', 'Often none', '{wm} months on work, {pm} months on parts'],
        ['Report', 'Unclear what was done', 'Report, photos and request history are kept'],
        ['Next time', 'The problem comes back', 'Your staff are trained and the line is monitored']
      ],
      cta: 'Describe the problem', ctaCall: 'Call'
    }
  }
};
