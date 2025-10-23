# Quick Vercel Deployment Checklist

## 🚀 Steps to Deploy

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel"
git push origin main
```

### 2. Import to Vercel
- Go to https://vercel.com
- Click "Add New Project"
- Import your GitHub repository
- Framework: **Vite** (auto-detected)

### 3. Add Environment Variables
**BEFORE deploying**, add these in Vercel:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-16-char-app-password
GMAIL_TO=recipient@example.com
```

**Important:** Use Gmail App Password, not regular password
- Go to https://myaccount.google.com/apppasswords
- Generate new password for "ISTE GNDEC Website"

### 4. Deploy
Click **Deploy** button and wait 1-2 minutes.

### 5. Test
- Visit your live URL
- Test the contact form
- Verify events/notices/gallery load

## ✅ What's Included

- ✅ `api/contact.js` - Serverless function for email
- ✅ `vercel.json` - Routing configuration
- ✅ `.vercelignore` - Files to exclude from deployment

## 📝 Notes

- Local dev: Still use `npm run dev` and `npm run email-server`
- Production: Vercel handles everything automatically
- Changes: Push to GitHub → Auto-deploys

---

For detailed guide, see `VERCEL_DEPLOYMENT.md`
