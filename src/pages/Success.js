import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Success = () => {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
  <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
    <div className="max-w-md w-full text-center">
      <div className="mb-8">
        <svg
          className="w-16 h-16 mx-auto text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-3xl md:text-4xl font-serif font-light text-deep-black mb-4 tracking-tight">
        Paiement réussi
      </h1>
      <p className="font-sans font-light text-deep-black/70 mb-10">
        Merci pour votre commande. Vous recevrez un e-mail de confirmation sous peu.
      </p>
      <Link
        to="/"
        className="inline-block py-3 px-8 border border-deep-black text-deep-black font-sans font-light text-sm tracking-wider hover:bg-deep-black hover:text-white transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  </div>
  );
};

export default Success;
