// Configuration centralisée pour le site Aicha Business
// Modifiez simplement les valeurs ci-dessous pour mettre à jour tout le site

export const config = {
  // Images Hero
  heroImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1920&h=1080&fit=crop',

  // Catégories
  categories: [
    {
      id: 1,
      name: 'Grandes Trousses',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
      description: 'Trousses spacieuses pour vos essentiels'
    },
    {
      id: 2,
      name: 'Vanity',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
      description: 'Écrins élégants pour votre beauté'
    },
    {
      id: 3,
      name: 'Accessoires',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop',
      description: 'Compléments raffinés'
    }
  ],

  // Produits
  products: [
    {
      id: 1,
      name: 'Trousse Élégance',
      price: 285,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
      category: 'Grandes Trousses',
      description: 'Une trousse qui transcende le simple accessoire. Chaque couture raconte une histoire, chaque détail révèle un savoir-faire ancestral. Conçue pour celles qui apprécient la beauté dans la simplicité, cette pièce accompagne vos essentiels avec une grâce intemporelle.',
      materials: ['Lin', 'Coton', 'Velours']
    },
    {
      id: 2,
      name: 'Vanity Classique',
      price: 320,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
      category: 'Vanity',
      description: 'L\'écrin parfait pour vos trésors de beauté. Cette vanity allie fonctionnalité et esthétique, créant un espace sacré où chaque objet trouve sa place. Un hommage discret à l\'art de prendre soin de soi.',
      materials: ['Lin', 'Coton', 'Velours']
    },
    {
      id: 3,
      name: 'Trousse Minimaliste',
      price: 195,
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop',
      category: 'Grandes Trousses',
      description: 'Moins, c\'est plus. Cette trousse incarne la philosophie du minimalisme élégant. Sa simplicité apparente cache une attention méticuleuse aux détails, créant une pièce qui résiste aux modes et traverse le temps.',
      materials: ['Lin', 'Coton', 'Velours']
    },
    {
      id: 4,
      name: 'Pochette Soirée',
      price: 245,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop',
      category: 'Accessoires',
      description: 'Pour les soirées où chaque instant compte. Cette pochette, discrète et raffinée, contient l\'essentiel avec une élégance qui ne se démode jamais. Un compagnon fidèle pour vos moments précieux.',
      materials: ['Lin', 'Coton', 'Velours']
    }
  ]
};

// Fonction pour récupérer un produit par ID
export const getProductById = (id) => {
  return config.products.find(product => product.id === parseInt(id));
};
