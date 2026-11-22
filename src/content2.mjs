// Yangi bo'limlar matnlari: AI tashxis, ariza holati, portfel, akademiya, hamkorlik shakllari.
// content.mjs bilan birlashtiriladi (i18n.mjs).

export const content2 = {
  uz: {
    nav2: { portfolio: 'Portfel', academy: 'Akademiya', track: 'Ariza holati' },
    meta2: {
      portfolioTitle: 'Bajarilgan ishlar: ABB, KUKA va sanoat uskunalari ta’miri | {brand}',
      portfolioDesc: 'ABB va KUKA robotlari, Xitoy va Germaniya uskunalari bo‘yicha bajarilgan ta’mir ishlari: muammo, yechim va natija. Rasmlar bilan.',
      trackTitle: 'Ariza holatini kuzatish | {brand}',
      trackDesc: 'Ariza raqami orqali servis so‘rovingiz holati va yangilanishlarni ko‘ring.',
      academyTitle: 'Akademiya: robot va uskunalar bo‘yicha o‘qitish | {brand}',
      academyDesc: 'ABB IRC5, KUKA KR C4, chastota o‘zgartirgichlar bo‘yicha operator va texniklar uchun chuqurlashtirilgan kurslar, test va sertifikat.'
    },
    ai: {
      eyebrow: 'AI tashxis',
      title: 'Muammoni yozing yoki rasmga oling, darhol dastlabki tashxis oling',
      lead: 'Xato kodi, displey yoki nosoz qismning rasmini yuklang. Sun’iy intellekt ehtimoliy sababni, ustuvorlikni va keyingi qadamlarni aytadi. Keyin bir bosishda ariza qilib yuborasiz.',
      photos: 'Rasmlar (4 tagacha)', addPhoto: 'Rasm qo‘shish', removePhoto: 'Rasmni olib tashlash',
      analyze: 'Dastlabki tashxis', analyzing: 'Tahlil qilinmoqda…', send: 'Ariza yuborish', sending: 'Yuborilmoqda…',
      resTitle: 'Dastlabki tashxis', priority: 'Ustuvorlik', causes: 'Ehtimoliy sabablar', steps: 'Tavsiya etilgan keyingi qadamlar', safety: 'Xavfsizlik',
      p: { critical: 'Kritik', high: 'Yuqori', normal: 'O‘rtacha', low: 'Past' },
      disclaimer: 'AI tavsiyasi taxminiy. Yakuniy tashxisni muhandis beradi. Xavfli ishlarni malakasiz bajarmang.',
      errOff: 'AI tashxis hozircha ulanmagan. Arizani yuboring, muhandis o‘zi javob beradi.',
      errRate: 'So‘rovlar ko‘p bo‘ldi. Birozdan keyin urinib ko‘ring yoki arizani yuboring.',
      errFail: 'Tahlil qilib bo‘lmadi. Arizani yuboring, muhandis ko‘rib chiqadi.',
      errImg: 'Faqat JPG, PNG yoki WEBP rasm, har biri 8 MB gacha.',
      okTitle: 'Ariza qabul qilindi', okText: 'Ariza raqamingiz:', okHint: 'Shu raqamni saqlang. U orqali holatni kuzatasiz.', okTrack: 'Holatni ko‘rish',
      orChannels: 'Yoki tayyor xabarni messenjerda yuboring:'
    },
    track: {
      eyebrow: 'Ariza holati', title: 'Arizangiz qayerda?', lead: 'Ariza yuborilganda berilgan raqamni kiriting.',
      code: 'Ariza raqami', codePh: 'TX-XXXX-XXXX', btn: 'Tekshirish', loading: 'Qidirilmoqda…',
      notFound: 'Bunday raqamli ariza topilmadi. Raqamni tekshiring.', errRate: 'Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring.',
      created: 'Yuborilgan', updated: 'Oxirgi yangilanish', equipment: 'Uskuna', service: 'Xizmat', history: 'Yangilanishlar',
      s: { new: 'Qabul qilindi', diagnosing: 'Diagnostika', scheduled: 'Rejalashtirildi', in_progress: 'Ta’mirlanmoqda', waiting_parts: 'Ehtiyot qism kutilmoqda', done: 'Bajarildi', cancelled: 'Bekor qilindi' }
    },
    portfolio: {
      eyebrow: 'Portfel', title: 'Bajarilgan ishlar', lead: 'Har bir ish: qanday muammo bo‘ldi, nima qildik va natija qanday bo‘ldi.',
      problem: 'Muammo', solution: 'Yechim', result: 'Natija', sample: 'Namuna', all: 'Barcha ishlar', back: 'Barcha ishlarga qaytish',
      empty: 'Bu yerda tez orada bajarilgan ishlar paydo bo‘ladi.', equipment: 'Uskuna', industry: 'Soha', year: 'Yil', similar: 'Shunga o‘xshash muammo bormi?'
    },
    academy: {
      eyebrow: 'Akademiya', title: 'Xodimlaringizni robot va uskunalar bo‘yicha o‘qitamiz',
      lead: 'Operator va texniklar uchun chuqurlashtirilgan kurslar: nazariya, amaliy tartiblar, test va sertifikat. Korxona uchun kirish kodi beriladi, rahbar natijalarni ko‘radi.',
      courses: 'Kurslar', level: { basic: 'Boshlang‘ich', advanced: 'Chuqurlashtirilgan', expert: 'Ekspert' },
      hours: 'soat', lessons: 'dars', open: 'Kursni ochish', syllabus: 'Dastur', forWho: 'Kim uchun',
      joinTitle: 'Kursga kirish', joinLead: 'Ismingiz va korxonangizga berilgan kirish kodini kiriting.', name: 'Ism va familiya', code: 'Kirish kodi', join: 'Kirish',
      badCode: 'Kirish kodi noto‘g‘ri yoki muddati tugagan.', getCode: 'Korxonangiz uchun kod olish',
      progress: 'O‘zlashtirish', markDone: 'Darsni tugatdim', done: 'Tugatildi', next: 'Keyingi dars', prev: 'Oldingi dars',
      quiz: 'Yakuniy test', quizLead: 'Sertifikat olish uchun kamida 80% to‘g‘ri javob kerak.', submit: 'Javoblarni yuborish', answerAll: 'Barcha savollarga javob bering.',
      passed: 'Tabriklaymiz! Test topshirildi.', failed: 'Natija yetarli emas. Darslarni qayta ko‘rib, yana urinib ko‘ring.', score: 'Natija',
      cert: 'Sertifikat', certOpen: 'Sertifikatni ochish', certTitle: 'Malaka sertifikati', certText: 'quyidagi kursni muvaffaqiyatli tamomladi:', certId: 'Sertifikat raqami', certDate: 'Sana', certVerify: 'Haqiqiyligini tekshirish',
      certNotFound: 'Sertifikat topilmadi.', logout: 'Chiqish', corporate: 'Kurslar korxonalar uchun. Kirish kodini olish uchun bog‘laning.'
    },
    plans: {
      eyebrow: 'Hamkorlik shakllari', title: 'Sizga qulay ishlash usuli',
      items: [
        { name: 'Bir martalik chaqiruv', for: 'To‘satdan to‘xtash va nosozliklar', points: ['Masofaviy dastlabki tashxis', 'Narx ishdan oldin yozma kelishiladi', 'Ish va qismlarga kafolat', 'Yozma hisobot'], cta: 'Ariza qoldirish' },
        { name: 'Servis shartnoma', for: 'Liniyasi doimiy ishlashi kerak korxonalar', points: ['Rejali profilaktika jadvali', 'Ustuvor javob va chiqish', 'Uskunalar holati bo‘yicha oylik hisobot', 'Ehtiyot qismlar rejasi'], cta: 'Shartnoma so‘rash', featured: 'Tavsiya etiladi' },
        { name: 'Akademiya', for: 'O‘z xodimlarini kuchaytirmoqchi korxonalar', points: ['Onlayn kurslar va testlar', 'Joyida amaliy mashg‘ulot', 'Har bir xodim uchun sertifikat', 'Rahbar uchun natijalar hisoboti'], cta: 'Akademiyani ko‘rish' }
      ],
      note: 'Narx ish hajmiga qarab diagnostikadan so‘ng aniqlanadi. Yashirin to‘lovlar yo‘q.'
    },
    footer2: { call: 'Qo‘ng‘iroq qiling', callLead: 'Uskuna to‘xtagan bo‘lsa, kutmang. Hoziroq qo‘ng‘iroq qiling yoki yozing.', telegram: 'Telegramda yozish' }
  },

  ru: {
    nav2: { portfolio: 'Портфолио', academy: 'Академия', track: 'Статус заявки' },
    meta2: {
      portfolioTitle: 'Выполненные работы: ремонт ABB, KUKA и промышленного оборудования | {brand}',
      portfolioDesc: 'Выполненные ремонты роботов ABB и KUKA, китайского и немецкого оборудования: проблема, решение и результат. С фотографиями.',
      trackTitle: 'Отслеживание статуса заявки | {brand}',
      trackDesc: 'Узнайте статус сервисной заявки, этап работ и последние обновления по её номеру.',
      academyTitle: 'Академия: обучение работе с роботами | {brand}',
      academyDesc: 'Углублённые курсы по ABB IRC5, KUKA KR C4 и частотным преобразователям для операторов и техников, с тестом и сертификатом.'
    },
    ai: {
      eyebrow: 'AI-диагностика',
      title: 'Опишите или сфотографируйте проблему и сразу получите предварительный диагноз',
      lead: 'Загрузите фото кода ошибки, дисплея или неисправного узла. Искусственный интеллект назовёт вероятную причину, приоритет и следующие шаги. Затем в один клик отправьте заявку.',
      photos: 'Фото (до 4)', addPhoto: 'Добавить фото', removePhoto: 'Удалить фото',
      analyze: 'Экспресс-диагностика', analyzing: 'Анализируем…', send: 'Отправить заявку', sending: 'Отправляем…',
      resTitle: 'Предварительный диагноз', priority: 'Приоритет', causes: 'Вероятные причины', steps: 'Рекомендуемые шаги', safety: 'Безопасность',
      p: { critical: 'Критический', high: 'Высокий', normal: 'Средний', low: 'Низкий' },
      disclaimer: 'Рекомендация AI предварительная. Окончательный диагноз ставит инженер. Не выполняйте опасные работы без квалификации.',
      errOff: 'AI-диагностика пока не подключена. Отправьте заявку, инженер ответит сам.',
      errRate: 'Слишком много запросов. Попробуйте позже или отправьте заявку.',
      errFail: 'Не удалось выполнить анализ. Отправьте заявку, инженер посмотрит.',
      errImg: 'Только JPG, PNG или WEBP, до 8 МБ каждое.',
      okTitle: 'Заявка принята', okText: 'Номер вашей заявки:', okHint: 'Сохраните номер. По нему можно отслеживать статус.', okTrack: 'Смотреть статус',
      orChannels: 'Или отправьте готовое сообщение в мессенджере:'
    },
    track: {
      eyebrow: 'Статус заявки', title: 'Где ваша заявка?', lead: 'Введите номер, полученный при отправке заявки.',
      code: 'Номер заявки', codePh: 'TX-XXXX-XXXX', btn: 'Проверить', loading: 'Ищем…',
      notFound: 'Заявка с таким номером не найдена. Проверьте номер.', errRate: 'Слишком много попыток. Попробуйте позже.',
      created: 'Отправлена', updated: 'Последнее обновление', equipment: 'Оборудование', service: 'Услуга', history: 'Обновления',
      s: { new: 'Принята', diagnosing: 'Диагностика', scheduled: 'Запланирована', in_progress: 'В ремонте', waiting_parts: 'Ожидание запчастей', done: 'Выполнена', cancelled: 'Отменена' }
    },
    portfolio: {
      eyebrow: 'Портфолио', title: 'Выполненные работы', lead: 'Каждая работа: какая была проблема, что сделали и какой результат.',
      problem: 'Проблема', solution: 'Решение', result: 'Результат', sample: 'Пример', all: 'Все работы', back: 'Ко всем работам',
      empty: 'Скоро здесь появятся выполненные работы.', equipment: 'Оборудование', industry: 'Отрасль', year: 'Год', similar: 'Похожая проблема?'
    },
    academy: {
      eyebrow: 'Академия', title: 'Обучаем ваш персонал работе с роботами и оборудованием',
      lead: 'Углублённые курсы для операторов и техников: теория, практические процедуры, тест и сертификат. Предприятие получает код доступа, руководитель видит результаты.',
      courses: 'Курсы', level: { basic: 'Базовый', advanced: 'Углублённый', expert: 'Эксперт' },
      hours: 'ч', lessons: 'уроков', open: 'Открыть курс', syllabus: 'Программа', forWho: 'Для кого',
      joinTitle: 'Вход в курс', joinLead: 'Введите имя и код доступа, выданный вашему предприятию.', name: 'Имя и фамилия', code: 'Код доступа', join: 'Войти',
      badCode: 'Код доступа неверный или истёк.', getCode: 'Получить код для предприятия',
      progress: 'Прогресс', markDone: 'Урок пройден', done: 'Пройдено', next: 'Следующий урок', prev: 'Предыдущий урок',
      quiz: 'Итоговый тест', quizLead: 'Для сертификата нужно не менее 80% правильных ответов.', submit: 'Отправить ответы', answerAll: 'Ответьте на все вопросы.',
      passed: 'Поздравляем! Тест сдан.', failed: 'Результат недостаточен. Повторите уроки и попробуйте снова.', score: 'Результат',
      cert: 'Сертификат', certOpen: 'Открыть сертификат', certTitle: 'Сертификат квалификации', certText: 'успешно прошёл(а) курс:', certId: 'Номер сертификата', certDate: 'Дата', certVerify: 'Проверить подлинность',
      certNotFound: 'Сертификат не найден.', logout: 'Выйти', corporate: 'Курсы для предприятий. Свяжитесь с нами, чтобы получить код доступа.'
    },
    plans: {
      eyebrow: 'Форматы работы', title: 'Удобный для вас формат',
      items: [
        { name: 'Разовый вызов', for: 'Внезапные остановки и неисправности', points: ['Удалённая первичная диагностика', 'Цена письменно согласуется до работ', 'Гарантия на работу и детали', 'Письменный отчёт'], cta: 'Оставить заявку' },
        { name: 'Сервисный договор', for: 'Предприятия, где линия должна работать постоянно', points: ['График планового ТО', 'Приоритетный ответ и выезд', 'Ежемесячный отчёт о состоянии оборудования', 'План запасных частей'], cta: 'Запросить договор', featured: 'Рекомендуем' },
        { name: 'Академия', for: 'Предприятия, которые усиливают своих специалистов', points: ['Онлайн-курсы и тесты', 'Практика на объекте', 'Сертификат каждому сотруднику', 'Отчёт по результатам для руководителя'], cta: 'Смотреть академию' }
      ],
      note: 'Стоимость определяется после диагностики по объёму работ. Без скрытых платежей.'
    },
    footer2: { call: 'Позвоните', callLead: 'Если оборудование стоит, не ждите. Позвоните или напишите прямо сейчас.', telegram: 'Написать в Telegram' }
  },

  en: {
    nav2: { portfolio: 'Portfolio', academy: 'Academy', track: 'Request status' },
    meta2: {
      portfolioTitle: 'Case studies: ABB, KUKA and industrial equipment repair | {brand}',
      portfolioDesc: 'Completed repairs of ABB and KUKA robots and Chinese and German machinery: the problem, the fix and the result, with photos.',
      trackTitle: 'Track your service request | {brand}',
      trackDesc: 'Check the status, current work stage and latest updates of your service request by its number.',
      academyTitle: 'Academy: robot and equipment training | {brand}',
      academyDesc: 'In-depth ABB IRC5, KUKA KR C4 and VFD courses for operators and technicians, with a final test and certificate.'
    },
    ai: {
      eyebrow: 'AI diagnosis',
      title: 'Describe or photograph the problem and get a first diagnosis right away',
      lead: 'Upload a photo of the fault code, display or failed part. The AI suggests the likely cause, the priority and the next steps. Then send it as a request in one click.',
      photos: 'Photos (up to 4)', addPhoto: 'Add photo', removePhoto: 'Remove photo',
      analyze: 'Quick diagnosis', analyzing: 'Analyzing…', send: 'Send request', sending: 'Sending…',
      resTitle: 'First diagnosis', priority: 'Priority', causes: 'Likely causes', steps: 'Recommended next steps', safety: 'Safety',
      p: { critical: 'Critical', high: 'High', normal: 'Normal', low: 'Low' },
      disclaimer: 'AI advice is preliminary. The engineer makes the final diagnosis. Do not attempt hazardous work without qualification.',
      errOff: 'AI diagnosis is not connected yet. Send the request and the engineer will reply.',
      errRate: 'Too many requests. Try again later or send the request.',
      errFail: 'The analysis failed. Send the request and the engineer will review it.',
      errImg: 'JPG, PNG or WEBP only, up to 8 MB each.',
      okTitle: 'Request received', okText: 'Your request number:', okHint: 'Keep this number. Use it to track the status.', okTrack: 'Track status',
      orChannels: 'Or send a ready message in a messenger:'
    },
    track: {
      eyebrow: 'Request status', title: 'Where is your request?', lead: 'Enter the number you received when you sent the request.',
      code: 'Request number', codePh: 'TX-XXXX-XXXX', btn: 'Check', loading: 'Searching…',
      notFound: 'No request with this number. Check the number.', errRate: 'Too many attempts. Try again later.',
      created: 'Sent', updated: 'Last update', equipment: 'Equipment', service: 'Service', history: 'Updates',
      s: { new: 'Received', diagnosing: 'Diagnosing', scheduled: 'Scheduled', in_progress: 'In repair', waiting_parts: 'Waiting for parts', done: 'Completed', cancelled: 'Cancelled' }
    },
    portfolio: {
      eyebrow: 'Portfolio', title: 'Case studies', lead: 'Each job: what the problem was, what we did and what the result was.',
      problem: 'Problem', solution: 'Solution', result: 'Result', sample: 'Sample', all: 'All cases', back: 'Back to all cases',
      empty: 'Completed jobs will appear here soon.', equipment: 'Equipment', industry: 'Industry', year: 'Year', similar: 'Have a similar problem?'
    },
    academy: {
      eyebrow: 'Academy', title: 'We train your staff on robots and equipment',
      lead: 'In-depth courses for operators and technicians: theory, hands-on procedures, a test and a certificate. Your company gets an access code and managers see the results.',
      courses: 'Courses', level: { basic: 'Basic', advanced: 'Advanced', expert: 'Expert' },
      hours: 'h', lessons: 'lessons', open: 'Open course', syllabus: 'Syllabus', forWho: 'Who it is for',
      joinTitle: 'Join the course', joinLead: 'Enter your name and the access code given to your company.', name: 'Full name', code: 'Access code', join: 'Join',
      badCode: 'The access code is wrong or expired.', getCode: 'Get a code for your company',
      progress: 'Progress', markDone: 'Mark lesson done', done: 'Done', next: 'Next lesson', prev: 'Previous lesson',
      quiz: 'Final test', quizLead: 'You need at least 80% correct answers for the certificate.', submit: 'Submit answers', answerAll: 'Answer all questions.',
      passed: 'Congratulations! You passed.', failed: 'Not enough correct answers. Review the lessons and try again.', score: 'Score',
      cert: 'Certificate', certOpen: 'Open certificate', certTitle: 'Certificate of qualification', certText: 'has successfully completed the course:', certId: 'Certificate number', certDate: 'Date', certVerify: 'Verify authenticity',
      certNotFound: 'Certificate not found.', logout: 'Sign out', corporate: 'Courses are for companies. Contact us to get an access code.'
    },
    plans: {
      eyebrow: 'Ways to work together', title: 'Pick what suits you',
      items: [
        { name: 'One-off call-out', for: 'Sudden stops and breakdowns', points: ['Remote first diagnosis', 'Price agreed in writing before work', 'Warranty on work and parts', 'Written report'], cta: 'Request service' },
        { name: 'Service contract', for: 'Plants whose line must keep running', points: ['Planned preventive maintenance', 'Priority response and call-out', 'Monthly equipment condition report', 'Spare parts plan'], cta: 'Ask for a contract', featured: 'Recommended' },
        { name: 'Academy', for: 'Companies building their own team', points: ['Online courses and tests', 'Hands-on training on site', 'A certificate for each person', 'Results report for managers'], cta: 'See the academy' }
      ],
      note: 'The price is set after diagnostics, based on the scope. No hidden fees.'
    },
    footer2: { call: 'Call us', callLead: 'If your equipment is down, don’t wait. Call or message now.', telegram: 'Message on Telegram' }
  }
};
