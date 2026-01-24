# ❓ FAQ - Domande Frequenti

## Installazione e Setup

### Q: Quali sono i requisiti minimi?
**A:** 
- **Sistema Operativo:** Windows 10+, macOS 10.14+, Linux (Ubuntu 20.04+)
- **RAM:** 4 GB minimo, 8 GB consigliato
- **Spazio Disco:** 500 MB per l'app + spazio per i file M4B
- **Node.js:** v18 o superiore (solo per sviluppo)
- **FFmpeg:** Richiesto (installazione separata)

### Q: Come installo FFmpeg?
**A:**

**Windows (Chocolatey):**
```bash
choco install ffmpeg
```

**macOS (Homebrew):**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Verifica installazione:**
```bash
ffmpeg -version
```

### Q: L'app non si avvia, cosa faccio?
**A:**
1. Verifica che FFmpeg sia installato: `ffmpeg -version`
2. Controlla i log nella console (npm start)
3. Reinstalla dipendenze: `rm -rf node_modules && npm install`
4. Verifica che la porta non sia occupata
5. Apri una issue su GitHub con i dettagli dell'errore

## Utilizzo

### Q: Quali formati audio sono supportati in input?
**A:** Attualmente supportati:
- ✅ MP3
- ✅ M4A
- ✅ WAV
- ✅ FLAC
- ✅ OGG

Il formato output è sempre M4B (audiolibro).

### Q: Qual è la qualità audio consigliata?
**A:** Dipende dall'uso:
- **32 kbps:** Voce semplice, file molto piccoli
- **64 kbps:** ✅ **Consigliato** - Ottimo compromesso qualità/dimensione
- **128 kbps:** Alta qualità, file più grandi
- **192 kbps:** Massima qualità, file molto grandi

Per audiolibri parlati, 64 kbps è generalmente sufficiente.

### Q: I file vengono ordinati correttamente?
**A:** Sì! L'ordinamento è **alfanumerico intelligente**:
```
Esempio:
✅ Capitolo 1.mp3
✅ Capitolo 2.mp3
✅ Capitolo 10.mp3
✅ Capitolo 20.mp3
```

Assicurati di nominare i file con numeri consistenti.

### Q: Posso aggiungere una copertina?
**A:** Sì! Formati supportati:
- JPG/JPEG
- PNG
- GIF
- WebP

Dimensione consigliata: 1400x1400 px o superiore.

### Q: Quanto tempo ci vuole per convertire?
**A:** Dipende da:
- Numero di file
- Durata totale
- Bitrate selezionato
- Potenza del PC

**Esempio:** 10 ore di audio a 64 kbps ≈ 5-10 minuti su PC moderno.

### Q: Dove vengono salvati gli audiolibri?
**A:** Nella cartella che selezioni durante la conversione. L'app non sposta o elimina mai i file originali.

### Q: Posso convertire più audiolibri contemporaneamente?
**A:** No, attualmente l'app supporta una conversione alla volta. Questa feature potrebbe essere aggiunta in futuro.

## Problemi Comuni

### Q: Errore "FFmpeg not found"
**A:**
1. Verifica installazione: `ffmpeg -version`
2. Se non installato, segui le istruzioni sopra
3. Riavvia l'app dopo l'installazione
4. Su Windows, verifica che FFmpeg sia nel PATH

### Q: La conversione fallisce
**A:** Possibili cause:
- File MP3 corrotti → Verifica i file con un player
- Spazio disco insufficiente → Libera spazio
- Permessi cartella → Verifica permessi scrittura
- Nomi file con caratteri speciali → Rinomina i file

### Q: Il database non salva gli audiolibri
**A:**
1. Verifica permessi nella cartella utente
2. Controlla lo spazio disco
3. Cerca errori nella console (modalità dev)
4. Elimina il file `audiobooks.db` e riavvia

### Q: L'app è lenta
**A:**
- FFmpeg è CPU-intensive, è normale
- Chiudi altre applicazioni pesanti
- Considera di abbassare il bitrate
- Su laptop, collega l'alimentatore

### Q: Posso usare l'app offline?
**A:** Sì! L'app non richiede connessione internet. Tutti i processi sono locali.

## Funzionalità

### Q: Supporta i capitoli?
**A:** Il supporto base c'è (ogni file = capitolo), ma i capitoli personalizzati sono pianificati per versioni future.

### Q: C'è un player integrato?
**A:** Non ancora, ma è nella roadmap. Attualmente usa qualsiasi player M4B (VLC, iTunes, etc.).

### Q: Posso modificare i metadata dopo la conversione?
**A:** Non nell'app, ma puoi usare tool esterni come:
- MP3Tag
- Kid3
- iTunes
- MusicBrainz Picard

