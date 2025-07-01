import React, { useState, useEffect, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import SetPassword from './SetPassword';

interface ContentViewProps {
  activeView: string;
}

const ContentView: React.FC<ContentViewProps> = ({ activeView }) => {
  const [securityScore, setSecurityScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (activeView === 'security') {
      setLoading(true);
      setProgress(0); // Reset progress on view change

      const fetchScore = async (url: string) => {
        try {
          // Retrieve token from storage
          const token = await new Promise<string | null>((resolve) => {
            if (chrome && chrome.storage && chrome.storage.local) {
              chrome.storage.local.get(['token', 'guest-token'], (result) => {
                resolve(result.token || result['guest-token'] || null);
              });
            } else {
              resolve(localStorage.getItem('token') || localStorage.getItem('guest-token'));
            }
          });

          if (!token) {
            throw new Error("Token d'authentification non trouvé.");
          }

          const response = await fetch('https://adapting-sloth-tightly.ngrok-free.app/app/score', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ url }),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSecurityScore(data.score || 0);
        } catch (error) {
          console.error("Could not fetch score:", error);
          setSecurityScore(25); // Fallback score
        } finally {
          setLoading(false);
        }
      };

      if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ type: 'GET_ACTIVE_TAB_URL' }, (response) => {
          const currentUrl = response?.url;
          if (currentUrl) {
            fetchScore(currentUrl);
          } else {
            setSecurityScore(25);
            setLoading(false);
          }
        });
      } else {
        // Not in extension context, use dummy data
        setTimeout(() => {
            fetchScore("https://example.com");
        }, 500);
      }
    }
  }, [activeView]);

  useEffect(() => {
    if (activeView === 'security' && !loading) {
      const end = securityScore;
      const duration = 600;
      let startTime: number | null = null;

      const animate = (currentTime: number) => {
        if (!startTime) {
          startTime = currentTime;
        }
        const elapsedTime = currentTime - startTime;
        const currentProgress = Math.min((elapsedTime / duration) * end, end);
        setProgress(currentProgress);

        if (elapsedTime < duration) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeView, loading, securityScore]);

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Accueil</h1>
            <p className="text-gray-600">
              Bienvenue sur l'extension de navigateur. Cette page est la vue d'accueil.
            </p>
          </div>
        );
      case 'download':
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Téléchargement</h1>
            <ul className="space-y-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <li key={item} className="p-3 bg-gray-100 rounded-lg">
                  Fichier téléchargé {item}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'security':
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Sécurité</h1>
            {loading ? (
              <p>Analyse en cours...</p>
            ) : (
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <div style={{ width: 120, height: 120, flexShrink: 0 }}>
                    <CircularProgressbar
                      value={progress}
                      text={`${Math.round(progress)}%`}
                      strokeWidth={12}
                      styles={buildStyles({
                        strokeLinecap: 'round',
                        pathTransition: 'none',
                        pathColor: progress > 75 ? '#10b981' : progress > 50 ? '#f59e0b' : '#ef4444',
                        textColor: '#1f2937',
                        trailColor: '#d1d5db',
                        rotation: 0.625,
                      })}
                      circleRatio={0.75}
                    />
                  </div>
                  <p className="text-lg font-bold text-red-500 mt-2">Score faible</p>
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold">Peu de confiance</h2>
                  <p className="text-gray-600 mt-1">N'entrez aucunes données personnelles ici</p>
                </div>
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Paramètres</h1>
            <p className="text-gray-600 mb-4">
              Il n'y a pas encore de paramètres disponibles.
            </p>
            <div className="flex flex-col items-start gap-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => {
                  if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
                    if (chrome && chrome.storage && chrome.storage.local) {
                      chrome.storage.local.remove(['token'], () => {
                        window.location.reload();
                      });
                    } else {
                      localStorage.removeItem('token');
                      window.location.reload();
                    }
                  }
                }}
              >
                Se déconnecter
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                onClick={() => alert('Fonctionnalité premium à venir !')}
              >
                Passer premium
              </button>
            </div>
          </div>
        );
      case 'set-password':
        return <SetPassword />;
      case 'password':
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Mot de passe</h1>
            <p className="text-gray-600">En cours de développement...</p>
          </div>
        );
      default:
        return <div>Sélectionnez une vue dans le menu</div>;
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      {renderContent()}
    </div>
  );
};

export default ContentView; 