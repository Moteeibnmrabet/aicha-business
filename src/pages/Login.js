import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { api } from '../services/api';

function LoginForm({ onShowToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({});
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    api.getConfig().then(setConfig).catch(() => ({}));
  }, []);

  const from = location.state?.from?.pathname || '/checkout';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Connexion Google échouée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 bg-off-white px-6">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 border border-light-gray">
          <h1 className="text-3xl font-serif font-light mb-2 text-center tracking-tight">
            Connexion
          </h1>
          <p className="text-center text-deep-black/60 font-sans text-sm mb-8">
            Connectez-vous pour finaliser votre achat
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-sans font-light mb-2 text-deep-black/70">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-light-gray text-deep-black font-sans font-light focus:outline-none focus:border-deep-black/30 transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-light mb-2 text-deep-black/70">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-light-gray text-deep-black font-sans font-light focus:outline-none focus:border-deep-black/30 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 bg-deep-black text-white font-sans font-light text-sm tracking-wider uppercase hover:bg-deep-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {config.googleClientId && (
            <>
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-light-gray" />
                <span className="text-deep-black/50 font-sans text-xs">ou</span>
                <div className="flex-1 h-px bg-light-gray" />
              </div>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Connexion Google annulée')}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="320"
                />
              </div>
            </>
          )}

          <p className="mt-8 text-center font-sans font-light text-deep-black/70 text-sm">
            Pas encore de compte ?{' '}
            <Link to="/register" state={{ from: location.state?.from }} className="underline hover:text-deep-black">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Login({ onShowToast }) {
  const [config, setConfig] = useState({});
  React.useEffect(() => {
    api.getConfig().then(setConfig).catch(() => ({}));
  }, []);

  if (config.googleClientId) {
    return (
      <GoogleOAuthProvider clientId={config.googleClientId}>
        <LoginForm onShowToast={onShowToast} />
      </GoogleOAuthProvider>
    );
  }
  return <LoginForm onShowToast={onShowToast} />;
}
