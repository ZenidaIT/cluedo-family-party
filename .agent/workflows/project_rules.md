---
description: Regole fondamentali del progetto Cluedo Family Party per futuri agenti.
---

# Regole del Progetto

1.  **Fase 0: Leggere la Documentazione**
    - Prima di modificare codice, LEGGERE `docs/ARCHITECTURE.md`, `docs/USER_GUIDE.md` e `docs/TODO.md`.
    - La cartella `docs/` è l'unica fonte di verità.
    - **Lingua**: Tutta la documentazione, i commenti e le comunicazioni devono essere in **ITALIANO**.

2.  **Stack Tecnologico Vincolante**
    - **React + Vite**.
    - **Tailwind CSS** (Utility-first, design system coerente Slate/Indigo).
    - **Lucide React** (Unico set di icone).
    - **Table-based Layout**: Per la griglia di gioco (`Grid.jsx`) usare sempre `<table>` nativa.

3.  **Security First**
    - **Credenziali**: Mai committare chiavi API. Usare sempre `.env`.
    - **Git**: `.gitignore` deve escludere `.env.local` e `dist/`.
    - **Zero-Trust**: Non fidarsi del client, ma delegare la sicurezza a Firestore Rules (Server-side).

4.  **UX Guidelines**
    - **Mobile First**: L'interfaccia deve funzionare perfettamente su schermi stretti (scroll semplificato).
    - **No Alert/Confirm**: Usare ESCLUSIVAMENTE `SweetAlert2` (`Swal.fire`).
    - **Sticky Elements**: Usare `position: sticky` con saggezza (i contenitori `overflow` possono romperlo).

5.  **Workflow Aggiornamenti**
    - **Documentazione Viva**: Aggiornare `docs/TODO.md` e `docs/USER_GUIDE.md` parallelamente al codice.
    - **Deployment**: Eseguire sempre la build (`npm run build`) prima del deploy.
