# Akademiya: kurs joylash va foydalanish

## Qisqacha qanday ishlaydi

1. Siz admin panelda kurs yaratasiz: darslar, har bir dars uchun bitta tekshiruv savoli va yakuniy test.
2. Har bir korxona uchun **kirish kodi** yaratasiz va kodni korxonaga berasiz.
3. Korxona xodimi saytda **ro‘yxatdan o‘tadi** (telefon yoki email va parol), kursni ochib **kodni** bir marta kiritadi va o‘qishni boshlaydi.
4. Xodim darslarni o‘qib, yakuniy testdan o‘tsa, **sertifikat** oladi.
5. Korxona rahbari xodimlarining natijalarini **rahbar sahifasida** ko‘radi.

Saytda hozir 3 ta namunaviy kurs bor (masalan, LOTO xavfsizligi). Ularni o‘zgartirish, yashirish yoki o‘chirish mumkin.

## 1. Kurs yaratish

1. `http://localhost:3080/admin` (yoki sayt manzili + `/admin`) ga kiring.
2. Chap menyudan **Akademiya** → **+ Yangi kurs** ni bosing.
3. Yuqoridagi kartaga kurs ma’lumotlarini yozing:
   - **Kurs nomi**, **Qisqacha tavsif**, **Kim uchun.** Har biri UZ / RU / EN tillarida yoziladi. Faqat o‘zbekcha yozsangiz ham bo‘ladi, keyin boshqa tillarni qo‘shasiz.
4. O‘ng tomondagi maydonlar:
   - **Manzil (slug):** kurs sahifasining manzili. Faqat lotin harflari, raqam va `-` ishlatiladi, masalan `abb-irc5-operator`. Shunda kurs `/academy/abb-irc5-operator/` manzilida ochiladi.
   - **Uskuna:** masalan `ABB IRC5`.
   - **Daraja:** Boshlang‘ich, O‘rta yoki Yuqori.
   - **Soat:** kursning taxminiy davomiyligi.
   - **Tartib:** kurslar ro‘yxatidagi o‘rni. Kichik raqam yuqorida turadi.
   - **Saytda ko‘rsatish:** belgilanmasa, kurs yashirin bo‘ladi. Tayyorlab bo‘lguncha belgilamay turing.

## 2. Darslarni qo‘shish

**+ Dars qo‘shish** ni bosing. Har bir dars uchun:

- **Dars nomi** yoziladi.
- **Matn** maydoniga dars matni yoziladi (har bir tilda 20 000 belgigacha). Oddiy formatlash ishlaydi:

```
## Bo‘lim sarlavhasi
Oddiy matn. **Muhim so‘z** qalin chiqadi.

- ro‘yxat bandi
- yana bir band

1. Birinchi qadam
2. Ikkinchi qadam

> Xavfsizlik ogohlantirishi: bu qator alohida ajratilib, rangli blokda chiqadi.
```

- **Video dars** ixtiyoriy. **Video fayl yuklash (MP4)** tugmasi bilan kompyuterdagi videoni yuklaysiz (4 GB gacha, internet uzilsa davom ettiriladi) yoki YouTube/Vimeo havolasini qo‘yasiz. Video dars matnidan yuqorida chiqadi.
- **Tekshiruv savoli** ixtiyoriy. Xodim darsni tugatish uchun shu savolga to‘g‘ri javob berishi kerak bo‘ladi. Savol va kamida 2 ta variantni yozing, to‘g‘ri variant yonidagi doirani belgilang. Bo‘sh qoldirilsa, dars tekshiruvsiz tugatiladi.

Darslar tartibini **↑** tugmasi bilan o‘zgartirasiz, **✕** bilan o‘chirasiz.

Tayyor darslik Word yoki PDF faylda bo‘lsa, matnini nusxalab, darslarga bo‘lib qo‘yasiz. Har bir katta bob alohida dars bo‘lgani qulay.

## 3. Yakuniy test

**Yakuniy test: savollar banki** bo‘limida **+ Savol qo‘shish** bilan savollar yoziladi. Savollar ko‘p bo‘lgani yaxshi, masalan 20–30 ta.

O‘ng tomondagi **Test va ketma-ketlik** kartasida:
- **Testdagi savollar:** har bir urinishda bankdan nechta savol tasodifiy tanlanishi (masalan, 10 ta).
- **Vaqt (daqiqa):** test uchun vaqt.
- **O‘tish bali, %:** masalan 80.
- **Avval tugatilishi kerak bo‘lgan kurs:** masalan, "Robot bilan ishlash"dan oldin "Xavfsizlik" kursini tugatish talab qilinadi.

