# Script pour débloquer Git - Just1
# Exécutez ce script dans PowerShell

Write-Host "=== Nettoyage Git Just1 ===" -ForegroundColor Cyan

# Aller dans le dossier
Set-Location "D:\DB\Dropbox\Crypted\JustOne\justone-repo"

Write-Host "`n1. Sauvegarde des fichiers modifiés..." -ForegroundColor Yellow
git stash

Write-Host "`n2. Réinitialisation au dernier commit propre (origin/main)..." -ForegroundColor Yellow
git reset --hard origin/main

Write-Host "`n3. Récupération des fichiers..." -ForegroundColor Yellow
git stash pop

Write-Host "`n4. Vérification des fichiers..." -ForegroundColor Yellow
$openai = Get-Content "api\ai\openai.ts" -Raw
$deepl = Get-Content "api\translate\auto.ts" -Raw

if ($openai -match "process\.env\.OPENAI_API_KEY" -and $deepl -match "process\.env\.DEEPL_API_KEY") {
    Write-Host "✓ Les clés API sont bien dans les variables d'environnement" -ForegroundColor Green
} else {
    Write-Host "✗ ERREUR: Les clés API sont encore en dur dans le code!" -ForegroundColor Red
    exit 1
}

Write-Host "`n5. Ajout des fichiers..." -ForegroundColor Yellow
git add .

Write-Host "`n6. Commit propre..." -ForegroundColor Yellow
git commit -m "feat: intégration OpenAI et DeepL avec variables d'environnement"

Write-Host "`n7. Push vers GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n=== TERMINÉ ===" -ForegroundColor Green
Write-Host "Si le push fonctionne, vous pouvez continuer à coder normalement!" -ForegroundColor Green

