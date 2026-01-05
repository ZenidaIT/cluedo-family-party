---
description: Build and Deploy the Cluedo App to Firebase Hosting.
---

# Deploy to Production

Use this workflow to safely publish changes to the live URL.

// turbo

1. **Build the Application**
   Compiles React code into optimized HTML/CSS/JS in `dist/`.
   ```bash
   npm run build
   ```

// turbo 2. **Deploy to Firebase**
Uploads the `dist/` folder to the hosting CDN.

```bash
firebase deploy
```
