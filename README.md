# Texnika Servis sayti

Uch tilli (o‘zbek `/`, rus `/ru/`, ingliz `/en/`) servis sayti: AI tashxis, arizalar Telegramga, ariza holatini kuzatish, xato kodlari ma’lumotnomasi, QR uskuna pasporti, profilaktika eslatmalari, tijorat taklifi va dalolatnoma, mijoz Telegram boti va Telegram Mini App, portfel, xodimlar akademiyasi, analitika va admin panel.

Texnologiya: Node.js 22 (framework yo‘q), ichki SQLite bazasi, ikkita tashqi kutubxona (`@anthropic-ai/sdk`, `qrcode-generator`).

## Nima bor

| Bo‘lim | Manzil | Vazifasi |
|---|---|---|
| Bosh sahifa | `/`, `/ru/`, `/en/` | Xizmatlar, PLC bo‘limi, to‘xtash narxi kalkulyatori, kafolat va kafolat tekshiruvi, narx rejalari, portfel, mijoz baholari, akademiya, savol-javob. Telefon raqam yashirin (`+998 99 ••• •• ••`), mijoz ariza yuborgandan keyin to‘liq ochiladi |
| AI tashxis va ariza | bosh sahifa `#contact` | Mijoz matn va 4 tagacha rasm yuboradi, AI tashxis, ustuvorlik va keyingi qadamlarni beradi. Ariza Telegramga keladi |
| PLC ta’miri | `/plc/` | Siemens S7, Mitsubishi, Omron, Allen-Bradley va boshqa PLC lar: 8 ta ko‘p uchraydigan nosozlik (har biri animatsion sxema bilan), ta’mir tartibi, PLC chiroqlari bo‘yicha onlayn tashxis (POWER, RUN, SF, BF, MAINT holatini belgilang, ehtimoliy sabab chiqadi), forma xizmat turi tanlangan holda |
| Sifat standarti | bosh sahifa `#quality` | 5 ta ish ustuvorligi (xavfsizlik, avval sabab, zaxira nusxa, yozma narx, hisobot), javob muddatlari jadvali va sifat nazorati ro‘yxati |
| Kafolat | `/warranty/` | Haqiqiylik, sifat nazorati va kafolat shartlari. Kafolatni ariza raqami bilan onlayn tekshirish (`/api/warranty/TX-…`), botda `/kafolat TX-…`. Muddat admin → Sozlamalar → Kafolat (standart: ishga 3 oy, qismga 12 oy) |
| Qo‘llab-quvvatlash | `/support/` | Bog‘lanish yo‘llari (Telegram, masofaviy ulanish, saytdagi ariza, joyiga chiqish), ustuvorlik va javob vaqti jadvali, masofaviy yordam tartibi va xavfsizlik, o‘zingiz tekshirish havolalari, savol-javob va ariza formasi |
| Ariza holati | `/track/` | Mijoz `TX-XXXX-XXXX` raqami bilan holat, yangilanishlar va kafolat muddatini ko‘radi (ism, telefon ko‘rsatilmaydi). Ariza bajarilgach shu yerda 1–5 baho va izoh qoldiradi |
| Portfel | `/portfolio/` | Bajarilgan ishlar: muammo, yechim, natija, rasmlar. Har til uchun alohida URL va SEO |
| Akademiya | `/academy/` | 7 ta kurs (ABB, KUKA, FANUC, chastota o‘zgartirgichlar, LOTO xavfsizligi, profilaktika, PLC va datchiklar). Har dars oxirida tekshiruv savoli, yakuniy test bankdan tasodifiy savollar bilan, vaqt cheklovi, kuniga 3 urinish, xato savollar ro‘yxati. Kurslar ketma-ketligi (avval xavfsizlik). Sertifikat QR kodli va 2 yil amal qiladi. Korxonaga kirish kodi bilan |
| Rahbar sahifasi | `/academy/team/<kalit>/` | Korxona rahbari xodimlarning har kurs bo‘yicha o‘zlashtirishini ko‘radi va CSV yuklab oladi. Havola admin panel → Akademiya → kodlar jadvalida |
| Xato kodlari | `/errors/` | KUKA, ABB, FANUC va chastota o‘zgartirgichlar (Siemens, Danfoss, Yaskawa, Delta, Inovance) xatolari: 50 ta kod, har biri uch tilda alohida sahifa. Google’dan mijoz olib keladi |
| Uskuna pasporti | `/e/EQ-XXXX-XXXX/` | Uskunaga yopishtirilgan QR yorliq shu sahifani ochadi: model, seriya, keyingi profilaktika, ta’mir tarixi va tayyor ariza formasi (Google’da indekslanmaydi) |
| Hujjat | `/doc/...` | Tijorat taklifi yoki dalolatnoma: chop etish va PDF saqlash, mijoz “Qabul qilaman” tugmasini bosadi |
| Telegram Mini App | `/tg/` | Bot ichida ochiladigan ilova: arizalar, yangi ariza, o‘qish (sayt akademiyasi bilan bir hisob), uskunalar, hujjatlar, xato kodlari, ishni baholash; muhandis uchun boshqaruv |
| Admin panel | `/admin` | Analitika, arizalar, uskunalar va QR, profilaktika, hujjatlar, xato kodlari, portfel, mijoz baholari (e’lon qilish), kurslar (tekshiruv savollari, test sozlamalari, ketma-ketlik), matnlarni tahrirlash, sozlamalar |

