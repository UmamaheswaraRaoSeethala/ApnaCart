# 🚀 Vercel Deployment Guide for ApnaCart

## Prerequisites
- Vercel account (free tier available)
- GitHub account (for easy deployment)

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2 Database Migration
Your Prisma schema has been updated to use PostgreSQL. You'll need to:

1. **Create a new migration for PostgreSQL:**
```bash
npx prisma migrate dev --name init_postgres
```

2. **Generate Prisma client:**
```bash
npx prisma generate
```

## Step 2: Deploy to Vercel

### 2.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your ApnaCart repository

### 2.2 Configure Environment Variables
In Vercel dashboard, go to Settings → Environment Variables:

```
DATABASE_URL = [Your PostgreSQL connection string]
```

### 2.3 Add PostgreSQL Database
1. In Vercel dashboard, go to Storage tab
2. Click "Create Database"
3. Choose "PostgreSQL"
4. Copy the connection string to DATABASE_URL

### 2.4 Configure Build Settings
Vercel will auto-detect Next.js, but ensure:
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

## Step 3: Database Setup

### 3.1 Run Migrations
After deployment, you'll need to run migrations. You can:

1. **Use Vercel CLI:**
```bash
npm i -g vercel
vercel env pull .env.local
npx prisma migrate deploy
```

2. **Or add to package.json:**
```json
{
  "scripts": {
    "postinstall": "prisma generate && prisma migrate deploy"
  }
}
```

### 3.2 Seed Database (Optional)
```bash
node scripts/check-db.js
```

## Step 4: Custom Domain (Optional)
1. Go to Vercel dashboard → Domains
2. Add your custom domain
3. Update DNS settings

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |

## Build Configuration

Your `package.json` already has the correct build script:
```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

## Troubleshooting

### Common Issues:
1. **Build fails**: Check environment variables are set
2. **Database connection**: Ensure DATABASE_URL is correct
3. **Migration errors**: Run `prisma migrate deploy` manually

### Useful Commands:
```bash
# Check deployment logs
vercel logs

# Pull environment variables
vercel env pull .env.local

# Deploy from local
vercel --prod
```

## Next Steps After Deployment

1. Test your application on the Vercel URL
2. Add sample vegetables via admin panel
3. Test cart functionality
4. Set up custom domain (optional)
5. Configure analytics (optional)

## Cost Considerations

- **Vercel Free Tier**: 100GB bandwidth, unlimited deployments
- **PostgreSQL**: Free tier available on Vercel
- **Custom Domain**: Free SSL certificate included

Your ApnaCart app is now ready for production! 🎉
