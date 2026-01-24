const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');
const fs = require('fs').promises;

class DatabaseManager {
  constructor() {
    this.db = null;
    const userDataPath = app.getPath('userData');
    this.dbPath = path.join(userDataPath, 'audiobooks.db');
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, async (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('Database connected:', this.dbPath);
          await this.createTables();
          resolve();
        }
      });
    });
  }

  async createTables() {
    const createAudiobooksTable = `
      CREATE TABLE IF NOT EXISTS audiobooks (
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
      )
    `;

    const createChaptersTable = `
      CREATE TABLE IF NOT EXISTS chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        audiobookId INTEGER NOT NULL,
        title TEXT NOT NULL,
        startTime REAL NOT NULL,
        endTime REAL NOT NULL,
        FOREIGN KEY (audiobookId) REFERENCES audiobooks (id) ON DELETE CASCADE
      )
    `;

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(createAudiobooksTable, (err) => {
          if (err) reject(err);
        });
        
        this.db.run(createChaptersTable, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  async addAudiobook(audiobook) {
    const { title, author, outputPath, coverPath, duration, fileSize, createdAt } = audiobook;
    
    const sql = `
      INSERT INTO audiobooks (title, author, outputPath, coverPath, duration, fileSize, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      this.db.run(sql, [title, author, outputPath, coverPath, duration, fileSize, createdAt], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  async getAllAudiobooks() {
    const sql = `
      SELECT * FROM audiobooks
      ORDER BY createdAt DESC
    `;

    return new Promise((resolve, reject) => {
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getAudiobookById(id) {
    const sql = `SELECT * FROM audiobooks WHERE id = ?`;

    return new Promise((resolve, reject) => {
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async updateAudiobook(id, updates) {
    const fields = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = Object.values(updates);
    values.push(id);

    const sql = `UPDATE audiobooks SET ${fields} WHERE id = ?`;

    return new Promise((resolve, reject) => {
      this.db.run(sql, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  async deleteAudiobook(id) {
    const sql = `DELETE FROM audiobooks WHERE id = ?`;

    return new Promise((resolve, reject) => {
      this.db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  async addChapter(audiobookId, chapter) {
    const { title, startTime, endTime } = chapter;
    
    const sql = `
      INSERT INTO chapters (audiobookId, title, startTime, endTime)
      VALUES (?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      this.db.run(sql, [audiobookId, title, startTime, endTime], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  async getChapters(audiobookId) {
    const sql = `
      SELECT * FROM chapters
      WHERE audiobookId = ?
      ORDER BY startTime ASC
    `;

    return new Promise((resolve, reject) => {
      this.db.all(sql, [audiobookId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async updateProgress(audiobookId, progress) {
    const sql = `
      UPDATE audiobooks
      SET progress = ?, lastPlayed = ?
      WHERE id = ?
    `;

    const now = new Date().toISOString();

    return new Promise((resolve, reject) => {
      this.db.run(sql, [progress, now, audiobookId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

module.exports = DatabaseManager;
