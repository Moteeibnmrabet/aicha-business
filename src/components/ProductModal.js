import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUtils';

const ProductModal = ({ product, isOpen, onClose }) => {
  const [selectedMaterial, setSelectedMaterial] = useState(product?.materials[0] || 'Lin');
  const { addToCart } = useCart();

  useEffect(() => {
    if (product?.materials) {
      setSelectedMaterial(product.materials[0]);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-deep-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-off-white max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-deep-black hover:text-deep-black/70 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Image produit */}
          <div className="relative aspect-square bg-white overflow-hidden">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Informations produit */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-serif font-light mb-4 tracking-tight">
              {product.name}
            </h1>
            
            <p className="text-2xl font-serif font-thin mb-8 text-deep-black/80 tracking-wide">
              {product.price}€
            </p>

            {/* Description */}
            <p className="text-base font-sans font-light text-deep-black/70 mb-10 leading-relaxed">
              {product.description}
            </p>

            {/* Choix de matière */}
            <div className="mb-10">
              <h3 className="text-sm font-sans font-light uppercase tracking-wider mb-4 text-deep-black/70">
                Matière
              </h3>
              <div className="flex gap-4 flex-wrap">
                {product.materials.map((material) => (
                  <button
                    key={material}
                    onClick={() => setSelectedMaterial(material)}
                    className={`px-6 py-2 border font-sans font-light text-sm tracking-wider transition-all duration-300 ${
                      selectedMaterial === material
                        ? 'border-deep-black bg-deep-black text-white'
                        : 'border-deep-black/30 text-deep-black hover:border-deep-black/60'
                    }`}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>

            {/* Bouton ajouter au panier */}
            <button
              onClick={handleAddToCart}
              className="w-full px-8 py-4 bg-deep-black text-white font-sans font-light text-sm tracking-wider uppercase hover:bg-deep-black/90 transition-colors duration-300"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
