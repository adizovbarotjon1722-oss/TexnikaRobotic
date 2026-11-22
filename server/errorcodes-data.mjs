// Industrial robot / drive error code knowledge base (uz / ru / en).
// Each entry: brand, code, controller, severity, title, causes, checks, note.

const DC_NOTE = {
  uz: 'DC shina kondensatorlari o‘chirilgandan keyin ham xavfli kuchlanishni saqlaydi: yorliqdagi kutish vaqtini kuting va kuchlanish yo‘qligini o‘lchab tekshiring.',
  ru: 'Конденсаторы звена постоянного тока сохраняют опасное напряжение после отключения: выждите время, указанное на табличке, и убедитесь измерением в отсутствии напряжения.',
  en: 'DC bus capacitors hold dangerous voltage after power-off: wait the time stated on the label and measure to confirm zero voltage before touching anything.'
};

export const errorCodes = [
  // ───────────────────────── KUKA ─────────────────────────
  {
    brand: 'KUKA',
    code: 'Local EMERGENCY STOP',
    controller: 'KR C4 / KSS 8.x',
    severity: 'high',
    title: {
      uz: 'Mahalliy favqulodda to‘xtash: smartPAD dagi E-STOP tugmasi bosilgan',
      ru: 'Локальный аварийный останов: нажата кнопка E-STOP на smartPAD',
      en: 'Local emergency stop: the E-STOP button on the smartPAD is pressed'
    },
    causes: {
      uz: ['smartPAD dagi E-STOP tugmasi bosilgan va qaytarilmagan', 'smartPAD kabeli yoki ulagichi shikastlangan', 'smartPAD noto‘g‘ri uzilgan yoki ulangan'],
      ru: ['Кнопка E-STOP на smartPAD нажата и не разблокирована', 'Повреждён кабель или разъём smartPAD', 'smartPAD отключён или подключён неправильно'],
      en: ['E-STOP button on the smartPAD is pressed and not released', 'smartPAD cable or connector is damaged', 'smartPAD was unplugged or plugged in incorrectly']
    },
    checks: {
      uz: ['Robot zonasida odam yo‘qligiga va xavf bartaraf etilganiga ishonch hosil qiling', 'E-STOP tugmasini burab qaytaring', 'Xabarni smartPAD da tasdiqlang (Ackn.) va drayvlarni yoqing', 'Xabar qaytsa, smartPAD kabeli va ulagichini ko‘zdan kechiring'],
      ru: ['Убедитесь, что в зоне робота нет людей и опасность устранена', 'Разблокируйте кнопку E-STOP поворотом', 'Квитируйте сообщение на smartPAD и включите приводы', 'Если сообщение повторяется, осмотрите кабель и разъём smartPAD'],
      en: ['Make sure nobody is in the robot cell and the hazard is cleared', 'Release the E-STOP button by turning it', 'Acknowledge the message on the smartPAD and switch the drives on', 'If it returns, inspect the smartPAD cable and connector']
    },
    note: {
      uz: 'Favqulodda to‘xtash zanjirini hech qachon ko‘prik yoki perimichka bilan aylanib o‘tmang.',
      ru: 'Никогда не шунтируйте цепь аварийного останова перемычками.',
      en: 'Never bridge or bypass the emergency stop circuit.'
    }
  },
  {
    brand: 'KUKA',
    code: 'External EMERGENCY STOP',
    controller: 'KR C4 / KSS 8.x',
    severity: 'high',
    title: {
      uz: 'Tashqi favqulodda to‘xtash: tashqi E-STOP zanjiri uzilgan',
      ru: 'Внешний аварийный останов: разомкнута внешняя цепь E-STOP',
      en: 'External emergency stop: the external E-STOP circuit is open'
    },
    causes: {
      uz: ['Hujayradagi tashqi E-STOP tugmasi bosilgan', 'PLC yoki xavfsizlik relesi E-STOP signalini bergan', 'X11 yoki xavfsizlik interfeysidagi sim uzilgan yoki bo‘shagan', 'PROFIsafe/CIP Safety aloqasi uzilgan'],
      ru: ['Нажата внешняя кнопка E-STOP в ячейке', 'ПЛК или реле безопасности выдали сигнал E-STOP', 'Обрыв или ослабление провода на X11 или интерфейсе безопасности', 'Потеря связи PROFIsafe/CIP Safety'],
      en: ['An external E-STOP button in the cell is pressed', 'The PLC or safety relay issued an E-STOP signal', 'Broken or loose wire at X11 or the safety interface', 'PROFIsafe/CIP Safety communication lost']
    },
    checks: {
      uz: ['Hujayradagi barcha E-STOP tugmalarini tekshirib, qaytaring', 'PLC/xavfsizlik relesi holatini va xatolarini ko‘ring', 'Xabarni tasdiqlang va drayvlarni yoqing', 'Zanjirda uzilish bo‘lsa, simlarni faqat malakali elektrik kuchlanishsiz holatda tekshirsin'],
      ru: ['Проверьте и разблокируйте все кнопки E-STOP в ячейке', 'Посмотрите состояние и ошибки ПЛК/реле безопасности', 'Квитируйте сообщение и включите приводы', 'При обрыве цепи проводку проверяет только квалифицированный электрик при снятом напряжении'],
      en: ['Check and release every E-STOP button in the cell', 'Check the PLC/safety relay status and faults', 'Acknowledge the message and switch the drives on', 'If the circuit is broken, only a qualified electrician should check wiring with power off']
    },
    note: {
      uz: 'Xavfsizlik zanjiriga perimichka qo‘yish taqiqlanadi; nosozlik takrorlansa muhandisni chaqiring.',
      ru: 'Установка перемычек в цепь безопасности запрещена; при повторении вызовите инженера.',
      en: 'Jumpering the safety circuit is forbidden; call the engineer if the fault repeats.'
    }
  },
  {
    brand: 'KUKA',
    code: 'Operator safety open',
    controller: 'KR C4 / KSS 8.x',
    severity: 'normal',
    title: {
      uz: 'Operator xavfsizligi ochiq: himoya eshigi yoki to‘siq signali yo‘q',
      ru: 'Защита оператора разомкнута: нет сигнала двери или ограждения',
      en: 'Operator safety open: safety door or guard signal is missing'
    },
    causes: {
      uz: ['Himoya eshigi ochiq yoki to‘liq yopilmagan', 'Eshik datchigi yoki zamogi nosoz yoki siljigan', 'Yorug‘lik pardasi yoki skaner to‘sig‘i buzilgan', 'Avtomatik rejimda operator xavfsizligi signali uzilgan'],
      ru: ['Защитная дверь открыта или не закрыта до конца', 'Датчик или замок двери неисправен или смещён', 'Нарушена световая завеса или поле сканера', 'В автоматическом режиме пропал сигнал защиты оператора'],
      en: ['Safety door is open or not fully closed', 'Door sensor or lock is faulty or misaligned', 'Light curtain or scanner field is interrupted', 'Operator safety signal dropped in automatic mode']
    },
    checks: {
      uz: ['Hujayrada odam yo‘qligini tekshiring', 'Eshikni to‘liq yoping va zamok ishlaganini tekshiring', 'Yorug‘lik pardasi oldidagi to‘siqlarni olib tashlang', 'Xabarni tasdiqlang (Ackn. Operator safety)', 'Datchik nosoz bo‘lsa, almashtirish uchun muhandisni chaqiring'],
      ru: ['Проверьте, что в ячейке нет людей', 'Полностью закройте дверь и проверьте срабатывание замка', 'Уберите препятствия перед световой завесой', 'Квитируйте сообщение (Ackn. Operator safety)', 'При неисправном датчике вызовите инженера для замены'],
      en: ['Check that nobody is inside the cell', 'Close the door fully and check that the lock engages', 'Remove objects blocking the light curtain', 'Acknowledge the message (Ackn. Operator safety)', 'If the sensor is faulty, call the engineer to replace it']
    },
    note: {
      uz: 'Eshik datchigini magnit, lenta yoki perimichka bilan aldash qat’iyan man etiladi.',
      ru: 'Обман датчика двери магнитом, лентой или перемычкой строго запрещён.',
      en: 'Defeating a door switch with a magnet, tape or jumper is strictly forbidden.'
    }
  },
  {
    brand: 'KUKA',
    code: 'Software limit switch',
    controller: 'KR C4 / KSS 8.x',
    severity: 'normal',
    title: {
      uz: 'Dasturiy chegara: o‘q (A1–A6) ruxsat etilgan diapazon chetiga yetdi',
      ru: 'Программный конечный выключатель: ось (A1–A6) достигла предела',
      en: 'Software limit switch: an axis (A1–A6) reached its allowed range limit'
    },
    causes: {
      uz: ['Qo‘lda harakatlantirishda o‘q chegaraga olib borilgan', 'Dasturdagi nuqta o‘q diapazonidan tashqarida', 'Asbob yoki baza ma’lumotlari noto‘g‘ri', 'Mastering (kalibrlash) noto‘g‘ri bo‘lgani uchun o‘q holati siljigan'],
      ru: ['При ручном перемещении ось доведена до предела', 'Точка программы вне диапазона оси', 'Неверные данные инструмента или базы', 'Положение оси смещено из-за неверной юстировки (mastering)'],
      en: ['The axis was jogged into its limit', 'A program point lies outside the axis range', 'Wrong tool or base data', 'Axis position shifted because of incorrect mastering']
    },
    checks: {
      uz: ['Xabarda qaysi o‘q va yo‘nalish (+/-) ko‘rsatilganini aniqlang', 'Xabarni tasdiqlang va o‘qni T1 rejimida qarama-qarshi tomonga sekin harakatlantiring', 'Dastur nuqtasini qayta o‘rgating yoki asbob/bazani tekshiring', 'Chegaralarni o‘zgartirish kerak bo‘lsa, muhandisga murojaat qiling'],
      ru: ['Определите ось и направление (+/-) из сообщения', 'Квитируйте сообщение и медленно отведите ось в обратную сторону в режиме T1', 'Переобучите точку программы или проверьте инструмент/базу', 'Изменение пределов поручите инженеру'],
      en: ['Read which axis and direction (+/-) the message names', 'Acknowledge and jog the axis slowly in the opposite direction in T1', 'Reteach the program point or check tool/base data', 'Leave any change of limits to the engineer']
    },
    note: { uz: '', ru: '', en: '' }
  },
  {
    brand: 'KUKA',
    code: 'Brake test required',
    controller: 'KR C4 / KSS 8.x',
    severity: 'normal',
    title: {
      uz: 'Tormoz testi talab qilinadi: SafeOperation tormozlarni tekshirishni so‘ramoqda',
      ru: 'Требуется тест тормозов: SafeOperation запрашивает проверку тормозов',
      en: 'Brake test required: SafeOperation requests a brake check'
    },
    causes: {
      uz: ['Tormoz testi davri (odatda 46 soat) tugagan', 'Kontroller qayta ishga tushirilgan va test bajarilmagan', 'Oldingi tormoz testi muvaffaqiyatsiz tugagan'],
      ru: ['Истёк интервал теста тормозов (обычно 46 ч)', 'Контроллер перезапущен, тест не выполнен', 'Предыдущий тест тормозов завершился неудачно'],
      en: ['The brake test interval (typically 46 h) has expired', 'The controller was restarted and the test was not run', 'The previous brake test failed']
    },
    checks: {
      uz: ['Robot atrofini bo‘shating', 'Tormoz testi dasturini (BrakeTestReq yoki ishlab chiqaruvchi dasturi) ishga tushiring', 'Test natijasini xabarlar oynasida tekshiring', 'Test muvaffaqiyatsiz bo‘lsa, robotni ishlatmang va muhandisni chaqiring'],
      ru: ['Освободите пространство вокруг робота', 'Запустите программу теста тормозов (BrakeTestReq или программу интегратора)', 'Проверьте результат теста в окне сообщений', 'При неудачном тесте не эксплуатируйте робот и вызовите инженера'],
      en: ['Clear the area around the robot', 'Run the brake test program (BrakeTestReq or the integrator program)', 'Check the test result in the message window', 'If the test fails, do not operate the robot and call the engineer']
    },
    note: {
      uz: 'Nosoz tormoz o‘q tushib ketishiga olib kelishi mumkin; robot ostida turmang.',
      ru: 'Неисправный тормоз может привести к падению оси; не находитесь под роботом.',
      en: 'A faulty brake can let an axis drop; never stand under the robot.'
    }
  },
  {
    brand: 'KUKA',
    code: 'Ackn. General motion enable',
    controller: 'KR C4 / KSS 8.x',
    severity: 'normal',
    title: {
      uz: 'Umumiy harakat ruxsati yo‘q: $MOVE_ENABLE signali berilmagan',
      ru: 'Нет общего разрешения движения: сигнал $MOVE_ENABLE не выдан',
      en: 'General motion enable missing: the $MOVE_ENABLE signal is not set'
    },
    causes: {
      uz: ['PLC $MOVE_ENABLE ga ulangan kirish signalini bermagan', 'Fieldbus (PROFINET/EtherNet/IP) aloqasi uzilgan', 'I/O konfiguratsiyasi yoki signal manzili noto‘g‘ri'],
      ru: ['ПЛК не выдал входной сигнал, назначенный на $MOVE_ENABLE', 'Обрыв связи по полевой шине (PROFINET/EtherNet/IP)', 'Неверная конфигурация I/O или адрес сигнала'],
      en: ['The PLC did not set the input mapped to $MOVE_ENABLE', 'Fieldbus (PROFINET/EtherNet/IP) communication lost', 'Wrong I/O configuration or signal address']
    },
    checks: {
      uz: ['Kirish/chiqishlar oynasida $MOVE_ENABLE kirishi holatini ko‘ring', 'PLC tomonda ruxsat shartlari bajarilganini tekshiring', 'Fieldbus aloqa xatolarini tekshiring', 'Xabarni tasdiqlang'],
      ru: ['Посмотрите состояние входа $MOVE_ENABLE в окне входов/выходов', 'Проверьте условия разрешения на стороне ПЛК', 'Проверьте ошибки связи полевой шины', 'Квитируйте сообщение'],
      en: ['Check the $MOVE_ENABLE input state in the I/O display', 'Verify the enable conditions on the PLC side', 'Check for fieldbus communication errors', 'Acknowledge the message']
    },
    note: {
      uz: 'Konfiguratsiyada $MOVE_ENABLE ni doimiy TRUE qilib qo‘ymang; bu himoya funksiyasini yo‘qotadi.',
      ru: 'Не назначайте $MOVE_ENABLE постоянно в TRUE: это отключает защитную функцию.',
      en: 'Do not force $MOVE_ENABLE permanently TRUE in the configuration; that removes a protective function.'
    }
  },
  {
    brand: 'KUKA',
    code: 'Commanded acceleration exceeded',
    controller: 'KR C4 / KSS 8.x',
    severity: 'normal',
    title: {
      uz: 'Buyurilgan tezlanish oshib ketdi: o‘q uchun ruxsat etilgan tezlanishdan ko‘p',
      ru: 'Превышено заданное ускорение оси',
      en: 'Commanded acceleration exceeded for an axis'
    },
    causes: {
      uz: ['Trayektoriya singulyarlik yaqinidan o‘tmoqda', 'Dasturda tezlik yoki tezlanish juda yuqori', 'Yuk (load data) noto‘g‘ri kiritilgan', 'Nuqtalar orasida keskin orientatsiya o‘zgarishi'],
      ru: ['Траектория проходит вблизи сингулярности', 'В программе слишком высокая скорость или ускорение', 'Неверно заданы данные нагрузки', 'Резкое изменение ориентации между точками'],
      en: ['The path passes close to a singularity', 'Speed or acceleration in the program is too high', 'Load data is entered incorrectly', 'Sharp orientation change between points']
    },
    checks: {
      uz: ['Xabardagi o‘q va dastur qatorini aniqlang', 'Shu harakatda tezlik va tezlanishni kamaytiring', 'Nuqta orientatsiyasini o‘zgartiring yoki PTP harakatdan foydalaning', 'Asbob va yuk ma’lumotlarini tekshiring'],
      ru: ['Определите ось и строку программы из сообщения', 'Уменьшите скорость и ускорение на этом движении', 'Измените ориентацию точки или используйте PTP-движение', 'Проверьте данные инструмента и нагрузки'],
      en: ['Identify the axis and program line from the message', 'Reduce speed and acceleration on that motion', 'Change the point orientation or use a PTP motion', 'Check tool and load data']
    },
    note: { uz: '', ru: '', en: '' }
  },

  // ───────────────────────── ABB ─────────────────────────
  {
    brand: 'ABB',
    code: '20010',
    controller: 'IRC5 / RobotWare 6',
    severity: 'high',
    title: {
      uz: 'Favqulodda to‘xtash holati: E-stop zanjiri uzilgan holda ishga tushirishga urinildi',
      ru: 'Состояние аварийного останова: попытка работы при разомкнутой цепи E-stop',
      en: 'Emergency stop state: an attempt to operate while the E-stop circuit was open'
    },
    causes: {
      uz: ['FlexPendant yoki shkafdagi E-stop tugmasi bosilgan', 'Tashqi E-stop zanjiri (PLC, xavfsizlik relesi) uzilgan', 'E-stop qayta tiklanmasdan Motors On bosilgan'],
      ru: ['Нажата кнопка E-stop на FlexPendant или шкафу', 'Разомкнута внешняя цепь E-stop (ПЛК, реле безопасности)', 'Нажата Motors On без сброса E-stop'],
      en: ['E-stop on the FlexPendant or cabinet is pressed', 'External E-stop chain (PLC, safety relay) is open', 'Motors On was pressed before the E-stop was reset']
    },
    checks: {
      uz: ['Xavf bartaraf etilganiga ishonch hosil qiling', 'Barcha E-stop tugmalarini qaytaring', 'Shkafdagi yoki pultdagi E-stop reset tugmasini bosing', 'Motors On tugmasini bosing', 'Takrorlansa, tashqi zanjirni malakali elektrik tekshirsin'],
      ru: ['Убедитесь, что опасность устранена', 'Разблокируйте все кнопки E-stop', 'Нажмите кнопку сброса E-stop на шкафу или панели', 'Нажмите Motors On', 'При повторении внешнюю цепь проверяет квалифицированный электрик'],
      en: ['Make sure the hazard is cleared', 'Release all E-stop buttons', 'Press the E-stop reset button on the cabinet or panel', 'Press Motors On', 'If it repeats, have a qualified electrician check the external chain']
    },
    note: {
      uz: 'E-stop zanjirini hech qachon aylanib o‘tmang.',
      ru: 'Никогда не шунтируйте цепь E-stop.',
      en: 'Never bypass the E-stop chain.'
    }
  },
  {
    brand: 'ABB',
    code: '20032',
    controller: 'IRC5 / RobotWare 6',
    severity: 'high',
    title: {
      uz: 'Aylanish hisoblagichi yangilanmagan: o‘q holati noma’lum',
      ru: 'Счётчик оборотов не обновлён: положение оси неизвестно',
      en: 'Revolution counter not updated: axis position is unknown'
    },
    causes: {
      uz: ['SMB batareyasi tugagan yoki almashtirilgan', 'SMB plata yoki rezolver kabeli uzilgan', 'Dvigatel yoki SMB almashtirilgan', 'Quvvat o‘chiq paytda o‘q qo‘lda siljitilgan'],
      ru: ['Разряжена или заменена батарея SMB', 'Отключались плата SMB или кабель резольвера', 'Заменён двигатель или SMB', 'Ось сдвигалась вручную при отключённом питании'],
      en: ['SMB battery was depleted or replaced', 'SMB board or resolver cable was disconnected', 'Motor or SMB was replaced', 'The axis was moved by hand while power was off']
    },
    checks: {
      uz: ['O‘qlarni qo‘lda kalibrlash belgilariga (sync marks) olib keling', 'Calibration menyusida Update Revolution Counters ni bajaring', 'Belgilar to‘g‘ri tushganini vizual tekshiring', 'Batareya past bo‘lsa, uni almashtiring (38213 ga qarang)'],
      ru: ['Подведите оси вручную к калибровочным меткам', 'В меню Calibration выполните Update Revolution Counters', 'Визуально проверьте совпадение меток', 'При низком заряде замените батарею (см. 38213)'],
      en: ['Jog each axis to its calibration (sync) marks', 'Run Update Revolution Counters in the Calibration menu', 'Visually check that the marks line up', 'If the battery is low, replace it (see 38213)']
    },
    note: {
      uz: 'Hisoblagich yangilanmaguncha robotni avtomatik rejimda ishlatmang; noto‘g‘ri yangilash to‘qnashuvga olib keladi.',
      ru: 'До обновления счётчиков не запускайте робот в автомате; неверное обновление ведёт к столкновению.',
      en: 'Do not run in auto until the counters are updated; a wrong update can cause a collision.'
    }
  },
  {
    brand: 'ABB',
    code: '20252',
    controller: 'IRC5 / RobotWare 6',
    severity: 'high',
    title: {
      uz: 'Dvigatel harorati yuqori: o‘q dvigateli qizib ketgan',
      ru: 'Высокая температура двигателя оси',
      en: 'Motor temperature high on a robot axis'
    },
    causes: {
      uz: ['Ish sikli juda og‘ir, o‘q uzluksiz yuqori yuklama ostida', 'Yuk ma’lumotlari noto‘g‘ri yoki ortiqcha yuk', 'Tormoz to‘liq ochilmayapti', 'Atrof-muhit harorati yuqori yoki dvigatel sovutilmayapti', 'Harorat datchigi (PTC) yoki kabel nosoz'],
      ru: ['Слишком тяжёлый цикл, ось постоянно под высокой нагрузкой', 'Неверные данные нагрузки или перегруз', 'Тормоз не растормаживается полностью', 'Высокая температура среды или нет охлаждения двигателя', 'Неисправен датчик температуры (PTC) или кабель'],
      en: ['Duty cycle too heavy, axis constantly under high load', 'Wrong load data or overload', 'Brake not fully releasing', 'High ambient temperature or poor motor cooling', 'Faulty temperature sensor (PTC) or cable']
    },
    checks: {
      uz: ['Robotni to‘xtatib, dvigatelni sovushga qo‘ying', 'Yuk ma’lumotlarini (loaddata) tekshiring', 'Dvigatel ustidagi chang va to‘siqlarni tozalang', 'Sikl tezligi yoki kutish vaqtlarini qayta ko‘rib chiqing', 'Sovuq dvigatelda ham xato chiqsa, datchik/kabelni muhandis tekshirsin'],
      ru: ['Остановите робот и дайте двигателю остыть', 'Проверьте данные нагрузки (loaddata)', 'Очистите двигатель от пыли и посторонних предметов', 'Пересмотрите скорость цикла и паузы', 'Если ошибка есть и на холодном двигателе, датчик/кабель проверяет инженер'],
      en: ['Stop the robot and let the motor cool', 'Check the load data (loaddata)', 'Clean dust and obstructions from the motor', 'Review cycle speed and dwell times', 'If it appears on a cold motor, have the engineer check the sensor/cable']
    },
    note: {
      uz: 'Dvigatel yuzasi juda issiq bo‘lishi mumkin; qo‘lqopsiz tegmang.',
      ru: 'Поверхность двигателя может быть очень горячей; не касайтесь без перчаток.',
      en: 'The motor surface can be very hot; do not touch without gloves.'
    }
  },
  {
    brand: 'ABB',
    code: '38103',
    controller: 'IRC5 / RobotWare 6',
    severity: 'critical',
    title: {
      uz: 'SMB bilan aloqa yo‘qoldi: o‘lchov platasi javob bermayapti',
      ru: 'Потеряна связь с SMB (платой последовательных измерений)',
      en: 'Lost communication with SMB (serial measurement board)'
    },
    causes: {
      uz: ['Shkaf va robot orasidagi SMB kabeli shikastlangan yoki ulanmagan', 'Ulagichlarda bo‘shash yoki oksidlanish', 'SMB plata nosoz', 'Kabel boshqa elektr shovqin manbaiga yaqin o‘tkazilgan'],
      ru: ['Повреждён или не подключён кабель SMB между шкафом и роботом', 'Ослабление или окисление разъёмов', 'Неисправна плата SMB', 'Кабель проложен рядом с источником помех'],
      en: ['SMB cable between cabinet and robot is damaged or unplugged', 'Loose or corroded connectors', 'Faulty SMB board', 'Cable routed next to an electrical noise source']
    },
    checks: {
      uz: ['Quvvatni o‘chirib, SMB kabelini ikkala uchida tekshiring', 'Ulagichlarni ajratib, qayta mahkam ulang', 'Kabelni ezilish va sinish joylari bo‘yicha ko‘zdan kechiring', 'Kontrollerni qayta yoqing', 'Xato qolsa, SMB plata yoki kabelni almashtirish uchun muhandisni chaqiring'],
      ru: ['Отключите питание и проверьте кабель SMB с обеих сторон', 'Разъедините и плотно соедините разъёмы', 'Осмотрите кабель на пережатия и изломы', 'Перезапустите контроллер', 'Если ошибка остаётся, вызовите инженера для замены платы SMB или кабеля'],
      en: ['Power off and check the SMB cable at both ends', 'Unplug and firmly reseat the connectors', 'Inspect the cable for crushing and kinks', 'Restart the controller', 'If it persists, call the engineer to replace the SMB board or cable']
    },
    note: {
      uz: 'SMB platani almashtirgandan keyin 50296 va hisoblagichlarni yangilash talab qilinadi.',
      ru: 'После замены SMB потребуется обработать 50296 и обновить счётчики оборотов.',
      en: 'After an SMB replacement, expect 50296 and a revolution counter update.'
    }
  },
  {
    brand: 'ABB',
    code: '38213',
    controller: 'IRC5 / RobotWare 6',
    severity: 'normal',
    title: {
      uz: 'Batareya zaryadi past: SMB xotira batareyasini almashtirish kerak',
      ru: 'Низкий заряд батареи SMB: требуется замена',
      en: 'Battery charge low: the SMB backup battery needs replacing'
    },
    causes: {
      uz: ['SMB batareyasining xizmat muddati tugagan', 'Robot uzoq vaqt quvvatsiz turgan', 'Batareya ulagichi bo‘shagan'],
      ru: ['Истёк срок службы батареи SMB', 'Робот долго стоял без питания', 'Ослаб разъём батареи'],
      en: ['SMB battery has reached end of life', 'The robot was left unpowered for a long time', 'Battery connector is loose']
    },
    checks: {
      uz: ['Mos ABB batareyasini oldindan tayyorlang', 'Batareyani robot qo‘llanmasidagi tartibda almashtiring', 'Almashtirishdan oldin o‘qlar holatini yozib qo‘ying', 'Kerak bo‘lsa, aylanish hisoblagichlarini yangilang'],
      ru: ['Заранее подготовьте подходящую батарею ABB', 'Замените батарею по процедуре из руководства робота', 'Перед заменой запишите положение осей', 'При необходимости обновите счётчики оборотов'],
      en: ['Have the correct ABB battery ready', 'Replace the battery following the robot manual procedure', 'Note the axis positions before replacing', 'Update the revolution counters if required']
    },
    note: {
      uz: 'Batareyani tez almashtiring: u to‘liq tugasa, quvvat o‘chganda o‘q holatlari yo‘qoladi.',
      ru: 'Замените батарею вовремя: при полном разряде и отключении питания положение осей теряется.',
      en: 'Replace it soon: if it runs flat while power is off, axis positions are lost.'
    }
  },
  {
    brand: 'ABB',
    code: '50024',
    controller: 'IRC5 / RobotWare 6',
    severity: 'normal',
    title: {
      uz: 'Burchak yo‘li xatosi: zona nuqtasi to‘xtash nuqtasiga aylandi',
      ru: 'Ошибка углового пути: зонная точка выполнена как точка останова',
      en: 'Corner path failure: a zone point was executed as a stop point'
    },
    causes: {
      uz: ['Harakatlar orasida uzoq bajariladigan buyruqlar (WaitTime, WaitDI, hisoblash)', 'Keyingi harakat buyrug‘i vaqtida tayyor bo‘lmagan', 'Dastur oqimi tashqi signalni kutmoqda'],
      ru: ['Между движениями долгие инструкции (WaitTime, WaitDI, вычисления)', 'Следующая инструкция движения не готова вовремя', 'Программа ожидает внешний сигнал'],
      en: ['Time-consuming instructions between moves (WaitTime, WaitDI, calculations)', 'The next move instruction was not ready in time', 'Program flow is waiting for an external signal']
    },
    checks: {
      uz: ['Xabardagi dastur qatorini toping', 'Kutish buyrug‘idan oldingi harakatda zona o‘rniga fine ishlating', 'Hisoblashlarni harakatdan oldinroqqa ko‘chiring', 'Sikl vaqtini tekshiring'],
      ru: ['Найдите строку программы из сообщения', 'Перед инструкцией ожидания используйте fine вместо зоны', 'Перенесите вычисления до начала движения', 'Проверьте время цикла'],
      en: ['Find the program line named in the message', 'Use fine instead of a zone on the move before a wait', 'Move calculations earlier, before the motion', 'Check cycle time']
    },
    note: { uz: '', ru: '', en: '' }
  },
  {
    brand: 'ABB',
    code: '50026',
    controller: 'IRC5 / RobotWare 6',
    severity: 'normal',
    title: {
      uz: 'Singulyarlikka yaqin: robot o‘qlari singulyar holatga yaqinlashdi',
      ru: 'Близко к сингулярности: робот подходит к сингулярному положению',
      en: 'Close to singularity: the robot is near a singular configuration'
    },
    causes: {
      uz: ['4 va 6 o‘qlar bir chiziqda (5-o‘q nolga yaqin)', 'Bilak markazi 1-o‘q ustida', 'Chiziqli harakat singulyarlik orqali o‘tadi'],
      ru: ['Оси 4 и 6 на одной линии (ось 5 около нуля)', 'Центр кисти над осью 1', 'Линейное движение проходит через сингулярность'],
      en: ['Axes 4 and 6 are aligned (axis 5 near zero)', 'Wrist centre is above axis 1', 'A linear move passes through a singularity']
    },
    checks: {
      uz: ['Muammoli harakatni MoveJ ga almashtiring', 'Nuqtani 5-o‘q noldan uzoqroq bo‘ladigan qilib qayta o‘rgating', 'SingArea \\Wrist dan foydalanishni ko‘rib chiqing', 'Asbob orientatsiyasini biroz o‘zgartiring'],
      ru: ['Замените проблемное движение на MoveJ', 'Переобучите точку так, чтобы ось 5 была дальше от нуля', 'Рассмотрите применение SingArea \\Wrist', 'Немного измените ориентацию инструмента'],
      en: ['Change the problem move to MoveJ', 'Reteach the point so axis 5 is further from zero', 'Consider using SingArea \\Wrist', 'Slightly change the tool orientation']
    },
    note: { uz: '', ru: '', en: '' }
  },
  {
    brand: 'ABB',
    code: '50028',
    controller: 'IRC5 / RobotWare 6',
    severity: 'normal',
    title: {
      uz: 'Noto‘g‘ri yo‘nalishda jog: robot ish diapazonidan tashqarida',
      ru: 'Перемещение в неверном направлении: робот вне рабочего диапазона',
      en: 'Jog in wrong direction: the robot is outside its working range'
    },
    causes: {
      uz: ['O‘q dasturiy chegaradan tashqariga chiqqan', 'Jog ish diapazonidan uzoqlashadigan yo‘nalishda bajarilmoqda', 'Hisoblagich yoki kalibrlash xatosi'],
      ru: ['Ось вышла за программный предел', 'Перемещение выполняется от рабочего диапазона', 'Ошибка счётчика оборотов или калибровки'],
      en: ['The axis is beyond its software limit', 'Jogging is directed away from the working range', 'Revolution counter or calibration error']
    },
    checks: {
      uz: ['O‘qni ish diapazoni tomon, ya’ni qarama-qarshi yo‘nalishda jog qiling', 'Axis rejimida bitta o‘qni harakatlantiring', 'O‘q holatini kalibrlash belgilari bilan solishtiring'],
      ru: ['Перемещайте ось в сторону рабочего диапазона, то есть в обратном направлении', 'Двигайте одну ось в режиме Axis', 'Сравните положение оси с калибровочными метками'],
      en: ['Jog the axis back toward the working range (opposite direction)', 'Move one axis at a time in Axis mode', 'Compare the axis position with the calibration marks']
    },
    note: { uz: '', ru: '', en: '' }
  },
  {
    brand: 'ABB',
    code: '50050',
    controller: 'IRC5 / RobotWare 6',
    severity: 'normal',
    title: {
      uz: 'Nuqta yetib bo‘lmaydigan joyda: pozitsiya robot qamrovidan tashqarida',
      ru: 'Позиция вне досягаемости робота',
      en: 'Position outside reach of the robot'
    },
    causes: {
      uz: ['Nuqta robot yetadigan masofadan uzoqda', 'Wobj yoki tooldata noto‘g‘ri', 'Offs/RelTool bilan hisoblangan nuqta juda uzoq', 'Robot konfiguratsiyasi (confdata) mos emas'],
      ru: ['Точка дальше зоны досягаемости', 'Неверные wobj или tooldata', 'Точка, рассчитанная через Offs/RelTool, слишком далеко', 'Неподходящая конфигурация (confdata)'],
      en: ['The point is beyond the robot reach', 'Wrong wobj or tooldata', 'Point calculated with Offs/RelTool is too far', 'Unsuitable robot configuration (confdata)']
    },
    checks: {
      uz: ['Xabardagi qatordagi nuqta va ish obyektini tekshiring', 'Wobj va tooldata qiymatlarini tasdiqlang', 'Offset qiymatlarini kamaytiring', 'Nuqtani qayta o‘rgating'],
      ru: ['Проверьте точку и рабочий объект в строке из сообщения', 'Проверьте значения wobj и tooldata', 'Уменьшите смещения', 'Переобучите точку'],
      en: ['Check the point and work object on the line named in the message', 'Verify wobj and tooldata values', 'Reduce offset values', 'Reteach the point']
    },
    note: { uz: '', ru: '', en: '' }
  },
  {
    brand: 'ABB',
    code: '50052',
    controller: 'IRC5 / RobotWare 6',
    severity: 'high',
    title: {
      uz: 'O‘q tezligi xatosi: haqiqiy tezlik buyurilganidan juda farq qiladi',
      ru: 'Ошибка скорости оси: фактическая скорость сильно отличается от заданной',
      en: 'Joint speed error: actual speed differs too much from the ordered speed'
    },
    causes: {
      uz: ['Yuk ma’lumotlari noto‘g‘ri yoki ortiqcha yuk', 'Tashqi kuch yoki to‘qnashuv', 'Tormoz to‘liq ochilmayapti', 'Drayv yoki dvigatel nosoz'],
      ru: ['Неверные данные нагрузки или перегруз', 'Внешнее усилие или столкновение', 'Тормоз не растормаживается полностью', 'Неисправен привод или двигатель'],
      en: ['Wrong load data or overload', 'External force or collision', 'Brake not fully releasing', 'Faulty drive unit or motor']
    },
    checks: {
      uz: ['To‘qnashuv yoki tiqilib qolish bormi, tekshiring', 'Loaddata ni tekshiring', 'Tezlikni kamaytirib, takrorlanishini kuzating', 'Takrorlansa, drayv va tormozni muhandis tekshirsin'],
      ru: ['Проверьте, нет ли столкновения или заклинивания', 'Проверьте loaddata', 'Снизьте скорость и проследите, повторяется ли ошибка', 'При повторении привод и тормоз проверяет инженер'],
      en: ['Check for a collision or jam', 'Check loaddata', 'Reduce speed and see if it repeats', 'If it repeats, have the engineer check the drive and brake']
    },
    note: { uz: '', ru: '', en: '' }
  },
  {
    brand: 'ABB',
    code: '50053',
    controller: 'IRC5 / RobotWare 6',
    severity: 'critical',
    title: {
      uz: 'Aylanish hisoblagichi farqi juda katta: o‘q holati ishonchsiz',
      ru: 'Слишком большая разница счётчика оборотов: положение оси недостоверно',
      en: 'Revolution counter difference too large: axis position is unreliable'
    },
    causes: {
      uz: ['Quvvat o‘chiq paytda o‘q siljigan (tormoz qo‘lda ochilgan)', 'SMB yoki rezolver nosoz', 'Dvigatel yoki reduktor almashtirilgan', 'Batareya tugagan'],
      ru: ['Ось сдвигалась при отключённом питании (ручное растормаживание)', 'Неисправны SMB или резольвер', 'Заменён двигатель или редуктор', 'Разряжена батарея'],
      en: ['The axis moved while power was off (manual brake release)', 'Faulty SMB or resolver', 'Motor or gearbox was replaced', 'Battery depleted']
    },
    checks: {
      uz: ['Robotni avtomatik rejimda ishlatmang', 'O‘qlarni kalibrlash belgilariga sekin olib keling va moslikni tekshiring', 'Hisoblagichlarni yangilang', 'Belgilar mos kelmasa yoki xato takrorlansa, muhandisni chaqiring'],
      ru: ['Не запускайте робот в автоматическом режиме', 'Медленно подведите оси к калибровочным меткам и проверьте совпадение', 'Обновите счётчики оборотов', 'Если метки не совпадают или ошибка повторяется, вызовите инженера'],
      en: ['Do not run the robot in automatic mode', 'Slowly jog axes to the calibration marks and check alignment', 'Update the revolution counters', 'If marks do not match or it repeats, call the engineer']
    },
    note: {
      uz: 'Noto‘g‘ri holat bilan ishlash to‘qnashuvga olib keladi; dvigatel almashtirilgan bo‘lsa, to‘liq kalibrlash kerak.',
      ru: 'Работа с неверным положением ведёт к столкновению; после замены двигателя нужна полная калибровка.',
      en: 'Running with a wrong position causes collisions; after a motor change a full calibration is needed.'
    }
  },
  {
    brand: 'ABB',
    code: '50056',
    controller: 'IRC5 / RobotWare 6',
    severity: 'high',
    title: {
      uz: 'O‘q to‘qnashuvi: haqiqiy moment buyurilganidan ancha yuqori',
      ru: 'Столкновение оси: фактический момент значительно выше заданного',
      en: 'Joint collision: actual torque is much higher than ordered'
    },
    causes: {
      uz: ['Robot yoki asbob to‘siqqa urilgan', 'Yuk ma’lumotlari noto‘g‘ri', 'Mexanik tiqilish yoki reduktor nosozligi', 'Tormoz ochilmayapti'],
      ru: ['Робот или инструмент ударился о препятствие', 'Неверные данные нагрузки', 'Механическое заклинивание или неисправность редуктора', 'Тормоз не растормаживается'],
      en: ['Robot or tool hit an obstacle', 'Wrong load data', 'Mechanical jam or gearbox fault', 'Brake not releasing']
    },
    checks: {
      uz: ['Robot va asbobni shikast bo‘yicha ko‘zdan kechiring', 'To‘siqni olib tashlang, robotni sekin uzoqlashtiring', 'Loaddata ni tekshiring', 'TCP o‘zgarmaganini tekshiring', 'Urilishdan keyin g‘ayritabiiy shovqin bo‘lsa, muhandisni chaqiring'],
      ru: ['Осмотрите робот и инструмент на повреждения', 'Уберите препятствие и медленно отведите робот', 'Проверьте loaddata', 'Проверьте, не сместилась ли TCP', 'При посторонних шумах после удара вызовите инженера'],
      en: ['Inspect robot and tool for damage', 'Remove the obstacle and slowly jog away', 'Check loaddata', 'Check that the TCP has not shifted', 'If there is unusual noise after the impact, call the engineer']
    },
    note: { uz: '', ru: '', en: '' }
  },
  {
    brand: 'ABB',
    code: '50204',
    controller: 'IRC5 / RobotWare 6',
    severity: 'high',
    title: {
      uz: 'Harakat nazorati ishga tushdi: ehtimoliy to‘qnashuv aniqlandi',
      ru: 'Сработал контроль движения (Motion Supervision): вероятное столкновение',
      en: 'Motion supervision triggered: a possible collision was detected'
    },
    causes: {
      uz: ['Robot yoki asbob to‘qnashgan', 'Yuk yoki asbob ma’lumotlari noto‘g‘ri', 'Kabel yoki shlang robotni tortmoqda', 'Nazorat sezgirligi juda yuqori sozlangan'],
      ru: ['Робот или инструмент столкнулся', 'Неверные данные нагрузки или инструмента', 'Кабель или шланг тянет робот', 'Слишком высокая чувствительность контроля'],
      en: ['Robot or tool collided', 'Wrong load or tool data', 'Cable or hose is pulling on the robot', 'Supervision sensitivity set too high']
    },
    checks: {
      uz: ['Hujayrani ko‘zdan kechirib, to‘qnashuv izlarini qidiring', 'Xabarni tasdiqlang va robotni to‘qnashuv nuqtasidan sekin uzoqlashtiring', 'Tooldata va loaddata ni tekshiring (LoadIdentify)', 'Shlang va kabellar erkin harakatlanishini tekshiring', 'Sezgirlikni o‘zgartirishni faqat muhandis bajarsin'],
      ru: ['Осмотрите ячейку и найдите следы столкновения', 'Квитируйте сообщение и медленно отведите робот от точки столкновения', 'Проверьте tooldata и loaddata (LoadIdentify)', 'Проверьте свободный ход шлангов и кабелей', 'Изменение чувствительности поручите инженеру'],
      en: ['Inspect the cell for signs of collision', 'Acknowledge and slowly jog the robot away from the contact point', 'Check tooldata and loaddata (LoadIdentify)', 'Check hoses and cables move freely', 'Leave sensitivity changes to the engineer']
    },
    note: {
      uz: 'Motion Supervision ni o‘chirib qo‘yish muammoni yashiradi va robotga zarar yetkazishi mumkin.',
      ru: 'Отключение Motion Supervision скрывает проблему и может повредить робот.',
      en: 'Turning Motion Supervision off hides the problem and can damage the robot.'
    }
  },
  {
    brand: 'ABB',
    code: '50296',
    controller: 'IRC5 / RobotWare 6',
    severity: 'high',
    title: {
      uz: 'SMB xotira ma’lumotlari farqli: robot va shkafdagi ma’lumotlar mos emas',
      ru: 'Различие данных памяти SMB: данные робота и шкафа не совпадают',
      en: 'SMB memory data difference: robot and cabinet data do not match'
    },
    causes: {
      uz: ['SMB plata almashtirilgan', 'Kontroller yoki robot almashtirilgan', 'Boshqa robotdan zaxira nusxa yuklangan'],
      ru: ['Заменена плата SMB', 'Заменён контроллер или робот', 'Загружена резервная копия с другого робота'],
      en: ['SMB board was replaced', 'Controller or robot was replaced', 'A backup from another robot was loaded']
    },
    checks: {
      uz: ['Nima almashtirilganini aniqlang', 'Calibration > SMB Memory menyusini oching', 'Agar SMB yangi bo‘lsa, ma’lumotni shkafdan SMB ga yozing; aks holda SMB dan shkafga', 'Robot seriya raqami to‘g‘riligini tekshiring', 'Shubha bo‘lsa, muhandisga murojaat qiling'],
      ru: ['Выясните, что было заменено', 'Откройте меню Calibration > SMB Memory', 'Если SMB новая, перенесите данные из шкафа в SMB; иначе из SMB в шкаф', 'Проверьте серийный номер робота', 'При сомнениях обратитесь к инженеру'],
      en: ['Find out what was replaced', 'Open Calibration > SMB Memory', 'If the SMB is new, transfer data cabinet to SMB; otherwise SMB to cabinet', 'Verify the robot serial number', 'If unsure, ask the engineer']
    },
    note: {
      uz: 'Noto‘g‘ri yo‘nalishda yozish kalibrlash ma’lumotlarini o‘chirib yuboradi.',
      ru: 'Перенос в неверном направлении затирает калибровочные данные.',
      en: 'Transferring in the wrong direction overwrites calibration data.'
    }
  },

  // ───────────────────────── FANUC ─────────────────────────
  {
    brand: 'FANUC',
    code: 'SRVO-001',
    controller: 'R-30iA / R-30iB',
    severity: 'high',
    title: {
      uz: 'Operator paneli E-stop: kontroller panelidagi favqulodda to‘xtash bosilgan',
      ru: 'Аварийный останов с панели оператора контроллера',
      en: 'Operator panel E-stop is pressed on the controller'
    },
    causes: {
      uz: ['Kontroller eshigidagi E-stop tugmasi bosilgan', 'Tugma kontakti yoki simi nosoz', 'Panel plata ulagichi bo‘shagan'],
      ru: ['Нажата кнопка E-stop на двери контроллера', 'Неисправен контакт или провод кнопки', 'Ослаб разъём платы панели'],
      en: ['E-stop button on the controller door is pressed', 'Faulty button contact or wire', 'Loose panel board connector']
    },
    checks: {
      uz: ['Xavf bartaraf etilganini tekshiring', 'E-stop tugmasini burab qaytaring', 'RESET tugmasini bosing', 'Takrorlansa, tugma va simlarni muhandis tekshirsin'],
      ru: ['Убедитесь, что опасность устранена', 'Разблокируйте кнопку E-stop поворотом', 'Нажмите RESET', 'При повторении кнопку и проводку проверяет инженер'],
      en: ['Make sure the hazard is cleared', 'Release the E-stop button by turning it', 'Press RESET', 'If it repeats, have the engineer check the button and wiring']
    },
    note: {
      uz: 'E-stop zanjirini perimichka bilan aylanib o‘tmang.',
      ru: 'Не шунтируйте цепь E-stop перемычками.',
      en: 'Never jumper the E-stop circuit.'
    }
  },
  {
    brand: 'FANUC',
    code: 'SRVO-002',
    controller: 'R-30iA / R-30iB',
    severity: 'high',
    title: {
      uz: 'Teach pendant E-stop: o‘qitish pultidagi favqulodda to‘xtash bosilgan',
      ru: 'Аварийный останов с пульта обучения (Teach Pendant)',
      en: 'Teach pendant E-stop is pressed'
    },
    causes: {
      uz: ['Teach pendant dagi E-stop tugmasi bosilgan', 'Pendant kabeli shikastlangan', 'Pendant ulagichi bo‘shagan'],
      ru: ['Нажата кнопка E-stop на пульте', 'Повреждён кабель пульта', 'Ослаб разъём пульта'],
      en: ['E-stop on the teach pendant is pressed', 'Pendant cable is damaged', 'Pendant connector is loose']
    },
    checks: {
      uz: ['E-stop tugmasini burab qaytaring', 'RESET tugmasini bosing', 'Pendant kabelini sinish va ezilish bo‘yicha tekshiring', 'Ulagichni mahkamlang (quvvat o‘chiq holda)'],
      ru: ['Разблокируйте кнопку E-stop поворотом', 'Нажмите RESET', 'Осмотрите кабель пульта на изломы и пережатия', 'Подтяните разъём (при выключенном питании)'],
      en: ['Release the E-stop by turning it', 'Press RESET', 'Inspect the pendant cable for kinks and crush damage', 'Reseat the connector (with power off)']
    },
    note: {
      uz: 'Kabel shikastlangan bo‘lsa, pendantni almashtiring; E-stop ni aylanib o‘tmang.',
      ru: 'При повреждении кабеля замените пульт; не шунтируйте E-stop.',
      en: 'Replace a pendant with a damaged cable; never bypass the E-stop.'
    }
  },
  {
    brand: 'FANUC',
    code: 'SRVO-003',
    controller: 'R-30iA / R-30iB',
    severity: 'normal',
    title: {
      uz: 'Deadman kaliti qo‘yib yuborildi: pendant yoqilgan, ruxsat tugmasi bosilmagan',
      ru: 'Отпущен переключатель разрешения (Deadman) при включённом пульте',
      en: 'Deadman switch released while the teach pendant is enabled'
    },
    causes: {
      uz: ['Pendant ON holatida deadman tugmasi qo‘yib yuborilgan', 'Deadman tugmasi juda qattiq bosilgan (3-holat)', 'Deadman kaliti nosoz'],
      ru: ['При включённом пульте отпущена кнопка Deadman', 'Кнопка Deadman нажата слишком сильно (3-е положение)', 'Неисправен переключатель Deadman'],
      en: ['Deadman was released with the pendant switched ON', 'Deadman was squeezed too hard (third position)', 'Faulty deadman switch']
    },
    checks: {
      uz: ['Deadman tugmasini o‘rta holatda ushlab turing', 'RESET ni bosing', 'Avtomatik ishlash uchun pendant kalitini OFF ga o‘tkazing', 'Kalit nosoz bo‘lsa, pendantni almashtirish uchun muhandisni chaqiring'],
      ru: ['Удерживайте кнопку Deadman в среднем положении', 'Нажмите RESET', 'Для автоматической работы переведите пульт в OFF', 'При неисправности переключателя вызовите инженера для замены пульта'],
      en: ['Hold the deadman in its middle position', 'Press RESET', 'For automatic running, turn the pendant switch OFF', 'If the switch is faulty, call the engineer to replace the pendant']
    },
    note: {
      uz: 'Deadman tugmasini lenta yoki qisqich bilan bosib qo‘yish taqiqlanadi.',
      ru: 'Фиксировать кнопку Deadman лентой или зажимом запрещено.',
      en: 'Never tape or clamp the deadman switch.'
    }
  },
  {
    brand: 'FANUC',
    code: 'SRVO-004',
    controller: 'R-30iA / R-30iB',
    severity: 'normal',
    title: {
      uz: 'To‘siq ochiq: avtomatik rejimda himoya eshigi (FENCE) zanjiri uzildi',
      ru: 'Ограждение открыто: разомкнута цепь двери (FENCE) в автоматическом режиме',
      en: 'Fence open: the safety fence (FENCE) circuit opened in automatic mode'
    },
    causes: {
      uz: ['Himoya eshigi ochilgan', 'Eshik kaliti siljigan yoki nosoz', 'FENCE zanjiri simi uzilgan'],
      ru: ['Открыта защитная дверь', 'Смещён или неисправен выключатель двери', 'Обрыв провода цепи FENCE'],
      en: ['Safety door was opened', 'Door switch misaligned or faulty', 'Broken wire in the FENCE circuit']
    },
    checks: {
      uz: ['Hujayrada odam yo‘qligini tekshiring', 'Eshikni yoping va kalit ishlaganini tekshiring', 'RESET ni bosing', 'Zanjir nosoz bo‘lsa, muhandisni chaqiring'],
      ru: ['Убедитесь, что в ячейке нет людей', 'Закройте дверь и проверьте срабатывание выключателя', 'Нажмите RESET', 'При неисправности цепи вызовите инженера'],
      en: ['Check nobody is inside the cell', 'Close the door and check the switch actuates', 'Press RESET', 'If the circuit is faulty, call the engineer']
    },
    note: {
      uz: 'FENCE terminallariga perimichka qo‘yish qat’iyan man etiladi.',
      ru: 'Установка перемычки на клеммы FENCE строго запрещена.',
      en: 'Jumpering the FENCE terminals is strictly forbidden.'
    }
  },
  {
    brand: 'FANUC',
    code: 'SRVO-005',
    controller: 'R-30iA / R-30iB',
    severity: 'high',
    title: {
      uz: 'Robot overtravel: o‘q mexanik chegara kalitini bosdi',
      ru: 'Перебег робота: ось нажала аппаратный конечный выключатель',
      en: 'Robot overtravel: an axis hit its hardware limit switch'
    },
    causes: {
      uz: ['O‘q dasturiy chegaradan o‘tib, chegara kalitiga yetgan', 'Kalibrlash (mastering) yo‘qolgan yoki noto‘g‘ri', 'Chegara kaliti yoki simi nosoz'],
      ru: ['Ось прошла программный предел и достигла выключателя', 'Потеряна или неверна юстировка (mastering)', 'Неисправен выключатель или его проводка'],
      en: ['The axis passed its software limit and reached the switch', 'Mastering lost or incorrect', 'Faulty limit switch or wiring']
    },
    checks: {
      uz: ['SYSTEM > OT Release ekranida tegishli o‘qni tanlang', 'Deadman ni ushlab, SHIFT+RESET bilan o‘qni chegaradan sekin olib chiqing', 'Mastering to‘g‘riligini tekshiring', 'Sabab aniq bo‘lmasa, muhandisni chaqiring'],
      ru: ['На экране SYSTEM > OT Release выберите нужную ось', 'Удерживая Deadman, с SHIFT+RESET медленно выведите ось из предела', 'Проверьте правильность mastering', 'Если причина неясна, вызовите инженера'],
      en: ['On SYSTEM > OT Release, select the axis', 'Holding the deadman, use SHIFT+RESET and slowly jog the axis off the limit', 'Check that mastering is correct', 'If the cause is unclear, call the engineer']
    },
    note: {
      uz: 'OT Release faqat o‘qni chegaradan chiqarish uchun; ishdan keyin oddiy holatga qaytaring.',
      ru: 'OT Release только для вывода оси из предела; затем верните обычный режим.',
      en: 'OT Release is only for jogging off the limit; return to normal right after.'
    }
  },
  {
    brand: 'FANUC',
    code: 'SRVO-007',
    controller: 'R-30iA / R-30iB',
    severity: 'high',
    title: {
      uz: 'Tashqi favqulodda to‘xtash: EES (external E-stop) zanjiri uzilgan',
      ru: 'Внешний аварийный останов: разомкнута цепь внешнего E-stop',
      en: 'External emergency stop: the external E-stop circuit is open'
    },
    causes: {
      uz: ['Tashqi E-stop tugmasi bosilgan', 'PLC yoki xavfsizlik relesi zanjirni uzgan', 'Terminal simi bo‘shagan yoki uzilgan'],
      ru: ['Нажата внешняя кнопка E-stop', 'ПЛК или реле безопасности разомкнули цепь', 'Ослаб или оборван провод на клеммах'],
      en: ['An external E-stop button is pressed', 'The PLC or safety relay opened the circuit', 'Loose or broken terminal wire']
    },
    checks: {
      uz: ['Barcha tashqi E-stop tugmalarini tekshirib, qaytaring', 'Xavfsizlik relesi va PLC holatini tekshiring', 'RESET ni bosing', 'Simlarni faqat malakali elektrik quvvat o‘chiq holda tekshirsin'],
      ru: ['Проверьте и разблокируйте все внешние кнопки E-stop', 'Проверьте состояние реле безопасности и ПЛК', 'Нажмите RESET', 'Проводку проверяет только квалифицированный электрик при отключённом питании'],
      en: ['Check and release all external E-stop buttons', 'Check the safety relay and PLC status', 'Press RESET', 'Only a qualified electrician should check wiring, with power off']
    },
    note: {
      uz: 'Tashqi E-stop terminallariga perimichka qo‘ymang.',
      ru: 'Не ставьте перемычки на клеммы внешнего E-stop.',
      en: 'Never jumper the external E-stop terminals.'
    }
  },
  {
    brand: 'FANUC',
    code: 'SRVO-023',
    controller: 'R-30iA / R-30iB',
    severity: 'high',
    title: {
      uz: 'To‘xtashdagi xato oshib ketdi: to‘xtagan o‘qda pozitsiya xatosi katta',
      ru: 'Превышена ошибка останова: большое рассогласование на остановленной оси',
      en: 'Stop error excess: position error too large on a stopped axis'
    },
    causes: {
      uz: ['Yuk og‘irligi yoki payload sozlamasi noto‘g‘ri', 'Tormoz ochilmayapti yoki nosoz', 'Dvigatel kabeli yoki faza uzilishi', 'Servo kuchaytirgich nosoz', 'Tashqi kuch o‘qni bosmoqda'],
      ru: ['Неверный вес груза или настройка payload', 'Тормоз не отпускается или неисправен', 'Обрыв фазы или кабеля двигателя', 'Неисправен сервоусилитель', 'Внешнее усилие давит на ось'],
      en: ['Wrong payload weight or payload setting', 'Brake not releasing or faulty', 'Motor cable or phase open', 'Faulty servo amplifier', 'External force pushing on the axis']
    },
    checks: {
      uz: ['Qaysi o‘q ekanini aniqlang (G:x A:x)', 'Payload sozlamalarini tekshiring', 'O‘q to‘siqqa tiralmaganini tekshiring', 'Tormoz ochilish ovozini eshiting', 'Kabellar va kuchaytirgichni muhandis tekshirsin'],
      ru: ['Определите ось (G:x A:x)', 'Проверьте настройки payload', 'Проверьте, не упирается ли ось в препятствие', 'Прислушайтесь, щёлкает ли тормоз при растормаживании', 'Кабели и усилитель проверяет инженер'],
      en: ['Identify the axis (G:x A:x)', 'Check payload settings', 'Check the axis is not pushing against something', 'Listen for the brake click on release', 'Have the engineer check cables and the amplifier']
    },
    note: {
      uz: 'Servo kuchaytirgich ichida DC shina kondensatorlari xavfli kuchlanishni saqlaydi; ochishni muhandisga topshiring.',
      ru: 'В сервоусилителе конденсаторы звена постоянного тока хранят опасное напряжение; вскрытие только инженеру.',
      en: 'The servo amplifier DC bus capacitors stay charged; leave opening it to the engineer.'
    }
  },
  {
    brand: 'FANUC',
    code: 'SRVO-038',
    controller: 'R-30iA / R-30iB',
    severity: 'high',
    title: {
      uz: 'Impuls mos kelmasligi: pulsecoder qiymati saqlangan holatdan farq qiladi',
      ru: 'Несоответствие импульсов: значение энкодера отличается от сохранённого',
      en: 'Pulse mismatch: pulsecoder count differs from the stored position'
    },
    causes: {
      uz: ['Quvvat o‘chiq paytda o‘q siljigan (tormoz ochilgan)', 'Dvigatel yoki pulsecoder almashtirilgan', 'Pulsecoder kabeli nosoz', 'Batareya kuchlanishi pasaygan'],
      ru: ['Ось сдвигалась при выключенном питании (растормаживание)', 'Заменён двигатель или энкодер', 'Неисправен кабель энкодера', 'Снижено напряжение батареи'],
      en: ['The axis moved while powered off (brake released)', 'Motor or pulsecoder was replaced', 'Faulty pulsecoder cable', 'Low battery voltage']
    },
    checks: {
      uz: ['Robotni avtomatik rejimda ishlatmang', 'SYSTEM > Master/Cal ekranida pulse coder ni reset qiling', 'O‘qlarni nol belgilariga olib borib, holatni tekshiring', 'Kerak bo‘lsa, qayta mastering bajaring yoki muhandisni chaqiring'],
      ru: ['Не запускайте робот в автоматическом режиме', 'На экране SYSTEM > Master/Cal сбросьте энкодер', 'Подведите оси к нулевым меткам и проверьте положение', 'При необходимости выполните mastering или вызовите инженера'],
      en: ['Do not run the robot in auto', 'Reset the pulse coder on SYSTEM > Master/Cal', 'Jog axes to the zero marks and check the position', 'Remaster if needed, or call the engineer']
    },
    note: {
      uz: 'Noto‘g‘ri mastering bilan ishlash to‘qnashuvga olib keladi.',
      ru: 'Работа с неверной юстировкой приводит к столкновениям.',
      en: 'Running with wrong mastering causes collisions.'
    }
  },
  {
    brand: 'FANUC',
    code: 'SRVO-046',
    controller: 'R-30iA / R-30iB',
    severity: 'high',
    title: {
      uz: 'OVC signali: dvigatel tokining o‘rtacha qiymati (issiqlik) oshib ketdi',
      ru: 'Сигнал OVC: превышен среднеквадратичный ток двигателя (перегрев)',
      en: 'OVC alarm: motor RMS current (thermal) limit exceeded'
    },
    causes: {
      uz: ['Yuk ortiqcha yoki payload noto‘g‘ri', 'Tezlik/tezlanish juda yuqori, sikl og‘ir', 'Tormoz to‘liq ochilmayapti', 'Mexanik ishqalanish yoki reduktor nosozligi', 'Dvigatel yoki kuchaytirgich nosoz'],
      ru: ['Перегруз или неверный payload', 'Слишком высокие скорость/ускорение, тяжёлый цикл', 'Тормоз не отпускается полностью', 'Механическое трение или неисправность редуктора', 'Неисправен двигатель или усилитель'],
      en: ['Overload or wrong payload', 'Speed/acceleration too high, heavy cycle', 'Brake not fully released', 'Mechanical friction or gearbox fault', 'Faulty motor or amplifier']
    },
    checks: {
      uz: ['Robotni to‘xtatib, dvigatelni sovushga qo‘ying', 'Payload ni tekshiring', 'Dasturda tezlik va ACC qiymatlarini kamaytiring', 'O‘q harakatida g‘ayritabiiy shovqin bormi, kuzating', 'Takrorlansa, muhandisni chaqiring'],
      ru: ['Остановите робот и дайте двигателю остыть', 'Проверьте payload', 'Снизьте скорость и ACC в программе', 'Проверьте, нет ли посторонних шумов при движении оси', 'При повторении вызовите инженера'],
      en: ['Stop the robot and let the motor cool', 'Check the payload', 'Reduce speed and ACC in the program', 'Listen for unusual noise when the axis moves', 'If it repeats, call the engineer']
    },
    note: { uz: '', ru: '', en: '' }
  },
  {
    brand: 'FANUC',
    code: 'SRVO-050',
    controller: 'R-30iA / R-30iB',
    severity: 'high',
    title: {
      uz: 'To‘qnashuv aniqlandi (Collision Detect alarm): moment kutilganidan yuqori',
      ru: 'Обнаружено столкновение (Collision Detect): момент выше ожидаемого',
      en: 'Collision detect alarm: disturbance torque higher than expected'
    },
    causes: {
      uz: ['Robot yoki asbob to‘siqqa urilgan', 'Payload noto‘g‘ri kiritilgan', 'Kabel yoki shlang robotni tortmoqda', 'Tormoz to‘liq ochilmayapti'],
      ru: ['Робот или инструмент ударился о препятствие', 'Неверно задан payload', 'Кабель или шланг тянет робот', 'Тормоз не отпускается полностью'],
      en: ['Robot or tool hit an obstacle', 'Payload set incorrectly', 'Cable or hose pulling on the robot', 'Brake not fully released']
    },
    checks: {
      uz: ['Hujayrani ko‘zdan kechirib, to‘qnashuv sababini toping', 'RESET ni bosing va robotni T1 da sekin uzoqlashtiring', 'Asbob va TCP shikastlanmaganini tekshiring', 'Payload sozlamalarini tekshiring', 'Sezgirlikni o‘zgartirishni faqat muhandis bajarsin'],
      ru: ['Осмотрите ячейку и найдите причину столкновения', 'Нажмите RESET и медленно отведите робот в T1', 'Проверьте инструмент и TCP на повреждения', 'Проверьте настройки payload', 'Изменение чувствительности поручите инженеру'],
      en: ['Inspect the cell and find what was hit', 'Press RESET and slowly jog the robot away in T1', 'Check the tool and TCP for damage', 'Check payload settings', 'Leave sensitivity changes to the engineer']
    },
    note: {
      uz: 'To‘qnashuvni aniqlashni o‘chirib qo‘ymang; bu robot va asbobni himoya qiladi.',
      ru: 'Не отключайте обнаружение столкновений: оно защищает робот и инструмент.',
      en: 'Do not disable collision detection; it protects the robot and tool.'
    }
  },
  {
    brand: 'FANUC',
    code: 'SRVO-062',
    controller: 'R-30iA / R-30iB',
    severity: 'critical',
    title: {
      uz: 'BZAL signali: pulsecoder batareyasi tugagan, holat ma’lumoti yo‘qolgan',
      ru: 'Сигнал BZAL: батарея энкодера разряжена, данные положения потеряны',
      en: 'BZAL alarm: pulsecoder battery voltage zero, position data lost'
    },
    causes: {
      uz: ['Robot batareyalari to‘liq tugagan', 'Batareya quvvat o‘chiq holda almashtirilgan', 'Pulsecoder kabeli uzilgan', 'Dvigatel yoki pulsecoder almashtirilgan'],
      ru: ['Батареи робота полностью разряжены', 'Батареи менялись при выключенном питании', 'Отключался кабель энкодера', 'Заменён двигатель или энкодер'],
      en: ['Robot batteries fully discharged', 'Batteries were replaced with power off', 'Pulsecoder cable was disconnected', 'Motor or pulsecoder was replaced']
    },
    checks: {
      uz: ['Batareyalarni yangilariga almashtiring (kontroller yoniq holda)', 'SYSTEM > Master/Cal da RES_PCA bajaring', 'Kontrollerni qayta yoqing', 'O‘qlarni nol belgilariga olib borib, mastering bajaring', 'Ishonchingiz komil bo‘lmasa, muhandisni chaqiring'],
      ru: ['Замените батареи на новые (при включённом контроллере)', 'На SYSTEM > Master/Cal выполните RES_PCA', 'Перезапустите контроллер', 'Подведите оси к нулевым меткам и выполните mastering', 'Если не уверены, вызовите инженера'],
      en: ['Replace the batteries with new ones (controller powered on)', 'Run RES_PCA on SYSTEM > Master/Cal', 'Cycle controller power', 'Jog axes to zero marks and remaster', 'If unsure, call the engineer']
    },
    note: {
      uz: 'Mastering bajarilmaguncha robotni avtomatik rejimda ishga tushirmang.',
      ru: 'Не запускайте робот в автоматическом режиме до выполнения mastering.',
      en: 'Do not run the robot in auto until mastering is done.'
    }
  },
  {
    brand: 'FANUC',
    code: 'SRVO-065',
    controller: 'R-30iA / R-30iB',
    severity: 'normal',
    title: {
      uz: 'BLAL signali: pulsecoder batareyasi kuchlanishi past',
      ru: 'Сигнал BLAL: низкое напряжение батареи энкодера',
      en: 'BLAL alarm: pulsecoder battery voltage low'
    },
    causes: {
      uz: ['Batareyalar xizmat muddati tugash arafasida', 'Batareya kontaktlari oksidlangan'],
      ru: ['Батареи близки к окончанию срока службы', 'Окислены контакты батарей'],
      en: ['Batteries are near end of life', 'Corroded battery contacts']
    },
    checks: {
      uz: ['Yangi batareyalarni tayyorlang (odatda 4 dona D tipidagi)', 'Kontroller yoniq holda, E-stop bosilgan holatda batareyalarni almashtiring', 'Qutblarni to‘g‘ri qo‘yganingizni tekshiring', 'RESET ni bosing'],
      ru: ['Подготовьте новые батареи (обычно 4 шт. типа D)', 'Замените батареи при включённом контроллере и нажатом E-stop', 'Проверьте полярность', 'Нажмите RESET'],
      en: ['Get new batteries (usually four D cells)', 'Replace them with controller powered on and E-stop pressed', 'Check the polarity', 'Press RESET']
    },
    note: {
      uz: 'Quvvat o‘chiq holda almashtirsangiz, holat yo‘qoladi va SRVO-062 chiqadi.',
      ru: 'Замена при выключенном питании приведёт к потере положения и SRVO-062.',
      en: 'Replacing them with power off loses position data and causes SRVO-062.'
    }
  },
  {
    brand: 'FANUC',
    code: 'SRVO-068',
    controller: 'R-30iA / R-30iB',
    severity: 'critical',
    title: {
      uz: 'DTERR signali: pulsecoder dan ma’lumot kelmayapti',
      ru: 'Сигнал DTERR: ошибка последовательных данных энкодера',
      en: 'DTERR alarm: serial data error from the pulsecoder'
    },
    causes: {
      uz: ['Pulsecoder kabeli uzilgan yoki shikastlangan', 'Ulagich bo‘shagan', 'Pulsecoder nosoz', 'Servo kuchaytirgich yoki asosiy plata nosoz'],
      ru: ['Оборван или повреждён кабель энкодера', 'Ослаб разъём', 'Неисправен энкодер', 'Неисправен сервоусилитель или главная плата'],
      en: ['Pulsecoder cable broken or damaged', 'Loose connector', 'Faulty pulsecoder', 'Faulty servo amplifier or main board']
    },
    checks: {
      uz: ['Qaysi o‘q ekanini aniqlang', 'Quvvatni o‘chirib, robot asosidagi va dvigateldagi ulagichlarni tekshiring', 'Kabelni harakatlanuvchi joylarda shikast bo‘yicha tekshiring', 'Xato qolsa, muhandisni chaqiring'],
      ru: ['Определите ось', 'Отключите питание и проверьте разъёмы на основании робота и на двигателе', 'Осмотрите кабель в подвижных местах', 'Если ошибка остаётся, вызовите инженера'],
      en: ['Identify the axis', 'Power off and check connectors at the robot base and motor', 'Inspect the cable at moving sections', 'If it persists, call the engineer']
    },
    note: { uz: '', ru: '', en: '' }
  },
  {
    brand: 'FANUC',
    code: 'MOTN-017',
    controller: 'R-30iA / R-30iB',
    severity: 'normal',
    title: {
      uz: 'Chegara xatosi: maqsad nuqta o‘q chegarasidan tashqarida (Limit error)',
      ru: 'Ошибка предела: целевая точка за пределом оси (Limit error)',
      en: 'Limit error: the target position is beyond an axis limit'
    },
    causes: {
      uz: ['Nuqta o‘qning dasturiy chegarasidan tashqarida', 'UFRAME/UTOOL noto‘g‘ri tanlangan', 'Offset (PR) qiymati juda katta', 'Konfiguratsiya (flip, turn) mos emas'],
      ru: ['Точка вне программного предела оси', 'Выбраны неверные UFRAME/UTOOL', 'Слишком большое смещение (PR)', 'Неподходящая конфигурация (flip, turn)'],
      en: ['The point is outside the axis software limit', 'Wrong UFRAME/UTOOL selected', 'Offset (PR) value too large', 'Unsuitable configuration (flip, turn)']
    },
    checks: {
      uz: ['Xabardagi o‘q va dastur qatorini aniqlang', 'Frame va tool raqamlarini tekshiring', 'PR offset qiymatlarini tekshiring', 'Nuqtani qayta o‘rgating yoki J harakatdan foydalaning'],
      ru: ['Определите ось и строку программы', 'Проверьте номера frame и tool', 'Проверьте значения PR-смещений', 'Переобучите точку или используйте J-движение'],
      en: ['Identify the axis and program line', 'Check the frame and tool numbers', 'Check PR offset values', 'Reteach the point or use a J motion']
    },
    note: { uz: '', ru: '', en: '' }
  },
  {
    brand: 'FANUC',
    code: 'MOTN-018',
    controller: 'R-30iA / R-30iB',
    severity: 'normal',
    title: {
      uz: 'Pozitsiyaga yetib bo‘lmaydi: nuqta robot qamrovidan tashqarida',
      ru: 'Позиция недостижима: точка вне зоны досягаемости робота',
      en: 'Position not reachable: the point is outside the robot reach'
    },
    causes: {
      uz: ['Nuqta robotdan juda uzoqda', 'Noto‘g‘ri UFRAME/UTOOL', 'Hisoblangan PR nuqtasi xato', 'L harakat qamrovdan tashqaridan o‘tadi'],
      ru: ['Точка слишком далеко от робота', 'Неверные UFRAME/UTOOL', 'Ошибочно рассчитанная точка PR', 'L-движение проходит вне зоны досягаемости'],
      en: ['The point is too far from the robot', 'Wrong UFRAME/UTOOL', 'Incorrectly calculated PR point', 'An L motion passes outside the reach']
    },
    checks: {
      uz: ['Frame va tool raqamlarini tekshiring', 'PR qiymatlarini tekshiring', 'Nuqtani qayta o‘rgating', 'Harakat turini J ga almashtirib ko‘ring'],
      ru: ['Проверьте номера frame и tool', 'Проверьте значения PR', 'Переобучите точку', 'Попробуйте заменить движение на J'],
      en: ['Check frame and tool numbers', 'Check PR values', 'Reteach the point', 'Try changing the motion type to J']
    },
    note: { uz: '', ru: '', en: '' }
  },

  // ───────────────────────── Siemens ─────────────────────────
  {
    brand: 'Siemens',
    code: 'F30001',
    controller: 'SINAMICS G120 / S120',
    severity: 'critical',
    title: {
      uz: 'Quvvat bloki: ortiqcha tok (Overcurrent)',
      ru: 'Силовой модуль: перегрузка по току (Overcurrent)',
      en: 'Power unit: overcurrent'
    },
    causes: {
      uz: ['Dvigatel yoki kabelda qisqa tutashuv yoki yerga tutashuv', 'Tezlanish vaqti juda qisqa', 'Dvigatel ma’lumotlari noto‘g‘ri, identifikatsiya qilinmagan', 'Mexanik tiqilish yoki keskin yuk', 'Dvigatel aylanib turganda ulangan (flying restart yo‘q)'],
      ru: ['Короткое замыкание или замыкание на землю в двигателе или кабеле', 'Слишком короткое время разгона', 'Неверные данные двигателя, не выполнена идентификация', 'Механическое заклинивание или ударная нагрузка', 'Пуск на вращающийся двигатель без подхвата'],
      en: ['Short circuit or ground fault in motor or cable', 'Ramp-up time too short', 'Wrong motor data, identification not done', 'Mechanical jam or shock load', 'Starting into a spinning motor without flying restart']
    },
    checks: {
      uz: ['Quvvatni o‘chiring va yorliqdagi vaqtni kutib, DC shina kuchlanishini o‘lchang', 'Dvigatel valining erkin aylanishini tekshiring', 'Dvigatel va kabel izolyatsiyasini megaommetr bilan tekshirish uchun muhandisni chaqiring (drayvdan uzilgan holda)', 'Tezlanish vaqtini (p1120) oshiring', 'Dvigatel parametrlarini va identifikatsiyani tekshiring'],
      ru: ['Отключите питание, выждите время с таблички и измерьте напряжение звена DC', 'Проверьте свободное вращение вала двигателя', 'Проверку изоляции мегаомметром (при отсоединённом приводе) поручите инженеру', 'Увеличьте время разгона (p1120)', 'Проверьте данные двигателя и идентификацию'],
      en: ['Power off, wait the time on the label and measure the DC link voltage', 'Check the motor shaft turns freely', 'Call the engineer for a megger test of motor and cable (disconnected from the drive)', 'Increase the ramp-up time (p1120)', 'Check motor data and identification']
    },
    note: DC_NOTE
  },
  {
    brand: 'Siemens',
    code: 'F30002',
    controller: 'SINAMICS G120 / S120',
    severity: 'high',
    title: {
      uz: 'Quvvat bloki: DC shina kuchlanishi ortiqcha (Overvoltage)',
      ru: 'Силовой модуль: перенапряжение в звене постоянного тока',
      en: 'Power unit: DC link overvoltage'
    },
    causes: {
      uz: ['Sekinlashish vaqti juda qisqa, dvigatel generator rejimida', 'Tormoz rezistori yo‘q, ulanmagan yoki nosoz', 'Tarmoq kuchlanishi juda yuqori', 'Yuk drayvni aylantirmoqda (osilgan yuk, inersiya)'],
      ru: ['Слишком короткое время торможения, двигатель в генераторном режиме', 'Тормозной резистор отсутствует, не подключён или неисправен', 'Слишком высокое напряжение сети', 'Нагрузка вращает привод (подвешенный груз, инерция)'],
      en: ['Ramp-down time too short, motor regenerating', 'Braking resistor missing, not connected or faulty', 'Mains voltage too high', 'The load is driving the motor (hanging load, inertia)']
    },
    checks: {
      uz: ['Sekinlashish vaqtini (p1121) oshiring', 'Vdc_max regulyatori yoqilganini tekshiring (p1240)', 'Tarmoq kuchlanishini o‘lchang', 'Tormoz rezistorini quvvat o‘chiq va DC shina zaryadsizlangan holda muhandis tekshirsin'],
      ru: ['Увеличьте время торможения (p1121)', 'Проверьте, включён ли регулятор Vdc_max (p1240)', 'Измерьте напряжение сети', 'Тормозной резистор проверяет инженер при отключённом питании и разряженном звене DC'],
      en: ['Increase the ramp-down time (p1121)', 'Check the Vdc_max controller is enabled (p1240)', 'Measure the mains voltage', 'Have the engineer check the braking resistor with power off and DC link discharged']
    },
    note: DC_NOTE
  },
  {
    brand: 'Siemens',
    code: 'F30004',
    controller: 'SINAMICS G120 / S120',
    severity: 'high',
    title: {
      uz: 'Quvvat bloki: invertor radiatori qizib ketgan',
      ru: 'Силовой модуль: перегрев радиатора инвертора',
      en: 'Power unit: inverter heat sink overtemperature'
    },
    causes: {
      uz: ['Sovutish ventilyatori ishlamayapti', 'Radiator chang bilan to‘lgan', 'Shkafdagi harorat juda yuqori yoki havo aylanmayapti', 'Drayv uzoq vaqt ortiqcha yuklangan', 'PWM chastotasi juda yuqori'],
      ru: ['Не работает вентилятор охлаждения', 'Радиатор забит пылью', 'Слишком высокая температура в шкафу или нет циркуляции воздуха', 'Длительная перегрузка привода', 'Слишком высокая частота ШИМ'],
      en: ['Cooling fan not working', 'Heat sink clogged with dust', 'Cabinet too hot or poor airflow', 'Drive overloaded for a long time', 'Pulse frequency too high']
    },
    checks: {
      uz: ['Ventilyator aylanayotganini tekshiring', 'Quvvat o‘chiq va kondensatorlar zaryadsizlangandan keyin radiatorni tozalang', 'Shkaf filtrlari va ventilyatsiyasini tekshiring', 'Yuk tokini r0027 da kuzating', 'Kerak bo‘lsa, PWM chastotasini kamaytiring'],
      ru: ['Проверьте, вращается ли вентилятор', 'Очистите радиатор после отключения питания и разряда конденсаторов', 'Проверьте фильтры и вентиляцию шкафа', 'Проконтролируйте ток нагрузки в r0027', 'При необходимости снизьте частоту ШИМ'],
      en: ['Check the fan is turning', 'Clean the heat sink after power-off and capacitor discharge', 'Check cabinet filters and ventilation', 'Monitor load current in r0027', 'Lower the pulse frequency if needed']
    },
    note: DC_NOTE
  },

  // ───────────────────────── Danfoss ─────────────────────────
  {
    brand: 'Danfoss',
    code: 'Alarm 13',
    controller: 'VLT FC 102 / 202 / 302',
    severity: 'critical',
    title: {
      uz: 'Ortiqcha tok: invertorning eng yuqori tok chegarasi oshib ketdi',
      ru: 'Перегрузка по току: превышен пиковый предел тока инвертора',
      en: 'Over current: the inverter peak current limit was exceeded'
    },
    causes: {
      uz: ['Dvigatel yoki kabelda qisqa tutashuv', 'Valda zarbli yuk yoki tiqilish', 'Tezlanish vaqti juda qisqa', 'Dvigatel ma’lumotlari noto‘g‘ri (AMA bajarilmagan)', 'Chiqishda kontaktor ishlayotgan paytda ulanish'],
      ru: ['Короткое замыкание в двигателе или кабеле', 'Ударная нагрузка или заклинивание вала', 'Слишком короткое время разгона', 'Неверные данные двигателя (не выполнена AMA)', 'Коммутация выходного контактора во время работы'],
      en: ['Short circuit in motor or cable', 'Shock load or jammed shaft', 'Ramp-up time too short', 'Wrong motor data (AMA not run)', 'Output contactor switching while running']
    },
    checks: {
      uz: ['Quvvatni o‘chirib, yorliqdagi vaqtni kuting va DC kuchlanishni o‘lchang', 'Mexanizm erkin aylanishini tekshiring', 'Dvigatel ma’lumotlarini (1-2* guruh) tekshiring va AMA bajaring', 'Tezlanish vaqtini oshiring', 'Izolyatsiya sinovini muhandisga topshiring'],
      ru: ['Отключите питание, выждите время с таблички и измерьте напряжение DC', 'Проверьте свободное вращение механизма', 'Проверьте данные двигателя (группа 1-2*) и выполните AMA', 'Увеличьте время разгона', 'Проверку изоляции поручите инженеру'],
      en: ['Power off, wait the time on the label and measure DC voltage', 'Check the machine turns freely', 'Check motor data (group 1-2*) and run AMA', 'Increase ramp-up time', 'Leave insulation testing to the engineer']
    },
    note: DC_NOTE
  },
  {
    brand: 'Danfoss',
    code: 'Alarm 7',
    controller: 'VLT FC 102 / 202 / 302',
    severity: 'high',
    title: {
      uz: 'DC shina kuchlanishi ortiqcha (DC over voltage)',
      ru: 'Перенапряжение в звене постоянного тока (DC over voltage)',
      en: 'DC link over voltage'
    },
    causes: {
      uz: ['Sekinlashish vaqti juda qisqa', 'Yuk dvigatelni aylantirmoqda (generator rejimi)', 'Tarmoq kuchlanishi yuqori yoki sakrab turadi', 'Tormoz rezistori yo‘q yoki nosoz'],
      ru: ['Слишком короткое время торможения', 'Нагрузка вращает двигатель (генераторный режим)', 'Высокое или скачущее напряжение сети', 'Тормозной резистор отсутствует или неисправен'],
      en: ['Ramp-down time too short', 'Load is driving the motor (regeneration)', 'Mains voltage high or unstable', 'Braking resistor missing or faulty']
    },
    checks: {
      uz: ['Sekinlashish vaqtini oshiring', 'Ortiqcha kuchlanish nazoratini (2-17) yoqing', 'Tarmoq kuchlanishini o‘lchang', 'Tormoz rezistorini quvvat o‘chiq holda muhandis tekshirsin'],
      ru: ['Увеличьте время торможения', 'Включите контроль перенапряжения (2-17)', 'Измерьте напряжение сети', 'Тормозной резистор проверяет инженер при отключённом питании'],
      en: ['Increase ramp-down time', 'Enable over-voltage control (2-17)', 'Measure the mains voltage', 'Have the engineer check the braking resistor with power off']
    },
    note: DC_NOTE
  },
  {
    brand: 'Danfoss',
    code: 'Alarm 8',
    controller: 'VLT FC 102 / 202 / 302',
    severity: 'normal',
    title: {
      uz: 'DC shina kuchlanishi past (DC under voltage)',
      ru: 'Пониженное напряжение звена постоянного тока (DC under voltage)',
      en: 'DC link under voltage'
    },
    causes: {
      uz: ['Tarmoq kuchlanishi pasaygan yoki qisqa uzilgan', 'Kirish fazasi yo‘qolgan', 'Kirish saqlagichi yoki avtomati ishlagan', 'Ulanish klemmalari bo‘shagan'],
      ru: ['Снижение или кратковременный провал напряжения сети', 'Пропала входная фаза', 'Сработал входной предохранитель или автомат', 'Ослабли силовые клеммы'],
      en: ['Mains voltage dip or short interruption', 'Input phase lost', 'Input fuse or breaker tripped', 'Loose power terminals']
    },
    checks: {
      uz: ['Uch fazadagi tarmoq kuchlanishini o‘lchang', 'Saqlagich va avtomatlarni tekshiring', 'Klemmalarni tortishni quvvat o‘chiq va kondensatorlar zaryadsizlangan holda bajaring', 'Tarmoq barqaror bo‘lsa ham takrorlansa, muhandisni chaqiring'],
      ru: ['Измерьте напряжение сети по трём фазам', 'Проверьте предохранители и автоматы', 'Подтяжку клемм выполняйте при отключённом питании и разряженных конденсаторах', 'Если повторяется при стабильной сети, вызовите инженера'],
      en: ['Measure mains voltage on all three phases', 'Check fuses and breakers', 'Tighten terminals only with power off and capacitors discharged', 'If it repeats with stable mains, call the engineer']
    },
    note: DC_NOTE
  },

  // ───────────────────────── Yaskawa ─────────────────────────
  {
    brand: 'Yaskawa',
    code: 'oC',
    controller: 'A1000 / V1000 / GA700',
    severity: 'critical',
    title: {
      uz: 'Ortiqcha tok: chiqish toki aniqlash darajasidan oshdi',
      ru: 'Перегрузка по току: выходной ток превысил уровень срабатывания',
      en: 'Overcurrent: output current exceeded the detection level'
    },
    causes: {
      uz: ['Dvigatel yoki kabelda qisqa tutashuv yoki yerga tutashuv', 'Tezlanish vaqti (C1-01) juda qisqa', 'Yuk juda katta yoki mexanizm tiqilgan', 'Dvigatel ma’lumotlari noto‘g‘ri (auto-tuning bajarilmagan)', 'Chiqish kontaktori ishlash paytida ulanmoqda'],
      ru: ['Короткое замыкание или замыкание на землю в двигателе или кабеле', 'Слишком короткое время разгона (C1-01)', 'Слишком большая нагрузка или заклинивание', 'Неверные данные двигателя (не выполнен автотюнинг)', 'Коммутация выходного контактора во время работы'],
      en: ['Short or ground fault in motor or cable', 'Acceleration time (C1-01) too short', 'Load too heavy or machine jammed', 'Wrong motor data (auto-tuning not done)', 'Output contactor switching during operation']
    },
    checks: {
      uz: ['Quvvatni o‘chirib, CHARGE chirog‘i o‘chguncha kuting va DC kuchlanishni o‘lchang', 'Mexanizm erkin aylanishini tekshiring', 'C1-01 tezlanish vaqtini oshiring', 'Auto-tuning bajaring', 'Izolyatsiya sinovini muhandis bajarsin'],
      ru: ['Отключите питание, дождитесь погасания индикатора CHARGE и измерьте напряжение DC', 'Проверьте свободное вращение механизма', 'Увеличьте время разгона C1-01', 'Выполните автотюнинг', 'Проверку изоляции поручите инженеру'],
      en: ['Power off, wait for the CHARGE lamp to go out and measure DC voltage', 'Check the machine turns freely', 'Increase acceleration time C1-01', 'Run auto-tuning', 'Leave insulation testing to the engineer']
    },
    note: DC_NOTE
  },
  {
    brand: 'Yaskawa',
    code: 'ov',
    controller: 'A1000 / V1000 / GA700',
    severity: 'high',
    title: {
      uz: 'Ortiqcha kuchlanish: DC shina kuchlanishi chegaradan oshdi',
      ru: 'Перенапряжение: напряжение шины DC превысило предел',
      en: 'Overvoltage: DC bus voltage exceeded the limit'
    },
    causes: {
      uz: ['Sekinlashish vaqti (C1-02) juda qisqa', 'Yuk dvigatelni aylantirmoqda', 'Tormoz rezistori yoki tormoz bloki yo‘q yoki nosoz', 'Tarmoq kuchlanishi yuqori yoki kuchlanish sakrashlari'],
      ru: ['Слишком короткое время торможения (C1-02)', 'Нагрузка вращает двигатель', 'Тормозной резистор или модуль отсутствует или неисправен', 'Высокое напряжение сети или выбросы напряжения'],
      en: ['Deceleration time (C1-02) too short', 'The load is driving the motor', 'Braking resistor or unit missing or faulty', 'High mains voltage or voltage surges']
    },
    checks: {
      uz: ['C1-02 sekinlashish vaqtini oshiring', 'Sekinlashishda to‘xtab qolishni oldini olish funksiyasini (L3-04) tekshiring', 'Tarmoq kuchlanishini o‘lchang', 'Tormoz rezistorini quvvat o‘chiq va CHARGE o‘chgan holda muhandis tekshirsin'],
      ru: ['Увеличьте время торможения C1-02', 'Проверьте функцию предотвращения опрокидывания при торможении (L3-04)', 'Измерьте напряжение сети', 'Тормозной резистор проверяет инженер при отключённом питании и погасшем CHARGE'],
      en: ['Increase deceleration time C1-02', 'Check stall prevention during deceleration (L3-04)', 'Measure the mains voltage', 'Have the engineer check the braking resistor with power off and CHARGE lamp out']
    },
    note: DC_NOTE
  },
  {
    brand: 'Yaskawa',
    code: 'Uv1',
    controller: 'A1000 / V1000 / GA700',
    severity: 'normal',
    title: {
      uz: 'DC shina kuchlanishi past: ishlash paytida kuchlanish pasaydi',
      ru: 'Пониженное напряжение шины DC во время работы',
      en: 'DC bus undervoltage during operation'
    },
    causes: {
      uz: ['Tarmoq kuchlanishi pasaygan yoki qisqa uzilgan', 'Kirish fazasi yo‘qolgan', 'Kirish klemmalari bo‘shagan', 'Zaryad zanjiri (soft-charge) nosoz'],
      ru: ['Провал или кратковременное пропадание сети', 'Пропала входная фаза', 'Ослабли входные клеммы', 'Неисправна цепь предзаряда'],
      en: ['Mains voltage dip or short loss', 'Input phase lost', 'Loose input terminals', 'Faulty soft-charge circuit']
    },
    checks: {
      uz: ['Tarmoq kuchlanishini barcha fazalarda o‘lchang', 'Kirish saqlagichlari va avtomatini tekshiring', 'Klemmalarni faqat quvvat o‘chiq va CHARGE o‘chgan holda torting', 'Tarmoq yaxshi bo‘lsa ham takrorlansa, muhandisni chaqiring'],
      ru: ['Измерьте напряжение сети по всем фазам', 'Проверьте входные предохранители и автомат', 'Подтягивайте клеммы только при отключённом питании и погасшем CHARGE', 'Если повторяется при нормальной сети, вызовите инженера'],
      en: ['Measure mains voltage on all phases', 'Check input fuses and breaker', 'Tighten terminals only with power off and CHARGE lamp out', 'If it repeats with good mains, call the engineer']
    },
    note: DC_NOTE
  },
  {
    brand: 'Yaskawa',
    code: 'oH',
    controller: 'A1000 / V1000 / GA700',
    severity: 'high',
    title: {
      uz: 'Radiator qizib ketdi: drayv radiatori harorati yuqori',
      ru: 'Перегрев радиатора привода',
      en: 'Heatsink overheat on the drive'
    },
    causes: {
      uz: ['Sovutish ventilyatori to‘xtagan yoki eskirgan', 'Radiator yoki havo yo‘llari chang bilan to‘lgan', 'Shkaf ichidagi harorat yuqori', 'Doimiy ortiqcha yuklama'],
      ru: ['Вентилятор охлаждения остановился или изношен', 'Радиатор или воздуховоды забиты пылью', 'Высокая температура внутри шкафа', 'Постоянная перегрузка'],
      en: ['Cooling fan stopped or worn', 'Heatsink or air paths clogged with dust', 'High temperature inside the cabinet', 'Continuous overload']
    },
    checks: {
      uz: ['Ventilyator ishlashini tekshiring', 'Quvvat o‘chiq va CHARGE o‘chgandan keyin radiatorni tozalang', 'Shkaf ventilyatsiyasi va filtrlarini tekshiring', 'Chiqish tokini kuzating', 'Ventilyatorni almashtirishni muhandisga topshiring'],
      ru: ['Проверьте работу вентилятора', 'Очистите радиатор после отключения питания и погасания CHARGE', 'Проверьте вентиляцию и фильтры шкафа', 'Проконтролируйте выходной ток', 'Замену вентилятора поручите инженеру'],
      en: ['Check the fan is running', 'Clean the heatsink after power-off and CHARGE lamp out', 'Check cabinet ventilation and filters', 'Monitor output current', 'Leave fan replacement to the engineer']
    },
    note: DC_NOTE
  },

  // ───────────────────────── Delta ─────────────────────────
  {
    brand: 'Delta',
    code: 'ocA',
    controller: 'VFD-E / C2000',
    severity: 'critical',
    title: {
      uz: 'Tezlanish paytida ortiqcha tok',
      ru: 'Перегрузка по току при разгоне',
      en: 'Overcurrent during acceleration'
    },
    causes: {
      uz: ['Tezlanish vaqti juda qisqa', 'Dvigatel yoki kabelda qisqa yoki yerga tutashuv', 'Boshlang‘ich moment kuchaytirish (torque boost) juda yuqori', 'Yuk juda og‘ir yoki tiqilgan', 'Drayv quvvati dvigatelga mos emas'],
      ru: ['Слишком короткое время разгона', 'КЗ или замыкание на землю в двигателе или кабеле', 'Слишком большой подъём момента (torque boost)', 'Слишком тяжёлая или заклиненная нагрузка', 'Мощность привода не соответствует двигателю'],
      en: ['Acceleration time too short', 'Short or ground fault in motor or cable', 'Torque boost set too high', 'Load too heavy or jammed', 'Drive rating too small for the motor']
    },
    checks: {
      uz: ['Quvvatni o‘chirib, kondensatorlar zaryadsizlanishini kuting va DC kuchlanishni o‘lchang', 'Mexanizm erkin aylanishini tekshiring', 'Tezlanish vaqtini oshiring', 'Torque boost qiymatini kamaytiring', 'Izolyatsiya sinovini muhandis bajarsin'],
      ru: ['Отключите питание, дождитесь разряда конденсаторов и измерьте напряжение DC', 'Проверьте свободное вращение механизма', 'Увеличьте время разгона', 'Уменьшите подъём момента', 'Проверку изоляции поручите инженеру'],
      en: ['Power off, wait for capacitor discharge and measure DC voltage', 'Check the machine turns freely', 'Increase acceleration time', 'Reduce torque boost', 'Leave insulation testing to the engineer']
    },
    note: DC_NOTE
  },
  {
    brand: 'Delta',
    code: 'ovA',
    controller: 'VFD-E / C2000',
    severity: 'high',
    title: {
      uz: 'Tezlanish paytida ortiqcha kuchlanish',
      ru: 'Перенапряжение при разгоне',
      en: 'Overvoltage during acceleration'
    },
    causes: {
      uz: ['Tarmoq kuchlanishi juda yuqori', 'Tarmoqda kuchlanish sakrashlari', 'Yuk inersiyasi tufayli generator rejimi', 'Kirish kuchlanishi sozlamasi noto‘g‘ri'],
      ru: ['Слишком высокое напряжение сети', 'Выбросы напряжения в сети', 'Генераторный режим из-за инерции нагрузки', 'Неверная настройка входного напряжения'],
      en: ['Mains voltage too high', 'Voltage surges on the supply', 'Regeneration from load inertia', 'Wrong input voltage setting']
    },
    checks: {
      uz: ['Tarmoq kuchlanishini o‘lchang', 'Drayv nominal kuchlanishiga mosligini tekshiring', 'Tezlanish rejimini silliqlashtiring', 'Kerak bo‘lsa, tormoz rezistori o‘rnatishni muhandis bilan maslahatlashing'],
      ru: ['Измерьте напряжение сети', 'Проверьте соответствие номинальному напряжению привода', 'Сделайте разгон более плавным', 'При необходимости обсудите установку тормозного резистора с инженером'],
      en: ['Measure the mains voltage', 'Check it matches the drive rated voltage', 'Make acceleration smoother', 'Discuss adding a braking resistor with the engineer if needed']
    },
    note: DC_NOTE
  },

  // ───────────────────────── Inovance ─────────────────────────
  {
    brand: 'Inovance',
    code: 'Err02',
    controller: 'MD380 / MD500',
    severity: 'critical',
    title: {
      uz: 'Tezlanish paytida ortiqcha tok',
      ru: 'Перегрузка по току при разгоне',
      en: 'Overcurrent during acceleration'
    },
    causes: {
      uz: ['Chiqish zanjirida yerga yoki qisqa tutashuv', 'Tezlanish vaqti juda qisqa', 'Dvigatel parametrlari noto‘g‘ri, avto-sozlash bajarilmagan', 'Yuk keskin qo‘shilgan yoki aylanayotgan dvigatel ishga tushirilgan'],
      ru: ['Замыкание на землю или КЗ в выходной цепи', 'Слишком короткое время разгона', 'Неверные параметры двигателя, не выполнен автотюнинг', 'Резкий наброс нагрузки или пуск вращающегося двигателя'],
      en: ['Ground fault or short in the output circuit', 'Acceleration time too short', 'Wrong motor parameters, auto-tuning not done', 'Sudden load or starting a spinning motor']
    },
    checks: {
      uz: ['Quvvatni o‘chirib, CHARGE chirog‘i o‘chguncha kuting va DC kuchlanishni o‘lchang', 'Tezlanish vaqtini (F0-17) oshiring', 'Dvigatel parametrlarini kiriting va avto-sozlashni bajaring', 'Mexanizm erkin aylanishini tekshiring', 'Kabel izolyatsiyasini tekshirishni muhandisga topshiring'],
      ru: ['Отключите питание, дождитесь погасания CHARGE и измерьте напряжение DC', 'Увеличьте время разгона (F0-17)', 'Введите параметры двигателя и выполните автотюнинг', 'Проверьте свободное вращение механизма', 'Проверку изоляции кабеля поручите инженеру'],
      en: ['Power off, wait for the CHARGE lamp to go out and measure DC voltage', 'Increase acceleration time (F0-17)', 'Enter motor parameters and run auto-tuning', 'Check the machine turns freely', 'Leave cable insulation testing to the engineer']
    },
    note: DC_NOTE
  },
  {
    brand: 'Inovance',
    code: 'Err05',
    controller: 'MD380 / MD500',
    severity: 'high',
    title: {
      uz: 'Tezlanish paytida ortiqcha kuchlanish',
      ru: 'Перенапряжение при разгоне',
      en: 'Overvoltage during acceleration'
    },
    causes: {
      uz: ['Kirish kuchlanishi juda yuqori', 'Tezlanish paytida tashqi kuch dvigatelni aylantirmoqda', 'Tezlanish vaqti juda qisqa', 'Tormoz bloki yoki rezistori o‘rnatilmagan'],
      ru: ['Слишком высокое входное напряжение', 'Внешняя сила вращает двигатель при разгоне', 'Слишком короткое время разгона', 'Не установлен тормозной модуль или резистор'],
      en: ['Input voltage too high', 'An external force drives the motor during acceleration', 'Acceleration time too short', 'No braking unit or resistor fitted']
    },
    checks: {
      uz: ['Kirish kuchlanishini o‘lchang', 'Tezlanish vaqtini oshiring', 'Yukni tashqi aylantiruvchi kuch bor-yo‘qligini tekshiring', 'Tormoz rezistori kerakligini muhandis bilan aniqlang'],
      ru: ['Измерьте входное напряжение', 'Увеличьте время разгона', 'Проверьте, нет ли внешней силы, вращающей нагрузку', 'Необходимость тормозного резистора определите с инженером'],
      en: ['Measure the input voltage', 'Increase acceleration time', 'Check for an external force turning the load', 'Decide with the engineer whether a braking resistor is needed']
    },
    note: DC_NOTE
  }
];
