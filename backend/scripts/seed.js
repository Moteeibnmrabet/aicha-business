require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const SiteSettings = require('../models/SiteSettings');
const Category = require('../models/Category');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aicha-business';

const products = [
  {
    name: 'Trousse Élégance',
    price: 285,
    image: 'https://picsum.photos/600/600?random=1',
    category: 'Grandes Trousses',
    description: 'Une trousse qui transcende le simple accessoire. Chaque couture raconte une histoire, chaque détail révèle un savoir-faire ancestral. Conçue pour celles qui apprécient la beauté dans la simplicité, cette pièce accompagne vos essentiels avec une grâce intemporelle.',
    materials: ['Lin', 'Coton', 'Velours']
  },
  {
    name: 'Vanity Classique',
    price: 320,
    image: 'https://picsum.photos/600/600?random=2',
    category: 'Vanity',
    description: 'L\'écrin parfait pour vos trésors de beauté. Cette vanity allie fonctionnalité et esthétique, créant un espace sacré où chaque objet trouve sa place. Un hommage discret à l\'art de prendre soin de soi.',
    materials: ['Lin', 'Coton', 'Velours']
  },
  {
    name: 'Trousse Minimaliste',
    price: 195,
    image: 'https://picsum.photos/600/600?random=3',
    category: 'Grandes Trousses',
    description: 'Moins, c\'est plus. Cette trousse incarne la philosophie du minimalisme élégant. Sa simplicité apparente cache une attention méticuleuse aux détails, créant une pièce qui résiste aux modes et traverse le temps.',
    materials: ['Lin', 'Coton', 'Velours']
  },
  {
    name: 'Pochette Soirée',
    price: 245,
    image: 'https://picsum.photos/600/600?random=4',
    category: 'Accessoires',
    description: 'Pour les soirées où chaque instant compte. Cette pochette, discrète et raffinée, contient l\'essentiel avec une élégance qui ne se démode jamais. Un compagnon fidèle pour vos moments précieux.',
    materials: ['Lin', 'Coton', 'Velours']
  },
  {
    name: 'Trousse Voyage',
    price: 350,
    image: 'https://picsum.photos/600/600?random=5',
    category: 'Grandes Trousses',
    description: 'Conçue pour les grandes aventures, cette trousse spacieuse accompagne vos voyages avec style et organisation. Chaque compartiment est pensé pour optimiser l\'espace tout en préservant l\'élégance.',
    materials: ['Lin', 'Coton', 'Velours']
  },
  {
    name: 'Vanity Moderne',
    price: 275,
    image: 'https://picsum.photos/600/600?random=6',
    category: 'Vanity',
    description: 'Une approche contemporaine de la vanity traditionnelle. Design épuré et fonctionnalité optimale pour un rituel de beauté moderne et raffiné.',
    materials: ['Lin', 'Coton', 'Velours']
  },
  {
    name: 'Pochette Jour',
    price: 180,
    image: 'https://picsum.photos/600/600?random=7',
    category: 'Accessoires',
    description: 'L\'essentiel du jour dans une pochette élégante et pratique. Parfaite pour accompagner vos activités quotidiennes avec discrétion et style.',
    materials: ['Lin', 'Coton', 'Velours']
  },
  {
    name: 'Trousse Signature',
    price: 420,
    image: 'https://picsum.photos/600/600?random=8',
    category: 'Grandes Trousses',
    description: 'La pièce signature de notre collection. Un savoir-faire exceptionnel et des matériaux d\'exception se rencontrent pour créer une trousse unique, véritable œuvre d\'art fonctionnelle.',
    materials: ['Lin', 'Coton', 'Velours']
  },
  {
    name: 'Vanity Luxe',
    price: 380,
    image: 'https://picsum.photos/600/600?random=9',
    category: 'Vanity',
    description: 'L\'ultime écrin de beauté. Cette vanity luxe allie raffinement et sophistication, créant un espace dédié au bien-être et à l\'élégance.',
    materials: ['Lin', 'Coton', 'Velours']
  },
  {
    name: 'Pochette Élégante',
    price: 220,
    image: 'https://picsum.photos/600/600?random=10',
    category: 'Accessoires',
    description: 'Une pochette qui sublime chaque sortie. Design intemporel et finitions soignées pour un accessoire qui traverse les saisons avec grâce.',
    materials: ['Lin', 'Coton', 'Velours']
  }
];

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert products
    await Product.insertMany(products);
    console.log(`Inserted ${products.length} products`);

    // Create or reset site settings
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({
        heroImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1920&h=1080&fit=crop',
        heroTitle: "L'Art de l'Essentiel",
        heroSubtitle: "Chaque détail compte. Chaque geste compte.\nDécouvrez nos trousses, où l'élégance rencontre la fonctionnalité.",
        heroButtonText: 'Explorer',
        philosophyTitle: 'Notre Philosophie',
        philosophyParagraphs: [
          "Chaque pièce que nous créons est le fruit d'un artisanat méticuleux, où la tradition rencontre la modernité. Nos trousses ne sont pas simplement des accessoires, mais des objets pensés pour durer, pour accompagner vos moments précieux avec une élégance intemporelle.",
          "Nous sélectionnons avec soin des matières durables et nobles : lin, coton et velours de qualité supérieure, qui se patinent avec le temps pour révéler leur caractère unique. Chaque couture est réalisée à la main, chaque détail est pensé pour résister aux années.",
          "Chez Aicha, nous croyons que le luxe véritable réside dans la simplicité raffinée et le respect de l'artisanat traditionnel. Nos créations sont conçues pour celles qui apprécient la beauté dans l'essentiel, qui valorisent la qualité sur la quantité, et qui souhaitent investir dans des pièces qui leur ressemblent."
        ],
        footerTitle: 'Restez informé',
        footerSubtitle: 'Recevez nos dernières collections et actualités',
        copyrightText: '© 2024 Aicha Business. Tous droits réservés.'
      });
      console.log('Site settings created');
    }

    // Create default categories if none exist
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount === 0) {
      await Category.insertMany([
        { name: 'Grandes Trousses', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop', description: 'Trousses spacieuses pour vos essentiels', order: 0 },
        { name: 'Vanity', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop', description: 'Écrins élégants pour votre beauté', order: 1 },
        { name: 'Accessoires', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop', description: 'Compléments raffinés', order: 2 }
      ]);
      console.log('Default categories created');
    }

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'admin@aicha.com' });
    if (!adminExists) {
      const admin = new User({
        email: 'admin@aicha.com',
        password: 'admin123', // Will be hashed by pre-save hook
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created: admin@aicha.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