Tepada “Bo‘limlar” tugmasi barcha bo‘limlar yacheykalarini ochadi (telefonda yagona menyu ham shu). Bosh sahifa fonida payvandlayotgan robotlar sahnasi (`src/scene.mjs`: kuzov, uchqunlar, yorug‘lik), PLC bo‘limida HMI, CPU va I/O modullari animatsiyasi; ikkalasi ham asl chizma, tashqi rasm ishlatilmagan.

Dizayn: chizma uslubi, bitta shrift oilasi (IBM Plex Sans/Mono), yassi tugmalar, to‘q sariq faqat asosiy harakatda. Mijozga boradigan Telegram xabarlarida emoji yo‘q. Orqa fonda xira, sekin harakatlanuvchi robot va PLC chizmalari, har bo‘lim sarlavhasida mavzusiga mos kichik animatsiya (xizmatlar: tishli g‘ildiraklar, jarayon: konveyer, kafolat: muhr, baholar: yulduzlar va h.k.). `prefers-reduced-motion` yoqilgan bo‘lsa animatsiyalar to‘xtaydi.

## Kompyuterda ishga tushirish

```bash
npm install
ADMIN_PASSWORD='kamida-10-belgili-parol' npm start
# http://localhost:8080  va  http://localhost:8080/admin
npm test   # 105 ta avtomatik tekshiruv
```

`ADMIN_PASSWORD` berilmasa, birinchi ishga tushishda tasodifiy parol konsolga bir marta chiqadi. Parolni keyin admin paneldagi “Sozlamalar”dan o‘zgartiring.

Demo akademiya kodi: `DEMO-2026` (admin paneldan o‘chirib, korxonalar uchun o‘z kodlaringizni yarating).

## Sozlash

Barcha sozlamalar muhit o‘zgaruvchilari orqali beriladi, namunasi `.env.example` da.

### 1. Telegram xabarnomalar

