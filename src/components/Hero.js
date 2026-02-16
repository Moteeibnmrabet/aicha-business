import React, { useState, useEffect } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { scrollToSection } from '../utils/smoothScroll';
import { api } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const defaultContent = {
  heroImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1920&h=1080&fit=crop',
  heroTitle: "L'Art de l'Essentiel",
  heroSubtitle: "Chaque détail compte. Chaque geste compte.\nDécouvrez nos trousses, où l'élégance rencontre la fonctionnalité.",
  heroButtonText: 'Explorer'
};

const Hero = () => {
  const [contentRef, isVisible] = useScrollAnimation({ once: true });
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    api.getSettings()
      .then((data) => {
        setContent({
          heroImage: data.heroImage || defaultContent.heroImage,
          heroTitle: data.heroTitle || defaultContent.heroTitle,
          heroSubtitle: data.heroSubtitle || defaultContent.heroSubtitle,
          heroButtonText: data.heroButtonText || defaultContent.heroButtonText
        });
      })
      .catch(() => {});
  }, []);

  const handleExploreClick = () => {
    scrollToSection('featured-products');
  };

  const heroImageUrl = getImageUrl(content.heroImage);

  return (
    <section className="relative h-screen flex items-center justify-center mt-16">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="absolute inset-0 bg-deep-black/20" />
      </div>

      <div
        ref={contentRef}
        className={`relative z-10 text-center px-6 max-w-3xl transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="text-5xl md:text-7xl font-serif font-light mb-6 text-white tracking-tight">
          {content.heroTitle}
        </h2>
        <p className="text-lg md:text-xl font-sans font-light text-white/90 mb-10 leading-relaxed whitespace-pre-line">
          {content.heroSubtitle}
        </p>
        <button
          type="button"
          onClick={handleExploreClick}
          className="px-10 py-3 bg-white text-deep-black font-sans font-light text-sm tracking-wider uppercase hover:bg-white/90 transition-all duration-300"
        >
          {content.heroButtonText}
        </button>
      </div>
    </section>
  );
};

export default Hero;
