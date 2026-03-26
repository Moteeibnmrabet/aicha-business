# Configuration Google OAuth (Connexion avec Google)

Pour activer la connexion avec Google, configure un projet dans Google Cloud Console.

## Étapes

1. **Créer un projet** sur https://console.cloud.google.com/
2. **Activer l'API** : APIs & Services → Library → chercher "Google Identity" → activer "Google Identity Services"
3. **Créer des identifiants** : APIs & Services → Credentials → Create Credentials → OAuth client ID
   - Type : "Web application"
   - Authorized JavaScript origins : `http://localhost:3000` (dev) et ton domaine en production
   - Authorized redirect URIs : pas nécessaire pour le flux utilisé (One Tap / credential)
4. **Copier le Client ID** et l'ajouter dans `backend/.env` :
   ```
   GOOGLE_CLIENT_ID=ton-client-id.apps.googleusercontent.com
   ```

5. **Redémarrer le backend** pour charger la nouvelle variable.

Sans `GOOGLE_CLIENT_ID`, le bouton "Continuer avec Google" n'apparaîtra pas. L'inscription et la connexion par email/mot de passe fonctionnent toujours.
