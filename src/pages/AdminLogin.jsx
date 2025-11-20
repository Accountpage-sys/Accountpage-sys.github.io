import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AdminLogin.css'

function AdminLogin({ setIsAdminAuthenticated }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Admin password from environment variable, fallback to default for development
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdminAuthenticated', 'true')
      setIsAdminAuthenticated(true)
      navigate('/admin')
    } else {
      setError('Invalid admin password')
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Admin Login</h1>
          <p>Access the user management dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
            />
          </div>

          <button type="submit" className="admin-login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin

