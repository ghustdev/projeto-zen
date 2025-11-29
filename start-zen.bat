@echo off
echo 🧘 Iniciando Projeto Zen...
echo.

echo 📡 Iniciando Backend (Porta 3001)...
start "Zen Backend" cmd /k "cd /d %~dp0src\components && npm start"

timeout /t 3 /nobreak >nul

echo 🌐 Iniciando Frontend (Porta 5173)...
start "Zen Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ✅ Projeto Zen iniciado!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:3001
echo.
pause