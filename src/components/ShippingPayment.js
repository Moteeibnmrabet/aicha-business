import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import useScrollAnimation from '../hooks/useScrollAnimation';

const defaultContent = {
  shippingTitle: 'Livraison mondiale',
  shippingText: 'Nous expédions partout dans le monde. Délais indicatifs : 5-10 jours ouvrés en Europe, 10-15 jours pour le reste du monde. Les frais de port sont calculés à la caisse.',
  paymentTitle: 'Paiement sécurisé',
  paymentText: 'Paiement 100 % sécurisé par carte bancaire ou PayPal. Vos données sont protégées.',
  paymentMethods: ['Visa', 'Mastercard', 'PayPal']
};

const ShippingPayment = () => {
  const [sectionRef, isVisible] = useScrollAnimation({ once: true });
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    api.getSettings()
      .then((data) => {
        setContent({
          shippingTitle: data.shippingTitle || defaultContent.shippingTitle,
          shippingText: data.shippingText || defaultContent.shippingText,
          paymentTitle: data.paymentTitle || defaultContent.paymentTitle,
          paymentText: data.paymentText || defaultContent.paymentText,
          paymentMethods: Array.isArray(data.paymentMethods) && data.paymentMethods.length > 0
            ? data.paymentMethods
            : defaultContent.paymentMethods
        });
      })
      .catch(() => {});
  }, []);

  const paymentIcons = {
    Visa: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
    Mastercard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    PayPal: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    'Carte bancaire': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%231a1a1a" stroke-width="1.5"%3E%3Crect x="2" y="5" width="20" height="14" rx="2"/%3E%3Cpath d="M2 10h20"/%3E%3C/svg%3E'
  };

  return (
    <section id="shipping-payment" className="py-24 md:py-32 px-6 bg-light-gray/30">
      <div className="max-w-7xl mx-auto">
        <h2
          ref={sectionRef}
          className={`text-4xl md:text-5xl font-serif font-light text-center mb-16 md:mb-20 tracking-tight transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Livraison & Paiement
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-5xl mx-auto">
          {/* Livraison mondiale */}
          <div className="bg-off-white p-8 md:p-10 border border-light-gray">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl" aria-hidden>🌍</span>
              <h3 className="text-2xl font-serif font-light tracking-tight">
                {content.shippingTitle}
              </h3>
            </div>
            <p className="font-sans font-light text-deep-black/80 leading-relaxed text-sm md:text-base">
              {content.shippingText}
            </p>
          </div>

          {/* Paiement sécurisé */}
          <div className="bg-off-white p-8 md:p-10 border border-light-gray">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl" aria-hidden>🔒</span>
              <h3 className="text-2xl font-serif font-light tracking-tight">
                {content.paymentTitle}
              </h3>
            </div>
            <p className="font-sans font-light text-deep-black/80 leading-relaxed text-sm md:text-base mb-6">
              {content.paymentText}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {content.paymentMethods.map((method) => (
                <span
                  key={method}
                  className="inline-flex items-center justify-center px-4 py-2 bg-white border border-light-gray font-sans font-light text-sm text-deep-black/80"
                >
                  {paymentIcons[method] ? (
                    <img
                      src={paymentIcons[method]}
                      alt={method}
                      className="h-6 w-auto max-w-[80px] object-contain"
                    />
                  ) : (
                    method
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShippingPayment;
