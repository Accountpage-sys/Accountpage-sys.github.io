# GitHub Pages Deployment Troubleshooting

## Issue: Seeing "pages-build-deployment" workflow

If you see a workflow called "pages-build-deployment" that you didn't create, this means GitHub Pages is set to deploy from a branch instead of using GitHub Actions.

### Fix:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Source", you'll see one of these options:
   - ❌ **"Deploy from a branch"** - This triggers the default workflow
   - ✅ **"GitHub Actions"** - This uses our custom workflow
4. **Change it to "GitHub Actions"**
5. Save the settings
6. The "pages-build-deployment" workflow will stop running

## Verify Your Workflow

After switching to "GitHub Actions", you should see:
- ✅ "Deploy to GitHub Pages" workflow running (the one we created)
- ❌ "pages-build-deployment" should not run anymore

## Common Issues

### 1. Workflow fails with "404" or "Not Found"
- Make sure you've added the required secrets:
  - `VITE_ADMIN_PASSWORD` (required)
  - `VITE_JSONBIN_BIN_ID` (optional)
  - `VITE_JSONBIN_API_KEY` (optional)

### 2. Site shows blank page
- Check if your repository name matches the base path in `vite.config.js`
- If your repo is `your-repo-name`, update `vite.config.js`:
  ```javascript
  base: '/your-repo-name/'
  ```

### 3. Routes don't work (404 on refresh)
- This is normal for client-side routing on GitHub Pages
- Users need to navigate from the home page
- Consider using a custom domain for better routing support

## Check Workflow Status

1. Go to **Actions** tab
2. Click on the latest "Deploy to GitHub Pages" run
3. Check if all steps completed successfully:
   - ✅ Checkout
   - ✅ Setup Node.js
   - ✅ Install dependencies
   - ✅ Build
   - ✅ Setup Pages
   - ✅ Upload artifact
   - ✅ Deploy to GitHub Pages

If any step fails, check the logs for error messages.

