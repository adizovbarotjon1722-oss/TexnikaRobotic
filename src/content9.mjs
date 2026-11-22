// 14-bosqich: PLC monitoring tizimlari (xizmat taklifi sahifasi).
export const content9 = {
  uz: {
    nav9: { mon: 'PLC monitoring' },
    meta9: {
      kw: {
        portfolio: 'bajarilgan ishlar, robot ta’mirlash natijalari, ABB robot ta’miri misoli, KUKA servis, PLC ta’miri misollari, sanoat uskunalari ta’miri portfoliosi, Toshkent',
        academy: 'sanoat robotlari kursi, PLC kursi, robot operatori o‘qitish, KUKA kursi, ABB robot o‘qitish, Siemens TIA Portal o‘rganish, texnika xavfsizligi kursi, LOTO, muhandislar uchun onlayn kurs, sertifikat',
        warranty: 'ta’mirga kafolat, kafolatni tekshirish, servis kafolati, ehtiyot qism kafolati, robot ta’miri kafolat',
        support: 'masofaviy texnik yordam, avariya chaqiruvi, robot to‘xtadi nima qilish, uskuna nosozligi yordam, 24/7 servis, TeamViewer orqali yordam, Toshkent',
        videos: 'video qo‘llanma, robot video dars, PLC video dars, KUKA video, ABB robot video, uskuna ta’miri videosi, operator uchun ko‘rsatma',
        track: 'ariza holati, ta’mir holatini tekshirish, servis arizasini kuzatish'
      },
      monTitle: 'PLC monitoring va SCADA: liniya holati, OEE, avariyalar Telegramda | {brand}',
      monDesc: 'Siemens, Mitsubishi, Omron, Allen-Bradley PLC lardan ma’lumot yig‘ib, liniya holati, OEE, to‘xtash sabablari va avariyalarni real vaqtda ko‘rsatamiz. Telegramga ogohlantirish, hisobotlar. {city} va O‘zbekiston bo‘ylab.',
      monKeywords: 'PLC monitoring, uskunalarni monitoring qilish, ishlab chiqarish monitoringi, SCADA tizimi, SCADA o‘rnatish, OEE hisoblash, liniya to‘xtashlarini hisobga olish, avariya xabarnomasi Telegram, IIoT, sanoat interneti, OPC UA, Modbus TCP, Siemens S7 monitoring, S7-1200, S7-1500, WinCC, TIA Portal, energiya iste’molini kuzatish, dispetcherlik tizimi, MES, ishlab chiqarishni raqamlashtirish, Toshkent, O‘zbekiston'
    },
    mon: {
      eyebrow: 'PLC monitoring',
      title: 'Liniyangiz holatini real vaqtda ko‘ring',
      lead: 'PLC kontrollerlaringizdan ma’lumot yig‘amiz va uni tushunarli panelga chiqaramiz: qaysi uskuna ishlayapti, qaysi biri to‘xtagan va nima sababdan, smenada qancha mahsulot chiqdi. Avariya bo‘lsa, mas’ul odam Telegramda darhol xabar oladi.',
      cta: 'Monitoring bo‘yicha taklif olish', more: 'Batafsil',
      svc: 'PLC monitoring tizimi',
      homeLead: 'Liniya holati, OEE, to‘xtash sabablari va avariyalar bitta panelda, ogohlantirishlar Telegramda.',
      panel: { title: 'Liniya holati', shift: '2-smena', run: 'Ishlayapti', stop: 'To‘xtagan', alarm: 'Avariya', oee: 'OEE', out: 'Mahsulot', down: 'To‘xtash', log: 'Oxirgi hodisalar',
        lines: ['Quyish liniyasi 1', 'Qadoqlash roboti', 'Konveyer B'],
        events: [['14:32', 'Qadoqlash roboti: SRVO-050, servo xatosi'], ['14:05', 'Konveyer B: material yo‘q, 6 daqiqa'], ['13:40', 'Quyish liniyasi 1: smena rejasi 92%']] },
      whatTitle: 'Nimalarni kuzatamiz',
      what: [
        ['Uskuna holati', 'Ishlayapti, kutmoqda, to‘xtagan yoki avariya. Har bir mashina uchun vaqt chizig‘i.'],
        ['OEE va unumdorlik', 'Mavjudlik, tezlik va sifat bo‘yicha OEE, smena va kun kesimida.'],
        ['To‘xtash sabablari', 'Qachon, qancha vaqt va nima sababdan to‘xtagani. Eng ko‘p vaqt yo‘qotadigan sabablar ro‘yxati.'],
        ['Avariyalar Telegramda', 'PLC dagi avariya biti yoki xato kodi chiqqanda mas’ul muhandisga xabar boradi.'],
        ['Texnologik parametrlar', 'Harorat, bosim, tezlik, tok va boshqa signallarning trendlari va chegaradan chiqishlar.'],
        ['Energiya iste’moli', 'Elektr hisoblagichlar va analizatorlardan kVt·soat, mahsulot birligiga sarf.']
      ],
      howTitle: 'Qanday ishlaydi',
      howLead: 'Ma’lumot PLC dan faqat o‘qiladi. Biz dasturingizga o‘zgartirish kiritmaymiz va liniyani to‘xtatmaymiz.',
      arch: [['PLC va datchiklar', 'Siemens, Mitsubishi, Omron, Allen-Bradley, Delta, inverterlar, hisoblagichlar'], ['Shlyuz', 'Sanoat kompyuteri yoki IoT-shlyuz: OPC UA, Modbus, S7, MQTT'], ['Server', 'Korxonangiz ichida yoki bulutda, ma’lumotlar sizniki'], ['Panel va Telegram', 'Brauzer, telefon, sex ekrani; ogohlantirishlar va hisobotlar']],
      protoTitle: 'Qo‘llab-quvvatlanadigan protokollar',
      protocols: ['Siemens S7 (S7-300, 400, 1200, 1500)', 'OPC UA', 'Modbus TCP / RTU', 'Profinet', 'EtherNet/IP (Allen-Bradley)', 'Mitsubishi MC protokoli', 'Omron FINS', 'MQTT'],
      stepsTitle: 'Ishni qanday boshlaymiz',
      steps: [
        ['Audit', 'Liniyani ko‘rib chiqamiz: PLC lar, tarmoq, qaysi signallar kerakligi. Masofadan yoki joyida.'],
        ['Signallar ro‘yxati', 'Siz bilan birga nimani o‘lchashni va qaysi avariyalar haqida xabar berishni kelishamiz.'],
        ['Ulanish', 'Shlyuzni o‘rnatamiz va PLC larga faqat o‘qish rejimida ulanamiz, ishlab chiqarish to‘xtamaydi.'],
        ['Panel va xabarnomalar', 'Panel, smena hisobotlari va Telegram ogohlantirishlarini sozlaymiz.'],
        ['O‘qitish va xizmat', 'Operator va muhandislarni o‘qitamiz, tizimni kafolat bilan kuzatib boramiz.']
      ],
      pkgTitle: 'Yechim variantlari',
      pkgLead: 'Narx signallar soni va uskunalarga bog‘liq. Auditdan keyin aniq taklif beramiz.',
      pkgs: [
        { name: 'Start', for: 'Bitta liniya yoki mashina', items: ['20 tagacha signal', 'Holat va avariyalar paneli', 'Telegramga avariya xabari', 'Kunlik hisobot'] },
        { name: 'Ishlab chiqarish', for: 'Sex yoki bir nechta liniya', items: ['OEE va to‘xtash sabablari', 'Smena va oylik hisobotlar', 'Parametr trendlari va chegaralar', 'Sex ekrani uchun panel'] },
        { name: 'Zavod', for: 'Butun korxona', items: ['Bir nechta sex va bino', 'Energiya hisobi', 'ERP / 1C bilan integratsiya', 'Server korxona ichida'] }
      ],
      safe: 'PLC dasturingizga tegmaymiz: ma’lumot faqat o‘qiladi, boshqaruv o‘zingizda qoladi.',
      faq: [
        { q: 'Monitoring uchun PLC dasturini o‘zgartirish kerakmi?', a: 'Ko‘p hollarda yo‘q. Ma’lumot mavjud teglar va xotira manzillaridan o‘qiladi. Agar kerakli signal PLC da bo‘lmasa, avval siz bilan kelishib, kichik o‘zgartirish taklif qilamiz.' },
        { q: 'Eski uskunalarni ham ulash mumkinmi?', a: 'Ha. S7-300/400, eski Mitsubishi va Omron kontrollerlar, tarmog‘i yo‘q mashinalar ham shlyuz yoki qo‘shimcha datchiklar orqali ulanadi.' },
        { q: 'Ma’lumotlar qayerda saqlanadi?', a: 'Tanlovingizga ko‘ra: korxona ichidagi serverda yoki bulutda. Ma’lumotlar sizga tegishli, istalgan vaqtda Excel ga yuklab olasiz.' },
        { q: 'Internet uzilsa nima bo‘ladi?', a: 'Shlyuz ma’lumotni o‘zida saqlab turadi va aloqa tiklanganda yuboradi. Ichki tarmoqdagi panel internetsiz ham ishlaydi.' },
        { q: 'Tizimni qancha vaqtda ishga tushirasiz?', a: 'Bitta liniya uchun odatda 1–2 hafta: audit, ulanish, panel va xabarnomalar. Katta korxona uchun bosqichma-bosqich reja tuzamiz.' }
      ]
    }
  },
  ru: {
    nav9: { mon: 'Мониторинг ПЛК' },
    meta9: {
      kw: {
        portfolio: 'выполненные работы, примеры ремонта роботов, ремонт ABB пример, сервис KUKA, ремонт ПЛК примеры, портфолио ремонта промышленного оборудования, Ташкент',
        academy: 'курсы по промышленным роботам, курс ПЛК, обучение операторов роботов, курс KUKA, обучение ABB, обучение TIA Portal, курс по технике безопасности, LOTO, онлайн курсы для инженеров, сертификат',
        warranty: 'гарантия на ремонт, проверка гарантии, сервисная гарантия, гарантия на запчасти, гарантия ремонта робота',
        support: 'удалённая техническая поддержка, аварийный вызов, робот остановился что делать, помощь при поломке оборудования, сервис 24/7, поддержка через TeamViewer, Ташкент',
        videos: 'видеоинструкции, видеоуроки по роботам, видеоуроки ПЛК, видео KUKA, видео ABB, видео ремонта оборудования, инструкции для оператора',
        track: 'статус заявки, проверить статус ремонта, отслеживание сервисной заявки'
      },
      monTitle: 'Мониторинг ПЛК и SCADA: состояние линии, OEE, аварии в Telegram | {brand}',
      monDesc: 'Собираем данные с ПЛК Siemens, Mitsubishi, Omron, Allen-Bradley и показываем состояние линии, OEE, причины простоев и аварии в реальном времени. Уведомления в Telegram, отчёты. {city} и вся Узбекистан.',
      monKeywords: 'мониторинг ПЛК, мониторинг оборудования, мониторинг производства, система SCADA, внедрение SCADA, расчёт OEE, учёт простоев оборудования, уведомления об авариях в Telegram, IIoT, промышленный интернет вещей, OPC UA, Modbus TCP, мониторинг Siemens S7, S7-1200, S7-1500, WinCC, TIA Portal, учёт электроэнергии, диспетчеризация, MES, цифровизация производства, Ташкент, Узбекистан'
    },
    mon: {
      eyebrow: 'Мониторинг ПЛК',
      title: 'Состояние вашей линии в реальном времени',
      lead: 'Собираем данные с ваших контроллеров и выводим их на понятную панель: какое оборудование работает, какое стоит и почему, сколько продукции выпущено за смену. При аварии ответственный сразу получает сообщение в Telegram.',
      cta: 'Получить предложение по мониторингу', more: 'Подробнее',
      svc: 'Система мониторинга ПЛК',
      homeLead: 'Состояние линии, OEE, причины простоев и аварии на одной панели, уведомления в Telegram.',
      panel: { title: 'Состояние линии', shift: 'Смена 2', run: 'Работает', stop: 'Стоит', alarm: 'Авария', oee: 'OEE', out: 'Выпуск', down: 'Простой', log: 'Последние события',
        lines: ['Линия розлива 1', 'Робот упаковки', 'Конвейер B'],
        events: [['14:32', 'Робот упаковки: SRVO-050, ошибка сервопривода'], ['14:05', 'Конвейер B: нет материала, 6 мин'], ['13:40', 'Линия розлива 1: план смены 92%']] },
      whatTitle: 'Что мы отслеживаем',
      what: [
        ['Состояние оборудования', 'Работает, ожидает, стоит или в аварии. Временная шкала по каждой машине.'],
        ['OEE и производительность', 'OEE по доступности, скорости и качеству, в разрезе смены и дня.'],
        ['Причины простоев', 'Когда, сколько и почему стояло оборудование. Рейтинг причин, которые съедают больше всего времени.'],
        ['Аварии в Telegram', 'При аварийном бите или коде ошибки в ПЛК ответственный инженер получает сообщение.'],
        ['Технологические параметры', 'Тренды температуры, давления, скорости, тока и выходы за пределы.'],
        ['Расход энергии', 'кВт·ч со счётчиков и анализаторов, расход на единицу продукции.']
      ],
      howTitle: 'Как это работает',
      howLead: 'Данные с ПЛК только читаются. Мы не меняем вашу программу и не останавливаем линию.',
      arch: [['ПЛК и датчики', 'Siemens, Mitsubishi, Omron, Allen-Bradley, Delta, частотники, счётчики'], ['Шлюз', 'Промышленный ПК или IoT-шлюз: OPC UA, Modbus, S7, MQTT'], ['Сервер', 'На вашем предприятии или в облаке, данные принадлежат вам'], ['Панель и Telegram', 'Браузер, телефон, экран в цеху; уведомления и отчёты']],
      protoTitle: 'Поддерживаемые протоколы',
      protocols: ['Siemens S7 (S7-300, 400, 1200, 1500)', 'OPC UA', 'Modbus TCP / RTU', 'Profinet', 'EtherNet/IP (Allen-Bradley)', 'Протокол Mitsubishi MC', 'Omron FINS', 'MQTT'],
      stepsTitle: 'Как мы начинаем',
      steps: [
        ['Аудит', 'Смотрим линию: ПЛК, сеть, какие сигналы нужны. Удалённо или на месте.'],
        ['Список сигналов', 'Вместе решаем, что измерять и о каких авариях сообщать.'],
        ['Подключение', 'Ставим шлюз и подключаемся к ПЛК только на чтение, производство не останавливается.'],
        ['Панель и уведомления', 'Настраиваем панель, сменные отчёты и уведомления в Telegram.'],
        ['Обучение и сервис', 'Обучаем операторов и инженеров, сопровождаем систему с гарантией.']
      ],
      pkgTitle: 'Варианты решения',
      pkgLead: 'Стоимость зависит от количества сигналов и оборудования. После аудита даём точное предложение.',
      pkgs: [
        { name: 'Старт', for: 'Одна линия или машина', items: ['До 20 сигналов', 'Панель состояния и аварий', 'Аварии в Telegram', 'Ежедневный отчёт'] },
        { name: 'Производство', for: 'Цех или несколько линий', items: ['OEE и причины простоев', 'Сменные и месячные отчёты', 'Тренды и уставки параметров', 'Панель для экрана в цеху'] },
        { name: 'Завод', for: 'Всё предприятие', items: ['Несколько цехов и зданий', 'Учёт энергии', 'Интеграция с ERP / 1С', 'Сервер на предприятии'] }
      ],
      safe: 'Мы не трогаем программу ПЛК: данные только читаются, управление остаётся у вас.',
      faq: [
        { q: 'Нужно ли менять программу ПЛК для мониторинга?', a: 'Чаще всего нет. Данные читаются из существующих тегов и адресов памяти. Если нужного сигнала в ПЛК нет, сначала согласуем с вами небольшое изменение.' },
        { q: 'Можно ли подключить старое оборудование?', a: 'Да. S7-300/400, старые Mitsubishi и Omron, машины без сети подключаются через шлюз или дополнительные датчики.' },
        { q: 'Где хранятся данные?', a: 'На ваш выбор: на сервере предприятия или в облаке. Данные принадлежат вам, их можно выгрузить в Excel в любой момент.' },
        { q: 'Что будет, если пропадёт интернет?', a: 'Шлюз хранит данные у себя и отправит их после восстановления связи. Панель во внутренней сети работает и без интернета.' },
        { q: 'За какой срок запускается система?', a: 'Для одной линии обычно 1–2 недели: аудит, подключение, панель и уведомления. Для большого предприятия составляем поэтапный план.' }
      ]
    }
  },
  en: {
    nav9: { mon: 'PLC monitoring' },
    meta9: {
      kw: {
        portfolio: 'case studies, robot repair results, ABB robot repair example, KUKA service, PLC repair cases, industrial equipment repair portfolio, Tashkent',
        academy: 'industrial robot course, PLC course, robot operator training, KUKA training, ABB robot training, Siemens TIA Portal training, safety course, LOTO, online courses for engineers, certificate',
        warranty: 'repair warranty, warranty check, service warranty, spare parts warranty, robot repair warranty',
        support: 'remote technical support, emergency call-out, robot stopped what to do, equipment breakdown help, 24/7 service, TeamViewer support, Tashkent',
        videos: 'video guides, robot video lessons, PLC video lessons, KUKA video, ABB robot video, equipment repair video, operator instructions',
        track: 'request status, check repair status, track service request'
      },
      monTitle: 'PLC Monitoring and SCADA: Line Status, OEE, Alarms in Telegram | {brand}',
      monDesc: 'We collect data from Siemens, Mitsubishi, Omron and Allen-Bradley PLCs and show line status, OEE, downtime causes and alarms in real time. Telegram alerts and reports. {city} and across Uzbekistan.',
      monKeywords: 'PLC monitoring, machine monitoring, production monitoring, SCADA system, SCADA integration, OEE tracking, downtime tracking, alarm notifications Telegram, IIoT, industrial IoT, OPC UA, Modbus TCP, Siemens S7 monitoring, S7-1200, S7-1500, WinCC, TIA Portal, energy monitoring, MES, manufacturing digitalization, Tashkent, Uzbekistan'
    },
    mon: {
      eyebrow: 'PLC monitoring',
      title: 'See your line status in real time',
      lead: 'We collect data from your controllers and put it on a clear dashboard: which machine is running, which has stopped and why, how much was produced this shift. When an alarm occurs, the responsible person gets a Telegram message right away.',
      cta: 'Get a monitoring proposal', more: 'Learn more',
      svc: 'PLC monitoring system',
      homeLead: 'Line status, OEE, downtime causes and alarms on one dashboard, with alerts in Telegram.',
      panel: { title: 'Line status', shift: 'Shift 2', run: 'Running', stop: 'Stopped', alarm: 'Alarm', oee: 'OEE', out: 'Output', down: 'Downtime', log: 'Recent events',
        lines: ['Filling line 1', 'Packing robot', 'Conveyor B'],
        events: [['14:32', 'Packing robot: SRVO-050, servo error'], ['14:05', 'Conveyor B: no material, 6 min'], ['13:40', 'Filling line 1: shift plan 92%']] },
      whatTitle: 'What we track',
      what: [
        ['Machine state', 'Running, idle, stopped or in alarm. A timeline for every machine.'],
        ['OEE and performance', 'OEE by availability, speed and quality, per shift and per day.'],
        ['Downtime causes', 'When, how long and why a machine stopped. A ranking of the causes that cost the most time.'],
        ['Alarms in Telegram', 'When an alarm bit or error code appears in the PLC, the responsible engineer is notified.'],
        ['Process parameters', 'Trends of temperature, pressure, speed, current and out-of-limit events.'],
        ['Energy use', 'kWh from meters and analyzers, consumption per unit of output.']
      ],
      howTitle: 'How it works',
      howLead: 'PLC data is read only. We do not change your program and we do not stop the line.',
      arch: [['PLCs and sensors', 'Siemens, Mitsubishi, Omron, Allen-Bradley, Delta, VFDs, meters'], ['Gateway', 'Industrial PC or IoT gateway: OPC UA, Modbus, S7, MQTT'], ['Server', 'On your site or in the cloud; the data is yours'], ['Dashboard and Telegram', 'Browser, phone, shop-floor screen; alerts and reports']],
      protoTitle: 'Supported protocols',
      protocols: ['Siemens S7 (S7-300, 400, 1200, 1500)', 'OPC UA', 'Modbus TCP / RTU', 'Profinet', 'EtherNet/IP (Allen-Bradley)', 'Mitsubishi MC protocol', 'Omron FINS', 'MQTT'],
      stepsTitle: 'How we start',
      steps: [
        ['Audit', 'We review the line: PLCs, network and which signals are needed. Remotely or on site.'],
        ['Signal list', 'Together we agree what to measure and which alarms to report.'],
        ['Connection', 'We install the gateway and connect to the PLCs read-only; production keeps running.'],
        ['Dashboard and alerts', 'We set up the dashboard, shift reports and Telegram alerts.'],
        ['Training and support', 'We train operators and engineers and support the system under warranty.']
      ],
      pkgTitle: 'Solution options',
      pkgLead: 'The price depends on the number of signals and machines. After the audit we give an exact proposal.',
      pkgs: [
        { name: 'Start', for: 'One line or machine', items: ['Up to 20 signals', 'Status and alarm dashboard', 'Alarms in Telegram', 'Daily report'] },
        { name: 'Production', for: 'A workshop or several lines', items: ['OEE and downtime causes', 'Shift and monthly reports', 'Parameter trends and limits', 'Shop-floor screen dashboard'] },
        { name: 'Plant', for: 'The whole enterprise', items: ['Several workshops and buildings', 'Energy accounting', 'ERP / 1C integration', 'On-site server'] }
      ],
      safe: 'We do not touch your PLC program: data is read only and control stays with you.',
      faq: [
        { q: 'Do you need to change the PLC program for monitoring?', a: 'Usually not. Data is read from existing tags and memory addresses. If a signal you need is missing in the PLC, we first agree a small change with you.' },
        { q: 'Can old equipment be connected?', a: 'Yes. S7-300/400, older Mitsubishi and Omron controllers and machines without a network are connected through a gateway or extra sensors.' },
        { q: 'Where is the data stored?', a: 'Your choice: on a server at your plant or in the cloud. The data belongs to you and can be exported to Excel at any time.' },
        { q: 'What if the internet goes down?', a: 'The gateway buffers data and sends it when the connection is back. The dashboard on the local network works without internet.' },
        { q: 'How long does it take to launch?', a: 'For one line usually 1–2 weeks: audit, connection, dashboard and alerts. For a large plant we make a phased plan.' }
      ]
    }
  }
};
