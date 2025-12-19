# 📋 TODO List - Deploy e Integrazione Control Panel Admin

## 🚀 TODO PER TE (GitHub/Railway)

### 1. Setup Repository GitHub

- [ ] **Crea repository GitHub** (se non esiste già)
  - Nome: `control-panel-admin` o `gioia-control-panel-admin`
  - Visibilità: Private (consigliato) o Public
  - Aggiungi README.md e .gitignore (già presenti)

- [ ] **Push codice su GitHub**
  ```bash
  git init
  git add .
  git commit -m "Initial commit: Control Panel Admin v1.0.0"
  git branch -M main
  git remote add origin https://github.com/TUO_USERNAME/control-panel-admin.git
  git push -u origin main
  ```

### 2. Setup Railway

- [ ] **Crea nuovo progetto su Railway**
  - Vai su [railway.app](https://railway.app)
  - Clicca "New Project"
  - Seleziona "Deploy from GitHub repo"
  - Seleziona il repository `control-panel-admin`

- [ ] **Configura Build Settings**
  - Railway dovrebbe rilevare automaticamente Node.js
  - Verifica che il **Root Directory** sia impostato correttamente
  - Build Command: `npm run build` (già configurato in `railway.json`)
  - Start Command: `npm run preview` (già configurato)

### 3. Variabili Ambiente Railway

Configura le seguenti variabili ambiente nella dashboard Railway:

- [ ] **API URLs** (obbligatorie)
  ```
  VITE_PROCESSOR_URL=https://tuo-processor.railway.app
  VITE_WEB_APP_URL=https://tua-web-app.railway.app
  VITE_API_URL=https://tua-web-app.railway.app
  ```

- [ ] **JWT Secret** (obbligatorio, deve corrispondere al backend)
  ```
  VITE_JWT_SECRET=your-secret-key-here-change-in-production
  ```

- [ ] **Environment**
  ```
  VITE_NODE_ENV=production
  ```

- [ ] **Admin Credentials** (opzionali, solo per sviluppo)
  ```
  VITE_ADMIN_EMAIL=gio.ia.software@gmail.com
  VITE_ADMIN_PASSWORD=Lagioiadilavorare2025
  ```
  ⚠️ **Nota**: In produzione, rimuovi queste variabili e usa solo autenticazione backend

### 4. Verifica Deploy

- [ ] **Controlla build logs** su Railway
  - Dovrebbe completare senza errori
  - Verifica che `npm run build` sia completato

- [ ] **Testa applicazione**
  - Apri URL Railway fornito
  - Verifica che la pagina di login appaia
  - Testa login con credenziali admin

- [ ] **Configura dominio personalizzato** (opzionale)
  - Nella dashboard Railway → Settings → Domains
  - Aggiungi dominio personalizzato (es: `admin.gioia.app`)

### 5. Monitoraggio

- [ ] **Configura notifiche Railway** (opzionale)
  - Settings → Notifications
  - Aggiungi email per alert deploy/errori

---

## 🔗 TODO PER ME (Integrazione Directory)

### 1. Backend Web App - Endpoint Admin

Devo aggiungere i seguenti endpoint nel backend di `gioia-web-app`:

- [ ] **`GET /api/admin/users`** - Lista utenti con paginazione
  ```python
  # File: gioia-web-app/backend/app/api/admin.py (da creare)
  # Query params: page, limit, search
  # Response: { data: User[], total: int, page: int, limit: int }
  ```

- [ ] **`GET /api/admin/users/:id`** - Dettaglio utente con stats
  ```python
  # Response: { user: User, stats: { total_wines, last_activity, processing_jobs, errors_count } }
  ```

- [ ] **`POST /api/admin/users`** - Crea utente (se necessario, altrimenti usa Processor)
  ```python
  # Body: { username, email, password, business_name }
  # Response: { user_id: int, message: str }
  ```

- [ ] **`PATCH /api/admin/users/:id`** - Modifica utente
  ```python
  # Body: { email?, business_name?, password? }
  # Response: User
  ```

- [ ] **`GET /api/admin/dashboard/kpi`** - KPI dashboard
  ```python
  # Response: { total_users, active_jobs, errors_24h, files_uploaded_7d }
  ```

- [ ] **`GET /api/admin/users/:id/tables/:table_name`** - Query tabella utente
  ```python
  # Query params: page, limit, sort
  # Response: { data: Record[], total: int, page: int, limit: int }
  ```

- [ ] **`PATCH /api/admin/users/:id/tables/:table_name/:row_id`** - Update riga
  ```python
  # Body: { ...fields }
  # Response: Record
  ```

- [ ] **`DELETE /api/admin/users/:id/tables/:table_name/:row_id`** - Delete riga
  ```python
  # Response: 204 No Content
  ```

- [ ] **`POST /api/admin/users/:id/tables/:table_name`** - Crea riga
  ```python
  # Body: { ...fields }
  # Response: Record
  ```

- [ ] **`GET /api/admin/files`** - Lista file
  ```python
  # Query params: user_id?
  # Response: AdminFile[]
  ```

- [ ] **`POST /api/admin/files/upload`** - Upload file
  ```python
  # Form data: file, user_id
  # Response: AdminFile
  ```

- [ ] **`GET /api/admin/files/:id/download`** - Download file
  ```python
  # Response: File blob
  ```

- [ ] **`DELETE /api/admin/files/:id`** - Elimina file
  ```python
  # Response: 204 No Content
  ```

### 2. Autenticazione Admin

- [ ] **Modificare `POST /api/auth/login`** per supportare admin
  ```python
  # File: gioia-web-app/backend/app/api/auth.py
  # Verifica se email è admin (gio.ia.software@gmail.com)
  # Genera JWT token con ruolo "admin"
  # Token deve essere compatibile con quello che si aspetta il frontend
  ```

- [ ] **Middleware autenticazione admin**
  ```python
  # File: gioia-web-app/backend/app/core/auth.py
  # Decorator @require_admin per proteggere route admin
  # Verifica JWT token e ruolo admin
  ```

### 3. Database Schema - Tabelle File

- [ ] **Creare tabella `admin_files`**
  ```sql
  -- File: gioia-web-app/backend/migrations/003_create_admin_files.sql
  CREATE TABLE admin_files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    file_data BYTEA,  -- o file_path VARCHAR(500) se storage esterno
    uploaded_by INTEGER REFERENCES users(id),  -- admin_id
    uploaded_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB
  );
  
  CREATE INDEX idx_admin_files_user_id ON admin_files(user_id);
  CREATE INDEX idx_admin_files_uploaded_at ON admin_files(uploaded_at);
  ```

### 4. Integrazione Processor

- [ ] **Verificare endpoint Processor per onboarding**
  - `POST /process-inventory` deve accettare utenti senza telegram_id
  - Deve creare le 5 tabelle standard automaticamente
  - Deve restituire `user_id` e `tables_created`

- [ ] **Aggiungere supporto user_id in Processor**
  - Modificare `ensure_user_tables()` per accettare `user_id` invece di solo `telegram_id`
  - Aggiornare endpoint per supportare onboarding da web app

### 5. Query Database Utente

- [ ] **Helper function per query tabelle dinamiche**
  ```python
  # File: gioia-web-app/backend/app/core/database.py
  # Funzione per costruire nome tabella: f"{user_id}/{business_name} {table_type}"
  # Funzione per query sicura con parametri
  # Validazione nome tabella per prevenire SQL injection
  ```

- [ ] **Supporto per tutte le 5 tabelle**
  - INVENTARIO (editable)
  - INVENTARIO backup (read-only)
  - LOG interazione (read-only)
  - Consumi e rifornimenti (editable)
  - Storico vino (read-only)

### 6. CORS e Security

- [ ] **Configurare CORS** nel backend Web App
  ```python
  # File: gioia-web-app/backend/app/main.py
  # Aggiungere dominio Control Panel Admin ai CORS allowed origins
  # Es: origins = ["https://tuo-control-panel.railway.app"]
  ```

- [ ] **Rate Limiting** per endpoint admin
  ```python
  # Limitare richieste admin per prevenire abuse
  # Es: 100 richieste/minuto per IP admin
  ```

### 7. Testing Integrazione

- [ ] **Test end-to-end**
  - Login admin dal Control Panel
  - Creazione utente via onboarding
  - Visualizzazione tabelle utente
  - Modifica dati tabelle
  - Upload/download file

- [ ] **Test error handling**
  - Utente non trovato
  - Tabella non esistente
  - Permessi insufficienti
  - Errori Processor

### 8. Documentazione

- [ ] **Aggiornare README Web App** con endpoint admin
- [ ] **Creare documentazione API** per endpoint admin
- [ ] **Aggiornare ARCHITECTURE.md** con integrazione Control Panel

---

## 📝 Note Importanti

### Sicurezza

1. **JWT Secret**: Deve essere lo stesso tra Control Panel e Web App backend
2. **Admin Email**: Verificare che solo `gio.ia.software@gmail.com` possa fare login admin
3. **CORS**: Configurare solo domini autorizzati
4. **Rate Limiting**: Implementare per prevenire abuse

### Database

1. **Tabelle Dinamiche**: Le tabelle utente seguono il pattern `{user_id}/{business_name} {tipo}`
2. **Query Sicure**: Usare sempre parametri SQLAlchemy, mai string interpolation
3. **Validazione**: Validare nome tabella prima di eseguire query

### Processor Integration

1. **Onboarding**: Processor deve creare automaticamente le 5 tabelle
2. **User ID**: Processor deve supportare `user_id` oltre a `telegram_id`
3. **Error Handling**: Gestire errori Processor gracefully

### Deploy

1. **Build**: Verificare che build completi senza errori
2. **Environment Variables**: Tutte le variabili devono essere configurate
3. **Monitoring**: Monitorare errori e performance dopo deploy

---

## ✅ Checklist Finale

Prima di considerare completata l'integrazione:

- [ ] Control Panel deployato su Railway e accessibile
- [ ] Tutti gli endpoint admin implementati nel backend Web App
- [ ] Autenticazione admin funzionante
- [ ] Onboarding utente funziona end-to-end
- [ ] Visualizzazione e modifica tabelle utente funzionante
- [ ] Upload/download file funzionante
- [ ] Error handling robusto
- [ ] CORS e security configurati
- [ ] Test end-to-end completati
- [ ] Documentazione aggiornata

---

**Data Creazione**: 2025-01-XX  
**Versione**: 1.0.0
