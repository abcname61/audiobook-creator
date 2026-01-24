# Guida per Contribuire

Grazie per il tuo interesse nel contribuire a Audiobook Creator! 🎉

## Come Contribuire

### Segnalare Bug

Se trovi un bug:

1. Verifica che non sia già stato segnalato nelle [Issues](https://github.com/tuousername/audiobook-creator/issues)
2. Crea una nuova issue usando il template per i bug
3. Includi:
   - Descrizione chiara del problema
   - Passi per riprodurlo
   - Comportamento atteso vs osservato
   - Sistema operativo e versione dell'app
   - Screenshot se possibile

### Proporre Nuove Funzionalità

1. Apri una [Discussion](https://github.com/tuousername/audiobook-creator/discussions)
2. Descrivi la funzionalità e il suo valore
3. Attendi feedback dalla community
4. Se approvata, puoi implementarla o qualcun altro lo farà

### Processo di Sviluppo

1. **Fork il repository**
   ```bash
   git clone https://github.com/tuo-username/audiobook-creator.git
   ```

2. **Crea un branch per la tua feature**
   ```bash
   git checkout -b feature/nome-feature
   ```

3. **Sviluppa e testa**
   - Scrivi codice pulito e commentato
   - Testa su più piattaforme se possibile
   - Segui le convenzioni di codice esistenti

4. **Commit delle modifiche**
   ```bash
   git commit -m "feat: aggiungi nuova funzionalità X"
   ```

   Usa i prefissi:
   - `feat:` - Nuova funzionalità
   - `fix:` - Correzione bug
   - `docs:` - Documentazione
   - `style:` - Formattazione
   - `refactor:` - Refactoring codice
   - `test:` - Aggiungi test
   - `chore:` - Maintenance

5. **Push e Pull Request**
   ```bash
   git push origin feature/nome-feature
   ```
   
   Poi apri una Pull Request su GitHub.

### Standard di Codice

- **JavaScript**: Usa ES6+ e sintassi moderna
- **Indentazione**: 2 spazi
- **Nomi variabili**: camelCase per variabili, PascalCase per classi
- **Commenti**: Commenta codice complesso
- **Async/Await**: Preferisci async/await alle Promise
- **Error Handling**: Sempre gestisci gli errori con try/catch

### Esempio di Codice

```javascript
// ✅ Buono
async function convertAudio(options) {
  try {
    const result = await converter.convert(options);
    return { success: true, data: result };
  } catch (error) {
    console.error('Conversion error:', error);
    return { success: false, error: error.message };
  }
}

// ❌ Da evitare
function convertAudio(options) {
  converter.convert(options).then(result => {
    return result;
  }).catch(err => {
    console.log(err);
  });
}
```

### Testing

Prima di inviare una PR:

1. Testa manualmente tutte le funzionalità modificate
2. Verifica che l'app si avvii correttamente
3. Testa su Windows/macOS/Linux se possibile
4. Verifica che non ci siano errori nella console

### Pull Request Checklist

- [ ] Il codice compila senza errori
- [ ] Ho testato le modifiche localmente
- [ ] Ho aggiornato la documentazione se necessario
- [ ] Ho seguito le convenzioni di codice
- [ ] I commit hanno messaggi descrittivi
- [ ] Ho aggiornato il README se necessario

### Community

- Sii rispettoso e gentile
- Accetta feedback costruttivo
- Aiuta altri contributori
- Condividi conoscenza

## Domande?

Se hai domande, apri una [Discussion](https://github.com/tuousername/audiobook-creator/discussions) o contattaci via email.

Grazie per contribuire! 🙏
