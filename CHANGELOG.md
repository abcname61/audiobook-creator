# Changelog

Tutte le modifiche notevoli a questo progetto saranno documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

## [1.0.0] - 2026-01-22

### ✨ Aggiunto
- Conversione file MP3 in formato M4B
- Ordinamento automatico dei file per nome
- Supporto per metadata (titolo, autore)
- Aggiunta copertina agli audiolibri
- Selezione qualità audio (32k, 64k, 128k, 192k)
- Barra di progresso durante la conversione
- Libreria integrata per gestire audiolibri creati
- Database SQLite per salvare cronologia
- Supporto multipiattaforma (Windows, macOS, Linux)
- Interfaccia utente moderna e intuitiva
- Scripts di setup automatico
- Documentazione completa

### 🔧 Tecnologie
- Electron 28.1.0
- FFmpeg per conversione audio
- SQLite3 per database
- Node.js backend
- HTML/CSS/JavaScript frontend

### 📝 Documentazione
- README.md completo
- QUICKSTART.md per iniziare rapidamente
- CONTRIBUTING.md per i contributori
- Licenza MIT

---

## [1.0.5] - 2026-01-24

### ✨ Aggiunto
- **Ricerca automatica metadata**: Pulsante "Cerca Online" per trovare autore e copertina automaticamente
- Integrazione con Open Library API per ricerca libri
- Download automatico copertine da database pubblico

### 🎨 UI/UX
- Ridimensionamento interfaccia del 15% per migliore visualizzazione
- Versione aggiornata a 1.0.5 nella sidebar
- Pulsante di ricerca con animazione loading

### 🐛 Bug Fix
- Chiusura app su macOS ora funziona correttamente con il tasto rosso della finestra

### 🔧 Technical
- Nuovo handler IPC `search-metadata` per ricerca online
- Utilizzo di HTTPS nativo di Node.js per chiamate API
- Download e cache temporanea delle copertine

## [1.0.4] - 2026-01-24

### ✨ Aggiunto
- **Supporto capitoli**: Gli audiolibri M4B ora includono capitoli automatici
- Ogni file MP3 diventa un capitolo nel M4B finale
- Titoli capitoli generati automaticamente dal nome dei file

### 🔧 Technical
- Implementata generazione metadata FFmetadata1 per i capitoli
- Calcolo automatico dei timestamp per ogni capitolo
- Creazione file temporaneo chapters.txt durante la conversione

## [1.0.3] - 2026-01-24

### 🐛 Bug Fix
- **CRITICAL**: Fixed FFmpeg metadata syntax error
- Corrected metadata option format (removed nested quotes)
- Fixed "Unrecognized option" error during conversion

### 🔧 Technical
- Updated outputOptions syntax for proper FFmpeg argument parsing
- Changed from `-metadata title="value"` to `-metadata` `title=value` format

## [1.0.2] - 2026-01-24

### 🐛 Bug Fix
- **CRITICAL**: Fixed FFmpeg not working in packaged app (spawn ENOTDIR error)
- Configured electron-builder to unpack ffmpeg-static from asar archive
- Updated converter.js to handle packaged app paths correctly

### 🔧 Technical
- Added `asarUnpack` configuration for ffmpeg-static binaries
- Improved path resolution for development vs production environments

## [1.0.1] - 2026-01-24

### ✨ Aggiunto
- FFmpeg binario incluso nell'applicazione (ffmpeg-static)
- Applicazione completamente standalone, nessuna installazione esterna richiesta

### 🔄 Modifiche
- Rimossa dipendenza da FFmpeg di sistema
- Migrato da SQLite a storage JSON per la libreria
- Downgrade music-metadata a v7 per compatibilità CommonJS

### 📦 Build
- Dimensione bundle aumentata di ~19MB (da 91MB a 110MB)
- Eliminati problemi di compilazione con moduli nativi

## [Unreleased]

### 🚀 Pianificato
- Supporto per capitoli personalizzati
- Player audio integrato
- Conversione batch di multiple cartelle
- Tema scuro
- Export/Import libreria
- Supporto per FLAC, WAV, OGG
- Audiolibri multi-disco
- Cloud sync opzionale

---

[1.0.0]: https://github.com/tuousername/audiobook-creator/releases/tag/v1.0.0
