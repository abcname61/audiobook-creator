@echo off
echo.
echo 🎧 Audiobook Creator - Setup Script
echo ====================================
echo.

REM Verifica Node.js
echo ✓ Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js non trovato!
    echo Installa Node.js da: https://nodejs.org/
    pause
    exit /b 1
)
node -v

REM Verifica NPM
echo ✓ Checking NPM...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ NPM non trovato!
    pause
    exit /b 1
)
npm -v

REM Verifica FFmpeg
echo ✓ Checking FFmpeg...
where ffmpeg >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  FFmpeg non trovato!
    echo.
    echo FFmpeg è richiesto per la conversione audio.
    echo Installalo con: choco install ffmpeg
    echo Oppure scaricalo da: https://ffmpeg.org/download.html
    echo.
    set /p continue="Vuoi continuare senza FFmpeg? (y/n) "
    if /i not "%continue%"=="y" exit /b 1
) else (
    ffmpeg -version | findstr "ffmpeg version"
)

echo.
echo 📦 Installing dependencies...
call npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ Setup completato con successo!
    echo.
    echo Comandi disponibili:
    echo   npm start      - Avvia l'applicazione
    echo   npm run dev    - Avvia in modalità sviluppo
    echo   npm run build  - Crea build per distribuzione
    echo.
    echo Per maggiori informazioni, leggi README.md
) else (
    echo.
    echo ❌ Errore durante l'installazione delle dipendenze
)

echo.
pause
