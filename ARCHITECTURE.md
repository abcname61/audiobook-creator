# Architettura del Software

## Panoramica

Audiobook Creator è un'applicazione desktop Electron che utilizza FFmpeg per convertire file MP3 in audiolibri M4B. L'architettura segue il pattern Model-View-Controller (MVC) con separazione tra processo principale (main) e processo renderer.

## Stack Tecnologico

### Frontend
- **HTML5** - Struttura dell'interfaccia
- **CSS3** - Stili e animazioni
- **JavaScript (ES6+)** - Logica dell'interfaccia

### Backend
- **Electron** - Framework desktop multipiattaforma
- **Node.js** - Runtime JavaScript
- **FFmpeg** - Elaborazione audio
- **SQLite** - Database locale

### Librerie Principali
- `fluent-ffmpeg` - Wrapper Node.js per FFmpeg
- `music-metadata` - Estrazione metadata da file audio
- `sqlite3` - Driver database
- `node-id3` - Gestione tag ID3

## Architettura dei Processi

```
┌─────────────────────────────────────────────────────────┐
│                   APPLICAZIONE ELECTRON                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────┐         ┌──────────────────┐      │
│  │  Main Process   │◄───────►│ Renderer Process │      │
│  │   (main.js)     │   IPC   │   (app.js)       │      │
│  └────────┬────────┘         └──────────────────┘      │
│           │                                              │
│           ├─► Converter (scripts/converter.js)          │
│           │    - FFmpeg Operations                       │
│           │    - Audio Processing                        │
│           │                                              │
│           └─► Database (scripts/database.js)            │
│                - SQLite Operations                       │
│                - Data Persistence                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Componenti Principali

### 1. Main Process (main.js)

**Responsabilità:**
- Gestione finestra applicazione
- Inizializzazione database
- Gestione IPC (Inter-Process Communication)
- Operazioni file system
- Coordinamento tra componenti

**IPC Handlers:**
- `select-folder` - Apertura dialog selezione cartella
- `select-output-path` - Selezione destinazione output
- `convert-to-m4b` - Avvio conversione
- `get-audiobooks` - Recupero lista audiolibri
- `delete-audiobook` - Eliminazione audiolibro

### 2. Preload Script (preload.js)

**Responsabilità:**
- Bridge sicuro tra main e renderer
- Esposizione API controllate
- Protezione da vulnerabilità XSS

**API Esposte:**
```javascript
window.electronAPI = {
  selectFolder()
  selectOutputPath()
  convertToM4B(options)
  getAudiobooks()
  deleteAudiobook(id)
  onConversionProgress(callback)
}
```

### 3. Renderer Process (src/app.js)

**Responsabilità:**
- Gestione interfaccia utente
- Validazione input
- Visualizzazione progresso
- Gestione eventi UI

**Stato Applicazione:**
```javascript
{
  selectedFiles: Array,    // File MP3 selezionati
  selectedCoverPath: String, // Path copertina
  outputPath: String,      // Destinazione output
  isConverting: Boolean    // Stato conversione
}
```

### 4. Converter (scripts/converter.js)

**Responsabilità:**
- Conversione audio con FFmpeg
- Gestione metadata
- Concatenazione file multipli
- Emissione eventi progresso

**Flusso Conversione:**

```
┌──────────────┐
│ Input Files  │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Validazione Files    │
│ - Formato corretto   │
│ - File esistenti     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Estrazione Metadata  │
│ - Durata totale      │
│ - Bitrate            │
└──────┬───────────────┘
       │
       ▼
  ┌────┴────┐
  │ Single? │
  └────┬────┘
       │
   ┌───┴───┐
   │       │
   NO      YES
   │       │
   ▼       ▼
┌──────┐ ┌──────────────┐
│Concat│ │Convert Direct│
└──┬───┘ └──────┬───────┘
   │            │
   └─────┬──────┘
         ▼
┌──────────────────────┐
│ FFmpeg Conversion    │
│ - Codec: AAC         │
│ - Container: M4B     │
│ - Metadata injection │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Output M4B File      │
└──────────────────────┘
```

**Parametri FFmpeg:**
- **Codec Audio:** AAC (compatibile con tutti i player)
- **Container:** M4B (MPEG-4 Part 14)
- **Bitrate:** 32k - 192k (configurabile)
- **Metadata:** Titolo, Artista, Album, Genere

### 5. Database Manager (scripts/database.js)

**Schema Database:**

```sql
-- Tabella audiobooks
CREATE TABLE audiobooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT,
  outputPath TEXT NOT NULL,
  coverPath TEXT,
  duration INTEGER,
  fileSize INTEGER,
  createdAt TEXT NOT NULL,
  lastPlayed TEXT,
  progress INTEGER DEFAULT 0
);

