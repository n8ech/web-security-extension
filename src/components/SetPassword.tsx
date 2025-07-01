import React, { useState } from 'react';

const SET_PASSWORD_URL = 'https://adapting-sloth-tightly.ngrok-free.app/auth/set-password';

interface SetPasswordProps {
  onPasswordSet?: () => void;
}

const SetPassword: React.FC<SetPasswordProps> = ({ onPasswordSet }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const getToken = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      const chromeObj = typeof window !== 'undefined' ? (window as any).chrome : undefined;
      if (chromeObj && chromeObj.storage && chromeObj.storage.local) {
        chromeObj.storage.local.get(['set-password'], (result: any) => {
          resolve(result['set-password'] || null);
        });
      } else {
        resolve(localStorage.getItem('set-password'));
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Token d'authentification non trouvé.");
      }
      const response = await fetch(SET_PASSWORD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        throw new Error('Erreur lors du changement de mot de passe');
      }
      setSuccess('Mot de passe changé avec succès !');
      setPassword('');
      if (onPasswordSet) onPasswordSet();
    } catch (err: any) {
      setError(err.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
      // Suppression du token 'set-password' du storage
      const chromeObj = typeof window !== 'undefined' ? (window as any).chrome : undefined;
      if (chromeObj && chromeObj.storage && chromeObj.storage.local) {
        chromeObj.storage.local.remove(['set-password']);
      } else {
        localStorage.removeItem('set-password');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <h2 className="text-2xl font-bold mb-6 text-center">Changer le mot de passe</h2>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Nouveau mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Changement...' : 'Changer le mot de passe'}
        </button>
      </form>
    </div>
  );
};

export default SetPassword; 