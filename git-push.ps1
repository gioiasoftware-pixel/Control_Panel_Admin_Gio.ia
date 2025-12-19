# Script PowerShell per push iniziale su GitHub
# Repository: https://github.com/gioiasoftware-pixel/Control_Panel_Admin_Gio.ia

Write-Host "🚀 Setup Git e Push su GitHub" -ForegroundColor Cyan
Write-Host ""

# Verifica se siamo nella directory corretta
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Errore: package.json non trovato. Esegui lo script dalla directory Control-panel-admin" -ForegroundColor Red
    exit 1
}

# Verifica se git è installato
try {
    git --version | Out-Null
} catch {
    Write-Host "❌ Errore: Git non è installato o non è nel PATH" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Git trovato" -ForegroundColor Green

# Inizializza repository se non esiste
if (-not (Test-Path ".git")) {
    Write-Host "📦 Inizializzazione repository Git..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✓ Repository inizializzato" -ForegroundColor Green
} else {
    Write-Host "✓ Repository Git già esistente" -ForegroundColor Green
}

# Aggiungi remote se non esiste
$remoteUrl = "https://github.com/gioiasoftware-pixel/Control_Panel_Admin_Gio.ia.git"
$existingRemote = git remote get-url origin 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "🔗 Aggiunta remote GitHub..." -ForegroundColor Yellow
    git remote add origin $remoteUrl
    Write-Host "✓ Remote aggiunta" -ForegroundColor Green
} else {
    if ($existingRemote -ne $remoteUrl) {
        Write-Host "🔄 Aggiornamento remote URL..." -ForegroundColor Yellow
        git remote set-url origin $remoteUrl
        Write-Host "✓ Remote aggiornata" -ForegroundColor Green
    } else {
        Write-Host "✓ Remote già configurata correttamente" -ForegroundColor Green
    }
}

# Mostra stato
Write-Host ""
Write-Host "📊 Stato repository:" -ForegroundColor Cyan
git status

Write-Host ""
$confirm = Read-Host "Vuoi procedere con l'aggiunta di tutti i file e il commit? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s" -and $confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "❌ Operazione annullata" -ForegroundColor Red
    exit 0
}

# Aggiungi tutti i file
Write-Host ""
Write-Host "📝 Aggiunta file..." -ForegroundColor Yellow
git add .

# Crea commit
Write-Host "💾 Creazione commit..." -ForegroundColor Yellow
$commitMessage = @"
Initial commit: Control Panel Admin v1.0.0

- Setup completo progetto React + TypeScript + Vite
- Autenticazione admin con JWT
- Dashboard admin con KPI e lista utenti
- User onboarding con integrazione Processor
- User dashboard con 5 tab database (spectator mode)
- CRUD tabelle utente inline
- Gestione file (upload/download)
- Configurazione Railway per deploy
- Documentazione completa
"@

git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Commit creato con successo" -ForegroundColor Green
} else {
    Write-Host "❌ Errore durante la creazione del commit" -ForegroundColor Red
    exit 1
}

# Push su GitHub
Write-Host ""
Write-Host "🚀 Push su GitHub..." -ForegroundColor Yellow
Write-Host "⚠️  Se richiesto, inserisci le tue credenziali GitHub" -ForegroundColor Yellow
Write-Host "   (usa Personal Access Token invece della password)" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Push completato con successo!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 Repository: https://github.com/gioiasoftware-pixel/Control_Panel_Admin_Gio.ia" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Prossimi passi:" -ForegroundColor Yellow
    Write-Host "   1. Vai su Railway e crea nuovo progetto" -ForegroundColor White
    Write-Host "   2. Collega repository GitHub" -ForegroundColor White
    Write-Host "   3. Configura variabili ambiente (vedi DEPLOY_TODO.md)" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Errore durante il push" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possibili cause:" -ForegroundColor Yellow
    Write-Host "   - Credenziali GitHub non valide" -ForegroundColor White
    Write-Host "   - Repository non esiste o non hai i permessi" -ForegroundColor White
    Write-Host "   - Problemi di connessione" -ForegroundColor White
    Write-Host ""
    Write-Host "Suggerimenti:" -ForegroundColor Yellow
    Write-Host "   - Usa Personal Access Token invece della password" -ForegroundColor White
    Write-Host "   - Verifica che il repository esista su GitHub" -ForegroundColor White
    Write-Host "   - Prova manualmente: git push -u origin main" -ForegroundColor White
}
