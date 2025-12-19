# 🚀 Setup Git e Push su GitHub

## Repository GitHub
**URL**: https://github.com/gioiasoftware-pixel/Control_Panel_Admin_Gio.ia

## 🐚 Usando Git Bash (Consigliato)

### Metodo 1: Script Automatico (Più Facile)

1. **Apri Git Bash** nella directory `Control-panel-admin`

2. **Rendi eseguibile lo script**:
   ```bash
   chmod +x git-push.sh
   ```

3. **Esegui lo script**:
   ```bash
   ./git-push.sh
   ```

Lo script guiderà attraverso tutti i passaggi automaticamente!

### Metodo 2: Comandi Manuali

1. **Apri Git Bash** nella directory `Control-panel-admin`

2. **Inizializza Repository**:
   ```bash
   git init
   git branch -M main
   ```

3. **Aggiungi Remote GitHub**:
   ```bash
   git remote add origin https://github.com/gioiasoftware-pixel/Control_Panel_Admin_Gio.ia.git
   ```

4. **Verifica Stato**:
   ```bash
   git status
   ```

5. **Aggiungi Tutti i File**:
   ```bash
   git add .
   ```

6. **Crea Primo Commit**:
   ```bash
   git commit -m "Initial commit: Control Panel Admin v1.0.0

- Setup completo progetto React + TypeScript + Vite
- Autenticazione admin con JWT
- Dashboard admin con KPI e lista utenti
- User onboarding con integrazione Processor
- User dashboard con 5 tab database (spectator mode)
- CRUD tabelle utente inline
- Gestione file (upload/download)
- Configurazione Railway per deploy
- Documentazione completa"
   ```

7. **Push su GitHub**:
   ```bash
   git push -u origin main
   ```

## 🔐 Autenticazione GitHub

Se GitHub richiede autenticazione:

### Opzione 1: Personal Access Token (Consigliato)
1. Vai su: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Genera nuovo token con permessi `repo` (full control)
3. Usa il token come password quando Git lo richiede

### Opzione 2: SSH Keys (Opzionale)
```bash
# Genera SSH key (se non ce l'hai già)
ssh-keygen -t ed25519 -C "tua-email@example.com"

# Aggiungi chiave a GitHub
# Poi cambia remote a SSH
git remote set-url origin git@github.com:gioiasoftware-pixel/Control_Panel_Admin_Gio.ia.git
git push -u origin main
```

## ✅ Verifica Push

Dopo il push, verifica su GitHub:
- Vai su https://github.com/gioiasoftware-pixel/Control_Panel_Admin_Gio.ia
- Dovresti vedere tutti i file del progetto

## 📋 Prossimi Passi Dopo Push

1. **Railway Setup** (tu):
   - Crea nuovo progetto Railway
   - Collega repository GitHub
   - Configura variabili ambiente (vedi `DEPLOY_TODO.md`)

2. **Integrazione Backend** (io):
   - Implemento endpoint admin nel backend Web App
   - Configuro autenticazione
   - Integro con Processor

## 🛠️ Comandi Utili Git

### Modificare l'ultimo commit:
```bash
git add .
git commit --amend --no-edit
git push -f origin main
```

### Aggiungere file dopo il primo commit:
```bash
git add .
git commit -m "Descrizione modifiche"
git push origin main
```

### Verifica stato repository:
```bash
git status
git log --oneline
```

### Verifica remote configurata:
```bash
git remote -v
```

---

**Nota**: Se hai problemi con l'autenticazione, usa sempre un **Personal Access Token** invece della password GitHub.
