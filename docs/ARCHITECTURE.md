# Architettura Tecnica - Cluedo Family Party

## Overview

Applicazione **Progressive Web App (PWA)** sviluppata con **React** e **Vite**.
Il backend è **Firebase** (Firestore + Auth).
L'applicazione è progettata per essere **Mobile-First**, con un layout adattivo che passa da una griglia compatta (Mobile) a una Split View affiancata (Desktop). È installabile su dispositivi mobili e funziona offline (cache-first per asset statici).

## Stack Tecnologico

- **Frontend**: React (v18), Vite
- **PWA**: `vite-plugin-pwa` (Service Worker, Manifest, Installabilità)
- **Stile**: Tailwind CSS (Utility-first framework)
- **Icone**: Lucide React
- **Asset**: SVG nativi
- **Feedback UI**: SweetAlert2 (Modali e conferme)
- **Backend**: Firebase (Hosting, Firestore, Auth - Google Provider)

## Struttura Progetto

- `src/main.jsx`: Punto d'ingresso React.
- `src/App.jsx`: Gestore di stato globale, Logica Sessione, Auto-Save Debounced, Lazy Loading rotte.
- `src/assets/`:
  - `logo.svg`: Logo ufficiale.
- `src/components/`
  - `Lobby.jsx`: Entry point. Lista partite recenti.
  - `SetupEdition.jsx`: Gestione Edizioni (Pubbliche/Private).
  - `SetupPlayers.jsx`: Rubrica Giocatori persistente e selezione squadra.
  - `GameView.jsx`: Layout principale partita (Header + Grid + Log).
  - `game/Grid.jsx`: La griglia interattiva ottimizzata mobile.
  - `game/LogView.jsx`: Il diario delle ipotesi.
- `src/utils/swal.js`: Configurazione centralizzata SweetAlert2 (Responsive).
- `src/constants.js`: Configurazioni (Colori, Admin Email).
- `src/firebase.js`: Configurazione e provider Google.

## Performance & Ottimizzazioni

1.  **Code Splitting**:
    - Le rotte principali (`GamePage`, `SetupEdition`, `SetupPlayers`) sono caricate in **Lazy Loading** con `React.Suspense`.
    - **Vendor Chunking**: Le librerie pesanti (Firebase, React) sono separate in chunk dedicati (`firebase`, `vendor`) per ottimizzare il caching.
2.  **PWA**:
    - Service Worker configurato per caching aggressivo degli asset statici.
    - Manifest per installazione come app nativa.

## Flusso Dati & Sicurezza

1.  **Authentication**: L'utente accede tramite **Google Sign-In**.
2.  **Data Isolation**:
    - Le "Rubriche" e i salvataggi sono isolati per utente nel path `users/{uid}/`.
    - Le regole di sicurezza Firestore (`firestore.rules`) garantiscono che ogni utente possa leggere/scrivere solo i propri dati.
3.  **Sync & Conflict Resolution**:
    - **Auto-Save**: Debounce (1s) su ogni modifica.
    - **Loop Breaker**: Un flag `isRemoteUpdate` previene il "ping-pong" dei salvataggi (Echo Save) quando due dispositivi sono sincronizzati sulla stessa partita. Gli aggiornamenti ricevuti da remoto non innescano un auto-save locale.
4.  **Edizioni**:
    - Gli utenti vedono le edizioni pubbliche (gestite dall'Admin) e le proprie private.

## Deploy

Il deploy avviene su **Firebase Hosting**:

```bash
npm run build
firebase deploy
```

La cartella di output è `dist`.
