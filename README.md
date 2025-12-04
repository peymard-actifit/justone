# Just1 - Gestion de Production de CVs

Application complète de gestion de CVs avec base de données flexible, multi-langues, et intégration IA.

## 🎯 Fonctionnalités Principales

### Base de Données Flexible
- **Champs personnalisables** : Ajoutez vos propres champs de données (texte, nombre, image, vidéo, etc.)
- **Multi-langues** : Chaque champ peut avoir des traductions dans plusieurs langues
- **Tags** : Système de tags pour mapper les données aux formats de CV
- **Versions IA** : Jusqu'à 3 versions générées par IA par champ

### Mode Administrateur
- Code d'accès : `12411241`
- Accès aux paramètres avancés : tags, langues, formats de CV
- Gestion complète des métadonnées

### Import de Fichiers
- Formats supportés : PDF, Word, LaTeX, Excel, PowerPoint
- Analyse automatique par OpenAI
- Extraction et structuration des données

### Formats de CV
- Templates avec mapping tags ↔ données
- Filtres par pays, destinataire, catégorie
- Validation et personnalisation du mapping
- Création de champs à la volée si nécessaire

### Modules IA
- **JustWeb** : Création de site web personnel
- **JustBoost** : Conseils pour améliorer votre profil
- **JustPush** : Partage sur réseaux sociaux
- **JustFind** : Recherche d'offres et projets
- **JobDone** : Certifications employeurs
- **JustRPA** : Remplissage automatisé de formulaires

## 🚀 Déploiement

Le projet est connecté à :
- **GitHub** : github.com/peymard-actifit/justone
- **Vercel** : justone-one.vercel.app
- **Redis KV** : Base "just1" connectée

## ⚙️ Configuration Variables d'Environnement Vercel

**Important** : Configurez ces variables sur Vercel (Settings → Environment Variables) :

- `OPENAI_API_KEY` : Votre clé API OpenAI
- `DEEPL_API_KEY` : Votre clé API DeepL

Les variables sont automatiquement disponibles dans les Serverless Functions.

## 💻 Développement

```bash
npm install
npm run dev
```

Pour le développement local, créez un fichier `.env.local` avec vos clés API.

## 📁 Structure

```
justone/
├── api/                    # Serverless Functions
│   ├── ai/                # Fonctionnalités OpenAI
│   │   ├── openai.ts
│   │   ├── analyze-file.ts
│   │   ├── adapt-to-offer.ts
│   │   ├── improve-content.ts
│   │   └── find-jobs.ts
│   ├── translate/         # Traductions DeepL
│   ├── profile/           # Gestion du profil utilisateur
│   ├── formats/           # Formats de CV
│   ├── export/            # Export des données
│   └── admin/             # Mode administrateur
├── src/
│   ├── components/
│   │   ├── DataEditor.tsx     # Éditeur de données flexible
│   │   ├── AdminGate.tsx      # Porte d'accès admin
│   │   ├── NavigationBar.tsx  # Navigation avec modules
│   │   └── TranslateButton.tsx # Bouton de traduction
│   ├── pages/
│   │   ├── Home.tsx           # Page d'accueil épurée
│   │   ├── Dashboard.tsx      # Dashboard principal
│   │   ├── AIPage.tsx         # Interface IA
│   │   └── FormatsPage.tsx    # Gestion des formats
│   └── types/
│       ├── database.ts        # Types base de données
│       └── user.ts            # Types utilisateur
└── package.json
```

## ✨ Fonctionnalités

- ✅ Authentification (inscription/connexion)
- ✅ Base de données flexible avec tags
- ✅ Traductions automatiques (DeepL)
- ✅ Analyse de fichiers CV (OpenAI)
- ✅ Adaptation de CV à des offres
- ✅ Amélioration de contenu avec IA
- ✅ Recherche d'offres d'emploi
- ✅ Export des données brutes
- ✅ Interface moderne avec Tailwind CSS
- ✅ Multi-langues

## 🔐 Sécurité

- Authentification par mot de passe (bcrypt)
- Mode administrateur protégé par code
- Données utilisateur isolées par userId
- Clés API dans variables d'environnement (jamais dans le code)
