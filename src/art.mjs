// 5-bosqich chizmalari: PLC stendi, nosozlik sxemalari, bo'limlarga mos kichik animatsiyalar va orqa fon.
// Hammasi chizma uslubida: faqat chiziq, mono yorliq, bitta urg'u rangi. Animatsiya CSS da (style.css, "5-bosqich").

const svg = (cls, vb, body, label = '') => `<svg class="${cls}" viewBox="${vb}"${label ? ` role="img" aria-label="${label}"` : ' aria-hidden="true" focusable="false"'}>${body}</svg>`;
const leds = (x, y, n, cls, gap = 9) => Array.from({ length: n }, (_, i) => `<circle class="led ${cls} n${i % 8}" cx="${x}" cy="${y + i * gap}" r="2.6"/>`).join('');
const term = (x, y, n, gap = 9) => Array.from({ length: n }, (_, i) => `<rect class="tb" x="${x}" y="${y + i * gap}" width="8" height="6" rx="1"/>`).join('');

/* ---------- Katta PLC stendi (bosh sahifa va /plc/) ---------- */
export function plcRack(label = 'PLC rack') {
  const mod = (x, w, title, inner) => `<g class="pm"><rect class="pm-box" x="${x}" y="40" width="${w}" height="170" rx="4"/><path class="pm-ln" d="M${x} 62h${w}M${x} 196h${w}"/><text class="slb" x="${x + 6}" y="55">${title}</text>${inner}</g>`;
  const body = `
  <g class="rail"><rect x="6" y="112" width="508" height="22" rx="2"/><path d="${Array.from({ length: 25 }, (_, i) => `M${18 + i * 20} 120h8`).join('')}"/></g>
  ${mod(16, 58, 'PS 24V', `<path class="pm-ln" d="M26 80h38M26 88h38M26 96h38M26 104h38"/><circle class="led led-g on" cx="30" cy="150" r="3"/><text class="slb s" x="38" y="153">DC OK</text><circle class="pm-knob" cx="45" cy="178" r="7"/><path class="pm-ln" d="M45 171v7"/>`)}
  ${mod(80, 92, 'CPU 1516', `<circle class="led led-g run" cx="92" cy="76" r="3"/><text class="slb s" x="100" y="79">RUN</text><circle class="led led-r err" cx="92" cy="90" r="3"/><text class="slb s" x="100" y="93">ERROR</text><circle class="led led-y mt" cx="92" cy="104" r="3"/><text class="slb s" x="100" y="107">MAINT</text><rect class="pm-scr" x="132" y="70" width="32" height="22" rx="2"/><path class="pm-wave" d="M135 84l4-6 4 8 4-10 4 7 4-3 4 2"/><rect class="pm-ln" x="90" y="146" width="20" height="30" rx="2"/><rect class="pm-ln" x="116" y="146" width="20" height="30" rx="2"/><text class="slb s" x="92" y="188">X1 P1</text><text class="slb s" x="118" y="188">X1 P2</text><rect class="pm-card" x="144" y="140" width="20" height="40" rx="2"/><text class="slb s" x="146" y="192">SMC</text>`)}
  ${mod(178, 60, 'DI 16', `${leds(190, 74, 8, 'led-g di')}${leds(206, 74, 8, 'led-g di b')}${term(220, 70, 14)}`)}
  ${mod(244, 60, 'DQ 16', `${leds(256, 74, 8, 'led-g dq')}${leds(272, 74, 8, 'led-g dq b')}${term(286, 70, 14)}`)}
  ${mod(310, 60, 'AI 8', `<rect class="pm-ln" x="320" y="72" width="8" height="66" rx="1"/><rect class="pm-bar a1" x="321" y="73" width="6" height="64"/><rect class="pm-ln" x="334" y="72" width="8" height="66" rx="1"/><rect class="pm-bar a2" x="335" y="73" width="6" height="64"/><text class="slb s" x="318" y="152">4–20</text><text class="slb s" x="318" y="162">mA</text>${term(352, 70, 14)}`)}
  ${mod(376, 58, 'CM PN', `<circle class="led led-g lnk" cx="388" cy="76" r="3"/><text class="slb s" x="396" y="79">LINK</text><circle class="led led-r bf" cx="388" cy="90" r="3"/><text class="slb s" x="396" y="93">BF</text><rect class="pm-ln" x="386" y="146" width="20" height="30" rx="2"/>`)}
  <g class="pm-dim"><path d="M16 26h418M16 20v12M434 20v12"/><text class="slb" x="200" y="18">B 418 · DIN 35</text></g>
  <g class="wires">
    <path class="w w1" d="M228 212v28c0 10-6 16-16 16H96v34"/>
    <path class="w w2" d="M294 212v40c0 8 6 12 14 12h60v26"/>
    <path class="w w3" d="M360 212v18c0 8 6 12 14 12h96v48"/>
    <path class="w pn" d="M396 176h40c12 0 18 6 18 18v18h44v36"/>
  </g>
  <g class="dev"><rect class="pm-box" x="78" y="290" width="36" height="16" rx="8"/><path class="pm-ln" d="M114 298h12"/><path class="beam" d="M130 292l12 6-12 6"/><text class="slb s" x="74" y="322">B1 · I0.0</text></g>
  <g class="dev"><rect class="pm-box" x="352" y="290" width="32" height="24" rx="3"/><path class="pm-ln coil" d="M358 302h20"/><text class="slb s" x="348" y="330">K1 · Q0.0</text></g>
  <g class="dev"><circle class="pm-box" cx="470" cy="304" r="14"/><text class="slb" x="464" y="308">M</text><path class="pm-ln rot" d="M470 290v-4M484 304h4M470 318v4M456 304h-4"/><text class="slb s" x="454" y="334">AI 0 · PT100</text></g>
  <g class="dev"><rect class="pm-box" x="480" y="246" width="34" height="26" rx="3"/><text class="slb s" x="484" y="262">VFD</text><circle class="led led-g lnk" cx="508" cy="252" r="2"/></g>`;
  return svg('plc-rack', '0 0 520 340', body, label);
}

