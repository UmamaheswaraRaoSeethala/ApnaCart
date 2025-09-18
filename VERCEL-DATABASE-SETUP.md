# 🗄️ Vercel Database Setup Guide

## The Problem
Your vegetables are not showing because **Vercel doesn't have access to your local SQLite database**. You need to set up a cloud database.

## ✅ Solution: Set up Vercel Postgres Database

### Step 1: Create Database in Vercel
1. Go to your Vercel project dashboard
2. Click on **"Storage"** tab
3. Click **"Create Database"**
4. Choose **"Postgres"**
5. Name it: `apnacart-db`
6. Click **"Create"**

### Step 2: Get Database Connection String
1. In the database settings, copy the `DATABASE_URL`
2. It looks like: `postgres://username:password@host:port/database`

### Step 3: Add Environment Variable
1. In Vercel project settings
2. Go to **"Environment Variables"**
3. Add new variable:
   - **Name:** `DATABASE_URL`
   - **Value:** [paste your connection string]
   - **Environment:** Production, Preview, Development

### Step 4: Deploy with Database
1. Push your updated code to GitHub:
```bash
git add .
git commit -m "Add PostgreSQL support and database seeding"
git push origin main
```

2. Vercel will automatically redeploy

### Step 5: Run Database Migration & Seeding
After deployment, you need to set up the database:

#### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migration
npx prisma migrate deploy

# Seed the database
npm run db:seed
```

#### Option B: Manual Database Setup
1. Connect to your database using a PostgreSQL client
2. Run the migration SQL manually
3. Insert vegetables using the seed data

### Step 6: Test Your Application
1. Visit your Vercel URL
2. Select a cart type
3. Vegetables should now be visible!

## 🔧 Alternative: Quick Fix with External Database

If you prefer, you can use an external database service:

### Supabase (Free)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get the connection string from Settings → Database
4. Add it as `DATABASE_URL` in Vercel

### PlanetScale (Free)
1. Go to [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get the connection string
4. Add it as `DATABASE_URL` in Vercel

## 📋 What You Need to Do

1. ✅ **Create Vercel Postgres database**
2. ✅ **Add DATABASE_URL environment variable**
3. ✅ **Push updated code to GitHub**
4. ✅ **Run database migration and seeding**
5. ✅ **Test the application**

## 🎯 Expected Result

After completing these steps:
- ✅ Vegetables will be visible on mobile
- ✅ Cart selection will work properly
- ✅ All 33 vegetables will be available
- ✅ Admin panel will work for managing vegetables

## 🚨 Common Issues & Solutions

### Issue: "Environment variable not found"
**Solution:** Make sure DATABASE_URL is set in Vercel environment variables

### Issue: "Database connection failed"
**Solution:** Check that the DATABASE_URL is correct and the database is created

### Issue: "No vegetables showing"
**Solution:** Run the database seeding script after migration

### Issue: "Migration failed"
**Solution:** Try running `npx prisma migrate reset` first, then `npx prisma migrate deploy`

## 📞 Need Help?

If you encounter any issues:
1. Check the Vercel deployment logs
2. Verify environment variables are set
3. Ensure the database is created and accessible
4. Run the seeding script manually

Your ApnaCart will be fully functional once the database is set up! 🎉
