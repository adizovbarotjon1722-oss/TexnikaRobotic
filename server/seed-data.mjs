// Boshlang'ich ma'lumotlar: akademiya kurslari va portfel namunalari.
// Portfel namunalari `sample: 1` bilan belgilangan: saytda "Namuna" yorlig'i chiqadi.
// Admin paneldan o'z haqiqiy ishlaringiz bilan almashtiring yoki o'chiring.

export const courses = [
  {
    slug: 'abb-irc5-operator', level: 'advanced', equipment: 'ABB IRC5', hours: 6, sort: 1,
    title: { uz: 'ABB IRC5: operator va birlamchi diagnostika', ru: 'ABB IRC5: оператор и первичная диагностика', en: 'ABB IRC5: operator and first-line diagnostics' },
    summary: {
      uz: 'FlexPendant bilan xavfsiz ishlash, hodisalar jurnalini o‘qish, backup va SMB batareyasi bilan bog‘liq tipik muammolarni hal qilish.',
      ru: 'Безопасная работа с FlexPendant, чтение журнала событий, резервное копирование и типовые проблемы, связанные с батареей SMB.',
      en: 'Safe FlexPendant operation, reading the event log, backups and typical problems related to the SMB battery.'
    },
    audience: { uz: 'Robot operatorlari, smena texniklari', ru: 'Операторы роботов, сменные техники', en: 'Robot operators, shift technicians' },
    lessons: [
      {
        title: { uz: 'Ish rejimlari va xavfsizlik', ru: 'Режимы работы и безопасность', en: 'Operating modes and safety' },
        body: {
          uz: `IRC5 kontrollerida uchta asosiy rejim bor: **Avtomatik**, **Qo‘lda tezlik cheklangan** (250 mm/s) va **Qo‘lda to‘liq tezlik**.\n\n## Asosiy qoidalar\n- Robot zonasiga faqat qo‘lda rejimda va enabling device (uch holatli tugma) bosilgan holda kiriladi.\n- Avariya to‘xtatish tugmasi bosilganini tiklashdan oldin sababni aniqlang.\n- Avtomatik rejimga o‘tishdan oldin zonada hech kim yo‘qligini tekshiring.\n\n> Himoya to‘siqlari va eshik datchiklarini hech qachon chetlab o‘tmang. Bu jiddiy jarohatga olib keladi.\n\n## Smena boshida tekshiruv\n1. Kabel paketi va shlanglarda shikast yo‘qligi.\n2. Avariya tugmalari ishlashi.\n3. Hodisalar jurnalida yangi ogohlantirishlar yo‘qligi.`,
          ru: `У контроллера IRC5 три основных режима: **Автоматический**, **Ручной с ограничением скорости** (250 мм/с) и **Ручной на полной скорости**.\n\n## Основные правила\n- В зону робота входят только в ручном режиме и с нажатым enabling device (трёхпозиционная кнопка).\n- Перед сбросом аварийной остановки выясните причину.\n- Перед переходом в автоматический режим убедитесь, что в зоне никого нет.\n\n> Никогда не обходите защитные ограждения и датчики дверей. Это ведёт к тяжёлым травмам.\n\n## Проверка в начале смены\n1. Нет повреждений кабельного пакета и шлангов.\n2. Аварийные кнопки работают.\n3. В журнале событий нет новых предупреждений.`,
          en: `The IRC5 controller has three main modes: **Automatic**, **Manual reduced speed** (250 mm/s) and **Manual full speed**.\n\n## Core rules\n- Enter the robot cell only in manual mode with the enabling device (three-position switch) held.\n- Find the cause before resetting an emergency stop.\n- Before switching to automatic, make sure nobody is in the cell.\n\n> Never bypass guards or door switches. Doing so leads to serious injuries.\n\n## Start-of-shift check\n1. No damage to the dress pack and hoses.\n2. Emergency stop buttons work.\n3. No new warnings in the event log.`
        }
      },
      {
        title: { uz: 'Hodisalar jurnalini o‘qish', ru: 'Чтение журнала событий', en: 'Reading the event log' },
        body: {
          uz: `Har bir xabar raqamining birinchi raqami uning toifasini bildiradi:\n- **1xxxx** ish jarayoni\n- **2xxxx** tizim\n- **3xxxx** apparat qismi\n- **4xxxx** dastur\n- **5xxxx** harakat (motion)\n- **7xxxx** kirish/chiqish va aloqa\n\n## Misol: 50204 Motion supervision\nRobot kutilmagan qarshilikni sezdi. Avval to‘qnashuv bo‘lganmi, keyin yuk (payload) ma’lumotlari to‘g‘riligini tekshiring. Noto‘g‘ri yuk ma’lumoti bu xatoning eng ko‘p uchraydigan sababi.\n\n## Muhandisga xabar berishda\n1. Xabar raqami va matnini to‘liq yozing.\n2. Displey rasmini oling.\n3. Xato oldidan nima qilinganini ayting.`,
          ru: `Первая цифра номера сообщения обозначает категорию:\n- **1xxxx** эксплуатация\n- **2xxxx** система\n- **3xxxx** аппаратная часть\n- **4xxxx** программа\n- **5xxxx** движение (motion)\n- **7xxxx** ввод/вывод и связь\n\n## Пример: 50204 Motion supervision\nРобот почувствовал неожиданное сопротивление. Сначала проверьте, было ли столкновение, затем правильность данных нагрузки (payload). Неверные данные нагрузки — самая частая причина этой ошибки.\n\n## При обращении к инженеру\n1. Запишите номер и текст сообщения полностью.\n2. Сфотографируйте дисплей.\n3. Расскажите, что делали перед ошибкой.`,
          en: `The first digit of a message number gives its category:\n- **1xxxx** operational\n- **2xxxx** system\n- **3xxxx** hardware\n- **4xxxx** program\n- **5xxxx** motion\n- **7xxxx** I/O and communication\n\n## Example: 50204 Motion supervision\nThe robot sensed unexpected resistance. First check for a collision, then check the payload data. Wrong payload data is the most common cause of this error.\n\n## When contacting the engineer\n1. Write down the full message number and text.\n2. Take a photo of the display.\n3. Say what was done just before the error.`
        }
      },
      {
        title: { uz: 'Backup va SMB batareyasi', ru: 'Резервная копия и батарея SMB', en: 'Backup and the SMB battery' },
        body: {
          uz: `## Backup\nHar qanday o‘zgarishdan oldin va oyiga kamida bir marta backup oling: FlexPendant menyusida **Backup and Restore**. Nusxani USB va boshqa joyda saqlang.\n\n## SMB batareyasi\nSMB platasi o‘qlarning aylanish hisoblagichlarini saqlaydi. Batareya tugasa, aylanish hisoblagichi yo‘qoladi va robot pozitsiyasini bilmay qoladi.\n- Ogohlantirish chiqqanda batareyani rejali almashtiring.\n- Almashtirgandan keyin **revolution counter update** bajariladi: har bir o‘q sinxron belgisiga keltiriladi.\n\n> Aylanish hisoblagichini noto‘g‘ri yangilash robotning noto‘g‘ri pozitsiyaga borishiga olib keladi. Ishonchingiz komil bo‘lmasa, muhandisni chaqiring.`,
          ru: `## Резервная копия\nДелайте резервную копию перед любыми изменениями и не реже раза в месяц: меню FlexPendant **Backup and Restore**. Храните копию на USB и в другом месте.\n\n## Батарея SMB\nПлата SMB хранит счётчики оборотов осей. Если батарея разрядится, счётчики теряются и робот не знает своего положения.\n- При появлении предупреждения планово замените батарею.\n- После замены выполняется **revolution counter update**: каждая ось приводится к синхронной метке.\n\n> Неправильное обновление счётчиков приводит к движению робота в неверное положение. Если не уверены, вызовите инженера.`,
          en: `## Backup\nTake a backup before any change and at least once a month: FlexPendant menu **Backup and Restore**. Keep a copy on USB and somewhere else.\n\n## SMB battery\nThe SMB board stores the axis revolution counters. If the battery runs out, the counters are lost and the robot no longer knows its position.\n- Replace the battery as planned when the warning appears.\n- After replacing it, run the **revolution counter update**: bring each axis to its sync mark.\n\n> A wrong counter update sends the robot to the wrong position. If unsure, call the engineer.`
        }
      }
    ],
    quiz: [
      { q: { uz: 'Qo‘lda tezlik cheklangan rejimda maksimal tezlik qancha?', ru: 'Какова максимальная скорость в ручном режиме с ограничением?', en: 'What is the maximum speed in manual reduced speed mode?' }, options: { uz: ['250 mm/s', '1000 mm/s', 'Cheklanmagan'], ru: ['250 мм/с', '1000 мм/с', 'Без ограничения'], en: ['250 mm/s', '1000 mm/s', 'Unlimited'] }, answer: 0 },
      { q: { uz: '5xxxx raqamli xabarlar qaysi toifaga tegishli?', ru: 'К какой категории относятся сообщения 5xxxx?', en: 'Which category do 5xxxx messages belong to?' }, options: { uz: ['Dastur', 'Harakat (motion)', 'Aloqa'], ru: ['Программа', 'Движение (motion)', 'Связь'], en: ['Program', 'Motion', 'Communication'] }, answer: 1 },
      { q: { uz: '50204 xatosining eng ko‘p uchraydigan sababi?', ru: 'Самая частая причина ошибки 50204?', en: 'The most common cause of error 50204?' }, options: { uz: ['Noto‘g‘ri yuk ma’lumotlari', 'Tarmoq kabeli', 'Ekran nosozligi'], ru: ['Неверные данные нагрузки', 'Сетевой кабель', 'Неисправность экрана'], en: ['Wrong payload data', 'Network cable', 'Display fault'] }, answer: 0 },
      { q: { uz: 'SMB batareyasi almashtirilgandan keyin nima qilinadi?', ru: 'Что делают после замены батареи SMB?', en: 'What is done after replacing the SMB battery?' }, options: { uz: ['Hech narsa', 'Revolution counter update', 'Kontrollerni formatlash'], ru: ['Ничего', 'Revolution counter update', 'Форматирование контроллера'], en: ['Nothing', 'Revolution counter update', 'Formatting the controller'] }, answer: 1 },
      { q: { uz: 'Robot zonasiga qachon kirish mumkin?', ru: 'Когда можно входить в зону робота?', en: 'When may you enter the robot cell?' }, options: { uz: ['Avtomatik rejimda', 'Qo‘lda rejimda, enabling device bosilgan holda', 'Istalgan vaqtda'], ru: ['В автоматическом режиме', 'В ручном режиме с нажатым enabling device', 'В любое время'], en: ['In automatic mode', 'In manual mode with the enabling device held', 'Any time'] }, answer: 1 }
    ]
  },
  {
    slug: 'kuka-krc4-operator', level: 'advanced', equipment: 'KUKA KR C4', hours: 6, sort: 2,
    title: { uz: 'KUKA KR C4: smartPAD, rejimlar va mastering', ru: 'KUKA KR C4: smartPAD, режимы и мастеринг', en: 'KUKA KR C4: smartPAD, modes and mastering' },
    summary: {
      uz: 'T1, T2, AUT va EXT rejimlari, xabarlar oynasi bilan ishlash, arxivlash va EMD bilan mastering tartibi.',
      ru: 'Режимы T1, T2, AUT и EXT, работа с окном сообщений, архивирование и порядок мастеринга с EMD.',
      en: 'T1, T2, AUT and EXT modes, working with the message window, archiving and mastering with the EMD.'
    },
    audience: { uz: 'KUKA operatorlari va texniklari', ru: 'Операторы и техники KUKA', en: 'KUKA operators and technicians' },
    lessons: [
      {
        title: { uz: 'smartPAD va ish rejimlari', ru: 'smartPAD и режимы работы', en: 'smartPAD and operating modes' },
        body: {
          uz: `KR C4 da to‘rtta rejim bor:\n- **T1**: qo‘lda, tezlik 250 mm/s gacha. O‘rgatish va tekshirish uchun.\n- **T2**: qo‘lda, dastur tezligida. Faqat sinov uchun, ehtiyotkorlik bilan.\n- **AUT**: avtomatik, zona yopiq holatda.\n- **EXT**: tashqi boshqaruv (PLC) orqali avtomatik.\n\nRejim smartPAD dagi kalitli almashtirgich bilan tanlanadi.\n\n> T1 va T2 da enabling switch qo‘yib yuborilsa yoki oxirigacha bosilsa, robot darhol to‘xtaydi. Bu himoya funksiyasi.`,
          ru: `У KR C4 четыре режима:\n- **T1**: ручной, скорость до 250 мм/с. Для обучения и проверки.\n- **T2**: ручной, на программной скорости. Только для испытаний, с осторожностью.\n- **AUT**: автоматический при закрытой зоне.\n- **EXT**: автоматический с внешним управлением (ПЛК).\n\nРежим выбирается ключевым переключателем на smartPAD.\n\n> В T1 и T2 при отпускании или полном нажатии enabling switch робот сразу останавливается. Это защитная функция.`,
          en: `The KR C4 has four modes:\n- **T1**: manual, up to 250 mm/s. For teaching and checking.\n- **T2**: manual at program speed. Testing only, with care.\n- **AUT**: automatic with the cell closed.\n- **EXT**: automatic with external control (PLC).\n\nThe mode is selected with the key switch on the smartPAD.\n\n> In T1 and T2, releasing or fully pressing the enabling switch stops the robot at once. This is a safety function.`
        }
      },
      {
        title: { uz: 'Xabarlar va arxivlash', ru: 'Сообщения и архивирование', en: 'Messages and archiving' },
        body: {
          uz: `## Xabarlar oynasi\nXabarlar turlari: **ma’lumot**, **holat**, **tasdiqlash** talab qiladigan va **kutish** xabarlari. Tasdiqlash xabarini tasdiqlamaguncha robot harakat qilmaydi. Tasdiqlashdan oldin matnni o‘qing va sababni bartaraf qiling.\n\n## Arxivlash\nMenyu: **File → Archive**. Hammasini (All) USB ga arxivlang. Arxiv dasturlar, konfiguratsiya va mastering ma’lumotlarini saqlaydi.\n1. Har o‘zgarishdan oldin arxivlang.\n2. Fayl nomiga sana va robot raqamini yozing.\n3. Kamida ikki joyda saqlang.`,
          ru: `## Окно сообщений\nТипы сообщений: **информационные**, **статусные**, **требующие квитирования** и **ожидания**. Пока сообщение квитирования не подтверждено, робот не двигается. Перед подтверждением прочитайте текст и устраните причину.\n\n## Архивирование\nМеню: **File → Archive**. Архивируйте всё (All) на USB. Архив хранит программы, конфигурацию и данные мастеринга.\n1. Архивируйте перед каждым изменением.\n2. В имени файла укажите дату и номер робота.\n3. Храните минимум в двух местах.`,
          en: `## Message window\nMessage types: **notification**, **status**, **acknowledgement** and **wait** messages. The robot will not move until an acknowledgement message is confirmed. Read the text and remove the cause before confirming.\n\n## Archiving\nMenu: **File → Archive**. Archive everything (All) to USB. The archive holds programs, configuration and mastering data.\n1. Archive before every change.\n2. Put the date and robot number in the file name.\n3. Keep copies in at least two places.`
        }
      },
      {
        title: { uz: 'EMD bilan mastering', ru: 'Мастеринг с EMD', en: 'Mastering with the EMD' },
        body: {
          uz: `Mastering robot o‘qlarining nol holatini belgilaydi. Motor, reduktor yoki enkoder almashtirilganda, yoki to‘qnashuvdan keyin kerak bo‘ladi.\n\n## Tartib\n1. Robotni T1 rejimiga o‘tkazing.\n2. O‘qni mastering belgisiga yaqinlashtiring.\n3. EMD (Electronic Mastering Device) ni o‘lchash patroniga o‘rnating.\n4. smartPAD da **Start-up → Master → EMD** ni tanlang va ko‘rsatmalarga amal qiling.\n5. Har bir o‘q uchun takrorlang, keyin arxivlang.\n\n> Yuk bilan va yuksiz mastering farq qiladi. Noto‘g‘ri mastering detal va asbobni shikastlaydi.`,
          ru: `Мастеринг задаёт нулевое положение осей робота. Нужен после замены двигателя, редуктора или энкодера, а также после столкновения.\n\n## Порядок\n1. Переведите робот в режим T1.\n2. Подведите ось к метке мастеринга.\n3. Установите EMD (Electronic Mastering Device) на измерительный патрон.\n4. На smartPAD выберите **Start-up → Master → EMD** и следуйте указаниям.\n5. Повторите для каждой оси, затем сделайте архив.\n\n> Мастеринг с нагрузкой и без неё различается. Неверный мастеринг повреждает деталь и инструмент.`,
          en: `Mastering sets the zero position of the robot axes. It is needed after replacing a motor, gearbox or encoder, and after a collision.\n\n## Procedure\n1. Switch the robot to T1.\n2. Move the axis close to its mastering mark.\n3. Fit the EMD (Electronic Mastering Device) on the gauge cartridge.\n4. On the smartPAD choose **Start-up → Master → EMD** and follow the prompts.\n5. Repeat for each axis, then archive.\n\n> Mastering with and without load differ. Wrong mastering damages parts and tooling.`
        }
      }
    ],
    quiz: [
      { q: { uz: 'Qaysi rejim PLC orqali avtomatik boshqaruv?', ru: 'Какой режим — автоматическое управление от ПЛК?', en: 'Which mode is automatic control from a PLC?' }, options: { uz: ['T1', 'AUT', 'EXT'], ru: ['T1', 'AUT', 'EXT'], en: ['T1', 'AUT', 'EXT'] }, answer: 2 },
      { q: { uz: 'T1 rejimida maksimal tezlik?', ru: 'Максимальная скорость в T1?', en: 'Maximum speed in T1?' }, options: { uz: ['250 mm/s', 'Dastur tezligi', '2 m/s'], ru: ['250 мм/с', 'Программная скорость', '2 м/с'], en: ['250 mm/s', 'Program speed', '2 m/s'] }, answer: 0 },
      { q: { uz: 'Arxiv qaysi menyudan olinadi?', ru: 'Из какого меню делается архив?', en: 'Which menu creates an archive?' }, options: { uz: ['File → Archive', 'Display → Variable', 'Help → Info'], ru: ['File → Archive', 'Display → Variable', 'Help → Info'], en: ['File → Archive', 'Display → Variable', 'Help → Info'] }, answer: 0 },
      { q: { uz: 'Mastering qachon kerak?', ru: 'Когда нужен мастеринг?', en: 'When is mastering needed?' }, options: { uz: ['Har smenada', 'Motor yoki reduktor almashtirilgandan keyin', 'Dastur o‘zgarganda'], ru: ['Каждую смену', 'После замены двигателя или редуктора', 'При изменении программы'], en: ['Every shift', 'After replacing a motor or gearbox', 'When a program changes'] }, answer: 1 },
      { q: { uz: 'Enabling switch oxirigacha bosilsa nima bo‘ladi?', ru: 'Что будет при полном нажатии enabling switch?', en: 'What happens if the enabling switch is fully pressed?' }, options: { uz: ['Tezlik oshadi', 'Robot to‘xtaydi', 'Hech narsa'], ru: ['Скорость растёт', 'Робот останавливается', 'Ничего'], en: ['Speed increases', 'The robot stops', 'Nothing'] }, answer: 1 }
    ]
  },
  {
    slug: 'vfd-servo-diagnostics', level: 'expert', equipment: 'VFD / Servo', hours: 8, sort: 3,
    title: { uz: 'Chastota o‘zgartirgich va servo drayver diagnostikasi', ru: 'Диагностика частотных преобразователей и сервоприводов', en: 'VFD and servo drive diagnostics' },
    summary: {
      uz: 'Xavfsiz o‘lchash, tipik xatolar (ortiqcha tok, kuchlanish, qizish, enkoder) va ularni bosqichma-bosqich topish.',
      ru: 'Безопасные измерения, типовые ошибки (перегрузка по току, напряжение, перегрев, энкодер) и их пошаговый поиск.',
      en: 'Safe measurement, typical faults (overcurrent, voltage, overheating, encoder) and how to find them step by step.'
    },
    audience: { uz: 'Elektriklar va avtomatlashtirish texniklari', ru: 'Электрики и техники по автоматизации', en: 'Electricians and automation technicians' },
    lessons: [
      {
        title: { uz: 'Xavfsizlik va DC shina', ru: 'Безопасность и шина DC', en: 'Safety and the DC bus' },
        body: {
          uz: `Drayver o‘chirilgandan keyin ham DC shinadagi kondensatorlarda xavfli kuchlanish qoladi.\n\n## Qoidalar\n- Ta’minotni o‘chiring va qulflang (LOTO).\n- Korpusda ko‘rsatilgan vaqtni kuting (odatda 5–15 daqiqa).\n- DC+ va DC− orasidagi kuchlanishni multimetr bilan o‘lchab, xavfsiz darajaga tushganini tasdiqlang.\n\n> Kuchlanish o‘lchanmaguncha klemmalarga tegmang. Faqat CAT III yoki undan yuqori toifali asbobdan foydalaning.`,
          ru: `Даже после отключения привода на конденсаторах шины DC остаётся опасное напряжение.\n\n## Правила\n- Отключите питание и заблокируйте (LOTO).\n- Выждите время, указанное на корпусе (обычно 5–15 минут).\n- Измерьте мультиметром напряжение между DC+ и DC− и убедитесь, что оно упало до безопасного уровня.\n\n> Не касайтесь клемм, пока напряжение не измерено. Используйте прибор категории не ниже CAT III.`,
          en: `Even after the drive is switched off, dangerous voltage remains on the DC bus capacitors.\n\n## Rules\n- Switch off and lock out the supply (LOTO).\n- Wait the time shown on the housing (usually 5–15 minutes).\n- Measure the voltage between DC+ and DC− with a multimeter and confirm it has dropped to a safe level.\n\n> Do not touch terminals until the voltage is measured. Use a meter rated CAT III or higher.`
        }
      },
      {
        title: { uz: 'Tipik xatolar', ru: 'Типовые ошибки', en: 'Typical faults' },
        body: {
          uz: `## Ortiqcha tok (overcurrent)\nMotor kabelida qisqa tutashuv, izolyatsiya pasaygan, tezlanish vaqti juda qisqa yoki mexanik tiqilish.\n\n## Ortiqcha kuchlanish (overvoltage)\nOdatda tormozlanishda: sekinlashish vaqti qisqa, tormoz rezistori yo‘q yoki uzilgan.\n\n## Past kuchlanish (undervoltage)\nTarmoqda faza yo‘qolishi, kuchlanish tushishi, kirish saqlagichi.\n\n## Qizish\nVentilyator, chang bosgan radiator, shkafdagi harorat yuqori.\n\n## Enkoder xatosi\nKabel, ekran (shield) ulanishi, raz’yom, shovqin.`,
          ru: `## Перегрузка по току (overcurrent)\nКЗ в кабеле двигателя, снижение изоляции, слишком короткое время разгона или механическое заклинивание.\n\n## Перенапряжение (overvoltage)\nОбычно при торможении: короткое время замедления, нет тормозного резистора или он оборван.\n\n## Пониженное напряжение (undervoltage)\nПропадание фазы, просадки сети, входной предохранитель.\n\n## Перегрев\nВентилятор, запылённый радиатор, высокая температура в шкафу.\n\n## Ошибка энкодера\nКабель, подключение экрана, разъём, помехи.`,
          en: `## Overcurrent\nShort circuit in the motor cable, degraded insulation, acceleration time too short or a mechanical jam.\n\n## Overvoltage\nUsually during braking: deceleration too short, braking resistor missing or open.\n\n## Undervoltage\nLost phase, supply dips, input fuse.\n\n## Overheating\nFan, dusty heatsink, high cabinet temperature.\n\n## Encoder fault\nCable, shield connection, connector, noise.`
        }
      },
      {
        title: { uz: 'Bosqichma-bosqich diagnostika', ru: 'Пошаговая диагностика', en: 'Step-by-step diagnostics' },
        body: {
          uz: `1. Xato kodi va xatolar tarixini yozib oling (oxirgi 5–10 ta).\n2. Xato qachon chiqadi: ishga tushishda, tezlanishda, tormozlanishda yoki doimiy ishda?\n3. Motorni drayverdan uzib, megommetr bilan izolyatsiyani o‘lchang (drayverni ulangan holda megommetr ishlatmang!).\n4. Faza qarshiliklarini solishtiring: farq katta bo‘lmasligi kerak.\n5. Kirish kuchlanishini yuk ostida o‘lchang.\n6. Parametrlarni zavod qiymatlari va motor plitasi bilan solishtiring.\n\n> Topilgan qiymatlarni yozib boring. Bu muhandisga masofadan yordam berishni ancha osonlashtiradi.`,
          ru: `1. Запишите код ошибки и историю ошибок (последние 5–10).\n2. Когда возникает ошибка: при пуске, разгоне, торможении или в установившемся режиме?\n3. Отключите двигатель от привода и измерьте изоляцию мегаомметром (не используйте мегаомметр при подключённом приводе!).\n4. Сравните сопротивления фаз: разница должна быть небольшой.\n5. Измерьте входное напряжение под нагрузкой.\n6. Сравните параметры с заводскими и с шильдиком двигателя.\n\n> Записывайте все значения. Так инженеру гораздо проще помочь удалённо.`,
          en: `1. Record the fault code and fault history (last 5–10).\n2. When does it trip: at start, acceleration, braking or steady running?\n3. Disconnect the motor from the drive and test insulation with a megohmmeter (never megger with the drive connected!).\n4. Compare phase resistances: the difference should be small.\n5. Measure input voltage under load.\n6. Compare parameters with factory defaults and the motor nameplate.\n\n> Write down every value. It makes remote help from the engineer much easier.`
        }
      }
    ],
    quiz: [
      { q: { uz: 'Drayver o‘chirilgandan keyin nima uchun kutish kerak?', ru: 'Зачем ждать после отключения привода?', en: 'Why wait after switching off the drive?' }, options: { uz: ['Ventilyator to‘xtashi uchun', 'DC shina kondensatorlari zaryadsizlanishi uchun', 'Displey o‘chishi uchun'], ru: ['Чтобы остановился вентилятор', 'Чтобы разрядились конденсаторы шины DC', 'Чтобы погас дисплей'], en: ['For the fan to stop', 'For the DC bus capacitors to discharge', 'For the display to go off'] }, answer: 1 },
      { q: { uz: 'Tormozlanishda chiqadigan tipik xato?', ru: 'Типовая ошибка при торможении?', en: 'Typical fault during braking?' }, options: { uz: ['Ortiqcha kuchlanish', 'Past kuchlanish', 'Enkoder'], ru: ['Перенапряжение', 'Пониженное напряжение', 'Энкодер'], en: ['Overvoltage', 'Undervoltage', 'Encoder'] }, answer: 0 },
      { q: { uz: 'Megommetr bilan izolyatsiyani qanday o‘lchash kerak?', ru: 'Как правильно мерить изоляцию мегаомметром?', en: 'How should insulation be tested with a megohmmeter?' }, options: { uz: ['Drayver ulangan holda', 'Motor drayverdan uzilgan holda', 'Ishlab turgan motorda'], ru: ['С подключённым приводом', 'Отключив двигатель от привода', 'На работающем двигателе'], en: ['With the drive connected', 'With the motor disconnected from the drive', 'On a running motor'] }, answer: 1 },
      { q: { uz: 'Qizish xatosining ehtimoliy sababi?', ru: 'Вероятная причина перегрева?', en: 'Likely cause of overheating?' }, options: { uz: ['Chang bosgan radiator', 'Noto‘g‘ri til sozlamasi', 'Ethernet kabeli'], ru: ['Запылённый радиатор', 'Неверная настройка языка', 'Кабель Ethernet'], en: ['Dusty heatsink', 'Wrong language setting', 'Ethernet cable'] }, answer: 0 },
      { q: { uz: 'Enkoder xatosida avval nimani tekshirasiz?', ru: 'Что проверить первым при ошибке энкодера?', en: 'What do you check first on an encoder fault?' }, options: { uz: ['Kabel va ekran ulanishi', 'Tarmoq chastotasi', 'Dastur versiyasi'], ru: ['Кабель и подключение экрана', 'Частоту сети', 'Версию программы'], en: ['Cable and shield connection', 'Supply frequency', 'Software version'] }, answer: 0 }
    ]
  }
];

