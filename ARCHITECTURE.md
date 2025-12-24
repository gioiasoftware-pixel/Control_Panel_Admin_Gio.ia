# 🏛️ Gio.ia — ARCHITECTURE.md

## Visione

Il **Dev Control Panel Admin** è un'applicazione interna, separata dalla web app utente, pensata per controllo, onboarding e gestione avanzata del sistema Gio.ia.

**Separazione**: App dedicata solo per admin, non accessibile agli utenti finali.

## Stack Tecnologico

### Frontend
- **TypeScript**: Obbligatorio, strict mode
- **Framework**: A scelta team (React / Next.js / Vue / Svelte)
- **Styling**: CSS Modules / Tailwind / Styled Components
- **State Management**: Redux / Zustand / Context API (se React)
- **HTTP Client**: Axios / Fetch API
- **Routing**: React Router / Next Router / Vue Router

### Backend (Opzionale)
- **Opzione 1**: Backend integrato con Web App (`gioia-web-app/backend`)
- **Opzione 2**: Backend standalone FastAPI (se necessario)
- **Database**: PostgreSQL (condiviso con Processor/Web App)

## Architettura Sistema

```
┌─────────────────────┐
│  Control Panel      │
│  (Frontend SPA)     │
└──────────┬──────────┘
           │ HTTP/REST
           ▼
┌─────────────────────┐      ┌──────────────────┐
│  Web App Backend    │◄────►│   Processor      │
│  (FastAPI)          │      │   (FastAPI)      │
└──────────┬──────────┘      └────────┬─────────┘
           │                           │
           └───────────┬───────────────┘
                       ▼
              ┌─────────────────┐
              │   PostgreSQL     │
              │   (Database)     │
              └─────────────────┘
```

## Autenticazione

### Credenziali Admin
- **Email**: `gio.ia.software@gmail.com`
- **Password**: `Lagioiadilavorare2025`

### Flusso Autenticazione

1. **Login**: Admin inserisce email/password
2. **Backend**: Valida credenziali → Genera JWT token
3. **Frontend**: Salva token in localStorage/sessionStorage
4. **Request**: Invia token in header `Authorization: Bearer <token>`
5. **Refresh**: Token refresh automatico prima scadenza

### JWT Token Structure
```typescript
{
  sub: "admin_id",
  email: "gio.ia.software@gmail.com",
  role: "admin",
  exp: timestamp
}
```

## Routing

### Route Principali

```
/admin/login              # Login admin
/admin/dashboard          # Dashboard principale
/admin/users              # Lista utenti
/admin/users/:userId      # Dettaglio utente (spectator mode)
/admin/users/:userId/edit # Modifica utente
/admin/files              # Gestione file
/admin/settings           # Impostazioni sistema
```

### Route Nested (User Dashboard)

```
/admin/users/:userId  
  ├── /                    # Overview utente
  ├── /inventario          # Tab 1: INVENTARIO
  ├── /backup              # Tab 2: INVENTARIO backup
  ├── /log                 # Tab 3: LOG interazione
  ├── /consumi             # Tab 4: Consumi e rifornimenti
  └── /storico             # Tab 5: Storico vino
```

## Componenti UI

### Admin Dashboard

**Layout**:
```
┌─────────────────────────────────────────┐
│  Topbar: Logo Gio.ia + "Dev" + Logout  │
├──────────┬──────────────────────────────┤
│ Sidebar  │  Main Content                │
│ KPI:     │  ┌────────────────────────┐  │
│ - Utenti │  │  Card Utente 1         │  │
│ - Job    │  ├────────────────────────┤  │
│ - Errori │  │  Card Utente 2         │  │
│          │  ├────────────────────────┤  │
│          │  │  Card Utente 3         │  │
│          │  └────────────────────────┘  │
└──────────┴──────────────────────────────┘
```

**KPI Sidebar**:
- Utenti totali
- Job processing attivi
- Errori ultime 24h
- File upload ultimi 7 giorni

**Card Utente**:
- Business name
- Email
- Data creazione
- Stato onboarding
- Ultimo accesso
- Badge errori (se presenti)

### User Onboarding Form

**Campi**:
- Username (required, unique)
- Email (required, unique, validation)
- Password (required, min 8 char)
- Business name (required)
- Inventario iniziale (opzionale, file CSV/Excel)

**Validazione**:
- Email formato valido
- Password strength indicator
- Business name uniqueness check
- File validation (tipo, dimensione)

**Submit**:
1. Validazione frontend
2. Invio a Processor: `POST /process-inventory`
3. Processor crea utente + 5 tabelle database
4. Success → Redirect a user dashboard
5. Error → Mostra messaggio errore

### User Dashboard (Spectator Mode)

**Header**:
- Back button (torna admin dashboard)
- Toggle "Spectator Mode" (sempre visibile)
- Business name utente
- Badge "Viewing as: {username}"

**5 Tab Database** (regola fissa):

1. **INVENTARIO**
   - Tabella: `{user_id}/{business_name} INVENTARIO`
   - Colonne: name, winery, vintage, qty, price, type, etc.
   - Actions: Edit row, Delete row, Add row, Export CSV