1. Telegramda **@BotFather** ga `/newbot` yozing, bot nomini bering. Bergan **token**ni `TELEGRAM_BOT_TOKEN` ga yozing.
2. O‘z botingizga istalgan xabar yozing.
3. Brauzerda `https://api.telegram.org/bot<TOKEN>/getUpdates` ni oching, `"chat":{"id": ...}` raqamini `TELEGRAM_CHAT_ID` ga yozing. (Guruhga yuborish uchun botni guruhga qo‘shing, guruh id si minus bilan boshlanadi.)
4. Ixtiyoriy: `TELEGRAM_WEBHOOK_SECRET` ga 16+ belgili tasodifiy matn va `PUBLIC_URL` ni bering. Shunda Telegramdan to‘g‘ridan-to‘g‘ri boshqarish mumkin:
   - Yangi ariza xabari ostida holat tugmalari: Diagnostika, Rejada, Ta’mirda, Bajarildi. Bosilsa mijozga ham xabar ketadi, “Bajarildi”da botdan baho so‘raladi.
   - Yangi baho kelganda “Saytda e’lon qilish” tugmasi chiqadi.
   - `/holat TX-7F3K-9QWD scheduled Ertaga 10:00 da boramiz` (holat: new, diagnosing, scheduled, in_progress, waiting_parts, done, cancelled)
   - `/oxirgi` — oxirgi 5 ta ariza
5. Admin panel → Sozlamalar → “Sinov xabari” bilan tekshiring.

### 1b. Mijoz boti va Telegram Mini App

Bot mijozlar bilan ham ishlaydi: muammoni yozadi yoki rasm yuboradi, bot telefon raqamini so‘raydi, AI dastlabki tashxis beradi, ariza muhandisga keladi va holat o‘zgarganda mijozga xabar boradi.

