# 🛠️ Setup Locale - Control Panel Admin

Guida per configurare e avviare il progetto in locale.

## Prerequisiti

- **Node.js**: 18+ (consigliato 20+)
- **npm**: 9+ (o yarn/pnpm)
- **Git**: Per clonare il repository

## Installazione

### 1. Clona Repository

```bash
git clone https://github.com/TUO_USERNAME/control-panel-admin.git
cd control-panel-admin
```

### 2. Installa Dipendenze

```bash
npm install
```

### 3. Configura Variabili Ambiente

Crea file `.env` dalla `.env.example`:

```bash
cp .env.example .env
```

Modifica `.env` con i tuoi valori:

```env
# API URLs (per sviluppo locale)
VITE_PROCESSOR_URL=http://localhost:8001
VITE_WEB_APP_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000

# Admin Credentials (solo per sviluppo)
VITE_ADMIN_EMAIL=gio.ia.software@gmail.com
VITE_ADMIN_PASSWORD=Lagioiadilavorare2025

# JWT Secret (deve corrispondere al backend)
VITE_JWT_SECRET=your-secret-key-here

# Environment
VITE_NODE_ENV=development
```

### 4. Avvia Dev Server

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`

## Script Disponibili

- **`npm run dev`**: Avvia server di sviluppo con hot reload
- **`npm run build`**: Build produzione (output in `dist/`)
- **`npm run preview`**: Preview build produzione localmente
- **`npm run lint`**: Esegue ESLint
- **`npm run type-check`**: Verifica errori TypeScript

## Struttura Progetto

```
control-panel-admin/
├── src/
│   ├── components/      # Componenti React riutilizzabili
│   ├── pages/          # Pagine/route
│   ├── services/       # API clients
│   ├── store/          # State management (Zustand)
│   ├── types/          # TypeScript types
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── dist/               # Build output (generato)
└── package.json        # Dipendenze e script
```

## Sviluppo

### Aggiungere Nuova Pagina

1. Crea componente in `src/pages/`
2. Aggiungi route in `src/App.tsx`
3. Aggiungi link in `src/components/Sidebar.tsx` (se necessario)

### Aggiungere Nuovo Endpoint API

1. Aggiungi metodo in `src/services/api.ts`
2. Usa in componenti con `useQuery` o `useMutation` da `@tanstack/react-query`

### Modificare Stili

Il progetto usa **Tailwind CSS**. Modifica `tailwind.config.js` per personalizzare.

## Troubleshooting

### Porta 3000 già in uso

```bash
# Cambia porta in vite.config.ts
server: {
  port: 3001,  // o altra porta disponibile
}
```

### Errori TypeScript

```bash
npm run type-check
```

### Errori di Build

```bash
# Pulisci cache e ricostruisci
rm -rf node_modules dist
npm install
npm run build
```

### API non raggiungibile

Verifica che:
1. Backend Web App sia avviato su `http://localhost:8000`
2. Processor sia avviato su `http://localhost:8001`
3. Variabili ambiente `.env` siano corrette
4. CORS sia configurato nel backend

## Prossimi Passi

Dopo setup locale, vedi `DEPLOY_TODO.md` per:
- Deploy su Railway
- Integrazione con altri servizi
- Configurazione produzione
