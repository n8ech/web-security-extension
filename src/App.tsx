import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import ContentView from './components/ContentView'
import Login from './components/Login'
import SetPassword from './components/SetPassword'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState<string>('home')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [forceSetPasswordView, setForceSetPasswordView] = useState<boolean>(false)

  useEffect(() => {
    const checkTokenAndSetPassword = async () => {
      const chromeObj = typeof window !== 'undefined' ? (window as any).chrome : undefined;
      if (chromeObj && chromeObj.storage && chromeObj.storage.local) {
        chromeObj.storage.local.get(['token', 'guest-token', 'set-password'], (result: any) => {
          if (result && result['set-password']) {
            setForceSetPasswordView(true);
          } else if (result && (result.token || result['guest-token'])) {
            setIsAuthenticated(true)
          }
          setLoading(false)
        })
      } else {
        // Fallback localStorage
        const token = localStorage.getItem('token') || localStorage.getItem('guest-token')
        const setPassword = localStorage.getItem('set-password')
        if (setPassword) {
          setForceSetPasswordView(true)
        } else if (token) {
          setIsAuthenticated(true)
        }
        setLoading(false)
      }
    }
    checkTokenAndSetPassword()
  }, [])

  const handlePasswordSet = () => {
    const chromeObj = typeof window !== 'undefined' ? (window as any).chrome : undefined;
    if (chromeObj && chromeObj.storage && chromeObj.storage.local) {
      chromeObj.storage.local.remove('set-password', () => {
        setForceSetPasswordView(false);
        // On peut aussi re-checker le token si besoin
      });
    } else {
      localStorage.removeItem('set-password');
      setForceSetPasswordView(false);
    }
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  if (forceSetPasswordView) {
    return (
      <div className="App">
        <SetPassword onPasswordSet={handlePasswordSet} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="App">
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="App">
      <Layout activeView={activeView} setActiveView={setActiveView}>
        <ContentView activeView={activeView} />
      </Layout>
    </div>
  )
}

export default App
