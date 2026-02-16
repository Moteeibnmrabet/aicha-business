/**
 * Script pour créer ou réinitialiser le mot de passe de l'admin.
 * Usage: node scripts/reset-admin.js
 * Identifiants après exécution: admin@aicha.com / admin123
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aicha-business';

async function resetAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@aicha.com';
    const password = 'admin123';

    let admin = await User.findOne({ email });

    if (admin) {
      admin.password = password;
      await admin.save();
      console.log('Admin password reset successfully.');
    } else {
      admin = new User({
        email,
        password,
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created.');
    }

    console.log('---');
    console.log('Email:    ', email);
    console.log('Password: ', password);
    console.log('---');
    console.log('You can now log in at /admin/login');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetAdmin();
