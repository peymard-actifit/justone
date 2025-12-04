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
- Analyse automatique par IA
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

## 💻 Développement

```bash
npm install
npm run dev
```

## 📁 Structure

```
justone/
├── api/                    # Serverless Functions
│   ├── profile/           # Gestion du profil utilisateur
│   ├── import/            # Import et analyse de fichiers
│   ├── formats/           # Formats de CV
│   ├── export/            # Export des données
│   └── admin/             # Mode administrateur
├── src/
│   ├── components/
│   │   ├── DataEditor.tsx     # Éditeur de données flexible
│   │   ├── AdminGate.tsx      # Porte d'accès admin
│   │   └── NavigationBar.tsx  # Navigation avec modules
│   ├── pages/
│   │   ├── Home.tsx           # Page d'accueil épurée
│   │   ├── Dashboard.tsx      # Dashboard principal
│   │   ├── AIPage.tsx         # Interface IA
│   │   └── FormatsPage.tsx    # Gestion des formats
│   ├── types/
│   │   ├── database.ts        # Types base de données
│   │   └── user.ts            # Types utilisateur
│   └── App.tsx
└── package.json
```

## 🔧 Configuration API IA

Pour activer les fonctionnalités IA, configurez votre API dans les variables d'environnement Vercel :

```
AI_API_KEY=votre_cle_api
AI_API_URL=https://votre-api.com
```

## 📝 Prochaines Étapes

- [ ] Intégration API IA réelle pour l'analyse de fichiers
- [ ] Interface de traduction automatique
- [ ] Mapping interactif tags ↔ données pour les formats
- [ ] Implémentation complète des modules (JustWeb, JustBoost, etc.)
- [ ] Système de templates de CV avec prévisualisation

## 🔐 Sécurité

- Authentification par mot de passe (bcrypt)
- Mode administrateur protégé par code
- Données utilisateur isolées par userId
- Accès uniquement aux données de l'utilisateur connecté
