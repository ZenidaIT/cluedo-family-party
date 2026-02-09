# 🤝 Agent Handoff & Onboarding

Ciao Agente! Sei atterrato su **Cluedo Family Party**.
Questo documento serve a darti il contesto immediato per continuare il lavoro senza perdere la "memoria" di quanto fatto finora.

## 1. Il Progetto 🕵️‍♂️

**Cluedo Family Party** è una Web App (PWA) di supporto per il gioco da tavolo Cluedo.
Non è il gioco completo, ma un "companion" che sostituisce il foglio di carta per prendere appunti.

**Stack Tecnologico**:

- **Frontend**: React + Vite + Tailwind CSS.
- **Backend**: Firebase (Firestore per dati realtime, Auth per login, Hosting).
- **Lingua**: Il codice è in Inglese/Italiano misto, ma la **Lingua dell'Interfaccia Utente DEVE essere ITALIANO**.
- **Regole**: Leggi **assolutamente** `docs/project_rules.md`.

## 2. Mappa della Documentazione 🗺️

Prima di scrivere una sola riga di codice, **leggi questi file** nell'ordine:

1.  `docs/project_rules.md`: **CRITICO**. Contiene le regole "Agentic" e di progetto che non devi mai violare.
2.  `docs/TODO.md`: La roadmap. Qui trovi cosa è stato fatto e cosa c'è da fare.
3.  `docs/DEVELOPER_GUIDE.md`: Spiega l'architettura tecnica, come fare il build/deploy e la struttura dei componenti.
4.  `docs/ARCHITECTURE.md`: Panoramica alto livello (potrebbe essere meno aggiornato del codice, fidati del codice).

## 3. Missione Corrente: UI Restyling (v3) 🎨

Stiamo eseguendo un **totale restyling grafico** dell'applicazione per renderla professionale, pulita e "a Card" (invece che una griglia stile Excel).

### Strategia "Split Interface"

Abbiamo deciso di separare nettamente le interfacce per garantire la miglior UX possibile su entrambi i device.
Invece di un'unica interfaccia responsive complessa, abbiamo due componenti root distinti caricati in `GameView.jsx`:

1.  **`GameViewDesktop.jsx`** (Desktop/Tablet)
2.  **`GameViewMobile.jsx`** (Smartphone)

### ✅ Stato Attuale (Cosa è stato fatto)

Ci siamo concentrati **ESCLUSIVAMENTE SULLA VERSIONE DESKTOP**.
La versione Desktop (v3.2.1) è **COMPLETA**.

- **File Chiave Sviluppati**:
  - `src/components/game/GameViewDesktop.jsx` (Layout principale)
  - `src/components/game/Grid.jsx` (Griglia adattiva)
  - `src/components/game/ClueCard.jsx` (La nuova unità base UI)
  - `src/components/game/LogView.jsx` (Diario laterale)
- **Caratteristiche Desktop**:
  - Layout a tutto schermo (Full Height/Width).
  - Sidebar di navigazione a sinistra (Icon-only).
  - Sidebar del Diario (Log) a comparsa sulla sinistra.
  - Interattività: Cliccando sul Log, le card si illuminano (Highlighting).

### 🚧 Cosa C'è da Fare (Il tuo compito)

Il prossimo grande step è l'**IMPLEMENTAZIONE MOBILE**.
Attualmente `GameViewMobile.jsx` è probabilmente obsoleto o non allineato con il nuovo stile v3.

**Obiettivi Futuri**:

1.  Portare lo stile "Card" su Mobile.
2.  Ottimizzare per il touch.
3.  Mantenere la coerenza visiva (colori, icone) con la versione Desktop appena conclusa.

## 4. Comandi Utili 🛠️

- `npm run dev`: Server locale.
- `npm run build`: Compila.
- `firebase deploy`: Pubblica online.
- **F5 (VS Code)**: Avvia automaticamente il server dev e apre Chrome in debug mode. Comodo!

Buon lavoro! Prendi il testimone e porta il Mobile al livello del Desktop. 🚀
