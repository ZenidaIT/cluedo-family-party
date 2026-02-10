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

    > **Nota Sicurezza**: Se riscontri errori API (es. 403), verifica che `localhost` sia autorizzato nella Google Cloud Console. Vedi `docs/SECURITY.md`.

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

## Componenti Chiave

- **`Lobby.jsx`**: Home page. Gestisce la lista delle sessioni e la creazione di nuove partite.
- **`SetupPlayers.jsx`**: Gestione Rubrica e Squadra.
  - _Desktop_: Split View (Lista a sinistra, Dettagli a destra).
  - _Mobile_: Lista di default. Editor a tutto schermo on-click.
- **`SetupEdition.jsx`**: Gestione Edizioni (Sospettati, Armi, Luoghi).
  - _Desktop_: Split View.
  - _Mobile_: Lista e Editor separati.
- **`GamePage.jsx`**: Il core dell'app. Gestisce lo stato della partita, la griglia e il log.
- **`GameViewDesktop.jsx`**: Layout Desktop principale.
  - Gestisce navigazione laterale (Header in alto, Sidebar Log a **Destra**).
  - Gestisce la griglia principale a tutto schermo con background scuro.
- **`Grid.jsx`**: Renderizza la griglia di Card usando un hook custom `useBalancedColumns` per il layout fluido.
- **`ClueCard.jsx`**: Componente fondamentale v4.
  - `ResizeObserver` integrato per layout responsivo dei giocatori (Tile).
  - Gestisce stati (Yes/No/Maybe) e highlight visivi.
- **`LogView.jsx`**: Visualizza la cronologia delle ipotesi. Supporta click-to-highlight.

## Drag & Drop Implementation

Il riordinamento dei giocatori usa **@dnd-kit** per garantire fluidità e accessibilità.

### Architettura

- **Libreria**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/modifiers`.
- **Sensori**: `PointerSensor` (Mouse/Touch) e `KeyboardSensor` (Accessibilità).
- **Collisioni**: `pointerWithin` (più preciso per liste verticali rispetto a rettangoli).

### Componenti Chiave

1. **`SetupPlayersDesktop.jsx`**: Contiene il `DndContext`.
   - Gestisce lo stato `activeId` per sapere chi si sta trascinando.
   - Renderizza `SortableContext` per la lista.
   - Renderizza `DragOverlay` per l'elemento "in volo".
2. **`SortablePlayerItem.jsx`**: Wrapper che connette il giocatore al sistema di ordinamento.
   - Quando trascinato, **nasconde** l'elemento originale (`opacity: 0.3`) per lasciare spazio al "fantasma" gestito dall'Overlay.
   - Usa `transition` default per lo spostamento fluido degli altri elementi.
3. **`DragOverlay`**: Renderizza una copia perfetta (`PlayerItem`) sopra a tutto.
   - Risolve il problema del "flash" visivo e garantisce che l'elemento segua il cursore senza lag (rimuovendo le animazioni di transizione sull'elemento trascinato).

## Deployment

Il deploy è manuale (per ora) tramite CLI Firebase.

1.  Assicurati di essere loggato: `firebase login`.
2.  Compila e Pubblica:
    ```bash
    npm run build
    firebase deploy
    ```
3.  Verifica live su: `https://cluedo-family-party.web.app`
