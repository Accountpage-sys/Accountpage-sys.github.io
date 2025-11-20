import { getUsers as fetchUsers } from './userService'

let usersData = []
let lastFetch = 0
const CACHE_DURATION = 60000 // 1 minute cache

const loadUsers = async () => {
  try {
    const now = Date.now()
    // Only fetch if cache expired
    if (now - lastFetch > CACHE_DURATION || usersData.length === 0) {
      usersData = await fetchUsers()
      lastFetch = now
    }
  } catch (error) {
    console.error('Error loading users:', error)
    usersData = []
  }
}

// Load users on module initialization
loadUsers()

export const getUsers = async () => {
  // Always fetch fresh data (with caching)
  await loadUsers()
  return usersData
}

export const authenticateUser = async (email, password) => {
  const users = await getUsers()
  return users.find(
    (user) => user.email === email && user.password === password
  )
}

export const getUserByEmail = async (email) => {
  const users = await getUsers()
  return users.find((user) => user.email === email)
}

// Refresh user data from server (for when admin makes changes)
export const refreshUserData = async (email) => {
  try {
    // Force fresh fetch from JSONBin (bypass cache)
    const users = await fetchUsers()
    const user = users.find((user) => user.email === email)
    if (user) {
      // Update localStorage with fresh data
      localStorage.setItem('userData', JSON.stringify(user))
      return user
    }
    return null
  } catch (error) {
    console.error('Error refreshing user data:', error)
    return null
  }
}


