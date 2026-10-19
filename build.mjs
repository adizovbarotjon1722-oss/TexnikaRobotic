// Bitta faylli ko'rib chiqish sahifasini yig'ish: node build.mjs  ->  preview/texnika-servis.html
// Haqiqiy sayt server orqali ishlaydi (npm start). Bu fayl faqat dizaynni serversiz ko'rsatish uchun:
// AI tashxis va ariza yuborish namunaviy javob bilan ishlaydi.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LANGS, renderPreview } from './src/template.mjs';
import { texts } from './src/i18n.mjs';
import { courses, portfolio } from './server/seed-data.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
cfg.domain = cfg.domain.replace(/\/+$/, '');

const textsByLang = Object.fromEntries(LANGS.map((l) => [l, texts(l, cfg)]));
const pick = (o, keys) => Object.fromEntries(keys.map((k) => [k, o[k]]));
const data = {
  portfolio: portfolio.map((p) => ({ ...pick(p, ['slug', 'brand', 'model', 'year', 'sample', 'cover']), images: [], data: pick(p, ['industry', 'title', 'problem', 'solution', 'result']) })),
  courses: courses.map((c) => ({ ...pick(c, ['slug', 'level', 'equipment', 'hours']), lessonCount: c.lessons.length, data: pick(c, ['title', 'summary', 'audience']) }))
};
const css = fs.readFileSync(path.join(ROOT, 'src/style.css'), 'utf8');
const js = fs.readFileSync(path.join(ROOT, 'src/app.js'), 'utf8');

fs.mkdirSync(path.join(ROOT, 'preview'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'preview/texnika-servis.html'), renderPreview(cfg, textsByLang, data, css, js));
console.log('OK  preview/texnika-servis.html');
