import React from 'react';
import { useNavigate } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { getImageUrl } from '../utils/imageUtils';
import { nameToSlug } from '../utils/categorySlug';

const CategoryCard = ({ category, index }) => {
  const navigate = useNavigate();
  const [categoryRef, categoryVisible] = useScrollAnimation({
    once: true,
    threshold: 0.1
  });

  const slug = nameToSlug(category.name);

  const handleClick = () => {
    if (slug) navigate(`/collection/${slug}`);
  };

  return (
    <div
      ref={categoryRef}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className={`relative h-96 overflow-hidden group cursor-pointer transition-all duration-1000 ${
        categoryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${getImageUrl(category.image)})` }}
      >
        <div className="absolute inset-0 bg-deep-black/30 group-hover:bg-deep-black/40 transition-colors duration-300" />
      </div>

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
