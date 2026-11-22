// Akademiyaning qo‘shimcha kurslari (sort 4..7), mavjud darslar uchun nazorat savollari
// va mavjud kurslar test havzasini 10 taga yetkazuvchi qo‘shimcha savollar.
// Format seed-data.mjs bilan bir xil; har bir darsda `check` (3 variantli nazorat savoli) bor.

export const courses2 = [
  {
    slug: 'industrial-safety-loto', level: 'basic', equipment: 'Robot cell / CNC', hours: 4, sort: 4,
    title: { uz: 'Sanoat xavfsizligi: LOTO va robot kamerasi', ru: 'Промышленная безопасность: LOTO и роботизированная ячейка', en: 'Industrial safety: LOTO and the robot cell' },
    summary: {
      uz: 'Energiyani bloklash va belgilash (LOTO), robot kamerasi himoyasi, to‘plangan energiya (pnevmatika, gidravlika, DC shina kondensatorlari), kameraga xavfsiz kirish va hech qachon chetlab o‘tilmaydigan himoya vositalari.',
      ru: 'Блокировка и маркировка источников энергии (LOTO), защита роботизированной ячейки, накопленная энергия (пневматика, гидравлика, конденсаторы шины DC), безопасный вход в ячейку и защитные устройства, которые нельзя обходить.',
      en: 'Lockout-tagout (LOTO), robot cell safeguarding, stored energy (pneumatic, hydraulic, DC bus capacitors), safe entry into a cell and the safety devices operators must never bypass.'
    },
    audience: { uz: 'Barcha operatorlar, smena texniklari, yangi xodimlar', ru: 'Все операторы, сменные техники, новые сотрудники', en: 'All operators, shift technicians, new staff' },
    lessons: [
      {
        title: { uz: 'LOTO tamoyillari', ru: 'Принципы LOTO', en: 'LOTO principles' },
        body: {
          uz: `LOTO (lockout-tagout) kimdir mashinada ishlayotganda uning ishga tushishi yoki energiya chiqarishining oldini oladigan tartib. Stop tugmasi, PLC buyrug‘i yoki yopiq eshik izolyatsiya hisoblanmaydi: dastur xato qilishi, hamkasb esa Start tugmasini bosishi mumkin.

## Bosqichlar
1. **Tayyorgarlik.** Barcha energiya manbalarini aniqlang: elektr ta’minoti, siqilgan havo, gidravlika, og‘irlik kuchi, prujinalar va issiqlik. Mashinaning LOTO varag‘i bo‘lsa, undan foydalaning.
2. **Xabar berish.** Operator va smena boshlig‘iga mashina bloklanishini ayting.
3. **To‘xtatish.** Mashinani odatiy to‘xtatish tartibi bilan to‘xtating.
4. **Izolyatsiya.** Har bir manbani o‘z uzgichida uzing: asosiy uzgich, havo klapani, gidravlik klapan.
5. **Qulf va yorliq.** Shaxsiy qulfingizni va ismingiz, sana va sabab yozilgan yorliqni o‘rnating. Bir kishi, bir qulf, bir kalit.
6. **To‘plangan energiyani chiqarish:** havoni chiqaring, bosimni tushiring, ko‘tarilgan qismlarni tayanchga qo‘ying, kondensatorlar zaryadsizlanishini kuting.
7. **Tekshirish.** Mashinani boshqaruv pultidan ishga tushirib ko‘ring, so‘ng boshqaruvni o‘chiq holatga qaytaring. Kuchlanish yo‘qligini malakali elektrik tasdiqlaydi.

## Guruh bo‘lib bloklash
Bir mashinada bir necha kishi ishlasa, har biri guruh qulfdoniga (hasp) o‘z qulfini osadi. Oxirgi qulf olinmaguncha mashina izolyatsiyada qoladi.

> Hech qachon boshqa birovning qulfini olmang. Faqat stop tugmasi bilan to‘xtatilgan mashinada ishlamang.`,
          ru: `LOTO (lockout-tagout) это порядок, который не даёт машине запуститься или высвободить энергию, пока на ней кто-то работает. Кнопка «Стоп», команда ПЛК или закрытая дверь не являются отключением: программа может дать сбой, а коллега может нажать «Пуск».

## Этапы
1. **Подготовка.** Определите все источники энергии: электропитание, сжатый воздух, гидравлику, силу тяжести, пружины и тепло. Если для машины есть карта LOTO, используйте её.
2. **Оповещение.** Сообщите оператору и мастеру смены, что машина будет заблокирована.
3. **Остановка.** Остановите машину штатной последовательностью.
4. **Отключение.** Отключите каждый источник на его отключающем устройстве: главный выключатель, воздушный клапан, гидравлический клапан.
5. **Замок и бирка.** Повесьте личный замок и бирку с фамилией, датой и причиной. Один человек, один замок, один ключ.
6. **Сброс накопленной энергии:** стравите воздух, сбросьте давление, опустите или подоприте поднятые части, дождитесь разряда конденсаторов.
7. **Проверка.** Попробуйте запустить машину с пульта, затем верните органы управления в положение «выкл». Отсутствие напряжения подтверждает квалифицированный электрик.

## Групповая блокировка
Если на машине работают несколько человек, каждый вешает свой замок на групповую скобу (hasp). Машина остаётся отключённой, пока не снят последний замок.

> Никогда не снимайте чужой замок. Не работайте на машине, остановленной только кнопкой «Стоп».`,
          en: `Lockout-tagout (LOTO) is the procedure that keeps a machine from starting or releasing energy while someone works on it. A stop button, a PLC command or a closed door is not isolation: software can fail and a colleague can press Start.

## The steps
1. **Prepare.** Identify every energy source: electrical supply, compressed air, hydraulics, gravity, springs and heat. Use the machine LOTO sheet if there is one.
2. **Notify.** Tell the operator and the shift leader that the machine will be locked out.
3. **Shut down** the machine with its normal stop sequence.
4. **Isolate** each source at its isolating device: main switch, air valve, hydraulic valve.
5. **Lock and tag.** Fit your personal lock and a tag with your name, the date and the reason. One person, one lock, one key.
6. **Release stored energy:** vent the air, relieve pressure, lower or support raised parts, wait for capacitors to discharge.
7. **Verify.** Try to start the machine from its controls, then return the controls to off. Absence of voltage is confirmed by a qualified electrician.

## Group lockout
When several people work on one machine, each person puts a lock on a group hasp. The machine stays isolated until the last lock is removed.

> Never remove another person's lock. Never work on a machine that is stopped only by a stop button.`
        },
        check: {
          q: { uz: 'LOTO da izolyatsiyadan keyin, ishni boshlashdan oldin nima qilinadi?', ru: 'Что делают в LOTO после отключения и перед началом работы?', en: 'In LOTO, what is done after isolating and before starting work?' },
          options: {
            uz: ['Mashinani stop tugmasi bilan to‘xtatib qo‘yish kifoya', 'To‘plangan energiyani chiqarib, ishga tushmasligini tekshirish', 'Qulfni hamkasbga topshirish'],
            ru: ['Достаточно нажать кнопку «Стоп»', 'Сбросить накопленную энергию и проверить, что машина не запускается', 'Передать замок коллеге'],
            en: ['Pressing the stop button is enough', 'Release stored energy and verify the machine will not start', 'Hand the lock to a colleague']
          },
          answer: 1
        }
      },
      {
        title: { uz: 'Robot kamerasi xavfsizligi', ru: 'Безопасность роботизированной ячейки', en: 'Robot cell safety' },
        body: {
          uz: `Robot kamerasi odamni harakatlanayotgan robotdan ajratish uchun qurilgan. Himoya bir necha qatlamdan iborat va har bir qatlam xavfsizlik zanjiriga ulangan.

## Himoya vositalari
- **To‘siq va blokirovkali eshiklar.** Eshik ochilsa, avtomatik rejimdagi robot to‘xtaydi.
- **Yorug‘lik pardalari va hudud skanerlari.** Nur kesilsa yoki zonaga kirilsa, harakat to‘xtaydi.
- **Avariya to‘xtatish (E-stop) tugmalari.** Pultda, kamera atrofida va teach pendantda.
- **Enabling device (uch holatli tugma).** Qo‘lda rejimda faqat o‘rta holatda bosilganda harakatga ruxsat beradi.
- **Xavfsizlik relesi yoki xavfsizlik PLC.** Bu signallarni kuzatadi va drayverlar quvvatini uzadi.

## Avariya to‘xtashi va himoya to‘xtashi
E-stop hamma harakatni to‘xtatadi va qo‘lda tiklashni talab qiladi. Himoya to‘xtashi (masalan, eshik ochilganda) robotni boshqariladigan tarzda to‘xtatadi. Ikkalasida ham avval sababni aniqlang, keyin tiklang.

## Muhim haqiqat
To‘xtab turgan robot xavfsiz robot degani emas. U signal yoki keyingi dastur qadamini kutayotgan bo‘lishi va ogohlantirishsiz harakatlanishi mumkin.

> Avtomatik rejimda ishlayotgan kameraga hech qachon kirmang. Kirish faqat 4-darsdagi tartib bo‘yicha.`,
          ru: `Роботизированная ячейка построена, чтобы отделить человека от движущегося робота. Защита состоит из нескольких уровней, и каждый уровень подключён к цепи безопасности.

## Защитные устройства
- **Ограждение и двери с блокировкой.** При открытии двери робот в автоматическом режиме останавливается.
- **Световые завесы и сканеры зоны.** При пересечении луча или входе в зону движение останавливается.
- **Кнопки аварийного останова (E-stop).** На пульте, по периметру ячейки и на пульте обучения.
- **Enabling device (трёхпозиционная кнопка).** В ручном режиме разрешает движение только в среднем положении.
- **Реле безопасности или ПЛК безопасности.** Контролирует эти сигналы и снимает питание с приводов.

## Аварийный и защитный останов
E-stop останавливает всё движение и требует ручного сброса. Защитный останов (например, при открытии двери) останавливает робот управляемо. В обоих случаях сначала выясните причину, затем выполняйте сброс.

## Важный факт
Стоящий робот не означает безопасный робот. Он может ждать сигнал или следующий шаг программы и начать движение без предупреждения.

> Никогда не входите в ячейку, работающую в автоматическом режиме. Вход только по порядку из урока 4.`,
          en: `A robot cell is built to keep people apart from a moving robot. Protection has several layers, and each layer is wired into the safety circuit.

## Safety devices
- **Guards and interlocked doors.** Opening a door stops a robot that is running in automatic mode.
- **Light curtains and area scanners.** Breaking a beam or entering a zone stops motion.
- **Emergency stop (E-stop) buttons.** On the operator panel, around the cell and on the teach pendant.
- **Enabling device (three-position switch).** In manual mode it allows motion only when held in the middle position.
- **Safety relay or safety PLC.** It monitors these signals and removes power from the drives.

## Emergency stop and protective stop
An E-stop stops all motion and needs a manual reset. A protective stop (for example when a door opens) stops the robot in a controlled way. In both cases, find the cause first, then reset.

## An important fact
A robot that is standing still is not a safe robot. It may be waiting for a signal or for the next program step and can move without warning.

> Never enter a cell that is running in automatic mode. Entry follows only the procedure in lesson 4.`
        },
        check: {
          q: { uz: 'Kamera ichida to‘xtab turgan robot haqida qaysi gap to‘g‘ri?', ru: 'Какое утверждение о стоящем в ячейке роботе верно?', en: 'Which statement about a robot standing still in the cell is true?' },
          options: {
            uz: ['U signal kutayotgan bo‘lishi va ogohlantirishsiz harakatlanishi mumkin', 'To‘xtagan robot har doim xavfsiz', 'Robot faqat E-stop tiklangandan keyin to‘xtaydi'],
            ru: ['Он может ждать сигнал и двинуться без предупреждения', 'Стоящий робот всегда безопасен', 'Робот останавливается только после сброса E-stop'],
            en: ['It may be waiting for a signal and move without warning', 'A stopped robot is always safe', 'The robot only stops after the E-stop is reset']
          },
          answer: 0
        }
      },
      {
        title: { uz: 'To‘plangan energiya', ru: 'Накопленная энергия', en: 'Stored energy' },
        body: {
          uz: `Asosiy uzgich o‘chirilgandan keyin ham mashinada energiya qolishi mumkin. LOTO dagi «energiyani chiqarish» bosqichi aynan shu uchun bor.

## Pnevmatika
- Asosiy havo klapanini yoping va qulflang, keyin tizimdagi havoni chiqarish klapani orqali chiqaring.
- Manometr nolni ko‘rsatishini tekshiring.
- Teskari klapanlar yoki yopiq taqsimlagichlar ortida silindrlarda havo qolishi mumkin. Greyfer ochilib, detal tushib ketishi mumkin.

## Gidravlika
- Nasosni to‘xtating va qulflang. **Akkumulyatorlar** nasos o‘chganidan keyin ham bosimni saqlaydi.
- Bosimni mashina hujjatidagi tartib bo‘yicha tushiring va manometrda tasdiqlang.
- Ko‘tarilgan qismlarni mexanik tayanch bilan mahkamlang.

## Elektr: DC shina kondensatorlari
Chastota o‘zgartirgich, servo drayver va robot kontrolleri ichidagi kondensatorlar o‘chirilgandan keyin ham xavfli kuchlanishni ushlab turadi. Korpusda yozilgan kutish vaqtiga rioya qiling. Kuchlanish yo‘qligini faqat malakali elektrik o‘lchab tasdiqlaydi.

## Og‘irlik kuchi va inersiya
- Robot o‘qlari va CNC vertikal o‘qlari tormoz bilan ushlanadi. Tormoz qo‘lda bo‘shatilsa, o‘q pastga tushadi.
- Shpindel va disklar o‘chirilgandan keyin ham aylanib turishi mumkin. To‘liq to‘xtashini kuting.

> Qaysi energiyani qanday chiqarishni bilmasangiz, ishni to‘xtating va muhandisdan so‘rang.`,
          ru: `Даже после отключения главного выключателя в машине может оставаться энергия. Именно для этого в LOTO есть этап сброса энергии.

## Пневматика
- Закройте и заблокируйте главный воздушный клапан, затем стравите воздух через сбросной клапан.
- Убедитесь, что манометр показывает ноль.
- За обратными клапанами или закрытыми распределителями воздух может остаться в цилиндрах. Захват может раскрыться, а деталь упасть.

## Гидравлика
- Остановите и заблокируйте насос. **Гидроаккумуляторы** сохраняют давление и после остановки насоса.
- Сбросьте давление по порядку из документации машины и подтвердите по манометру.
- Поднятые части закрепите механической опорой.

## Электричество: конденсаторы шины DC
Конденсаторы внутри частотных преобразователей, сервоприводов и контроллеров роботов держат опасное напряжение и после отключения. Соблюдайте время ожидания, указанное на корпусе. Отсутствие напряжения подтверждает измерением только квалифицированный электрик.

## Сила тяжести и инерция
- Оси робота и вертикальные оси станков ЧПУ удерживаются тормозом. Если тормоз отпустить вручную, ось опустится.
- Шпиндель и диски могут вращаться после отключения. Дождитесь полной остановки.

> Если не знаете, как сбросить какой-то вид энергии, остановите работу и спросите инженера.`,
          en: `Energy can remain in a machine even after the main switch is off. This is exactly why LOTO has a step for releasing energy.

## Pneumatics
- Close and lock the main air valve, then vent the system through its dump valve.
- Check that the pressure gauge reads zero.
- Air can stay trapped in cylinders behind check valves or closed directional valves. A gripper may open and drop a part.

## Hydraulics
- Stop and lock out the pump. **Accumulators** hold pressure after the pump stops.
- Relieve pressure using the procedure in the machine documentation and confirm it on the gauge.
- Secure raised parts with a mechanical support.

## Electrical: DC bus capacitors
Capacitors inside variable frequency drives, servo drives and robot controllers keep dangerous voltage after switch-off. Respect the waiting time printed on the housing. Only a qualified electrician confirms the absence of voltage by measuring.

## Gravity and inertia
- Robot axes and vertical CNC axes are held by brakes. If a brake is released by hand, the axis falls.
- Spindles and discs can keep turning after switch-off. Wait until they stop completely.

> If you do not know how to release a particular energy, stop and ask the engineer.`
        },
        check: {
          q: { uz: 'Gidravlik nasos o‘chirilgandan keyin ham bosimni nima saqlab qolishi mumkin?', ru: 'Что может сохранять давление после остановки гидронасоса?', en: 'What can keep hydraulic pressure after the pump is stopped?' },
          options: {
            uz: ['Havo filtri', 'Ventilyator', 'Gidroakkumulyator'],
            ru: ['Воздушный фильтр', 'Вентилятор', 'Гидроаккумулятор'],
            en: ['The air filter', 'The cooling fan', 'An accumulator']
          },
          answer: 2
        }
      },
      {
        title: { uz: 'Xavfsiz kirish va chetlab o‘tish taqiqi', ru: 'Безопасный вход и запрет обхода защиты', en: 'Safe entry and never bypassing' },
        body: {
          uz: `Kameraga kirishning ikki xil holati bor va ularni aralashtirib yubormaslik kerak.

## Xizmat ko‘rsatish uchun kirish
Tozalash, asbob almashtirish yoki ta’mirlash uchun robot harakati kerak bo‘lmasa, mashina LOTO bilan to‘liq izolyatsiya qilinadi. Shaxsiy qulfingiz o‘rnatilmaguncha kirmang.

## O‘rgatish va tekshirish uchun kirish
Robot harakati kerak bo‘lsa (nuqtani o‘rgatish, yo‘lni tekshirish):
1. Robotni qo‘lda kamaytirilgan tezlik rejimiga (T1) o‘tkazing va rejim kalitini o‘zingiz bilan oling.
2. Teach pendantni qo‘lingizda olib kiring. Enabling device sizning nazoratingizda bo‘ladi.
3. Kamerada boshqa hech kim bo‘lmasligi yoki har biri o‘z enabling device iga ega bo‘lishi kerak.
4. Qochish yo‘lingizni ochiq tuting, robot va qattiq to‘siq orasida turmang.
5. Chiqqandan keyin zonada hech kim yo‘qligini tekshirib, avtomatik rejimni tiklang.

## Hech qachon chetlab o‘tilmaydi
- Eshik datchiklari, yorug‘lik pardalari, hudud skanerlari.
- E-stop tugmalari va zanjiri.
- Enabling device (uni lenta yoki kabel bilan bog‘lab qo‘yish taqiqlanadi).
- Xavfsizlik relesidagi ko‘prikchalar (jumper) va zaxira kalitlar.

> Himoya vositasi ishlamasa, mashinani to‘xtating, ishni to‘xtating va muhandisga xabar bering. Har bir xodim xavfli ishni to‘xtatishga haqli.`,
          ru: `Есть два разных случая входа в ячейку, и их нельзя путать.

## Вход для обслуживания
Если для очистки, смены инструмента или ремонта движение робота не нужно, машина полностью отключается по LOTO. Не входите, пока не повешен ваш личный замок.

## Вход для обучения и проверки
Если движение робота нужно (обучение точки, проверка траектории):
1. Переведите робот в ручной режим с пониженной скоростью (T1) и заберите ключ режима с собой.
2. Входите с пультом обучения в руках. Enabling device находится под вашим контролем.
3. В ячейке не должно быть других людей, либо у каждого должен быть свой enabling device.
4. Держите путь отхода свободным, не стойте между роботом и жёстким препятствием.
5. После выхода убедитесь, что в зоне никого нет, и только потом возвращайте автоматический режим.

## Никогда не обходится
- Датчики дверей, световые завесы, сканеры зоны.
- Кнопки и цепь E-stop.
- Enabling device (фиксировать его лентой или стяжкой запрещено).
- Перемычки в реле безопасности и запасные ключи.

> Если защитное устройство не работает, остановите машину, прекратите работу и сообщите инженеру. Каждый сотрудник вправе остановить опасную работу.`,
          en: `There are two different reasons to enter a cell, and they must not be confused.

## Entry for maintenance
If cleaning, a tool change or a repair does not need robot motion, the machine is fully isolated with LOTO. Do not enter until your personal lock is on.

## Entry for teaching and checking
If robot motion is needed (teaching a point, checking a path):
1. Switch the robot to manual reduced speed (T1) and take the mode key with you.
2. Enter with the teach pendant in your hand. The enabling device stays under your control.
3. Nobody else should be in the cell, or each person must have their own enabling device.
4. Keep your escape route clear and never stand between the robot and a fixed obstacle.
5. After leaving, check that the cell is empty before restoring automatic mode.

## Never bypassed
- Door switches, light curtains, area scanners.
- E-stop buttons and the E-stop circuit.
- The enabling device (taping or tying it down is forbidden).
- Jumpers in the safety relay and spare keys.

> If a safety device does not work, stop the machine, stop the job and report it to the engineer. Every employee has the right to stop unsafe work.`
        },
        check: {
          q: { uz: 'Eshik datchigi ishlamay qolsa, operator nima qiladi?', ru: 'Что делает оператор, если не работает датчик двери?', en: 'What does the operator do if a door switch fails?' },
          options: {
            uz: ['Smena oxirigacha ko‘prikcha qo‘yib ishlaydi', 'Datchikni lenta bilan bosib qo‘yadi', 'Mashinani to‘xtatib, muhandisga xabar beradi'],
            ru: ['Ставит перемычку до конца смены', 'Прижимает датчик лентой', 'Останавливает машину и сообщает инженеру'],
            en: ['Fits a jumper until the end of the shift', 'Tapes the switch closed', 'Stops the machine and reports to the engineer']
          },
          answer: 2
        }
      }
    ],
    quiz: [
      { q: { uz: 'Quyidagilardan qaysi biri izolyatsiya hisoblanadi?', ru: 'Что из перечисленного является отключением (изоляцией)?', en: 'Which of these counts as isolation?' }, options: { uz: ['Stop tugmasini bosish', 'PLC orqali to‘xtatish buyrug‘i', 'Asosiy uzgichni o‘chirib, shaxsiy qulf osish', 'Kamera eshigini yopish'], ru: ['Нажать кнопку «Стоп»', 'Команда останова через ПЛК', 'Выключить главный выключатель и повесить личный замок', 'Закрыть дверь ячейки'], en: ['Pressing the stop button', 'A stop command from the PLC', 'Switching off the main isolator and fitting a personal lock', 'Closing the cell door'] }, answer: 2 },
      { q: { uz: 'LOTO dagi «bir kishi, bir qulf, bir kalit» qoidasi nimani anglatadi?', ru: 'Что означает правило LOTO «один человек, один замок, один ключ»?', en: 'What does the LOTO rule "one person, one lock, one key" mean?' }, options: { uz: ['Har bir ishlovchi o‘z shaxsiy qulfini osadi va kalit faqat unda bo‘ladi', 'Butun brigada uchun bitta qulf yetarli', 'Kalit pult yonida osib qo‘yiladi', 'Qulfni smena boshlig‘i osadi'], ru: ['Каждый работающий вешает свой замок, и ключ только у него', 'Одного замка достаточно на всю бригаду', 'Ключ вешают рядом с пультом', 'Замок вешает мастер смены'], en: ['Each worker fits their own lock and only they hold the key', 'One lock is enough for the whole crew', 'The key hangs next to the control panel', 'The shift leader fits the lock'] }, answer: 0 },
      { q: { uz: 'Guruh bo‘lib bloklashda mashina qachon qayta ishga tushirilishi mumkin?', ru: 'Когда при групповой блокировке машину можно снова запускать?', en: 'In a group lockout, when may the machine be restarted?' }, options: { uz: ['Birinchi ishchi qulfini olganda', 'Smena tugaganda', 'Muhandis telefon orqali ruxsat berganda', 'Oxirgi qulf olingandan keyin'], ru: ['Когда снят первый замок', 'Когда закончилась смена', 'Когда инженер разрешил по телефону', 'После того как снят последний замок'], en: ['When the first lock is removed', 'When the shift ends', 'When the engineer allows it by phone', 'After the last lock is removed'] }, answer: 3 },
      { q: { uz: 'Pnevmatik tizimda havo chiqarilgandan keyin qayerda bosim qolishi mumkin?', ru: 'Где может остаться давление после сброса воздуха в пневмосистеме?', en: 'Where can pressure remain after a pneumatic system has been vented?' }, options: { uz: ['Kompressor filtrida', 'Teskari klapanlar ortidagi silindrlarda', 'Manometr shkalasida', 'Havo shlangining tashqi qismida'], ru: ['В фильтре компрессора', 'В цилиндрах за обратными клапанами', 'На шкале манометра', 'На внешней стороне шланга'], en: ['In the compressor filter', 'In cylinders behind check valves', 'On the gauge scale', 'On the outside of the hose'] }, answer: 1 },
      { q: { uz: 'Drayver o‘chirilgandan keyin DC shinada kuchlanish yo‘qligini kim tasdiqlaydi?', ru: 'Кто подтверждает отсутствие напряжения на шине DC после отключения привода?', en: 'Who confirms there is no voltage on the DC bus after the drive is switched off?' }, options: { uz: ['Ixtiyoriy operator, ko‘z bilan qarab', 'Displey o‘chgani buni tasdiqlaydi', 'O‘lchash orqali malakali elektrik', 'Hech kim, 1 daqiqa kutish yetarli'], ru: ['Любой оператор на глаз', 'Это подтверждает погасший дисплей', 'Квалифицированный электрик измерением', 'Никто, достаточно подождать 1 минуту'], en: ['Any operator by looking', 'A dark display confirms it', 'A qualified electrician, by measuring', 'Nobody, waiting 1 minute is enough'] }, answer: 2 },
      { q: { uz: 'Enabling device qaysi holatda harakatga ruxsat beradi?', ru: 'В каком положении enabling device разрешает движение?', en: 'In which position does the enabling device allow motion?' }, options: { uz: ['O‘rta holatda', 'Qo‘yib yuborilganda', 'Oxirigacha bosilganda', 'Istalgan holatda'], ru: ['В среднем положении', 'В отпущенном положении', 'При полном нажатии', 'В любом положении'], en: ['In the middle position', 'When released', 'When fully pressed', 'In any position'] }, answer: 0 },
      { q: { uz: 'O‘rgatish uchun kameraga kirishda robot qaysi rejimda bo‘lishi kerak?', ru: 'В каком режиме должен быть робот при входе в ячейку для обучения?', en: 'Which mode must the robot be in when you enter the cell for teaching?' }, options: { uz: ['Avtomatik', 'Tashqi boshqaruv (PLC)', 'Qo‘lda to‘liq tezlik', 'Qo‘lda kamaytirilgan tezlik (T1)'], ru: ['Автоматический', 'Внешнее управление (ПЛК)', 'Ручной на полной скорости', 'Ручной с пониженной скоростью (T1)'], en: ['Automatic', 'External control (PLC)', 'Manual full speed', 'Manual reduced speed (T1)'] }, answer: 3 },
      { q: { uz: 'Robotning vertikal o‘qi tormozini qo‘lda bo‘shatsa nima bo‘ladi?', ru: 'Что произойдёт, если вручную отпустить тормоз вертикальной оси робота?', en: 'What happens if the brake of a vertical robot axis is released by hand?' }, options: { uz: ['Hech narsa, o‘q joyida qoladi', 'O‘q og‘irlik kuchi ta’sirida pastga tushishi mumkin', 'Kontroller avtomatik mastering qiladi', 'Robot avtomatik rejimga o‘tadi'], ru: ['Ничего, ось останется на месте', 'Ось может опуститься под действием силы тяжести', 'Контроллер выполнит автоматический мастеринг', 'Робот перейдёт в автоматический режим'], en: ['Nothing, the axis stays in place', 'The axis can fall under gravity', 'The controller performs automatic mastering', 'The robot switches to automatic'] }, answer: 1 },
      { q: { uz: 'Kamerada ishlaganda qayerda turmaslik kerak?', ru: 'Где нельзя стоять при работе в ячейке?', en: 'Where must you not stand when working in the cell?' }, options: { uz: ['Kamera eshigi yonida', 'Pult oldida', 'Robot va qattiq to‘siq orasida', 'Qochish yo‘lida'], ru: ['Рядом с дверью ячейки', 'Перед пультом', 'Между роботом и жёстким препятствием', 'На пути отхода'], en: ['Next to the cell door', 'In front of the panel', 'Between the robot and a fixed obstacle', 'On the escape route'] }, answer: 2 },
      { q: { uz: 'E-stop bosilgandan keyin to‘g‘ri harakat qaysi?', ru: 'Как правильно действовать после нажатия E-stop?', en: 'What is the correct action after an E-stop has been pressed?' }, options: { uz: ['Avval sababni aniqlash, keyin tiklash', 'Darhol tiklab, ishni davom ettirish', 'Kontrollerni o‘chirib yoqish', 'Tugmani lenta bilan bosilmaydigan qilish'], ru: ['Сначала выяснить причину, затем сбросить', 'Сразу сбросить и продолжить работу', 'Выключить и включить контроллер', 'Заклеить кнопку лентой'], en: ['Find the cause first, then reset', 'Reset at once and carry on', 'Power-cycle the controller', 'Tape over the button'] }, answer: 0 }
    ]
  },
  {
    slug: 'preventive-maintenance', level: 'basic', equipment: 'Robots, CNC, drives', hours: 5, sort: 5,
    title: { uz: 'Profilaktik texnik xizmat: robotlar, CNC va drayverlar', ru: 'Планово-предупредительное обслуживание: роботы, ЧПУ и приводы', en: 'Preventive maintenance: robots, CNC and drives' },
    summary: {
      uz: 'Profilaktik xizmat rejasini tuzish, robotlar, CNC stanoklari va chastota o‘zgartirgich shkaflari uchun kunlik, haftalik va oylik tekshiruvlar hamda xizmat jurnalini yuritish.',
      ru: 'Составление плана ППО, ежедневные, еженедельные и ежемесячные проверки роботов, станков ЧПУ и шкафов с частотными преобразователями, ведение журнала обслуживания.',
      en: 'Building a PM plan, daily, weekly and monthly checks for robots, CNC machines and VFD cabinets, and keeping a maintenance logbook.'
    },
    audience: { uz: 'Operatorlar, smena texniklari, xizmat ko‘rsatish bo‘limi', ru: 'Операторы, сменные техники, служба обслуживания', en: 'Operators, shift technicians, maintenance team' },
    lessons: [
      {
        title: { uz: 'Profilaktik xizmat rejasini tuzish', ru: 'Как составить план ППО', en: 'Building a PM plan' },
        body: {
          uz: `Profilaktik xizmat (PM) nosozlik yuz bergandan keyin emas, undan oldin bajariladigan rejali ishlar. Yaxshi reja to‘satdan to‘xtashlarni kamaytiradi va ehtiyot qismlarni oldindan buyurtma qilishga imkon beradi.

## Rejani tuzish tartibi
1. **Uskunalar ro‘yxati.** Har bir robot, stanok va drayver shkafini inventar raqami, modeli va joyi bilan yozing.
2. **Muhimlik darajasi.** Qaysi uskuna to‘xtasa butun liniya to‘xtaydi? Shu uskunalardan boshlang.
3. **Ishlab chiqaruvchi ko‘rsatmalari.** Xizmat oraliqlarini qo‘llanmadan oling. Ular kalendar vaqti, ish soatlari yoki sikllar soni bo‘yicha berilishi mumkin.
4. **Vazifa kartalari.** Har bir ish uchun qisqa karta: nima qilinadi, qanday asbob, qanday material (moy turi, filtr raqami), qancha vaqt.
5. **Mas’ul.** Kim bajaradi: operator (ko‘rik, tozalash, darajalarni tekshirish), texnik (moylash, filtr almashtirish) yoki muhandis (sozlash, elektr ishlari).
6. **Jadval.** Ishlarni rejali to‘xtashlar va smena almashinuviga moslang.
7. **Ehtiyot qismlar.** Filtrlar, batareyalar, moy va ventilyatorlarni omborda saqlang.

## Qoidalar
- Ishlab chiqaruvchi ko‘rsatgan oraliqni uzaytirmang. Og‘ir sharoitda (chang, issiqlik, uch smena) oraliqni qisqartirish kerak bo‘lishi mumkin.
- Har bir ish jurnalga yoziladi, aks holda u bajarilmagan hisoblanadi.

> Profilaktik ishlar ham LOTO talab qilishi mumkin. Vazifa kartasida buni aniq yozing.`,
          ru: `Планово-предупредительное обслуживание (ППО) это плановые работы, которые выполняют до отказа, а не после него. Хороший план сокращает внезапные простои и позволяет заранее заказать запчасти.

## Как составить план
1. **Список оборудования.** Запишите каждого робота, станок и шкаф приводов с инвентарным номером, моделью и местом.
2. **Критичность.** Остановка какого оборудования останавливает всю линию? Начните с него.
3. **Указания производителя.** Интервалы обслуживания берите из руководства. Они бывают по календарю, по моточасам или по числу циклов.
4. **Карты работ.** Для каждой работы короткая карта: что делать, какой инструмент, какие материалы (тип смазки, номер фильтра), сколько времени.
5. **Ответственный.** Кто выполняет: оператор (осмотр, очистка, проверка уровней), техник (смазка, замена фильтров) или инженер (настройка, электрические работы).
6. **График.** Привяжите работы к плановым остановкам и пересменкам.
7. **Запчасти.** Держите на складе фильтры, батареи, смазку и вентиляторы.

## Правила
- Не увеличивайте интервал, указанный производителем. В тяжёлых условиях (пыль, жара, три смены) интервал может понадобиться сократить.
- Каждая работа записывается в журнал, иначе она считается невыполненной.

> Плановые работы тоже могут требовать LOTO. Чётко укажите это в карте работ.`,
          en: `Preventive maintenance (PM) is planned work done before a failure, not after it. A good plan reduces sudden stoppages and lets you order spare parts in advance.

## How to build the plan
1. **Equipment list.** Record every robot, machine tool and drive cabinet with its asset number, model and location.
2. **Criticality.** Which equipment stops the whole line when it stops? Start with that.
3. **Manufacturer instructions.** Take service intervals from the manual. They may be given in calendar time, running hours or number of cycles.
4. **Task cards.** A short card for each job: what to do, which tools, which materials (grease type, filter part number), how long it takes.
5. **Responsibility.** Who does it: the operator (inspection, cleaning, checking levels), a technician (lubrication, filter changes) or the engineer (adjustments, electrical work).
6. **Schedule.** Fit the jobs into planned stops and shift changes.
7. **Spare parts.** Keep filters, batteries, grease and fans in stock.

## Rules
- Do not stretch the interval the manufacturer gives. In harsh conditions (dust, heat, three shifts) the interval may need to be shorter.
- Every job is written in the logbook, otherwise it counts as not done.

> PM jobs may also need LOTO. State this clearly on the task card.`
        },
        check: {
          q: { uz: 'Xizmat oraliqlari birinchi navbatda qayerdan olinadi?', ru: 'Откуда в первую очередь берут интервалы обслуживания?', en: 'Where do service intervals come from first of all?' },
          options: {
            uz: ['Ishlab chiqaruvchi qo‘llanmasidan', 'Operatorning taxminidan', 'Faqat nosozliklar sonidan'],
            ru: ['Из руководства производителя', 'Из догадок оператора', 'Только из числа отказов'],
            en: ['From the manufacturer manual', 'From the operator guess', 'Only from the number of failures']
          },
          answer: 0
        }
      },
      {
        title: { uz: 'Robotlar uchun tekshiruvlar', ru: 'Проверки для роботов', en: 'Checks for robots' },
        body: {
          uz: `Robotlarda eng ko‘p nosozlik kabellar, moylash, batareyalar va yo‘qolgan dasturlar bilan bog‘liq. Quyidagi ro‘yxat umumiy namuna, aniq oraliqlar va materiallar robot qo‘llanmasidan olinadi.

## Har kuni (operator)
- Kabel paketi (dress pack), shlanglar va teach pendant kabelida ishqalanish, yoriq va ezilish yo‘qligini ko‘zdan kechiring.
- Odatdan tashqari shovqin, titrash yoki moy oqishini kuzating.
- Teach pendant va pultdagi E-stop tugmalarini tekshiring.
- Xabarlar jurnalida yangi ogohlantirishlar bor-yo‘qligini qarang.

## Har hafta
- Robot va greyferni tozalang, ayniqsa payvandlash yoki bo‘yash kameralarida.
- Kabel paketining ishqalanadigan joylari va mahkamlagichlarini tekshiring.
- Greyfer barmoqlari, vakuum so‘rg‘ichlari va havo bosimini tekshiring.

## Har oy va rejali
- **Backup** oling va nusxani kamida ikki joyda saqlang.
- **Enkoder batareyasi** ogohlantirishini tekshiring. Batareya qo‘llanmadagi tartibda almashtiriladi: ba’zi robotlarda pozitsiya ma’lumoti yo‘qolmasligi uchun kontroller yoqilgan holda.
- **Reduktorlarni moylash** ish soatlari bo‘yicha, faqat qo‘llanmada ko‘rsatilgan moy turi va miqdori bilan. Bu ishni o‘qitilgan texnik bajaradi.
- Kontroller ventilyatorlari va filtrlarini tozalang.

> Moy turini aralashtirmang va ortiqcha moy quymang: bu salnik va reduktorni shikastlashi mumkin.`,
          ru: `У роботов чаще всего отказывают кабели, узлы смазки, батареи, а также теряются программы. Список ниже типовой, точные интервалы и материалы берут из руководства на робот.

## Ежедневно (оператор)
- Осмотрите кабельный пакет (dress pack), шланги и кабель пульта обучения: нет ли потёртостей, трещин и пережатий.
- Обратите внимание на необычный шум, вибрацию или подтёки смазки.
- Проверьте кнопки E-stop на пульте обучения и на панели.
- Посмотрите, нет ли в журнале сообщений новых предупреждений.

## Еженедельно
- Очистите робот и захват, особенно в ячейках сварки и окраски.
- Проверьте места трения кабельного пакета и крепления.
- Проверьте пальцы захвата, вакуумные присоски и давление воздуха.

## Ежемесячно и по плану
- Сделайте **резервную копию** и храните её минимум в двух местах.
- Проверьте предупреждение о **батарее энкодеров**. Батарею меняют по порядку из руководства: у некоторых роботов при включённом контроллере, чтобы не потерять данные положения.
- **Смазка редукторов** по моточасам, только смазкой того типа и в том количестве, что указано в руководстве. Эту работу выполняет обученный техник.
- Очистите вентиляторы и фильтры контроллера.

> Не смешивайте типы смазки и не заливайте лишнего: это может повредить уплотнения и редуктор.`,
          en: `On robots, most failures come from cables, lubrication, batteries and lost programs. The list below is a typical example; exact intervals and materials come from the robot manual.

## Daily (operator)
- Inspect the dress pack, hoses and teach pendant cable for chafing, cracks and crushing.
- Watch for unusual noise, vibration or grease leaks.
- Test the E-stop buttons on the teach pendant and the operator panel.
- Check the message log for new warnings.

## Weekly
- Clean the robot and the gripper, especially in welding or painting cells.
- Check the wear points and clamps of the dress pack.
- Check gripper fingers, vacuum cups and air pressure.

## Monthly and scheduled
- Take a **backup** and keep copies in at least two places.
- Check for the **encoder battery** warning. The battery is replaced as the manual describes: on some robots with the controller powered on so position data is not lost.
- **Gearbox lubrication** by running hours, only with the grease type and quantity given in the manual. A trained technician does this job.
- Clean the controller fans and filters.

> Do not mix grease types and do not overfill: this can damage seals and the gearbox.`
        },
        check: {
          q: { uz: 'Robot reduktorini moylashda nimaga amal qilinadi?', ru: 'Чему следуют при смазке редуктора робота?', en: 'What is followed when lubricating a robot gearbox?' },
          options: {
            uz: ['Qo‘lida bor istalgan moydan to‘liq to‘ldirish', 'Qo‘llanmadagi moy turi va miqdori', 'Faqat shovqin paydo bo‘lganda moylash'],
            ru: ['Залить доверху любой имеющейся смазкой', 'Тип и количество смазки по руководству', 'Смазывать только при появлении шума'],
            en: ['Fill to the top with any grease at hand', 'The grease type and quantity from the manual', 'Only grease it when noise appears']
          },
          answer: 1
        }
      },
      {
        title: { uz: 'CNC stanoklari uchun tekshiruvlar', ru: 'Проверки для станков ЧПУ', en: 'Checks for CNC machines' },
        body: {
          uz: `CNC stanokining aniqligi va umri ko‘p jihatdan moylash, himoya qopqoqlari va moylash-sovutish suyuqligi (MSS) holatiga bog‘liq.

## Har kuni (operator)
- **Yo‘naltiruvchilarni moylash** tizimidagi moy darajasini tekshiring va faqat ko‘rsatilgan moy bilan to‘ldiring. Moy sarflanmayotgan bo‘lsa, bu nosozlik belgisi: texnikka xabar bering.
- **MSS darajasi** va **konsentratsiyasini** refraktometr bilan tekshiring. Past konsentratsiya zang va asbob yeyilishiga, yuqori konsentratsiya teri qichishiga olib keladi.
- Qirindini tozalang, qirindi konveyeri ishlashini tekshiring.
- Havo bosimi manometrda me’yorda ekanini tekshiring.
- Ishlab chiqaruvchi tavsiya qilsa, shpindelni qizdirish dasturini bajaring.

## Har hafta
- **Teleskopik himoya qopqoqlari** va qirg‘ichlarida (wiper) shikast, qirindi tiqilishi yo‘qligini tekshiring. Shikastlangan qopqoq orqali qirindi yo‘naltiruvchi va vint juftiga tushadi.
- MSS bakidan suzib yurgan moyni (tramp oil) yig‘ing va filtrlarni tozalang.
- Eshik oynasi va uning muhrlarini tekshiring.

## Har oy
- Gidravlika moyi darajasi va sizib chiqishlar.
- Elektr shkafi filtrlari va ventilyatorlari (tashqaridan).
- MSS hidi: yoqimsiz hid bakteriyalar ko‘payganini bildiradi.

> Qopqoqlarni ochib tozalash yoki asbob almashtirish faqat stanok to‘xtatilgan va himoyalangan holatda bajariladi.`,
          ru: `Точность и срок службы станка ЧПУ во многом зависят от смазки, защитных кожухов и состояния СОЖ.

## Ежедневно (оператор)
- Проверьте уровень масла в системе **смазки направляющих** и доливайте только указанное масло. Если масло не расходуется, это признак неисправности: сообщите технику.
- Проверьте **уровень СОЖ** и её **концентрацию** рефрактометром. Низкая концентрация ведёт к коррозии и износу инструмента, высокая к раздражению кожи.
- Уберите стружку, проверьте работу стружечного конвейера.
- Проверьте, что давление воздуха на манометре в норме.
- Если производитель рекомендует, выполните программу прогрева шпинделя.

## Еженедельно
- Проверьте **телескопические кожухи** и скребки (wiper): нет ли повреждений и забивания стружкой. Через повреждённый кожух стружка попадает на направляющие и ШВП.
- Соберите с поверхности бака СОЖ постороннее масло (tramp oil) и очистите фильтры.
- Проверьте стекло двери и его уплотнения.

## Ежемесячно
- Уровень гидравлического масла и подтёки.
- Фильтры и вентиляторы электрошкафа (снаружи).
- Запах СОЖ: неприятный запах означает рост бактерий.

> Открывать кожухи для очистки или менять инструмент можно только при остановленном и защищённом станке.`,
          en: `The accuracy and life of a CNC machine depend largely on lubrication, way covers and the condition of the coolant.

## Daily (operator)
- Check the oil level of the **way lubrication** system and top up only with the specified oil. If no oil is being used, that is a fault sign: tell the technician.
- Check **coolant level** and **concentration** with a refractometer. Low concentration causes rust and tool wear; high concentration causes skin irritation.
- Clear chips and check that the chip conveyor works.
- Check that air pressure on the gauge is within its normal range.
- If the manufacturer recommends it, run the spindle warm-up program.

## Weekly
- Inspect the **telescopic way covers** and wipers for damage and packed chips. Chips get through a damaged cover onto the guideways and ball screws.
- Skim floating tramp oil off the coolant tank and clean the filters.
- Check the door window and its seals.

## Monthly
- Hydraulic oil level and leaks.
- Electrical cabinet filters and fans (from outside).
- Coolant smell: a bad smell means bacteria are growing.

> Opening covers for cleaning or changing tools is done only with the machine stopped and secured.`
        },
        check: {
          q: { uz: 'Shikastlangan teleskopik qopqoq nimaga olib keladi?', ru: 'К чему приводит повреждённый телескопический кожух?', en: 'What does a damaged telescopic way cover lead to?' },
          options: {
            uz: ['MSS konsentratsiyasi oshadi', 'Shpindel tezroq qiziydi', 'Qirindi yo‘naltiruvchilar va vint juftiga tushadi'],
            ru: ['Растёт концентрация СОЖ', 'Шпиндель быстрее греется', 'Стружка попадает на направляющие и ШВП'],
            en: ['Coolant concentration rises', 'The spindle heats up faster', 'Chips reach the guideways and ball screws']
          },
          answer: 2
        }
      },
      {
        title: { uz: 'Drayver shkaflari va xizmat jurnali', ru: 'Шкафы приводов и журнал обслуживания', en: 'Drive cabinets and the logbook' },
        body: {
          uz: `Chastota o‘zgartirgich va servo drayverlarning eng katta dushmani issiqlik va chang. Ko‘p «tushunarsiz» xatolar shkaf ichidagi harorat yuqoriligidan kelib chiqadi.

## Operator tashqaridan tekshiradi
- Shkaf ventilyatorlari aylanayotgani va havo chiqayotganini his qiling.
- Eshikdagi filtr matlari: rangi qoraygan yoki chang bosgan bo‘lsa, almashtirishga yozing.
- Shkaf eshiklari yopiq va qulflangan bo‘lishi kerak. Ochiq eshik sovutish oqimini buzadi va changni ichkariga kiritadi.
- Kuygan hid, g‘ayrioddiy shovqin yoki issiq korpus sezilsa, darhol xabar bering.

## Texnik va elektrik ishlari
- Filtr matlarini almashtirish (ko‘pincha shkafni ochmasdan, tashqi panjara orqali).
- Termal tekshiruv: ishlab turgan shkafda klemma va kontaktorlarni termokamera bilan tekshirishni faqat malakali elektrik korxona qoidalari va himoya vositalari bilan bajaradi.
- Ichki tozalash faqat LOTO va DC shina kondensatorlari zaryadsizlanganidan keyin, changyutgich va antistatik cho‘tka bilan. Changni siqilgan havo bilan drayver ichiga puflamang.

## Xizmat jurnali
Har bir yozuvda bo‘lishi kerak:
1. Sana, smena va uskuna raqami.
2. Nima qilingan yoki nima kuzatilgan (masalan, «filtr qoraygan, almashtirildi»).
3. O‘lchangan qiymatlar: bosim, harorat, MSS konsentratsiyasi.
4. Bajaruvchining ismi va keyingi qadam.

> Jurnal muhandis uchun eng qimmatli manba. Takrorlanuvchi muammolar faqat yozuvlar orqali ko‘rinadi.`,
          ru: `Главные враги частотных преобразователей и сервоприводов это тепло и пыль. Многие «непонятные» ошибки вызваны высокой температурой внутри шкафа.

## Оператор проверяет снаружи
- Убедитесь, что вентиляторы шкафа вращаются и воздух выходит.
- Фильтрующие маты на двери: если они потемнели или забиты пылью, запишите на замену.
- Двери шкафа должны быть закрыты и заперты. Открытая дверь нарушает поток охлаждения и пускает пыль внутрь.
- Если чувствуется запах гари, необычный шум или горячий корпус, сразу сообщите.

## Работы техника и электрика
- Замена фильтрующих матов (часто снаружи, через решётку, без открытия шкафа).
- Тепловизионный контроль: проверять клеммы и контакторы работающего шкафа тепловизором может только квалифицированный электрик по правилам предприятия и в СИЗ.
- Внутренняя очистка только после LOTO и разряда конденсаторов шины DC, пылесосом и антистатической кистью. Не задувайте пыль сжатым воздухом внутрь привода.

## Журнал обслуживания
В каждой записи должны быть:
1. Дата, смена и номер оборудования.
2. Что сделано или замечено (например, «фильтр потемнел, заменён»).
3. Измеренные значения: давление, температура, концентрация СОЖ.
4. Фамилия исполнителя и следующий шаг.

> Журнал самый ценный источник для инженера. Повторяющиеся проблемы видны только по записям.`,
          en: `Heat and dust are the worst enemies of VFDs and servo drives. Many "mystery" faults are caused by high temperature inside the cabinet.

## The operator checks from outside
- Make sure the cabinet fans are turning and air is coming out.
- Filter mats on the door: if they are dark or clogged with dust, log them for replacement.
- Cabinet doors must be closed and locked. An open door disturbs the cooling airflow and lets dust in.
- If you notice a burning smell, unusual noise or a hot housing, report it at once.

## Technician and electrician work
- Replacing filter mats (often from outside, through the grille, without opening the cabinet).
- Thermal check: inspecting terminals and contactors of a running cabinet with a thermal camera is done only by a qualified electrician under site rules and with PPE.
- Internal cleaning only after LOTO and discharge of the DC bus capacitors, with a vacuum cleaner and an antistatic brush. Do not blow dust into the drive with compressed air.

## The logbook
Each entry must contain:
1. Date, shift and equipment number.
2. What was done or observed (for example "filter dark, replaced").
3. Measured values: pressure, temperature, coolant concentration.
4. The name of the person and the next step.

> The logbook is the most valuable source for the engineer. Repeating problems only show up in the records.`
        },
        check: {
          q: { uz: 'Drayver shkafi ichini tozalash qachon bajariladi?', ru: 'Когда выполняют внутреннюю очистку шкафа приводов?', en: 'When is the inside of a drive cabinet cleaned?' },
          options: {
            uz: ['Ishlab turgan paytda, siqilgan havo bilan', 'LOTO va kondensatorlar zaryadsizlangandan keyin', 'Faqat eshikni ochiq qoldirib, smena davomida'],
            ru: ['На ходу, сжатым воздухом', 'После LOTO и разряда конденсаторов', 'Оставив дверь открытой на всю смену'],
            en: ['While running, with compressed air', 'After LOTO and capacitor discharge', 'By leaving the door open for the shift']
          },
          answer: 1
        }
      }
    ],
    quiz: [
      { q: { uz: 'Profilaktik xizmat rejasini qaysi uskunalardan boshlash kerak?', ru: 'С какого оборудования начинают план ППО?', en: 'Which equipment should a PM plan start with?' }, options: { uz: ['Eng arzon uskunalardan', 'Eng yangi uskunalardan', 'To‘xtasa butun liniyani to‘xtatadigan uskunalardan', 'Alifbo tartibida'], ru: ['С самого дешёвого', 'С самого нового', 'С того, остановка которого останавливает всю линию', 'По алфавиту'], en: ['The cheapest equipment', 'The newest equipment', 'Equipment whose stop halts the whole line', 'In alphabetical order'] }, answer: 2 },
      { q: { uz: 'Og‘ir sharoitda (chang, issiqlik, uch smena) xizmat oralig‘i bilan nima qilinadi?', ru: 'Что делают с интервалом обслуживания в тяжёлых условиях (пыль, жара, три смены)?', en: 'What happens to the service interval in harsh conditions (dust, heat, three shifts)?' }, options: { uz: ['Ikki barobar uzaytiriladi', 'Qisqartirish kerak bo‘lishi mumkin', 'Bekor qilinadi', 'O‘zgarmaydi, hech qachon'], ru: ['Удваивают', 'Может понадобиться сократить', 'Отменяют', 'Никогда не меняют'], en: ['It is doubled', 'It may need to be shortened', 'It is cancelled', 'It never changes'] }, answer: 1 },
      { q: { uz: 'Robotda har kuni operator nimani tekshiradi?', ru: 'Что оператор проверяет на роботе ежедневно?', en: 'What does the operator check on a robot every day?' }, options: { uz: ['Kabel paketi va shlanglar holatini', 'Reduktor moyini almashtirishni', 'Servo parametrlarini', 'Kontroller dasturiy ta’minotini yangilashni'], ru: ['Состояние кабельного пакета и шлангов', 'Замену масла в редукторе', 'Параметры сервоприводов', 'Обновление ПО контроллера'], en: ['The condition of the dress pack and hoses', 'Changing the gearbox oil', 'Servo parameters', 'Updating controller software'] }, answer: 0 },
      { q: { uz: 'Ba’zi robotlarda enkoder batareyasi nima uchun kontroller yoqilgan holda almashtiriladi?', ru: 'Почему у некоторых роботов батарею энкодеров меняют при включённом контроллере?', en: 'Why is the encoder battery replaced with the controller on for some robots?' }, options: { uz: ['Tezroq bo‘lishi uchun', 'Batareya qizishi uchun', 'Ventilyator ishlashi uchun', 'Pozitsiya ma’lumoti yo‘qolmasligi uchun'], ru: ['Чтобы было быстрее', 'Чтобы батарея прогрелась', 'Чтобы работал вентилятор', 'Чтобы не потерять данные положения'], en: ['To make it faster', 'To warm the battery', 'To keep the fan running', 'So position data is not lost'] }, answer: 3 },
      { q: { uz: 'MSS konsentratsiyasi qanday asbob bilan o‘lchanadi?', ru: 'Чем измеряют концентрацию СОЖ?', en: 'What tool measures coolant concentration?' }, options: { uz: ['Multimetr', 'Refraktometr', 'Manometr', 'Termometr'], ru: ['Мультиметром', 'Рефрактометром', 'Манометром', 'Термометром'], en: ['A multimeter', 'A refractometer', 'A pressure gauge', 'A thermometer'] }, answer: 1 },
      { q: { uz: 'Yo‘naltiruvchilarni moylash tizimida moy sarflanmayapti. Bu nimani bildiradi?', ru: 'Масло в системе смазки направляющих не расходуется. Что это значит?', en: 'The way lube oil level is not going down. What does it mean?' }, options: { uz: ['Hammasi joyida, moy tejalmoqda', 'MSS juda kuchli', 'Moylash tizimida nosozlik bo‘lishi mumkin', 'Stanok kam ishlagan'], ru: ['Всё в порядке, масло экономится', 'СОЖ слишком концентрированная', 'Возможна неисправность системы смазки', 'Станок мало работал'], en: ['All good, oil is being saved', 'Coolant is too strong', 'There may be a fault in the lube system', 'The machine ran very little'] }, answer: 2 },
      { q: { uz: 'MSS dan yoqimsiz hid kelsa, bu odatda nimani bildiradi?', ru: 'Что обычно означает неприятный запах СОЖ?', en: 'What does a bad coolant smell usually mean?' }, options: { uz: ['Bakteriyalar ko‘paygan', 'Konsentratsiya juda yuqori', 'Nasos yangi', 'Harorat past'], ru: ['Размножились бактерии', 'Концентрация слишком высокая', 'Насос новый', 'Температура низкая'], en: ['Bacteria are growing', 'Concentration is too high', 'The pump is new', 'Temperature is low'] }, answer: 0 },
      { q: { uz: 'Drayver shkafi eshigini ochiq qoldirish nima uchun noto‘g‘ri?', ru: 'Почему нельзя оставлять дверь шкафа приводов открытой?', en: 'Why should a drive cabinet door not be left open?' }, options: { uz: ['Displey ko‘rinmay qoladi', 'Sovutish oqimi buziladi va chang kiradi', 'Drayver tezroq ishlaydi', 'Bu hech narsaga ta’sir qilmaydi'], ru: ['Не видно дисплея', 'Нарушается поток охлаждения и попадает пыль', 'Привод работает быстрее', 'Это ни на что не влияет'], en: ['The display cannot be seen', 'Cooling airflow is disturbed and dust gets in', 'The drive runs faster', 'It makes no difference'] }, answer: 1 },
      { q: { uz: 'Ishlab turgan shkafda termokamera bilan tekshiruvni kim bajaradi?', ru: 'Кто проводит тепловизионный контроль работающего шкафа?', en: 'Who does a thermal camera check of a running cabinet?' }, options: { uz: ['Ixtiyoriy operator', 'Smenaning yangi xodimi', 'Hech kim, bu taqiqlangan', 'Qoidalar va himoya vositalari bilan malakali elektrik'], ru: ['Любой оператор', 'Новый сотрудник смены', 'Никто, это запрещено', 'Квалифицированный электрик по правилам и в СИЗ'], en: ['Any operator', 'A new shift employee', 'Nobody, it is forbidden', 'A qualified electrician under the rules and with PPE'] }, answer: 3 },
      { q: { uz: 'Xizmat jurnalidagi yozuvda nima bo‘lishi shart emas?', ru: 'Что НЕ обязательно должно быть в записи журнала обслуживания?', en: 'What does NOT need to be in a logbook entry?' }, options: { uz: ['Sana va uskuna raqami', 'O‘lchangan qiymatlar', 'Bajaruvchining ismi', 'Ob-havo ma’lumoti'], ru: ['Дата и номер оборудования', 'Измеренные значения', 'Фамилия исполнителя', 'Прогноз погоды'], en: ['Date and equipment number', 'Measured values', 'Name of the person', 'The weather forecast'] }, answer: 3 }
    ]
  },
  {
    slug: 'fanuc-r30ib-operator', level: 'advanced', equipment: 'FANUC R-30iB', hours: 6, sort: 6,
    title: { uz: 'FANUC R-30iB: operator va birlamchi diagnostika', ru: 'FANUC R-30iB: оператор и первичная диагностика', en: 'FANUC R-30iB: operator and first-line diagnostics' },
    summary: {
      uz: 'Teach pendant asoslari va AUTO, T1, T2 rejimlari, DEADMAN tugmasi va xavfsizlik, alarmlar tarixini o‘qish, tipik SRVO alarmlari va image backup.',
      ru: 'Основы пульта обучения и режимы AUTO, T1, T2, кнопка DEADMAN и безопасность, чтение истории алармов, типовые алармы SRVO и image backup.',
      en: 'Teach pendant basics and the AUTO, T1 and T2 modes, the DEADMAN switch and safety, reading the alarm history, common SRVO alarms and image backup.'
    },
    audience: { uz: 'FANUC robot operatorlari, smena texniklari', ru: 'Операторы роботов FANUC, сменные техники', en: 'FANUC robot operators, shift technicians' },
    lessons: [
      {
        title: { uz: 'Teach pendant va ish rejimlari', ru: 'Пульт обучения и режимы работы', en: 'Teach pendant and operating modes' },
        body: {
          uz: `R-30iB kontrollerida robot teach pendant (TP) orqali boshqariladi. Asosiy elementlarni bilish xatolarning ko‘pini oldini oladi.

## Asosiy elementlar
- **TP yoqish/o‘chirish kaliti (ON/OFF).** Qo‘lda rejimda TP dan boshqarish uchun ON bo‘lishi kerak. Avtomatik ishda odatda OFF.
- **DEADMAN tugmalari.** TP ning orqa tomonida, uch holatli.
- **E-stop tugmasi.** TP ning yuqori qismida.
- **SHIFT.** Jog harakati va ko‘p buyruqlar SHIFT bilan birga bajariladi.
- **RESET.** Sabab bartaraf etilgandan keyin alarmni tiklaydi.
- **COORD.** Koordinatalar tizimini tanlaydi: JOINT, JGFRM, WORLD, TOOL, USER.
- **Tezlik tugmalari (override).** Jog va dastur tezligini foizda o‘zgartiradi.
- **MENU, SELECT, EDIT, DATA, FCTN.** Menyular, dasturlar ro‘yxati, tahrirlash va registrlar.

## Rejimlar
Rejim kontroller pultidagi kalitli almashtirgich bilan tanlanadi:
- **AUTO:** dastur avtomatik ishlaydi, himoya to‘siqlari yopiq bo‘lishi shart.
- **T1:** qo‘lda, tezlik 250 mm/s dan oshmaydi. O‘rgatish va tekshirish uchun asosiy rejim.
- **T2:** qo‘lda, dastur tezligida. Ba’zi tizimlarda o‘rnatilmagan. Faqat ruxsat etilgan xodim va ehtiyotkorlik bilan.

> Rejim kalitini o‘zingiz bilan olib yuring. Kalitni almashtirgichda qoldirish begona odamning rejimni AUTO ga o‘tkazishiga yo‘l ochadi.`,
          ru: `На контроллере R-30iB робот управляется с пульта обучения (TP). Знание основных элементов предотвращает большинство ошибок.

## Основные элементы
- **Ключ включения TP (ON/OFF).** Для управления с TP в ручном режиме должен стоять в ON. В автоматической работе обычно OFF.
- **Кнопки DEADMAN.** На задней стороне TP, трёхпозиционные.
- **Кнопка E-stop.** В верхней части TP.
- **SHIFT.** Ручное перемещение и многие команды выполняются вместе с SHIFT.
- **RESET.** Сбрасывает аларм после устранения причины.
- **COORD.** Выбор системы координат: JOINT, JGFRM, WORLD, TOOL, USER.
- **Кнопки скорости (override).** Меняют скорость ручного перемещения и программы в процентах.
- **MENU, SELECT, EDIT, DATA, FCTN.** Меню, список программ, редактирование и регистры.

## Режимы
Режим выбирается ключевым переключателем на панели контроллера:
- **AUTO:** программа выполняется автоматически, ограждения должны быть закрыты.
- **T1:** ручной, скорость не более 250 мм/с. Основной режим для обучения и проверки.
- **T2:** ручной, на программной скорости. На некоторых системах не установлен. Только допущенный персонал и с осторожностью.

> Носите ключ режима с собой. Ключ, оставленный в переключателе, позволяет постороннему перевести робот в AUTO.`,
          en: `On the R-30iB controller the robot is operated from the teach pendant (TP). Knowing the main elements prevents most mistakes.

## Main elements
- **TP enable switch (ON/OFF).** Must be ON to operate from the TP in manual mode. Normally OFF during automatic running.
- **DEADMAN switches.** On the back of the TP, three-position.
- **E-stop button.** At the top of the TP.
- **SHIFT.** Jogging and many commands are done together with SHIFT.
- **RESET.** Clears an alarm after its cause has been removed.
- **COORD.** Selects the coordinate system: JOINT, JGFRM, WORLD, TOOL, USER.
- **Speed (override) keys.** Change jog and program speed in percent.
- **MENU, SELECT, EDIT, DATA, FCTN.** Menus, the program list, editing and registers.

## Modes
The mode is selected with the key switch on the controller panel:
- **AUTO:** the program runs automatically; guards must be closed.
- **T1:** manual, speed no more than 250 mm/s. The main mode for teaching and checking.
- **T2:** manual at program speed. Not installed on some systems. Only for authorised staff, with care.

> Carry the mode key with you. A key left in the switch lets someone else turn the robot to AUTO.`
        },
        check: {
          q: { uz: 'R-30iB da T1 rejimining asosiy xususiyati nima?', ru: 'Главная особенность режима T1 на R-30iB?', en: 'What is the key feature of T1 mode on the R-30iB?' },
          options: {
            uz: ['Dastur to‘siqlar ochiq holda avtomatik ishlaydi', 'Qo‘lda rejim, tezlik 250 mm/s dan oshmaydi', 'Qo‘lda rejim, dastur tezligida'],
            ru: ['Программа выполняется автоматически при открытых ограждениях', 'Ручной режим, скорость не более 250 мм/с', 'Ручной режим на программной скорости'],
            en: ['The program runs automatically with guards open', 'Manual mode, speed no more than 250 mm/s', 'Manual mode at program speed']
          },
          answer: 1
        }
      },
      {
        title: { uz: 'DEADMAN va xavfsiz jog', ru: 'DEADMAN и безопасное перемещение', en: 'DEADMAN and safe jogging' },
        body: {
          uz: `DEADMAN tugmasi uch holatli: qo‘yib yuborilgan, o‘rta holat va oxirigacha siqilgan. Harakat faqat o‘rta holatda mumkin. Qo‘yib yuborish yoki qo‘rqib qattiq siqish robotni darhol to‘xtatadi.

## Robotni jog qilish tartibi
1. Rejim kalitini T1 ga o‘tkazing.
2. TP kalitini ON holatiga qo‘ying.
3. DEADMAN ni o‘rta holatda ushlab turing va RESET bilan alarmlarni tiklang.
4. COORD bilan koordinata tizimini tanlang, past tezlikni (masalan, bir necha foiz) o‘rnating.
5. SHIFT ni bosib turib, jog tugmasini bosing. Robot qaysi tomonga borishini oldindan o‘ylang.

## Odatiy xavfsizlik alarmlari
Bular nosozlik emas, xavfsizlik zanjiri ishlaganini bildiradi:
- **SRVO-001 Operator panel E-stop:** kontroller pultidagi E-stop bosilgan.
- **SRVO-002 Teach pendant E-stop:** TP dagi E-stop bosilgan.
- **SRVO-003 Deadman switch released:** qo‘lda rejimda DEADMAN qo‘yib yuborilgan.
- **SRVO-004 Fence open:** himoya eshigi yoki to‘siq zanjiri ochiq.
- **SRVO-007 External emergency stops:** tashqi E-stop zanjiri (kamera atrofi yoki PLC) uzilgan.

Avval sababni toping: qaysi tugma bosilgan, qaysi eshik ochiq. Keyin E-stop ni bo‘shating va RESET bosing.

> DEADMAN ni hech qachon lenta, rezina yoki qisqich bilan bosib qo‘ymang. Xavfsizlik zanjiri sabab topilmasdan qayta-qayta uzilsa, muhandisni chaqiring.`,
          ru: `Кнопка DEADMAN трёхпозиционная: отпущена, среднее положение и полностью сжата. Движение возможно только в среднем положении. Если отпустить кнопку или в испуге сильно сжать её, робот сразу остановится.

## Порядок ручного перемещения
1. Переведите ключ режима в T1.
2. Поставьте ключ TP в положение ON.
3. Удерживайте DEADMAN в среднем положении и сбросьте алармы кнопкой RESET.
4. Кнопкой COORD выберите систему координат, установите низкую скорость (например, несколько процентов).
5. Удерживая SHIFT, нажмите кнопку перемещения. Заранее подумайте, куда пойдёт робот.

## Обычные алармы безопасности
Это не неисправность, а срабатывание цепи безопасности:
- **SRVO-001 Operator panel E-stop:** нажат E-stop на панели контроллера.
- **SRVO-002 Teach pendant E-stop:** нажат E-stop на TP.
- **SRVO-003 Deadman switch released:** в ручном режиме отпущен DEADMAN.
- **SRVO-004 Fence open:** открыта защитная дверь или цепь ограждения.
- **SRVO-007 External emergency stops:** разомкнута внешняя цепь E-stop (по периметру ячейки или от ПЛК).

Сначала найдите причину: какая кнопка нажата, какая дверь открыта. Затем отпустите E-stop и нажмите RESET.

> Никогда не фиксируйте DEADMAN лентой, резинкой или зажимом. Если цепь безопасности размыкается снова и снова без видимой причины, вызовите инженера.`,
          en: `The DEADMAN switch has three positions: released, middle and fully squeezed. Motion is only possible in the middle position. Letting go, or squeezing hard in a panic, stops the robot at once.

## How to jog the robot
1. Turn the mode key to T1.
2. Set the TP enable switch to ON.
3. Hold DEADMAN in the middle position and clear alarms with RESET.
4. Choose the coordinate system with COORD and set a low speed (for example a few percent).
5. Hold SHIFT and press a jog key. Think in advance about which way the robot will move.

## Common safety alarms
These are not faults; they show that the safety circuit has acted:
- **SRVO-001 Operator panel E-stop:** the E-stop on the controller panel is pressed.
- **SRVO-002 Teach pendant E-stop:** the E-stop on the TP is pressed.
- **SRVO-003 Deadman switch released:** DEADMAN was released in manual mode.
- **SRVO-004 Fence open:** a guard door or the fence circuit is open.
- **SRVO-007 External emergency stops:** the external E-stop circuit (around the cell or from the PLC) is open.

Find the cause first: which button is pressed, which door is open. Then release the E-stop and press RESET.

> Never hold DEADMAN down with tape, a rubber band or a clamp. If the safety circuit keeps opening with no visible cause, call the engineer.`
        },
        check: {
          q: { uz: 'SRVO-004 Fence open alarmi chiqsa, avval nima qilinadi?', ru: 'Что делают сначала при аларме SRVO-004 Fence open?', en: 'What is done first when SRVO-004 Fence open appears?' },
          options: {
            uz: ['Eshik datchigiga ko‘prikcha qo‘yiladi', 'Kontroller qayta yuklanadi', 'Qaysi eshik yoki to‘siq zanjiri ochiqligi aniqlanadi'],
            ru: ['Ставят перемычку на датчик двери', 'Перезагружают контроллер', 'Выясняют, какая дверь или цепь ограждения открыта'],
            en: ['A jumper is fitted on the door switch', 'The controller is rebooted', 'Find which door or fence circuit is open']
          },
          answer: 2
        }
      },
      {
        title: { uz: 'Alarmlar tarixi va SRVO alarmlari', ru: 'История алармов и алармы SRVO', en: 'Alarm history and SRVO alarms' },
        body: {
          uz: `## Alarmlar tarixini ochish
**MENU → ALARM** ni tanlang. Odatda faol alarmlar ko‘rsatiladi, **HIST** funksiya tugmasi tarixni ochadi. Qatorni tanlab, tafsilotlar ekranini oching: u yerda alarm kodi, matni, sana va vaqt hamda ko‘pincha sabab kodi bor. Har doim **birinchi** alarmni qidiring: keyingilari ko‘pincha uning oqibati.

Alarm kodi uch qismdan iborat: guruh (SRVO, MOTN, INTP, SYST), raqam va matn. Masalan, SRVO servo tizimi va xavfsizlik zanjiri bilan bog‘liq.

## Operator nima qila oladi
- **SRVO-001, 002, 003, 004, 007:** E-stop, DEADMAN, eshik zanjiri. Sababni bartaraf eting va RESET bosing.
- **SRVO-065 BLAL alarm:** enkoder batareyasi kuchsizlangan. Robotni ishlatish mumkin, lekin batareyalarni tez orada almashtirish kerak. Xizmat ko‘rsatish bo‘limiga darhol xabar bering. Almashtirish qo‘llanma bo‘yicha kontroller yoqilgan holda bajariladi, aks holda pozitsiya ma’lumoti yo‘qoladi.

## Muhandis kerak bo‘lgan holatlar
- **SRVO-050 Collision detect alarm:** to‘qnashuv aniqlangan. Kodni yozing, robot va asbobni ko‘zdan kechiring, dasturni qayta-qayta ishga tushirmang. Yuk ma’lumotlari va sezgirlik sozlamalari muhandis ishi.
- **SRVO-062 BZAL alarm:** enkoder batareya kuchlanishi to‘liq yo‘qolgan. Robot pozitsiyasini bilmaydi, mastering kerak bo‘ladi. Robotni harakatlantirmang.
- Takrorlanuvchi yoki tushunarsiz SRVO alarmlari, masalan, haddan tashqari xatolik (stop/move error excessive) yoki kuchaytirgich bilan bog‘liq alarmlar.

> Bir xil alarm RESET dan keyin yana chiqsa, uni qayta-qayta tiklamang. Bu muammoni yashiradi va mexanikani shikastlashi mumkin.`,
          ru: `## Как открыть историю алармов
Выберите **MENU → ALARM**. Обычно показываются активные алармы, функциональная клавиша **HIST** открывает историю. Выберите строку и откройте экран подробностей: там код аларма, текст, дата и время, а часто и код причины. Всегда ищите **первый** аларм: следующие часто являются его следствием.

Код аларма состоит из трёх частей: группа (SRVO, MOTN, INTP, SYST и другие), номер и текст. Например, SRVO относится к сервосистеме и цепям безопасности.

## Что может сделать оператор
- **SRVO-001, 002, 003, 004, 007:** E-stop, DEADMAN, цепь двери. Устраните причину и нажмите RESET.
- **SRVO-065 BLAL alarm:** батарея энкодеров разряжается. Робот можно использовать, но батареи нужно скоро заменить. Сразу сообщите в службу обслуживания. Замену выполняют по руководству при включённом контроллере, иначе данные положения теряются.

## Когда нужен инженер
- **SRVO-050 Collision detect alarm:** обнаружено столкновение. Запишите код, осмотрите робот и инструмент, не перезапускайте программу раз за разом. Данные нагрузки и настройки чувствительности это работа инженера.
- **SRVO-062 BZAL alarm:** напряжение батареи энкодера полностью пропало. Робот не знает своего положения, нужен мастеринг. Не перемещайте робот.
- Повторяющиеся или непонятные алармы SRVO, например превышение рассогласования (stop/move error excessive) или алармы усилителя.

> Если тот же аларм появляется снова после RESET, не сбрасывайте его раз за разом. Это скрывает проблему и может повредить механику.`,
          en: `## Opening the alarm history
Select **MENU → ALARM**. Active alarms are usually shown first, and the **HIST** function key opens the history. Select a line and open its detail screen: it shows the alarm code, text, date and time, and often a cause code. Always look for the **first** alarm: the later ones are often its consequence.

An alarm code has three parts: the group (SRVO, MOTN, INTP, SYST and others), a number and a text. For example, SRVO relates to the servo system and the safety circuits.

## What the operator may do
- **SRVO-001, 002, 003, 004, 007:** E-stop, DEADMAN, door circuit. Remove the cause and press RESET.
- **SRVO-065 BLAL alarm:** the encoder battery is getting low. The robot can still run, but the batteries must be replaced soon. Tell maintenance at once. They are replaced per the manual with the controller powered on, otherwise position data is lost.

## When the engineer is needed
- **SRVO-050 Collision detect alarm:** a collision was detected. Record the code, inspect the robot and tooling, and do not restart the program again and again. Payload data and sensitivity settings are engineer work.
- **SRVO-062 BZAL alarm:** the encoder battery voltage has been lost completely. The robot no longer knows its position and needs mastering. Do not move the robot.
- Repeating or unclear SRVO alarms, such as excessive position error (stop/move error excessive) or amplifier alarms.

> If the same alarm returns after RESET, do not keep resetting it. That hides the problem and can damage the mechanics.`
        },
        check: {
          q: { uz: 'SRVO-062 BZAL alarmida operator nima qiladi?', ru: 'Что делает оператор при аларме SRVO-062 BZAL?', en: 'What does the operator do on SRVO-062 BZAL?' },
          options: {
            uz: ['Robotni harakatlantirmaydi va muhandisni chaqiradi', 'RESET bosib, ishni davom ettiradi', 'O‘zi mastering qiladi'],
            ru: ['Не перемещает робот и вызывает инженера', 'Нажимает RESET и продолжает работу', 'Сам выполняет мастеринг'],
            en: ['Does not move the robot and calls the engineer', 'Presses RESET and carries on', 'Does the mastering himself']
          },
          answer: 0
        }
      },
      {
        title: { uz: 'Image backup', ru: 'Image backup', en: 'Image backup' },
        body: {
          uz: `FANUC da ikki xil zaxira nusxa bor va ular bir-birini almashtirmaydi.

## Fayl backup (All of above)
**MENU → FILE** ekranida qurilmani (masalan, USB, UD1:) tanlab, **BACKUP → All of above** bajariladi. Dasturlar, registrlar va sozlamalar alohida fayllar ko‘rinishida saqlanadi. Bu dasturlarni tiklash va solishtirish uchun qulay.

## Image backup
Image backup kontroller xotirasining to‘liq nusxasi: tizim dasturiy ta’minoti, opsiyalar, sozlamalar va dasturlar. Kontroller ishdan chiqsa yoki xotira kartasi almashtirilsa, aynan image nusxa robotni avvalgi holatiga qaytaradi.

## Tartib (umumiy)
1. Smena boshlig‘idan ruxsat oling: robot ishlab chiqarishdan chiqariladi.
2. Robotni xavfsiz holatga keltiring, dasturni to‘xtating.
3. Formatlangan va yetarli hajmli USB fleshkani TP yoki kontroller portiga ulang.
4. Kontrollerni o‘chiring va FANUC qo‘llanmasidagi tugmalar kombinatsiyasini bosib turib yoqing (R-30iB da odatda F1 va F5). Boot Monitor menyusi ochiladi.
5. **Controller backup/restore → Backup Controller as Images** ni tanlang va qurilmani ko‘rsating.
6. Tugashini kuting, ekrandagi ko‘rsatma bo‘yicha kontrollerni qayta yoqing.
7. Nusxani robot raqami va sana bilan nomlang va kamida ikki joyda saqlang.

## Restore
Image nusxani qayta yuklash (restore) robotdagi barcha joriy ma’lumotlarni almashtiradi. Bu faqat muhandis ishi.

> Jarayon davomida kontrollerni o‘chirmang va fleshkani chiqarmang.`,
          ru: `У FANUC есть два вида резервных копий, и они не заменяют друг друга.

## Файловая копия (All of above)
На экране **MENU → FILE** выберите устройство (например, USB, UD1:) и выполните **BACKUP → All of above**. Программы, регистры и настройки сохраняются отдельными файлами. Это удобно для восстановления и сравнения программ.

## Image backup
Image backup это полная копия памяти контроллера: системное ПО, опции, настройки и программы. Если контроллер выйдет из строя или заменят карту памяти, именно образ вернёт робот в прежнее состояние.

## Порядок (общий)
1. Получите разрешение мастера смены: робот выводится из производства.
2. Приведите робот в безопасное состояние, остановите программу.
3. Подключите отформатированную флешку достаточного объёма в порт TP или контроллера.
4. Выключите контроллер и включите его, удерживая комбинацию клавиш из руководства FANUC (на R-30iB обычно F1 и F5). Откроется меню Boot Monitor.
5. Выберите **Controller backup/restore → Backup Controller as Images** и укажите устройство.
6. Дождитесь окончания и перезапустите контроллер по указанию на экране.
7. Назовите копию номером робота и датой и храните минимум в двух местах.

## Restore
Загрузка образа (restore) заменяет все текущие данные робота. Это работа только для инженера.

> Во время процесса не выключайте контроллер и не вынимайте флешку.`,
          en: `FANUC has two kinds of backup, and one does not replace the other.

## File backup (All of above)
On the **MENU → FILE** screen choose the device (for example USB, UD1:) and run **BACKUP → All of above**. Programs, registers and settings are saved as separate files. This is handy for restoring and comparing programs.

## Image backup
An image backup is a full copy of the controller memory: system software, options, settings and programs. If the controller fails or its memory card is replaced, the image is what brings the robot back to its previous state.

## Procedure (general)
1. Get permission from the shift leader: the robot is taken out of production.
2. Bring the robot to a safe state and stop the program.
3. Plug a formatted USB stick with enough space into the TP or controller port.
4. Switch the controller off and switch it on while holding the key combination given in the FANUC manual (on the R-30iB usually F1 and F5). The Boot Monitor menu opens.
5. Select **Controller backup/restore → Backup Controller as Images** and choose the device.
6. Wait until it finishes and restart the controller as the screen instructs.
7. Name the copy with the robot number and date and keep it in at least two places.

## Restore
Loading an image (restore) replaces all current data on the robot. This is engineer-only work.

> Do not switch off the controller or pull out the USB stick during the process.`
        },
        check: {
          q: { uz: 'Image backup ning fayl backup dan asosiy farqi nima?', ru: 'Главное отличие image backup от файловой копии?', en: 'What is the main difference between an image backup and a file backup?' },
          options: {
            uz: ['Image faqat dasturlarni saqlaydi', 'Image kontroller xotirasining to‘liq nusxasi', 'Image robot ishlab turganida avtomatik olinadi'],
            ru: ['Образ хранит только программы', 'Образ это полная копия памяти контроллера', 'Образ делается автоматически во время работы'],
            en: ['The image stores programs only', 'The image is a full copy of the controller memory', 'The image is taken automatically while running']
          },
          answer: 1
        }
      }
    ],
    quiz: [
      { q: { uz: 'R-30iB da DEADMAN tugmalari qayerda joylashgan?', ru: 'Где расположены кнопки DEADMAN на R-30iB?', en: 'Where are the DEADMAN switches on the R-30iB?' }, options: { uz: ['Kontroller eshigida', 'Teach pendant ning orqa tomonida', 'Robot bilagida', 'Kamera eshigida'], ru: ['На двери контроллера', 'На задней стороне пульта обучения', 'На запястье робота', 'На двери ячейки'], en: ['On the controller door', 'On the back of the teach pendant', 'On the robot wrist', 'On the cell door'] }, answer: 1 },
      { q: { uz: 'Jog qilish uchun qaysi tugma jog tugmasi bilan birga bosib turiladi?', ru: 'Какую кнопку удерживают вместе с кнопкой перемещения?', en: 'Which key is held together with a jog key to jog?' }, options: { uz: ['RESET', 'FCTN', 'SHIFT', 'MENU'], ru: ['RESET', 'FCTN', 'SHIFT', 'MENU'], en: ['RESET', 'FCTN', 'SHIFT', 'MENU'] }, answer: 2 },
      { q: { uz: 'SRVO-003 alarmi nimani bildiradi?', ru: 'Что означает аларм SRVO-003?', en: 'What does alarm SRVO-003 mean?' }, options: { uz: ['DEADMAN qo‘yib yuborilgan', 'Enkoder batareyasi kuchsiz', 'To‘qnashuv aniqlangan', 'Himoya eshigi ochiq'], ru: ['Отпущен DEADMAN', 'Разряжается батарея энкодера', 'Обнаружено столкновение', 'Открыта защитная дверь'], en: ['DEADMAN was released', 'The encoder battery is low', 'A collision was detected', 'A guard door is open'] }, answer: 0 },
      { q: { uz: 'SRVO-065 BLAL alarmi chiqsa, to‘g‘ri harakat qaysi?', ru: 'Как правильно действовать при аларме SRVO-065 BLAL?', en: 'What is the right action on SRVO-065 BLAL?' }, options: { uz: ['Darhol kontrollerni o‘chirish', 'Alarmga e’tibor bermaslik', 'O‘zi mastering qilish', 'Xizmat bo‘limiga xabar berib, batareyalarni tez orada almashtirishni rejalashtirish'], ru: ['Сразу выключить контроллер', 'Не обращать внимания', 'Самому сделать мастеринг', 'Сообщить в службу обслуживания и запланировать скорую замену батарей'], en: ['Switch the controller off at once', 'Ignore the alarm', 'Do the mastering yourself', 'Tell maintenance and plan an early battery replacement'] }, answer: 3 },
      { q: { uz: 'FANUC enkoder batareyalari odatda qanday holatda almashtiriladi?', ru: 'Как обычно меняют батареи энкодеров FANUC?', en: 'How are FANUC encoder batteries normally replaced?' }, options: { uz: ['Kontroller o‘chiq va bir kun o‘tgach', 'Qo‘llanma bo‘yicha kontroller yoqilgan holda', 'Robot avtomatik rejimda ishlayotganda', 'Faqat mastering dan keyin'], ru: ['При выключенном контроллере через сутки', 'По руководству при включённом контроллере', 'Во время работы в автоматическом режиме', 'Только после мастеринга'], en: ['With the controller off for a day', 'Per the manual, with the controller powered on', 'While the robot runs in automatic', 'Only after mastering'] }, answer: 1 },
      { q: { uz: 'Alarmlar tarixida birinchi navbatda qaysi alarmni qidirish kerak?', ru: 'Какой аларм в истории нужно искать в первую очередь?', en: 'Which alarm in the history should you look for first?' }, options: { uz: ['Eng oxirgisini', 'Eng uzun matnlisini', 'Birinchi chiqqan alarmni', 'Faqat WARN darajasidagilarni'], ru: ['Самый последний', 'С самым длинным текстом', 'Первый возникший аларм', 'Только уровня WARN'], en: ['The latest one', 'The one with the longest text', 'The first alarm that occurred', 'Only WARN level ones'] }, answer: 2 },
      { q: { uz: 'SRVO-050 Collision detect alarmidan keyin nima qilinmaydi?', ru: 'Чего НЕ делают после аларма SRVO-050 Collision detect?', en: 'What is NOT done after SRVO-050 Collision detect?' }, options: { uz: ['Kodni yozib olish', 'Robot va asbobni ko‘zdan kechirish', 'Muhandisga xabar berish', 'Dasturni qayta-qayta ishga tushirish'], ru: ['Записать код', 'Осмотреть робот и инструмент', 'Сообщить инженеру', 'Перезапускать программу снова и снова'], en: ['Record the code', 'Inspect the robot and tooling', 'Inform the engineer', 'Restart the program again and again'] }, answer: 3 },
      { q: { uz: 'Fayl backup qaysi menyudan olinadi?', ru: 'Из какого меню делается файловая копия?', en: 'Which menu creates a file backup?' }, options: { uz: ['MENU → FILE', 'MENU → ALARM', 'MENU → SETUP → Frames', 'FCTN → ABORT'], ru: ['MENU → FILE', 'MENU → ALARM', 'MENU → SETUP → Frames', 'FCTN → ABORT'], en: ['MENU → FILE', 'MENU → ALARM', 'MENU → SETUP → Frames', 'FCTN → ABORT'] }, answer: 0 },
      { q: { uz: 'Image nusxani robotga qayta yuklashni (restore) kim bajaradi?', ru: 'Кто выполняет загрузку образа в робот (restore)?', en: 'Who performs an image restore on the robot?' }, options: { uz: ['Har qanday operator', 'Faqat muhandis', 'Smena boshlig‘i', 'Tozalovchi xodim'], ru: ['Любой оператор', 'Только инженер', 'Мастер смены', 'Уборщик'], en: ['Any operator', 'Only the engineer', 'The shift leader', 'The cleaner'] }, answer: 1 },
      { q: { uz: 'Rejim kalitini nima uchun almashtirgichda qoldirmaslik kerak?', ru: 'Почему нельзя оставлять ключ режима в переключателе?', en: 'Why must the mode key not be left in the switch?' }, options: { uz: ['Kalit sinishi mumkin', 'Kontroller qiziydi', 'Begona odam robotni AUTO ga o‘tkazishi mumkin', 'Batareya tez tugaydi'], ru: ['Ключ может сломаться', 'Контроллер перегревается', 'Посторонний может перевести робот в AUTO', 'Быстрее садится батарея'], en: ['The key may break', 'The controller overheats', 'Someone else could switch the robot to AUTO', 'The battery drains faster'] }, answer: 2 }
    ]
  },
  {
    slug: 'plc-sensors-basics', level: 'advanced', equipment: 'Siemens S7 / sensors', hours: 6, sort: 7,
    title: { uz: 'PLC va datchiklar asoslari: Siemens S7', ru: 'Основы ПЛК и датчиков: Siemens S7', en: 'PLC and sensor basics: Siemens S7' },
    summary: {
      uz: 'PLC kirish va chiqishlari, PNP va NPN datchiklar, induktiv va optik datchiklar, I/O holat chiroqlarini o‘qish, nosoz datchik yoki simni tizimli topish va muhandisni qachon chaqirish.',
      ru: 'Входы и выходы ПЛК, датчики PNP и NPN, индуктивные и оптические датчики, чтение светодиодов состояния I/O, системный поиск неисправного датчика или провода и когда вызывать инженера.',
      en: 'PLC inputs and outputs, PNP and NPN sensors, inductive and optical sensors, reading I/O status LEDs, a systematic way to find a failed sensor or wire, and when to call the engineer.'
    },
    audience: { uz: 'Smena texniklari, elektriklar, tajribali operatorlar', ru: 'Сменные техники, электрики, опытные операторы', en: 'Shift technicians, electricians, experienced operators' },
    lessons: [
      {
        title: { uz: 'PLC kirish va chiqishlari', ru: 'Входы и выходы ПЛК', en: 'PLC inputs and outputs' },
        body: {
          uz: `PLC (dasturlanadigan mantiqiy kontroller) mashinaning «miyasi». U datchiklardan signallarni o‘qiydi, dastur bo‘yicha qaror qabul qiladi va ijro qurilmalarini boshqaradi.

## Skanerlash sikli
1. Barcha kirishlarning holati o‘qiladi.
2. Dastur bajariladi.
3. Chiqishlar yangilanadi.
Bu sikl millisekundlarda takrorlanadi.

## Kirishlar (DI)
Raqamli kirish modullari odatda 24 V DC bilan ishlaydi. Ularga datchiklar, tugmalar, oxirgi o‘chirgichlar ulanadi. Siemens S7 da manzillar **%I0.0**, **%I0.1** ko‘rinishida: bayt raqami va bit raqami.

## Chiqishlar (DQ)
Chiqishlar klapan g‘altaklari, rele, signal chiroqlari va kontaktorlarni boshqaradi. Manzillar **%Q0.0** ko‘rinishida. Tranzistorli chiqishlar tez va kichik yuk uchun, rele chiqishlari turli kuchlanishlarni ulashga imkon beradi.

## Holat chiroqlari (LED)
- Modulda har bir kanalning **yashil chirog‘i**: kanal yoqilgan (signal bor).
- Modulning **qizil ERROR yoki DIAG** chirog‘i: modul nosozligi, ta’minot yo‘qligi yoki sim uzilishi (diagnostika yoqilgan bo‘lsa).
- CPU da **RUN/STOP**, **ERROR** va **MAINT** chiroqlari dastur va tizim holatini ko‘rsatadi.

## Operatorning roli
Siz kuzatasiz va yozasiz: qaysi kanal yoqilgan, qaysi chiroq qizil. PLC ni STOP ga o‘tkazish, kirish yoki chiqishni majburlash (force) va dasturni o‘zgartirish faqat muhandis ishi.

> Force qilingan chiqish himoya mantiqini chetlab o‘tib, mashinani kutilmagan tarzda harakatlantirishi mumkin.`,
          ru: `ПЛК (программируемый логический контроллер) это «мозг» машины. Он читает сигналы датчиков, принимает решения по программе и управляет исполнительными устройствами.

## Цикл сканирования
1. Считывается состояние всех входов.
2. Выполняется программа.
3. Обновляются выходы.
Цикл повторяется за миллисекунды.

## Входы (DI)
Модули дискретных входов обычно работают от 24 В DC. К ним подключают датчики, кнопки, концевые выключатели. В Siemens S7 адреса выглядят как **%I0.0**, **%I0.1**: номер байта и номер бита.

## Выходы (DQ)
Выходы управляют катушками клапанов, реле, сигнальными лампами и контакторами. Адреса вида **%Q0.0**. Транзисторные выходы быстрые и рассчитаны на малую нагрузку, релейные позволяют коммутировать разные напряжения.

## Светодиоды состояния
- **Зелёный светодиод** каждого канала на модуле: канал включён (сигнал есть).
- **Красный ERROR или DIAG** модуля: неисправность модуля, нет питания или обрыв провода (если включена диагностика).
- Светодиоды **RUN/STOP**, **ERROR** и **MAINT** на CPU показывают состояние программы и системы.

## Роль оператора
Вы наблюдаете и записываете: какой канал горит, какой светодиод красный. Перевод ПЛК в STOP, принудительная установка (force) входов или выходов и изменение программы это работа только инженера.

> Принудительно включённый выход может обойти логику защиты и неожиданно привести машину в движение.`,
          en: `A PLC (programmable logic controller) is the "brain" of the machine. It reads signals from sensors, makes decisions according to its program and controls the actuators.

## The scan cycle
1. The state of all inputs is read.
2. The program is executed.
3. The outputs are updated.
The cycle repeats every few milliseconds.

## Inputs (DI)
Digital input modules usually work at 24 V DC. Sensors, push buttons and limit switches are wired to them. In Siemens S7, addresses look like **%I0.0**, **%I0.1**: a byte number and a bit number.

## Outputs (DQ)
Outputs drive valve coils, relays, signal lamps and contactors. Addresses look like **%Q0.0**. Transistor outputs are fast and meant for small loads; relay outputs can switch different voltages.

## Status LEDs
- The **green LED** of each channel on the module: the channel is on (signal present).
- The module **red ERROR or DIAG** LED: module fault, missing supply or a broken wire (if diagnostics are enabled).
- The **RUN/STOP**, **ERROR** and **MAINT** LEDs on the CPU show the program and system state.

## The operator role
You observe and record: which channel is lit, which LED is red. Switching the PLC to STOP, forcing inputs or outputs and changing the program are engineer-only work.

> A forced output can bypass the safety logic and move the machine unexpectedly.`
        },
        check: {
          q: { uz: 'Kirish yoki chiqishni majburlash (force) kimning ishi?', ru: 'Кто выполняет принудительную установку (force) входов и выходов?', en: 'Whose job is forcing inputs or outputs?' },
          options: {
            uz: ['Har qanday operatorning', 'Faqat muhandisning', 'Smena oxirida navbatchining'],
            ru: ['Любого оператора', 'Только инженера', 'Дежурного в конце смены'],
            en: ['Any operator', 'Only the engineer', 'The person on duty at shift end']
          },
          answer: 1
        }
      },
      {
        title: { uz: 'PNP va NPN datchiklar', ru: 'Датчики PNP и NPN', en: 'PNP and NPN sensors' },
        body: {
          uz: `Uch simli datchiklarning chiqishi tranzistor. Uning qaysi qutbni ulashiga qarab ikki tur bor.

## PNP (sourcing)
Datchik yoqilganda chiqish **+24 V** ni yukka, ya’ni PLC kirishiga beradi. Kirish moduli tokni 0 V ga olib ketadi. Yevropa uskunalarida va Siemens tizimlarida eng ko‘p uchraydigan tur.

## NPN (sinking)
Datchik yoqilganda chiqish yukni **0 V** ga ulaydi. Yukning ikkinchi uchi +24 V da bo‘ladi. Osiyo uskunalarida ko‘proq uchraydi.

## Nima uchun bu muhim
Kirish moduli bir turga mo‘ljallangan. PNP kirish moduliga NPN datchik ulansa (yoki aksincha), datchik chirog‘i yonadi, lekin PLC signalni ko‘rmaydi. Datchikni almashtirganda turini, kuchlanishini va chiqish turini (NO yoki NC) aynan bir xil tanlang.

## Sim ranglari
Ko‘pchilik uch simli DC datchiklarda (IEC 60947-5-2):
- **Jigarrang:** +24 V
- **Ko‘k:** 0 V
- **Qora:** chiqish
- **Oq:** ikkinchi chiqish (to‘rt simli datchiklarda)
Har doim datchik yorlig‘i va mashina chizmalariga qarab tasdiqlang.

## NO va NC
NO (normal ochiq) datchik obyekt borligida yoqiladi. NC (normal yopiq) esa obyekt borligida o‘chadi. Ba’zi mashinalarda simning uzilishini sezish uchun NC ishlatiladi.

> Datchik turi va ulanishini aniqlash yoki o‘zgartirish ruxsati sizda bo‘lmasa, muhandisga murojaat qiling.`,
          ru: `Выход трёхпроводного датчика это транзистор. По тому, какой полюс он коммутирует, различают два типа.

## PNP (sourcing)
При срабатывании выход подаёт **+24 В** на нагрузку, то есть на вход ПЛК. Входной модуль отводит ток на 0 В. Самый распространённый тип на европейском оборудовании и в системах Siemens.

## NPN (sinking)
При срабатывании выход подключает нагрузку к **0 В**. Второй конец нагрузки находится на +24 В. Чаще встречается на азиатском оборудовании.

## Почему это важно
Входной модуль рассчитан на один тип. Если к модулю PNP подключить датчик NPN (или наоборот), светодиод датчика загорится, но ПЛК сигнал не увидит. При замене датчика выбирайте точно такой же тип, напряжение и вид выхода (NO или NC).

## Цвета проводов
У большинства трёхпроводных датчиков DC (IEC 60947-5-2):
- **Коричневый:** +24 В
- **Синий:** 0 В
- **Чёрный:** выход
- **Белый:** второй выход (у четырёхпроводных датчиков)
Всегда сверяйтесь с этикеткой датчика и схемами машины.

## NO и NC
Датчик NO (нормально открытый) включается при наличии объекта. Датчик NC (нормально закрытый) при наличии объекта выключается. На некоторых машинах NC используют, чтобы обнаруживать обрыв провода.

> Если у вас нет допуска определять или менять тип и подключение датчика, обратитесь к инженеру.`,
          en: `The output of a three-wire sensor is a transistor. There are two types, depending on which pole it switches.

## PNP (sourcing)
When the sensor switches on, its output supplies **+24 V** to the load, that is the PLC input. The input module takes the current to 0 V. This is the most common type on European equipment and in Siemens systems.

## NPN (sinking)
When the sensor switches on, its output connects the load to **0 V**. The other end of the load sits at +24 V. It is more common on Asian equipment.

## Why it matters
An input module is designed for one type. If an NPN sensor is wired to a PNP input module (or the other way round), the sensor LED lights but the PLC does not see the signal. When replacing a sensor, choose exactly the same type, voltage and output form (NO or NC).

## Wire colours
On most three-wire DC sensors (IEC 60947-5-2):
- **Brown:** +24 V
- **Blue:** 0 V
- **Black:** output
- **White:** second output (on four-wire sensors)
Always confirm against the sensor label and the machine drawings.

## NO and NC
An NO (normally open) sensor switches on when the object is present. An NC (normally closed) sensor switches off when the object is present. Some machines use NC so that a broken wire can be detected.

> If you are not authorised to identify or change a sensor type or its wiring, ask the engineer.`
        },
        check: {
          q: { uz: 'PNP kirish moduliga NPN datchik ulansa nima bo‘ladi?', ru: 'Что будет, если к входному модулю PNP подключить датчик NPN?', en: 'What happens if an NPN sensor is wired to a PNP input module?' },
          options: {
            uz: ['Hammasi normal ishlaydi', 'Datchik chirog‘i yonadi, lekin PLC signalni ko‘rmaydi', 'PLC darhol STOP ga o‘tadi'],
            ru: ['Всё работает нормально', 'Светодиод датчика горит, но ПЛК не видит сигнал', 'ПЛК сразу переходит в STOP'],
            en: ['Everything works normally', 'The sensor LED lights but the PLC does not see the signal', 'The PLC goes to STOP at once']
          },
          answer: 1
        }
      },
      {
        title: { uz: 'Induktiv va optik datchiklar', ru: 'Индуктивные и оптические датчики', en: 'Inductive and optical sensors' },
        body: {
          uz: `## Induktiv datchiklar
Induktiv datchik elektromagnit maydon hosil qiladi va faqat **metallni** sezadi. Sezish masofasi kichik, odatda bir necha millimetr, aniq qiymat datchik yorlig‘ida.
- Nominal masofa po‘lat uchun beriladi. Alyuminiy, mis va zanglamaydigan po‘lat uchun masofa kichikroq.
- **Ko‘mib o‘rnatiladigan (flush)** datchik metallga botirib o‘rnatiladi, masofasi qisqa. **Ko‘milmaydigan (non-flush)** datchik masofasi uzunroq, lekin atrofida bo‘sh joy talab qiladi.
- Tipik muammolar: datchik va obyekt orasidagi masofa o‘zgargan (bo‘shagan kronshteyn), datchik yuziga metall qirindi yopishgan, mexanik zarba.

## Optik datchiklar
- **Qarama-qarshi nurli (through-beam):** alohida uzatkich va qabul qilgich. Eng ishonchli, katta masofa.
- **Reflektorli (retro-reflective):** nur reflektordan qaytadi. Yaltiroq obyektlar xato signal berishi mumkin, bunday holda polarizatsiya filtrli datchik ishlatiladi.
- **Diffuz:** nur obyektning o‘zidan qaytadi. Obyekt rangi va yuzasi natijaga ta’sir qiladi.
- Tipik muammolar: linza yoki reflektor iflos, o‘q siljigan, tashqi yorug‘lik, sezgirlik sozlamasi o‘zgargan.

## Datchikdagi chiroqlar
Ko‘p datchiklarda **yashil** chiroq ta’minot borligini, **sariq** yoki **to‘q sariq** chiroq chiqish yoqilganini bildiradi. Ranglar ishlab chiqaruvchiga qarab farq qilishi mumkin.

> Optik linzani yumshoq latta bilan arting. Sezgirlik potensiometri yoki datchik joyini muhandis ruxsatisiz o‘zgartirmang.`,
          ru: `## Индуктивные датчики
Индуктивный датчик создаёт электромагнитное поле и чувствует только **металл**. Расстояние срабатывания небольшое, обычно несколько миллиметров, точное значение на этикетке датчика.
- Номинальное расстояние указано для стали. Для алюминия, меди и нержавеющей стали оно меньше.
- **Встраиваемый (flush)** датчик устанавливается заподлицо в металл, расстояние короче. **Невстраиваемый (non-flush)** имеет большее расстояние, но требует свободного пространства вокруг.
- Типичные проблемы: изменилось расстояние до объекта (ослаб кронштейн), на торце налипла металлическая стружка, механический удар.

## Оптические датчики
- **На просвет (through-beam):** отдельные излучатель и приёмник. Самые надёжные, большое расстояние.
- **С отражателем (retro-reflective):** луч возвращается от отражателя. Блестящие объекты могут давать ложный сигнал, тогда применяют датчик с поляризационным фильтром.
- **Диффузные:** луч отражается от самого объекта. Цвет и поверхность объекта влияют на результат.
- Типичные проблемы: грязная линза или отражатель, сбита юстировка, посторонний свет, изменена настройка чувствительности.

## Светодиоды на датчике
На многих датчиках **зелёный** светодиод означает наличие питания, **жёлтый** или **оранжевый** включённый выход. Цвета могут отличаться у разных производителей.

> Протирайте линзу мягкой тканью. Не меняйте потенциометр чувствительности или положение датчика без разрешения инженера.`,
          en: `## Inductive sensors
An inductive sensor creates an electromagnetic field and detects **metal** only. Its sensing distance is short, usually a few millimetres; the exact value is on the sensor label.
- The rated distance is given for steel. For aluminium, copper and stainless steel it is shorter.
- A **flush** sensor is mounted flush in metal and has a shorter range. A **non-flush** sensor has a longer range but needs free space around its face.
- Typical problems: the gap to the target has changed (a loose bracket), metal chips stuck to the sensor face, mechanical impact.

## Optical sensors
- **Through-beam:** separate emitter and receiver. The most reliable, with a long range.
- **Retro-reflective:** the beam returns from a reflector. Shiny objects can give a false signal; a sensor with a polarising filter is used for them.
- **Diffuse:** the beam is reflected by the object itself. The colour and surface of the object affect the result.
- Typical problems: dirty lens or reflector, misalignment, ambient light, a changed sensitivity setting.

## LEDs on the sensor
On many sensors a **green** LED means power is present and a **yellow** or **orange** LED means the output is on. Colours can differ between manufacturers.

> Wipe the lens with a soft cloth. Do not change the sensitivity potentiometer or the sensor position without the engineer permission.`
        },
        check: {
          q: { uz: 'Induktiv datchik qanday obyektlarni sezadi?', ru: 'Какие объекты обнаруживает индуктивный датчик?', en: 'What objects does an inductive sensor detect?' },
          options: {
            uz: ['Har qanday materialni', 'Faqat shaffof plastikni', 'Faqat metallni'],
            ru: ['Любой материал', 'Только прозрачный пластик', 'Только металл'],
            en: ['Any material', 'Only clear plastic', 'Only metal']
          },
          answer: 2
        }
      },
      {
        title: { uz: 'Nosoz datchik yoki simni topish', ru: 'Поиск неисправного датчика или провода', en: 'Finding a failed sensor or wire' },
        body: {
          uz: `Tasodifiy almashtirish vaqt va pulni yo‘qotadi. Quyidagi usul muammoni bir necha daqiqada joyiga qarab toraytiradi.

## 1. Belgini aniqlang
Mashina qaysi qadamda to‘xtadi? HMI dagi xabar qaysi datchik yoki manzilni ko‘rsatadi? Chizmadan datchik nomini va PLC manzilini (masalan, %I2.3) toping.

## 2. Ikki chiroqni solishtiring
Obyekt datchik oldida turgan holatda:
- **Datchik chirog‘i o‘chiq.** Muammo datchik tomonida: obyekt masofasi, iflos linza, siljigan kronshteyn yoki ta’minot yo‘q (yashil chiroq ham o‘chiqmi?).
- **Datchik chirog‘i yonadi, PLC kirish chirog‘i o‘chiq.** Signal yo‘lda yo‘qolmoqda: raz’yom, kabel, klemma qutisi, PNP/NPN mos kelmasligi. Bu yerda o‘lchash kerak.
- **Ikkala chiroq yonadi, lekin mashina baribir kutmoqda.** Datchik va sim joyida. Sabab dastur mantiqida yoki boshqa shartda.

## 3. Mexanikani tekshiring
Kabel ezilmaganmi, raz’yom bo‘shamaganmi, datchik urilmaganmi? Kabel harakatlanuvchi qismlarda sinishi mumkin.

## 4. Yozib oling
Nima ko‘rildi, qaysi chiroqlar qanday holatda edi. Bu muhandisga masofadan yordam berishni osonlashtiradi.

## Qachon muhandis chaqiriladi
- Simlarda kuchlanishni o‘lchash yoki shkafni ochish kerak bo‘lsa.
- Ikkala chiroq yonib, mashina baribir ishlamasa.
- Modulda qizil ERROR/DIAG chiroq yonsa.
- Datchik xavfsizlik funksiyasiga (eshik, yorug‘lik pardasi) tegishli bo‘lsa.

> Hech qachon kirishni ko‘prikcha bilan ulab yoki force bilan «sinab» ko‘rmang. Bir xil turdagi raz’yomli datchikni almashtirish faqat korxona qoidalari ruxsat bersa, mashina to‘xtatilgan va himoyalangan holda bajariladi.`,
          ru: `Замена наугад теряет время и деньги. Метод ниже за несколько минут сужает поиск до конкретного места.

## 1. Определите симптом
На каком шаге остановилась машина? Какой датчик или адрес указывает сообщение на HMI? Найдите по схеме название датчика и адрес ПЛК (например, %I2.3).

## 2. Сравните два светодиода
Когда объект находится перед датчиком:
- **Светодиод датчика не горит.** Проблема на стороне датчика: расстояние до объекта, грязная линза, сбитый кронштейн или нет питания (не горит ли и зелёный?).
- **Светодиод датчика горит, светодиод входа ПЛК нет.** Сигнал теряется по пути: разъём, кабель, клеммная коробка, несовпадение PNP/NPN. Здесь нужны измерения.
- **Оба светодиода горят, но машина всё равно ждёт.** Датчик и провод в порядке. Причина в логике программы или в другом условии.

## 3. Проверьте механику
Не пережат ли кабель, не ослаб ли разъём, нет ли удара по датчику? Кабель может переломиться на подвижных частях.

## 4. Запишите
Что увидели, в каком состоянии были светодиоды. Это облегчает удалённую помощь инженера.

## Когда вызывать инженера
- Нужно измерять напряжение на проводах или открывать шкаф.
- Оба светодиода горят, а машина не работает.
- На модуле горит красный ERROR/DIAG.
- Датчик относится к функции безопасности (дверь, световая завеса).

> Никогда не «проверяйте» вход перемычкой или принудительной установкой (force). Замена датчика того же типа с разъёмом допускается, только если это разрешают правила предприятия, и при остановленной и защищённой машине.`,
          en: `Replacing parts at random wastes time and money. The method below narrows the problem down to one place in a few minutes.

## 1. Define the symptom
At which step did the machine stop? Which sensor or address does the HMI message name? Find the sensor name and PLC address (for example %I2.3) in the drawings.

## 2. Compare the two LEDs
With the object in front of the sensor:
- **Sensor LED off.** The problem is at the sensor: target distance, dirty lens, knocked bracket or no supply (is the green LED off too?).
- **Sensor LED on, PLC input LED off.** The signal is lost on the way: connector, cable, junction box, a PNP/NPN mismatch. Measurement is needed here.
- **Both LEDs on, but the machine still waits.** The sensor and wire are fine. The cause is in the program logic or another condition.

## 3. Check the mechanics
Is the cable crushed, the connector loose, the sensor hit? Cables can break inside where they flex on moving parts.

## 4. Write it down
What you saw and the state of each LED. This makes remote help from the engineer easier.

## When to call the engineer
- Voltage on the wires must be measured or the cabinet opened.
- Both LEDs are on and the machine still does not run.
- A red ERROR/DIAG LED is lit on the module.
- The sensor belongs to a safety function (door, light curtain).

> Never "test" an input with a jumper or by forcing it. Swapping a plug-in sensor for one of the identical type is done only if site rules allow it, with the machine stopped and secured.`
        },
        check: {
          q: { uz: 'Datchik chirog‘i yonadi, lekin PLC kirish chirog‘i o‘chiq. Muammo qayerda?', ru: 'Светодиод датчика горит, а входа ПЛК нет. Где проблема?', en: 'The sensor LED is on but the PLC input LED is off. Where is the problem?' },
          options: {
            uz: ['Datchik va PLC orasidagi yo‘lda (raz’yom, kabel, klemma)', 'Obyekt datchikdan juda uzoqda', 'Dastur mantiqida'],
            ru: ['На пути между датчиком и ПЛК (разъём, кабель, клемма)', 'Объект слишком далеко от датчика', 'В логике программы'],
            en: ['On the way between the sensor and the PLC (connector, cable, terminal)', 'The object is too far from the sensor', 'In the program logic']
          },
          answer: 0
        }
      }
    ],
    quiz: [
      { q: { uz: 'PLC skanerlash siklining to‘g‘ri tartibi qaysi?', ru: 'Каков правильный порядок цикла сканирования ПЛК?', en: 'What is the correct order of the PLC scan cycle?' }, options: { uz: ['Chiqishlar, dastur, kirishlar', 'Dastur, kirishlar, chiqishlar', 'Kirishlarni o‘qish, dastur, chiqishlarni yangilash', 'Faqat dastur'], ru: ['Выходы, программа, входы', 'Программа, входы, выходы', 'Чтение входов, программа, обновление выходов', 'Только программа'], en: ['Outputs, program, inputs', 'Program, inputs, outputs', 'Read inputs, run program, update outputs', 'Program only'] }, answer: 2 },
      { q: { uz: 'Siemens S7 da %Q0.0 manzili nimani bildiradi?', ru: 'Что обозначает адрес %Q0.0 в Siemens S7?', en: 'What does the address %Q0.0 mean in Siemens S7?' }, options: { uz: ['Raqamli chiqish', 'Raqamli kirish', 'Taymer', 'Analog kirish'], ru: ['Дискретный выход', 'Дискретный вход', 'Таймер', 'Аналоговый вход'], en: ['A digital output', 'A digital input', 'A timer', 'An analog input'] }, answer: 0 },
      { q: { uz: 'Kirish modulidagi kanal yashil chirog‘i yonsa, bu nimani bildiradi?', ru: 'Что означает горящий зелёный светодиод канала на модуле входов?', en: 'What does a lit green channel LED on an input module mean?' }, options: { uz: ['Modul nosoz', 'Kanalda signal bor', 'CPU STOP holatida', 'Sim uzilgan'], ru: ['Модуль неисправен', 'На канале есть сигнал', 'CPU в STOP', 'Обрыв провода'], en: ['The module is faulty', 'The channel has a signal', 'The CPU is in STOP', 'A wire is broken'] }, answer: 1 },
      { q: { uz: 'PNP datchik yoqilganda chiqishga nima beradi?', ru: 'Что выдаёт на выход сработавший датчик PNP?', en: 'What does a PNP sensor put on its output when it switches on?' }, options: { uz: ['0 V', '230 V AC', 'Hech narsa', '+24 V'], ru: ['0 В', '230 В AC', 'Ничего', '+24 В'], en: ['0 V', '230 V AC', 'Nothing', '+24 V'] }, answer: 3 },
      { q: { uz: 'Uch simli DC datchikda jigarrang sim odatda nima?', ru: 'Что обычно означает коричневый провод трёхпроводного датчика DC?', en: 'On a three-wire DC sensor, what is the brown wire usually?' }, options: { uz: ['0 V', 'Chiqish', '+24 V', 'Ekran'], ru: ['0 В', 'Выход', '+24 В', 'Экран'], en: ['0 V', 'Output', '+24 V', 'Shield'] }, answer: 2 },
      { q: { uz: 'Induktiv datchikning alyuminiyni sezish masofasi po‘latga nisbatan qanday?', ru: 'Каково расстояние срабатывания индуктивного датчика на алюминий по сравнению со сталью?', en: 'How does the sensing distance of an inductive sensor on aluminium compare with steel?' }, options: { uz: ['Kattaroq', 'Kichikroq', 'Bir xil', 'Alyuminiyni umuman sezadi, po‘latni sezmaydi'], ru: ['Больше', 'Меньше', 'Одинаковое', 'Видит алюминий, но не сталь'], en: ['Longer', 'Shorter', 'The same', 'It sees aluminium but not steel'] }, answer: 1 },
      { q: { uz: 'Reflektorli optik datchik yaltiroq obyektda xato bersa, nima yordam beradi?', ru: 'Что помогает, если датчик с отражателем ошибается на блестящих объектах?', en: 'What helps when a retro-reflective sensor misreads shiny objects?' }, options: { uz: ['Polarizatsiya filtrli datchik', 'Sezgirlikni maksimal qilish', 'Reflektorni olib tashlash', 'Datchikni teskari o‘rnatish'], ru: ['Датчик с поляризационным фильтром', 'Выкрутить чувствительность на максимум', 'Убрать отражатель', 'Установить датчик наоборот'], en: ['A sensor with a polarising filter', 'Turning sensitivity to maximum', 'Removing the reflector', 'Mounting the sensor backwards'] }, answer: 0 },
      { q: { uz: 'Datchik va PLC kirish chiroqlari ikkalasi yonadi, mashina baribir kutmoqda. Keyingi qadam?', ru: 'Горят оба светодиода, датчика и входа ПЛК, а машина ждёт. Следующий шаг?', en: 'Both the sensor LED and the PLC input LED are on, but the machine still waits. Next step?' }, options: { uz: ['Datchikni almashtirish', 'Kabelni almashtirish', 'Kirishga ko‘prikcha qo‘yish', 'Muhandisni chaqirish: sabab mantiqda yoki boshqa shartda'], ru: ['Заменить датчик', 'Заменить кабель', 'Поставить перемычку на вход', 'Вызвать инженера: причина в логике или другом условии'], en: ['Replace the sensor', 'Replace the cable', 'Jumper the input', 'Call the engineer: the cause is in the logic or another condition'] }, answer: 3 },
      { q: { uz: 'Modulda qizil DIAG chirog‘i yonsa, nima qilinadi?', ru: 'Что делать, если на модуле горит красный DIAG?', en: 'What do you do when a red DIAG LED is lit on a module?' }, options: { uz: ['Modulni ishlab turgan holda chiqarib qayta qo‘yish', 'Holatni yozib, muhandisga xabar berish', 'PLC ni o‘zingiz STOP ga o‘tkazish', 'E’tibor bermaslik'], ru: ['Вынуть и вставить модуль на ходу', 'Записать состояние и сообщить инженеру', 'Самому перевести ПЛК в STOP', 'Не обращать внимания'], en: ['Pull and refit the module while live', 'Record the state and inform the engineer', 'Switch the PLC to STOP yourself', 'Ignore it'] }, answer: 1 },
      { q: { uz: 'Xavfsizlik eshigi datchigi ishlamasa, kim shug‘ullanadi?', ru: 'Кто занимается неисправным датчиком защитной двери?', en: 'Who deals with a failed safety door sensor?' }, options: { uz: ['Operator ko‘prikcha qo‘yadi', 'Har qanday xodim datchikni boshqasiga almashtiradi', 'Muhandis', 'Hech kim, mashina datchiksiz ishlayveradi'], ru: ['Оператор ставит перемычку', 'Любой сотрудник меняет датчик на другой', 'Инженер', 'Никто, машина работает и без датчика'], en: ['The operator fits a jumper', 'Anyone swaps it for another sensor', 'The engineer', 'Nobody, the machine runs without it'] }, answer: 2 }
    ]
  }
];

