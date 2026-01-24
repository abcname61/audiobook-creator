#!/bin/bash

echo "🔍 Audiobook Creator - Verifica Progetto"
echo "=========================================="
echo ""

# Colori
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contatori
PASS=0
FAIL=0

# Funzione di verifica
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $1 - MANCANTE"
        ((FAIL++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $1/ - MANCANTE"
        ((FAIL++))
    fi
}

echo "📁 Struttura Cartelle:"
check_dir "src"
check_dir "scripts"
check_dir "public"
echo ""

echo "📄 File Principali:"
check_file "main.js"
check_file "preload.js"
check_file "package.json"
echo ""

echo "🎨 Frontend:"
check_file "src/index.html"
check_file "src/styles.css"
check_file "src/app.js"
echo ""

echo "⚙️ Backend:"
check_file "scripts/converter.js"
check_file "scripts/database.js"
echo ""

echo "📚 Documentazione:"
check_file "README.md"
check_file "LICENSE"
check_file "CHANGELOG.md"
check_file "CONTRIBUTING.md"
check_file "QUICKSTART.md"
check_file "ARCHITECTURE.md"
echo ""

echo "🔧 Configurazione:"
check_file ".gitignore"
check_file ".eslintrc.json"
check_file ".npmrc"
echo ""

echo "🚀 Script Setup:"
check_file "setup.sh"
check_file "setup.bat"
echo ""

echo "=========================================="
echo -e "Risultati: ${GREEN}${PASS} OK${NC} - ${RED}${FAIL} Mancanti${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ Progetto completo e pronto!${NC}"
    echo ""
    echo "Prossimi passi:"
    echo "  1. npm install        # Installa dipendenze"
    echo "  2. npm start          # Avvia l'applicazione"
    echo "  3. npm run build      # Crea distribuzione"
    exit 0
else
    echo -e "${RED}⚠️ Alcuni file sono mancanti${NC}"
    echo "Controlla i file segnalati sopra"
    exit 1
fi
