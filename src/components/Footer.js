import React, { useState } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { scrollToSection } from '../utils/smoothScroll';

const Footer = ({ onShowToast }) => {
  const [email, setEmail] = useState('');
  const [footerRef, isVisible] = useScrollAnimation({ once: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onShowToast) {
      onShowToast('Bientôt disponible');
    }
    setEmail('');
  };

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <footer 
      ref={footerRef}
      className={`py-24 md:py-32 px-6 border-t border-light-gray transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Newsletter */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-serif font-light mb-4 tracking-wide">
            Restez informé
          </h3>
          <p className="text-sm font-sans font-light text-deep-black/70 mb-6">
            Recevez nos dernières collections et actualités
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-2 bg-white border border-light-gray text-deep-black font-sans font-light text-sm focus:outline-none focus:border-deep-black/30 transition-colors"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-deep-black text-white font-sans font-light text-sm tracking-wider uppercase hover:bg-deep-black/90 transition-colors"
            >
              S'inscrire
            </button>
          </form>
        </div>
        
        {/* Liens et copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-light-gray">
          <div className="flex gap-6 mb-4 md:mb-0">
            <a 
              href="#collections" 
              onClick={(e) => handleLinkClick(e, 'collections')}
              className="text-xs font-sans font-light text-deep-black/70 hover:text-deep-black transition-colors"
            >
              Collections
            </a>
            <a 
              href="#philosophy" 
              onClick={(e) => handleLinkClick(e, 'philosophy')}
              className="text-xs font-sans font-light text-deep-black/70 hover:text-deep-black transition-colors"
            >
              À propos
            </a>
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault();
                if (onShowToast) {
                  onShowToast('Bientôt disponible');
                }
              }}
              className="text-xs font-sans font-light text-deep-black/70 hover:text-deep-black transition-colors"
            >
              Contact
            </a>
          </div>
          
          <p className="text-xs font-sans font-light text-deep-black/50">
            © 2024 Aicha Business. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