-- Tabella chapters (per funzionalità future)
CREATE TABLE chapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  audiobookId INTEGER NOT NULL,
  title TEXT NOT NULL,
  startTime REAL NOT NULL,
  endTime REAL NOT NULL,
  FOREIGN KEY (audiobookId) REFERENCES audiobooks (id) ON DELETE CASCADE
);
```

**Operazioni:**
- `addAudiobook(audiobook)` - Inserisce nuovo audiolibro
- `getAllAudiobooks()` - Recupera tutti gli audiolibri
- `getAudiobookById(id)` - Recupera audiolibro specifico
- `updateAudiobook(id, updates)` - Aggiorna dati
- `deleteAudiobook(id)` - Elimina audiolibro
- `updateProgress(id, progress)` - Aggiorna progresso ascolto

## Flusso Dati

### Conversione File

```
User Action
    │
    ▼
src/app.js
    │ validateForm()
    │ convertBtn.click()
    │
    ▼
window.electronAPI.convertToM4B(options)
    │
    ▼ IPC
main.js
    │ ipcMain.handle('convert-to-m4b')
    │
    ▼
scripts/converter.js
    │ convertToM4B(options)
    │ ├─ scanFiles()
    │ ├─ extractMetadata()
    │ ├─ convertSingleFile() / convertMultipleFiles()
    │ └─ emit('progress')
    │
    ▼
FFmpeg Process
    │ Audio Processing
    │
    ▼
Output M4B File
    │
    ▼
scripts/database.js
    │ addAudiobook()
    │
    ▼
Success → User Feedback
```

## Sicurezza

### Context Isolation
- Preload script utilizza `contextBridge`
- Nessuna esposizione diretta di API Node.js al renderer

### IPC Security
- Validazione di tutti gli input
- Whitelist di operazioni permesse
- Sanitizzazione path file

### File System
- Controllo permessi prima delle operazioni
- Validazione estensioni file
- Prevenzione path traversal

## Performance

### Ottimizzazioni
1. **Conversione Asincrona** - Non blocca UI durante conversione
2. **Stream Processing** - FFmpeg elabora in streaming
3. **Database Indexed** - Query ottimizzate con indici
4. **Lazy Loading** - Libreria caricata solo quando necessario

### Limiti
- **Memoria:** Dipende dalla dimensione dei file MP3
- **CPU:** FFmpeg può essere intensivo durante conversione
- **Disco:** Spazio necessario per file output M4B

## Estensibilità

### Aggiungere Nuovo Formato Input

1. Modifica `converter.js`:
```javascript
const supportedFormats = ['.mp3', '.m4a', '.wav', '.flac', '.ogg'];
```

2. Aggiorna FFmpeg options se necessario

### Aggiungere Nuova Funzionalità UI

1. Aggiungi HTML in `src/index.html`
2. Aggiungi stili in `src/styles.css`
3. Aggiungi logica in `src/app.js`
4. Se serve backend, aggiungi IPC handler in `main.js`

### Aggiungere Nuovo Campo Database

1. Crea migration in `database.js`:
```javascript
db.run('ALTER TABLE audiobooks ADD COLUMN newField TEXT');
```

2. Aggiorna query esistenti

## Testing

### Test Manuale
1. Selezione cartella con diversi tipi di file
2. Conversione singolo file
3. Conversione multipli file
4. Con/senza copertina
5. Diverse qualità audio
6. Gestione errori (file corrotti, spazio insufficiente)

### Test Automatici (Futuri)
- Unit test per converter.js
- Integration test per IPC
- E2E test con Spectron

## Build e Deploy

### Processo Build

```bash
npm run build
```

**Electron Builder Pipeline:**
1. Compila JavaScript (se necessario)
2. Copia assets (HTML, CSS, icone)
3. Bundle dipendenze Node
4. Crea installer per piattaforma target
5. Firma applicazione (se configurato)
6. Output in `dist/`

### Artefatti Generati

**Windows:**
- `audiobook-creator-setup-1.0.0.exe` (NSIS installer)

**macOS:**
- `audiobook-creator-1.0.0.dmg` (disk image)

**Linux:**
- `audiobook-creator-1.0.0.AppImage`
- `audiobook-creator_1.0.0_amd64.deb`

## Manutenzione

### Aggiornamento Dipendenze
```bash
npm outdated           # Verifica updates
npm update            # Aggiorna minori
npm install pkg@latest # Aggiorna specifica
```

### Log e Debug
- **Frontend:** Chrome DevTools (Ctrl+Shift+I)
- **Backend:** Console del terminale
- **FFmpeg:** Log in `converter.js`

### Monitoraggio Errori
- Try/catch su tutte le operazioni asincrone
- Gestione errori FFmpeg
- Validazione input utente

## Riferimenti

- [Electron Documentation](https://www.electronjs.org/docs)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [M4B Format Specification](https://en.wikipedia.org/wiki/MPEG-4_Part_14)
