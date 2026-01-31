# 🚀 Quick Deploy to Railway - 5 Minutes

## Step 1: Push to GitHub (1 min)
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

## Step 2: Deploy on Railway (2 min)
1. Go to https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select `auto-talent` repository
4. Railway auto-detects Dockerfile and starts building

## Step 3: Add Environment Variables (2 min)

Go to Railway → Your Project → **Variables** tab

**Copy and paste these** (update values):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://gxvrkmueqemyudmnonji.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Step 4: Get Your Supabase Keys

### Supabase Dashboard → Settings → API

**NEXT_PUBLIC_SUPABASE_ANON_KEY:**
- Copy `anon` `public` key

**SUPABASE_SERVICE_ROLE_KEY:**
- Copy `service_role` `secret` key (⚠️ Keep secret!)

## Step 5: Configure Supabase Redirects

### Supabase Dashboard → Authentication → URL Configuration

After deployment, add your Railway URL:

**Site URL:**
```
https://your-app.railway.app
```

**Redirect URLs:**
```
https://your-app.railway.app/auth/callback
https://your-app.railway.app/api/auth/callback
```

---

## ✅ Done!

Your app is live at: `https://your-app.railway.app`

**Next steps:**
- Test login/signup
- Upload profile picture
- Create a resume
- Monitor Railway logs

---

## 📖 Need Help?

**Full Guide:** [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)
**Environment Variables:** [.env.example](.env.example)

---

## 🔧 Files Created

✅ `railway.toml` - Railway configuration
✅ `Dockerfile` - Docker build instructions
✅ `.dockerignore` - Excluded files
✅ `next.config.ts` - Updated with standalone mode
✅ `.env.example` - Environment variables template

---

## 💡 Pro Tips

1. **Use Railway CLI** for faster deployments:
   ```bash
   npm i -g @railway/cli
   railway login
   railway link
   railway up
   ```

2. **Monitor logs:**
   ```bash
   railway logs
   ```

3. **Set custom domain** in Railway → Settings → Domains

4. **Enable auto-deploy** from GitHub (already configured!)

---

## 🐛 Common Issues

**Build fails?**
```bash
# Test locally first
npm run build
```

**Can't login?**
- Check Supabase redirect URLs
- Verify environment variables

**Images not loading?**
- Check Supabase storage is public
- Verify storage policies

---

**Happy Deploying!** 🎉
