import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { config } from '../config';
import { scrollToSection } from '../utils/smoothScroll';

const Hero = () => {
  const [contentRef, isVisible] = useScrollAnimation({ once: true });

  const handleExploreClick = () => {
    scrollToSection('featured-products');
  };

  return (
    <section className="relative h-screen flex items-center justify-center mt-16">
      {/* Image de fond */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${config.heroImage})`
        }}
      >
        <div className="absolute inset-0 bg-deep-black/20"></div>
      </div>
      
      {/* Contenu centré */}
      <div 
        ref={contentRef}
        className={`relative z-10 text-center px-6 max-w-3xl transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="text-5xl md:text-7xl font-serif font-light mb-6 text-white tracking-tight">
          L'Art de l'Essentiel
        </h2>
        <p className="text-lg md:text-xl font-sans font-light text-white/90 mb-10 leading-relaxed">
          Chaque détail compte. Chaque geste compte. 
          <br />
          Découvrez nos trousses, où l'élégance rencontre la fonctionnalité.
        </p>
        <button 
          onClick={handleExploreClick}
          className="px-10 py-3 bg-white text-deep-black font-sans font-light text-sm tracking-wider uppercase hover:bg-white/90 transition-all duration-300"
        >
          Explorer
        </button>
      </div>
    </section>
  );
};

export default Hero;
