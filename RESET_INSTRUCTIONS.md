# Instructions pour débloquer Git

## Le problème
Les commits locaux contiennent des clés API que GitHub refuse. Ces commits ne sont pas encore sur GitHub.

## Solution : Réinitialiser proprement

**Dans un nouveau terminal PowerShell** (pas celui de Cursor) :

```powershell
cd D:\DB\Dropbox\Crypted\JustOne\justone-repo

# Sauvegarder tous les fichiers modifiés
git stash

# Réinitialiser au dernier commit poussé avec succès (2212d0b)
git reset --hard origin/main

# Récupérer les fichiers
git stash pop

# Vérifier que les clés API sont bien dans process.env (pas en dur)
# Les fichiers api/ai/openai.ts et api/translate/auto.ts doivent avoir :
# const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''
# const DEEPL_API_KEY = process.env.DEEPL_API_KEY || ''

# Commiter proprement
git add .
git commit -m "feat: intégration OpenAI et DeepL avec variables d'environnement"

# Pousser
git push origin main
```

## Si ça bloque encore

Créez un nouveau repo GitHub et poussez-y le code propre.

