# Aicha Business - Backend API

API REST sécurisée pour la gestion des produits de l'e-commerce Aicha Business.

## Technologies

- **Express.js** - Framework web Node.js
- **MongoDB** avec **Mongoose** - Base de données
- **JWT** (JSON Web Tokens) - Authentification
- **bcryptjs** - Hashage des mots de passe

## Installation

1. Installer les dépendances :
```bash
cd backend
npm install
```

2. Créer un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

3. Configurer les variables d'environnement dans `.env` :
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aicha-business
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Paiement Stripe (ne jamais exposer STRIPE_SECRET_KEY ni STRIPE_WEBHOOK_SECRET côté frontend)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Paiement PayPal (PAYPAL_CLIENT_ID peut être exposé via GET /api/config ; ne jamais exposer PAYPAL_CLIENT_SECRET)
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox
```

## Base de données

Assurez-vous que MongoDB est installé et en cours d'exécution sur votre machine.

### Option 1 : MongoDB local
Installez MongoDB localement et démarrez-le.

### Option 2 : MongoDB Atlas (cloud)
Utilisez une URI MongoDB Atlas dans votre `.env` :
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aicha-business
```

## Seed (Données initiales)

Pour créer les produits fictifs et l'utilisateur admin :
```bash
npm run seed
```

Cela créera :
- **10 produits** avec images depuis Picsum Photos
- **1 utilisateur admin** :
  - Email: `admin@aicha.com`
  - Mot de passe: `admin123`

## Démarrage

### Mode développement (avec nodemon)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## API Endpoints

### Public

- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Détails d'un produit
- `GET /api/health` - Vérification de santé de l'API

### Admin (Authentification requise)

- `POST /api/auth/login` - Connexion admin
  ```json
  {
    "email": "admin@aicha.com",
    "password": "admin123"
  }
  ```

- `POST /api/products` - Créer un produit (nécessite token JWT)
- `PUT /api/products/:id` - Modifier un produit (nécessite token JWT)
- `DELETE /api/products/:id` - Supprimer un produit (nécessite token JWT)

## Sécurité

- Toutes les routes admin sont protégées par un middleware JWT
- Les mots de passe sont hashés avec bcryptjs
- Seuls les utilisateurs avec le rôle `admin` peuvent accéder aux routes admin

## Frontend

L'interface admin est accessible à `/admin/login` dans le frontend React.
