---
description: Regole fondamentali del progetto Cluedo Family Party per futuri agenti.
---

# Regole del Progetto

1.  **Fase 0: Leggere la Documentazione**

    - Prima di modificare qualsiasi codice, LEGGERE `docs/ARCHITECTURE.md`.
    - Comprendere che l'app usa **Client-Side Encryption**. Modificare la struttura dati senza considerare questo romperà i salvataggi esistenti.

2.  **Stack Tecnologico Vincolante**

    - React + Vite (Non create-react-app).
    - Tailwind CSS (Vanilla utility classes, niente librerie UI pesanti tranne SweetAlert2 per i popup).
    - Lucide React (Unico set di icone ammesso).

3.  **UX Guidelines**

    - **Premium Feel**: Colori vivaci, ombre (shadow-lg), bordi arrotondati (rounded-xl).
    - **Mobile First**: Tutto deve essere raggiungibile col pollice. Liste scrollabili, bottoni fissi in basso.
    - **No Alert/Confirm**: Usare ESCLUSIVAMENTE `SweetAlert2` (`Swal.fire`).

4.  **Sicurezza**

    - Mai salvare dati di gioco in chiaro su Firestore.
    - Mai rimuovere la logica AES in `Lobby.jsx` o `App.jsx`.

5.  **Workflow Aggiornamenti**
    - **Documentazione sempre aggiornata**: Dopo OGNI modifica al codice (funzionalità, UI, struttura), aggiornare i file in `docs/` per riflettere lo stato attuale.
    - Se si modifica la struttura dello stack tecnologico, aggiornare `docs/ARCHITECTURE.md`.
    - Testare sempre il build (`npm run build`) prima del deploy.
