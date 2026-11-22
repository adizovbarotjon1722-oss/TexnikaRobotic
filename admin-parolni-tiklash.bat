@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist .env (echo .env fayli topilmadi. & pause & exit /b 1)
call npm run admin-parol
pause
