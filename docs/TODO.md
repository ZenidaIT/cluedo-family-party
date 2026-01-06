# Roadmap & Todo - Cluedo Family Party

Questo file tiene traccia delle funzionalità pianificate, in corso e completate.
Leggere sempre questo file prima di iniziare un nuovo task per allinearsi con la roadmap.

## 🚧 In Corso

## 📅 Pianificati (Next Up)

### 🎨 Design & Palette Colori

- [ ] **Espansione Palette Colori Giocatori**:
  - Ampliare la selezione a **30 colori distinti**.
  - Garantire la massima varietà cromatica (evitare sfumature troppo simili), coprendo l'intero spettro visibile.
  - Mantenere la coerenza estetica con la UI scura/moderna.

### 👥 Gestione Giocatori & Rubrica

- [ ] **Logica di Selezione (Toggle)**:
  - Il click su un giocatore nella lista Rubrica deve agire da **toggle**:
    - Se NON è in squadra -> Aggiungi.
    - Se È già in squadra -> Rimuovi.
  - (Attualmente permette solo l'aggiunta, costringendo l'utente a rimuovere dalla lista squadra).
- [ ] **Modifica Giocatori (Pulsante Matita)**:
  - Il click sull'icona **Matita** nella scheda giocatore in Rubrica DEVE aprire il modale di modifica (Nome/Colore).
  - Assicurarsi che questo click non inneschi involontariamente la selezione/deselezione del giocatore.
- [ ] **Evidenziazione "In Gioco"**:
  - Rendere molto più evidente chi è già stato selezionato per la partita.
  - Aggiungere un **bordo colorato** (o stile distintivo) alla card del giocatore nella Rubrica quando è attivo nella squadra.

### 📱 UI Mobile & Layout

- [ ] **Ottimizzazione Lista Squadra (Mobile)**:
  - Nella vista mobile, ridimensionare gli elementi della sezione "In gioco" (o "La tua squadra").
  - Obiettivo: Visualizzare **4-5 giocatori** contemporaneamente senza necessità di scroll immediato (attualmente se ne vedono solo 2).
  - Ridurre padding/margin o dimensione font delle card in questa sezione specifica.

### 🧭 Navigazione & UX

- [ ] **Pulsante Indietro "Browser-like"**:
  - Il tasto "Indietro" interno all'app deve rispettare la cronologia di navigazione reale.
  - Esempio: Se vengo dalla Home e vado su Setup, "Indietro" torna alla Home. Se vengo dalla Partita, torna alla Partita.
  - Evitare i percorsi forzati attuali (es. Game -> Edizioni -> Home).
- [ ] **Refactoring Testi e Posizioni**:
  - Rinominare sezione "La tua squadra" -> "**In gioco**".
  - Rinominare pulsante "Inizia" -> "**Gioca**".
  - Spostare il contatore giocatori (es. "3/6") DAL pulsante "Gioca" ALL'INTERNO dell'header della sezione "In gioco" (es. "**In gioco (3)**").

### ⚙️ Flusso Creazione Partita

- [ ] **Selezione Edizione**:
  - Nella schermata "Scegli Edizione":
    - **Click sulla Card**: Deve SELEZIONARE l'edizione e procedere allo step successivo (Scelta Giocatori).
    - **Modifica**: Aggiungere un pulsante esplicito (Matita/Edit) accanto ai tasti Elimina/Duplica per entrare nell'editor dell'edizione.
  - (Attualmente il click sulla card apre l'editor, interrompendo il flusso di gioco).

## ✅ Completati
