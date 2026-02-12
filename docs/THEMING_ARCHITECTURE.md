# Architettura Sistema Temi (Theming Engine)

## Obiettivo

Implementare un sistema di **Temi Modulare** che permetta di cambiare radicalmente l'aspetto dell'applicazione (da "Flat Minimal" a "Skeuomorphic Fantasy") senza riscrivere la logica dei componenti.

## Concetti Chiave

### 1. Astrazione tramite CSS Variables

Invece di hardcodare colori Tailwind (es. `bg-slate-800`), useremo variabili semantiche.

```css
:root {
  /* Default (Warm Dark) */
  --bg-app: #0f172a; /* Slate 950 */
  --bg-card: #1e293b; /* Slate 800 */
  --border-card: 1px solid #334155;
  --font-main: "Inter", sans-serif;
}

[data-theme="fantasy"] {
  /* Fantasy (Skeuomorphic) */
  --bg-app: url("/assets/themes/fantasy/leather_dark.jpg");
  --bg-card: url("/assets/themes/fantasy/parchment_bg.png");
  --border-card: none; /* Gestito via border-image */
  --font-main: "IM Fell English", serif;
}
```

### 2. Gestione Geometrie Complesse (9-Slice Scaling)

Per il tema _Fantasy_, le card hanno bordi strappati irregolari. Non possiamo usare una semplice immagine di sfondo perché si deformerebbe (stretch) al variare del contenuto.

**Soluzione: CSS `border-image` (9-Slice)**
Questa tecnica divide l'immagine in 9 regioni:

- **Angoli (Corners)**: Rimangono fissi.
- **Bordi (Edges)**: Si ripetono (repeat) o si allungano (stretch).
- **Centro**: Si riempie.

```css
.card-fantasy {
  border-width: 20px;
  border-image-source: url("/assets/themes/fantasy/parchment_border.png");
  border-image-slice: 30 fill; /* 30px slice, 'fill' riempie il centro */
  border-image-repeat: round; /* Ripete il pattern irregolare */
}
```

### 3. Struttura Cartelle (`src/themes/`)

Organizzeremo i temi in file CSS dedicati che vengono caricati dinamicamente o importati nel bundle principale.

```
src/
  themes/
    ├── base.css           # Variabili di struttura (spacing, z-index)
    ├── dark.css           # Tema Default (Warm Dark v4)
    ├── light.css          # Tema Chiaro (Opzionale)
    └── fantasy/           # Tema Harry Potter / Cluedo Classico
        ├── theme.css      # Override variabili
        └── assets/        # Texture specifiche (pelle, carta, macchie)
```

## Strategia Implementativa

### Fase 1: Refactoring Componenti Core

Modificare `Card`, `Button`, e `AppContainer` per usare le variabili CSS semantiche invece delle classi utility colore dirette.
_Esempio_: Sostituire `bg-slate-800` con `bg-[var(--bg-card)]` o una classe utility custom definita in Tailwind config.

### Fase 2: Theme Context

Creare un `ThemeContext.jsx` che:

1.  Legge la preferenza utente (localStorage).
2.  Applica l'attributo `data-theme="..."` al tag `<body>`.

### Fase 3: Integrazione Asset Raster/SVG

- **Cuciture**: Usare pesudo-elementi `::after` con `border: dashed` o svg ripetuti sui container principali.
- **Graffette (Paperclips)**: Componente React `<Paperclip />` che renderizza un SVG posizionato assolutamente (`top: -10px`).
- **Macchie Acquerello**: Div decorativi con `mix-blend-mode: multiply` per fondersi col la texture carta.

## Vantaggi

- **Manutenibilità**: Il codice React rimane pulito. La complessità grafica è delegata al CSS/Asset.
- **Scalabilità**: Aggiungere un tema "Sci-Fi" o "Noir" richiederà solo un nuovo file CSS e asset, zero modifiche JS.
