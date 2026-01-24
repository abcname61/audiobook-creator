# 🚀 Quick Start - Guida Rapida

## Installazione Veloce

```bash
# 1. Clona il repository
git clone https://github.com/tuousername/audiobook-creator.git
cd audiobook-creator

# 2. Installa FFmpeg (se non già installato)
# Windows (con Chocolatey):
choco install ffmpeg

# macOS (con Homebrew):
brew install ffmpeg

# Linux (Ubuntu/Debian):
sudo apt install ffmpeg

# 3. Installa dipendenze
npm install

# 4. Avvia l'app in modalità sviluppo
npm run dev
```

## Comandi Principali

```bash
# Avvia in modalità normale
npm start

# Avvia in modalità sviluppo (con DevTools)
npm run dev

# Build per tutte le piattaforme
npm run build

# Build per Windows
npm run build:win

# Build per macOS
npm run build:mac

# Build per Linux
npm run build:linux
```

## Struttura File Principali

```
audiobook-creator/
├── main.js              # ⚙️ Processo principale Electron
├── preload.js           # 🔒 Bridge sicuro per IPC
├── src/
│   ├── index.html       # 🎨 Interfaccia HTML
│   ├── styles.css       # 💅 Stili CSS
│   └── app.js           # 🧠 Logica frontend
└── scripts/
    ├── converter.js     # 🔄 Conversione FFmpeg
    └── database.js      # 💾 Database SQLite
```

## Flusso di Sviluppo

1. **Modifica il codice** nei file in `src/` o `scripts/`
2. **Ricarica l'app** (Ctrl+R / Cmd+R nella finestra Electron)
3. **Testa le modifiche**
4. **Commit** le modifiche con messaggi chiari

## Debug

### DevTools
L'app in modalità `npm run dev` apre automaticamente i DevTools.

### Log
I log appaiono:
- **Console DevTools** - Per frontend (src/app.js)
- **Terminal** - Per backend (main.js, converter.js)

### Problemi Comuni

**FFmpeg non trovato:**
```bash
# Verifica installazione
ffmpeg -version

# Se non installato, installalo seguendo le istruzioni sopra
```

**Errore SQLite:**
```bash
# Reinstalla dipendenze native
npm rebuild
```

**Electron non si avvia:**
```bash
# Pulisci e reinstalla
rm -rf node_modules
npm install
```

## Modifiche Veloci

### Cambiare i colori dell'UI
Modifica le variabili CSS in `src/styles.css`:
```css
:root {
  --primary: #6366f1;      /* Colore principale */
  --success: #10b981;      /* Verde successo */
  /* ... */
}
```

### Aggiungere una nuova funzionalità
1. Aggiungi UI in `src/index.html`
2. Aggiungi stili in `src/styles.css`
3. Aggiungi logica in `src/app.js`
4. Se serve backend, modifica `main.js` e aggiungi IPC handler

### Modificare la qualità di default
In `src/index.html`, cambia il `selected` nel select:
```html
<option value="128k" selected>128 kbps (Alta)</option>
```

## Testing

### Test Manuale Checklist
- [ ] Seleziona cartella con MP3
- [ ] File vengono mostrati in ordine
- [ ] Aggiungi titolo e autore
- [ ] Seleziona copertina (opzionale)
- [ ] Seleziona cartella output
- [ ] Avvia conversione
- [ ] Verifica barra progresso
- [ ] Controlla file M4B creato
- [ ] Verifica libreria

### Test su Piattaforme Diverse
Se possibile, testa su:
- ✅ Windows 10/11
- ✅ macOS (Intel/Apple Silicon)
- ✅ Linux (Ubuntu/Debian/Fedora)

## Risorse Utili

- [Electron Docs](https://www.electronjs.org/docs)
- [FFmpeg Docs](https://ffmpeg.org/documentation.html)
- [SQLite Docs](https://www.sqlite.org/docs.html)
- [MDN Web Docs](https://developer.mozilla.org/)

## Hai Domande?

Apri una [Discussion](https://github.com/tuousername/audiobook-creator/discussions) su GitHub!

---

**Buon coding! 🎉**
