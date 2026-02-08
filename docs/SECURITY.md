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

## 4. Sicurezza Operativa (Google Cloud Console)

Questa sezione descrive le azioni manuali "Set and Forget" necessarie per blindare l'applicazione.

### 4.1 Restrizioni API (HTTP Referrer) - 🛡️ CRITICO

Poiché la chiave API è visibile nel codice client-side, dobbiamo renderla inutilizzabile per chiunque non sia noi.

1.  Vai alla [Google Cloud Console > API & Services > Credentials](https://console.cloud.google.com/apis/credentials).
2.  Clicca sulla tua **Browser key** (quella usata in `VITE_FIREBASE_API_KEY`).
3.  Sotto **Application restrictions**, seleziona **Web sites**.
4.  In **Website restrictions**, aggiungi ESATTAMENTE queste voci:
    - `http://localhost:5173/*` (Per lo sviluppo locale)
    - `https://cluedo-family-party.web.app/*` (Produzione)
    - `https://cluedo-family-party.firebaseapp.com/*` (Produzione)
5.  Clicca **Save**.

> **Verifica:** Dopo il salvataggio, prova ad aprire l'app in Incognito. Se funziona, le restrizioni sono corrette. Se vedi errori in console legati alle API, controlla di aver inserito i domini giusti.

### 4.2 Protezione Budget 💰

Per evitare sorprese in bolletta dovute a bug o attacchi:

1.  Vai su [Billing > Budgets & alerts](https://console.cloud.google.com/billing/budgets).
2.  Clicca **Create Budget**.
3.  **Scope**: Seleziona il progetto corrente.
4.  **Amount**: Imposta un budget mensile basso (es. **1€** o **5€**). Il piano Spark è gratuito, ma questo serve come "sentinella" se superi le quote free.
5.  **Actions**: Lascia le impostazioni di default (Email to Billing Admins).
6.  Clicca **Finish**.

### 4.3 Contatti Essenziali 📧

Google invia notifiche di sicurezza critiche qui.

1.  Vai su [IAM & Admin > Essential Contacts](https://console.cloud.google.com/iam-admin/essential-contacts).
2.  Aggiungi la tua email personale nelle categorie **All** o almeno **Security** e **Technical**.

## 5. Gestione Incidenti

In caso di leak delle chiavi (come avvenuto pre-v1.0):

1.  **Rotazione Immediata**: Rigenerazione chiave su Google Cloud Console.
2.  **Scrubbing**: Rimozione profonda dalla history di Git (completata).
3.  **Monitoraggio**: Verifica accessi anomali su Firebase Console.

## 6. Service Accounts

> ⚠️ **DIVIETO ASSOLUTO**: Nessun file `.json` di Service Account (es. `firebase-adminsdk-xxx.json`) deve mai essere presente nella cartella del progetto o committato su Git.

Se in futuro servisse un backend (es. Cloud Functions), usare l'identità gestita di Firebase, non chiavi statiche.
