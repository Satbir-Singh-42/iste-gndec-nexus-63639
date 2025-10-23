# Vercel Deployment Guide for ISTE GNDEC Website

This guide will walk you through deploying your website to Vercel with all environment variables configured properly.

## Prerequisites

1. GitHub, GitLab, or Bitbucket account
2. Vercel account (free at https://vercel.com)
3. Your Gmail credentials for the contact form

## Step 1: Prepare Your Repository

1. **Push your code to GitHub** (or GitLab/Bitbucket):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to https://vercel.com** and sign in
2. Click **"Add New Project"**
3. **Import your repository** from GitHub/GitLab/Bitbucket
4. **Configure Project Settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   
5. **DO NOT DEPLOY YET** - First, add environment variables (next step)

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to your Vercel account
vercel login

# Deploy (will prompt for environment variables)
vercel
```

## Step 3: Configure Environment Variables

You need to set up the following environment variables in Vercel:

### Required Environment Variables:

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `GMAIL_USER` | Gmail address for sending emails | `your-email@gmail.com` |
| `GMAIL_PASSWORD` | Gmail App Password (NOT your regular password) | `abcd efgh ijkl mnop` |
| `GMAIL_TO` | Email address to receive contact form submissions | `recipient@example.com` |

### How to Add Environment Variables in Vercel Dashboard:

1. After importing your project, **before deploying**, click on **"Environment Variables"** tab
2. Or go to **Project Settings** → **Environment Variables**
3. For each variable:
   - **Key:** Enter the variable name (e.g., `VITE_SUPABASE_URL`)
   - **Value:** Paste the actual value
   - **Environments:** Check **Production**, **Preview**, and **Development**
   - Click **"Add"**

4. Add all 5 variables listed above

### Using Vercel CLI to Add Variables:

```bash
vercel env add VITE_SUPABASE_URL
# Enter value when prompted
# Select Production, Preview, Development

vercel env add VITE_SUPABASE_ANON_KEY
vercel env add GMAIL_USER
vercel env add GMAIL_PASSWORD
vercel env add GMAIL_TO
```

## Step 4: Get Gmail App Password

**IMPORTANT:** You cannot use your regular Gmail password. You need a Gmail App Password:

1. Go to your **Google Account** → https://myaccount.google.com
2. Navigate to **Security**
3. Enable **2-Step Verification** (required for App Passwords)
4. Search for **"App Passwords"** or go to https://myaccount.google.com/apppasswords
5. Create a new App Password:
   - **App:** Select "Mail"
   - **Device:** Select "Other (Custom name)"
   - Enter: "ISTE GNDEC Website"
6. Click **"Generate"**
7. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)
8. Use this as your `GMAIL_PASSWORD` in Vercel

## Step 5: Deploy

1. If using Vercel Dashboard, click **"Deploy"** button
2. If using Vercel CLI, run:
   ```bash
   vercel --prod
   ```

3. Wait for deployment to complete (usually 1-2 minutes)
4. You'll get a live URL like: `https://your-project.vercel.app`

## Step 6: Test Your Deployment

1. Visit your Vercel URL
2. Navigate to the **Contact page**
3. Fill out and submit the contact form
4. Verify:
   - ✅ Form submits successfully
   - ✅ You receive an email at the `GMAIL_TO` address
   - ✅ User receives an auto-reply email
   - ✅ Events, Notices, Gallery load from Supabase

## Step 7: Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain (e.g., `istegndec.com`)
3. Follow Vercel's instructions to update DNS records
4. SSL certificate is automatically provisioned

## Troubleshooting

### Environment Variables Not Working

**Problem:** Variables are `undefined` in production

**Solution:**
- ✅ Verify all variables start with `VITE_` (for frontend variables)
- ✅ Check they're added in **Vercel Dashboard** → **Settings** → **Environment Variables**
- ✅ Ensure you selected all environments (Production/Preview/Development)
- ✅ **Redeploy** after adding variables (they're build-time, not runtime)
- ✅ Go to **Deployments** → Click **⋯** → **Redeploy**

### Contact Form Not Working

**Problem:** Email not being sent

**Solutions:**
- ✅ Verify you're using **Gmail App Password**, not regular password
- ✅ Check 2-Step Verification is enabled on your Google Account
- ✅ Confirm `GMAIL_USER`, `GMAIL_PASSWORD`, and `GMAIL_TO` are set correctly
- ✅ Check Vercel function logs: **Project** → **Functions** → **Logs**

### API Route 404 Error

**Problem:** `/api/contact` returns 404

**Solution:**
- ✅ Verify `api/contact.js` file exists in your repository
- ✅ Check `vercel.json` is in the root directory
- ✅ Redeploy the project

### Supabase Not Loading

**Problem:** Events, notices, or gallery not showing

**Solution:**
- ✅ Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
- ✅ Check these are **prefixed with `VITE_`** (required for Vite)
- ✅ Redeploy after adding variables

## How to Redeploy After Changes

### Automatic (Recommended):
Every time you push to your main branch, Vercel automatically redeploys.

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Manual:
1. Go to Vercel Dashboard → **Deployments**
2. Find latest deployment
3. Click **⋯** → **Redeploy**

## Viewing Logs

To debug issues:

1. Go to your project in Vercel Dashboard
2. Click **Deployments**
3. Click on a deployment
4. View **Build Logs** and **Function Logs**

For serverless function logs:
- **Project** → **Functions** → Select `api/contact.js` → **Logs**

## Important Notes

- ✅ The `server/email-server.js` file is **NOT used** on Vercel (it's for local development only)
- ✅ Vercel uses the `api/contact.js` serverless function instead
- ✅ All frontend environment variables **must** start with `VITE_`
- ✅ Backend variables (`GMAIL_*`) don't need the `VITE_` prefix
- ✅ Environment variables are baked into the build at build-time
- ✅ Changes to environment variables require a new deployment

## Local Development vs Production

**Local Development:**
- Frontend: `npm run dev` (port 5000)
- Email Server: `npm run email-server` (port 3001)
- Contact form calls: `http://localhost:3001/api/contact`

**Production (Vercel):**
- Frontend: Served from `dist/` folder
- Email API: Serverless function at `/api/contact`
- Contact form calls: `https://your-domain.vercel.app/api/contact`

## Technical Details

### vercel.json Configuration

The `vercel.json` file includes important configurations:

```json
{
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ],
  "functions": {
    "api/contact.js": {
      "maxDuration": 10
    }
  }
}
```

**Why `/((?!api/).*)`?**
- This regex uses a negative lookahead to match all paths EXCEPT those starting with `api/`
- Routes like `/`, `/events`, `/contact` → rewrite to `/index.html` (React Router)
- Routes like `/api/contact` → handled by the serverless function ✅
- Without this exclusion, the API route would be blocked and return HTML instead of processing the request

**IMPORTANT:** Do not change the rewrite pattern to `/(.*)`as this will break the contact form API!

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set correctly
3. Ensure Gmail App Password is configured properly
4. Check Vercel documentation: https://vercel.com/docs

---

**Your website is now live on Vercel!** 🎉
