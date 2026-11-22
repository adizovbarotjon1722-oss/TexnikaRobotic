// Admin parolini .env dagi ADMIN_PASSWORD ga qayta o'rnatish (parol unutilganda yoki .env da o'zgartirilganda).
// Ishga tushirish: npm run admin-parol  (sayt to'xtatilgan bo'lishi shart emas)
import { db, setSetting } from './db.mjs';
import { hashPassword } from './security.mjs';

const pw = String(process.env.ADMIN_PASSWORD || '').trim();
if (pw.length < 10) {
  console.error('\n  .env faylida ADMIN_PASSWORD= dan keyin kamida 10 belgili parol yozing, saqlang va qayta urinib ko\'ring.\n');
  process.exit(1);
}
setSetting('admin_hash', hashPassword(pw));
db.prepare('DELETE FROM sessions').run();
console.log('\n  Admin parol yangilandi. Endi /admin sahifasida .env dagi ADMIN_PASSWORD bilan kiring.\n');
