@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao foi encontrado. Instale o Node.js 18 ou mais recente para iniciar o jogo.
  pause
  exit /b 1
)
start "Bob Roll - servidor" /min cmd /c "cd /d ""%~dp0"" && node server/server.mjs"
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"
