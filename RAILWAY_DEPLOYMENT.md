# Railway Deployment Guide - AutoTalent

Complete guide to deploy AutoTalent on Railway.app

---

## 🚀 Quick Deploy

### Prerequisites
- Railway account (https://railway.app)
- GitHub account with this repository
- Supabase project set up

---

## Step 1: Prepare Your Repository

### 1.1 Ensure all files are committed

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 1.2 Verify Railway configuration files exist

✅ `railway.toml` - Railway configuration
✅ `Dockerfile` - Docker build instructions
✅ `.dockerignore` - Files to exclude from build
✅ `next.config.ts` - Updated with standalone mode

---

## Step 2: Create Railway Project

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `auto-talent` repository
5. Railway will automatically detect the Dockerfile

---

## Step 3: Configure Environment Variables

Go to your Railway project → **Variables** tab

### Required Environment Variables

#### Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=https://gxvrkmueqemyudmnonji.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

#### Next.js Configuration
```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

#### Supabase Service Role (for server-side operations)
```bash
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### Optional Environment Variables

#### API Keys (for AI features)
```bash
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

#### Stripe (for payments - if using Pro plan)
```bash
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

#### Analytics (optional)
```bash
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id_here
```

---

## Step 4: Deploy

1. After adding environment variables, Railway will automatically start building
2. Monitor the build logs in Railway dashboard
3. Wait for deployment to complete (usually 3-5 minutes)
4. Railway will provide you with a URL like: `https://your-app.railway.app`

---

## Step 5: Configure Supabase

### 5.1 Add Railway URL to Supabase

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Railway URL to **Site URL**:
   ```
   https://your-app.railway.app
   ```

3. Add Railway URL to **Redirect URLs**:
   ```
   https://your-app.railway.app/auth/callback
   https://your-app.railway.app/api/auth/callback
   ```

### 5.2 Update CORS if needed

1. Go to Supabase Dashboard → **Settings** → **API**
2. Add Railway URL to allowed origins if CORS issues occur

---

## Step 6: Verify Deployment

### 6.1 Check Application

1. Visit your Railway URL: `https://your-app.railway.app`
2. Test the following:
   - ✅ Home page loads
   - ✅ Sign up/Login works
   - ✅ Dashboard accessible
   - ✅ Profile picture upload works
   - ✅ Resume creation works

### 6.2 Check Logs

```bash
# View logs in Railway dashboard
# Or use Railway CLI:
railway logs
```

---

## Troubleshooting

### Issue: Build Fails

**Check:**
- ✅ All dependencies in `package.json`
- ✅ `next.config.ts` has `output: 'standalone'`
- ✅ Node version matches (>= 20.0.0)

**Solution:**
```bash
# Rebuild locally first
npm run build

# If successful, commit and push
git add .
git commit -m "Fix build"
git push
```

### Issue: Environment Variables Not Working

**Check:**
- ✅ All required env vars are set in Railway
- ✅ No typos in variable names
- ✅ Values are not wrapped in quotes

**Solution:**
- Restart deployment after adding variables
- Check Railway logs for specific errors

### Issue: Supabase Connection Fails

**Check:**
- ✅ `NEXT_PUBLIC_SUPABASE_URL` is correct
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- ✅ Railway URL added to Supabase redirect URLs

**Solution:**
```bash
# Test Supabase connection
curl https://gxvrkmueqemyudmnonji.supabase.co/rest/v1/
```

### Issue: Profile Pictures Not Loading

**Check:**
- ✅ Supabase storage bucket `autotalent_images` is public
- ✅ Storage policies are applied
- ✅ Railway URL added to `next.config.ts` remote patterns

**Solution:**
- Verify bucket is public in Supabase
- Check storage policies in Supabase dashboard
- Ensure `gxvrkmueqemyudmnonji.supabase.co` is in `next.config.ts`

### Issue: 404 Errors on Routes

**Check:**
- ✅ `output: 'standalone'` is in `next.config.ts`
- ✅ All pages are in `/app` directory
- ✅ Server components are properly configured

**Solution:**
```bash
# Clear build cache and rebuild
rm -rf .next
npm run build
```

---

## Railway CLI (Optional)

### Install Railway CLI

```bash
npm i -g @railway/cli
```

### Login to Railway

```bash
railway login
```

### Link Project

```bash
railway link
```

### Deploy from CLI

```bash
railway up
```

### View Logs

```bash
railway logs
```

### Set Environment Variable

```bash
railway variables set KEY=value
```

---

## Custom Domain (Optional)

### Add Custom Domain

1. Go to Railway project → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `yourdomain.com`
4. Add DNS records to your domain provider:
   ```
   Type: CNAME
   Name: @
   Value: [provided by Railway]
   ```

5. Wait for DNS propagation (up to 48 hours)

### SSL Certificate

Railway automatically provides SSL certificates for custom domains.

---

## Monitoring & Maintenance

### Health Check

Railway automatically monitors your application health.

### Logs

- View in Railway dashboard
- Or use CLI: `railway logs`

### Metrics

- CPU usage
- Memory usage
- Request count
- Response times

All available in Railway dashboard.

### Auto-Restart

Railway will automatically restart your application if it crashes.

---

## Scaling (Optional)

### Vertical Scaling

1. Go to Railway project → **Settings**
2. Adjust resources (CPU, Memory)
3. Click **"Save"**

### Horizontal Scaling

Railway supports horizontal scaling:
1. Go to **Settings** → **Deployments**
2. Configure replicas
3. Railway handles load balancing

---

## Cost Estimation

Railway pricing:
- **Hobby Plan**: $5/month (500 hours execution time)
- **Pro Plan**: $20/month (unlimited execution time)

Estimated costs for AutoTalent:
- Small (<100 users): **Hobby Plan** sufficient
- Medium (100-1000 users): **Pro Plan** recommended
- Large (>1000 users): **Pro Plan** + vertical scaling

---

## Backup & Rollback

### Automatic Backups

Railway keeps deployment history:
1. Go to **Deployments** tab
2. View all past deployments
3. Click any deployment to rollback

### Manual Rollback

```bash
# Using CLI
railway rollback
```

### Database Backup

Supabase automatically backs up your database:
- Go to Supabase → **Database** → **Backups**
- Download backup if needed

---

## Security Best Practices

✅ **Environment Variables**
- Never commit `.env` files
- Use Railway's variable management
- Rotate keys regularly

✅ **API Keys**
- Use different keys for development/production
- Limit API key permissions
- Monitor usage

✅ **Supabase**
- Enable RLS (Row Level Security)
- Use service role key only for server actions
- Keep anon key for client-side

✅ **CORS**
- Limit allowed origins
- Use specific URLs, not wildcards

---

## Continuous Deployment

Railway automatically deploys when you push to main branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway automatically detects push and deploys
```

---

## Environment-Specific Deployments

### Staging Environment

1. Create new Railway project
2. Connect to `staging` branch
3. Use different environment variables
4. Test before merging to main

### Production Environment

1. Use `main` branch
2. Production environment variables
3. Custom domain configured
4. Monitoring enabled

---

## Summary Checklist

Before going live:

### Code
- ✅ All features tested locally
- ✅ Build succeeds: `npm run build`
- ✅ No console errors
- ✅ `output: 'standalone'` in next.config

### Railway
- ✅ Project created and linked
- ✅ All environment variables set
- ✅ Build succeeds
- ✅ Application accessible via Railway URL

### Supabase
- ✅ Database migrated (profile_pic column)
- ✅ Storage bucket created
- ✅ Storage policies applied
- ✅ Railway URL added to redirect URLs

### Testing
- ✅ Authentication works
- ✅ Profile picture upload works
- ✅ Resume generation works
- ✅ All pages accessible

---

## Support

For issues:
- **Railway**: https://railway.app/help
- **Supabase**: https://supabase.com/docs
- **Next.js**: https://nextjs.org/docs

---

## Configuration Files Reference

### railway.toml
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "npm start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### Dockerfile
See `Dockerfile` in project root - optimized multi-stage build for Next.js 15

### next.config.ts
```typescript
output: 'standalone', // Required for Docker
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "gxvrkmueqemyudmnonji.supabase.co",
      port: "",
      pathname: "/storage/v1/object/public/**",
    },
  ],
}
```

---

**Deployment Complete!** 🎉

Your AutoTalent application is now live on Railway.

Remember to:
- Monitor logs regularly
- Update dependencies
- Back up your database
- Test before major updates
