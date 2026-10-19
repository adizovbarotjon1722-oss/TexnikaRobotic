# Texnika Servis sayti

Uch tilli (o‘zbek `/`, rus `/ru/`, ingliz `/en/`) servis sayti: AI tashxis, arizalar Telegramga, ariza holatini kuzatish, portfel, xodimlar akademiyasi, analitika va admin panel.

Texnologiya: Node.js 22 (framework yo‘q), ichki SQLite bazasi, bitta tashqi kutubxona (`@anthropic-ai/sdk`).

## Nima bor

| Bo‘lim | Manzil | Vazifasi |
|---|---|---|
| Bosh sahifa | `/`, `/ru/`, `/en/` | Xizmatlar, narx rejalari, portfel, akademiya, savol-javob, pastda katta telefon raqam |
| AI tashxis va ariza | bosh sahifa `#contact` | Mijoz matn va 4 tagacha rasm yuboradi, AI tashxis, ustuvorlik va keyingi qadamlarni beradi. Ariza Telegramga keladi |
| Ariza holati | `/track/` | Mijoz `TX-XXXX-XXXX` raqami bilan holat va yangilanishlarni ko‘radi (ism, telefon ko‘rsatilmaydi) |
| Portfel | `/portfolio/` | Bajarilgan ishlar: muammo, yechim, natija, rasmlar. Har til uchun alohida URL va SEO |
| Akademiya | `/academy/` | Robot va uskunalar bo‘yicha kurslar, test, tekshiriladigan sertifikat. Korxonaga kirish kodi bilan |
| Admin panel | `/admin` | Analitika, arizalar, portfel, kurslar, kirish kodlari, saytdagi barcha matnlarni tahrirlash, sozlamalar |

## Kompyuterda ishga tushirish

```bash
npm install
ADMIN_PASSWORD='kamida-10-belgili-parol' npm start
# http://localhost:8080  va  http://localhost:8080/admin
npm test   # 25 ta avtomatik tekshiruv
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
   - `/holat TX-7F3K-9QWD scheduled Ertaga 10:00 da boramiz` (holat: new, diagnosing, scheduled, in_progress, waiting_parts, done, cancelled)
   - `/oxirgi` — oxirgi 5 ta ariza
5. Admin panel → Sozlamalar → “Sinov xabari” bilan tekshiring.

### 2. AI tashxis (AI Gateway)

- `AI_GATEWAY_URL` — gateway manzili (masalan, Vercel AI Gateway: `https://ai-gateway.vercel.sh`).
- `AI_GATEWAY_API_KEY` — gateway kaliti.
- `AI_MODEL` — gateway talab qiladigan model nomi (odatda `anthropic/claude-opus-5.5`).
- Gateway ishlatmasangiz: faqat `ANTHROPIC_API_KEY` bering, `AI_MODEL=claude-opus-5-5`.

Kalit berilmasa sayt ishlayveradi, faqat “AI tashxis” tugmasi “hozircha o‘chiq” deydi, ariza baribir yuboriladi. Bir IP dan soatiga 6 ta tashxis cheklovi bor (xarajatni nazorat qilish uchun).

### 3. Domen va aloqa ma’lumotlari

`PUBLIC_URL=https://sizning-domen.uz`. Telefon, Telegram, WhatsApp, email, shahar va brend nomini admin panel → Sozlamalardan o‘zgartirasiz (yoki `site.config.json`).

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
- Admin: scrypt bilan xeshlangan parol, HttpOnly + SameSite=Strict cookie, CSRF tokeni, kirishga urinishlar cheklovi, parol o‘zgarsa barcha sessiyalar yopiladi.
- Formalar: bot tuzog‘i, IP bo‘yicha cheklov, begona sayt so‘rovlari rad etiladi, rasmlar fayl boshidagi baytlar bo‘yicha tekshiriladi va alohida himoyalangan holda beriladi.
- AI ga mijoz matni “ma’lumot” sifatida beriladi, javob server tomonda tekshiriladi; xavfli ko‘rsatma bermaslik qoidalari bor.
- CSV eksportda formula hujumidan himoya. `/.well-known/security.txt` mavjud.

## Fayllar

```
server/   server.mjs (marshrutlar), db.mjs, ai.mjs, telegram.mjs, security.mjs, analytics.mjs, seed-data.mjs, selftest.mjs
src/      template.mjs (sahifalar va SEO), content.mjs + content2.mjs (3 tildagi matnlar), app.js, style.css, admin.js, admin.css, fonts/
public/   rasmlar, favicon, manifest
build.mjs serversiz ko‘rib chiqish fayli (preview/texnika-servis.html)
```
