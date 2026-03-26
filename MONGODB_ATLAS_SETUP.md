# Configuration MongoDB Atlas (Cloud - Gratuit)

## Étapes rapides

### 1. Créer un compte MongoDB Atlas
- Aller sur : https://www.mongodb.com/cloud/atlas/register
- Créer un compte gratuit (ou se connecter si tu as déjà un compte)

### 2. Créer un cluster gratuit
- Une fois connecté, cliquer sur "Build a Database"
- Choisir le plan **FREE (M0)** - Shared
- Choisir un provider (AWS, Google Cloud, ou Azure) et une région proche (ex: Europe - Paris)
- Cliquer sur "Create"

### 3. Configurer l'accès réseau
- Dans "Network Access", cliquer sur "Add IP Address"
- Cliquer sur "Allow Access from Anywhere" (0.0.0.0/0) pour tester rapidement
- Cliquer sur "Confirm"

### 4. Créer un utilisateur de base de données
- Dans "Database Access", cliquer sur "Add New Database User"
- Choisir "Password" comme méthode d'authentification
- Créer un nom d'utilisateur (ex: `aicha-admin`)
- Créer un mot de passe fort (⚠️ **NOTE-LE BIEN**)
- Rôle : "Atlas admin" ou "Read and write to any database"
- Cliquer sur "Add User"

### 5. Récupérer la chaîne de connexion
- Dans "Database", cliquer sur "Connect" sur ton cluster
- Choisir "Connect your application"
- Copier la chaîne de connexion (format : `mongodb+srv://username:password@cluster.mongodb.net/`)
- ⚠️ **Remplace `<password>` par ton mot de passe réel dans la chaîne**

### 6. Mettre à jour le fichier .env
Une fois que tu as la chaîne de connexion complète, dis-moi et je mettrai à jour le fichier `backend/.env` automatiquement.

**Exemple de chaîne finale :**
```
MONGODB_URI=mongodb+srv://aicha-admin:tonMotDePasse123@cluster0.xxxxx.mongodb.net/aicha-business?retryWrites=true&w=majority
```

## Après la configuration

Une fois le `.env` mis à jour :
1. Le backend se reconnectera automatiquement à MongoDB Atlas
2. On exécutera le script seed pour ajouter des produits de test
3. Tu pourras tester l'application !

## Avantages de MongoDB Atlas
- ✅ Pas d'installation locale nécessaire
- ✅ Pas de stockage requis sur ton PC
- ✅ Gratuit jusqu'à 512 MB de données
- ✅ Accessible depuis n'importe où
- ✅ Sauvegarde automatique
