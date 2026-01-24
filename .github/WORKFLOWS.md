# GitHub Actions Workflows

Questo progetto utilizza GitHub Actions per automatizzare build, test e release.

## Workflow Disponibili

### 1. CI (Continuous Integration)

**File**: `.github/workflows/ci.yml`
**Trigger**: Push su `master`, Pull Request

Questo workflow:
- Testa l'applicazione su macOS, Ubuntu e Windows
- Verifica compatibilità con Node.js 18 e 20
- Controlla la sintassi del package.json
- Verifica che FFmpeg sia correttamente incluso

### 2. Release (Build Automatica)

**File**: `.github/workflows/release.yml`
**Trigger**: Push di un tag che inizia con `v*` (es. `v1.0.2`)

Questo workflow:
- Costruisce automaticamente l'applicazione per macOS, Windows e Linux
- Carica i binari nella GitHub Release
- Supporta firma del codice macOS (se configurata)

## Come Creare una Nuova Release

### Metodo 1: Release Automatica (Consigliato)

1. Aggiorna la versione in `package.json`
2. Committa le modifiche
3. Crea e pusha un tag:
   ```bash
   git tag -a v1.0.2 -m "Release v1.0.2"
   git push origin v1.0.2
   ```
4. GitHub Actions costruirà automaticamente i binari per tutte le piattaforme
5. I file saranno caricati nella release

### Metodo 2: Release Manuale

Se preferisci costruire localmente:

```bash
# macOS
npm run build:mac

# Windows (da Windows)
npm run build:win

# Linux (da Linux)
npm run build:linux
```

Poi crea manualmente la release su GitHub.

## Binari Prodotti

Il workflow di release genera i seguenti file:

### macOS
- `Audiobook Creator-{version}-arm64.dmg` (Apple Silicon)
- `Audiobook Creator-{version}-x64.dmg` (Intel)

### Windows
- `Audiobook Creator Setup {version}.exe` (Installer)

### Linux
- `audiobook-creator-{version}.AppImage` (Universal)
- `audiobook-creator_{version}_amd64.deb` (Debian/Ubuntu)

## Badge di Stato

I badge nel README mostrano:
- **CI**: Stato dei test automatici
- **Release**: Stato dell'ultimo build di release
- **Latest Release**: Versione più recente pubblicata

## Troubleshooting

### Il workflow fallisce su Windows
- Verifica che tutte le dipendenze siano compatibili con Windows
- Controlla i path nei file (usa `/` o `path.join()`)

### Il workflow fallisce su Linux
- Alcune dipendenze potrebbero richiedere librerie di sistema
- Verifica che non ci siano dipendenze da GUI durante il build

### La release non viene creata automaticamente
- Verifica che il tag inizi con `v`
- Controlla i permessi del `GITHUB_TOKEN`
- Guarda i log del workflow per dettagli

## Configurazione Opzionale

### Firma del Codice macOS

Per firmare le app macOS, aggiungi questi secrets al repository:
- `MAC_CERTS`: Certificato Developer ID (base64)
- `MAC_CERTS_PASSWORD`: Password del certificato

### Notifiche

Puoi configurare notifiche per i workflow falliti nelle impostazioni del repository.
