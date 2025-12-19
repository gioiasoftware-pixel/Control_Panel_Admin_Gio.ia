# 🛠️ Gio.ia — Dev Control Panel Admin

## 📋 Panoramica

**Control Panel Admin** è un'applicazione interna per amministratori di Gio.ia, separata dalla web app utente, pensata per controllo, onboarding e gestione avanzata del sistema.

**Versione**: 1.0.0 (In sviluppo)  
**Stack**: TypeScript-first, Framework a scelta (React/Next/Vue)  
**Architettura**: Frontend SPA + Backend API (opzionale) o integrato con Web App backend

## 🚀 Funzionalità Principali

### **Autenticazione Admin**
- Login con email/password
- Credenziali iniziali: `gio.ia.software@gmail.com` / `Lagioiadilavorare2025`
- Session management e JWT tokens

### **Admin Dashboard**
- Topbar con logo Gio.ia + badge "Dev"
- Sidebar con KPI sistema (utenti totali, job processing, errori recenti)
- Griglia card utenti (cliccabili per dettaglio)
- Filtri e ricerca utenti

### **User Onboarding**
Form completo per creazione nuovo utente:
- Username
- Email
- Password
- Business name
- Inventario iniziale (opzionale, file CSV/Excel)

**Integrazione**: Invio dati a Processor microservice per creazione automatica 5 tabelle database

### **User Dashboard (Spectator Mode)**
- Header con back button + toggle spectator mode
- **5 Tab Database Standard** (regola fissa):
  1. `{user_id}/{business_name} INVENTARIO` - Inventario vini principale
  2. `{user_id}/{business_name} INVENTARIO backup` - Backup inventario
  3. `{user_id}/{business_name} LOG interazione` - Log interazioni bot
  4. `{user_id}/{business_name} Consumi e rifornimenti` - Movimenti inventario
  5. `{user_id}/{business_name} Storico vino` - Storico vini
- Tabelle modificabili inline (CRUD completo)
- Visualizzazione dati in tempo reale

### **Gestione File**
- Upload file: PNG/JPG, PDF, CSV/Excel, TXT
- Download file utente
- Storage: PostgreSQL dedicato (server separato) o integrato con sistema esistente

### **Modifica Dati Utente**
- Edit profilo utente
- Reset password
- Modifica business name
- Gestione permessi

## 🏗️ Architettura

Vedi `ARCHITECTURE.md` per dettagli tecnici completi.

### Struttura Progetto (Suggerita)

```
control-panel-admin/
├── src/                      # Source code
│   ├── components/          # Componenti UI riutilizzabili
│   ├── pages/              # Pagine/route
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── UserDetail.tsx
│   │   └── FileManager.tsx
│   ├── services/           # API clients
│   │   ├── api.ts         # Client Processor/Web App
│   │   └── auth.ts        # Auth service
│   ├── hooks/             # React hooks (se React)
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
│
├── public/                 # Static assets
├── docs/                  # Documentazione aggiuntiva
├── tests/                 # Test suite
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Setup Sviluppo

### Prerequisiti
- Node.js 18+
- npm/yarn/pnpm
- TypeScript 5+
- (Opzionale) Backend integrato con Web App

### Installazione

```bash
# Installa dipendenze
npm install

# Setup variabili ambiente
cp .env.example .env
# Configurare .env con:
# - PROCESSOR_URL (URL Processor microservice)
# - WEB_APP_URL (URL Web App backend)
# - DATABASE_URL (PostgreSQL connection)
# - JWT_SECRET (per autenticazione)

# Avvia dev server
npm run dev
```

### Build Produzione

```bash
# Build
npm run build