### Q: Funziona con audiolibri multi-disco?
**A:** Puoi convertire ogni disco separatamente. Il supporto multi-disco automatico è pianificato.

### Q: I miei dati sono privati?
**A:** ✅ Sì! L'app:
- Non invia dati online
- Non ha analytics
- Non ha pubblicità
- Tutto rimane sul tuo PC

## Sviluppo

### Q: Come contribuisco al progetto?
**A:** Leggi `CONTRIBUTING.md` per le linee guida complete. In breve:
1. Fork il repository
2. Crea un branch per la tua feature
3. Sviluppa e testa
4. Invia una Pull Request

### Q: Come segnalo un bug?
**A:**
1. Vai su GitHub Issues
2. Verifica che non sia già segnalato
3. Crea una nuova issue con:
   - Descrizione del problema
   - Passi per riprodurlo
   - Screenshot se possibile
   - Sistema operativo e versione

### Q: Posso modificare il codice per uso personale?
**A:** ✅ Assolutamente! È open-source con licenza MIT. Puoi:
- Modificare
- Distribuire
- Usare commercialmente
- Tutto senza restrizioni (vedi LICENSE)

### Q: Dove trovo la documentazione tecnica?
**A:** Leggi `ARCHITECTURE.md` per dettagli completi su:
- Struttura del codice
- Flusso dati
- API interne
- Estensibilità

### Q: Come aggiungo una nuova funzionalità?
**A:**
1. Leggi `ARCHITECTURE.md`
2. Modifica i file necessari
3. Testa localmente
4. Documenta le modifiche
5. Invia una PR

## Build e Distribuzione

### Q: Come creo un installer?
**A:**
```bash
npm run build              # Tutte le piattaforme
npm run build:win         # Solo Windows
npm run build:mac         # Solo macOS
npm run build:linux       # Solo Linux
```

Gli installer saranno in `dist/`.

### Q: Posso distribuire l'app?
**A:** ✅ Sì! Licenza MIT ti permette di:
- Distribuire gratuitamente
- Vendere copie
- Modificare e redistribuire
- Tutto mantenendo l'attribuzione

### Q: Come faccio il code signing?
**A:** Leggi `DEPLOYMENT.md` per istruzioni dettagliate su:
- Code signing Windows
- Notarizzazione macOS
- Firma pacchetti Linux

## Performance e Ottimizzazione

### Q: Come riduco la dimensione dell'installer?
**A:** L'app usa Electron, quindi ha una dimensione base di ~150MB. Puoi:
1. Abilitare compressione massima in `package.json`
2. Rimuovere dipendenze non usate
3. Usare ASAR archive
4. Ma l'impatto è limitato (~10-20MB risparmio max)

### Q: L'app consuma molta RAM
**A:** Electron (Chromium) usa 150-300MB. È normale. Durante conversione, FFmpeg può usare altri 100-200MB.

### Q: Come velocizzare la conversione?
**A:**
- Usa bitrate inferiore (32k o 64k)
- Chiudi altre app
- Su desktop, usa il massimo dei core CPU
- Hardware più recente aiuta

## Licensing e Legale

### Q: Posso usare l'app commercialmente?
**A:** ✅ Sì, licenza MIT lo permette senza restrizioni.

### Q: Devo dare credito agli autori?
**A:** È apprezzato ma non obbligatorio per l'uso. Per ridistribuzione del codice, mantieni il file LICENSE.

### Q: Posso vendere l'app?
**A:** Sì, ma:
- Devi mantenere il file LICENSE
- Considera di contribuire al progetto originale
- Sei responsabile del supporto ai tuoi clienti

## Altro

### Q: Perché Electron e non Qt o altro?
**A:** Electron offre:
- Sviluppo più rapido
- Ecosistema ricco
- UI moderna e flessibile
- Build cross-platform facili

Qt/GTK sono valide alternative per app più leggere.

### Q: Pianificate una versione mobile?
**A:** Non al momento. Il focus è desktop. Una versione web potrebbe essere considerata in futuro.

### Q: L'app invia telemetria?
**A:** ❌ No. Zero telemetria, zero tracking, zero analytics. Tutto è locale.

### Q: Supportate Windows 7?
**A:** No, Electron 28 richiede Windows 10+. Per Windows 7, dovresti usare una versione Electron più vecchia.

### Q: Dove trovo la versione installata?
**A:** Sidebar in basso a sinistra mostra il numero di versione.

---

## 🤔 Non trovi risposta?

1. Cerca nelle [GitHub Issues](https://github.com/tuousername/audiobook-creator/issues)
2. Apri una [Discussion](https://github.com/tuousername/audiobook-creator/discussions)
3. Leggi la [Documentazione](README.md)
4. Contatta la community

---

**Questa FAQ viene aggiornata regolarmente. Ultimo aggiornamento: 2026-01-22**
