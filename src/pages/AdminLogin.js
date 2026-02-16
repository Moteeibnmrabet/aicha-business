import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(email, password);
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.user));
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-16 bg-off-white px-6">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 border border-light-gray">
          <h1 className="text-3xl font-serif font-light mb-8 text-center tracking-tight">
            Admin Login
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
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
                placeholder="admin@aicha.com"
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

          <div className="mt-6 text-xs font-sans font-light text-deep-black/50 text-center">
            Accès réservé aux administrateurs
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
