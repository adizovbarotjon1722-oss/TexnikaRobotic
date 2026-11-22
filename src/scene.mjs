// 6-bosqich sahnalari: payvandlash yacheykasi (kulrang sahna, to'q sariq robotlar, uchqunlar) va PLC uskunalari.
// Tasvirlar qo'lda chizilgan: tekis soyalar, gradient va yaltiroq effektlarsiz. Animatsiya CSS da (style.css, "6-bosqich").

// Uchqunlar: payvand nuqtasidan har tomonga, asosan pastga
const SPARK_ANGLES = [-25, 5, 25, 40, 55, 68, 80, 90, 100, 112, 125, 140, 158, 178, 205, 320];
function sparks(x, y) {
  const lines = SPARK_ANGLES.map((a, i) => `<g transform="rotate(${a} ${x} ${y})"><line class="spk k${i % 8}" x1="${x + 2}" y1="${y}" x2="${x + 7 + (i % 3) * 3}" y2="${y}"/></g>`).join('');
  const drops = [0, 1, 2, 3].map((i) => `<circle class="sdrop d${i}" cx="${x - 6 + i * 4}" cy="${y + 2}" r="1.3"/>`).join('');
  return `<g class="weld"><circle class="halo h2" cx="${x}" cy="${y}" r="26"/><circle class="halo h1" cx="${x}" cy="${y}" r="13"/><circle class="arc" cx="${x}" cy="${y}" r="4.5"/>${lines}${drops}</g>`;
}

// Bitta 6 o'qli robot. Mahalliy koordinata: (0,0) poydevor osti, robot o'ngga qaragan.
// Har bo'g'in o'z burilish nuqtasida (translate) turadi, CSS shu nuqta atrofida aylantiradi.
function robot(x, y, s, flip, phase) {
  return `<g class="rb ${phase}" transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
  <ellipse class="sc-shadow" cx="20" cy="2" rx="88" ry="12"/>
  <path class="c-ped" d="M-50 -70V-6a50 12 0 0 0 100 0V-70z"/><path class="c-ped-s" d="M18 -70V3.5a50 12 0 0 0 32-9.5V-70z"/><ellipse class="c-ped-t" cx="0" cy="-70" rx="50" ry="12"/>
  <path class="c-blk" d="M-40 -92h80v18a40 10 0 0 1-80 0z"/><ellipse class="c-blk-t" cx="0" cy="-92" rx="40" ry="10"/>
  <g transform="translate(0 -92)">
    <path class="c-or" d="M-36 0 L-31 -36 Q-27 -60 -2 -66 L28 -66 Q46 -62 45 -42 L41 0z"/><path class="c-or-d" d="M16 -66 L28 -66 Q46 -62 45 -42 L41 0 H18z"/>
    <rect class="c-blk" x="26" y="-64" width="30" height="24" rx="5"/><rect class="c-blk-t" x="52" y="-61" width="6" height="18" rx="2"/>
    <path class="c-cab" d="M-30 -8 C-58 -40 -52 -96 -22 -128"/>
    <g transform="translate(12 -50)"><g class="ra2">
      <path class="c-gry" d="M-34 -2 L-14 -96 L-3 -93 L-22 2z"/><circle class="c-gry2" cx="-14" cy="-94" r="6"/>
      <path class="c-or" d="M-22 8 C-25 -40 -15 -110 -7 -150 L40 -152 C38 -110 31 -40 25 8z"/><path class="c-or-d" d="M-5 -22 C-8 -62 -2 -110 4 -134 L23 -134 C22 -110 17 -62 13 -22z"/><path class="c-or-l" d="M-22 8 C-25 -40 -15 -110 -7 -150 L-1 -150 C-8 -110 -17 -40 -15 8z"/>
      <circle class="c-or" cx="0" cy="0" r="27"/><circle class="c-or-d" cx="0" cy="0" r="19"/><circle class="c-blk" cx="0" cy="0" r="11"/><circle class="c-ped" cx="0" cy="0" r="4"/>
      <g transform="translate(17 -150)"><g class="ra3">
        <rect class="c-blk" x="-84" y="-23" width="40" height="13" rx="4"/><rect class="c-blk" x="-90" y="-7" width="46" height="13" rx="4"/><rect class="c-blk" x="-84" y="9" width="40" height="11" rx="4"/>
        <rect class="c-or" x="-50" y="-28" width="82" height="52" rx="12"/><rect class="c-or-d" x="-50" y="4" width="82" height="20" rx="8"/>
        <path class="c-or" d="M22 -21 L160 -14 Q173 -12 173 0 Q173 12 160 14 L22 22z"/><path class="c-or-l" d="M22 -21 L160 -14 L161 -8 L22 -13z"/><path class="c-or-d" d="M22 10 L160 8 Q173 9 160 14 L22 22z"/>
        <circle class="c-or-d" cx="0" cy="0" r="22"/><circle class="c-blk" cx="0" cy="0" r="10"/>
        <path class="c-cab" d="M-74 -26 C-30 -62 80 -54 158 -26"/><path class="c-cab thin" d="M-70 -22 C-24 -50 84 -44 150 -22"/>
        <g transform="translate(166 -6)"><g class="ra5">
          <circle class="c-or" cx="0" cy="0" r="16"/><circle class="c-or-d" cx="0" cy="0" r="9"/>
          <rect class="c-blk" x="10" y="-11" width="9" height="22" rx="2"/>
          <rect class="c-gun2" x="20" y="-42" width="28" height="24" rx="3"/><path class="c-cab thin" d="M34 -42 C34 -62 10 -70 -10 -60"/>
          <rect class="c-gun" x="17" y="-20" width="36" height="32" rx="4"/><path class="c-gun-l" d="M17 -16 h36 v4 h-36z"/>
          <path class="c-arm" d="M28 12 L28 60 L44 60"/><path class="c-arm" d="M50 2 C66 12 64 40 50 50"/>
          <circle class="c-tip" cx="48" cy="56" r="2.6"/>
          ${sparks(48, 56)}
        </g></g>
      </g></g>
    </g></g>
  </g>
</g>`;
}

