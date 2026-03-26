import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCategory } from '../context/CategoryContext';
import { useAuth } from '../context/AuthContext';
import { scrollToSection } from '../utils/smoothScroll';
import { api } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const Navbar = ({ onShowToast }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { setSelectedCategory } = useCategory();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Charger les produits quand on ouvre la recherche
  useEffect(() => {
    if (isSearchOpen && products.length === 0) {
      setSearchLoading(true);
      api.getProducts()
        .then((data) => setProducts(data))
        .catch(() => onShowToast?.('Impossible de charger les produits'))
        .finally(() => setSearchLoading(false));
    }
  }, [isSearchOpen]);

  // Fermer la recherche avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeSearch();
    };
    if (isSearchOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isSearchOpen]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
    } else {
      scrollToSection(sectionId);
    }
    setIsMenuOpen(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToSection('featured-products'), 100);
    } else {
      scrollToSection('featured-products');
    }
    setIsMenuOpen(false);
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setSearchQuery('');
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Filtrer les produits par nom, catégorie ou description
  const searchResults = searchQuery.trim() === ''
    ? []
    : products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      });

  const handleResultClick = (product) => {
    closeSearch();
    navigate(`/product/${product._id}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-off-white/95 backdrop-blur-sm z-50 border-b border-light-gray">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        {/* Grille : gauche (burger mobile) | AICHA centre | liens droite */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Gauche : burger mobile uniquement */}
          <div className="flex items-center min-w-0">
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-deep-black hover:text-deep-black/70 transition-colors"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Centre : AICHA */}
          <div className="flex justify-center">
            <Link to="/" className="text-2xl font-serif font-semibold tracking-wide">
              AICHA
            </Link>
          </div>

          {/* Droite : liens et icônes */}
          <div className="flex items-center justify-end gap-4 md:gap-8">
            <a
              href="#featured-products"
              onClick={(e) => handleNavClick(e, 'featured-products')}
              className="hidden md:inline text-sm font-sans font-light hover:text-deep-black/70 transition-colors"
            >
              Collections
            </a>
            <a
              href="#philosophy"
              onClick={(e) => handleNavClick(e, 'philosophy')}
              className="hidden md:inline text-sm font-sans font-light hover:text-deep-black/70 transition-colors"
            >
              À propos
            </a>
            <button
              onClick={handleSearchClick}
              className="text-deep-black hover:text-deep-black/70 transition-colors"
              aria-label="Rechercher"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm font-sans font-light text-deep-black/70 truncate max-w-[120px]">
                  {user?.email}
                </span>
                <button
                  onClick={logout}
                  className="text-sm font-sans font-light text-deep-black/70 hover:text-deep-black transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-sans font-light text-deep-black/70 hover:text-deep-black transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="text-sm font-sans font-light text-deep-black/70 hover:text-deep-black transition-colors">
                  Inscription
                </Link>
              </div>
            )}
            <Link to="/checkout" className="relative text-deep-black hover:text-deep-black/70 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-deep-black text-white text-xs font-sans font-light rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Menu mobile déroulant : Collections + catégories + À propos */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-light-gray pt-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleCategorySelect(null)}
                className="text-left text-sm font-sans font-light hover:text-deep-black/70 transition-colors"
              >
                Tous
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id || cat.name}
                  type="button"
                  onClick={() => handleCategorySelect(cat.name)}
                  className="text-left text-sm font-sans font-light hover:text-deep-black/70 transition-colors"
                >
                  {cat.name}
                </button>
              ))}
              <a
                href="#philosophy"
                onClick={(e) => handleNavClick(e, 'philosophy')}
                className="text-sm font-sans font-light hover:text-deep-black/70 transition-colors"
              >
                À propos
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Overlay recherche */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-deep-black/40 backdrop-blur-sm mt-16"
          onClick={closeSearch}
        >
          <div
            className="max-w-2xl mx-auto mt-6 mx-4 bg-off-white border border-light-gray shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b border-light-gray px-4">
              <svg className="w-5 h-5 text-deep-black/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="flex-1 py-4 px-3 font-sans font-light text-deep-black placeholder-deep-black/40 focus:outline-none bg-transparent"
                autoFocus
              />
              <button
                type="button"
                onClick={closeSearch}
                className="text-deep-black/60 hover:text-deep-black p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {searchLoading ? (
                <div className="py-8 text-center font-sans font-light text-deep-black/60 text-sm">
                  Chargement...
                </div>
              ) : searchQuery.trim() === '' ? (
                <div className="py-8 text-center font-sans font-light text-deep-black/60 text-sm">
                  Tapez pour rechercher par nom, catégorie ou description
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center font-sans font-light text-deep-black/60 text-sm">
                  Aucun produit trouvé pour « {searchQuery} »
                </div>
              ) : (
                <ul className="py-2">
                  {searchResults.map((product) => (
                    <li key={product._id}>
                      <button
                        type="button"
                        onClick={() => handleResultClick(product)}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-light-gray/50 text-left transition-colors"
                      >
                        <img
                          src={getImageUrl(product.image)}
                          alt=""
                          className="w-14 h-14 object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-serif font-light text-deep-black block truncate">
                            {product.name}
                          </span>
                          <span className="font-sans font-thin text-deep-black/60 text-sm">
                            {product.price}€ · {product.category}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
