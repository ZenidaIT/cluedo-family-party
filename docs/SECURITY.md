# Modello di Sicurezza - Cluedo Family Party

## Panoramica

L'applicazione si basa su un modello di sicurezza delegata a **Firebase Authentication** e **Firestore Security Rules**. Non gestiamo password proprietarie né crittografia client-side (rimossa nella v1.0).

## 1. Identità e Accesso (IAM)

- **Provider**: Google Sign-In.
- **Flusso**:
  - L'utente si autentica con il proprio account Google.
  - Generiamo un token JWT valido per interagire con le API di Firebase.
- **Persistenza**: La sessione è mantenuta localmente (persistence: `LOCAL`), l'utente non deve riloggarsi ad ogni reload.

## 2. Isolamento dei Dati (Database)

I dati sono strutturati in **Firestore** con una rigida separazione per utente (Multi-Tenancy logica).

### Edizioni (Editions)

- **Pubbliche** (`public_editions`):
  - **Lettura**: Aperta a tutti gli utenti autenticati.
  - **Scrittura**: Riservata agli Admin (email definita in `constants.js`).
- **Private** (`users/{uid}/editions`):
  - **Accesso Completo**: Solo l'utente con `request.auth.uid == uid`.
  - Nessun altro utente può vedere le edizioni personalizzate altrui.

### Giocatori (Players)

- Path: `users/{uid}/players`.
- Rubrica personale dell'utente. Invisibile agli altri.

### Partite (Sessions)

- Path: `users/{uid}/sessions`.
- Ogni partita salvata è privata dell'utente.

## 3. Sicurezza Applicativa

### Variabili d'Ambiente (.env)

Le chiavi API di Firebase **NON** sono hardcodate nel codice sorgente.

- **Sviluppo**: File `.env.local` (non tracciato da Git).
- **Produzione**: Variabili iniettate durante la build CI/CD o configurate nell'hosting.
- **Repo Git**: Contiene solo `.env.example` con i placeholder.

### Protezione Chiavi API

- Le chiavi Firebase esposte nel client ("Browser Key") sono limitate tramite **Google Cloud Console** per accettare richieste solo dai domini autorizzati:
  - `localhost` (Sviluppo)
  - `cluedo-family-party.web.app` (Produzione)
  - `cluedo-family-party.firebaseapp.com` (Produzione)

## 4. Gestione Incidenti

In caso di leak delle chiavi (come avvenuto pre-v1.0):

1.  **Rotazione Immediata**: Rigenerazione chiave su Google Cloud Console.
2.  **Scrubbing**: Rimozione profonda dalla history di Git (completata).
3.  **Monitoraggio**: Verifica accessi anomali su Firebase Console.
