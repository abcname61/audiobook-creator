const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const AudiobookConverter = require('./scripts/converter');
const DatabaseManager = require('./scripts/database');

let mainWindow;
let converter;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'public/icon.png')
  });

  mainWindow.loadFile('src/index.html');

  // Apri DevTools in modalità sviluppo
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(async () => {
  // Inizializza il database
  db = new DatabaseManager();
  await db.initialize();

  // Inizializza il convertitore
  converter = new AudiobookConverter();

  // Ascolta eventi di progresso
  converter.on('progress', sendProgress);

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  app.quit();
});

// IPC Handlers

// Seleziona cartella con file MP3
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0];
    const files = await scanFolder(folderPath);
    return { success: true, path: folderPath, files };
  }

  return { success: false };
});

// Scansiona cartella per file audio
async function scanFolder(folderPath) {
  const files = await fs.readdir(folderPath);
  const audioFiles = files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.mp3', '.m4a', '.wav', '.flac', '.ogg'].includes(ext);
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map(file => ({
      name: file,
      path: path.join(folderPath, file)
    }));

  return audioFiles;
}

// Converti in M4B
ipcMain.handle('convert-to-m4b', async (event, options) => {
  try {
    const result = await converter.convertToM4B(options);
    
    // Salva nel database
    if (result.success) {
      await db.addAudiobook({
        title: options.title,
        author: options.author,
        outputPath: result.outputPath,
        createdAt: new Date().toISOString()
      });
    }

    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Ottieni lista audiolibri dal database
ipcMain.handle('get-audiobooks', async () => {
  return await db.getAllAudiobooks();
});

// Elimina audiolibro
ipcMain.handle('delete-audiobook', async (event, id) => {
  return await db.deleteAudiobook(id);
});

// Seleziona percorso di output
ipcMain.handle('select-output-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return { success: true, path: result.filePaths[0] };
  }

  return { success: false };
});

// Invia progresso conversione
function sendProgress(progress) {
  if (mainWindow) {
    mainWindow.webContents.send('conversion-progress', progress);
  }
}

// Cerca metadata da Open Library API
ipcMain.handle('search-metadata', async (event, title) => {
  try {
    const https = require('https');

    // Pulisci il titolo per la ricerca
    let cleanTitle = title
      .replace(/[_]/g, ' ')  // Sostituisci underscore con spazi
      .replace(/\s+/g, ' ')  // Normalizza spazi multipli
      .trim();

    // Cerca il libro su Open Library con query più ampia
    const searchQuery = encodeURIComponent(cleanTitle);
    const searchUrl = `https://openlibrary.org/search.json?q=${searchQuery}&limit=5`;

    return new Promise((resolve, reject) => {
      https.get(searchUrl, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', async () => {
          try {
            const result = JSON.parse(data);

            if (result.docs && result.docs.length > 0) {
              // Funzione per calcolare similarità tra titoli
              const similarity = (a, b) => {
                const normalize = (str) => str.toLowerCase()
                  .replace(/[^\w\s]/g, '')
                  .replace(/\s+/g, ' ')
                  .trim();

                const normA = normalize(a);
                const normB = normalize(b);

                if (normA === normB) return 1;
                if (normA.includes(normB) || normB.includes(normA)) return 0.9;

                const wordsA = normA.split(' ').filter(w => w.length > 2);
                const wordsB = normB.split(' ').filter(w => w.length > 2);
                const commonWords = wordsA.filter(word => wordsB.includes(word));

                // Se hanno almeno 2 parole in comune significative, è un buon match
                if (commonWords.length >= 2) {
                  return 0.7 + (commonWords.length / Math.max(wordsA.length, wordsB.length)) * 0.3;
                }

                return commonWords.length / Math.max(wordsA.length, wordsB.length);
              };

              // Trova il miglior match tra i risultati
              let bestMatch = result.docs[0];
              let bestScore = similarity(cleanTitle, bestMatch.title || '');

              // Log per debug
              console.log(`Searching for: "${cleanTitle}"`);
              console.log(`Result 0: "${bestMatch.title}" (score: ${bestScore.toFixed(2)})`);

              for (let i = 1; i < Math.min(5, result.docs.length); i++) {
                const score = similarity(cleanTitle, result.docs[i].title || '');
                console.log(`Result ${i}: "${result.docs[i].title}" (score: ${score.toFixed(2)})`);
                if (score > bestScore) {
                  bestScore = score;
                  bestMatch = result.docs[i];
                }
              }

              console.log(`Best match: "${bestMatch.title}" (score: ${bestScore.toFixed(2)})`);

              // Se il miglior score è troppo basso, prova a cercare tra i risultati con la copertina
              if (bestScore < 0.5) {
                const withCover = result.docs.filter(doc => doc.cover_i);
                if (withCover.length > 0) {
                  bestMatch = withCover[0];
                  console.log(`Using first result with cover: "${bestMatch.title}"`);
                }
              }

              // Usa il miglior match trovato
              const book = bestMatch;
              const author = book.author_name ? book.author_name[0] : '';
              const coverId = book.cover_i;

              let coverPath = null;

              // Scarica la copertina se disponibile
              if (coverId) {
                const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
                const tempDir = app.getPath('temp');
                coverPath = path.join(tempDir, `cover_${Date.now()}.jpg`);

                const file = require('fs').createWriteStream(coverPath);
                https.get(coverUrl, (coverRes) => {
                  coverRes.pipe(file);
                  file.on('finish', () => {
                    file.close();
                    resolve({
                      success: true,
                      author: author,
                      coverPath: coverPath
                    });
                  });
                }).on('error', () => {
                  resolve({
                    success: true,
                    author: author,
                    coverPath: null
                  });
                });
              } else {
                resolve({
                  success: true,
                  author: author,
                  coverPath: null
                });
              }
            } else {
              resolve({ success: false, message: 'Nessun risultato trovato' });
            }
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Leggi file immagine come base64
ipcMain.handle('read-image-file', async (event, filePath) => {
  try {
    const imageData = await fs.readFile(filePath);
    const base64 = imageData.toString('base64');
    const ext = path.extname(filePath).toLowerCase();

    // Determina il MIME type
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };

    const mimeType = mimeTypes[ext] || 'image/jpeg';

    return {
      success: true,
      dataUrl: `data:${mimeType};base64,${base64}`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

// Event listener per progress viene configurato in app.whenReady()
