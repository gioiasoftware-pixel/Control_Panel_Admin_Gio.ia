#!/bin/bash

# Script Bash per push iniziale su GitHub
# Repository: https://github.com/gioiasoftware-pixel/Control_Panel_Admin_Gio.ia

echo "🚀 Setup Git e Push su GitHub"
echo ""

# Verifica se siamo nella directory corretta
if [ ! -f "package.json" ]; then
    echo "❌ Errore: package.json non trovato. Esegui lo script dalla directory Control-panel-admin"
    exit 1
fi

# Verifica se git è installato
if ! command -v git &> /dev/null; then
    echo "❌ Errore: Git non è installato o non è nel PATH"
    exit 1
fi

echo "✓ Git trovato"

# Inizializza repository se non esiste
if [ ! -d ".git" ]; then
    echo "📦 Inizializzazione repository Git..."
    git init
    git branch -M main
    echo "✓ Repository inizializzato"
else
    echo "✓ Repository Git già esistente"
fi

# Aggiungi remote se non esiste
REMOTE_URL="https://github.com/gioiasoftware-pixel/Control_Panel_Admin_Gio.ia.git"
EXISTING_REMOTE=$(git remote get-url origin 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "🔗 Aggiunta remote GitHub..."
    git remote add origin "$REMOTE_URL"
    echo "✓ Remote aggiunta"
else
    if [ "$EXISTING_REMOTE" != "$REMOTE_URL" ]; then
        echo "🔄 Aggiornamento remote URL..."
        git remote set-url origin "$REMOTE_URL"
        echo "✓ Remote aggiornata"
    else
        echo "✓ Remote già configurata correttamente"
    fi
fi

# Mostra stato
echo ""
echo "📊 Stato repository:"
git status

echo ""
read -p "Vuoi procedere con l'aggiunta di tutti i file e il commit? (S/n) " confirm
if [[ ! "$confirm" =~ ^[SsYy]$ ]] && [[ -n "$confirm" ]]; then
    echo "❌ Operazione annullata"
    exit 0
fi

# Aggiungi tutti i file
echo ""
echo "📝 Aggiunta file..."
git add .

# Crea commit
echo "💾 Creazione commit..."
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

if [ $? -eq 0 ]; then
    echo "✓ Commit creato con successo"
else
    echo "❌ Errore durante la creazione del commit"
    exit 1
fi

# Push su GitHub
echo ""
echo "🚀 Push su GitHub..."
echo "⚠️  Se richiesto, inserisci le tue credenziali GitHub"
echo "   (usa Personal Access Token invece della password)"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Push completato con successo!"
    echo ""
    echo "🔗 Repository: https://github.com/gioiasoftware-pixel/Control_Panel_Admin_Gio.ia"
    echo ""
    echo "📋 Prossimi passi:"
    echo "   1. Vai su Railway e crea nuovo progetto"
    echo "   2. Collega repository GitHub"
    echo "   3. Configura variabili ambiente (vedi DEPLOY_TODO.md)"
else
    echo ""
    echo "❌ Errore durante il push"
    echo ""
    echo "Possibili cause:"
    echo "   - Credenziali GitHub non valide"
    echo "   - Repository non esiste o non hai i permessi"
    echo "   - Problemi di connessione"
    echo ""
    echo "Suggerimenti:"
    echo "   - Usa Personal Access Token invece della password"
    echo "   - Verifica che il repository esista su GitHub"
    echo "   - Prova manualmente: git push -u origin main"
fi
