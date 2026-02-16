import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { slugToName } from '../utils/categorySlug';
import useScrollAnimation from '../hooks/useScrollAnimation';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionRef, isVisible] = useScrollAnimation({ once: true });

  const categoryName = slugToName(slug, categories);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const catsData = await api.getCategories();
        setCategories(catsData);
        const name = slugToName(slug, catsData);
        const productsData = name
          ? await api.getProducts(name)
          : await api.getProducts();
        setProducts(productsData);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const displayName = categoryName || slug?.replace(/-/g, ' ') || 'Catégorie';

  return (
    <div className="min-h-screen mt-16 bg-off-white py-12 md:py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 text-sm font-sans font-light text-deep-black/70 hover:text-deep-black transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>

        <h1
          ref={sectionRef}
          className={`text-4xl md:text-5xl font-serif font-light text-center mb-4 tracking-tight transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {displayName}
        </h1>
        <p className="text-center font-sans font-light text-deep-black/70 mb-12">
          {products.length} produit{products.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div className="text-center py-16">
            <p className="font-sans font-light text-deep-black/70">Chargement...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-sans font-light text-deep-black/70">Aucun produit dans cette catégorie.</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-deep-black text-white font-sans font-light text-sm tracking-wider uppercase hover:bg-deep-black/90 transition-colors"
            >
              Voir toute la sélection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CategoryPage;