2. **INVENTARIO backup**
   - Tabella: `{user_id}/{business_name} INVENTARIO backup`
   - Read-only (backup automatico)
   - Actions: View, Export CSV

3. **LOG interazione**
   - Tabella: `{user_id}/{business_name} LOG interazione`
   - Colonne: timestamp, action, details
   - Read-only (log bot)
   - Actions: Filter, Export CSV

4. **Consumi e rifornimenti**
   - Tabella: `{user_id}/{business_name} Consumi e rifornimenti`
   - Colonne: wine_id, movement_type, quantity, date
   - Actions: Edit, Delete, Add, Export CSV

5. **Storico vino**
   - Tabella: `{user_id}/{business_name} Storico vino`
   - Colonne: wine_id, event_type, details, timestamp
   - Read-only (storico automatico)
   - Actions: Filter, Export CSV

**Tab Navigation**:
- Tab pills orizzontali sopra tabella
- Active tab evidenziato
- Badge con count record (se applicabile)

**Tabelle Modificabili**:
- Inline editing (click cell → edit)
- Save/Cancel buttons per row
- Validation inline
- Optimistic updates
- Error handling con rollback

## Spectator Mode (Impersonation)

### Funzionalità
- **Impersonation completa**: Admin vede esattamente quello che vede utente
- **Read/Write**: Admin può modificare dati utente (con log)
- **Toggle**: Bottone sempre presente per uscire spectator mode

### Implementazione
```typescript
// State management
const [spectatorMode, setSpectatorMode] = useState(false);
const [spectatedUserId, setSpectatedUserId] = useState<number | null>(null);

// Toggle spectator
const enterSpectatorMode = (userId: number) => {
  setSpectatedUserId(userId);
  setSpectatorMode(true);
  // Redirect to user dashboard
};

const exitSpectatorMode = () => {
  setSpectatedUserId(null);
  setSpectatorMode(false);
  // Redirect to admin dashboard
};
```

### Logging
- Tutte le modifiche in spectator mode devono essere loggate
- Log entry: `{admin_id} modified {user_id} data at {timestamp}`

## Gestione File

### Upload
- **Tipi supportati**: PNG, JPG, PDF, CSV, XLSX, TXT
- **Dimensione max**: 10MB (configurabile)
- **Drag & Drop**: Supportato
- **Progress**: Barra progresso upload
- **Validation**: Tipo file, dimensione, virus scan (opzionale)

### Storage
- **Opzione 1**: PostgreSQL con colonna `BYTEA` (file piccoli)
- **Opzione 2**: PostgreSQL con riferimento a file system (path)
- **Opzione 3**: Storage esterno (S3, Cloud Storage)

### Download
- Lista file utente
- Download singolo file
- Download multiplo (ZIP)
- Preview file (immagini, PDF)

### Database Schema (File)
```sql
CREATE TABLE admin_files (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  file_data BYTEA,  -- o file_path VARCHAR(500)
  uploaded_by INTEGER REFERENCES users(id),  -- admin_id
  uploaded_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB  -- {description, tags, etc.}
);
```

## Integrazione Componenti Esistenti

### Processor Microservice

**Endpoint utilizzati**:

1. **Onboarding Utente**
   ```typescript
   POST /process-inventory
   Body: {
     telegram_id?: number,  // Opzionale se utente web
     business_name: string,
     file?: File,  // Inventario iniziale
     file_type?: "csv" | "excel"
   }
   Response: {
     job_id: string,
     user_id: number,
     tables_created: string[]  // 5 nomi tabelle
   }
   ```

2. **Snapshot Inventario**
   ```typescript
   GET /api/inventory/snapshot?user_id={id}
   Response: {
     total_wines: number,
     facets: {...},
     last_updated: timestamp
   }
   ```

3. **Status Job**
   ```typescript
   GET /status/{job_id}
   Response: {
     status: "pending" | "processing" | "completed" | "error",
     progress: {...}
   }
   ```

### Web App Backend

**Endpoint utilizzati** (se backend integrato):

1. **Lista Utenti**
   ```typescript
   GET /api/admin/users
   Query: { page, limit, search, filter }
   Response: {
     users: User[],
     total: number,
     page: number
   }
   ```

2. **Dettaglio Utente**
   ```typescript
   GET /api/admin/users/:id
   Response: {
     user: User,
     stats: {
       total_wines: number,
       last_activity: timestamp,
       processing_jobs: number
     }
   }
   ```

3. **Crea Utente**
   ```typescript
   POST /api/admin/users
   Body: {
     username: string,
     email: string,
     password: string,
     business_name: string
   }
   Response: {
     user_id: number,
     message: string
   }
   ```

4. **Modifica Utente**
   ```typescript
   PATCH /api/admin/users/:id
   Body: {
     email?: string,
     business_name?: string,
     password?: string
   }
   ```

5. **Query Database Utente**
   ```typescript
   GET /api/admin/users/:id/tables/:table_name
   Query: { page, limit, sort, filter }
   Response: {
     data: Record[],
     total: number
   }
   ```

