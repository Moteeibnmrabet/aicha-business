import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { scrollToSection } from '../utils/smoothScroll';

const Navbar = ({ onShowToast }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      // Si on n'est pas sur la page d'accueil, naviguer d'abord
      window.location.href = `/#${sectionId}`;
    } else {
      scrollToSection(sectionId);
    }
    setIsMenuOpen(false);
  };

  const handleSearchClick = () => {
    if (onShowToast) {
      onShowToast('Bientôt disponible');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-off-white/95 backdrop-blur-sm z-50 border-b border-light-gray">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Menu burger pour mobile */}
          <div className="flex-1 md:hidden">
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
          
          {/* Logo centré */}
          <div className="flex-1 flex justify-center md:flex-none">
            <Link to="/" className="text-2xl font-serif font-semibold tracking-wide">
              AICHA
            </Link>
          </div>
          
          {/* Liens et icônes desktop */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-8">
            <a 
              href="#collections" 
              onClick={(e) => handleNavClick(e, 'collections')}
              className="text-sm font-sans font-light hover:text-deep-black/70 transition-colors"
            >
              Collections
            </a>
            <a 
              href="#philosophy" 
              onClick={(e) => handleNavClick(e, 'philosophy')}
              className="text-sm font-sans font-light hover:text-deep-black/70 transition-colors"
            >
              À propos
            </a>
            
            {/* Icône recherche */}
            <button 
              onClick={handleSearchClick}
              className="text-deep-black hover:text-deep-black/70 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Icône panier avec compteur */}
            <button className="relative text-deep-black hover:text-deep-black/70 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-deep-black text-white text-xs font-sans font-light rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Icônes mobile (recherche et panier) */}
          <div className="flex-1 flex items-center justify-end gap-4 md:hidden">
            <button 
              onClick={handleSearchClick}
              className="text-deep-black hover:text-deep-black/70 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="relative text-deep-black hover:text-deep-black/70 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-deep-black text-white text-xs font-sans font-light rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-light-gray pt-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              <a
                href="#collections"
                onClick={(e) => handleNavClick(e, 'collections')}
                className="text-sm font-sans font-light hover:text-deep-black/70 transition-colors"
              >
                Collections
              </a>
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
    </nav>
  );
};

export default Navbar;
