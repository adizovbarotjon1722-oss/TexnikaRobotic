// Matnlarni birlashtirish: content.mjs + content2.mjs + admin paneldagi tahrirlar (overrides).
import { content } from './content.mjs';
import { content2 } from './content2.mjs';
import { content3 } from './content3.mjs';
import { content4 } from './content4.mjs';
import { content5 } from './content5.mjs';
import { content7 } from './content7.mjs';
import { content8 } from './content8.mjs';
import { content9 } from './content9.mjs';
import { content10 } from './content10.mjs';
import { content11 } from './content11.mjs';
import { content12 } from './content12.mjs';
import { content13 } from './content13.mjs';

export const LANGS = ['uz', 'ru', 'en'];

const isObj = (o) => o && typeof o === 'object' && !Array.isArray(o);

export function baseTexts(lang) {
  return { ...content[lang], ...content2[lang], ...content3[lang], ...content4[lang], ...content5[lang], ...content7[lang], ...content8[lang], ...content9[lang], ...content10[lang], ...content11[lang], ...content12[lang], ...content13[lang] };
}

// Barcha tahrirlanadigan matnlar: { "hero.h1a": "...", "faq.items.0.q": "..." }
export function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') out[key] = v;
    else if (Array.isArray(v) || isObj(v)) flatten(v, key, out);
  }
  return out;
}

function setPath(obj, path, value) {
  const parts = path.split('.');
  let o = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (o[parts[i]] === undefined || typeof o[parts[i]] !== 'object') return;
    o = o[parts[i]];
  }
  const last = parts[parts.length - 1];
  if (typeof o[last] === 'string') o[last] = value;
}

function fill(obj, vars) {
  if (typeof obj === 'string') return obj.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  if (Array.isArray(obj)) return obj.map((x) => fill(x, vars));
  if (isObj(obj)) return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fill(v, vars)]));
  return obj;
}

// overrides: { "hero.h1a": "Yangi sarlavha" } (shu til uchun)
export function texts(lang, cfg, overrides = {}) {
  const t = structuredClone(baseTexts(lang));
  for (const [k, v] of Object.entries(overrides)) setPath(t, k, v);
  return fill(t, { brand: cfg.brand, city: cfg.city[lang], hours: cfg.responseHours, wm: cfg.warrantyMonths || 3, pm: cfg.partsMonths || 12 });
}

// Ish vaqtidagi o'rinbosarlar: fmt('Ariza {code}', { code: 'TX-…' })
export const fmt = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
