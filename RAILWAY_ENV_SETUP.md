# 🔧 Configurazione Variabili Ambiente Railway - Control Panel Admin

## ⚠️ Problema Comune

Se vedi errori `net::ERR_CONNECTION_REFUSED` su `http://localhost:8000`, significa che le variabili ambiente non sono configurate correttamente su Railway.

## 📋 Variabili Ambiente Obbligatorie

Configura queste variabili nella dashboard Railway del tuo progetto **Control Panel Admin**:

### 1. URL Backend Web App (OBBLIGATORIO)

```
VITE_API_URL=https://tuo-web-app-backend.railway.app
```

**Dove trovare l'URL**:
1. Vai su Railway Dashboard
2. Seleziona il progetto **gioia-web-app**
3. Vai su **Settings** → **Domains** o **Deployments**
4. Copia l'URL del servizio (es: `https://gioia-web-app-production.up.railway.app`)

**Esempio**:
```
VITE_API_URL=https://gioia-web-app-production.up.railway.app
```

### 2. URL Processor (OBBLIGATORIO)

```
VITE_PROCESSOR_URL=https://tuo-processor.railway.app
```

**Dove trovare l'URL**:
1. Vai su Railway Dashboard
2. Seleziona il progetto **gioia-processor**
3. Copia l'URL del servizio

**Esempio**:
```
VITE_PROCESSOR_URL=https://gioia-processor-production.up.railway.app
```

## 📝 Variabili Opzionali

### Admin Credentials (Solo per sviluppo/test)

```
VITE_ADMIN_EMAIL=gio.ia.software@gmail.com
VITE_ADMIN_PASSWORD=Lagioiadilavorare2025
```

⚠️ **Nota**: In produzione, rimuovi queste variabili e usa solo autenticazione backend.

### Environment

```
VITE_NODE_ENV=production
```

## 🚀 Come Configurare su Railway

### Step 1: Accedi a Railway Dashboard

1. Vai su [railway.app](https://railway.app)
2. Accedi al tuo account
3. Seleziona il progetto **Control Panel Admin**

### Step 2: Aggiungi Variabili Ambiente

1. Clicca sul servizio **Control Panel Admin**
2. Vai su **Variables** (o **Settings** → **Variables**)
3. Clicca **"New Variable"** per ogni variabile
4. Inserisci:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://tuo-web-app-backend.railway.app`
5. Ripeti per `VITE_PROCESSOR_URL`
6. Clicca **"Add"** o **"Save"**

### Step 3: Redeploy

Dopo aver aggiunto le variabili ambiente:

1. Railway dovrebbe rilevare automaticamente le modifiche e fare un nuovo deploy
2. Oppure vai su **Deployments** → **"Redeploy"**
3. Attendi che il deploy completi (2-3 minuti)

### Step 4: Verifica

1. Apri il Control Panel Admin su Railway
2. Apri la console del browser (F12)
3. Verifica che non ci siano più errori `ERR_CONNECTION_REFUSED`
4. Le chiamate API dovrebbero andare all'URL corretto del backend Web App

## 🔍 Verifica Configurazione

### Controlla che le variabili siano caricate

Nel codice, le variabili vengono lette così:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
```

Se `VITE_API_URL` non è configurata, userà `localhost:8000` come fallback (che causa l'errore).

### Test Manuale

Puoi verificare che le variabili siano caricate correttamente aggiungendo temporaneamente questo nel codice:

```typescript
console.log('API_URL:', import.meta.env.VITE_API_URL)
console.log('PROCESSOR_URL:', import.meta.env.VITE_PROCESSOR_URL)
```

Dovresti vedere gli URL corretti nella console del browser.

## ⚠️ Note Importanti

1. **Prefisso VITE_**: Le variabili ambiente per Vite DEVONO iniziare con `VITE_` per essere esposte al frontend
2. **Rebuild Necessario**: Dopo aver aggiunto/modificato variabili ambiente, Railway deve fare un nuovo build
3. **Case Sensitive**: Le variabili ambiente sono case-sensitive, usa maiuscole esattamente come mostrato
4. **No Spazi**: Non aggiungere spazi prima o dopo i valori delle variabili

## 🐛 Troubleshooting

### Errore: `ERR_CONNECTION_REFUSED` su localhost:8000

**Causa**: `VITE_API_URL` non configurata o non caricata correttamente

**Soluzione**:
1. Verifica che `VITE_API_URL` sia configurata su Railway
2. Verifica che il valore sia corretto (URL completo del backend Web App)
3. Fai un redeploy dopo aver aggiunto la variabile
4. Verifica nei logs di Railway che la variabile sia presente durante il build

### Errore: CORS

**Causa**: Il backend Web App non permette richieste dal dominio del Control Panel

**Soluzione**:
1. Verifica che il backend Web App abbia CORS configurato per permettere il dominio del Control Panel
2. Il backend Web App dovrebbe avere `allow_origins=["*"]` o includere il dominio del Control Panel

### Le variabili non vengono caricate

**Causa**: Build cache o variabili non presenti durante il build

**Soluzione**:
1. Fai un redeploy completo (non solo restart)
2. Verifica che le variabili siano nella sezione corretta (Variables del servizio, non del progetto)
3. Controlla i build logs su Railway per vedere se le variabili sono presenti

---

**Data**: 2025-01-XX  
**Versione**: 1.0.0
