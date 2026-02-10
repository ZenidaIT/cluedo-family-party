# 🤝 Agent Handoff & Onboarding

Ciao Agente! Sei atterrato su **Cluedo Family Party**.
Questo documento serve a darti il contesto immediato per continuare il lavoro senza perdere la "memoria" di quanto fatto finora.

## 1. Il Progetto 🕵️‍♂️

**Cluedo Family Party** è una Web App (PWA) di supporto per il gioco da tavolo Cluedo.
Non è il gioco completo, ma un "companion" che sostituisce il foglio di carta per prendere appunti.

**Stack Tecnologico**:

- **Frontend**: React + Vite + Tailwind CSS.
- **Backend**: Firebase (Firestore per dati realtime, Auth per login, Hosting).
- **PWA**: Installabile e Offline-first.
- **Lingua**: Il codice è in Inglese/Italiano misto, ma la **Lingua dell'Interfaccia Utente DEVE essere ITALIANO**.

### 🚨 Regole d'Oro (DA LEGGERE SUBITO)

Prima di scrivere una sola riga di codice, **leggi questi file** nell'ordine:

1.  `docs/project_rules.md`: **CRITICO**. Contiene le regole "Agentic" e di progetto che non devi mai violare.
2.  `docs/TODO.md`: La roadmap. Qui trovi cosa è stato fatto e cosa c'è da fare.
3.  `docs/DEVELOPER_GUIDE.md`: Spiega l'architettura tecnica, come fare il build/deploy e la struttura dei componenti.
4.  `docs/ARCHITECTURE.md`: Panoramica alto livello.

## 2. Stato Attuale: v4 Complete (Desktop) 🎨

Abbiamo appena concluso un **totale restyling (v4)** della versione Desktop.

**Cosa è stato fatto:**

- **Dark Mode First**: Tema `slate-950` con accenti pastello e superfici Material.
- **Fluid Balanced Grid**: Nuovo motore di layout (`useBalancedColumns` in `Grid.jsx` e `ClueCard.jsx`) che bilancia matematicamente le colonne in base allo spazio e al numero di elementi.
- **Layout Desktop**:
  - Sidebar Navigazione (Home/Book/User) a sinistra.
  - Sidebar Diario (Log) a **destra** (slide-in).
  - Header semplificato ma informativo.
- **Ottimizzazione**:
  - `vite.config.js` con `manualChunks` per separare React, Firebase e UI (bundle < 500kB).
  - Scrollbar custom scure (`tailwind-scrollbar`).

## 3. Missione Futura: Mobile UI Revamp 📱

La versione Desktop è lucida e finita. La versione Mobile (`GameViewMobile.jsx`) è rimasta indietro alla v2/v3.

**Il tuo compito principale sarà:**

1.  **Analizzare `GameViewMobile.jsx`**: Capire cosa manca per allinearlo allo stile v4.
2.  **Portare lo stile Card/Dark Mode**:
    - Assicurarsi che le nuove `ClueCard` bilanciate funzionino bene su schermi stretti (il motore `ResizeObserver` dovrebbe già gestirlo, ma va verificato).
    - Verificare i menu a tendina/drawer per il Mobile.
3.  **Ottimizzazione Touch**:
    - Tap targets appropriati.
    - Nessuno scroll orizzontale indesiderato.

## 4. Comandi Utili 🛠️

- `npm run dev`: Server locale (usa `http://localhost:5173`).
- `npm run build`: Compila per produzione (usa Rollup + manualChunks).
- `firebase deploy`: Pubblica online.

Buon lavoro! Prendi il testimone e porta il Mobile al livello del Desktop. 🚀