// Payvandlash yacheykasi (viewBox 1200x560): orqa devor, kabel novlari, markazda kuzov konduktori, 4 ta robot
export function weldCell(label = 'Robotic welding cell') {
  const seams = Array.from({ length: 10 }, (_, i) => `M${120 * (i + 1)} 0V330`).join('');
  const persp = [-200, 0, 200, 400, 600, 800, 1000, 1200, 1400].map((x) => `M600 250L${x} 560`).join('');
  return `<svg class="weld-cell" viewBox="0 -190 1200 750" preserveAspectRatio="xMidYMax slice" role="img" aria-label="${label}">
  <rect class="sc-wall" y="-190" width="1200" height="520"/><path class="sc-seam" d="M0 -60H1200"/>
  <g class="sc-ceil"><rect class="sc-metal" x="0" y="-150" width="1200" height="20"/><rect class="sc-metal3" x="0" y="-132" width="1200" height="3"/>
    <rect class="sc-lightbar" x="180" y="-126" width="220" height="8" rx="2"/><rect class="sc-lightbar" x="800" y="-126" width="220" height="8" rx="2"/>
    <polygon class="sc-beam" points="180,-118 400,-118 470,330 110,330"/><polygon class="sc-beam" points="800,-118 1020,-118 1090,330 730,330"/>
    <path class="sc-hose" d="M560 -130 V-40 M640 -130 V-40"/><rect class="sc-metal2" x="548" y="-44" width="104" height="14" rx="3"/></g><path class="sc-seam" d="${seams}M0 118H1200"/>
  <g class="sc-door"><rect class="sc-metal" x="36" y="140" width="128" height="190"/><rect class="sc-glass" x="54" y="160" width="92" height="74"/><path class="sc-glass-l" d="M60 228 L120 166"/><rect class="sc-metal2" x="140" y="252" width="10" height="34" rx="2"/></g>
  <g class="sc-tray"><rect class="sc-metal" x="0" y="34" width="1200" height="14"/><path class="sc-seam" d="M100 48V70M300 48V70M500 48V70M700 48V70M900 48V70M1100 48V70"/><path class="sc-hose" d="M220 48 C240 120 300 120 330 180M760 48 C780 130 840 120 860 170M520 48 C520 90 560 110 590 130"/></g>
  <g class="sc-rack"><rect class="sc-metal" x="1060" y="150" width="110" height="180"/><path class="sc-seam" d="M1060 196H1170M1060 242H1170M1060 288H1170"/><rect class="sc-metal2" x="1072" y="160" width="34" height="28"/><rect class="sc-metal2" x="1112" y="206" width="46" height="28"/><rect class="sc-metal2" x="1076" y="252" width="40" height="28"/><circle class="sc-lamp" cx="1150" cy="170" r="5"/></g>
  <polygon class="sc-floor" points="0,330 1200,330 1200,560 0,560"/><path class="sc-persp" d="${persp}M0 400H1200M0 470H1200"/>
  <polygon class="sc-plate" points="70,560 380,560 330,450 130,450"/><polygon class="sc-plate" points="860,560 1170,560 1080,450 890,450"/>
  <ellipse class="sc-glow" cx="600" cy="470" rx="260" ry="28"/>
  ${robot(380, 392, 0.62, false, 'p2')}
  ${robot(830, 388, 0.6, true, 'p4')}
  <g class="sc-fix">
    <rect class="sc-metal" x="440" y="96" width="320" height="22"/><rect class="sc-metal3" x="440" y="114" width="320" height="4"/>
    <rect class="sc-metal" x="452" y="118" width="16" height="330"/><rect class="sc-metal" x="732" y="118" width="16" height="330"/><rect class="sc-metal3" x="592" y="118" width="14" height="150"/>
    <path class="sc-hose" d="M470 118 C500 170 540 160 560 210M730 118 C700 170 660 170 640 214"/>

    <g class="sc-car">
      <path class="sc-body" d="M424 398 L424 352 Q428 332 452 328 L522 318 L566 272 Q576 262 596 262 L682 262 Q702 262 714 276 L744 318 L772 324 Q784 328 784 346 L784 398z"/>
      <path class="sc-win" d="M578 316 L600 278 L638 278 L638 316z"/><path class="sc-win" d="M650 316 L650 278 L688 278 Q697 278 703 286 L724 316z"/>
      <path class="sc-body-l" d="M434 340 L776 340M644 278 V396M560 320 V396M736 322 V396"/>
      <circle class="sc-arch" cx="484" cy="398" r="30"/><circle class="sc-arch" cx="724" cy="398" r="30"/>
      <path class="sc-body-e" d="M424 398 L424 352 Q428 332 452 328 L522 318 L566 272 Q576 262 596 262 L682 262 Q702 262 714 276 L744 318 L772 324 Q784 328 784 346 L784 398"/>
    </g>
    <g class="sc-clamps sc-cl0"><rect x="500" y="306" width="26" height="18" rx="3"/><rect x="590" y="250" width="24" height="16" rx="3"/><rect x="690" y="252" width="24" height="16" rx="3"/><rect x="756" y="312" width="24" height="18" rx="3"/><rect x="430" y="330" width="22" height="16" rx="3"/></g>
    <rect class="sc-metal2" x="420" y="440" width="380" height="22"/><rect class="sc-metal3" x="420" y="458" width="380" height="6"/>
  </g>
  ${robot(232, 526, 1.04, false, 'p1')}
  ${robot(1040, 528, 1.0, true, 'p3')}
  <g class="sc-smoke"><circle cx="476" cy="250" r="10"/><circle cx="534" cy="230" r="8"/><circle cx="676" cy="232" r="9"/><circle cx="790" cy="262" r="11"/></g>
</svg>`;
}

