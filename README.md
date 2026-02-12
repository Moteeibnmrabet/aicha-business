# Aicha Business - E-commerce Trousses de Luxe

Site e-commerce minimaliste et élégant pour la vente de trousses haut de gamme.

## Technologies

- React 18
- Tailwind CSS 3
- React Router DOM
- Fonts Google (Playfair Display & Inter)

## Installation

```bash
npm install
```

## Démarrage

```bash
npm start
```

Le site sera accessible sur `http://localhost:3000`

## Structure

- `src/components/` - Composants React (Navbar, Hero, Categories, FeaturedProducts, Philosophy, Footer)
- `src/config.js` - **Configuration centralisée** (images, prix, produits)
- `src/data/` - Réexporte les données depuis config.js
- `src/pages/` - Pages (ProductDetail)
- `public/` - Fichiers statiques et HTML

## Configuration (config.js)

**Tout est centralisé dans `src/config.js` !**

Pour mettre à jour les images, prix ou produits, modifiez simplement le fichier `src/config.js` :

```javascript
export const config = {
  heroImage: 'URL_DE_VOTRE_IMAGE',
  categories: [...],
  products: [
    {
      name: 'Nom du produit',
      price: 285,  // Modifiez le prix ici
      image: 'URL_IMAGE',  // Modifiez l'image ici
      ...
    }
  ]
};
```

Tous les changements seront automatiquement reflétés sur tout le site.

## Design

- Style minimaliste et luxueux (esprit "Old Money")
- Couleurs : Fond #FCFBF9, texte noir profond, accents gris clair
- Typographie : Playfair Display (Serif) pour titres, Inter (Sans-serif) pour corps
- Espacements généreux pour un rendu ultra-premium
- Prix affichés avec font-thin pour une élégance maximale
