import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../data/mockData';
import useScrollAnimation from '../hooks/useScrollAnimation';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const [selectedMaterial, setSelectedMaterial] = useState(product?.materials[0] || 'Lin');
  const [imageRef, imageVisible] = useScrollAnimation({ once: true });
  const [contentRef, contentVisible] = useScrollAnimation({ once: true });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Produit introuvable</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-deep-black text-white font-sans font-light text-sm tracking-wider uppercase hover:bg-deep-black/90 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-off-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-sm font-sans font-light text-deep-black/70 hover:text-deep-black transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image produit */}
          <div
            ref={imageRef}
            className={`transition-all duration-1000 ${
              imageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative aspect-square bg-white overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Informations produit */}
          <div
            ref={contentRef}
            className={`flex flex-col justify-center transition-all duration-1000 delay-200 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-light mb-4 tracking-tight">
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
              <div className="flex gap-4">
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
              onClick={() => {
                console.log('Ajouté au panier:', product.name, 'Matière:', selectedMaterial);
              }}
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

export default ProductDetail;
