import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import ContentView from './components/ContentView'
import Login from './components/Login'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState<string>('home')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkToken = async () => {
      // Vérifie d'abord dans chrome.storage.local
      const chromeObj = typeof window !== 'undefined' ? (window as any).chrome : undefined;
      if (chromeObj && chromeObj.storage && chromeObj.storage.local) {
        chromeObj.storage.local.get(['token'], (result: any) => {
          if (result && result.token) {
            setIsAuthenticated(true)
          }
          setLoading(false)
        })
      } else {
        // Fallback localStorage
        const token = localStorage.getItem('token')
        if (token) {
          setIsAuthenticated(true)
        }
        setLoading(false)
      }
    }
    checkToken()
  }, [])

  if (loading) {
    return <div>Chargement...</div>
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
