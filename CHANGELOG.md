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

## [1.0.7] - 2026-01-24

### 🔧 Miglioramenti Ricerca
- **Ricerca più ampia**: Query generale invece di solo titolo (`q=` invece di `title=`)
- **Algoritmo similarità migliorato**: Più permissivo con match parziali
- **Priorità parole significative**: Ignora parole di 2 caratteri o meno
- **Threshold intelligente**: Se nessun match sopra 50%, usa il primo risultato con copertina
- **Più risultati analizzati**: Esamina fino a 5 risultati invece di 3
- **Debug logging**: Log dettagliati per troubleshooting ricerca

### 🐛 Bug Fix
- Risolto problema con libri tradotti (es: "Il complotto contro l'America" ora trova risultati)
- Migliorata gestione apostrofi e caratteri speciali nella ricerca

### 🔧 Technical
- Query API cambiata da `title=` a `q=` per ricerca più ampia
- Algoritmo similarità con bonus per 2+ parole in comune
- Fallback a primo risultato con copertina se score basso

## [1.0.6] - 2026-01-24

### 🔧 Miglioramenti
- **Ricerca metadata migliorata**: Algoritmo di pulizia e normalizzazione titoli
- Estrazione automatica del titolo principale da nomi file complessi
- Rimozione automatica di "Capitolo", "Traccia", numeri e underscore
- Gestione corretta di apostrofi e caratteri speciali (es: "l_America" → "l'America")
- Algoritmo di similarità per scegliere il miglior match tra i risultati
- Ricerca tra i primi 3 risultati invece di prendere solo il primo

### 🐛 Bug Fix
- Risolto problema di ricerca con titoli contenenti underscore e informazioni extra
- Esempio: "01 Il complotto contro l_America_Capitolo 1" ora trova correttamente "Il complotto contro l'America"

### 🔧 Technical
- Funzione `cleanBookTitle()` per normalizzazione titoli
- Algoritmo di similarità basato su word matching
- Normalizzazione query di ricerca lato server

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
