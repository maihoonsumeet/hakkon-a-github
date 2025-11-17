# HaKKon-A Supabase Backend - Quick Start

Get up and running in 5 minutes! ⚡

## 1️⃣ Create Supabase Project (2 minutes)

1. Visit [supabase.com](https://supabase.com) and sign up
2. Click **"New Project"**
3. Enter:
   - Project name: `hakkon-a`
   - Database password: (save this somewhere safe)
   - Region: Choose closest to you
4. Click **"Create new project"** and wait ~2 minutes

## 2️⃣ Set Up Database (1 minute)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy **ALL** of `schema.sql` content
4. Paste and click **"Run"**
5. ✅ You should see "Success. No rows returned"

## 3️⃣ Get Your Credentials (30 seconds)

1. Go to **Project Settings** (⚙️ icon in sidebar)
2. Click **API** in the settings menu
3. Copy these two values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **anon public** key (the long JWT token)

## 4️⃣ Configure Your App (1 minute)

1. **Install Supabase client:**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Create `.env` file** in your project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   *(Replace with your actual values from step 3)*

3. **Create these new files** (copy from artifacts):
   - `lib/supabase.ts`
   - `lib/api.ts`
   - `lib/database.types.ts`
   - `db-supabase.ts`

4. **Update App.tsx** - Change line 3:
   ```typescript
   // Change this:
   import { database } from './db';
   
   // To this:
   import { database } from './db-supabase';
   ```

## 5️⃣ Test It! (30 seconds)

```bash
npm run dev
```

Visit `http://localhost:3000` and login:
- **Fan**: `fan@example.com` / `password`
- **Creator**: `creator@example.com` / `password`

Try creating posts, comments, following clubs - it all works with Supabase now! 🎉

## ✨ What You Get

- ✅ **Real database** - No more localStorage limits
- ✅ **Automatic backups** - Your data is safe
- ✅ **Fast queries** - Optimized indexes included
- ✅ **Free tier** - 500MB database, 2GB bandwidth/month
- ✅ **Scalable** - Grows with your app

## 🚀 Deploy to Production

### Vercel (Easiest)

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy! 🎊

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add same environment variables
4. Deploy! 🎊

## 🆘 Troubleshooting

**"Missing Supabase environment variables"**
- Make sure `.env` file exists and has both variables
- Restart dev server: `npm run dev`

**"Failed to fetch"**
- Check your Supabase URL and key are correct
- Verify the SQL schema ran successfully (check Table Editor)

**Data not showing**
- Go to Table Editor in Supabase
- Check if tables have data
- Run the sample data inserts again if needed

## 📚 Full Documentation

See `DEPLOYMENT.md` for detailed setup, security, scaling, and more.

## 🎯 What Changed?

Your app now:
- Reads/writes to Supabase instead of localStorage
- Has a real database with relationships
- Can handle multiple users simultaneously  
- Automatically syncs across devices
- Has proper data persistence

**Your React components didn't change at all!** The API is identical. 🎨