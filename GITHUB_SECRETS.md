# GitHub Secrets Setup Guide

## Required Secrets for GitHub Pages Deployment

To enable JSONBin.io integration and admin authentication on GitHub Pages, you need to add the following secrets to your GitHub repository:

### Steps to Add Secrets:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** for each secret below

### Required Secrets:

#### 1. `VITE_ADMIN_PASSWORD` (Required)
- **Purpose**: Password for accessing the admin panel
- **Example**: `mySecurePassword123!`
- **Note**: Use a strong password for production

#### 2. `VITE_JSONBIN_BIN_ID` (Optional but Recommended)
- **Purpose**: Your JSONBin.io bin ID
- **How to get it**:
  1. Create a free account at [https://jsonbin.io](https://jsonbin.io)
  2. Create a new bin (can be private or public)
  3. Copy the **Bin ID** from the bin page URL or details
- **Example**: `691ef17dae596e708f64ff0d`

#### 3. `VITE_JSONBIN_API_KEY` (Required if using JSONBin)
- **Purpose**: Your JSONBin.io API key for authentication
- **How to get it**:
  1. Go to your JSONBin.io account settings
  2. Navigate to **API Keys** section
  3. Copy your **Master Key** (or create a new one)
- **Example**: `$2b$10$abc123...xyz789`
- **Important Notes**:
  - If your API key contains special characters like `$`, they should work as-is in GitHub Secrets
  - Do NOT add quotes around the value
  - The entire key should be on one line
  - If you're having issues with 401 errors, double-check:
    - The API key is copied correctly (no extra spaces)
    - The API key has write permissions
    - The bin ID matches the bin you created

### Troubleshooting 401 Unauthorized Errors:

If you're getting `401 (Unauthorized)` errors from JSONBin.io:

1. **Verify the secrets are set correctly**:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Make sure both `VITE_JSONBIN_BIN_ID` and `VITE_JSONBIN_API_KEY` are present
   - Check that there are no extra spaces or quotes

2. **Verify the API key has correct permissions**:
   - Log into JSONBin.io
   - Check that your API key (Master Key) has read/write access
   - If using a private bin, the Master Key is required

3. **Check the workflow logs**:
   - Go to **Actions** tab in your repository
   - Click on the latest workflow run
   - Check the "Build" step logs
   - Look for any errors related to environment variables

4. **Re-run the workflow**:
   - After adding/updating secrets, you may need to manually trigger the workflow
   - Go to **Actions** → **Deploy to GitHub Pages** → **Run workflow**

### Testing Locally:

To test with the same secrets locally:

1. Create a `.env` file in the project root:
   ```
   VITE_JSONBIN_BIN_ID=your-bin-id-here
   VITE_JSONBIN_API_KEY=your-api-key-here
   VITE_ADMIN_PASSWORD=your-admin-password-here
   ```

2. Restart your dev server:
   ```bash
   npm run dev
   ```

### Without JSONBin:

If you don't set up JSONBin secrets:
- Admin changes will be stored in `localStorage` (browser-specific)
- Changes won't sync across different browsers/devices
- Users will need to logout/login to see admin changes

With JSONBin configured:
- Admin changes are stored in JSONBin.io (cloud)
- Changes are available to all users immediately
- No logout/login required to see updates

