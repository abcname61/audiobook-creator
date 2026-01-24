# 🚀 Guida al Deployment

Questa guida ti aiuterà a creare installer distribuibili per Windows, macOS e Linux.

## Prerequisiti

Prima di iniziare la build:

1. ✅ **FFmpeg installato** sul sistema di build
2. ✅ **Node.js v18+** installato
3. ✅ **Dipendenze installate** (`npm install`)
4. ✅ **Icone generate** (vedi ICONS.md)
5. ✅ **Codice testato** su piattaforma target

## Build Multi-Piattaforma

### Build su Windows → per Windows

```bash
# Build completa
npm run build:win

# Output:
# dist/audiobook-creator-setup-1.0.0.exe (NSIS installer)
```

**Requisiti specifici:**
- Windows 10/11
- NSIS (installato automaticamente da electron-builder)

### Build su macOS → per macOS

```bash
# Build completa
npm run build:mac

# Output:
# dist/audiobook-creator-1.0.0.dmg (disk image)
# dist/audiobook-creator-1.0.0-mac.zip
```

**Requisiti specifici:**
- macOS 10.14+
- Xcode Command Line Tools: `xcode-select --install`

**Firma dell'app (opzionale ma raccomandato):**
```javascript
// In package.json, aggiungi in "build.mac":
"identity": "Developer ID Application: Your Name (TEAM_ID)",
"hardenedRuntime": true,
"gatekeeperAssess": false,
"entitlements": "entitlements.mac.plist",
"entitlementsInherit": "entitlements.mac.plist"
```

Crea `entitlements.mac.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
</dict>
</plist>
```

### Build su Linux → per Linux

```bash
# Build completa
npm run build:linux

# Output:
# dist/audiobook-creator-1.0.0.AppImage
# dist/audiobook-creator_1.0.0_amd64.deb
```

**Requisiti specifici:**
- Linux (Ubuntu/Debian consigliato)
- Dipendenze: `sudo apt install fakeroot dpkg rpm`

### Cross-Platform Build

È possibile buildare per altre piattaforme, ma con limitazioni:

**Da macOS:**
```bash
npm run build              # Builda per macOS, Windows, Linux
```

**Da Linux:**
```bash
npm run build              # Builda per Linux e Windows
# Non può buildare per macOS (richiede macOS)
```

**Da Windows:**
```bash
npm run build              # Builda per Windows
# Può buildare per Linux usando Docker
```

## Dimensioni Installer Attese

- **Windows:** ~150-180 MB (NSIS)
- **macOS:** ~200-230 MB (DMG)
- **Linux AppImage:** ~180-200 MB
- **Linux DEB:** ~150-170 MB

Le dimensioni includono:
- Electron runtime
- Chromium embedded
- Node.js runtime
- Dipendenze npm
- Il tuo codice

## Auto-Update (Opzionale)

Per abilitare gli aggiornamenti automatici, configura:

1. **Setup hosting per release:**
   - GitHub Releases (gratuito)
   - S3 bucket
   - Server proprio

2. **Aggiungi electron-updater:**
```bash
npm install electron-updater
```

3. **Configura in package.json:**
```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "tuousername",
      "repo": "audiobook-creator"
    }
  }
}
```

4. **Aggiungi logica update in main.js:**
```javascript
const { autoUpdater } = require('electron-updater');

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

## Code Signing

### Windows

**Opzione 1: Certificate acquistato**
```bash
# Imposta variabili ambiente
set CSC_LINK=path/to/certificate.pfx
set CSC_KEY_PASSWORD=your_password

npm run build:win
```

**Opzione 2: Self-signed (solo per test)**
```bash
# Non consigliato per distribuzione pubblica
# Windows SmartScreen lo bloccherà
```

### macOS

**Richiede:**
- Apple Developer Account ($99/anno)
- Developer ID Application certificate

```bash
# Ottieni certificato
# Xcode → Preferences → Accounts → Manage Certificates