1. Yuqoridagi 1-bo‘limdagi uchala o‘zgaruvchi (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_WEBHOOK_SECRET`) va `PUBLIC_URL` (https bilan) berilgan bo‘lsin. Server ishga tushganda webhook va bot menyusidagi “Ilova” tugmasi avtomatik ulanadi.
2. **@BotFather** da: `/setdescription` (bot nima qilishi), `/setuserpic` (logotip). Menyu tugmasi avtomatik o‘rnatiladi; qo‘lda qilish kerak bo‘lsa: `/mybots` → bot → Bot Settings → Menu Button → manzil `https://sizning-domen.uz/tg/`.
3. Mini App ichida muhandis (`TELEGRAM_CHAT_ID` egasi) “Boshqaruv” bo‘limini ko‘radi: bugungi tashriflar, ochiq va kritik arizalar, holatni o‘zgartirish, profilaktikani “Bajarildi” deb belgilash. Yordamchi ustalarning Telegram ID sini admin panel → Sozlamalar → “Qo‘shimcha admin Telegram ID lari” ga yozing.
4. Bot buyruqlari (menyuga avtomatik qo‘shiladi). Mijoz uchun: `/start`, `/holat TX-XXXX-XXXX`, `/xato 50204` (xato kodi bo‘yicha sabablar va sahifa havolasi), `/kurslar` (o‘qish holati), `/ilova`. Muhandis chatida: `/oxirgi`, `/holat ...`, `/profilaktika`, `/ilova`.
5. Sayt bilan bir xil ishlaydi: bot ariza qabul qilgach muhandis raqamini beradi (saytda ham raqam faqat arizadan keyin ochiladi), Mini App’da “O‘qish” bo‘limi saytdagi kurslarni o‘sha hisob bilan ochadi, ariza bajarilgach bot 1–5 baho so‘raydi. Akademiyada 3 kun kirmagan va Telegram orqali ulangan xodimga haftasiga ko‘pi bilan bir marta eslatma boradi.

**Korxonani ulash.** Admin panel → Uskunalar → Mijozlar → korxona qo‘shing. Har korxonaga ulanish kodi (`CL-XXXX-XXXX`) va havola beriladi. Havolani korxona xodimiga yuboring: bosganda bot uni korxonaga ulaydi va u Mini App’da korxona uskunalari, hujjatlarini ko‘radi, profilaktika eslatmalarini oladi.

**QR yorliqlar.** Admin panel → Uskunalar → uskuna qo‘shing → “QR yorliqlarni chop etish”. A4 varaqqa 8 ta yorliq chiqadi, laminatsiyalangan stiker qog‘ozga chop eting. Operator QR ni skanerlasa, pasport sahifasi va shu uskunaga bog‘langan ariza formasi ochiladi (yoki botga o‘tadi).

**Profilaktika.** Uskuna sahifasida ish va davriylikni kiriting (masalan, “Reduktor moyi, har 180 kunda”). Har kuni 08:00 (Toshkent) da muhandisga 7 kunlik ro‘yxat keladi, mijozga 3 kun oldin eslatma boradi. “Bajarildi” bosilsa keyingi sana o‘zi hisoblanadi va uskuna tarixiga yoziladi.

**Hujjatlar.** Ariza sahifasida “Taklif tuzish” yoki “Dalolatnoma” tugmasi, yoki Hujjatlar → Yangi. Rekvizitlarni Sozlamalar’da bir marta kiriting. “Telegramda yuborish” mijozga havola yuboradi, “Email orqali” pochta dasturini ochadi. Brauzerda “Chop etish / PDF” → “PDF sifatida saqlash”.

### 2. AI tashxis (AI Gateway)

- `AI_GATEWAY_URL` — gateway manzili (masalan, Vercel AI Gateway: `https://ai-gateway.vercel.sh`).
- `AI_GATEWAY_API_KEY` — gateway kaliti.
- `AI_MODEL` — gateway talab qiladigan model nomi (odatda `anthropic/claude-opus-5.5`).
- Gateway ishlatmasangiz: faqat `ANTHROPIC_API_KEY` bering, `AI_MODEL=claude-opus-5-5`.

Kalit berilmasa sayt ishlayveradi, faqat “AI tashxis” tugmasi “hozircha o‘chiq” deydi, ariza baribir yuboriladi. Bir IP dan soatiga 6 ta tashxis cheklovi bor (xarajatni nazorat qilish uchun).

### 3. Domen va aloqa ma’lumotlari

`PUBLIC_URL=https://sizning-domen.uz`. Telefon, Telegram, WhatsApp, email, shahar va brend nomini admin panel → Sozlamalardan o‘zgartirasiz (yoki `site.config.json`).

### 4. Google, Yandex, Google Business va 2GIS

1. **Google Search Console** (search.google.com/search-console): “URL prefix” bilan domenni qo‘shing → “HTML tag” usuli → `content="..."` ichidagi kodni admin panel → Sozlamalar → “Google Search Console kodi” ga kiriting → Verify. Keyin Sitemaps bo‘limiga `sitemap.xml` qo‘shing.
2. **Yandex Webmaster** (webmaster.yandex.ru): sayt qo‘shing → “Meta-teg” usuli → kodni “Yandex Webmaster kodi” ga kiriting. Sitemap’ni ham qo‘shing. Rus tilidagi qidiruv uchun muhim.
3. **Google Business Profile** (business.google.com): “Servis xizmati” toifasida profil oching. Manzil sifatida ustaxona yoki “xizmat ko‘rsatish hududi” (Toshkent, viloyatlar). Telefon +998 99 707 99 17, sayt manzili, ish vaqti. Bajarilgan ishlar rasmlarini yuklang va har mijozdan sharh so‘rang: sharhlar xaritada birinchi qatorga chiqaradi.
4. **2GIS** (2gis.uz → “Kompaniya qo‘shish”, yoki account.2gis.com): nom, toifa (“Sanoat uskunalarini ta’mirlash”, “Robototexnika”), telefon, sayt, Telegram. Tasdiqlash qo‘ng‘iroq orqali bo‘ladi.
5. **Yandex Biznes** (business.yandex.ru): Yandex Xaritalarda chiqish uchun xuddi shu ma’lumotlar.

Hamma joyda nom, telefon va manzil bir xil yozilsin: qidiruv tizimlari shunga qarab ishonadi.

## Hostingga joylash

Saytga **doimiy disk** kerak (baza va rasmlar `DATA_DIR` papkasida saqlanadi).

| Variant | Qanday |
|---|---|
| **Railway** (oson) | GitHub’ga yuklang → New Project → repo. Volume qo‘shib `/data` ga ulang. Variables’ga `.env.example` dagi qiymatlarni kiriting. Settings → Domains’da domen ulang |
| Render, Fly.io | `Dockerfile` tayyor. Persistent disk’ni `/data` ga ulang |
| O‘z VPS (Ubuntu) | Node 22 o‘rnating, `npm ci --omit=dev`, `deploy/texnika.service.example` (systemd) va `deploy/nginx.conf.example` (HTTPS) dan foydalaning |
| Docker | `docker build -t texnika . && docker run -d -p 8080:8080 -v texnika-data:/data --env-file .env texnika` |

Zaxira nusxa: `DATA_DIR` papkasini (`texnika.db` va `media/`, `uploads/`) muntazam nusxalang.

## Admin panelda nima qilasiz

- **Analitika**: tashrifchilar, sahifa ko‘rishlar, arizalar, konversiya, kunlik grafik, sahifalar, tillar, qayerdan kelishgani, qurilmalar, qaysi tugmalar bosilgani, arizalar holati va ustuvorligi, akademiya natijalari. Cookie ishlatilmaydi, IP saqlanmaydi.
- **Arizalar**: qidirish, filtr, rasmlar, AI tashxis, holat va izoh (mijozga ko‘rinadigan yoki ichki), CSV eksport, o‘chirish.
- **Portfel**: uch tilda ish qo‘shish, rasmlar yuklash. “Namuna” ishlar Google’da indekslanmaydi, o‘zingiznikini qo‘shgach ularni o‘chiring.
- **Akademiya**: kurs, darslar (oddiy formatlash: `## sarlavha`, `- ro‘yxat`, `1. qadam`, `> ogohlantirish`, `**qalin**`), test, korxona kodlari, tinglovchilar va sertifikatlar.
- **Matnlar**: saytdagi istalgan matnni har uch tilda tahrirlash va asl holiga qaytarish, SEO sarlavha va tavsiflar ham shu yerda.

## Xavfsizlik

- Qat’iy CSP (inline skript yo‘q, Trusted Types), HSTS, X-Frame-Options, nosniff, COOP/CORP, Permissions-Policy.
- Telegram Mini App: har kirishda Telegram imzosi (initData HMAC) tekshiriladi, mijoz faqat o‘z arizalari, kuzatayotgan arizalari va ulangan korxonasi ma’lumotini ko‘radi. Webhook maxfiy kalit bilan himoyalangan.
- Admin: scrypt bilan xeshlangan parol, HttpOnly + SameSite=Strict cookie, CSRF tokeni, kirishga urinishlar cheklovi, parol o‘zgarsa barcha sessiyalar yopiladi.
- Formalar: bot tuzog‘i, IP bo‘yicha cheklov, begona sayt so‘rovlari rad etiladi, rasmlar fayl boshidagi baytlar bo‘yicha tekshiriladi va alohida himoyalangan holda beriladi.
- AI ga mijoz matni “ma’lumot” sifatida beriladi, javob server tomonda tekshiriladi; xavfli ko‘rsatma bermaslik qoidalari bor.
- CSV eksportda formula hujumidan himoya. `/.well-known/security.txt` mavjud.

## Fayllar

```
server/   server.mjs (marshrutlar), ops.mjs (xato kodlari, uskunalar, profilaktika, hujjatlar), tgapp.mjs (mijoz boti, Mini App API),
          db.mjs, ai.mjs, telegram.mjs, security.mjs, analytics.mjs, seed-data.mjs, errorcodes-data.mjs, selftest.mjs
src/      scene.mjs (payvand va PLC sahnalari), template5.mjs (bo‘limlar, qo‘llab-quvvatlash), template.mjs + template2.mjs (sahifalar va SEO), content.mjs + content2.mjs + content3.mjs (3 tildagi matnlar),
          app.js, style.css, admin.js, admin.css, tg.js + tg.css (Mini App), fonts/
public/   rasmlar, favicon, manifest
build.mjs serversiz ko‘rib chiqish fayli (preview/texnika-servis.html)
```