// Ladder diagramma: oqim chap shinadan o'ngga yuradi
export function ladder(label = 'Ladder logic') {
  const rung = (y, a, b, out, open = false) => `<g class="rung${open ? ' open' : ''}"><path class="lr" d="M20 ${y}h40M84 ${y}h40M148 ${y}h80M252 ${y}h48"/><path class="lr-flow" d="M20 ${y}h40M84 ${y}h40M148 ${y}h80M252 ${y}h48"/><path class="lc" d="M60 ${y - 9}v18M84 ${y - 9}v18"/><path class="lc" d="M124 ${y - 9}v18M148 ${y - 9}v18${open ? `M128 ${y + 8}l16-16` : ''}"/><path class="lo" d="M232 ${y - 9}a9 9 0 0 0 0 18M248 ${y - 9}a9 9 0 0 1 0 18"/><text class="slb s" x="58" y="${y - 13}">${a}</text><text class="slb s" x="122" y="${y - 13}">${b}</text><text class="slb s" x="230" y="${y - 13}">${out}</text></g>`;
  return svg('ladder', '0 0 320 150', `<path class="rail-l" d="M20 10v130M300 10v130"/>${rung(40, 'I0.0', 'I0.1', 'Q0.0')}${rung(84, 'Q0.0', 'M10.2', 'Q0.1')}${rung(126, 'I0.4', 'T37', 'Q0.2', true)}`, label);
}

