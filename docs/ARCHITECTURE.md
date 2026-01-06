# Architettura Tecnica - Cluedo Family Party

## Overview

Applicazione **Single Page Application (SPA)** sviluppata con **React** e **Vite**.
Il backend è **Firebase** (Firestore + Auth).
L'applicazione è progettata per essere **Mobile-First**, con un layout adattivo che passa da una griglia a scorrimento semplice (Mobile) a una Split View affiancata (Desktop).

## Stack Tecnologico

- **Frontend**: React (v18), Vite
- **Stile**: Tailwind CSS (Utility-first framework)
- **Icone**: Lucide React
- **Asset**: SVG nativi
- **Feedback UI**: SweetAlert2 (Modali e conferme)
- **Backend**: Firebase (Hosting, Firestore, Auth - Google Provider)

## Struttura Progetto

- `src/main.jsx`: Punto d'ingresso React.
- `src/App.jsx`: Gestore di stato globale, Logica Sessione, Auto-Save Debounced.
- `src/assets/`:
  - `logo.svg`: Logo ufficiale (Tracciato nero, sfondo trasparente).
- `src/components/`
  - `Lobby.jsx`: Entry point. Lista partite recenti per l'utente loggato.
  - `SetupEdition.jsx`: Gestione Edizioni (Pubbliche/Private).
  - `SetupPlayers.jsx`: Rubrica Giocatori persistente e selezione squadra.
  - `GameView.jsx`: Layout principale partita (Header + Grid + Log).
  - `game/Grid.jsx`: La griglia interattiva.
  - `game/LogView.jsx`: Il diario delle ipotesi.
  - `Modal.jsx`: Componente base per i dialoghi.
  - `Login.jsx`: Gestione autenticazione Google.
- `src/constants.js`: Configurazioni (Colori, Admin Email).
- `src/firebase.js`: Configurazione e provider Google.

## Flusso Dati & Sicurezza

1.  **Authentication**: L'utente accede tramite **Google Sign-In**.
2.  **Data Isolation**:
    - Le "Rubriche" e i salvataggi sono isolati per utente nel path `users/{uid}/`.
    - Le regole di sicurezza Firestore (`firestore.rules`) garantiscono che ogni utente possa leggere/scrivere solo i propri dati.
3.  **Edizioni**:
    - Gli utenti vedono le edizioni pubbliche (gestite dall'Admin) e le proprie private.
4.  **Auto-Save**: Debounce (1s) su ogni modifica della griglia che aggiorna il documento della partita su Firestore.

## Deploy

Il deploy avviene su **Firebase Hosting**:

```bash
npm run build
firebase deploy
```

La cartella di output è `dist`.
