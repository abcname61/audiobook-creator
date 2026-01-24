// State
let selectedFiles = [];
let selectedCoverPath = null;
let outputPath = null;

// DOM Elements
const selectFolderBtn = document.getElementById('selectFolderBtn');
const clearFilesBtn = document.getElementById('clearFilesBtn');
const fileList = document.getElementById('fileList');
const fileItems = document.getElementById('fileItems');
const fileCount = document.querySelector('.file-count');

const titleInput = document.getElementById('titleInput');
const authorInput = document.getElementById('authorInput');
const selectCoverBtn = document.getElementById('selectCoverBtn');
const coverFileName = document.getElementById('coverFileName');
const coverPreview = document.getElementById('coverPreview');
const coverImage = document.getElementById('coverImage');
const bitrateSelect = document.getElementById('bitrateSelect');

const selectOutputBtn = document.getElementById('selectOutputBtn');
const outputPathInput = document.getElementById('outputPathInput');
const searchMetadataBtn = document.getElementById('searchMetadataBtn');

const convertBtn = document.getElementById('convertBtn');
const progressSection = document.getElementById('progressSection');
const progressStatus = document.getElementById('progressStatus');
const progressPercent = document.getElementById('progressPercent');
const progressFill = document.getElementById('progressFill');
const progressTime = document.getElementById('progressTime');
const successMessage = document.getElementById('successMessage');
const successPath = document.getElementById('successPath');

// Navigation
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const viewId = item.dataset.view;
    switchView(viewId);
  });
});

