import React, { useState } from 'react';

const LOGIN_URL = 'https://adapting-sloth-tightly.ngrok-free.app/auth/login';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Tentative de connexion...');
    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Identifiants invalides');
      }
      const data = await response.json();
      console.log('Connexion réussie:', data);
      if (data.token) {
        // Stockage sécurisé dans chrome.storage.local
        const chromeObj = typeof window !== 'undefined' ? (window as any).chrome : undefined;
        if (chromeObj && chromeObj.storage && chromeObj.storage.local) {
          chromeObj.storage.local.set({ token: data.token }, () => {
            onLoginSuccess();
          });
        } else {
          // Fallback localStorage si chrome.storage non dispo
          localStorage.setItem('token', data.token);
          onLoginSuccess();
        }
      } else {
        throw new Error('Token non reçu');
      }
      // Redirection ou message de succès ici si besoin
    } catch (err: any) {
      console.error('Erreur lors de la connexion:', err);
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default Login; 