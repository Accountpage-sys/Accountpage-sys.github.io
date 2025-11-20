// Service to manage users.json file using JSONBin.io (free JSON hosting)
// This allows admin changes to persist and be available to all users

// Get your bin ID from https://jsonbin.io after creating a bin
// Create a free account, create a bin, and paste your bin ID here
// Remove quotes if present (Vite handles this, but just in case)
const JSONBIN_BIN_ID = (import.meta.env.VITE_JSONBIN_BIN_ID || '').trim().replace(/^["']|["']$/g, '')
const JSONBIN_API_KEY = (import.meta.env.VITE_JSONBIN_API_KEY || '').trim().replace(/^["']|["']$/g, '') // Required for private bins

// Debug: Check if env vars are loaded (only in development)
if (import.meta.env.DEV) {
  if (JSONBIN_BIN_ID && !JSONBIN_API_KEY) {
    console.warn('JSONBin: Bin ID is set but API Key is missing. JSONBin features will not work.')
  } else if (!JSONBIN_BIN_ID && JSONBIN_API_KEY) {
    console.warn('JSONBin: API Key is set but Bin ID is missing. JSONBin features will not work.')
  } else if (!JSONBIN_BIN_ID && !JSONBIN_API_KEY) {
    console.info('JSONBin: Not configured. Using localStorage fallback.')
  }
}

export const getUsers = async () => {
  // If JSONBin is configured, use it as the primary source
  if (JSONBIN_BIN_ID && JSONBIN_API_KEY) {
    try {
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': JSONBIN_API_KEY
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        const users = data.record || []
        // Also update localStorage as cache
        localStorage.setItem('usersData', JSON.stringify(users))
        return users
      } else if (response.status === 401) {
        // 401 Unauthorized - API key is invalid or missing
        throw new Error('JSONBin authentication failed. Please check your API key in GitHub Secrets.')
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }
    } catch (error) {
      // If JSONBin fails, try localStorage cache first
      const cached = localStorage.getItem('usersData')
      if (cached) {
        return JSON.parse(cached)
      }
      // Last resort: local file (for reference/initial setup)
      try {
        const response = await fetch('/users.json')
        const users = await response.json()
        return users
      } catch (fileError) {
        return []
      }
    }
  }

  // JSONBin not configured - use local file (for reference)
  try {
    const response = await fetch('/users.json')
    const users = await response.json()
    return users
  } catch (error) {
    return []
  }
}

export const saveUsers = async (users) => {
  if (!JSONBIN_BIN_ID || !JSONBIN_API_KEY) {
    // Not fully configured - store in localStorage as fallback
    localStorage.setItem('usersData', JSON.stringify(users))
    return { 
      success: false, 
      message: 'JSONBin not configured. To enable sync, create a free account at https://jsonbin.io, create a bin, and set both VITE_JSONBIN_BIN_ID and VITE_JSONBIN_API_KEY in .env file' 
    }
  }

  try {
    const response = await fetch(
      `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY
        },
        body: JSON.stringify(users)
      }
    )

    if (response.ok) {
      // Clear localStorage cache to force fresh fetch on next load
      localStorage.removeItem('usersData')
      return { success: true, message: 'Users updated successfully! Changes are now available to all users.' }
    } else if (response.status === 401) {
      // 401 Unauthorized - API key is invalid or missing
      throw new Error('JSONBin authentication failed. Please check your API key in GitHub Secrets.')
    } else {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to update: HTTP ${response.status}`)
    }
  } catch (error) {
    // Fallback to localStorage
    localStorage.setItem('usersData', JSON.stringify(users))
    return { 
      success: false, 
      message: `Failed to update JSONBin: ${error.message}. Saved to localStorage as backup.` 
    }
  }
}