// Mavjud kurslar (seed-data.mjs) darslari uchun nazorat savollari, darslar tartibida.
export const checks = {
  'abb-irc5-operator': [
    {
      q: { uz: 'Avariya to‘xtatish tugmasini tiklashdan oldin nima qilinadi?', ru: 'Что нужно сделать перед сбросом аварийной остановки?', en: 'What must be done before resetting an emergency stop?' },
      options: {
        uz: ['Robotni avtomatik rejimga o‘tkazish', 'Kontrollerni qayta yuklash', 'To‘xtash sababini aniqlash'],
        ru: ['Перевести робот в автоматический режим', 'Перезагрузить контроллер', 'Выяснить причину остановки'],
        en: ['Switch the robot to automatic', 'Restart the controller', 'Find the cause of the stop']
      },
      answer: 2
    },
    {
      q: { uz: 'Hodisa xabari raqamining birinchi raqami nimani bildiradi?', ru: 'Что обозначает первая цифра номера сообщения в журнале событий?', en: 'What does the first digit of an event message number tell you?' },
      options: {
        uz: ['Xabar toifasini', 'Xato takrorlanish sonini', 'Robot o‘qi raqamini'],
        ru: ['Категорию сообщения', 'Сколько раз повторилась ошибка', 'Номер оси робота'],
        en: ['The message category', 'How many times the error repeated', 'The robot axis number']
      },
      answer: 0
    },
    {
      q: { uz: 'IRC5 da backup qachon olinadi?', ru: 'Когда делают резервную копию IRC5?', en: 'When is an IRC5 backup taken?' },
      options: {
        uz: ['Faqat robot ishdan chiqqanda', 'Har qanday o‘zgarishdan oldin va oyiga kamida bir marta', 'Yiliga bir marta'],
        ru: ['Только после поломки робота', 'Перед любыми изменениями и не реже раза в месяц', 'Раз в год'],
        en: ['Only after the robot breaks down', 'Before any change and at least once a month', 'Once a year']
      },
      answer: 1
    }
  ],
  'kuka-krc4-operator': [
    {
      q: { uz: 'KR C4 da T2 rejimi nima uchun ishlatiladi?', ru: 'Для чего используется режим T2 на KR C4?', en: 'What is T2 mode on the KR C4 used for?' },
      options: {
        uz: ['Dastur tezligida sinov uchun, ehtiyotkorlik bilan', 'Kamera yopiq holda seriyali ishlab chiqarish uchun', 'PLC orqali tashqi boshqaruv uchun'],
        ru: ['Для испытаний на программной скорости, с осторожностью', 'Для серийного производства при закрытой ячейке', 'Для внешнего управления от ПЛК'],
        en: ['Testing at program speed, with care', 'Series production with the cell closed', 'External control from a PLC']
      },
      answer: 0
    },
    {
      q: { uz: 'Tasdiqlash talab qiladigan xabar tasdiqlanmasa nima bo‘ladi?', ru: 'Что будет, если сообщение квитирования не подтверждено?', en: 'What happens while an acknowledgement message is not confirmed?' },
      options: {
        uz: ['Robot sekin tezlikda ishlayveradi', 'Robot harakat qilmaydi', 'Xabar o‘zi yo‘qoladi'],
        ru: ['Робот продолжает работать на малой скорости', 'Робот не двигается', 'Сообщение исчезает само'],
        en: ['The robot keeps running at low speed', 'The robot will not move', 'The message clears itself']
      },
      answer: 1
    },
    {
      q: { uz: 'Barcha o‘qlar EMD bilan mastering qilingandan keyin nima qilinadi?', ru: 'Что делают после мастеринга всех осей с EMD?', en: 'What is done after all axes are mastered with the EMD?' },
      options: {
        uz: ['Robot darhol AUT rejimiga o‘tkaziladi', 'EMD robotda qoldiriladi', 'Arxiv olinadi'],
        ru: ['Робот сразу переводят в AUT', 'EMD оставляют на роботе', 'Делают архив'],
        en: ['The robot goes straight to AUT', 'The EMD is left on the robot', 'An archive is taken']
      },
      answer: 2
    }
  ],
  'vfd-servo-diagnostics': [
    {
      q: { uz: 'Drayver klemmalariga tegishdan oldin nima tasdiqlanadi?', ru: 'Что подтверждают перед тем, как касаться клемм привода?', en: 'What is confirmed before touching drive terminals?' },
      options: {
        uz: ['Displey o‘chganligi', 'DC+ va DC− orasidagi kuchlanish o‘lchanib, xavfsiz darajaga tushganligi', 'Ventilyator to‘xtaganligi'],
        ru: ['Что погас дисплей', 'Что напряжение между DC+ и DC− измерено и упало до безопасного уровня', 'Что остановился вентилятор'],
        en: ['That the display is dark', 'That the voltage between DC+ and DC− is measured and has dropped to a safe level', 'That the fan has stopped']
      },
      answer: 1
    },
    {
      q: { uz: 'Past kuchlanish (undervoltage) xatosining ehtimoliy sababi qaysi?', ru: 'Вероятная причина ошибки пониженного напряжения?', en: 'What is a likely cause of an undervoltage fault?' },
      options: {
        uz: ['Tarmoqda faza yo‘qolishi', 'Juda qisqa tezlanish vaqti', 'Chang bosgan radiator'],
        ru: ['Пропадание фазы в сети', 'Слишком короткое время разгона', 'Запылённый радиатор'],
        en: ['A lost supply phase', 'An acceleration time that is too short', 'A dusty heatsink']
      },
      answer: 0
    },
    {
      q: { uz: 'Bosqichma-bosqich diagnostikaning birinchi qadami qaysi?', ru: 'Какой первый шаг пошаговой диагностики?', en: 'What is the first step of step-by-step diagnostics?' },
      options: {
        uz: ['Drayverni yangisiga almashtirish', 'Parametrlarni zavod qiymatlariga qaytarish', 'Xato kodi va xatolar tarixini yozib olish'],
        ru: ['Заменить привод на новый', 'Сбросить параметры на заводские', 'Записать код ошибки и историю ошибок'],
        en: ['Replace the drive with a new one', 'Reset parameters to factory defaults', 'Record the fault code and fault history']
      },
      answer: 2
    }
  ]
};

