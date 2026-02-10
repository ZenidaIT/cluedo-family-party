# Cluedo Family Party

Un'applicazione web moderna per gestire le partite di Cluedo in famiglia, sostituendo il classico foglio di carta con una versione digitale, interattiva e persistente.

## 🚀 Funzionalità

- **🕵️ Interactive Clue Sheet**: Tocca per ciclare tra gli stati (Sì, No, Forse) con feedback visivo immediato e animazioni fluide.
- **🌑 Dark Mode First**: Interfaccia scura elegante e riposante, con accenti pastello e superfici Material Design per un look premium.
- **📐 Fluid Balanced Grid**: Layout intelligente che bilancia automaticamente colonne e righe per Card e Giocatori, garantendo sempre simmetria e leggibilità su ogni schermo.
- **📱 Responsive Design**: Esperienza ottimizzata per Desktop (Split View), Tablet e Mobile (Liste compatte).
- **🔄 Real-time Sync**: Aggiornamenti istantanei su tutti i dispositivi connessi grazie a Firebase.
- **💾 Auto-Save**: Stato del gioco e preferenze (es. Sidebar laterale, filtri) salvati localmente.

## 🛠️ Tecnologie

- **Frontend**: React, Vite, TailwindCSS
- **Drag & Drop**: @dnd-kit
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

> 🔒 **Sicurezza**: Vedi `docs/SECURITY.md` per le configurazioni critiche di Google Cloud (Restrizioni API e Budget).