Xodim kuniga 3 marta urinishi mumkin. Sertifikat 2 yil amal qiladi.

**Saqlash** ni bosing. So‘ng **Saytda ko‘rish ↗** orqali kurs qanday chiqqanini tekshiring.

## 4. Korxonaga kirish kodi berish

1. **Akademiya** sahifasidagi **Korxona kirish kodlari** bo‘limiga o‘ting.
2. Korxona nomini, **O‘rin** sonini (nechta xodim kira oladi) va kerak bo‘lsa **Muddat** ni (qaysi sanagacha amal qilishi) kiriting.
3. **Kod yaratish** ni bosing. Masalan `AK-AB12-CD34` ko‘rinishidagi kod chiqadi.
4. Korxonaga ikki narsani yuborasiz:
   - **kodning o‘zi**, xodimlar uchun;
   - **Rahbar sahifasi** havolasi (⧉ tugmasi bilan nusxalanadi), rahbar uchun. Bu sahifada kim qaysi darsni o‘tgani, test natijalari va sertifikatlar ko‘rinadi.

Kodni o‘chirsangiz, yangi xodimlar u bilan kira olmaydi.

**Muhim:** saytda sinov uchun `DEMO-2026` kodi bor (50 o‘rin). Uni sinov uchun ishlatishingiz mumkin. Lekin saytni hammaga ochishdan oldin bu kodni o‘chiring, aks holda uni bilgan har kim kurslarga kira oladi.

## 5. Xodim qanday o‘qiydi

1. Saytda **Akademiya** → kerakli kursni ochadi.
2. **Kirish** yoki **Ro‘yxatdan o‘tish** ni bosadi. Ro‘yxatdan o‘tgach, kursga qaytadi.
3. Korxona kodini bir marta kiritadi. Keyin kod so‘ralmaydi.
4. Darslarni ketma-ket o‘qiydi. Har bir dars oxirida tekshiruv savoliga javob beradi.
5. Barcha darslar tugagach, **Yakuniy test** ochiladi.
6. Testdan o‘tsa, sertifikat beriladi. Sertifikatning o‘z havolasi bor va uni har kim tekshirishi mumkin.

Telegram orqali ham o‘qish mumkin: botdagi **Ilova** → **O‘qish**. U yerda ham shu kod kiritiladi. `/kurslar` buyrug‘i o‘qish holatini ko‘rsatadi.

Natijalar xodimning hisobida saqlanadi, shuning uchun istalgan telefon yoki kompyuterdan login va parol bilan kirib davom ettirish mumkin. Xodim o‘z **Kabinet**ida (`/account/`) arizalari, kurslari va sertifikatlarini ko‘radi.

## 6. Natijalarni kuzatish

- Admin panel → **Akademiya** → **Tinglovchilar** jadvalida har bir xodim, uning korxonasi, o‘tilgan darslari, eng yaxshi natijasi va sertifikatlari ko‘rinadi.
- Korxona rahbari o‘z xodimlarini **Rahbar sahifasi** havolasida ko‘radi.

- Admin panel → **Foydalanuvchilar**: saytda ro‘yxatdan o‘tgan har bir odam, uning arizalari, kurslari va faolligi (kirishlar, darslar, testlar, videolar). **CSV yuklab olish** bilan Excelga olasiz.

## 7. Video qo‘llanmalar (alohida kutubxona)

Admin panel → **Videolar** → **+ Yangi video**. Video yuklaysiz yoki havola qo‘yasiz, sarlavha, tavsif va bo‘limni (masalan KUKA, ABB) yozasiz. **Kim ko‘ra oladi** maydonida:
- **Hammaga**: saytga kirgan har kim ko‘radi;
- **Faqat ro‘yxatdan o‘tganlarga**: mehmonlar "kirish kerak" degan kartani ko‘radi.

Videolar saytda **/videos/** sahifasida chiqadi. Yuklangan videoning havolasi 12 soatda eskiradi, shuning uchun uni boshqa joyga ko‘chirib tarqatib bo‘lmaydi. YouTube’da videoni **Unlisted** qilib qo‘ysangiz, u faqat saytda ko‘rinadi.

## 8. Parol unutilsa

- Foydalanuvchi kabinetida **Telegram**ni ulagan bo‘lsa, **Parolni unutdingizmi?** bosilganda botga 6 xonali kod keladi.
- Telegram ulanmagan bo‘lsa, sizga Telegram’da xabar keladi. Admin panel → **Foydalanuvchilar** → odamni ochib, **Vaqtinchalik parol berish** ni bosasiz va parolni unga aytasiz.
