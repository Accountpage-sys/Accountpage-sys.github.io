import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, saveUsers } from '../services/userService'
import '../styles/AdminDashboard.css'

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check admin authentication
    const isAdmin = localStorage.getItem('isAdminAuthenticated')
    if (isAdmin !== 'true') {
      navigate('/admin/login')
      return
    }

    loadUsers()
  }, [navigate])

  const loadUsers = async () => {
    try {
      const usersData = await getUsers()
      setUsers(usersData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading users:', error)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated')
    window.location.href = '/admin/login'
  }

  const handleDelete = async (index) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter((_, i) => i !== index)
      setUsers(updatedUsers)
      
      const result = await saveUsers(updatedUsers)
      if (result.success) {
        showMessage('User deleted successfully')
        // Reload to get fresh data from JSONBin
        await loadUsers()
      } else {
        showMessage(result.message || 'Failed to delete user')
      }
    }
  }

  const handleEdit = (user, index) => {
    setEditingUser({ ...user, index })
    setShowAddForm(false)
  }

  const handleAdd = () => {
    setEditingUser(null)
    setShowAddForm(true)
  }

  const handleSave = async (userData) => {
    let updatedUsers = [...users]
    
    if (editingUser !== null) {
      // Update existing user
      updatedUsers[editingUser.index] = userData
    } else {
      // Add new user
      updatedUsers.push(userData)
    }
    
    setUsers(updatedUsers)
    
    const result = await saveUsers(updatedUsers)
    if (result.success) {
      showMessage(editingUser !== null ? 'User updated successfully!' : 'User added successfully!')
      // Reload to get fresh data from JSONBin
      await loadUsers()
      setEditingUser(null)
      setShowAddForm(false)
    } else {
      showMessage(result.message || 'Failed to save user')
      // Revert to previous state on error
      await loadUsers()
    }
  }

  const showMessage = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 3000)
  }

  if (loading) {
    return <div className="admin-loading">Loading...</div>
  }

  return (
    <div className="admin-dashboard">
      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      <div className="admin-header">
        <h1>User Management</h1>
        <div className="admin-header-actions">
          <button onClick={handleAdd} className="btn-add">Add New User</button>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </div>

      {(showAddForm || editingUser) && (
        <UserForm
          user={editingUser}
          onSave={handleSave}
          onCancel={() => {
            setShowAddForm(false)
            setEditingUser(null)
          }}
        />
      )}

      <div className="users-list">
        <h2>Users ({users.length})</h2>
        <div className="users-grid">
          {users.map((user, index) => (
            <div key={index} className="user-card">
              <div className="user-card-header">
                <h3>{user.email}</h3>
                <div className="user-actions">
                  <button onClick={() => handleEdit(user, index)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(index)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
              <div className="user-details">
                <p><strong>Password:</strong> {user.password}</p>
                <p><strong>Greeting:</strong> {user.greeting}</p>
                <p><strong>Message:</strong> {user.customerMessage}</p>
                <p><strong>Accounts:</strong> {user.accounts?.length || 0}</p>
                {user.accounts && user.accounts.length > 0 && (
                  <div className="accounts-preview">
                    {user.accounts.map((account, accIndex) => (
                      <div key={accIndex} className="account-preview">
                        <span>{account.name}</span>
                        <span>${account.availableBalance.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: user?.password || '',
    greeting: user?.greeting || 'Good morning',
    customerMessage: user?.customerMessage || 'Thank you for being a customer.',
    accounts: user?.accounts || []
  })

  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'Checking',
    availableBalance: 0,
    accountNumber: ''
  })
  const [editingAccountIndex, setEditingAccountIndex] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      alert('Email and password are required')
      return
    }

    onSave(formData)
  }

  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.accountNumber) {
      alert('Account name and number are required')
      return
    }

    if (editingAccountIndex !== null) {
      // Update existing account
      const updatedAccounts = [...formData.accounts]
      updatedAccounts[editingAccountIndex] = { ...newAccount }
      setFormData({ ...formData, accounts: updatedAccounts })
      setEditingAccountIndex(null)
    } else {
      // Add new account
      setFormData({
        ...formData,
        accounts: [...formData.accounts, { ...newAccount }]
      })
    }

    setNewAccount({
      name: '',
      type: 'Checking',
      availableBalance: 0,
      accountNumber: ''
    })
  }

  const handleEditAccount = (index) => {
    const account = formData.accounts[index]
    setNewAccount({
      name: account.name,
      type: account.type,
      availableBalance: account.availableBalance,
      accountNumber: account.accountNumber
    })
    setEditingAccountIndex(index)
  }

  const handleCancelEditAccount = () => {
    setNewAccount({
      name: '',
      type: 'Checking',
      availableBalance: 0,
      accountNumber: ''
    })
    setEditingAccountIndex(null)
  }

  const handleRemoveAccount = (index) => {
    if (editingAccountIndex === index) {
      handleCancelEditAccount()
    }
    const updatedAccounts = formData.accounts.filter((_, i) => i !== index)
    setFormData({ ...formData, accounts: updatedAccounts })
  }

  return (
    <div className="user-form-overlay">
      <div className="user-form">
        <div className="user-form-header">
          <h2>{user ? 'Edit User' : 'Add New User'}</h2>
          <button onClick={onCancel} className="btn-close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>User Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Greeting</label>
                <input
                  type="text"
                  value={formData.greeting}
                  onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Customer Message</label>
                <input
                  type="text"
                  value={formData.customerMessage}
                  onChange={(e) => setFormData({ ...formData, customerMessage: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Accounts</h3>
            {formData.accounts.map((account, index) => (
              <div key={index} className="account-item">
                <div className="account-info">
                  <strong>{account.name}</strong>
                  <span>{account.type} - ${account.availableBalance.toFixed(2)}</span>
                </div>
                <div className="account-actions">
                  <button
                    type="button"
                    onClick={() => handleEditAccount(index)}
                    className="btn-edit-account"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveAccount(index)}
                    className="btn-remove-account"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="add-account-form">
              <h4>{editingAccountIndex !== null ? 'Edit Account' : 'Add Account'}</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Account Name</label>
                  <input
                    type="text"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    placeholder="e.g., CHECKING *1234"
                  />
                </div>
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    value={newAccount.accountNumber}
                    onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                    placeholder="Last 4 digits"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={newAccount.type}
                    onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
                  >
                    <option>Checking</option>
                    <option>Savings</option>
                    <option>E-Access</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Available Balance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAccount.availableBalance}
                    onChange={(e) => setNewAccount({ ...newAccount, availableBalance: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="account-form-actions">
                <button type="button" onClick={handleAddAccount} className="btn-add-account">
                  {editingAccountIndex !== null ? 'Update Account' : 'Add Account'}
                </button>
                {editingAccountIndex !== null && (
                  <button type="button" onClick={handleCancelEditAccount} className="btn-cancel-edit">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">Save User</button>
            <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDashboard

