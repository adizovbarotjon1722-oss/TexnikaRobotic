// Summani so‘z bilan yozish (hujjatlar uchun): uz, ru, en
const UZ = {
  ones: ['', 'bir', 'ikki', 'uch', 'to‘rt', 'besh', 'olti', 'yetti', 'sakkiz', 'to‘qqiz'],
  tens: ['', 'o‘n', 'yigirma', 'o‘ttiz', 'qirq', 'ellik', 'oltmish', 'yetmish', 'sakson', 'to‘qson'],
  scales: ['', 'ming', 'million', 'milliard', 'trillion']
};
function uzTriple(n) {
  const h = Math.floor(n / 100), t = Math.floor((n % 100) / 10), o = n % 10;
  return [h ? `${UZ.ones[h]} yuz` : '', UZ.tens[t], UZ.ones[o]].filter(Boolean).join(' ');
}

const RU = {
  onesM: ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'],
  onesF: ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'],
  teens: ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'],
  tens: ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'],
  hundreds: ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'],
  scales: [null, ['тысяча', 'тысячи', 'тысяч', 1], ['миллион', 'миллиона', 'миллионов', 0], ['миллиард', 'миллиарда', 'миллиардов', 0], ['триллион', 'триллиона', 'триллионов', 0]]
};
const ruForm = (n, [one, few, many]) => { const a = n % 100, b = n % 10; return a > 10 && a < 20 ? many : b === 1 ? one : b >= 2 && b <= 4 ? few : many; };
function ruTriple(n, fem) {
  const h = Math.floor(n / 100), t = Math.floor((n % 100) / 10), o = n % 10;
  const parts = [RU.hundreds[h]];
  if (t === 1) parts.push(RU.teens[o]); else parts.push(RU.tens[t], (fem ? RU.onesF : RU.onesM)[o]);
  return parts.filter(Boolean).join(' ');
}

const EN = {
  ones: ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
  tens: ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
  scales: ['', 'thousand', 'million', 'billion', 'trillion']
};
function enTriple(n) {
  const h = Math.floor(n / 100), r = n % 100;
  const rest = r < 20 ? EN.ones[r] : [EN.tens[Math.floor(r / 10)], EN.ones[r % 10]].filter(Boolean).join('-');
  return [h ? `${EN.ones[h]} hundred` : '', rest].filter(Boolean).join(' ');
}

function words(n, lang) {
  n = Math.floor(Math.abs(Number(n) || 0));
  if (n === 0) return { uz: 'nol', ru: 'ноль', en: 'zero' }[lang] || 'nol';
  const groups = [];
  while (n > 0) { groups.push(n % 1000); n = Math.floor(n / 1000); }
  const out = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (!g) continue;
    if (lang === 'ru') {
      const sc = RU.scales[i];
      out.push(ruTriple(g, sc ? sc[3] === 1 : false));
      if (sc) out.push(ruForm(g, sc));
    } else if (lang === 'en') {
      out.push(enTriple(g)); if (EN.scales[i]) out.push(EN.scales[i]);
    } else {
      out.push(uzTriple(g)); if (UZ.scales[i]) out.push(UZ.scales[i]);
    }
  }
  return out.join(' ');
}

const CUR = {
  uz: { UZS: ['so‘m', 'tiyin'], USD: ['AQSh dollari', 'sent'], EUR: ['yevro', 'sent'], RUB: ['rubl', 'tiyin'] },
  ru: { UZS: ['сум', 'тийин'], USD: ['долл. США', 'цент.'], EUR: ['евро', 'цент.'], RUB: ['руб.', 'коп.'] },
  en: { UZS: ['soum', 'tiyin'], USD: ['US dollars', 'cents'], EUR: ['euro', 'cents'], RUB: ['roubles', 'kopecks'] }
};

export function amountInWords(amount, cur = 'UZS', lang = 'uz') {
  const l = CUR[lang] ? lang : 'uz';
  const a = Math.round((Number(amount) || 0) * 100) / 100;
  const whole = Math.floor(a), frac = Math.round((a - whole) * 100);
  const [main, minor] = CUR[l][cur] || [cur, ''];
  const w = words(whole, l);
  return `${w.charAt(0).toUpperCase()}${w.slice(1)} ${main} ${String(frac).padStart(2, '0')} ${minor}`.trim();
}
