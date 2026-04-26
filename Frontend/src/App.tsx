import React, { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'

import { Layout } from './components/Layout'
import { AuthForm } from './components/AuthForm'
import { Dashboard } from './components/Dashboard'

const AppContent: React.FC = () => {
  //  Default DARK + persist
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('mode') as 'light' | 'dark') || 'dark'
  })

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('authToken') !== null
  })

  const [userEmail, setUserEmail] = useState<string | null>(() => {
    const token = localStorage.getItem('authToken')
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload?.email || payload?.sub || null
    } catch {
      return null
    }
  })

  //  Apply background + persist mode
  useEffect(() => {
    document.body.style.backgroundColor =
      mode === 'dark' ? '#042743' : 'white'

    localStorage.setItem('mode', mode)
  }, [mode])

  //  Toggle mode
  const toggleMode = () => {
    setMode(prev => {
      const newMode = prev === 'dark' ? 'light' : 'dark'
      toast.success(`${newMode === 'dark' ? 'Dark' : 'Light'} mode enabled`)
      return newMode
    })
  }

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem('authToken', token)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUserEmail(payload?.email || payload?.sub || null)
    } catch {
      setUserEmail(null)
    }
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setUserEmail(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
  }

  return (
    <div
      className={`${
        mode === 'dark'
          ? 'bg-[#042743] text-white'
          : 'bg-white text-black'
      } min-h-screen transition-colors duration-300`}
    >
      <Layout
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
        userEmail={userEmail}
      >
        {isAuthenticated ? (
          <Dashboard mode={mode} userEmail={userEmail} />
        ) : (
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        )}
      </Layout>
    </div>
  )
}

function App() {
  return (
    <>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#374151',
            color: '#fff'
          },
          success: {
            icon: '✅'
          },
          error: {
            icon: '❌'
          }
        }}
      />
    </>
  )
}

export default App