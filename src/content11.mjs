// 17-bosqich: konversiyaga yo‘naltirilgan bosh sahifa (aniq taklif, qo‘ng‘iroq, ishonch, narx mantiqi, mobil panel)
export const content11 = {
  uz: {
    v3: {
      hero: {
        h1k: 'PLC servis va sanoat uskunalariga texnik xizmat ko‘rsatish',
        h1: 'Liniya to‘xtadimi? PLC, ABB va KUKA robotlarini tiklaymiz',
        lead: '{city} va butun O‘zbekiston. Muhandis {hours} soat ichida javob beradi, avariyadagi uskuna navbatsiz ko‘riladi. Narx ishdan oldin yozma kelishiladi.',
        call: 'Qo‘ng‘iroq qilish', order: 'Ariza qoldirish', tg: 'Telegramga yozish',
        facts: [['{hours} soat', 'ichida muhandis javobi'], ['{wm} oy', 'bajarilgan ishga kafolat'], ['Yozma', 'narx ishdan oldin']]
      },
      cb: {
        title: 'Qo‘ng‘iroq qilib beramiz', lead: 'Raqamingizni qoldiring, muhandisning o‘zi qo‘ng‘iroq qiladi.',
        phone: 'Telefon raqamingiz', urgent: 'Uskuna hozir to‘xtab turibdi', send: 'Qo‘ng‘iroqni kutaman',
        ok: 'Qabul qilindi. Ariza raqami: {code}. Muhandis tez orada qo‘ng‘iroq qiladi.', err: 'Yuborib bo‘lmadi. Iltimos, qayta urinib ko‘ring.', errPhone: 'Telefon raqamini to‘liq kiriting',
        consent: 'Yuborish bilan shu raqam orqali bog‘lanishga rozilik bildirasiz.',
        msg: 'Mijoz qayta qo‘ng‘iroq so‘radi.', msgUrgent: 'SHOSHILINCH: uskuna to‘xtab turibdi. Mijoz qayta qo‘ng‘iroq so‘radi.'
      },
      trust: {
        label: 'Nega bizga ishonishadi',
        items: [
          ['doc', 'Shartnoma va hujjatlar', 'Tijorat taklifi, hisob-faktura va bajarilgan ish dalolatnomasi beriladi.'],
          ['check', 'Narx oldindan yoziladi', 'Diagnostikadan keyin yozma smeta. Kelishuvsiz qo‘shimcha ish qilinmaydi.'],
          ['shield', '{wm} oy kafolat', 'Kafolat ariza raqami bo‘yicha saytda onlayn tekshiriladi.'],
          ['team', 'Kim kelishini bilasiz', 'Ustaning ismi, tajribasi va bajargan ishlari saytda ochiq.'],
          ['lock', 'Dastur xavfsizligi', 'Har qanday aralashuvdan oldin dastur va parametrlar zaxiralanadi.']
        ],
        brandsLabel: 'Ishlaydigan uskunalar', brands: ['ABB', 'KUKA', 'Siemens S7', 'TIA Portal', 'WinCC', 'Xitoy uskunalari', 'Germaniya uskunalari']
      },
      cat: {
        eyebrow: 'Xizmatlar va narxlar',
        title: 'Nima qilamiz va narx qanday hisoblanadi',
        lead: 'Har bir xizmatning narxi uskuna turi va ish hajmiga bog‘liq. Aniq summani diagnostikadan keyin yozma smetada olasiz.',
        head: ['Xizmat', 'Nima kiradi', 'Narx asosi'],
        items: [
          { key: 'plc', name: 'PLC nosozligini topish va tuzatish', text: 'Siemens S7, Xitoy va Germaniya uskunalari kontrollerlari: xato tahlili, dastur tiklash, modul almashtirish.', price: 'Diagnostika + ish hajmi' },
          { key: 'robots', name: 'ABB va KUKA robot servisi', text: 'Ta’mir, RAPID va KRL dasturlarini tuzatish, mastering, backup, ehtiyot qism.', price: 'Diagnostika + ish hajmi' },
          { key: 'to', name: 'Uskunalarga texnik xizmat ko‘rsatish', text: 'Rejali TO, nazorat varaqasi, TO jurnali va keyingi xizmat eslatmasi.', price: 'Bir martalik yoki oylik shartnoma' },
          { key: 'training', name: 'PLC va robotlar bo‘yicha o‘qitish', text: 'Operator, elektrik va muhandislar uchun amaliy kurs, test va sertifikat.', price: 'Kurs va guruh hajmi bo‘yicha' },
          { key: 'mon', name: 'Avtomatik monitoring tizimi', text: 'PLC ga ulanish, OEE va to‘xtashlar paneli, avariya Telegramga.', price: 'Loyiha + oylik xizmat' },
          { key: 'docs', name: 'Elektron hujjatlar', text: 'Smena hisobotlari, TO jurnallari va QR kodli uskuna pasportlari.', price: 'Loyiha bo‘yicha' }
        ],
        more: 'Batafsil', ask: 'Narxni so‘rash',
        stepsTitle: 'Narx qanday shakllanadi',
        steps: [
          ['Ariza', 'Muammoni yozing yoki qo‘ng‘iroq qiling. {hours} soat ichida javob beramiz.'],
          ['Diagnostika', 'Masofadan yoki obyektda asl sababni aniqlaymiz.'],
          ['Yozma smeta', 'Ish hajmi, muddat va narx yoziladi. Siz tasdiqlaysiz.'],
          ['Ish va hisobot', 'Bajarilgan ish, almashgan qismlar va dalolatnoma topshiriladi.'],
          ['Kafolat', '{wm} oy kafolat, ariza raqami bo‘yicha tekshiriladi.']
        ]
      },
      area: { title: 'Xizmat hududi', text: '{city}, Samarqand, Buxoro, Navoiy, Andijon, Farg‘ona, Namangan, Qarshi, Nukus. Masofaviy yordam butun dunyo bo‘ylab.' },
      bar: { call: 'Qo‘ng‘iroq', tg: 'Telegram', order: 'Ariza' }
    }
  },
  ru: {
    v3: {
      hero: {
        h1k: 'Ремонт и сервис ПЛК, техническое обслуживание промышленного оборудования',
        h1: 'Линия встала? Восстановим ПЛК, роботы ABB и KUKA',
        lead: '{city} и весь Узбекистан. Инженер отвечает в течение {hours} ч, аварийное оборудование берём без очереди. Цена согласуется письменно до начала работ.',
        call: 'Позвонить', order: 'Оставить заявку', tg: 'Написать в Telegram',
        facts: [['{hours} ч', 'на ответ инженера'], ['{wm} мес.', 'гарантия на работы'], ['Письменно', 'цена до начала работ']]
      },
      cb: {
        title: 'Перезвоним вам', lead: 'Оставьте номер, инженер позвонит сам.',
        phone: 'Ваш номер телефона', urgent: 'Оборудование стоит прямо сейчас', send: 'Жду звонка',
        ok: 'Принято. Номер заявки: {code}. Инженер скоро позвонит.', err: 'Не удалось отправить. Попробуйте ещё раз.', errPhone: 'Введите номер полностью',
        consent: 'Отправляя, вы соглашаетесь на связь по этому номеру.',
        msg: 'Клиент просит перезвонить.', msgUrgent: 'СРОЧНО: оборудование стоит. Клиент просит перезвонить.'
      },
      trust: {
        label: 'Почему нам доверяют',
        items: [
          ['doc', 'Договор и документы', 'Коммерческое предложение, счёт и акт выполненных работ.'],
          ['check', 'Цена заранее письменно', 'После диагностики письменная смета. Без согласования доп. работ нет.'],
          ['shield', 'Гарантия {wm} мес.', 'Гарантия проверяется онлайн по номеру заявки.'],
          ['team', 'Вы знаете, кто приедет', 'Имя, опыт и выполненные работы мастера открыты на сайте.'],
          ['lock', 'Защита программы', 'Перед любым вмешательством делается резервная копия программы и параметров.']
        ],
        brandsLabel: 'С чем работаем', brands: ['ABB', 'KUKA', 'Siemens S7', 'TIA Portal', 'WinCC', 'Оборудование из Китая', 'Оборудование из Германии']
      },
      cat: {
        eyebrow: 'Услуги и цены',
        title: 'Что делаем и как считается цена',
        lead: 'Цена каждой услуги зависит от типа оборудования и объёма работ. Точную сумму вы получаете в письменной смете после диагностики.',
        head: ['Услуга', 'Что входит', 'Основа цены'],
        items: [
          { key: 'plc', name: 'Поиск и устранение неисправностей ПЛК', text: 'Контроллеры Siemens S7, китайского и немецкого оборудования: анализ ошибок, восстановление программы, замена модулей.', price: 'Диагностика + объём работ' },
          { key: 'robots', name: 'Сервис роботов ABB и KUKA', text: 'Ремонт, исправление программ RAPID и KRL, мастеринг, бэкап, запчасти.', price: 'Диагностика + объём работ' },
          { key: 'to', name: 'Техническое обслуживание оборудования', text: 'Плановое ТО, чек-лист, журнал ТО и напоминание о следующем обслуживании.', price: 'Разово или по месячному договору' },
          { key: 'training', name: 'Обучение по ПЛК и роботам', text: 'Практический курс для операторов, электриков и инженеров, тест и сертификат.', price: 'По курсу и размеру группы' },
          { key: 'mon', name: 'Система автоматического мониторинга', text: 'Подключение к ПЛК, панель OEE и простоев, аварии в Telegram.', price: 'Проект + ежемесячный сервис' },
          { key: 'docs', name: 'Электронные документы', text: 'Сменные отчёты, журналы ТО и паспорта оборудования с QR-кодом.', price: 'По проекту' }
        ],
        more: 'Подробнее', ask: 'Узнать цену',
        stepsTitle: 'Как формируется цена',
        steps: [
          ['Заявка', 'Опишите проблему или позвоните. Ответим в течение {hours} ч.'],
          ['Диагностика', 'Удалённо или на объекте находим первопричину.'],
          ['Письменная смета', 'Объём, сроки и цена фиксируются. Вы утверждаете.'],
          ['Работа и отчёт', 'Выполненные работы, заменённые детали и акт.'],
          ['Гарантия', '{wm} мес., проверяется по номеру заявки.']
        ]
      },
      area: { title: 'Зона обслуживания', text: '{city}, Самарканд, Бухара, Навои, Андижан, Фергана, Наманган, Карши, Нукус. Удалённая помощь по всему миру.' },
      bar: { call: 'Звонок', tg: 'Telegram', order: 'Заявка' }
    }
  },
  en: {
    v3: {
      hero: {
        h1k: 'PLC service and industrial equipment maintenance',
        h1: 'Line down? We restore PLCs, ABB and KUKA robots',
        lead: '{city} and all of Uzbekistan. An engineer replies within {hours} hours, and equipment that is down goes to the front of the queue. The price is agreed in writing before work starts.',
        call: 'Call us', order: 'Send a request', tg: 'Message on Telegram',
        facts: [['{hours} h', 'engineer response'], ['{wm} months', 'warranty on work'], ['Written', 'price before work']]
      },
      cb: {
        title: 'We’ll call you back', lead: 'Leave your number and the engineer will call you.',
        phone: 'Your phone number', urgent: 'Equipment is down right now', send: 'Call me back',
        ok: 'Received. Request number: {code}. The engineer will call you shortly.', err: 'Could not send. Please try again.', errPhone: 'Enter the full phone number',
        consent: 'By sending, you agree to be contacted at this number.',
        msg: 'Customer asked for a call back.', msgUrgent: 'URGENT: equipment is down. Customer asked for a call back.'
      },
      trust: {
        label: 'Why clients trust us',
        items: [
          ['doc', 'Contract and paperwork', 'Quotation, invoice and certificate of completed work.'],
          ['check', 'Written price up front', 'A written estimate after diagnosis. No extra work without approval.'],
          ['shield', '{wm}-month warranty', 'Check your warranty online by request number.'],
          ['team', 'You know who comes', 'The engineer’s name, experience and past work are public.'],
          ['lock', 'Program safety', 'Programs and parameters are backed up before any intervention.']
        ],
        brandsLabel: 'Equipment we work with', brands: ['ABB', 'KUKA', 'Siemens S7', 'TIA Portal', 'WinCC', 'Chinese machinery', 'German machinery']
      },
      cat: {
        eyebrow: 'Services and pricing',
        title: 'What we do and how the price is set',
        lead: 'The price of each service depends on the equipment and the scope of work. You get the exact amount in a written estimate after diagnosis.',
        head: ['Service', 'What is included', 'Price basis'],
        items: [
          { key: 'plc', name: 'PLC fault finding and repair', text: 'Siemens S7 and controllers on Chinese and German machinery: fault analysis, program recovery, module replacement.', price: 'Diagnosis + scope of work' },
          { key: 'robots', name: 'ABB and KUKA robot service', text: 'Repair, RAPID and KRL program fixes, mastering, backup, spare parts.', price: 'Diagnosis + scope of work' },
          { key: 'to', name: 'Equipment maintenance', text: 'Planned maintenance, checklist, maintenance log and next-service reminder.', price: 'One-off or monthly contract' },
          { key: 'training', name: 'PLC and robot training', text: 'Hands-on course for operators, electricians and engineers, with test and certificate.', price: 'Per course and group size' },
          { key: 'mon', name: 'Automatic monitoring system', text: 'PLC connection, OEE and downtime dashboard, alarms to Telegram.', price: 'Project + monthly service' },
          { key: 'docs', name: 'Digital documents', text: 'Shift reports, maintenance logs and QR equipment passports.', price: 'Per project' }
        ],
        more: 'Details', ask: 'Ask for a price',
        stepsTitle: 'How the price is formed',
        steps: [
          ['Request', 'Describe the problem or call. We reply within {hours} hours.'],
          ['Diagnosis', 'We find the root cause remotely or on site.'],
          ['Written estimate', 'Scope, timing and price in writing. You approve.'],
          ['Work and report', 'Work done, parts replaced and a completion certificate.'],
          ['Warranty', '{wm} months, checked by request number.']
        ]
      },
      area: { title: 'Service area', text: '{city}, Samarkand, Bukhara, Navoiy, Andijan, Fergana, Namangan, Karshi, Nukus. Remote support worldwide.' },
      bar: { call: 'Call', tg: 'Telegram', order: 'Request' }
    }
  }
};
