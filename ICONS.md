# Generazione Icone

Per distribuire l'applicazione, è necessario creare icone nei formati corretti per ogni piattaforma.

## Icone Richieste

### Windows (.ico)
- `public/icon.ico`
- Dimensioni multiple: 16x16, 32x32, 48x48, 256x256

### macOS (.icns)
- `public/icon.icns`
- Dimensioni multiple: 16x16, 32x32, 128x128, 256x256, 512x512, 1024x1024

### Linux (.png)
- `public/icon.png`
- Dimensione: 512x512

## Come Generare le Icone

### Opzione 1: Usando strumenti online

1. **Converti SVG in PNG**
   - Vai su: https://svgtopng.com/
   - Carica `public/icon.svg`
   - Scarica PNG a 1024x1024

2. **Genera .ico per Windows**
   - Vai su: https://www.icoconverter.com/
   - Carica il PNG 1024x1024
   - Genera e scarica come `icon.ico`
   - Salva in `public/icon.ico`

3. **Genera .icns per macOS**
   - Su macOS, usa il comando:
   ```bash
   mkdir icon.iconset
   sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
   sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
   sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
   sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
   sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
   sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
   sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
   sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
   sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
   sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png
   iconutil -c icns icon.iconset
   mv icon.icns public/icon.icns
   rm -rf icon.iconset
   ```

4. **PNG per Linux**
   - Rinomina il PNG 512x512 come `icon.png`
   - Salva in `public/icon.png`

### Opzione 2: Usando electron-icon-builder

```bash
# Installa il tool
npm install --save-dev electron-icon-builder

# Genera tutte le icone da un'immagine PNG 1024x1024
npx electron-icon-builder --input=./icon-source.png --output=./public
```

### Opzione 3: Usando ImageMagick

```bash
# Installa ImageMagick
# Windows: choco install imagemagick
# macOS: brew install imagemagick
# Linux: sudo apt install imagemagick

# Converti SVG in PNG
convert public/icon.svg -resize 1024x1024 icon-1024.png

# Crea ICO per Windows
convert icon-1024.png -define icon:auto-resize=256,128,96,64,48,32,16 public/icon.ico

# Crea PNG per Linux
convert icon-1024.png -resize 512x512 public/icon.png
```

## Verifica

Dopo aver generato le icone, verifica che esistano:

```bash
ls -lh public/
# Dovresti vedere:
# icon.svg   (sorgente)
# icon.png   (Linux)
# icon.ico   (Windows)
# icon.icns  (macOS)
```

## Note

- L'icona SVG in `public/icon.svg` è solo un placeholder
- Per un'applicazione professionale, crea un'icona personalizzata ad alta risoluzione
- Usa strumenti come Adobe Illustrator, Figma, o Inkscape per creare icone vettoriali
- Mantieni l'icona semplice e riconoscibile anche a dimensioni ridotte

## Risorse per Icone

- **Figma** - https://www.figma.com/ (gratuito)
- **Inkscape** - https://inkscape.org/ (open-source)
- **Canva** - https://www.canva.com/ (template gratuiti)
- **Flaticon** - https://www.flaticon.com/ (icone gratuite, verifica licenza)
