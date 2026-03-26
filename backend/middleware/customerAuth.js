const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Optional: if token present, attach user. If not, req.user stays undefined.
const optionalCustomerAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      req.user = null;
      return next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (user && (user.role === 'user' || user.role === 'admin')) {
      req.user = user;
    } else {
      req.user = null;
    }
    next();
  } catch {
    req.user = null;
    next();
  }
};

// Required: user must be logged in (customer or admin)
const requireCustomerAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Connexion requise pour effectuer un achat' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Session expirée. Veuillez vous reconnecter.' });
    }
    if (user.role !== 'user' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Session expirée. Veuillez vous reconnecter.' });
  }
};

module.exports = { optionalCustomerAuth, requireCustomerAuth };
