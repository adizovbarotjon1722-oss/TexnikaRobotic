# Saytni o‘z kompyuteringizda ishga tushirish (Windows)

## 1. Bir martalik tayyorgarlik

1. **Node.js o‘rnating.** https://nodejs.org saytidan **LTS** versiyasini (22.13 yoki undan yangi) yuklab, oddiy “Next → Next” bilan o‘rnating.
2. **Sayt fayllarini oching.** `texnika-site.zip` ni masalan `C:\texnika-site` papkasiga chiqaring (o‘ng tugma → “Extract All”).

## 2. Ishga tushirish

1. Papkadagi **`start-windows.bat`** faylini ikki marta bosing.
2. Birinchi marta u `.env` faylini yaratib, Notepad’da ochadi. Unda:
   - `ADMIN_PASSWORD=` dan keyin admin panel parolini yozing (kamida 10 belgi);
   - Telegram’ga ariza kelishini xohlasangiz, `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` ni yozing;
   - saqlang (Ctrl+S) va Notepad’ni yoping.
3. `start-windows.bat` ni yana ikki marta bosing. Birinchi safar kutubxonalar o‘rnatiladi (1–2 daqiqa), keyin “Sayt ishga tushdi” yozuvi chiqadi.
4. Brauzerda oching:
   - sayt: http://localhost:3080
   - admin panel: http://localhost:3080/admin

Qora oyna ochiq turgan paytda sayt ishlaydi. To‘xtatish uchun oynada **Ctrl+C** bosing yoki oynani yoping.
Windows “Firewall” ruxsat so‘rasa, **Allow** ni bosing.

## 3. Saytni internetda boshqalarga ko‘rsatish (Cloudflare Tunnel, bepul)

Routerda port ochish shart emas va xavfsizroq.

1. Boshlash menyusidan **PowerShell** ni oching va yozing:
   ```
   winget install Cloudflare.cloudflared
   ```
2. Sayt ishlab turganda, yangi PowerShell oynasida:
   ```
   cloudflared tunnel --protocol http2 --url http://127.0.0.1:3080
   ```
3. Oynada `https://....trycloudflare.com` ko‘rinishidagi manzil chiqadi. Shu manzil orqali sayt hamma joydan ochiladi.
4. Shu manzilni `.env` dagi `PUBLIC_URL=` qatoriga yozing va saytni qayta ishga tushiring. Shundan keyin Telegram bot va Mini App ham ishlaydi.

Eslatma: bu bepul manzil `cloudflared` har qayta ishga tushganda o‘zgaradi. Doimiy manzil uchun domen sotib olib, uni Cloudflare’ga ulaysiz (u ham bepul). Shunda manzil o‘zgarmaydi.

## 4. Muhim

- Kompyuter **o‘chmasligi va uxlab qolmasligi** kerak: Sozlamalar → Tizim → Quvvat → “Uyqu rejimi: Hech qachon”.
- Barcha arizalar, kurslar va rasmlar `data` papkasida saqlanadi. Uni vaqti-vaqti bilan fleshka yoki bulutga nusxalang.
- `.env` faylini hech kimga bermang: unda parol va kalitlar bor.

## Admin panelga kira olmasangiz

Admin parol sayt **birinchi marta** ishga tushganda saqlanadi. Keyin `.env` dagi `ADMIN_PASSWORD` ni o‘zgartirsangiz, bu o‘zi yetmaydi: eski parol ishlashda davom etadi.

Parolni tiklash:
1. `.env` ni Notepad’da oching, `ADMIN_PASSWORD=` dan keyin yangi parol yozing (kamida 10 belgi, bo‘sh joysiz) va saqlang.
2. Sayt papkasidagi `admin-parolni-tiklash.bat` ni ikki marta bosing. "Admin parol yangilandi" chiqadi.
3. Brauzerda `/admin` ni ochib, shu parol bilan kiring. Sayt ishlab turgan bo‘lsa ham uni qayta ishga tushirish shart emas.

5 marta noto‘g‘ri parol kiritilsa, kirish 15 daqiqaga bloklanadi. Shunda 15 daqiqa kuting.
