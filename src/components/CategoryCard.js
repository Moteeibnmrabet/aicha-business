import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const CategoryCard = ({ category, index }) => {
  const [categoryRef, categoryVisible] = useScrollAnimation({ 
    once: true,
    threshold: 0.1 
  });

  return (
    <div
      ref={categoryRef}
      className={`relative h-96 overflow-hidden group cursor-pointer transition-all duration-1000 ${
        categoryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${category.image})` }}
      >
        <div className="absolute inset-0 bg-deep-black/30 group-hover:bg-deep-black/40 transition-colors duration-300"></div>
      </div>
      
      {/* Contenu */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
        <h3 className="text-3xl font-serif font-light mb-3 tracking-wide">
          {category.name}
        </h3>
        <p className="text-sm font-sans font-light text-white/90">
          {category.description}
        </p>
      </div>
    </div>
  );
};

export default CategoryCard;
