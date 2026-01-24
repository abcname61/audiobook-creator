#!/bin/bash

echo "🎧 Audiobook Creator - Setup Script"
echo "===================================="
echo ""

# Verifica Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non trovato!"
    echo "Installa Node.js da: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
echo "  Node.js version: $NODE_VERSION"

# Verifica NPM
echo "✓ Checking NPM..."
if ! command -v npm &> /dev/null; then
    echo "❌ NPM non trovato!"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo "  NPM version: $NPM_VERSION"

# Verifica FFmpeg
echo "✓ Checking FFmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  FFmpeg non trovato!"
    echo ""
    echo "FFmpeg è richiesto per la conversione audio."
    echo "Installalo con:"
    echo ""
    echo "  Windows:  choco install ffmpeg"
    echo "  macOS:    brew install ffmpeg"
    echo "  Linux:    sudo apt install ffmpeg"
    echo ""
    read -p "Vuoi continuare senza FFmpeg? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    FFMPEG_VERSION=$(ffmpeg -version | head -n 1)
    echo "  $FFMPEG_VERSION"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup completato con successo!"
    echo ""
    echo "Comandi disponibili:"
    echo "  npm start      - Avvia l'applicazione"
    echo "  npm run dev    - Avvia in modalità sviluppo"
    echo "  npm run build  - Crea build per distribuzione"
    echo ""
    echo "Per maggiori informazioni, leggi README.md"
else
    echo ""
    echo "❌ Errore durante l'installazione delle dipendenze"
    exit 1
fi
