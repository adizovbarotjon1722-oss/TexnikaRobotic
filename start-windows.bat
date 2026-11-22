@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js topilmadi. https://nodejs.org dan LTS versiyasini o'rnating. & pause & exit /b 1)
if not exist .env (copy .env.local.example .env >nul & echo .env yaratildi. Uni Notepad'da ochib ADMIN_PASSWORD ni yozing, keyin qayta ishga tushiring. & notepad .env & pause & exit /b 0)
if not exist node_modules (echo Kutubxonalar o'rnatilmoqda... & call npm install --omit=dev || (pause & exit /b 1))
echo Sayt ishga tushmoqda. Manzili quyida chiqadi. (to'xtatish: Ctrl+C)
call npm start
pause