export const portfolio = [
  {
    slug: 'kuka-kr210-mastering-yoqolishi', brand: 'KUKA', model: 'KR 210 R2700 · KR C4', year: 2025, sample: 1, sort: 1, cover: 'kuka',
    industry: { uz: 'Avtomobil yig‘uv', ru: 'Автомобильная сборка', en: 'Automotive assembly' },
    title: { uz: 'KUKA KR 210: to‘qnashuvdan keyin mastering tiklandi', ru: 'KUKA KR 210: восстановлен мастеринг после столкновения', en: 'KUKA KR 210: mastering restored after a collision' },
    problem: { uz: 'To‘qnashuvdan keyin A3 o‘qi pozitsiyani yo‘qotdi, robot nuqtalarga noaniq borardi. Liniya to‘xtagan.', ru: 'После столкновения ось A3 потеряла положение, робот приходил в точки неточно. Линия стояла.', en: 'After a collision, axis A3 lost its position and the robot missed its points. The line was down.' },
    solution: { uz: 'Reduktor va motor tekshirildi, shikastlangan enkoder kabeli almashtirildi. EMD bilan barcha o‘qlar qayta mastering qilindi, asosiy nuqtalar tekshirildi va arxiv olindi.', ru: 'Проверены редуктор и двигатель, заменён повреждённый кабель энкодера. Все оси перемастерены с EMD, проверены ключевые точки, сделан архив.', en: 'Gearbox and motor were checked and the damaged encoder cable replaced. All axes were remastered with the EMD, key points verified and an archive taken.' },
    result: { uz: 'Liniya bir smenada qayta ishga tushdi. Takrorlanmasligi uchun to‘qnashuv zonasi qayta sozlandi.', ru: 'Линия запущена в течение одной смены. Зона столкновения перенастроена, чтобы проблема не повторилась.', en: 'The line was back within one shift. The collision zone was reconfigured so it does not happen again.' }
  },
  {
    slug: 'abb-irc5-50204-payload', brand: 'ABB', model: 'IRB 6700 · IRC5', year: 2025, sample: 1, sort: 2, cover: 'abb',
    industry: { uz: 'Metallga ishlov berish', ru: 'Металлообработка', en: 'Metalworking' },
    title: { uz: 'ABB IRB 6700: 50204 Motion supervision xatosi bartaraf etildi', ru: 'ABB IRB 6700: устранена ошибка 50204 Motion supervision', en: 'ABB IRB 6700: 50204 Motion supervision error fixed' },
    problem: { uz: 'Yangi greyfer o‘rnatilgandan keyin robot har bir siklda 50204 xatosi bilan to‘xtardi.', ru: 'После установки нового захвата робот останавливался с ошибкой 50204 в каждом цикле.', en: 'After a new gripper was fitted, the robot stopped with error 50204 every cycle.' },
    solution: { uz: 'Yuk ma’lumotlari eski greyferniki qolgan edi. LoadIdentify bilan yangi yuk aniqlandi, dasturdagi tool va load ma’lumotlari yangilandi, motion supervision sezgirligi tekshirildi.', ru: 'Данные нагрузки остались от старого захвата. Новая нагрузка определена через LoadIdentify, обновлены tool и load в программе, проверена чувствительность motion supervision.', en: 'Payload data was still from the old gripper. The new load was identified with LoadIdentify, tool and load data updated in the program and motion supervision sensitivity checked.' },
    result: { uz: 'Xato yo‘qoldi, sikl vaqti o‘zgarmadi. Operatorlarga greyfer almashtirishdagi tartib o‘rgatildi.', ru: 'Ошибка ушла, время цикла не изменилось. Операторов обучили порядку замены захвата.', en: 'The error was gone and cycle time unchanged. Operators were trained on the gripper change procedure.' }
  },
  {
    slug: 'termoplast-avtomat-servo-drayver', brand: 'Haitian', model: 'Termoplast avtomati · servo drayver', year: 2024, sample: 1, sort: 3, cover: 'drive',
    industry: { uz: 'Plastmassa ishlab chiqarish', ru: 'Производство пластмасс', en: 'Plastics manufacturing' },
    title: { uz: 'Xitoy termoplast avtomati: servo drayver plata darajasida tiklandi', ru: 'Китайский термопластавтомат: сервопривод восстановлен на уровне платы', en: 'Chinese injection molding machine: servo drive repaired at board level' },
    problem: { uz: 'Servo drayver ortiqcha tok xatosi berib, mashina ishga tushmasdi. Yangi drayverni yetkazish bir necha hafta edi.', ru: 'Сервопривод выдавал ошибку перегрузки по току, машина не запускалась. Поставка нового привода занимала несколько недель.', en: 'The servo drive tripped on overcurrent and the machine would not start. A new drive was weeks away.' },
    solution: { uz: 'Quvvat moduli va drayver sxemasi diagnostika qilindi. Shikastlangan IGBT moduli va drayver mikrosxemasi almashtirildi, kondensatorlar tekshirildi, stendda yuk ostida sinaldi.', ru: 'Проведена диагностика силового модуля и схемы драйвера. Заменены повреждённый IGBT-модуль и микросхема драйвера, проверены конденсаторы, испытание под нагрузкой на стенде.', en: 'The power module and gate driver circuit were diagnosed. The damaged IGBT module and driver IC were replaced, capacitors checked and the drive load-tested on the bench.' },
    result: { uz: 'Mashina ikki kunda ishga tushdi. Yangi drayverga nisbatan sezilarli tejaldi.', ru: 'Машина запущена через два дня. Существенная экономия по сравнению с новым приводом.', en: 'The machine was running in two days, at a fraction of the cost of a new drive.' }
  }
];
