# Cluedo Family Party

Un'applicazione web moderna per gestire le partite di Cluedo in famiglia, sostituendo il classico foglio di carta con una versione digitale, interattiva e persistente.

## 🚀 Funzionalità

- **Progressive Web App (PWA)**

  - Installabile su Desktop e Mobile.
  - Funziona Offline (cache-first assets).
  - Layout adattivo:
    - **Desktop**: Split View e Griglie espanse.
    - **Mobile**: Liste ottimizzate e Editor a tutto schermo.

- **Gestione Giocatori e Squadre**

  - Rubrica persistente per i giocatori frequenti.
  - Sincronizzazione automatica delle modifiche (nome/colore) su tutte le partite.

- **Gestione Edizioni**

  - **Pubbliche**: Gestite dagli admin, visibili a tutti.
  - **Private**: Create e visibili solo dall'utente.
  - Personalizzazione totale di Sospettati, Armi e Luoghi.

- **Griglia di Gioco Intelligente**

  - Niente scroll orizzontale su Mobile (fino a 5 giocatori).
  - Clicca sul nome della carta per segnarla come "Trovata".
  - Logica di deduzione assistita (Sì/No/Forse).

- **Diario e Log**
  - Cronologia completa delle indagini.

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
