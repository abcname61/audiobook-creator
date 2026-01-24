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

    // Cerca il libro su Open Library
    const searchQuery = encodeURIComponent(title);
    const searchUrl = `https://openlibrary.org/search.json?title=${searchQuery}&limit=1`;

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
              const book = result.docs[0];
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

// Event listener per progress viene configurato in app.whenReady()
