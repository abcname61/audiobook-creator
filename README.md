# 🎧 Audiobook Creator

**Audiobook Creator** è un'applicazione desktop open-source multipiattaforma per convertire file MP3 in audiolibri professionali in formato M4B.

[![CI](https://github.com/marcogenna/audiobook-creator/actions/workflows/ci.yml/badge.svg)](https://github.com/marcogenna/audiobook-creator/actions/workflows/ci.yml)
[![Release](https://github.com/marcogenna/audiobook-creator/actions/workflows/release.yml/badge.svg)](https://github.com/marcogenna/audiobook-creator/actions/workflows/release.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](#)
[![Latest Release](https://img.shields.io/github/v/release/marcogenna/audiobook-creator)](https://github.com/marcogenna/audiobook-creator/releases/latest)

## ✨ Caratteristiche

- 🔄 **Conversione MP3 → M4B** - Converti facilmente i tuoi file audio in formato audiolibro
- 📁 **Ordinamento Automatico** - I file vengono ordinati automaticamente per nome
- 🎨 **Metadata Completi** - Aggiungi titolo, autore e copertina
- 📊 **Barra di Progresso** - Monitora l'avanzamento della conversione in tempo reale
- 📚 **Libreria Integrata** - Gestisci tutti i tuoi audiolibri creati
- 💾 **Storage JSON** - Salvataggio automatico della cronologia
- ⚡ **FFmpeg Incluso** - Nessuna installazione esterna richiesta, funziona subito
- 🌍 **Multipiattaforma** - Funziona su Windows, macOS e Linux
- 🆓 **100% Open Source** - Codice sorgente completamente aperto e modificabile

## 🚀 Installazione

### Download Precompilato (Raccomandato)

Scarica l'ultima versione dalla [pagina releases](https://github.com/marcogenna/audiobook-creator/releases).

**L'applicazione include già FFmpeg - nessuna installazione aggiuntiva richiesta!**

### Sviluppo da Sorgente

#### Prerequisiti

- **Node.js** (v18 o superiore)

### Installazione da Sorgente

1. **Clona il repository:**
```bash
git clone https://github.com/marcogenna/audiobook-creator.git
cd audiobook-creator
```

2. **Installa le dipendenze:**
```bash
npm install
```

3. **Avvia l'applicazione:**
```bash
npm start
```

## 🛠️ Build per la Distribuzione

### Build per tutte le piattaforme:
```bash
npm run build
```

### Build per piattaforma specifica:
```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

I file compilati saranno disponibili nella cartella `dist/`.

## 📖 Come Usare

### 1. Seleziona i File Audio
- Clicca su **"Seleziona Cartella"**
- Scegli la cartella contenente i tuoi file MP3
- I file verranno automaticamente ordinati per nome

### 2. Aggiungi Informazioni
- **Titolo**: Nome dell'audiolibro
- **Autore**: Nome dell'autore/narratore
- **Copertina** (opzionale): Aggiungi un'immagine di copertina
- **Qualità Audio**: Scegli il bitrate (32k - 192k)

### 3. Seleziona la Destinazione
- Clicca su **"Sfoglia"** per scegliere dove salvare il file M4B

### 4. Converti
- Clicca su **"Converti in M4B"**
- Attendi il completamento della conversione
- Il file sarà salvato nella cartella selezionata

### 5. Gestisci la Libreria
- Vai su **"Libreria"** per vedere tutti i tuoi audiolibri
- Clicca su un audiolibro per aprirne il percorso

## 🏗️ Architettura del Progetto

```
audiobook-creator/
├── main.js                 # Processo principale Electron
├── preload.js              # Script di preload per sicurezza
├── package.json            # Configurazione del progetto
├── src/
│   ├── index.html          # Interfaccia utente principale
│   ├── styles.css          # Stili dell'applicazione
│   └── app.js              # Logica frontend
├── scripts/
│   ├── converter.js        # Logica di conversione FFmpeg
│   └── database.js         # Gestione database SQLite
└── public/
    └── icon.png            # Icona dell'applicazione
```

## 🔧 Tecnologie Utilizzate

- **Electron** - Framework per applicazioni desktop
- **FFmpeg** - Conversione e manipolazione audio
- **SQLite** - Database locale
- **Node.js** - Runtime JavaScript
- **HTML/CSS/JavaScript** - Interfaccia utente

### Dipendenze Principali

- `fluent-ffmpeg` - Wrapper Node.js per FFmpeg
- `ffmpeg-static` - Binario FFmpeg incluso
- `music-metadata` - Estrazione metadata audio
- `node-id3` - Gestione tag ID3

## 📋 Roadmap

- [ ] Supporto per capitoli personalizzati
- [ ] Player audio integrato
- [ ] Supporto per più formati di input (WAV, FLAC, OGG)
- [ ] Conversione batch
- [ ] Temi personalizzabili (dark mode)
- [ ] Export/Import libreria
- [ ] Supporto per audiolibri multi-disco
- [ ] Integrazione con servizi cloud

## 🤝 Contribuire

I contributi sono benvenuti! Per contribuire:

1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📝 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## 🐛 Segnalazione Bug

Se trovi un bug, apri una [issue](https://github.com/marcogenna/audiobook-creator/issues) descrivendo:
- Il sistema operativo
- I passi per riprodurre il bug
- Il comportamento atteso vs quello osservato
- Screenshot (se possibile)

## 💬 Supporto

Per domande o supporto:
- Apri una [discussion](https://github.com/marcogenna/audiobook-creator/discussions)
- Apri una issue su GitHub

## 🙏 Ringraziamenti

- [FFmpeg](https://ffmpeg.org/) - Per l'eccellente tool di conversione
- [Electron](https://www.electronjs.org/) - Per il framework desktop
- Tutti i contributori open-source

## ⭐ Se ti piace questo progetto

Metti una stella ⭐ su GitHub e condividi con i tuoi amici!

---

**Creato con ❤️ per la comunità open-source**
