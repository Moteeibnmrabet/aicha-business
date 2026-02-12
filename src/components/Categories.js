import React from 'react';
import { categories } from '../data/mockData';
import useScrollAnimation from '../hooks/useScrollAnimation';
import CategoryCard from './CategoryCard';

const Categories = () => {
  const [sectionRef, isVisible] = useScrollAnimation({ once: true });

  return (
    <section id="collections" className="py-32 md:py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 
          ref={sectionRef}
          className={`text-4xl md:text-5xl font-serif font-light text-center mb-20 md:mb-24 tracking-tight transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Collections
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
