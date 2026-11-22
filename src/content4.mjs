// 5-bosqich matnlari: PLC ta'miri, kafolat va sifat, to'xtash narxi kalkulyatori.
// {wm} — ishga kafolat (oy), {pm} — ehtiyot qismga kafolat (oy): admin paneldagi Sozlamalardan olinadi.
export const content4 = {
  uz: {
    nav5: { plc: 'PLC ta’miri', warranty: 'Kafolat' },
    meta5: {
      plcTitle: 'PLC ta’miri: Siemens S7, Mitsubishi, Omron | {brand}',
      plcDesc: 'PLC kontrollerlar ta’miri: CPU STOP, SF/BF xatolari, Profinet va Profibus aloqasi, I/O modullar, analog signallar, yo‘qolgan dastur va HMI. {city} va butun O‘zbekiston bo‘ylab, kafolat bilan.',
      warrantyTitle: 'Kafolat, sifat va asl ehtiyot qismlar | {brand}',
      warrantyDesc: 'Bajarilgan ishga {wm} oy kafolat, asl ehtiyot qismlar va yozma hisobot. Kafolat muddatini ariza raqami orqali onlayn tekshiring.'
    },
    plc: {
      eyebrow: 'PLC va avtomatika',
      title: 'PLC nosozliklarini topamiz va tuzatamiz',
      lead: 'Liniya to‘xtadi, CPU STOP holatida, qizil SF yoki BF yonib turibdi. Avval dasturning nusxasini olamiz, keyin sababini topamiz: modul, aloqa, manba yoki dastur mantig‘i.',
      homeLead: 'Siemens S7, Mitsubishi, Omron, Allen-Bradley va Xitoy PLC lari. Dastur nusxasi, diagnostika, modul ta’miri va sinov bir joyda.',
      more: 'PLC ta’miri sahifasi',
      svc: 'PLC ta’miri va dasturlash',
      cta: 'PLC muammosini yuborish',
      points: ['CPU STOP va SF xatosi', 'Profinet / Profibus uzilishi', 'I/O modul ta’miri', 'Analog 4–20 mA', 'Yo‘qolgan dastur', 'HMI aloqasi'],
      platformsTitle: 'Qaysi PLC lar bilan ishlaymiz',
      platforms: [
        ['Siemens', 'S7-200 · S7-300 · S7-400 · S7-1200 · S7-1500 · LOGO!', 'TIA Portal · STEP 7'],
        ['Mitsubishi', 'FX3U · FX5U · Q · iQ-R', 'GX Works2 · GX Works3'],
        ['Omron', 'CP1 · CJ2 · NX/NJ', 'CX-Programmer · Sysmac Studio'],
        ['Allen-Bradley', 'MicroLogix · CompactLogix · ControlLogix', 'RSLogix · Studio 5000'],
        ['Schneider', 'Modicon M221 · M241 · M340', 'EcoStruxure Machine Expert'],
        ['Delta · Inovance · Xinje', 'DVP · AS · H3U · XD', 'ISPSoft · AutoShop · XDPPro']
      ],
      faultsTitle: 'Ko‘p uchraydigan PLC nosozliklari',
      faultsLead: 'Har bir rasm modul old panelida nimani ko‘rishingizni ko‘rsatadi. Sizdagi holat o‘xshasa, rasmini yuboring.',
      symptom: 'Belgisi',
      causes: 'Ko‘p uchraydigan sabablar',
      fix: 'Biz nima qilamiz',
      faults: [
        { pic: 'cpu', title: 'CPU STOP holatiga tushib qoladi', symptom: 'RUN o‘chgan, STOP sariq, SF yoki ERROR qizil yonadi. Liniya to‘xtaydi.', causes: ['Dastur xatosi: tsikl vaqti oshdi, OB blok yo‘q', 'Konfiguratsiyadagi modul joyida emas yoki ishlamayapti', 'Xotira kartasi yoki proshivka mos emas'], fix: 'Diagnostika buferini o‘qiymiz, aniq xato yozuvini topamiz, dastur nusxasini olamiz va sababni bartaraf qilamiz.' },
        { pic: 'bus', title: 'Profinet yoki Profibus aloqasi uziladi', symptom: 'BF qizil yonadi yoki miltillaydi, masofaviy I/O stansiya va drayverlar javob bermaydi.', causes: ['Kabel, ulagich yoki terminator rezistor', 'Qurilma nomi yoki IP manzil to‘qnashuvi', 'Kuchli kabellardan elektromagnit shovqin'], fix: 'Tarmoq topologiyasini tekshiramiz, kabelni o‘lchaymiz, nomlar va manzillarni tartibga keltiramiz, ekranlash va yerga ulashni to‘g‘rilaymiz.' },
        { pic: 'io', title: 'Kirish yoki chiqish kanali ishlamaydi', symptom: 'Datchik ishlayapti, lekin kirish LED yonmaydi; yoki chiqish yongan, ammo klapan va rele ishlamaydi.', causes: ['Chiqish tranzistori yoki relesi kuygan', 'Datchikdagi qisqa tutashuv, saqlagich uzilgan', 'Modulning o‘zi ishdan chiqqan'], fix: 'Kanal kuchlanishi va yuklamani o‘lchaymiz, modulni plata darajasida ta’mirlaymiz yoki asl modulga almashtiramiz, sababini (qisqa tutashuv, yuklama) ham yo‘qotamiz.' },
        { pic: 'analog', title: 'Analog signal noto‘g‘ri yoki sakraydi', symptom: 'Bosim, harorat yoki sath ko‘rsatkichi haqiqatga mos emas, o‘lchov “suzadi”.', causes: ['Ekran va yerga ulash xatosi, shovqin', 'Datchik yoki o‘zgartirgich driftga ketgan', 'Masshtablash (scaling) yoki modul sozlamasi noto‘g‘ri'], fix: '4–20 mA zanjirini kalibrator bilan tekshiramiz, datchikni sinaymiz, masshtablash va filtrlarni to‘g‘rilaymiz.' },
        { pic: 'mem', title: 'Dastur yo‘qoldi yoki xotira xatosi', symptom: 'Elektr o‘chib yongandan keyin PLC bo‘sh, BATT yonadi yoki xotira kartasi o‘qilmaydi.', causes: ['Eski PLC larda batareya o‘tirgan', 'Xotira kartasi shikastlangan', 'Yuklash vaqtida elektr uzilgan'], fix: 'Mavjud nusxadan, kartadan yoki uskuna ishlab chiqaruvchisi arxividan tiklaymiz. Keyin nusxalarni tartibli saqlashni yo‘lga qo‘yamiz.' },
        { pic: 'hmi', title: 'HMI panel PLC bilan bog‘lanmaydi', symptom: 'Panelda “No connection”, qiymatlar o‘rnida yulduzchalar, sensorli ekran javob bermaydi.', causes: ['IP manzil, protokol yoki drayver sozlamasi', 'Panel va PLC proshivkasi mos emas', 'Ekran yoki yorug‘lik bloki ishdan chiqqan'], fix: 'Aloqani qayta sozlaymiz, panel loyihasini tiklaymiz, sensor, ekran va quvvat blokini ta’mirlaymiz.' },
        { pic: 'psu', title: '24 V manba: tasodifiy qayta yuklanish', symptom: 'PLC o‘z-o‘zidan qayta yuklanadi, kirishlar sababsiz “sakraydi”, xato vaqti-vaqti bilan chiqadi.', causes: ['Quvvat bloki kuchsizlangan, kondensatorlar qurigan', 'Kuchlanish pasayishi va yerga ulash muammosi', 'Induktiv yuklamada himoya (diod, RC) yo‘q'], fix: 'Kuchlanish to‘lqinini ostsillograf bilan yozib olamiz, manbani almashtiramiz, shovqin bostirish elementlarini qo‘yamiz.' },
        { pic: 'logic', title: 'Dastur mantig‘ida xato', symptom: 'Hammasi yonib turibdi, lekin liniya noto‘g‘ri ketma-ketlikda ishlaydi yoki blokirovka chiqadi.', causes: ['Hujjatsiz o‘zgartirishlar', 'Taymer va blokirovka shartlari noto‘g‘ri', 'Yangi datchik yoki mexanizm dasturga kiritilmagan'], fix: 'Dasturni onlayn kuzatamiz, mantiqni tuzatamiz, izoh yozamiz va o‘zgarishni simulyatsiyada sinab, keyin liniyaga yuklaymiz.' }
      ],
      processTitle: 'PLC ta’miri qanday o‘tadi',
      process: [
        { title: 'Avval nusxa', text: 'Hech narsaga tegmasdan oldin dastur va sozlamalar nusxasini olamiz. Bu sizning sug‘urtangiz.' },
        { title: 'Diagnostika', text: 'LED holati, diagnostika buferi, o‘lchovlar. Sababni taxmin emas, dalil bilan topamiz.' },
        { title: 'Ta’mir', text: 'Modulni plata darajasida tiklaymiz yoki asl modulga almashtiramiz. Dasturdagi xatoni tuzatamiz.' },
        { title: 'Sinov', text: 'Stendda kirish va chiqishlarni imitatsiya qilamiz, keyin liniyada yuklama ostida tekshiramiz.' },
        { title: 'Hisobot va kafolat', text: 'Nima topildi, nima qilindi, qaysi qism qo‘yildi. Ishga {wm} oy kafolat.' }
      ],
      ledTitle: 'PLC chiroqlari nimani anglatadi?',
      ledLead: 'Kontroller old panelidagi chiroqlarni xuddi o‘zidek belgilang. Ehtimoliy sabab va xavfsiz tekshiruv tartibi chiqadi.',
      led: { power: 'POWER / DC 24V', run: 'RUN', err: 'SF / ERROR', bus: 'BF / BUS / NET', maint: 'MAINT / BATT', off: 'O‘chiq', on: 'Yonadi', blink: 'Miltillaydi', result: 'Ehtimoliy holat', send: 'Rasm bilan yuborish', note: 'Bu umumiy yo‘riqnoma. Ishlab chiqaruvchi qo‘llanmasi va korxonangiz xavfsizlik qoidalari ustun turadi.' },
      results: {
        psu: { t: 'PLC ga quvvat kelmayapti', x: 'POWER o‘chiq bo‘lsa, muammo odatda PLC ning o‘zida emas, 24 V manbada.', s: ['Quvvat bloki chiqishidagi kuchlanishni o‘lchang', 'Saqlagich va avtomatni tekshiring', 'Chiqishdagi qisqa tutashuvni istisno qiling'] },
        bus: { t: 'Tarmoq (bus) xatosi', x: 'CPU kamida bitta tarmoq qurilmasini ko‘rmayapti: masofaviy I/O, drayver yoki panel.', s: ['Qaysi qurilma javob bermayotganini diagnostikadan aniqlang', 'Ulagich va kabelni tekshiring, Profibus bo‘lsa terminatorni', 'Yaqinda almashtirilgan qurilma nomi va IP manzilini solishtiring'] },
        stop: { t: 'CPU xato sababli STOP da', x: 'Kontroller o‘zini himoya qilib to‘xtagan. Sababi diagnostika buferida yozilgan.', s: ['Diagnostika buferidagi oxirgi yozuvni yozib oling yoki rasmga oling', 'Rejimni qayta-qayta RUN ga o‘tkazmang', 'Dastur nusxasi borligini tekshiring'] },
        flash: { t: 'Dastur yoki xotira kartasi xatosi', x: 'ERROR miltillashi ko‘p PLC larda dastur, proshivka yoki xotira kartasi muammosini bildiradi.', s: ['Xotira kartasi joyida va to‘g‘ri o‘rnatilganini tekshiring', 'Yaqinda dastur yoki proshivka yuklanganmi, aniqlang', 'Kartani formatlamang: unda yagona nusxa bo‘lishi mumkin'] },
        module: { t: 'Modul yoki kanal diagnostikasi', x: 'CPU ishlayapti, lekin qaysidir modul xato bildiryapti: sim uzilgan, qisqa tutashuv yoki modulda manba yo‘q.', s: ['Qaysi modulda qizil LED yonayotganini toping', 'Shu modul kanallaridagi datchik va simlarni tekshiring', 'Modul 24 V ta’minotini o‘lchang'] },
        start: { t: 'Ishga tushish yoki yuklash jarayoni', x: 'RUN miltillashi odatda CPU ishga tushayotganini yoki dastur yuklanayotganini bildiradi. Uzoq davom etsa, muammo bor.', s: ['Bir-ikki daqiqa kuting', 'Davom etsa, diagnostika buferini o‘qing', 'Xotirani tozalashni (memory reset) mutaxassissiz qilmang'] },
        batt: { t: 'Batareya yoki texnik xizmat so‘rovi', x: 'MAINT yoki BATT batareya o‘tirganini yoki texnik xizmat kerakligini bildiradi. Elektr o‘chsa, dastur yo‘qolishi mumkin.', s: ['Hozir dastur nusxasini oling', 'Batareyani PLC yoqilgan holatda almashtiring (qo‘llanmaga qarang)', 'Batareya turini va muddatini yozib qo‘ying'] },
        manual: { t: 'CPU STOP rejimida, xato yo‘q', x: 'Kontroller kalit yoki buyruq bilan to‘xtatilgan, yoki dastur yuklanmagan.', s: ['Rejim kaliti yoki tugmasini tekshiring', 'Kimdir texnik ish olib borayotganini aniqlang', 'Dastur yuklanganini tekshiring'] },
        ok: { t: 'PLC ishlayapti, muammo tashqarida', x: 'Chiroqlar normal. Sabab ko‘pincha datchik, sim, ijro mexanizmi yoki dastur mantig‘ida bo‘ladi.', s: ['Muammoli datchik kirish LED ini kuzating', 'Chiqish yonganda ijro mexanizmiga kuchlanish borayotganini o‘lchang', 'Muammo qachon boshlanganini va oldin nima o‘zgarganini yozing'] }
      },
      casesTitle: 'PLC bo‘yicha bajarilgan ishlar',
      faq: [
        { q: 'Dastur nusxasi yo‘q bo‘lsa nima qilasiz?', a: 'Avval PLC dan o‘qib olishga harakat qilamiz. Himoyalangan yoki yo‘qolgan bo‘lsa, uskuna ishlab chiqaruvchisi bilan bog‘lanamiz yoki dasturni mavjud mantiq bo‘yicha qayta yozamiz.' },
        { q: 'Modulni ta’mirlaysizmi yoki almashtirasizmi?', a: 'Ikkalasi ham. Plata darajasida ta’mir arzonroq va tezroq bo‘lishi mumkin; modul topilmasa yoki ta’mir maqsadga muvofiq bo‘lmasa, asl modulni topib beramiz.' },
        { q: 'Masofadan yordam bera olasizmi?', a: 'Ha. Rasm, diagnostika buferi va dastur nusxasi bo‘yicha ko‘p muammoni masofadan aniqlaymiz. Kerak bo‘lsa joyiga chiqamiz.' }
      ]
    },
    warranty: {
      eyebrow: 'Kafolat',
      title: 'Xizmatimizga kafolat beramiz',
      lead: 'Ish tugagach ham javobgarmiz. Asl ehtiyot qismlar, tekshirilgan sifat va yozma kafolat.',
      homeLead: 'Ish tugagach ham javobgarmiz: asl qismlar, sinovdan o‘tgan ish va yozma kafolat. Kafolat muddatini ariza raqami bilan shu yerda tekshiring.',
      more: 'Kafolat shartlari',
      pillars: [
        { k: 'auth', title: 'Haqiqiylik', text: 'Faqat asl yoki kelishilgan ehtiyot qism. Yorlig‘i va seriya raqami rasmi hisobotga qo‘shiladi.' },
        { k: 'qual', title: 'Sifat', text: 'Har bir ish nazorat varaqasi bo‘yicha: oldin va keyin o‘lchov, yuklama ostida sinov, xavfsizlik.' },
        { k: 'warr', title: 'Kafolat', text: 'Bajarilgan ishga {wm} oy, ehtiyot qismga {pm} oygacha. Sabab qaytsa, bepul tuzatamiz.' }
      ],
      stamp: 'KAFOLAT',
      stampSub: '{wm} OY',
      termsTitle: 'Kafolat shartlari',
      terms: ['Bajarilgan ishga {wm} oy kafolat: ish tugagan kundan boshlanadi', 'O‘rnatilgan ehtiyot qismga {pm} oygacha, ishlab chiqaruvchi shartlariga ko‘ra', 'Shu sabab bilan nosozlik qaytsa, ish va qatnovni bepul qilamiz', 'Kafolat murojaatiga {hours} soat ichida javob beramiz', 'Kafolat ariza raqamiga bog‘langan: hujjatni yo‘qotsangiz ham saqlanadi'],
      notTitle: 'Kafolat qamrab olmaydi',
      not: ['Mexanik shikast, suv yoki yong‘in ta’siri', 'Uchinchi shaxslar aralashuvi va ruxsatsiz o‘zgartirish', 'Himoyasiz tarmoqdagi kuchlanish sakrashi', 'Sarflanadigan materiallar va tabiiy eskirish', 'Biz ta’mirlamagan boshqa bloklarning nosozligi'],
      authTitle: 'Haqiqiylik: qism qayerdan keldi?',
      auth: ['Ehtiyot qism yorlig‘i, seriya raqami va qadoq rasmi hisobotda', 'Yetkazib beruvchi hujjatlari so‘rov bo‘yicha ko‘rsatiladi', 'Almashtirilgan eski detal sizga qaytariladi', 'Muqobil (analog) qism faqat roziligingiz bilan va hisobotda ochiq yoziladi', 'Shubhali, qayta tiklangan qismni asl deb o‘rnatmaymiz'],
      qualTitle: 'Sifat nazorati: har bir ishda',
      qual: ['Ishdan oldin dastur va parametrlar nusxasi', 'Xavfsizlik: LOTO, energiyasizlantirish va belgilash', 'Oldin va keyin o‘lchovlar jurnali', 'Yuklama ostida sinov ishga tushirish', 'Ish joyi rasmlari: oldin va keyin', 'Yozma hisobot: sabab, ish, qismlar, tavsiyalar'],
      claimTitle: 'Kafolat bo‘yicha murojaat',
      claim: [
        { title: 'Raqamni yozing', text: 'Ariza raqamini quyida tekshiring yoki botga /kafolat TX-XXXX-XXXX deb yozing.' },
        { title: 'Muammoni tasvirlang', text: 'Nima qaytdi, qachon boshlandi. Rasm bo‘lsa, yanada yaxshi.' },
        { title: 'Bepul tekshiruv', text: 'Muhandis {hours} soat ichida bog‘lanadi va kafolat holatini tekshiradi.' }
      ],
      checkTitle: 'Kafolatni tekshirish',
      checkLead: 'Ariza raqamini kiriting: kafolat amaldami va qachongacha.',
      code: 'Ariza raqami', check: 'Tekshirish',
      active: 'Kafolat amalda', expired: 'Kafolat muddati tugagan', notDone: 'Ish hali yakunlanmagan: kafolat ish tugagan kundan boshlanadi', notFound: 'Bunday raqamli ariza topilmadi',
      until: 'Amal qiladi', since: 'Ish yakunlangan', left: '{n} kun qoldi', claimBtn: 'Kafolat bo‘yicha murojaat',
      trackLine: 'Kafolat {date} gacha'
    },
    downtime: {
      eyebrow: 'Kalkulyator',
      title: 'Liniya to‘xtashi qancha turadi?',
      lead: 'O‘z raqamlaringizni kiriting. Hisob faqat brauzeringizda bajariladi, hech qayerga yuborilmaydi.',
      perHour: 'Bir soat to‘xtash zarari (so‘m)', perHourHint: 'Ishlab chiqarilmagan mahsulot foydasi va ish haqi',
      hours: 'Bir to‘xtash necha soat', times: 'Oyiga necha marta',
      perEvent: 'Bitta to‘xtash', perMonth: 'Oyiga', perYear: 'Yiliga',
      half: 'To‘xtash vaqti yarmiga qisqarsa, yiliga tejaladi',
      cta: 'To‘xtashlarni kamaytirish',
      cur: 'so‘m'
    },
    tg5: {
      wAsk: 'Ariza raqamini yozing, masalan: /kafolat TX-AB12-CD34',
      wActive: '<b>{code}</b>: kafolat amalda, {date} gacha ({n} kun qoldi).',
      wExpired: '<b>{code}</b>: kafolat {date} da tugagan. Yangi ariza qoldirsangiz, tez yordam beramiz.',
      wNotDone: '<b>{code}</b>: ish hali yakunlanmagan. Kafolat ish tugagan kundan boshlanadi.',
      wNone: 'Bunday raqamli ariza topilmadi.',
      wLine: 'Kafolat: {date} gacha'
    }
  },

  ru: {
    nav5: { plc: 'Ремонт ПЛК', warranty: 'Гарантия' },
    meta5: {
      plcTitle: 'Ремонт ПЛК: Siemens S7, Mitsubishi, Omron | {brand}',
      plcDesc: 'Ремонт контроллеров ПЛК: CPU в STOP, ошибки SF/BF, связь Profinet и Profibus, модули ввода-вывода, аналоговые сигналы, потерянная программа и HMI. {city} и вся Узбекистан, с гарантией.',
      warrantyTitle: 'Гарантия, качество и оригинальные запчасти | {brand}',
      warrantyDesc: 'Гарантия {wm} мес. на выполненную работу, оригинальные запчасти и письменный отчёт. Проверьте срок гарантии онлайн по номеру заявки.'
    },
    plc: {
      eyebrow: 'ПЛК и автоматика',
      title: 'Находим и устраняем неисправности ПЛК',
      lead: 'Линия встала, CPU в STOP, горит красный SF или BF. Сначала сохраняем копию программы, затем ищем причину: модуль, связь, питание или логика программы.',
      homeLead: 'Siemens S7, Mitsubishi, Omron, Allen-Bradley и китайские ПЛК. Копия программы, диагностика, ремонт модулей и испытания в одном месте.',
      more: 'Страница ремонта ПЛК',
      svc: 'Ремонт и программирование ПЛК',
      cta: 'Отправить проблему с ПЛК',
      points: ['CPU STOP и ошибка SF', 'Обрыв Profinet / Profibus', 'Ремонт модулей I/O', 'Аналог 4–20 мА', 'Потерянная программа', 'Связь с HMI'],
      platformsTitle: 'С какими ПЛК работаем',
      platforms: [
        ['Siemens', 'S7-200 · S7-300 · S7-400 · S7-1200 · S7-1500 · LOGO!', 'TIA Portal · STEP 7'],
        ['Mitsubishi', 'FX3U · FX5U · Q · iQ-R', 'GX Works2 · GX Works3'],
        ['Omron', 'CP1 · CJ2 · NX/NJ', 'CX-Programmer · Sysmac Studio'],
        ['Allen-Bradley', 'MicroLogix · CompactLogix · ControlLogix', 'RSLogix · Studio 5000'],
        ['Schneider', 'Modicon M221 · M241 · M340', 'EcoStruxure Machine Expert'],
        ['Delta · Inovance · Xinje', 'DVP · AS · H3U · XD', 'ISPSoft · AutoShop · XDPPro']
      ],
      faultsTitle: 'Частые неисправности ПЛК',
      faultsLead: 'Каждая схема показывает, что вы видите на передней панели модуля. Если похоже на ваш случай, пришлите фото.',
      symptom: 'Признак',
      causes: 'Частые причины',
      fix: 'Что делаем мы',
      faults: [
        { pic: 'cpu', title: 'CPU уходит в STOP', symptom: 'RUN погас, STOP жёлтый, горит красный SF или ERROR. Линия стоит.', causes: ['Ошибка программы: превышено время цикла, нет OB', 'Модуль из конфигурации отсутствует или неисправен', 'Карта памяти или прошивка не совпадают'], fix: 'Читаем диагностический буфер, находим точную запись ошибки, сохраняем копию программы и устраняем причину.' },
        { pic: 'bus', title: 'Пропадает связь Profinet или Profibus', symptom: 'BF горит или мигает красным, удалённые станции I/O и приводы не отвечают.', causes: ['Кабель, разъём или терминатор', 'Конфликт имён устройств или IP-адресов', 'Электромагнитные помехи от силовых кабелей'], fix: 'Проверяем топологию, измеряем кабель, приводим в порядок имена и адреса, исправляем экранирование и заземление.' },
        { pic: 'io', title: 'Не работает вход или выход', symptom: 'Датчик срабатывает, а LED входа не горит; или выход горит, но клапан и реле не работают.', causes: ['Сгорел выходной транзистор или реле', 'КЗ в датчике, сгорел предохранитель', 'Неисправен сам модуль'], fix: 'Измеряем напряжение канала и нагрузку, ремонтируем модуль на уровне платы или меняем на оригинальный и устраняем причину (КЗ, перегрузка).' },
        { pic: 'analog', title: 'Аналоговый сигнал неверный или скачет', symptom: 'Давление, температура или уровень не совпадают с реальностью, значение «плавает».', causes: ['Ошибка экранирования и заземления, помехи', 'Дрейф датчика или преобразователя', 'Неверное масштабирование или настройка модуля'], fix: 'Проверяем петлю 4–20 мА калибратором, испытываем датчик, исправляем масштабирование и фильтры.' },
        { pic: 'mem', title: 'Пропала программа или ошибка памяти', symptom: 'После отключения питания ПЛК пустой, горит BATT или карта памяти не читается.', causes: ['Села батарея в старых ПЛК', 'Повреждена карта памяти', 'Пропало питание во время загрузки'], fix: 'Восстанавливаем из имеющейся копии, с карты или из архива производителя оборудования. Затем налаживаем упорядоченное хранение копий.' },
        { pic: 'hmi', title: 'HMI не связывается с ПЛК', symptom: 'На панели «No connection», вместо значений звёздочки, сенсор не реагирует.', causes: ['IP-адрес, протокол или драйвер', 'Несовместимые прошивки панели и ПЛК', 'Неисправен экран или подсветка'], fix: 'Перенастраиваем связь, восстанавливаем проект панели, ремонтируем сенсор, экран и блок питания.' },
        { pic: 'psu', title: 'Питание 24 В: случайные перезагрузки', symptom: 'ПЛК сам перезагружается, входы «прыгают» без причины, ошибка появляется периодически.', causes: ['Ослаб блок питания, высохли конденсаторы', 'Просадки напряжения и проблемы заземления', 'Нет защиты (диод, RC) на индуктивной нагрузке'], fix: 'Записываем форму напряжения осциллографом, меняем блок питания, ставим элементы подавления помех.' },
        { pic: 'logic', title: 'Ошибка в логике программы', symptom: 'Всё горит, но линия работает в неверной последовательности или срабатывает блокировка.', causes: ['Изменения без документации', 'Неверные условия таймеров и блокировок', 'Новый датчик или механизм не внесён в программу'], fix: 'Наблюдаем программу онлайн, исправляем логику, пишем комментарии, проверяем изменение в симуляции и только затем загружаем.' }
      ],
      processTitle: 'Как проходит ремонт ПЛК',
      process: [
        { title: 'Сначала копия', text: 'До любых действий сохраняем программу и настройки. Это ваша страховка.' },
        { title: 'Диагностика', text: 'Состояние LED, диагностический буфер, измерения. Причину находим по фактам, а не наугад.' },
        { title: 'Ремонт', text: 'Восстанавливаем модуль на уровне платы или меняем на оригинальный. Исправляем ошибку в программе.' },
        { title: 'Испытания', text: 'На стенде имитируем входы и выходы, затем проверяем на линии под нагрузкой.' },
        { title: 'Отчёт и гарантия', text: 'Что нашли, что сделали, какую деталь поставили. Гарантия {wm} мес. на работу.' }
      ],
      ledTitle: 'Что означают индикаторы ПЛК?',
      ledLead: 'Отметьте индикаторы так, как они горят на передней панели. Появится вероятная причина и безопасный порядок проверки.',
      led: { power: 'POWER / DC 24V', run: 'RUN', err: 'SF / ERROR', bus: 'BF / BUS / NET', maint: 'MAINT / BATT', off: 'Не горит', on: 'Горит', blink: 'Мигает', result: 'Вероятное состояние', send: 'Отправить с фото', note: 'Это общая инструкция. Руководство производителя и правила безопасности вашего предприятия имеют приоритет.' },
      results: {
        psu: { t: 'На ПЛК нет питания', x: 'Если POWER не горит, проблема обычно не в самом ПЛК, а в источнике 24 В.', s: ['Измерьте напряжение на выходе блока питания', 'Проверьте предохранитель и автомат', 'Исключите КЗ на выходе'] },
        bus: { t: 'Ошибка сети (шины)', x: 'CPU не видит как минимум одно сетевое устройство: удалённый I/O, привод или панель.', s: ['По диагностике определите, какое устройство не отвечает', 'Проверьте разъём и кабель, для Profibus терминатор', 'Сверьте имя и IP недавно заменённого устройства'] },
        stop: { t: 'CPU в STOP из-за ошибки', x: 'Контроллер остановился, защищая себя. Причина записана в диагностическом буфере.', s: ['Запишите или сфотографируйте последнюю запись буфера', 'Не переводите в RUN снова и снова', 'Проверьте, есть ли копия программы'] },
        flash: { t: 'Ошибка программы или карты памяти', x: 'Мигающий ERROR у многих ПЛК означает проблему программы, прошивки или карты памяти.', s: ['Проверьте, что карта памяти на месте и вставлена правильно', 'Выясните, не загружали ли недавно программу или прошивку', 'Не форматируйте карту: на ней может быть единственная копия'] },
        module: { t: 'Диагностика модуля или канала', x: 'CPU работает, но какой-то модуль сообщает об ошибке: обрыв провода, КЗ или нет питания модуля.', s: ['Найдите модуль с красным LED', 'Проверьте датчики и провода в его каналах', 'Измерьте питание 24 В модуля'] },
        start: { t: 'Запуск или загрузка', x: 'Мигающий RUN обычно означает запуск CPU или загрузку программы. Если долго, есть проблема.', s: ['Подождите минуту-две', 'Если продолжается, прочитайте диагностический буфер', 'Не делайте сброс памяти (memory reset) без специалиста'] },
        batt: { t: 'Батарея или запрос обслуживания', x: 'MAINT или BATT говорят о севшей батарее или необходимости обслуживания. При отключении питания программа может пропасть.', s: ['Сейчас же сделайте копию программы', 'Меняйте батарею при включённом ПЛК (см. руководство)', 'Запишите тип и дату батареи'] },
        manual: { t: 'CPU в STOP, ошибок нет', x: 'Контроллер остановлен ключом или командой, либо программа не загружена.', s: ['Проверьте ключ или кнопку режима', 'Узнайте, не ведутся ли работы', 'Проверьте, что программа загружена'] },
        ok: { t: 'ПЛК работает, проблема снаружи', x: 'Индикаторы в норме. Причина чаще в датчике, проводе, исполнительном механизме или логике программы.', s: ['Следите за LED входа проблемного датчика', 'Когда выход горит, измерьте напряжение на исполнительном механизме', 'Запишите, когда началось и что менялось до этого'] }
      },
      casesTitle: 'Выполненные работы по ПЛК',
      faq: [
        { q: 'Что если копии программы нет?', a: 'Сначала пробуем считать из ПЛК. Если она защищена или потеряна, связываемся с производителем оборудования или пишем программу заново по существующей логике.' },
        { q: 'Ремонтируете модуль или меняете?', a: 'И то, и другое. Ремонт на уровне платы бывает дешевле и быстрее; если модуль не найти или ремонт нецелесообразен, найдём оригинальный модуль.' },
        { q: 'Можете помочь удалённо?', a: 'Да. По фото, диагностическому буферу и копии программы многие проблемы определяем удалённо. При необходимости выезжаем.' }
      ]
    },
    warranty: {
      eyebrow: 'Гарантия',
      title: 'Мы гарантируем наш сервис',
      lead: 'Отвечаем и после окончания работ. Оригинальные запчасти, проверенное качество и письменная гарантия.',
      homeLead: 'Отвечаем и после окончания работ: оригинальные детали, испытанная работа и письменная гарантия. Проверьте срок гарантии по номеру заявки прямо здесь.',
      more: 'Условия гарантии',
      pillars: [
        { k: 'auth', title: 'Подлинность', text: 'Только оригинальные или согласованные запчасти. Фото этикетки и серийного номера добавляется в отчёт.' },
        { k: 'qual', title: 'Качество', text: 'Каждая работа по чек-листу: измерения до и после, испытание под нагрузкой, безопасность.' },
        { k: 'warr', title: 'Гарантия', text: '{wm} мес. на работу, до {pm} мес. на запчасти. Если причина вернётся, исправим бесплатно.' }
      ],
      stamp: 'ГАРАНТИЯ',
      stampSub: '{wm} МЕС',
      termsTitle: 'Условия гарантии',
      terms: ['Гарантия {wm} мес. на выполненную работу: с даты завершения', 'На установленные запчасти до {pm} мес. по условиям производителя', 'Если неисправность вернулась по той же причине, работа и выезд бесплатно', 'На гарантийное обращение отвечаем в течение {hours} ч', 'Гарантия привязана к номеру заявки: сохраняется, даже если документ потерян'],
      notTitle: 'Гарантия не распространяется',
      not: ['Механические повреждения, вода или огонь', 'Вмешательство третьих лиц и несанкционированные изменения', 'Скачки напряжения в незащищённой сети', 'Расходные материалы и естественный износ', 'Неисправности других блоков, которые мы не ремонтировали'],
      authTitle: 'Подлинность: откуда деталь?',
      auth: ['Фото этикетки, серийного номера и упаковки запчасти в отчёте', 'Документы поставщика показываем по запросу', 'Заменённая старая деталь возвращается вам', 'Аналог ставим только с вашего согласия и открыто указываем в отчёте', 'Сомнительные восстановленные детали не выдаём за оригинал'],
      qualTitle: 'Контроль качества в каждой работе',
      qual: ['Копия программы и параметров до начала работ', 'Безопасность: LOTO, обесточивание и маркировка', 'Журнал измерений до и после', 'Пробный запуск под нагрузкой', 'Фото места работ до и после', 'Письменный отчёт: причина, работы, детали, рекомендации'],
      claimTitle: 'Гарантийное обращение',
      claim: [
        { title: 'Укажите номер', text: 'Проверьте номер заявки ниже или напишите боту /kafolat TX-XXXX-XXXX.' },
        { title: 'Опишите проблему', text: 'Что вернулось и когда началось. Фото ещё лучше.' },
        { title: 'Бесплатная проверка', text: 'Инженер свяжется в течение {hours} ч и проверит гарантию.' }
      ],
      checkTitle: 'Проверить гарантию',
      checkLead: 'Введите номер заявки: действует ли гарантия и до какого числа.',
      code: 'Номер заявки', check: 'Проверить',
      active: 'Гарантия действует', expired: 'Срок гарантии истёк', notDone: 'Работа ещё не завершена: гарантия начинается с даты завершения', notFound: 'Заявка с таким номером не найдена',
      until: 'Действует до', since: 'Работа завершена', left: 'осталось {n} дн.', claimBtn: 'Гарантийное обращение',
      trackLine: 'Гарантия до {date}'
    },
    downtime: {
      eyebrow: 'Калькулятор',
      title: 'Сколько стоит простой линии?',
      lead: 'Введите свои цифры. Расчёт выполняется только в вашем браузере и никуда не отправляется.',
      perHour: 'Убыток за час простоя (сум)', perHourHint: 'Прибыль с невыпущенной продукции и зарплата',
      hours: 'Часов на один простой', times: 'Простоев в месяц',
      perEvent: 'Один простой', perMonth: 'В месяц', perYear: 'В год',
      half: 'Если сократить простой вдвое, экономия в год',
      cta: 'Сократить простои',
      cur: 'сум'
    },
    tg5: {
      wAsk: 'Напишите номер заявки, например: /kafolat TX-AB12-CD34',
      wActive: '<b>{code}</b>: гарантия действует до {date} (осталось {n} дн.).',
      wExpired: '<b>{code}</b>: гарантия закончилась {date}. Оставьте новую заявку, поможем быстро.',
      wNotDone: '<b>{code}</b>: работа ещё не завершена. Гарантия начинается с даты завершения.',
      wNone: 'Заявка с таким номером не найдена.',
      wLine: 'Гарантия: до {date}'
    }
  },

  en: {
    nav5: { plc: 'PLC repair', warranty: 'Warranty' },
    meta5: {
      plcTitle: 'PLC repair: Siemens S7, Mitsubishi, Omron | {brand}',
      plcDesc: 'PLC controller repair: CPU in STOP, SF/BF faults, Profinet and Profibus communication, I/O modules, analog signals, lost programs and HMI. {city} and all of Uzbekistan, with a warranty.',
      warrantyTitle: 'Warranty, quality and genuine parts | {brand}',
      warrantyDesc: '{wm}-month warranty on completed work, genuine parts and a written report. Check your warranty online with the request number.'
    },
    plc: {
      eyebrow: 'PLC and automation',
      title: 'We find and fix PLC faults',
      lead: 'The line has stopped, the CPU is in STOP, a red SF or BF is lit. First we back up the program, then we find the cause: a module, the network, the power supply or the program logic.',
      homeLead: 'Siemens S7, Mitsubishi, Omron, Allen-Bradley and Chinese PLCs. Program backup, diagnostics, module repair and testing in one place.',
      more: 'PLC repair page',
      svc: 'PLC repair and programming',
      cta: 'Send a PLC problem',
      points: ['CPU STOP and SF fault', 'Profinet / Profibus dropouts', 'I/O module repair', 'Analog 4–20 mA', 'Lost program', 'HMI communication'],
      platformsTitle: 'PLCs we work with',
      platforms: [
        ['Siemens', 'S7-200 · S7-300 · S7-400 · S7-1200 · S7-1500 · LOGO!', 'TIA Portal · STEP 7'],
        ['Mitsubishi', 'FX3U · FX5U · Q · iQ-R', 'GX Works2 · GX Works3'],
        ['Omron', 'CP1 · CJ2 · NX/NJ', 'CX-Programmer · Sysmac Studio'],
        ['Allen-Bradley', 'MicroLogix · CompactLogix · ControlLogix', 'RSLogix · Studio 5000'],
        ['Schneider', 'Modicon M221 · M241 · M340', 'EcoStruxure Machine Expert'],
        ['Delta · Inovance · Xinje', 'DVP · AS · H3U · XD', 'ISPSoft · AutoShop · XDPPro']
      ],
      faultsTitle: 'Common PLC faults',
      faultsLead: 'Each drawing shows what you see on the front of the module. If it looks like your case, send us a photo.',
      symptom: 'Symptom',
      causes: 'Common causes',
      fix: 'What we do',
      faults: [
        { pic: 'cpu', title: 'CPU drops into STOP', symptom: 'RUN is off, STOP is yellow, SF or ERROR is red. The line is down.', causes: ['Program error: cycle time exceeded, missing OB', 'A configured module is missing or faulty', 'Memory card or firmware mismatch'], fix: 'We read the diagnostic buffer, find the exact error entry, back up the program and remove the cause.' },
        { pic: 'bus', title: 'Profinet or Profibus link drops', symptom: 'BF is red or flashing, remote I/O stations and drives do not respond.', causes: ['Cable, connector or terminating resistor', 'Device name or IP address conflict', 'Electromagnetic noise from power cables'], fix: 'We check the topology, test the cable, clean up names and addresses, and fix shielding and grounding.' },
        { pic: 'io', title: 'An input or output channel is dead', symptom: 'The sensor switches but the input LED stays off; or the output LED is on but the valve or relay does nothing.', causes: ['Burnt output transistor or relay', 'Short circuit in a sensor, blown fuse', 'The module itself has failed'], fix: 'We measure channel voltage and load, repair the module at board level or replace it with a genuine one, and remove the cause (short, overload).' },
        { pic: 'analog', title: 'Analog signal is wrong or jumps', symptom: 'Pressure, temperature or level does not match reality, the value drifts.', causes: ['Shielding and grounding errors, noise', 'Sensor or transmitter drift', 'Wrong scaling or module setup'], fix: 'We check the 4–20 mA loop with a calibrator, test the sensor and correct scaling and filters.' },
        { pic: 'mem', title: 'Program lost or memory error', symptom: 'After a power cycle the PLC is empty, BATT is lit or the memory card cannot be read.', causes: ['Flat battery in older PLCs', 'Damaged memory card', 'Power lost during a download'], fix: 'We restore from an existing backup, the card or the machine builder’s archive, then set up orderly backup storage.' },
        { pic: 'hmi', title: 'HMI cannot connect to the PLC', symptom: '“No connection” on the panel, asterisks instead of values, the touchscreen does not respond.', causes: ['IP address, protocol or driver settings', 'Panel and PLC firmware mismatch', 'Failed screen or backlight'], fix: 'We reconfigure communication, restore the panel project and repair the touch sensor, screen and power board.' },
        { pic: 'psu', title: '24 V supply: random restarts', symptom: 'The PLC restarts by itself, inputs flicker for no reason, the fault comes and goes.', causes: ['Weak power supply, dried-out capacitors', 'Voltage dips and grounding problems', 'No suppression (diode, RC) on inductive loads'], fix: 'We record the voltage waveform with an oscilloscope, replace the supply and add noise suppression.' },
        { pic: 'logic', title: 'Error in the program logic', symptom: 'Everything is lit, but the line runs in the wrong sequence or an interlock trips.', causes: ['Undocumented changes', 'Wrong timer and interlock conditions', 'A new sensor or mechanism was never added to the program'], fix: 'We monitor the program online, fix the logic, add comments and test the change in simulation before downloading.' }
      ],
      processTitle: 'How a PLC repair goes',
      process: [
        { title: 'Backup first', text: 'Before touching anything we save the program and settings. That is your insurance.' },
        { title: 'Diagnostics', text: 'LED states, diagnostic buffer, measurements. We find the cause from evidence, not guesses.' },
        { title: 'Repair', text: 'We repair the module at board level or replace it with a genuine one, and fix errors in the program.' },
        { title: 'Testing', text: 'We simulate inputs and outputs on the bench, then check the line under load.' },
        { title: 'Report and warranty', text: 'What we found, what we did, which part we fitted. {wm}-month warranty on the work.' }
      ],
      ledTitle: 'What do the PLC lights mean?',
      ledLead: 'Set the lights exactly as they look on the front of the controller. You get the likely cause and a safe order of checks.',
      led: { power: 'POWER / DC 24V', run: 'RUN', err: 'SF / ERROR', bus: 'BF / BUS / NET', maint: 'MAINT / BATT', off: 'Off', on: 'On', blink: 'Flashing', result: 'Likely state', send: 'Send with a photo', note: 'This is general guidance. The manufacturer’s manual and your site safety rules take priority.' },
      results: {
        psu: { t: 'No power to the PLC', x: 'If POWER is off, the problem is usually not the PLC itself but the 24 V supply.', s: ['Measure the voltage at the power supply output', 'Check the fuse and breaker', 'Rule out a short on the output'] },
        bus: { t: 'Network (bus) fault', x: 'The CPU cannot see at least one network device: remote I/O, a drive or a panel.', s: ['Use diagnostics to find which device is not responding', 'Check the connector and cable, and the terminator on Profibus', 'Compare the name and IP of any recently replaced device'] },
        stop: { t: 'CPU in STOP because of a fault', x: 'The controller stopped to protect itself. The reason is written in the diagnostic buffer.', s: ['Write down or photograph the latest buffer entry', 'Do not keep switching it back to RUN', 'Check that a program backup exists'] },
        flash: { t: 'Program or memory card fault', x: 'On many PLCs a flashing ERROR means a problem with the program, firmware or memory card.', s: ['Check the memory card is present and seated correctly', 'Find out whether a program or firmware was loaded recently', 'Do not format the card: it may hold the only copy'] },
        module: { t: 'Module or channel diagnostics', x: 'The CPU runs, but a module reports a fault: broken wire, short circuit or no module supply.', s: ['Find the module with the red LED', 'Check sensors and wiring on its channels', 'Measure the module’s 24 V supply'] },
        start: { t: 'Starting up or downloading', x: 'A flashing RUN usually means the CPU is starting or a program is being loaded. If it lasts long, something is wrong.', s: ['Wait a minute or two', 'If it continues, read the diagnostic buffer', 'Do not do a memory reset without a specialist'] },
        batt: { t: 'Battery or maintenance request', x: 'MAINT or BATT means a flat battery or that maintenance is due. If power is lost, the program may be lost too.', s: ['Back up the program now', 'Change the battery with the PLC powered (see the manual)', 'Note the battery type and date'] },
        manual: { t: 'CPU in STOP, no fault', x: 'The controller was stopped by the key or a command, or no program is loaded.', s: ['Check the mode switch or button', 'Find out whether someone is doing maintenance', 'Check that a program is loaded'] },
        ok: { t: 'The PLC is running, the problem is outside', x: 'The lights are normal. The cause is usually a sensor, wire, actuator or the program logic.', s: ['Watch the input LED of the suspect sensor', 'When the output is on, measure the voltage at the actuator', 'Note when it started and what changed before'] }
      },
      casesTitle: 'Completed PLC jobs',
      faq: [
        { q: 'What if there is no program backup?', a: 'First we try to upload it from the PLC. If it is protected or lost, we contact the machine builder or rewrite the program from the existing logic.' },
        { q: 'Do you repair modules or replace them?', a: 'Both. Board-level repair can be cheaper and faster; if a module is unavailable or repair does not make sense, we source a genuine one.' },
        { q: 'Can you help remotely?', a: 'Yes. With photos, the diagnostic buffer and a program backup we pin down many faults remotely. We come on site when needed.' }
      ]
    },
    warranty: {
      eyebrow: 'Warranty',
      title: 'We guarantee our service',
      lead: 'We stay responsible after the job is done. Genuine parts, checked quality and a written warranty.',
      homeLead: 'We stay responsible after the job: genuine parts, tested work and a written warranty. Check your warranty with the request number right here.',
      more: 'Warranty terms',
      pillars: [
        { k: 'auth', title: 'Authenticity', text: 'Only genuine or agreed parts. A photo of the label and serial number goes into the report.' },
        { k: 'qual', title: 'Quality', text: 'Every job follows a checklist: before and after measurements, a test under load, safety.' },
        { k: 'warr', title: 'Warranty', text: '{wm} months on the work, up to {pm} months on parts. If the cause comes back, we fix it free.' }
      ],
      stamp: 'WARRANTY',
      stampSub: '{wm} MONTHS',
      termsTitle: 'Warranty terms',
      terms: ['{wm}-month warranty on completed work, from the completion date', 'Up to {pm} months on fitted parts, per the manufacturer’s terms', 'If the fault returns from the same cause, labour and travel are free', 'We answer warranty claims within {hours} hours', 'The warranty is tied to the request number, so it stays valid even if you lose the paper'],
      notTitle: 'Not covered',
      not: ['Mechanical damage, water or fire', 'Third-party interference and unauthorised changes', 'Voltage surges on an unprotected supply', 'Consumables and normal wear', 'Faults in other units we did not repair'],
      authTitle: 'Authenticity: where did the part come from?',
      auth: ['Photo of the part label, serial number and packaging in the report', 'Supplier documents shown on request', 'The removed old part is returned to you', 'An equivalent part is fitted only with your consent and named in the report', 'We never pass off a doubtful refurbished part as genuine'],
      qualTitle: 'Quality control on every job',
      qual: ['Program and parameter backup before work starts', 'Safety: LOTO, isolation and tagging', 'Before and after measurement log', 'Test run under load', 'Photos of the work area before and after', 'Written report: cause, work, parts, recommendations'],
      claimTitle: 'Making a warranty claim',
      claim: [
        { title: 'Enter the number', text: 'Check your request number below or send the bot /kafolat TX-XXXX-XXXX.' },
        { title: 'Describe the problem', text: 'What came back and when it started. A photo helps even more.' },
        { title: 'Free check', text: 'An engineer contacts you within {hours} hours and checks the warranty.' }
      ],
      checkTitle: 'Check your warranty',
      checkLead: 'Enter the request number to see whether the warranty is valid and until when.',
      code: 'Request number', check: 'Check',
      active: 'Warranty is valid', expired: 'Warranty has expired', notDone: 'The job is not finished yet: the warranty starts on the completion date', notFound: 'No request with this number was found',
      until: 'Valid until', since: 'Job completed', left: '{n} days left', claimBtn: 'Make a warranty claim',
      trackLine: 'Warranty until {date}'
    },
    downtime: {
      eyebrow: 'Calculator',
      title: 'What does a line stop cost?',
      lead: 'Enter your own numbers. The calculation runs only in your browser and is not sent anywhere.',
      perHour: 'Loss per hour of downtime (UZS)', perHourHint: 'Profit on lost output plus wages',
      hours: 'Hours per stop', times: 'Stops per month',
      perEvent: 'One stop', perMonth: 'Per month', perYear: 'Per year',
      half: 'If downtime were cut in half, yearly saving',
      cta: 'Reduce downtime',
      cur: 'UZS'
    },
    tg5: {
      wAsk: 'Send the request number, for example: /kafolat TX-AB12-CD34',
      wActive: '<b>{code}</b>: warranty valid until {date} ({n} days left).',
      wExpired: '<b>{code}</b>: the warranty ended on {date}. Send a new request and we will help quickly.',
      wNotDone: '<b>{code}</b>: the job is not finished yet. The warranty starts on the completion date.',
      wNone: 'No request with this number was found.',
      wLine: 'Warranty: until {date}'
    }
  }
};
