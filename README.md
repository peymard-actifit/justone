# Just1 - Gestion de CV Professionnel

Application Vite + React + TypeScript pour la gestion de CV, déployée sur Vercel avec Redis KV.

## 🚀 Déploiement

### Le projet est déjà connecté à :
- **GitHub** : github.com/peymard-actifit/justone
- **Vercel** : justone-one.vercel.app

### Pour mettre à jour le code :

1. Copiez tout le contenu du dossier `Just1` dans votre repo local `justone`
2. Commitez et poussez :

```bash
cd chemin/vers/justone
git add .
git commit -m "feat: ajout application CV complète"
git push
```

Vercel déploiera automatiquement !

### Connecter la base Redis "Just1" :

1. Sur Vercel → votre projet `justone` → **Storage**
2. Cliquez sur votre base **Just1**
3. **Connect to Project** → sélectionnez `justone`
4. Les variables `KV_URL`, `KV_REST_API_URL`, etc. seront configurées automatiquement

## 💻 Développement local

```bash
npm install
npm run dev
```

Pour les API, créez `.env.local` avec les variables de Vercel KV.

## 📁 Structure

```
justone/
├── api/                    # Serverless Functions
│   ├── auth/
│   │   ├── login.ts
│   │   └── register.ts
│   └── cv/
│       ├── index.ts       # GET/POST /api/cv
│       └── [id].ts        # GET/PUT/DELETE /api/cv/:id
├── src/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   └── EditCV.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── vercel.json
```

## ✨ Fonctionnalités

- ✅ Authentification (inscription/connexion)
- ✅ Création et édition de CV
- ✅ Sauvegarde dans Vercel KV (Redis)
- ✅ Interface moderne avec Tailwind CSS
- ✅ Multi-langues