/* ---------- Nosozlik sxemalari (har bir karta uchun) ---------- */
export function faultPic(kind) {
  const frame = (inner) => svg(`fp fp-${kind}`, '0 0 160 100', `<path class="fp-grid" d="M0 25h160M0 50h160M0 75h160M40 0v100M80 0v100M120 0v100"/>${inner}`);
  const ledRow = (items) => items.map(([y, cls, txt]) => `<circle class="led ${cls}" cx="40" cy="${y}" r="3.2"/><text class="slb s" x="48" y="${y + 3}">${txt}</text>`).join('');
  switch (kind) {
    case 'cpu': return frame(`<rect class="pm-box" x="26" y="12" width="70" height="78" rx="3"/><text class="slb s" x="32" y="24">CPU</text>${ledRow([[38, 'led-g', 'RUN'], [54, 'led-y on', 'STOP'], [70, 'led-r blink', 'SF']])}<rect class="pm-scr" x="104" y="20" width="44" height="30" rx="2"/><text class="slb s err-t" x="108" y="32">DIAG</text><text class="slb s err-t" x="108" y="44">OB 80</text>`);
    case 'bus': return frame(`<rect class="pm-box" x="10" y="30" width="40" height="40" rx="3"/><text class="slb s" x="16" y="44">CPU</text><circle class="led led-r blink" cx="20" cy="58" r="3"/><text class="slb s" x="26" y="61">BF</text><rect class="pm-box" x="110" y="30" width="40" height="40" rx="3"/><text class="slb s" x="114" y="44">ET200</text><path class="w" d="M50 50h22"/><path class="w brk" d="M72 50l5-8 6 16 5-8"/><path class="w" d="M88 50h22"/><text class="slb s err-t" x="66" y="78">×</text>`);
    case 'io': return frame(`<rect class="pm-box" x="26" y="10" width="52" height="82" rx="3"/><text class="slb s" x="32" y="22">DI 8</text>${[0, 1, 2, 3, 4, 5].map((i) => `<circle class="led led-g ${i === 3 ? 'dead' : i % 2 ? 'on' : 'di n' + i}" cx="40" cy="${32 + i * 10}" r="2.6"/><text class="slb s" x="48" y="${35 + i * 10}">.${i}</text>`).join('')}<path class="w" d="M78 62h30"/><rect class="pm-box" x="108" y="54" width="34" height="16" rx="8"/><path class="beam" d="M146 56l8 6-8 6"/><text class="slb s err-t" x="86" y="58">0 V</text>`);
    case 'analog': return frame(`<path class="fp-ax" d="M16 86h134M16 86V10"/><path class="fp-set" d="M16 44h134"/><path class="fp-sig" d="M16 46c10-2 14 4 22 0s12-8 20-2 12 12 22 6 10-14 20-10 12 18 22 12 12-6 28-14"/><text class="slb s" x="20" y="38">SP 12 mA</text><text class="slb s err-t" x="100" y="80">±2.4 mA</text>`);
    case 'mem': return frame(`<path class="pm-box" d="M24 18h34l10 10v54H24z"/><path class="pm-ln" d="M30 18v12M38 18v12M46 18v12"/><text class="slb s" x="28" y="62">SMC</text><text class="slb s err-t" x="28" y="74">?</text><rect class="pm-box" x="92" y="34" width="44" height="26" rx="3"/><path class="pm-ln" d="M136 42h6v10h-6"/><rect class="batt" x="96" y="38" width="10" height="18"/><circle class="led led-y blink" cx="100" cy="76" r="3.2"/><text class="slb s" x="108" y="79">BATT</text>`);
    case 'hmi': return frame(`<rect class="pm-box" x="22" y="10" width="116" height="74" rx="4"/><rect class="pm-scr" x="30" y="18" width="100" height="56" rx="2"/><text class="slb s" x="38" y="34">P1  ****</text><text class="slb s" x="38" y="46">T1  ****</text><text class="slb s err-t blink-t" x="38" y="64">NO CONNECTION</text><path class="pm-ln" d="M70 84v8h20v-8"/>`);
    case 'psu': return frame(`<path class="fp-ax" d="M14 86h136M14 86V10"/><path class="fp-set" d="M14 28h136"/><text class="slb s" x="18" y="22">24 V</text><path class="fp-sig" d="M14 30h40l4 30 4-30h20l3 44 3-44h56"/><text class="slb s err-t" x="64" y="82">17 V · 3 ms</text>`);
    case 'logic': return frame(`<path class="rail-l" d="M12 14v74M148 14v74"/><path class="lr" d="M12 36h28M52 36h28M92 36h30M134 36h14"/><path class="lc" d="M40 28v16M52 28v16M80 28v16M92 28v16M84 42l6-12"/><path class="lo" d="M122 28a8 8 0 0 0 0 16M134 28a8 8 0 0 1 0 16"/><path class="lr-flow half" d="M12 36h28M52 36h28"/><path class="lr" d="M12 70h136"/><text class="slb s" x="34" y="24">I1.2</text><text class="slb s err-t" x="74" y="24">T37</text><text class="slb s" x="118" y="24">Q4.0</text><text class="slb s" x="40" y="84">? interlock</text>`);
    default: return '';
  }
}

