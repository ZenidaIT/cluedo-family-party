# Roadmap & Todo - Cluedo Family Party

Questo file tiene traccia delle funzionalità pianificate, in corso e completate.
Leggere sempre questo file prima di iniziare un nuovo task per allinearsi con la roadmap.

## 🚧 In Corso

- [ ] **Restyling Desktop UI/UX & Theme Engine**:
  - [ ] **Architecture**: Implementare `ThemeContext` e struttura `src/themes/`.
  - [ ] **Refactoring**: Sostituire colori hardcoded con CSS Variables (`--bg-primary`, `--text-main`...).
  - [ ] **Tema "Warm Dark"**: Porting del tema attuale nel nuovo sistema.
  - [ ] **Tema "Fantasy"**:
    - [ ] Generazione Asset (Pelle, Pergamena, Macchie).
    - [ ] Implementazione 9-Slice Scaling per bordi irregolari.
  - [ ] **Griglia di Gioco**: Completamento redesign card e layout.

## 📅 Pianificati (Next Up)

- [ ] **Allineamento Mobile**: Portare lo stile Desktop su Mobile (solo dopo aver finito Desktop).

## ✅ Completati

### 🖥️ Desktop GUI Interfaccia

- [x] **Riprogettazione Griglia Desktop**:
  - [x] Header: Icona Home separata, Titolo testo semplice.
  - [x] Codice Partita: Sottotesto cliccabile per copiare.
  - [x] Layout: Sidebar Log fissa, Griglia a tutto schermo (no max-w).
- [x] **UI Card-Based (v3)**:
  - [x] Grid -> Card Layout: Sostituita tabella con card interattive.
  - [x] Log Sidebar: Spostata a Sinistra con toggle.
  - [x] Full Screen: Ottimizzazione spazi e rimozione padding inutili.
  - [x] **Log Verticale**: Visualizzazione a triple per leggibilità.
  - [x] **Highlighting**: Click su Log evidenzia le card corrispondenti.

### ⚙️ Flusso Creazione Partita

- [x] **Selezione Edizione**:
  - Click sulla Card SELEZIONA l'edizione.
  - Aggiunto pulsante Matita/Edit esplicito.

### 👥 Gestione Giocatori & Rubrica

- [x] **Logica di Selezione (Toggle)**: Click aggiunge/rimuove.
- [x] **Modifica Giocatori**: Matita apre modale senza trigger selezione.
- [x] **Evidenziazione "In Gioco"**: Bordo distintivo per giocatori attivi.
- [x] **Refactoring Testi**: Rinominato "La tua squadra" -> "In gioco" e "Inizia" -> "Gioca". Contatore spostato.
- [x] **Fix Drag & Drop Desktop**: Corretto passaggio props mancanti in `SetupPlayersDesktop`.

### 📱 UI Mobile & Layout

- [x] **Ottimizzazione Lista Squadra**: Elementi compatti su mobile (4-5 visibili).

### 🧭 Navigazione & UX

- [x] **Pulsante Indietro Smart**: Rispetta la provenienza (Home vs Game).

### 🔒 Sicurezza & Infrastruttura

- [x] **Google Cloud Security Hardening**:
  - Limitate chiavi API (HTTP Referrer) su Console.
  - Aggiornato `docs/SECURITY.md` con procedure operative.
  - Verificato Budget Alert.

### 🎨 Design

- [x] **Dark Mode & UI Revamp (v4)**:
  - [x] Tema scuro completo (Slate-950) con accenti pastello.
  - [x] **Fluid Balanced Grid**: Logica `ResizeObserver` per bilanciare colonne card e player.
  - [x] Header Semplificati: Rimossi stili "pillola", focus su leggibilità.
  - [x] **Scrollbar Theming**: Scrollbar scure integrate.
  - [x] **Sidebar Destra**: Spostato il diario sulla destra per desktop.
- [x] **Espansione Palette Colori**: 30+ colori distinti e armoniosi.