// Mavjud kurslar uchun qo‘shimcha test savollari (har biri 5 ta, havza 10 taga yetadi).
export const extraQuiz = {
  'abb-irc5-operator': [
    { q: { uz: '7xxxx raqamli xabarlar qaysi toifaga tegishli?', ru: 'К какой категории относятся сообщения 7xxxx?', en: 'Which category do 7xxxx messages belong to?' }, options: { uz: ['Harakat (motion)', 'Dastur', 'Kirish/chiqish va aloqa', 'Ish jarayoni'], ru: ['Движение (motion)', 'Программа', 'Ввод/вывод и связь', 'Эксплуатация'], en: ['Motion', 'Program', 'I/O and communication', 'Operational'] }, answer: 2 },
    { q: { uz: 'Avtomatik rejimga o‘tishdan oldin nima tekshiriladi?', ru: 'Что проверяют перед переходом в автоматический режим?', en: 'What is checked before switching to automatic mode?' }, options: { uz: ['Zonada hech kim yo‘qligi', 'Batareya zaryadi', 'Ekran yorqinligi', 'Dastur versiyasi'], ru: ['Что в зоне никого нет', 'Заряд батареи', 'Яркость экрана', 'Версию программы'], en: ['That nobody is in the cell', 'Battery charge', 'Screen brightness', 'Program version'] }, answer: 0 },
    { q: { uz: 'SMB batareyasi tugasa nima bo‘ladi?', ru: 'Что произойдёт, если разрядится батарея SMB?', en: 'What happens if the SMB battery runs out?' }, options: { uz: ['Dasturlar o‘chib ketadi', 'Robot tezligi pasayadi', 'FlexPendant ishlamay qoladi', 'Aylanish hisoblagichlari yo‘qoladi va robot pozitsiyasini bilmaydi'], ru: ['Удаляются программы', 'Снижается скорость робота', 'Перестаёт работать FlexPendant', 'Теряются счётчики оборотов, и робот не знает своего положения'], en: ['Programs are deleted', 'Robot speed drops', 'The FlexPendant stops working', 'The revolution counters are lost and the robot does not know its position'] }, answer: 3 },
    { q: { uz: 'Muhandisga xato haqida xabar berishda nima kerak?', ru: 'Что нужно при сообщении инженеру об ошибке?', en: 'What is needed when reporting an error to the engineer?' }, options: { uz: ['Faqat «robot ishlamayapti» deyish', 'Xabar raqami va to‘liq matni, displey rasmi va xato oldidan nima qilingani', 'Kontrollerni o‘chirib qo‘yish', 'Hodisalar jurnalini tozalash'], ru: ['Просто сказать «робот не работает»', 'Номер и полный текст сообщения, фото дисплея и что делали перед ошибкой', 'Выключить контроллер', 'Очистить журнал событий'], en: ['Just say "the robot does not work"', 'The message number and full text, a photo of the display and what was done before the error', 'Switch off the controller', 'Clear the event log'] }, answer: 1 },
    { q: { uz: 'Backup nusxasini qayerda saqlash kerak?', ru: 'Где хранить резервную копию?', en: 'Where should the backup be kept?' }, options: { uz: ['Faqat kontroller ichida', 'Faqat operator telefonida', 'USB da va boshqa joyda', 'Hech qayerda, kerak emas'], ru: ['Только в контроллере', 'Только в телефоне оператора', 'На USB и в другом месте', 'Нигде, не нужна'], en: ['Only inside the controller', 'Only on the operator phone', 'On USB and somewhere else', 'Nowhere, it is not needed'] }, answer: 2 }
  ],
  'kuka-krc4-operator': [
    { q: { uz: 'KR C4 da ish rejimi qanday tanlanadi?', ru: 'Как выбирается режим работы на KR C4?', en: 'How is the operating mode selected on the KR C4?' }, options: { uz: ['smartPAD dagi kalitli almashtirgich bilan', 'PLC dasturida', 'Kontroller eshigini ochib', 'Ovozli buyruq bilan'], ru: ['Ключевым переключателем на smartPAD', 'В программе ПЛК', 'Открыв дверь контроллера', 'Голосовой командой'], en: ['With the key switch on the smartPAD', 'In the PLC program', 'By opening the controller door', 'By voice command'] }, answer: 0 },
    { q: { uz: 'Qaysi rejimda robot avtomatik ishlaydi va zona yopiq bo‘lishi kerak?', ru: 'В каком режиме робот работает автоматически при закрытой зоне?', en: 'In which mode does the robot run automatically with the cell closed?' }, options: { uz: ['T1', 'T2', 'AUT', 'Mastering'], ru: ['T1', 'T2', 'AUT', 'Мастеринг'], en: ['T1', 'T2', 'AUT', 'Mastering'] }, answer: 2 },
    { q: { uz: 'KUKA arxivi nimani saqlaydi?', ru: 'Что хранит архив KUKA?', en: 'What does a KUKA archive hold?' }, options: { uz: ['Faqat xabarlar tarixini', 'Dasturlar, konfiguratsiya va mastering ma’lumotlarini', 'Faqat foydalanuvchi parollarini', 'Faqat smartPAD sozlamalarini'], ru: ['Только историю сообщений', 'Программы, конфигурацию и данные мастеринга', 'Только пароли пользователей', 'Только настройки smartPAD'], en: ['Only the message history', 'Programs, configuration and mastering data', 'Only user passwords', 'Only smartPAD settings'] }, answer: 1 },
    { q: { uz: 'smartPAD da EMD mastering qaysi menyudan boshlanadi?', ru: 'Из какого меню smartPAD запускается мастеринг с EMD?', en: 'Which smartPAD menu starts EMD mastering?' }, options: { uz: ['File → Archive', 'Display → Variable', 'Help → Info', 'Start-up → Master → EMD'], ru: ['File → Archive', 'Display → Variable', 'Help → Info', 'Start-up → Master → EMD'], en: ['File → Archive', 'Display → Variable', 'Help → Info', 'Start-up → Master → EMD'] }, answer: 3 },
    { q: { uz: 'Mastering qaysi rejimda bajariladi?', ru: 'В каком режиме выполняют мастеринг?', en: 'Which mode is mastering done in?' }, options: { uz: ['T1', 'AUT', 'EXT', 'Istalgan rejimda'], ru: ['T1', 'AUT', 'EXT', 'В любом режиме'], en: ['T1', 'AUT', 'EXT', 'Any mode'] }, answer: 0 }
  ],
  'vfd-servo-diagnostics': [
    { q: { uz: 'Drayverdagi o‘lchashlar uchun multimetr qaysi toifadan past bo‘lmasligi kerak?', ru: 'Какой категории должен быть мультиметр для измерений на приводе как минимум?', en: 'What is the minimum meter category for measurements on a drive?' }, options: { uz: ['CAT I', 'CAT II', 'CAT III', 'Toifa muhim emas'], ru: ['CAT I', 'CAT II', 'CAT III', 'Категория не важна'], en: ['CAT I', 'CAT II', 'CAT III', 'Category does not matter'] }, answer: 2 },
    { q: { uz: 'Ortiqcha tok (overcurrent) xatosining ehtimoliy sababi qaysi?', ru: 'Вероятная причина ошибки перегрузки по току?', en: 'What is a likely cause of an overcurrent fault?' }, options: { uz: ['Tarmoq kuchlanishining pasayishi', 'Juda qisqa tezlanish vaqti yoki motor kabelida qisqa tutashuv', 'Uzun sekinlashish vaqti', 'Displey sozlamasi'], ru: ['Просадка напряжения сети', 'Слишком короткое время разгона или КЗ в кабеле двигателя', 'Длинное время замедления', 'Настройка дисплея'], en: ['A supply voltage dip', 'An acceleration time that is too short or a short in the motor cable', 'A long deceleration time', 'A display setting'] }, answer: 1 },
    { q: { uz: 'Motorning faza qarshiliklari solishtirilganda qanday bo‘lishi kerak?', ru: 'Какими должны быть сопротивления фаз двигателя при сравнении?', en: 'What should motor phase resistances look like when compared?' }, options: { uz: ['Deyarli bir xil, farq kichik', 'Bitta faza nolga teng', 'Har biri ikki barobar farq qiladi', 'Cheksiz katta'], ru: ['Почти одинаковые, разница небольшая', 'Одна фаза равна нулю', 'Каждая отличается вдвое', 'Бесконечно большие'], en: ['Nearly equal, with a small difference', 'One phase reads zero', 'Each differs by a factor of two', 'Infinitely high'] }, answer: 0 },
    { q: { uz: 'Kirish kuchlanishi qanday holatda o‘lchanadi?', ru: 'В каком состоянии измеряют входное напряжение?', en: 'Under what condition is the input voltage measured?' }, options: { uz: ['Faqat drayver o‘chiq holda', 'Faqat tunda', 'Faqat motor uzilganda', 'Yuk ostida'], ru: ['Только при выключенном приводе', 'Только ночью', 'Только при отключённом двигателе', 'Под нагрузкой'], en: ['Only with the drive off', 'Only at night', 'Only with the motor disconnected', 'Under load'] }, answer: 3 },
    { q: { uz: 'DC shina kondensatorlari zaryadsizlanishi uchun kutish vaqti qayerda ko‘rsatiladi?', ru: 'Где указано время ожидания разряда конденсаторов шины DC?', en: 'Where is the waiting time for the DC bus capacitors to discharge shown?' }, options: { uz: ['Motor plitasida', 'Elektr shkafi eshigining ichki tomonida, har doim 1 daqiqa', 'Drayver korpusida', 'Hech qayerda, taxminan kutiladi'], ru: ['На шильдике двигателя', 'На внутренней стороне двери шкафа, всегда 1 минута', 'На корпусе привода', 'Нигде, ждут на глаз'], en: ['On the motor nameplate', 'Inside the cabinet door, always 1 minute', 'On the drive housing', 'Nowhere, you guess'] }, answer: 2 }
  ]
};