# Preview build
npm run preview
```

## 🔌 Integrazione Componenti Esistenti

### **Processor Microservice**
- **Endpoint**: `POST /process-inventory` - Creazione utente e onboarding
- **Endpoint**: `GET /api/inventory/snapshot` - Snapshot inventario utente
- **Autenticazione**: JWT token o API key

### **Web App Backend**
- **Endpoint**: `GET /api/admin/users` - Lista utenti
- **Endpoint**: `GET /api/admin/users/:id` - Dettaglio utente
- **Endpoint**: `POST /api/admin/users` - Crea utente
- **Autenticazione**: JWT token admin

### **Database PostgreSQL**
- **Tabelle condivise**: `users`, `processing_jobs`, `admin_notifications`
- **Tabelle dinamiche utente**: `{user_id}/{business_name} INVENTARIO`, etc.
- **Connection**: Usa stessa DATABASE_URL di Processor/Web App

## 📊 Database

### Tabelle Principali (Condivise)
- `users`: Utenti sistema (id, telegram_id, username, email, business_name, onboarding_completed)
- `processing_jobs`: Job elaborazione Processor
- `admin_notifications`: Notifiche admin (da Admin Bot)

### Tabelle Dinamiche Utente (5 Standard)
Ogni utente ha **SEMPRE** 5 tabelle create al momento onboarding:
1. `{user_id}/{business_name} INVENTARIO` - Inventario vini
2. `{user_id}/{business_name} INVENTARIO backup` - Backup
3. `{user_id}/{business_name} LOG interazione` - Log bot
4. `{user_id}/{business_name} Consumi e rifornimenti` - Movimenti
5. `{user_id}/{business_name} Storico vino` - Storico

**Nota**: Le tabelle sono create automaticamente da Processor durante onboarding.

## 🔐 Autenticazione

1. Admin fa login → Backend genera JWT token
2. Frontend salva token → Invia in header `Authorization: Bearer <token>`
3. Backend valida token → Processa richiesta
4. Token refresh automatico prima scadenza

## 🚀 Deploy

### Railway (Suggerito)

1. **Repository GitHub**: Push codice
2. **Railway Project**: New Project → Deploy from GitHub
3. **Variabili Ambiente**: Configurare in Railway dashboard
4. **Build Command**: `npm run build`
5. **Start Command**: `npm run start` (o framework-specific)

### Variabili Ambiente

**⚠️ IMPORTANTE**: Vedi `RAILWAY_ENV_SETUP.md` per istruzioni dettagliate su come configurare le variabili ambiente su Railway.

**Obbligatorie**:
- `VITE_API_URL`: URL backend Web App (es: `https://gioia-web-app-production.up.railway.app`)
- `VITE_PROCESSOR_URL`: URL Processor microservice (es: `https://gioia-processor-production.up.railway.app`)

**Opzionali**:
- `VITE_ADMIN_EMAIL`: Email admin (solo per sviluppo/test)
- `VITE_ADMIN_PASSWORD`: Password admin (solo per sviluppo/test)
- `VITE_NODE_ENV`: Environment (default: `production`)

**Opzionali**:
- `WEB_APP_URL`: URL Web App backend (se integrato)
- `PORT`: Porta server (default: 3000)
- `NODE_ENV`: `production` / `development`

## 📚 Documentazione

- **ARCHITECTURE.md**: Dettagli tecnici completi, routing, tipi, flussi
- **README.md**: Questo file (panoramica generale)

## 🔗 Link Utili

- **Processor**: `../gioia-processor/README.md`
- **Web App**: `../gioia-web-app/README.md`
- **Admin Bot**: `../Gioiadmin_bot/README.md`

## 📝 TODO

Vedi `ARCHITECTURE.md` sezione "TODO POST-SVILUPPO" per dettagli.

### Priorità Alta
- [ ] Setup progetto TypeScript + Framework
- [ ] Implementazione autenticazione admin
- [ ] Dashboard admin con KPI
- [ ] Integrazione Processor per onboarding
- [ ] User dashboard con 5 tab database
- [ ] Spectator mode (impersonation)

### Priorità Media
- [ ] Gestione file upload/download
- [ ] CRUD tabelle utente inline
- [ ] Modifica dati utente
- [ ] Integrazione Web App backend

### Priorità Bassa
- [ ] Monitoring e logging
- [ ] Test suite completa
- [ ] Documentazione API
- [ ] Backup automatico

---

**Versione**: 1.0.0  
**Data**: 2025-01-XX
