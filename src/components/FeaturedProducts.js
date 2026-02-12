import React, { useState } from 'react';
import { featuredProducts } from '../data/mockData';
import useScrollAnimation from '../hooks/useScrollAnimation';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

const FeaturedProducts = () => {
  const [sectionRef, isVisible] = useScrollAnimation({ once: true });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <section id="featured-products" className="py-32 md:py-40 px-6 bg-light-gray/30">
        <div className="max-w-7xl mx-auto">
          <h2 
            ref={sectionRef}
            className={`text-4xl md:text-5xl font-serif font-light text-center mb-20 md:mb-24 tracking-tight transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Sélection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      </section>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default FeaturedProducts;
