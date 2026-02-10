# Struttura del Progetto

Questa guida esplora ogni file e cartella significativa del repository `cluedo-family-party`.

## Root Directory

| File / Cartella      | Descrizione                                                                   |
| :------------------- | :---------------------------------------------------------------------------- |
| `docs/`              | Contiene tutta la documentazione (Guide, Architettura, Todo, Security).       |
| `src/`               | Codice sorgente dell'applicazione React.                                      |
| `public/`            | Asset statici serviti direttamente (favicon, manifest, ecc).                  |
| `.env.example`       | Template delle variabili d'ambiente. Copiare in `.env.local` e popolare.      |
| `.env.local`         | (Git Ignored) Contiene le chiavi API reali per lo sviluppo locale.            |
| `.gitignore`         | Definisce cosa escludere dal version control (node_modules, dist, env files). |
| `firebase.json`      | Configurazione di Firebase Hosting (regole di rewrite per SPA).               |
| `index.html`         | Entry point HTML. Contiene il `div#root` dove React monta l'app.              |
| `package.json`       | Dipendenze npm e script (`dev`, `build`, `lint`).                             |
| `tailwind.config.js` | Configurazione del tema Tailwind (colori custom, font, plugin).               |
| `vite.config.js`     | Configurazione del bundler Vite.                                              |

## Source Directory (`src/`)

### Entry Points

- **`main.jsx`**: Punto di ingresso JavaScript. Inizializza React e importa gli stili globali.
- **`App.jsx`**: Componente radice. Gestisce:
  - Stato dell'Autenticazione (`useAuthState`).
  - Routing "manuale" basato su stati (`view`: LOBBY, SETUP, GAME, ecc.).
  - Logica di caricamento/salvataggio dati da Firestore.
- **`index.css`**: Direttive Tailwind (`@tailwind base...`) e stili globali custom.
- **`constants.js`**: Costanti globali (Colori giocatori, Email Admin, Strutture dati default).
- **`firebase.js`**: Inizializza l'app Firebase e esporta `db`, `auth`, `provider`.

### Components (`src/components/`)

Componenti UI riutilizzabili e viste principali.

#### Viste Principali

- **`Lobby.jsx`**: Dashboard iniziale. Mostra le partite recenti salvate su Firestore e pulsanti per iniziare.
- **`Login.jsx`**: Schermata di login con pulsante Google.
- **`SetupEdition.jsx`**: Controller. Gestisce lo stato delle Edizioni e delega alle viste specifiche.
  - `setup-edition/`
    - **`SetupEditionDesktop.jsx`**: Split View (Lista Edizioni + Form Modifica).
    - **`SetupEditionMobile.jsx`**: Lista Edizioni (Form apre in modale/pagina a parte).
    - **`EditionForm.jsx`**: Form riutilizzabile per i dettagli edizione.

- **`SetupPlayers.jsx`**: Controller. Gestisce Rubrica, Squadra e logica di salvataggio.
  - `setup-players/`
    - **`SetupPlayersDesktop.jsx`**: Split View. Implementa **Drag & Drop** con `dnd-kit`.
    - **`SetupPlayersMobile.jsx`**: Lista ottimizzata touch.
    - **`PlayerItem.jsx`**: Componente UI puro per la singola card giocatore (usato anche nel DragOverlay).
    - **`SortablePlayerItem.jsx`**: Wrapper `dnd-kit` per rendere `PlayerItem` ordinabile.
    - **`PlayerEditForm.jsx`**: Form per creare/modificare giocatori.
- **`GameView.jsx`**: Il "tavolo da gioco". Orchestra la Griglia, il Menu e il Log.
  - Gestisce il layout responsive (Mobile vs Desktop Split View).
  - **Sidebar Logs**: Su Desktop si apre a destra con animazione slide-in.

#### Game Components (`src/components/game/`)

- **`Grid.jsx`**: Il cuore dell'app.
  - Implementa una logica **Fluid Balanced** (`useBalancedColumns`) per distribuire le card simmetricamente.
  - **Mobile**: Scroll fluido orizzontale/verticale.
  - **Desktop**: Centrato e ottimizzato.
  - Gestisce i click sulle celle (Maybe -> Yes -> No).
- **`ClueCard.jsx`**: Componente v4.
  - Include logica `ResizeObserver` per bilanciare anche le tile dei giocatori al suo interno.
  - Supporta visualizzazione compatta e titoli "Pastel Dark".
- **`LogView.jsx`**: Il diario del detective.
  - Lista cronologica delle ipotesi.
  - Supporta filtri e modifiche.

#### UI Utilities

- **`Modal.jsx`**: Wrapper per finestre modali (es. filtri, ipotesi).

## Build Artifacts (`dist/`)

Generata da `npm run build`. Contiene i file statici ottimizzati (JS minificato, CSS) pronti per il deploy. **Mai modificare manualmente.**
