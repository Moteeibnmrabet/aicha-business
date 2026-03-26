import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const Checkout = ({ onShowToast }) => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { items, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const [config, setConfig] = useState({ paypalClientId: null });
  const [currency, setCurrency] = useState('eur');
  const [loading, setLoading] = useState(false);
  const [paypalError, setPaypalError] = useState('');
  const paypalContainerRef = useRef(null);
  const paypalButtonsLoaded = useRef(false);

  useEffect(() => {
    api.getConfig().then(setConfig).catch(() => setConfig({}));
  }, []);

  useEffect(() => {
    if (!config.paypalClientId || !items.length || paypalButtonsLoaded.current) return;
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=' + config.paypalClientId + '&currency=' + currency.toUpperCase();
    script.async = true;
    script.onload = () => {
      if (!window.paypal || !paypalContainerRef.current) return;
      paypalButtonsLoaded.current = true;
      window.paypal.Buttons({
        createOrder: () => api.createPayPalOrder(items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity })), currency).then((r) => r.orderId),
        onApprove: (data) => {
          setLoading(true);
          return api.capturePayPalOrder(data.orderID, items, cartTotal, currency).then(() => { clearCart(); navigate('/success'); }).catch((err) => { setPaypalError(err.message || 'Capture failed'); setLoading(false); });
        },
        onError: (err) => setPaypalError(err && err.message ? err.message : 'PayPal error')
      }).render(paypalContainerRef.current);
    };
    document.body.appendChild(script);
    return () => { if (script.parentNode) script.parentNode.removeChild(script); };
  }, [config.paypalClientId, currency, items, cartTotal, clearCart, navigate]);

  const baseUrl = window.location.origin;
  const handleStripeCheckout = async () => {
    if (!items.length) return;
    setLoading(true);
    setPaypalError('');
    try {
      const session = await api.createCheckoutSession(
        items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, image: getImageUrl(i.image) })),
        currency,
        baseUrl + '/success?session_id={CHECKOUT_SESSION_ID}',
        baseUrl + '/cancel'
      );
      if (session && session.url) {
        window.location.href = session.url;
      } else {
        setLoading(false);
        onShowToast && onShowToast('Impossible de creer la session de paiement');
      }
    } catch (err) {
      setLoading(false);
      onShowToast && onShowToast(err.message || 'Erreur Stripe');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-off-white py-32 px-6 flex items-center justify-center">
        <p className="font-sans font-light text-deep-black/70">Chargement...</p>
      </div>
    );
  }

  if (items.length > 0 && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-off-white py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-serif font-light mb-4">Connexion requise</h1>
          <p className="font-sans font-light text-deep-black/70 mb-6">
            Veuillez vous connecter ou créer un compte pour finaliser votre achat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              state={{ from: { pathname: '/checkout' } }}
              className="px-8 py-3 bg-deep-black text-white font-sans font-light text-sm tracking-wider hover:bg-deep-black/90 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              state={{ from: { pathname: '/checkout' } }}
              className="px-8 py-3 border border-deep-black text-deep-black font-sans font-light text-sm tracking-wider hover:bg-deep-black/5 transition-colors"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-off-white py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-serif font-light mb-4">Votre panier est vide</h1>
          <Link to="/" className="font-sans font-light text-deep-black/70 hover:text-deep-black underline">Retour a l accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif font-light mb-10 tracking-tight">Paiement</h1>
        <div className="mb-10">
          <p className="text-xs font-sans text-deep-black/50 uppercase tracking-wider mb-3">Devise</p>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="border border-light-gray px-4 py-2 font-sans font-light text-deep-black bg-white">
            <option value="eur">EUR</option>
            <option value="usd">USD</option>
            <option value="gbp">GBP</option>
          </select>
        </div>
        <div className="border border-light-gray divide-y divide-light-gray mb-10">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 p-4">
              <img src={getImageUrl(item.image)} alt="" className="w-20 h-20 object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-serif font-light text-deep-black truncate">{item.name}</p>
                <p className="font-sans font-thin text-deep-black/70 text-sm">{item.price} {currency.toUpperCase()} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.productId, e.target.value)} className="w-14 border border-light-gray px-2 py-1 text-center font-sans text-sm" />
                <button type="button" onClick={() => removeFromCart(item.productId)} className="text-deep-black/50 hover:text-deep-black text-sm font-sans">Retirer</button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-right font-sans font-light text-lg mb-8">Total : <span className="font-medium">{cartTotal.toFixed(2)} {currency.toUpperCase()}</span></p>
        {paypalError && <p className="text-red-600 font-sans text-sm mb-4">{paypalError}</p>}
        <div className="space-y-4">
          <button type="button" onClick={handleStripeCheckout} disabled={loading} className="w-full py-4 border border-deep-black bg-deep-black text-white font-sans font-light text-sm tracking-wider hover:bg-deep-black/90 disabled:opacity-50 transition-colors">
            {loading ? 'Redirection...' : 'Payer par carte (Stripe)'}
          </button>
          {config.paypalClientId && <div><p className="text-xs font-sans text-deep-black/50 uppercase tracking-wider mb-2">Ou avec PayPal</p><div ref={paypalContainerRef} /></div>}
        </div>
        <p className="mt-8 text-center text-deep-black/50 font-sans text-sm">Redirection vers Stripe ou PayPal.</p>
      </div>
    </div>
  );
};

export default Checkout;
