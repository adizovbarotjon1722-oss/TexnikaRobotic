// Darslar uchun xavfsiz markdown: ## sarlavha, - ro'yxat, 1. raqamli ro'yxat, > ogohlantirish, **qalin**.
// Avval hamma narsa ekranlanadi, keyin faqat shu belgilar HTML ga aylantiriladi.
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const inline = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

export function md(src) {
  const out = [];
  let list = null; // 'ul' | 'ol'
  let para = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  for (const raw of String(src).split('\n')) {
    const line = raw.trim();
    let m;
    if (!line) { flushPara(); closeList(); continue; }
    if ((m = line.match(/^##\s+(.+)/))) { flushPara(); closeList(); out.push(`<h3>${inline(m[1])}</h3>`); continue; }
    if ((m = line.match(/^>\s?(.+)/))) { flushPara(); closeList(); out.push(`<p class="warn">${inline(m[1])}</p>`); continue; }
    if ((m = line.match(/^[-*]\s+(.+)/))) { flushPara(); if (list !== 'ul') { closeList(); out.push('<ul>'); list = 'ul'; } out.push(`<li>${inline(m[1])}</li>`); continue; }
    if ((m = line.match(/^\d+[.)]\s+(.+)/))) { flushPara(); if (list !== 'ol') { closeList(); out.push('<ol>'); list = 'ol'; } out.push(`<li>${inline(m[1])}</li>`); continue; }
    closeList();
    para.push(line);
  }
  flushPara(); closeList();
  return out.join('\n');
}