6. **Update Row Database**
   ```typescript
   PATCH /api/admin/users/:id/tables/:table_name/:row_id
   Body: { ...fields }
   ```

### Database PostgreSQL

**Tabelle Condivise**:
- `users`: Utenti sistema
- `processing_jobs`: Job Processor
- `admin_notifications`: Notifiche admin (da Admin Bot)

**Tabelle Dinamiche Utente**:
- Pattern: `{user_id}/{business_name} {tipo}`
- Esempio: `123/Cantina Test INVENTARIO`
- Create automaticamente da Processor durante onboarding

**Query Esempio**:
```sql
-- Lista tabelle utente
SELECT tablename 
FROM pg_tables 
WHERE tablename LIKE '123/%';

-- Query inventario utente
SELECT * FROM "123/Cantina Test INVENTARIO" 
ORDER BY name 
LIMIT 100;
```

## TypeScript Types

### User Types
```typescript
interface User {
  id: number;
  telegram_id: number | null;
  username: string;
  email: string;
  business_name: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  total_wines: number;
  last_activity: string | null;
  processing_jobs: number;
  errors_count: number;
}
```

### Database Table Types
```typescript
interface InventoryRow {
  id?: number;
  name: string;
  winery: string;
  vintage: number | null;
  qty: number;
  price: number | null;
  type: string | null;
  // ... altri campi
}

interface ConsumptionRow {
  id?: number;
  wine_id: number;
  movement_type: "consumo" | "rifornimento";
  quantity: number;
  date: string;
}
```

### API Response Types
```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

## Sicurezza

### Frontend
- **XSS Prevention**: Sanitizzazione output, CSP headers
- **CSRF Protection**: Token CSRF per form
- **Input Validation**: Validazione client-side + server-side
- **Secure Storage**: Token in httpOnly cookies (preferibile) o localStorage

### Backend (se standalone)
- **CORS**: Configurato per dominio frontend
- **Rate Limiting**: Limite richieste per IP/admin
- **Input Validation**: Pydantic validation (se FastAPI)
- **SQL Injection**: SQLAlchemy parametri, no raw SQL
- **Authentication**: JWT validation su ogni request admin

### Permessi
- **Admin Only**: Tutte le route richiedono ruolo admin
- **Spectator Mode**: Log tutte le modifiche
- **File Access**: Controllo permessi file per utente

## Error Handling

### Frontend
```typescript
try {
  const response = await api.createUser(userData);
  // Success handling
} catch (error) {
  if (error.status === 400) {
    // Validation error
    showValidationErrors(error.errors);
  } else if (error.status === 401) {
    // Unauthorized → Redirect to login
    redirectToLogin();
  } else {
    // Generic error
    showErrorMessage(error.message);
  }
}
```

### Backend
- **Validation Errors**: 400 con dettagli errori
- **Authentication Errors**: 401
- **Authorization Errors**: 403
- **Not Found**: 404
- **Server Errors**: 500 con log dettagliato

## Testing

### Unit Tests
- Componenti UI isolati
- Utility functions
- API client mocks

### Integration Tests
- Flussi completi (login → dashboard → user detail)
- API integration con Processor/Web App
- Database queries

### E2E Tests
- Playwright / Cypress
- Scenari critici:
  - Login admin
  - Creazione utente
  - Spectator mode
  - Modifica dati utente

## Monitoring e Logging

### Logging
- **Frontend**: Console logs in dev, structured logs in prod
- **Backend**: JSON logs strutturati (come Processor)
- **Log Levels**: DEBUG, INFO, WARN, ERROR

### Monitoring
- **Error Tracking**: Sentry o simile
- **Performance**: Web Vitals, API response times
- **Analytics**: Admin actions tracking (opzionale)

## TODO POST-SVILUPPO

### Backend
- [ ] Setup PostgreSQL file server (se storage file separato)
- [ ] Security audit e permessi
- [ ] Backup automatico database
- [ ] Rate limiting avanzato
- [ ] API documentation (OpenAPI/Swagger)

### Processor Integration
- [ ] Creazione automatica 5 tab durante onboarding
- [ ] Onboarding completo con validazione
- [ ] Inventario iniziale processing
- [ ] Error handling robusto

### Web App Integration
- [ ] Collegamento backend Web App esistente
- [ ] Condivisione autenticazione JWT
- [ ] API endpoints admin in Web App backend
- [ ] Permessi admin/user separati

### Features Avanzate
- [ ] Export dati utente (backup completo)
- [ ] Import dati utente (migrazione)
- [ ] Bulk operations (modifica multipla utenti)
- [ ] Audit log completo (chi ha fatto cosa)
- [ ] Notifiche real-time (WebSocket)

### UI/UX
- [ ] Dark mode
- [ ] Responsive design (mobile admin)
- [ ] Keyboard shortcuts
- [ ] Drag & drop file migliorato
- [ ] Table virtualization per grandi dataset

### Performance
- [ ] Lazy loading tabelle utente
- [ ] Pagination efficiente
- [ ] Caching API responses
- [ ] Optimistic updates migliorati

---

**Versione**: 1.0.0  
**Data**: 2025-01-XX  
**Autore**: Gio.ia Development Team
