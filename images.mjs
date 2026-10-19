// Rasmlarni yaratish (OG rasm, logo, apple-touch-icon, favicon.ico): node images.mjs
// Playwright kerak. Bir marta ishga tushirish yetarli; matn yoki brend oʻzgarsa qayta ishga tushiring.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const OUT = path.join(ROOT, 'public/assets/img');
fs.mkdirSync(OUT, { recursive: true });
const fontsCss = fs.readFileSync(path.join(ROOT, 'src/fonts/fonts.css'), 'utf8').replaceAll('../fonts/', 'file://' + path.join(ROOT, 'src/fonts') + '/');
const fav = fs.readFileSync(path.join(ROOT, 'src/static/favicon.svg'), 'utf8');

const og = `<!doctype html><html><head><meta charset="utf-8"><style>${fontsCss}
body{margin:0;width:1200px;height:630px;background:#0f151c;color:#e8edf2;font-family:'IBM Plex Sans';position:relative;overflow:hidden}
.g{position:absolute;inset:0;background-image:linear-gradient(rgba(111,151,189,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(111,151,189,.12) 1px,transparent 1px);background-size:40px 40px}
.glow{position:absolute;width:700px;height:700px;right:-200px;top:-260px;border-radius:50%;background:radial-gradient(circle,rgba(255,106,31,.35),transparent 65%)}
.c{position:absolute;left:72px;top:70px;right:72px}
.b{display:flex;align-items:center;gap:16px;font:700 30px 'Unbounded'}
.b svg{width:60px;height:60px}
h1{font:700 76px/1.04 'Unbounded';margin:70px 0 0;letter-spacing:-.02em}
h1 span{color:#ff6a1f;display:block}
p{font:500 24px 'IBM Plex Mono';color:#9aabbb;margin-top:34px;letter-spacing:.04em}
</style></head><body><div class="g"></div><div class="glow"></div><div class="c">
<div class="b">${fav}${cfg.brand}</div>
<h1>ABB · KUKA<span>Robot servis</span></h1>
<p>Remont · Elektronika · Avtomatlashtirish · ${cfg.city.uz}</p></div></body></html>`;

const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(og, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(OUT, 'og.png') });

const icon = async (size, file) => {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:#0f151c">${fav.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: path.join(OUT, file), omitBackground: false });
};
await icon(512, 'logo.png');
await icon(180, 'apple-touch-icon.png');
await icon(32, 'fav32.png');
await browser.close();

// favicon.ico: PNG ichidagi ICO konteyner
const png = fs.readFileSync(path.join(OUT, 'fav32.png'));
const hdr = Buffer.alloc(22);
hdr.writeUInt16LE(0, 0); hdr.writeUInt16LE(1, 2); hdr.writeUInt16LE(1, 4);
hdr.writeUInt8(32, 6); hdr.writeUInt8(32, 7); hdr.writeUInt8(0, 8); hdr.writeUInt8(0, 9);
hdr.writeUInt16LE(1, 10); hdr.writeUInt16LE(32, 12); hdr.writeUInt32LE(png.length, 14); hdr.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(ROOT, 'public/favicon.ico'), Buffer.concat([hdr, png]));
fs.rmSync(path.join(OUT, 'fav32.png'));
console.log('OK  rasmlar tayyor: public/assets/img/, public/favicon.ico');
