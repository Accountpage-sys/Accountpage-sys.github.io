# Regions Bank Clone

A modern web application that clones the Regions Bank mobile banking interface, featuring a login page and account overview landing page.

## Features

- **Login Page**: Secure authentication using JSON-based user data
- **Landing Page**: Account overview with balances, shortcuts, and financial tools
- **User Management**: JSON file-based user storage with account details
- **GitHub Pages Deployment**: Automated deployment via GitHub Actions

## Demo Accounts

- Email: `user@example.com` / Password: `password123`
- Email: `demo@regions.com` / Password: `demo123`

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## User Data

User accounts are stored in `users.json`. Each user object contains:
- `email`: User email address
- `password`: User password
- `accounts`: Array of account objects with:
  - `name`: Account name
  - `type`: Account type (Checking, Savings, etc.)
  - `availableBalance`: Account balance
  - `accountNumber`: Last 4 digits of account number
- `greeting`: Personalized greeting message
- `customerMessage`: Customer appreciation message

## Admin Panel

Access the admin panel at `/admin/login` to manage users:
- **Password**: Set via `VITE_ADMIN_PASSWORD` environment variable (default: `admin123` for development)
- Add, edit, and delete users
- Manage user accounts

**Note**: For production, set a strong password in your `.env` file or GitHub Actions secrets.

### User Data Sync (Optional)

To enable user data synchronization across all users (so admin changes are available to everyone):

1. Create a free account at [JSONBin.io](https://jsonbin.io)
2. Create a new bin (can be private or public)
3. Copy your **Bin ID** from the bin page
4. Get your **API Key** from your account settings (needed for read/write access)
5. Create a `.env` file in the project root:
   ```
   VITE_JSONBIN_BIN_ID=your-bin-id-here
   VITE_JSONBIN_API_KEY=your-api-key-here
   VITE_ADMIN_PASSWORD=your-secure-admin-password
   ```
6. Restart your dev server

**Note**: `VITE_ADMIN_PASSWORD` is optional for local development (defaults to `admin123`), but should be set for production.

**Note**: Both Bin ID and API Key are required for private bins. For public bins, API key is still needed for write access.

Without JSONBin, admin changes are stored in localStorage (browser-specific).

## Deployment

The project is configured for GitHub Pages deployment via GitHub Actions. The workflow automatically builds and deploys the application when changes are pushed to the `main` branch.

### Setup for GitHub Pages

1. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to **Settings** > **Pages**
   - Under "Source", select **"GitHub Actions"** (not "Deploy from a branch")
   - Save the settings

2. **Add Environment Variables**:
   - Go to **Settings** > **Secrets and variables** > **Actions**
   - Click **"New repository secret"**
   - Add these secrets:
     - Name: `VITE_JSONBIN_BIN_ID`, Value: your JSONBin bin ID (optional, for user data sync)
     - Name: `VITE_JSONBIN_API_KEY`, Value: your JSONBin API key (optional, for user data sync)
     - Name: `VITE_ADMIN_PASSWORD`, Value: your admin panel password (required)
   - These will be used during the build process

3. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. **Monitor Deployment**:
   - Go to the **Actions** tab in your repository
   - You'll see the deployment workflow running
   - Once complete, your site will be available at `https://[username].github.io/[repository-name]/`

**Note**: If your repository name is different from `cloneBank`, you may need to update the `base` path in `vite.config.js` to match your repository name (e.g., `base: '/your-repo-name/'`).

## Tech Stack

- React 18
- React Router DOM
- Vite
- CSS3

## License

MIT