/* ---------- Bo'lim sarlavhasidagi kichik animatsiyalar ---------- */
const SART = {
  gears: '<g class="g1"><circle cx="40" cy="42" r="20"/><circle cx="40" cy="42" r="6"/><path d="M40 16v6M40 62v6M14 42h6M60 42h6M21.6 23.6l4.2 4.2M54.2 56.2l4.2 4.2M21.6 60.4l4.2-4.2M54.2 27.8l4.2-4.2"/></g><g class="g2"><circle cx="82" cy="30" r="13"/><circle cx="82" cy="30" r="4"/><path d="M82 13v4M82 43v4M65 30h4M95 30h4M70 18l3 3M91 39l3 3M70 42l3-3M91 21l3-3"/></g>',
  scan: '<path class="sa-ax" d="M8 66h104M8 66V10"/><path class="sa-sig" d="M8 48c8 0 10-24 18-24s10 30 18 30 8-36 18-36 10 26 18 26 10-14 24-14"/><path class="sa-scan" d="M20 8v58"/>',
  conveyor: '<rect x="6" y="54" width="108" height="12" rx="6"/><circle class="roll" cx="14" cy="60" r="3.5"/><circle class="roll" cx="60" cy="60" r="3.5"/><circle class="roll" cx="106" cy="60" r="3.5"/><g class="box b1"><rect x="0" y="34" width="20" height="18" rx="2"/></g><g class="box b2"><rect x="0" y="34" width="20" height="18" rx="2"/></g>',
  clip: '<rect x="28" y="8" width="64" height="66" rx="3"/><rect x="46" y="4" width="28" height="9" rx="2"/><path class="ck c1" d="M36 28l4 4 8-8"/><path class="ck c2" d="M36 44l4 4 8-8"/><path class="ck c3" d="M36 60l4 4 8-8"/><path d="M56 28h28M56 44h28M56 60h20"/>',
  caliper: '<path d="M8 22h104v10H8z"/><path d="M14 32v28l8-6V32"/><g class="jaw"><path d="M60 14v18M60 32v28l-8-6V32"/><rect x="52" y="12" width="22" height="24" rx="2"/></g><path class="tick" d="M20 22v-6M30 22v-4M40 22v-6M50 22v-4M80 22v-4M90 22v-6M100 22v-4"/>',
  alarm: '<path class="tri" d="M60 10 104 70H16z"/><path d="M60 32v18M60 58v2"/><path class="ray r1" d="M18 30l-10-6M102 30l10-6"/><path class="ray r2" d="M14 48H2M106 48h12"/>',
  stars: [0, 1, 2, 3, 4].map((i) => `<path class="st s${i}" d="M${14 + i * 23} 30l3.5 7 7.7 1.1-5.6 5.4 1.3 7.6-6.9-3.6-6.9 3.6 1.3-7.6-5.6-5.4 7.7-1.1z"/>`).join('') + '<path d="M8 66h104"/>',
  screen: '<rect x="14" y="10" width="92" height="54" rx="3"/><path d="M46 74h28M60 64v10"/><path class="play" d="M52 26v22l20-11z"/><path class="sa-ax" d="M22 56h76"/><path class="bar" d="M22 56h34"/>',
  book: '<path d="M60 18c-14-8-32-8-48-2v52c16-6 34-6 48 2 14-8 32-8 48-2V16c-16-6-34-6-48 2z"/><path d="M60 18v52"/><path class="page" d="M60 20c10-6 24-7 38-3v48c-14-4-28-3-38 3z"/>',
  magnifier: '<path class="sa-ax" d="M10 20h100M10 40h100M10 60h100M30 10v62M60 10v62M90 10v62"/><g class="mag"><circle cx="44" cy="36" r="14"/><path d="M54 46l12 12"/></g>',
  ladder: '<path d="M10 8v66M110 8v66"/><path d="M10 26h24M42 26h28M78 26h32M10 56h52M70 56h40"/><path d="M34 18v16M42 18v16M62 48v16M70 48v16"/><path class="lr-flow" d="M10 26h24M42 26h28M78 26h32"/><circle class="led led-g run" cx="94" cy="26" r="3"/>',
  stamp: '<g class="stamp"><path d="M60 8 34 18v20c0 18 12 30 26 34 14-4 26-16 26-34V18z"/><path d="M48 40l8 8 16-16"/></g><path class="ink" d="M20 74h80"/>',
  gauge: '<path d="M16 64a44 44 0 0 1 88 0"/><path class="tick" d="M22 46l6 3M38 28l4 5M60 20v6M82 28l-4 5M98 46l-6 3"/><path class="hot" d="M86 34a44 44 0 0 1 18 30"/><g class="needle"><path d="M60 64 60 28"/><circle cx="60" cy="64" r="4"/></g>',
  headset: '<path d="M30 46v-8a30 30 0 0 1 60 0v8"/><rect x="22" y="44" width="14" height="22" rx="4"/><rect x="84" y="44" width="14" height="22" rx="4"/><path d="M91 66c0 8-8 12-20 12h-6"/><path class="wave w1" d="M104 46c4 4 4 12 0 16"/><path class="wave w2" d="M110 40c7 7 7 21 0 28"/><path class="wave w1" d="M16 46c-4 4-4 12 0 16"/><path class="wave w2" d="M10 40c-7 7-7 21 0 28"/>',
  grid: '<rect x="14" y="10" width="26" height="26" rx="3"/><rect x="47" y="10" width="26" height="26" rx="3"/><rect x="80" y="10" width="26" height="26" rx="3"/><rect x="14" y="44" width="26" height="26" rx="3"/><rect class="cell" x="47" y="44" width="26" height="26" rx="3"/><rect x="80" y="44" width="26" height="26" rx="3"/>',
  factory: '<path d="M8 72V40l22 12V40l22 12V40l22 12V22h12v50z"/><path d="M80 22V10h8v12"/><circle class="puff p1" cx="84" cy="6" r="4"/><circle class="puff p2" cx="90" cy="2" r="3"/><path d="M18 62h8M40 62h8M62 62h8"/>',
  plcmini: '<rect x="8" y="12" width="104" height="54" rx="3"/><path d="M34 12v54M60 12v54M86 12v54"/>' + [0, 1, 2, 3].map((c) => [0, 1, 2, 3].map((r) => `<circle class="led led-g di n${(c * 4 + r) % 8}" cx="${21 + c * 26}" cy="${24 + r * 10}" r="2.4"/>`).join('')).join('')
};
export const sart = (name) => (SART[name] ? svg(`sa sa-${name}`, '0 0 120 80', SART[name]) : '');

