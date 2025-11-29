@echo off
echo 🧪 Testando API do Projeto Zen...
echo.

echo 📡 Testando Backend...
curl -s http://localhost:3001/health
echo.
echo.

echo 🤖 Testando API Gemini...
curl -s http://localhost:3001/api/test
echo.
echo.

echo 💬 Testando Chat...
curl -s -X POST http://localhost:3001/api/chat -H "Content-Type: application/json" -d "{\"message\":\"Oi\"}"
echo.
echo.

echo ✅ Testes concluídos!
pause