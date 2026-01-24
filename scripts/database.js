const path = require('path');
const { app } = require('electron');
const fs = require('fs').promises;

class DatabaseManager {
  constructor() {
    this.db = null;
    const userDataPath = app.getPath('userData');
    this.dbPath = path.join(userDataPath, 'audiobooks.json');
    this.data = {
      audiobooks: [],
      chapters: []
    };
  }

  async initialize() {
    try {
      // Create userData directory if it doesn't exist
      const userDataPath = app.getPath('userData');
      await fs.mkdir(userDataPath, { recursive: true });

      // Try to load existing data
      try {
        const fileContent = await fs.readFile(this.dbPath, 'utf-8');
        this.data = JSON.parse(fileContent);
        console.log('Database loaded:', this.dbPath);
      } catch (err) {
        // File doesn't exist yet, use default empty structure
        console.log('Creating new database:', this.dbPath);
        await this.save();
      }
    } catch (err) {
      console.error('Error initializing database:', err);
      throw err;
    }
  }

  async save() {
    try {
      await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
      throw err;
    }
  }

  async createTables() {
    // No-op for JSON-based storage, kept for API compatibility
    return Promise.resolve();
  }

  async addAudiobook(audiobook) {
    const { title, author, outputPath, coverPath, duration, fileSize, createdAt } = audiobook;

    const newAudiobook = {
      id: this.data.audiobooks.length > 0
        ? Math.max(...this.data.audiobooks.map(a => a.id)) + 1
        : 1,
      title,
      author: author || null,
      outputPath,
      coverPath: coverPath || null,
      duration: duration || null,
      fileSize: fileSize || null,
      createdAt,
      lastPlayed: null,
      progress: 0
    };

    this.data.audiobooks.push(newAudiobook);
    await this.save();

    return { id: newAudiobook.id };
  }

  async getAllAudiobooks() {
    // Sort by createdAt descending
    return [...this.data.audiobooks].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  async getAudiobookById(id) {
    const audiobook = this.data.audiobooks.find(a => a.id === id);
    return audiobook || null;
  }

  async updateAudiobook(id, updates) {
    const index = this.data.audiobooks.findIndex(a => a.id === id);

    if (index === -1) {
      throw new Error(`Audiobook with id ${id} not found`);
    }

    this.data.audiobooks[index] = {
      ...this.data.audiobooks[index],
      ...updates
    };

    await this.save();
    return { changes: 1 };
  }

  async deleteAudiobook(id) {
    const initialLength = this.data.audiobooks.length;
    this.data.audiobooks = this.data.audiobooks.filter(a => a.id !== id);

    // Also delete associated chapters
    this.data.chapters = this.data.chapters.filter(c => c.audiobookId !== id);

    await this.save();

    const changes = initialLength - this.data.audiobooks.length;
    return { changes };
  }

  async addChapter(audiobookId, chapter) {
    const { title, startTime, endTime } = chapter;

    const newChapter = {
      id: this.data.chapters.length > 0
        ? Math.max(...this.data.chapters.map(c => c.id)) + 1
        : 1,
      audiobookId,
      title,
      startTime,
      endTime
    };

    this.data.chapters.push(newChapter);
    await this.save();

    return { id: newChapter.id };
  }

  async getChapters(audiobookId) {
    // Filter chapters for this audiobook and sort by startTime
    return this.data.chapters
      .filter(c => c.audiobookId === audiobookId)
      .sort((a, b) => a.startTime - b.startTime);
  }

  async updateProgress(audiobookId, progress) {
    const index = this.data.audiobooks.findIndex(a => a.id === audiobookId);

    if (index === -1) {
      throw new Error(`Audiobook with id ${audiobookId} not found`);
    }

    const now = new Date().toISOString();
    this.data.audiobooks[index].progress = progress;
    this.data.audiobooks[index].lastPlayed = now;

    await this.save();
    return { changes: 1 };
  }

  close() {
    // Save one final time before closing
    return this.save()
      .then(() => {
        console.log('Database connection closed');
      })
      .catch(err => {
        console.error('Error closing database:', err);
      });
  }
}

module.exports = DatabaseManager;