/* ---------- Butun sahifa orqa foni: robotlar va PLC (juda xira, sekin) ---------- */
export const bgArt = `<div class="bg-art" aria-hidden="true">
${svg('bga bga-robot', '0 0 300 300', `<path d="M40 290h220"/><path d="M90 290l10-36h60l10 36"/><g class="bj1"><path d="M122 254c-6-40-2-80 6-118h20c8 38 10 78 4 118"/><circle cx="138" cy="254" r="14"/><g class="bj2"><path d="M138 136l96-34 8 20-96 34"/><circle cx="138" cy="136" r="12"/><g class="bj3"><circle cx="238" cy="112" r="9"/><path d="M246 108l26-6 2 14-26 6"/><path class="bga-tcp" d="M276 102v18"/></g></g></g><path class="bga-path" d="M200 40c40 10 70 40 80 80"/><path class="bga-dim" d="M20 254V136M14 254h12M14 136h12"/><text x="4" y="200" transform="rotate(-90 4 200)">A2 · 1150</text>`)}
${svg('bga bga-plc', '0 0 260 200', `<rect x="10" y="40" width="240" height="120" rx="4"/><path d="M10 64h240M10 140h240M58 40v120M110 40v120M162 40v120M214 40v120"/>${[0, 1, 2, 3].map((c) => [0, 1, 2, 3, 4, 5].map((r) => `<circle class="led n${(c * 6 + r) % 8}" cx="${76 + c * 52}" cy="${76 + r * 10}" r="2.6"/>`).join('')).join('')}<circle class="led run" cx="26" cy="80" r="3"/><path d="M0 100h10M250 100h10"/><path class="bga-path" d="M30 160v30h200v-30"/><text x="16" y="30">CPU · DI · DQ · AI · CM</text>`)}
${svg('bga bga-scara', '0 0 220 220', `<path d="M60 210h100"/><rect x="92" y="150" width="36" height="60"/><g class="bs1"><path d="M110 150V60"/><circle cx="110" cy="60" r="10"/><g class="bs2"><path d="M110 60h80"/><circle cx="190" cy="60" r="8"/><path d="M190 68v50"/></g></g><path class="bga-dim" d="M110 30h80M110 24v12M190 24v12"/><text x="132" y="20">R 600</text>`)}
</div>`;
