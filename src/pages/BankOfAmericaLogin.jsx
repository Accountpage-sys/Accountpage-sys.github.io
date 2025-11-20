import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authenticateUser } from '../services/users'
import '../styles/BankOfAmericaLogin.css'

function BankOfAmericaLogin({ setIsAuthenticated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const user = await authenticateUser(email, password)

    if (user) {
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userEmail', user.email)
      localStorage.setItem('userData', JSON.stringify(user))
      setIsAuthenticated(true)
      navigate('/bank-of-america')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="bank-of-america login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <img 
              src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/bofa-logo.svg`} 
              alt="Bank of America" 
            />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default BankOfAmericaLogin

