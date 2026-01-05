# Modello di Sicurezza - Cluedo Family Party

## Filosofia: Zero-Knowledge

L'applicazione è progettata secondo il principio **Zero-Knowledge**: né il server (Firebase) né gli amministratori del database possono leggere i dati di gioco.

## Implementazione Tecnica

### 1. Crittografia Client-Side (AES)

Tutta la logica di gioco risiede nel browser del client. Prima che qualsiasi dato venga inviato al server, viene cifrato utilizzando **AES-256** (tramite la libreria `crypto-js`).

- **Chiave**: La password inserita dall'utente in fase di creazione partita.
- **Payload**: L'intero oggetto di stato JSON (Giocatori, Griglia, Diario).

### 2. Password Effimera

La password della partita **NON viene mai salvata** su Firebase.
Esiste solo nella memoria volatile (React State) del client mentre l'utente sta giocando.
Se la pagina viene ricaricata, l'utente deve reinserire la password per decifrare nuovamente il blob scaricato da Firestore.

### 3. Firestore (Database)

Firestore agisce come un puro "blob store".
La collezione `sessions` contiene documenti con la seguente struttura:

```json
{
  "id": "auto-generated-id",
  "username": "Nome Partita (in chiaro per la Lobby)",
  "gameData": "U2FsdGVkX1+...", // Stringa cifrata incomprensibile
  "updatedAt": 1704294000000
}
```

### 4. Rischi Residui

- **Perdita Password**: Se la password viene dimenticata, la partita è **irrecuperabile**. Non esiste procedura di reset.
- **Accesso Fisico**: Se un attaccante ottiene accesso fisico al dispositivo sbloccato mentre il gioco è aperto, può vedere i dati.

## Autenticazione

Utilizziamo **Firebase Anonymous Auth** per limitare le scritture/letture solo agli utenti che hanno caricato l'applicazione dal nostro dominio autorizzato, prevenendo spam bot generici.