function switchView(viewId) {
  // Update navigation
  navItems.forEach(item => {
    if (item.dataset.view === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update views
  views.forEach(view => {
    if (view.id === `${viewId}-view`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Refresh library if switching to it
  if (viewId === 'library') {
    loadLibrary();
  }
}

// File Selection
selectFolderBtn.addEventListener('click', async () => {
  const result = await window.electronAPI.selectFolder();

  if (result.success && result.files.length > 0) {
    selectedFiles = result.files;
    displayFiles();
    validateForm();

    // Auto-suggest title from folder name
    if (!titleInput.value) {
      const folderName = result.path.split(/[\\/]/).pop();
      titleInput.value = folderName;
    }

    // Abilita il pulsante di ricerca metadata se c'è un titolo
    searchMetadataBtn.disabled = !titleInput.value.trim();
  }
});

clearFilesBtn.addEventListener('click', () => {
  selectedFiles = [];
  displayFiles();
  validateForm();
});

function displayFiles() {
  if (selectedFiles.length === 0) {
    fileList.style.display = 'none';
    return;
  }

  fileList.style.display = 'block';
  fileCount.textContent = `${selectedFiles.length} file selezionati`;
  
  fileItems.innerHTML = selectedFiles.map((file, index) => `
    <div class="file-item">
      <div class="file-item-icon">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
        </svg>
      </div>
      <div class="file-item-info">
        <div class="file-item-name">${index + 1}. ${file.name}</div>
      </div>
    </div>
  `).join('');
}

// Cover Selection
selectCoverBtn.addEventListener('click', async () => {
  const result = await window.electronAPI.selectFolder();
  
  if (result.success && result.files.length > 0) {
    const imageFile = result.files.find(f => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name)
    );
    
    if (imageFile) {
      selectedCoverPath = imageFile.path;
      coverFileName.textContent = imageFile.name;
      
      // Show preview
      coverImage.src = `file://${imageFile.path}`;
      coverPreview.style.display = 'block';
    }
  }
});

// Output Path Selection
selectOutputBtn.addEventListener('click', async () => {
  const result = await window.electronAPI.selectOutputPath();

  if (result.success) {
    outputPath = result.path;
    outputPathInput.value = result.path;
    validateForm();
  }
});

// Metadata Search
searchMetadataBtn.addEventListener('click', async () => {
  const title = titleInput.value.trim();

  if (!title) {
    alert('Inserisci un titolo prima di cercare');
    return;
  }

  // Disable button and show loading
  searchMetadataBtn.disabled = true;
  searchMetadataBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style="animation: spin 1s linear infinite">
      <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
    </svg>
    Ricerca...
  `;

  try {
    const result = await window.electronAPI.searchMetadata(title);

    if (result.success) {
      // Popola autore
      if (result.author && !authorInput.value) {
        authorInput.value = result.author;
      }

      // Popola copertina
      if (result.coverPath) {
        selectedCoverPath = result.coverPath;
        const fileName = result.coverPath.split(/[\\/]/).pop();
        coverFileName.textContent = fileName;

        // Show preview
        coverImage.src = `file://${result.coverPath}`;
        coverPreview.style.display = 'block';
      }

      validateForm();
      alert('Metadata trovati e applicati!');
    } else {
      alert(result.message || 'Nessun risultato trovato. Prova con un titolo diverso.');
    }
  } catch (error) {
    alert(`Errore durante la ricerca: ${error.message}`);
  } finally {
    // Restore button
    searchMetadataBtn.disabled = false;
    searchMetadataBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
      </svg>
      Cerca Online
    `;
  }
});

// Form Validation
[titleInput, authorInput, outputPathInput].forEach(input => {
  input.addEventListener('input', validateForm);
});

// Enable search button when title is entered
titleInput.addEventListener('input', () => {
  searchMetadataBtn.disabled = !titleInput.value.trim();
});

function validateForm() {
  const isValid =
    selectedFiles.length > 0 &&
    titleInput.value.trim() !== '' &&
    authorInput.value.trim() !== '' &&
    outputPath !== null;

  convertBtn.disabled = !isValid;
}

// Conversion
convertBtn.addEventListener('click', async () => {
  const options = {
    files: selectedFiles,
    outputPath: outputPath,
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    coverImage: selectedCoverPath,
    bitrate: bitrateSelect.value
  };

  // Disable button and show progress
  convertBtn.disabled = true;
  progressSection.style.display = 'block';
  successMessage.style.display = 'none';
  progressStatus.textContent = 'Preparazione...';
  progressPercent.textContent = '0%';
  progressFill.style.width = '0%';

  try {
    const result = await window.electronAPI.convertToM4B(options);
    
    if (result.success) {
      showSuccess(result.fileName, result.outputPath);
      resetForm();
    } else {
      showError(result.error || 'Errore durante la conversione');
    }
  } catch (error) {
    showError(error.message);
  } finally {
    convertBtn.disabled = false;
  }
});

// Listen for progress updates
window.electronAPI.onConversionProgress((progress) => {
  if (progress.stage === 'starting') {
    progressStatus.textContent = 'Avvio conversione...';
  } else if (progress.stage === 'converting') {
    progressStatus.textContent = 'Conversione in corso...';
    progressPercent.textContent = `${progress.percent}%`;
    progressFill.style.width = `${progress.percent}%`;
    
    if (progress.timemark) {
      progressTime.textContent = `Tempo elaborato: ${progress.timemark}`;
    }
  } else if (progress.stage === 'complete') {
    progressStatus.textContent = 'Completato!';
    progressPercent.textContent = '100%';
    progressFill.style.width = '100%';
  }
});

function showSuccess(fileName, filePath) {
  successMessage.style.display = 'flex';
  successPath.textContent = `File creato: ${fileName}`;
  
  // Hide progress after a moment
  setTimeout(() => {
    progressSection.style.display = 'none';
  }, 2000);
}

function showError(message) {
  alert(`Errore: ${message}`);
  progressSection.style.display = 'none';
}

function resetForm() {
  // Reset file selection
  selectedFiles = [];
  selectedCoverPath = null;
  displayFiles();
  
  // Reset form inputs (except title and author in case user wants to create another version)
  coverFileName.textContent = 'Nessun file selezionato';
  coverPreview.style.display = 'none';
  
  // Reset progress
  progressPercent.textContent = '0%';
  progressFill.style.width = '0%';
  progressTime.textContent = '';
  
  validateForm();
}

// Library
async function loadLibrary() {
  const libraryGrid = document.getElementById('libraryGrid');
  
  try {
    const audiobooks = await window.electronAPI.getAudiobooks();
    
    if (audiobooks.length === 0) {
      libraryGrid.innerHTML = `
        <div class="empty-state">
          <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor" opacity="0.3">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
          </svg>
          <h3>Nessun audiolibro</h3>
          <p>Crea il tuo primo audiolibro per iniziare</p>
        </div>
      `;
      return;
    }

    libraryGrid.innerHTML = audiobooks.map(book => {
      const date = new Date(book.createdAt);
      const dateString = date.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const initials = book.title
        .split(' ')
        .map(word => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      return `
        <div class="audiobook-card" data-id="${book.id}">
          <div class="audiobook-cover">
            ${book.coverPath 
              ? `<img src="file://${book.coverPath}" alt="${book.title}">` 
              : initials
            }
          </div>
          <div class="audiobook-info">
            <div class="audiobook-title">${book.title}</div>
            <div class="audiobook-author">${book.author}</div>
            <div class="audiobook-date">${dateString}</div>
          </div>
        </div>
      `;
    }).join('');

    // Add click listeners
    document.querySelectorAll('.audiobook-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        openAudiobook(id, audiobooks.find(b => b.id == id));
      });
    });

  } catch (error) {
    console.error('Error loading library:', error);
    libraryGrid.innerHTML = `
      <div class="empty-state">
        <h3>Errore nel caricamento</h3>
        <p>Impossibile caricare la libreria</p>
      </div>
    `;
  }
}

function openAudiobook(id, audiobook) {
  // Open file location in system file browser
  // This would require an additional IPC handler in main.js
  console.log('Opening audiobook:', audiobook);
  alert(`Audiolibro: ${audiobook.title}\nPercorso: ${audiobook.outputPath}`);
}

// Initialize
validateForm();