// PLC uskunalari (viewBox 640x400): HMI panel, modulli kontroller va ixcham PLC
export function plcScene(label = 'PLC controllers and HMI panel') {
  const io = (x, y, n, cls) => Array.from({ length: n }, (_, i) => `<rect class="pl-io ${cls} n${(i * 3) % 8}" x="${x + i * 9}" y="${y}" width="5" height="3" rx="1"/>`).join('');
  const screws = (x, y, n) => Array.from({ length: n }, (_, i) => `<circle class="pl-screw" cx="${x + i * 14}" cy="${y}" r="3.2"/>`).join('');
  return `<svg class="plc-scene" viewBox="0 0 640 400" role="img" aria-label="${label}">
  <defs><clipPath id="pl-disp"><rect x="350" y="190" width="100" height="56" rx="2"/></clipPath></defs>
  <ellipse class="sc-shadow" cx="330" cy="378" rx="300" ry="16"/>
  <g class="pl-hmi">
    <rect class="pl-bezel" x="250" y="26" width="372" height="238" rx="10"/><rect class="pl-bezel-d" x="256" y="258" width="360" height="10" rx="3"/>
    <rect class="pl-screen" x="264" y="40" width="344" height="198" rx="3"/>
    <rect class="pl-bar" x="264" y="40" width="344" height="18"/><text class="pl-t" x="272" y="53">LINE 3 · FILLING</text><text class="pl-t ok" x="560" y="53">AUTO</text>
    <rect class="pl-tank" x="282" y="78" width="38" height="96" rx="3"/><rect class="pl-lvl l1" x="285" y="81" width="32" height="90"/><text class="pl-t" x="284" y="190">T-101</text>
    <rect class="pl-tank" x="338" y="78" width="38" height="96" rx="3"/><rect class="pl-lvl l2" x="341" y="81" width="32" height="90"/><text class="pl-t" x="340" y="190">T-102</text>
    <path class="pl-pipe" d="M320 160H404M376 140H404V160M418 160H456"/><path class="pl-flow" d="M320 160H404M418 160H456"/>
    <g transform="translate(411 160)"><circle class="pl-pump" r="12"/><g class="pl-imp"><path class="pl-pipe" d="M-8 0H8M0 -8V8"/></g></g>
    <rect class="pl-panel" x="466" y="70" width="128" height="86" rx="2"/><path class="pl-grid" d="M466 92H594M466 114H594M466 136H594M498 70V156M530 70V156M562 70V156"/>
    <polyline class="pl-trend" points="468,130 482,124 494,128 506,112 518,116 530,102 542,108 554,96 566,100 578,88 592,92"/>
    <text class="pl-t" x="468" y="176">P1  4.82 bar</text><text class="pl-t" x="468" y="192">T1  63.4 °C</text><text class="pl-t" x="468" y="208">Q   128 l/min</text><rect class="pl-cur" x="556" y="200" width="6" height="10"/>
    <g class="pl-keys"><rect x="276" y="216" width="40" height="14" rx="2"/><rect x="322" y="216" width="40" height="14" rx="2"/><rect x="368" y="216" width="40" height="14" rx="2"/><rect x="414" y="216" width="40" height="14" rx="2"/></g>
  </g>
  <g class="pl-s1500">
    <polygon class="pl-dk-s" points="470,176 482,168 482,362 470,372"/><polygon class="pl-dk-t" points="330,176 342,168 482,168 470,176"/>
    <rect class="pl-dk" x="330" y="176" width="140" height="196" rx="3"/>
    <rect class="pl-disp" x="350" y="190" width="100" height="56" rx="2"/>
    <g clip-path="url(#pl-disp)"><g class="pl-scroll"><text class="pl-t ok" x="356" y="204">RUN</text><text class="pl-t" x="356" y="216">CPU · PN/DP</text><text class="pl-t" x="356" y="228">OB1  2.1 ms</text><text class="pl-t" x="356" y="240">DIAG  0 ERR</text><text class="pl-t ok" x="356" y="252">RUN</text><text class="pl-t" x="356" y="264">CPU · PN/DP</text><text class="pl-t" x="356" y="276">OB1  2.1 ms</text><text class="pl-t" x="356" y="288">DIAG  0 ERR</text></g></g>
    <g class="pl-btn"><rect x="356" y="254" width="18" height="10" rx="2"/><rect x="380" y="254" width="18" height="10" rx="2"/><rect x="404" y="254" width="18" height="10" rx="2"/><rect x="428" y="254" width="18" height="10" rx="2"/></g>
    <rect class="pl-led g run" x="340" y="182" width="6" height="3" rx="1"/><rect class="pl-led r" x="340" y="188" width="6" height="3" rx="1"/><rect class="pl-led y" x="340" y="194" width="6" height="3" rx="1"/>
    <path class="pl-vent" d="M344 286H456M344 294H456M344 302H456M344 310H456M344 318H456"/>
    <rect class="pl-port" x="350" y="334" width="24" height="18" rx="2"/><rect class="pl-port" x="380" y="334" width="24" height="18" rx="2"/>
    <rect class="pl-dk" x="484" y="182" width="34" height="190" rx="3"/><rect class="pl-led g lnk" x="492" y="190" width="6" height="3" rx="1"/><rect class="pl-led g" x="492" y="196" width="6" height="3" rx="1"/><path class="pl-vent" d="M490 290H512M490 298H512M490 306H512"/>
  </g>
  <path class="pl-cable" d="M92 316 C110 392 300 396 362 352"/><path class="pl-data" d="M92 316 C110 392 300 396 362 352"/>
  <g class="pl-s1200">
    <polygon class="pl-lt-s" points="300,214 312,206 312,350 300,358"/><polygon class="pl-lt-t" points="40,214 52,206 312,206 300,214"/>
    <rect class="pl-lt" x="40" y="214" width="260" height="144" rx="4"/>
    <rect class="pl-term" x="50" y="222" width="240" height="20" rx="2"/>${screws(60, 232, 17)}
    <rect class="pl-term" x="50" y="330" width="240" height="20" rx="2"/>${screws(60, 340, 17)}
    <rect class="pl-door" x="50" y="248" width="160" height="76" rx="2"/>
    ${io(60, 252, 14, 'di')}${io(60, 316, 10, 'dq')}
    <rect class="pl-led g run" x="60" y="264" width="8" height="4" rx="1"/><text class="pl-t s" x="72" y="268">RUN/STOP</text>
    <rect class="pl-led r" x="60" y="274" width="8" height="4" rx="1"/><text class="pl-t s" x="72" y="278">ERROR</text>
    <rect class="pl-led y" x="60" y="284" width="8" height="4" rx="1"/><text class="pl-t s" x="72" y="288">MAINT</text>
    <text class="pl-t s" x="140" y="268">CPU</text><text class="pl-t s" x="140" y="278">DI 14 / DQ 10</text>
    <rect class="pl-port" x="80" y="298" width="24" height="16" rx="2"/>
    <rect class="pl-sb" x="216" y="248" width="74" height="76" rx="2"/><path class="pl-sb-l" d="M224 262H282M224 272H270M224 282H276"/><rect class="pl-led g" x="224" y="298" width="6" height="3" rx="1"/><rect class="pl-led g n3" x="234" y="298" width="6" height="3" rx="1"/>
  </g>
</svg>`;
}
