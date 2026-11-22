// Telegram: yangi arizalar haqida xabar va bot buyruqlari.
// TELEGRAM_BOT_TOKEN  @BotFather dan olingan token
// TELEGRAM_CHAT_ID    Xabarlar boradigan chat (sizning shaxsiy chat ID yoki guruh ID)
// TELEGRAM_WEBHOOK_SECRET  (ixtiyoriy) bot buyruqlari uchun maxfiy kalit
import fs from 'fs';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT = process.env.TELEGRAM_CHAT_ID || '';
const API = process.env.TELEGRAM_API_BASE || 'https://api.telegram.org'; // faqat sinov uchun almashtiriladi
export const tgEnabled = () => Boolean(TOKEN && CHAT);
export const tgChat = () => CHAT;

const h = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const PRI = { critical: '🔴 KRITIK', high: '🟠 Yuqori', normal: '🟡 O‘rtacha', low: '🟢 Past' };

export async function api(method, body) {
  const isForm = body instanceof FormData;
  const res = await fetch(`${API}/bot${TOKEN}/${method}`, {
    method: 'POST',
    headers: isForm ? undefined : { 'content-type': 'application/json' },
    body: isForm ? body : JSON.stringify(body),
    signal: AbortSignal.timeout(20000)
  });
  const j = await res.json().catch(() => ({}));
  if (!j.ok) throw new Error(`telegram ${method}: ${j.description || res.status}`);
  return j.result;
}

export async function sendText(text, extra = {}) {
  if (!tgEnabled()) return false;
  await api('sendMessage', { chat_id: CHAT, text, parse_mode: 'HTML', disable_web_page_preview: true, ...extra });
  return true;
}

// Istalgan chatga xabar (mijozlarga ham)
export async function sendTo(chatId, text, extra = {}) {
  if (!TOKEN) return false;
  await api('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true, ...extra });
  return true;
}
let me = null;
export async function botInfo() {
  if (!TOKEN) return null;
  if (!me) me = await api('getMe', {}).catch(() => null);
  return me;
}
// Mijoz yuborgan rasmni yuklab olish (eng katta o'lcham)
export async function downloadFile(fileId, maxBytes = 8 * 1024 * 1024) {
  const f = await api('getFile', { file_id: fileId });
  if (!f.file_path || (f.file_size && f.file_size > maxBytes)) return null;
  const res = await fetch(`${API}/file/bot${TOKEN}/${f.file_path}`, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.length <= maxBytes ? buf : null;
}
export const botToken = () => TOKEN;

export async function notifyRequest(r, imagePaths, adminUrl) {
  if (!tgEnabled()) return false;
  const ai = r.ai || null;
  const lines = [
    `<b>🛠 Yangi ariza ${h(r.code)}</b>`,
    `Ustuvorlik: <b>${PRI[r.priority] || r.priority}</b>`,
    '',
    `👤 ${h(r.name)}${r.company ? ` · ${h(r.company)}` : ''}`,
    `📞 ${h(r.phone)}`,
    r.service ? `🔧 ${h(r.service)}` : '',
    r.equipment ? `⚙️ ${h(r.equipment)}` : '',
    r.source && r.source !== 'web' ? `📍 Manba: ${h(r.source)}` : '',
    '',
    `<b>Muammo:</b>\n${h(r.message).slice(0, 1500)}`
  ];
  if (ai) {
    lines.push('', `<b>🤖 AI tashxis:</b> ${h(ai.diagnosis)}`);
    if (ai.causes?.length) lines.push(`<i>Sabablar:</i> ${h(ai.causes.slice(0, 3).join('; '))}`);
  }
  lines.push('', `Til: ${h(r.lang)} · <a href="${h(adminUrl)}">Admin panelda ochish</a>`);
  const text = lines.filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n').slice(0, 4000);
  // Holatni shu xabarning o'zidan o'zgartirish tugmalari (webhook ulangan bo'lsa ishlaydi)
  const kb = r.id && process.env.TELEGRAM_WEBHOOK_SECRET ? { reply_markup: { inline_keyboard: [
    [{ text: '🔍 Diagnostika', callback_data: `st:${r.id}:diagnosing` }, { text: '📅 Rejada', callback_data: `st:${r.id}:scheduled` }],
    [{ text: '🔧 Ta’mirda', callback_data: `st:${r.id}:in_progress` }, { text: '✅ Bajarildi', callback_data: `st:${r.id}:done` }]
  ] } } : {};
  await api('sendMessage', { chat_id: CHAT, text, parse_mode: 'HTML', disable_web_page_preview: true, ...kb });

  if (imagePaths.length) {
    const fd = new FormData();
    fd.append('chat_id', CHAT);
    const media = imagePaths.slice(0, 4).map((p, i) => ({ type: 'photo', media: `attach://p${i}`, ...(i === 0 ? { caption: r.code } : {}) }));
    fd.append('media', JSON.stringify(media));
    imagePaths.slice(0, 4).forEach((p, i) => fd.append(`p${i}`, new Blob([fs.readFileSync(p)]), `p${i}.jpg`));
    await api('sendMediaGroup', fd);
  }
  return true;
}

// Bot buyruqlari: /holat TX-XXXX-XXXX in_progress Izoh matni   |   /oxirgi
export function parseCommand(text) {
  const t = String(text || '').trim();
  let m = t.match(/^\/(?:holat|status)(?:@\w+)?\s+(TX-[A-Z0-9]{4}-[A-Z0-9]{4})\s+(\w+)(?:\s+([\s\S]+))?$/i);
  if (m) return { cmd: 'status', code: m[1].toUpperCase(), status: m[2].toLowerCase(), note: (m[3] || '').trim() };
  if (/^\/(?:oxirgi|last)(?:@\w+)?$/i.test(t)) return { cmd: 'last' };
  if (/^\/(?:start|help|yordam)(?:@\w+)?$/i.test(t)) return { cmd: 'help' };
  return null;
}

export async function setWebhook(url, secret) {
  return api('setWebhook', { url, secret_token: secret, allowed_updates: ['message', 'callback_query'] });
}
