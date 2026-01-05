# Cluedo Family Party

Un'applicazione web moderna per gestire le partite di Cluedo in famiglia, sostituendo il classico foglio di carta con una versione digitale, interattiva e persistente.

## 🚀 Funzionalità

- **Gestione Giocatori e Squadre**

  - Rubrica persistent (salvata su Firestore) per i giocatori frequenti.
  - Selezione rapida della squadra per la partita corrente.
  - Assegnazione colori univoci.
  - Validazione nomi univoci.

- **Gestione Edizioni**

  - Supporto per edizioni multiple di Cluedo.
  - Edizioni "Pubbliche" (visibili a tutti) e "Private" (personali dell'utente).
  - Personalizzazione completa di Sospettati, Armi e Luoghi.

- **Griglia di Gioco Interattiva**

  - Interfaccia responsive ottimizzata per Mobile e Desktop.
  - Stati delle celle: Vuoto, Forse (?), Sì (V), No (X), Soluzione.
  - Sincronizzazione in tempo reale (da implementare completamente nelle fasi successive).

- **Diario delle Ipotesi (Log)**
  - Registrazione cronologica di ogni ipotesi fatta.
  - Possibilità di modifica e cancellazione.
  - Filtri avanzati per analizzare la partita.

## 🛠️ Tecnologie

- **Frontend**: React, Vite, TailwindCSS
- **Backend / Database**: Firebase (Auth, Firestore, Hosting)
- **Icons**: Lucide React
- **Alerts**: SweetAlert2

## 📦 Installazione

1. Clona il repository:

   ```bash
   git clone https://github.com/ZenidaIT/cluedo-family-party.git
   cd cluedo-family-party
   ```

2. Installa le dipendenze:

   ```bash
   npm install
   ```

3. Crea un file `.env.local` con le tue chiavi Firebase (vedi `.env.example` se presente, o chiedi all'amministratore).

4. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

## 📝 Roadmap

Vedi `docs/TODO.md` per i prossimi passi e le funzionalità in sviluppo.

## 📄 Documentazione

Per dettagli sull'architettura e la guida utente, consulta la cartella `docs/`.