# Build con firma
export CSC_NAME="Developer ID Application: Your Name"
npm run build:mac

# Notarizza (richiesto per macOS 10.15+)
xcrun altool --notarize-app \
  --primary-bundle-id "com.audiobook.creator" \
  --username "your@email.com" \
  --password "@keychain:AC_PASSWORD" \
  --file dist/audiobook-creator-1.0.0.dmg
```

### Linux

Non richiede code signing, ma puoi firmare i pacchetti:

```bash
# Firma DEB
dpkg-sig --sign builder dist/*.deb

# Verifica
dpkg-sig --verify dist/*.deb
```

## Distribuzione

### 1. GitHub Releases (Consigliato)

```bash
# 1. Crea tag versione
git tag v1.0.0
git push origin v1.0.0

# 2. Builda tutti i target
npm run build

# 3. Carica su GitHub Releases
# - Vai su https://github.com/tuousername/audiobook-creator/releases
# - Crea "New Release"
# - Tag: v1.0.0
# - Carica tutti i file da dist/
# - Pubblica
```

### 2. Piattaforme Alternative

**Windows:**
- Microsoft Store (richiede app certificata)
- Chocolatey
- Winget

**macOS:**
- Mac App Store (richiede dev account)
- Homebrew Cask

**Linux:**
- Snap Store
- Flatpak (Flathub)
- AUR (Arch User Repository)

## Testing Pre-Release

### Checklist Test

- [ ] Installazione pulita
- [ ] Icona corretta
- [ ] Menu/tray funzionanti
- [ ] Selezione file/cartelle
- [ ] Conversione audio
- [ ] Salvataggio database
- [ ] Libreria funzionante
- [ ] Disinstallazione pulita
- [ ] Auto-update (se abilitato)

### Test su Virtual Machines

**Windows:**
- Windows 10 (21H2)
- Windows 11

**macOS:**
- macOS Monterey
- macOS Ventura

**Linux:**
- Ubuntu 22.04 LTS
- Fedora latest
- Debian stable

## Troubleshooting Build

### Errore: "Cannot find module"
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Errore: "Application not signed"
- Windows: Ottieni certificato code signing
- macOS: Usa Developer ID o distribuisci solo per test

### Errore: "Native module rebuild"
```bash
npm rebuild --runtime=electron --target=28.1.0
```

### Build fallisce su Linux
```bash
# Installa dipendenze mancanti
sudo apt install fakeroot dpkg rpm
```

## Ottimizzazione Dimensione

Per ridurre la dimensione dell'installer:

```json
// In package.json
{
  "build": {
    "asar": true,
    "compression": "maximum",
    "files": [
      "!**/*.map",
      "!**/node_modules/*/{CHANGELOG.md,README.md,README}",
      "!**/node_modules/.bin"
    ]
  }
}
```

## Monitoraggio Post-Release

Dopo il rilascio, monitora:

1. **Download statistics** - GitHub Releases fornisce metriche
2. **Crash reports** - Implementa error tracking (Sentry, etc.)
3. **User feedback** - GitHub Issues
4. **Update adoption** - Se usi auto-updater

## Release Checklist

- [ ] Versione aggiornata in `package.json`
- [ ] CHANGELOG.md aggiornato
- [ ] README.md aggiornato se necessario
- [ ] Tutte le features testate
- [ ] Build su tutte le piattaforme
- [ ] Installer testati
- [ ] Tag git creato
- [ ] GitHub Release pubblicato
- [ ] Documentazione aggiornata
- [ ] Annuncio rilascio (social, blog, etc.)

## Continuous Integration

Per automatizzare le build, usa GitHub Actions:

Crea `.github/workflows/build.yml`:

```yaml
name: Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: dist/
```

---

**🎉 Il tuo software è pronto per essere distribuito al mondo!**

Per domande specifiche sul deployment, consulta:
- [Electron Builder Docs](https://www.electron.build/)
- [Code Signing Guide](https://www.electron.build/code-signing)
