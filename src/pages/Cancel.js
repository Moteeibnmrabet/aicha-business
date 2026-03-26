import React from 'react';
import { Link } from 'react-router-dom';

const Cancel = () => (
  <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
    <div className="max-w-md w-full text-center">
      <div className="mb-8">
        <svg
          className="w-16 h-16 mx-auto text-deep-black/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-3xl md:text-4xl font-serif font-light text-deep-black mb-4 tracking-tight">
        Paiement annulé
      </h1>
      <p className="font-sans font-light text-deep-black/70 mb-10">
        Votre paiement n&apos;a pas été effectué. Votre panier est inchangé.
      </p>
      <Link
        to="/checkout"
        className="inline-block py-3 px-8 border border-deep-black text-deep-black font-sans font-light text-sm tracking-wider hover:bg-deep-black hover:text-white transition-colors mr-4"
      >
        Retour au paiement
      </Link>
      <Link
        to="/"
        className="inline-block py-3 px-8 font-sans font-light text-deep-black/70 hover:text-deep-black"
      >
        Accueil
      </Link>
    </div>
  </div>
);

export default Cancel;
