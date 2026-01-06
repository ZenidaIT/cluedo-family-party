# Guida Sviluppatore - Cluedo Family Party

Questa guida è pensata per nuovi sviluppatori (o agenti AI) che devono configurare l'ambiente e lavorare sul progetto.

## Prerequisiti

- **Node.js** (v18 o superiore)
- **npm**
- **Git**
- Account Google per accesso a Firebase Console.

## Setup Iniziale

1.  **Clona il repository**:

    ```bash
    git clone https://github.com/ZenidaIT/cluedo-family-party.git
    cd cluedo-family-party
    ```

2.  **Installa le dipendenze**:

    ```bash
    npm install
    ```

3.  **Configura le Variabili d'Ambiente**:

    - Copia il file di esempio:
      ```bash
      cp .env.example .env.local
      ```
    - Apri `.env.local` e inserisci le chiavi del tuo progetto Firebase (chiedile all'admin o prendile dalla Firebase Console > Project Settings).

    ```env
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    ...
    ```

4.  **Avvia il Server di Sviluppo**:
    ```bash
    npm run dev
    ```
    L'app sarà accessibile su `http://localhost:5173`.

## Comandi Disponibili

- `npm run dev`: Avvia Vite in modalità dev (hot reload). Nota: il Service Worker PWA potrebbe non essere attivo in dev standard.
- `npm run build`: Compila il progetto per produzione nella cartella `dist/`.
- `npm run preview`: Avvia un server locale per testare la build di produzione (utile per testare PWA offline).
- `firebase deploy`: Pubblica la cartella `dist/` su Firebase Hosting.

## Workflow di Sviluppo

1.  **Tasking**: Leggi sempre `docs/TODO.md` per vedere la roadmap.
2.  **Branching**: Lavora idealmente su branch separati (es. `feature/nuova-funzione`) e fai merge su `master` solo quando stabile.
3.  **Commit Type**: Usa messaggi descrittivi ("Feat: ...", "Fix: ...", "Docs: ...").
4.  **Test**: Verifica sempre il layout su **Mobile** (Chrome DevTools Device Mode) e **Desktop**.

## Deployment

Il deploy è manuale (per ora) tramite CLI Firebase.

1.  Assicurati di essere loggato: `firebase login`.
2.  Compila e Pubblica:
    ```bash
    npm run build
    firebase deploy
    ```
3.  Verifica live su: `https://cluedo-family-party.web.app`
