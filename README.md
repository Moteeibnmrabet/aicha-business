# Aicha Business - E-commerce Trousses de Luxe

Site e-commerce minimaliste et élégant pour la vente de trousses haut de gamme avec backend complet.

## Technologies Frontend

- React 18
- Tailwind CSS 3
- React Router DOM
- Fonts Google (Playfair Display & Inter)

## Technologies Backend

- Express.js
- MongoDB avec Mongoose
- JWT (Authentification)
- bcryptjs (Hashage mots de passe)

## Installation

### Frontend

```bash
npm install
npm start
```

Le site sera accessible sur `http://localhost:3000`

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos configurations MongoDB
npm run seed  # Créer les données initiales
npm run dev   # Démarrer en mode développement
```

Le backend sera accessible sur `http://localhost:5000`

## Configuration

### Variables d'environnement Frontend

Créer un fichier `.env` à la racine :
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Variables d'environnement Backend

Voir `backend/.env.example` et `backend/README.md`

## Structure

- `src/components/` - Composants React
- `src/pages/` - Pages (Home, ProductDetail, Admin, AdminLogin)
- `src/services/` - Services API
- `src/config.js` - Configuration centralisée
- `backend/` - API REST Express
- `backend/models/` - Modèles MongoDB
- `backend/routes/` - Routes API
- `backend/middleware/` - Middlewares (auth)

## Espace Admin

L'espace admin est accessible uniquement après authentification :
- URL: `/admin/login`
- Email par défaut: `admin@aicha.com`
- Mot de passe par défaut: `admin123`

**Important** : L'URL admin n'est pas visible dans la navigation publique. Seuls les administrateurs authentifiés peuvent y accéder.

## Fonctionnalités

- ✅ Affichage des produits depuis MongoDB
- ✅ Authentification admin avec JWT
- ✅ CRUD produits (Create, Read, Update, Delete)
- ✅ API REST sécurisée
- ✅ Interface admin complète
- ✅ Panier avec compteur
- ✅ Modale produit
- ✅ Smooth scroll
- ✅ Responsive design

## Déploiement

### Vercel (Frontend)

Le frontend est configuré pour Vercel avec `vercel.json`.

### Backend

Le backend peut être déployé sur :
- Heroku
- Railway
- Render
- VPS avec PM2

Assurez-vous de configurer les variables d'environnement sur votre plateforme de déploiement.

## Design

- Style minimaliste et luxueux (esprit "Old Money")
- Couleurs : Fond #FCFBF9, texte noir profond, accents gris clair
- Typographie : Playfair Display (Serif) pour titres, Inter (Sans-serif) pour corps
- Espacements généreux pour un rendu ultra-premium
