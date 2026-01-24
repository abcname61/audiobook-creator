const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;
const { EventEmitter } = require('events');
const mm = require('music-metadata');
const NodeID3 = require('node-id3');

class AudiobookConverter extends EventEmitter {
  constructor() {
    super();
    this.isConverting = false;
  }

  async convertToM4B(options) {
    const {
      files,
      outputPath,
      title = 'Untitled Audiobook',
      author = 'Unknown Author',
      coverImage = null,
      bitrate = '64k'
    } = options;

    if (!files || files.length === 0) {
      throw new Error('No files provided for conversion');
    }

    this.isConverting = true;
    const outputFileName = `${this.sanitizeFilename(title)}.m4b`;
    const finalOutputPath = path.join(outputPath, outputFileName);

    try {
      // Se c'è un solo file, conversione diretta
      if (files.length === 1) {
        await this.convertSingleFile(files[0].path, finalOutputPath, {
          title,
          author,
          coverImage,
          bitrate
        });
      } else {
        // Multiple files: concatenazione + conversione
        await this.convertMultipleFiles(files, finalOutputPath, {
          title,
          author,
          coverImage,
          bitrate
        });
      }

      this.isConverting = false;
      return {
        success: true,
        outputPath: finalOutputPath,
        fileName: outputFileName
      };

    } catch (error) {
      this.isConverting = false;
      throw error;
    }
  }

  async convertSingleFile(inputPath, outputPath, metadata) {
    return new Promise((resolve, reject) => {
      const command = ffmpeg(inputPath)
        .audioCodec('aac')
        .audioBitrate(metadata.bitrate)
        .format('ipod')
        .outputOptions([
          '-f mp4',
          `-metadata title="${metadata.title}"`,
          `-metadata artist="${metadata.author}"`,
          `-metadata album="${metadata.title}"`,
          '-metadata genre="Audiobook"'
        ]);

      // Aggiungi cover image se presente
      if (metadata.coverImage) {
        command.input(metadata.coverImage).outputOptions([
          '-map 0:a',
          '-map 1:v',
          '-c:v copy',
          '-disposition:v:0 attached_pic'
        ]);
      }

      command
        .on('start', (cmd) => {
          console.log('FFmpeg command:', cmd);
          this.emit('progress', { stage: 'starting', percent: 0 });
        })
        .on('progress', (progress) => {
          const percent = progress.percent || 0;
          this.emit('progress', {
            stage: 'converting',
            percent: Math.round(percent),
            timemark: progress.timemark
          });
        })
        .on('end', () => {
          this.emit('progress', { stage: 'complete', percent: 100 });
          resolve();
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(err);
        })
        .save(outputPath);
    });
  }

  async convertMultipleFiles(files, outputPath, metadata) {
    // Crea file di lista per FFmpeg
    const listFilePath = path.join(path.dirname(outputPath), 'filelist.txt');
    const listContent = files
      .map(file => `file '${file.path.replace(/'/g, "'\\''")}'`)
      .join('\n');

    await fs.writeFile(listFilePath, listContent, 'utf-8');

    return new Promise((resolve, reject) => {
      const command = ffmpeg()
        .input(listFilePath)
        .inputOptions(['-f concat', '-safe 0'])
        .audioCodec('aac')
        .audioBitrate(metadata.bitrate)
        .format('ipod')
        .outputOptions([
          '-f mp4',
          `-metadata title="${metadata.title}"`,
          `-metadata artist="${metadata.author}"`,
          `-metadata album="${metadata.title}"`,
          '-metadata genre="Audiobook"'
        ]);

      // Aggiungi cover image se presente
      if (metadata.coverImage) {
        command.input(metadata.coverImage).outputOptions([
          '-map 0:a',
          '-map 1:v',
          '-c:v copy',
          '-disposition:v:0 attached_pic'
        ]);
      }

      let totalDuration = 0;
      let processedDuration = 0;

      command
        .on('start', async (cmd) => {
          console.log('FFmpeg command:', cmd);
          // Calcola durata totale
          totalDuration = await this.getTotalDuration(files);
          this.emit('progress', { stage: 'starting', percent: 0 });
        })
        .on('progress', (progress) => {
          if (totalDuration > 0) {
            const timeParts = progress.timemark.split(':');
            const seconds = (+timeParts[0]) * 3600 + (+timeParts[1]) * 60 + (+timeParts[2]);
            const percent = (seconds / totalDuration) * 100;
            
            this.emit('progress', {
              stage: 'converting',
              percent: Math.round(percent),
              timemark: progress.timemark
            });
          }
        })
        .on('end', async () => {
          // Pulisci file temporaneo
          try {
            await fs.unlink(listFilePath);
          } catch (err) {
            console.warn('Could not delete temp file:', err);
          }
          
          this.emit('progress', { stage: 'complete', percent: 100 });
          resolve();
        })
        .on('error', async (err) => {
          // Pulisci file temporaneo in caso di errore
          try {
            await fs.unlink(listFilePath);
          } catch (e) {
            // Ignora errori di pulizia
          }
          
          console.error('FFmpeg error:', err);
          reject(err);
        })
        .save(outputPath);
    });
  }

  async getTotalDuration(files) {
    let total = 0;
    for (const file of files) {
      try {
        const metadata = await mm.parseFile(file.path);
        total += metadata.format.duration || 0;
      } catch (err) {
        console.warn(`Could not read duration for ${file.name}:`, err);
      }
    }
    return total;
  }

  sanitizeFilename(filename) {
    return filename
      .replace(/[<>:"/\\|?*]/g, '') // Rimuovi caratteri non validi
      .replace(/\s+/g, '_') // Sostituisci spazi con underscore
      .trim();
  }

  async extractMetadata(filePath) {
    try {
      const metadata = await mm.parseFile(filePath);
      return {
        title: metadata.common.title || path.basename(filePath, path.extname(filePath)),
        artist: metadata.common.artist || 'Unknown',
        album: metadata.common.album || '',
        duration: metadata.format.duration || 0,
        bitrate: metadata.format.bitrate || 0
      };
    } catch (error) {
      console.error('Error extracting metadata:', error);
      return null;
    }
  }
}

module.exports = AudiobookConverter;
