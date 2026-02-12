import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, index, onProductClick }) => {
  const [productRef, productVisible] = useScrollAnimation({ 
    once: true,
    threshold: 0.1 
  });
  const { addToCart } = useCart();

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart();
  };

  return (
    <div
      ref={productRef}
      className={`group cursor-pointer transition-all duration-1000 ${
        productVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onClick={handleCardClick}
    >
      {/* Image produit */}
      <div className="relative overflow-hidden mb-4 bg-white aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-deep-black/0 group-hover:bg-deep-black/5 transition-colors duration-300"></div>
        
        {/* Bouton Ajouter au panier - apparaît au hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-white text-deep-black font-sans font-light text-sm tracking-wider uppercase hover:bg-deep-black hover:text-white transition-all duration-300"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
      
      {/* Informations produit */}
      <div className="text-center">
        <h3 className="text-lg font-serif font-light mb-2 tracking-wide">
          {product.name}
        </h3>
        <p className="text-sm font-sans font-thin text-deep-black/70 tracking-wide">
          {product.price}€
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
