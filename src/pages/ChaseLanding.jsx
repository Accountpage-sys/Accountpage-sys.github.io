import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { refreshUserData } from '../services/users'
import '../styles/ChaseLanding.css'

function ChaseLanding() {
  const [userData, setUserData] = useState(null)
  const [showMessage, setShowMessage] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUserData = async () => {
      const userEmail = localStorage.getItem('userEmail')
      if (!userEmail) {
        navigate('/chase-bank/login')
        return
      }

      // First, try to refresh from server to get latest admin changes
      try {
        const refreshedUser = await refreshUserData(userEmail)
        if (refreshedUser) {
          setUserData(refreshedUser)
        } else {
          // Fallback to localStorage if refresh fails
          const storedData = localStorage.getItem('userData')
          if (storedData) {
            setUserData(JSON.parse(storedData))
          } else {
            navigate('/chase-bank/login')
          }
        }
      } catch (error) {
        // Fallback to localStorage on error
        const storedData = localStorage.getItem('userData')
        if (storedData) {
          setUserData(JSON.parse(storedData))
        } else {
          navigate('/chase-bank/login')
        }
      }
    }

    loadUserData()

    // Refresh data when page becomes visible (user switches back to tab)
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const userEmail = localStorage.getItem('userEmail')
        if (userEmail) {
          try {
            const refreshedUser = await refreshUserData(userEmail)
            if (refreshedUser) {
              setUserData(refreshedUser)
            }
          } catch (error) {
            // Silently fail on background refresh
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [navigate])

  const handleLogout = () => {
    setShowProfileMenu(false)
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userData')
    window.location.href = '/chase-bank/login'
  }

  const handleShortcutClick = (shortcut) => {
    setShowMessage({
      type: 'info',
      text: 'This is a view only page. Contact administrator to activate full access.'
    })
    setTimeout(() => setShowMessage(null), 3000)
  }

  const handleButtonClick = (action) => {
    setShowMessage({
      type: 'info',
      text: 'This is a view only page. Contact administrator to activate full access.'
    })
    setTimeout(() => setShowMessage(null), 3000)
  }

  const handleNavClick = (navItem) => {
    setShowMessage({
      type: 'info',
      text: 'This is a view only page. Contact administrator to activate full access.'
    })
    setTimeout(() => setShowMessage(null), 3000)
  }

  // Don't show loading - render immediately
  // if (!userData) {
  //   return <div className="loading">Loading...</div>
  // }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="chase-bank landing-container">
      {showMessage && (
        <div className={`message-toast ${showMessage.type}`}>
          {showMessage.text}
        </div>
      )}

      <div className="header">
        <div className="header-content">
          <div className="header-logo">
            <img 
              src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/chase-logo.svg`} 
              alt="Chase Bank" 
            />
          </div>
          <div className="profile-container">
            <button 
              className="profile-icon-btn"
              onClick={(e) => {
                e.stopPropagation()
                setShowProfileMenu(!showProfileMenu)
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {showProfileMenu && (
              <>
                <div 
                  className="profile-menu-backdrop" 
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="profile-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="profile-menu-header">
                    <div className="profile-email">{userData?.email}</div>
                  </div>
                  <button className="profile-menu-item" onClick={handleLogout}>
                    <span className="menu-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="greeting">
          <h2>{userData?.greeting || 'Good morning'}</h2>
          <p>{userData?.customerMessage || 'Welcome back!'}</p>
        </div>

        <div className="shortcuts">
          <button className="shortcut-btn" onClick={() => handleShortcutClick('Deposits')}>
            Deposits
          </button>
          <button className="shortcut-btn" onClick={() => handleShortcutClick('Transfer')}>
            Transfer
          </button>
          <button className="shortcut-btn" onClick={() => handleShortcutClick('Zelle®')}>
            Zelle®
          </button>
          <button className="shortcut-btn" onClick={() => handleShortcutClick('Bill pay')}>
            Bill pay
          </button>
        </div>
      </div>

      <div className="accounts-section">
        {userData?.accounts?.map((account, index) => (
          <div key={index} className="account-card">
            <div className="account-header">
              <div className="account-name">{account.name}</div>
            </div>
            <div className="account-label">Available balance</div>
            <div className="account-balance">{formatCurrency(account.availableBalance)}</div>
          </div>
        ))}
      </div>

      <div className="advice-card">
        <div className="advice-content">
          <div className="advice-icon">💳</div>
          <div className="advice-text">
            <p>Take control of your finances with our comprehensive banking solutions.</p>
            <button className="learn-more-btn" onClick={() => handleButtonClick('Learn more')}>
              Learn more
            </button>
          </div>
        </div>
      </div>

      <div className="spending-card">
        <h3>Track spending</h3>
        <p>See spending by category, view trend charts and monitor cash flow.</p>
        <button className="budget-btn" onClick={() => handleButtonClick('Budget & planning')}>
          Go to budget & planning
        </button>
      </div>

      <div className="bottom-nav">
        <div className="nav-item active" onClick={() => handleNavClick('Home')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </div>
        <div className="nav-item" onClick={() => handleNavClick('Pay & transfer')}>
          <span className="nav-icon">∞</span>
          <span className="nav-label">Pay & transfer</span>
        </div>
        <div className="nav-item" onClick={() => handleNavClick('Plan & learn')}>
          <span className="nav-icon">📊</span>
          <span className="nav-label">Plan & learn</span>
        </div>
        <div className="nav-item" onClick={() => handleNavClick('Help')}>
          <span className="nav-icon">?</span>
          <span className="nav-label">Help</span>
        </div>
      </div>
    </div>
  )
}

export default ChaseLanding

