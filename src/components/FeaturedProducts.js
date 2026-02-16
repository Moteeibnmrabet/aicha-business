import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCategory } from '../context/CategoryContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

const FeaturedProducts = () => {
  const [sectionRef, isVisible] = useScrollAnimation({ once: true });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedCategory } = useCategory();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts(selectedCategory || undefined);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

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
      <section id="featured-products" className="py-32 md:py-40 px-4 md:px-6 bg-light-gray/30">
        <div className="max-w-7xl mx-auto">
          <h2
            ref={sectionRef}
            className={`text-4xl md:text-5xl font-serif font-light text-center mb-12 md:mb-16 tracking-tight transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Sélection
          </h2>

          <p className="font-sans font-light text-deep-black/60 text-sm text-center mb-8">
            {products.length} produit{products.length !== 1 ? 's' : ''}
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p className="font-sans font-light text-deep-black/70">Chargement...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-sans font-light text-deep-black/70">Aucun produit dans cette catégorie.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  index={index}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          )}
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
