# Roadmap & Todo - Cluedo Family Party

Questo file tiene traccia delle funzionalità pianificate, in corso e completate.
Leggere sempre questo file prima di iniziare un nuovo task per allinearsi con la roadmap.

## 🚧 In Corso

## 📅 Pianificati (Next Up)

- [ ] **Ottimizzazione Mobile**: Touch targets e UX.

## ✅ Completati

### 🖥️ Desktop GUI Interfaccia

- [x] **Riprogettazione Griglia Desktop**:
  - [x] Header: Icona Home separata, Titolo testo semplice.
  - [x] Codice Partita: Sottotesto cliccabile per copiare.
  - [x] Layout: Sidebar Log fissa, Griglia a tutto schermo (no max-w).

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

- [x] **Espansione Palette Colori**: 30+ colori distinti e armoniosi.
