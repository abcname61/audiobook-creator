const { contextBridge, ipcRenderer } = require('electron');

// Esponi API sicure al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Selezione cartelle e file
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectOutputPath: () => ipcRenderer.invoke('select-output-path'),
  
  // Conversione
  convertToM4B: (options) => ipcRenderer.invoke('convert-to-m4b', options),
  
  // Database
  getAudiobooks: () => ipcRenderer.invoke('get-audiobooks'),
  deleteAudiobook: (id) => ipcRenderer.invoke('delete-audiobook', id),

  // Metadata search
  searchMetadata: (title) => ipcRenderer.invoke('search-metadata', title),

  // Listeners per eventi
  onConversionProgress: (callback) => {
    ipcRenderer.on('conversion-progress', (event, progress) => callback(progress));
  },
  
  removeConversionProgressListener: () => {
    ipcRenderer.removeAllListeners('conversion-progress');
  }
});
