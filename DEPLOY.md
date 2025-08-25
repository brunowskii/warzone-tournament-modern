# 🚀 Deploy Your Warzone Tournament Portal

## 🎯 **Your Supabase Project**
- **URL**: `https://wmwpdlfjytdnsrbfzwmd.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtd3BkbGZqeXRkbnNyYmZ6d21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDc4MTIsImV4cCI6MjA3MTcyMzgxMn0.PZSHDPnHHS4JZNxnwIAg5-A-dkbufb47-M-J0EpQ9EU`

## 📋 **Quick Deployment Steps**

### **Step 1: Get Supabase Credentials**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `wmwpdlfjytdnsrbfzwmd`
3. Go to **Settings** → **API** → Copy **service_role** key
4. Go to **Settings** → **Database** → Copy **Connection string**

### **Step 2: Create GitHub Repository**
1. Go to [GitHub](https://github.com)
2. Click **"New repository"**
3. Name: `warzone-tournament-modern`
4. Make it **Public**
5. **Don't** initialize with README
6. Click **"Create repository"**

### **Step 3: Upload Your Code**
**Option A: Manual Upload**
1. In your new GitHub repo, click **"uploading an existing file"**
2. Drag and drop all your project files
3. Commit the changes

**Option B: Use GitHub Desktop**
1. Download GitHub Desktop
2. Clone your repository
3. Copy your project files
4. Commit and push

### **Step 4: Deploy to Vercel**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click **"Deploy"**

## 🔧 **Environment Variables for Vercel**

Add these in Vercel project settings:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wmwpdlfjytdnsrbfzwmd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtd3BkbGZqeXRkbnNyYmZ6d21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDc4MTIsImV4cCI6MjA3MTcyMzgxMn0.PZSHDPnHHS4JZNxnwIAg5-A-dkbufb47-M-J0EpQ9EU

# Database - Replace [YOUR-PASSWORD] with your actual password
DATABASE_URL="postgresql://postgres.wmwpdlfjytdnsrbfzwmd:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# Add your service role key here
SUPABASE_SERVICE_ROLE_KEY=[PASTE-YOUR-SERVICE-ROLE-KEY-HERE]

# Next.js - Update URL to your Vercel domain after deployment
NEXTAUTH_SECRET=[YOUR-GENERATED-SECRET]
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# Internationalization
NEXT_PUBLIC_DEFAULT_LOCALE=en

# Storage
NEXT_PUBLIC_STORAGE_BUCKET=evidence
STORAGE_BUCKET=evidence
```

## 🗄️ **Database Setup**

In Supabase Dashboard → **SQL Editor**, run:

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidence', 'evidence', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow public read access
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (true);
```

## 🎉 **Success!**

Your app will be live at: `https://your-username.vercel.app`
OBS overlay at: `https://your-username.vercel.app/obs/leaderboard?tournamentId=demo`

## 🎮 **Features Working**
- ✅ Immersive 3D Warzone design
- ✅ Mobile-responsive interface
- ✅ Real-time leaderboards
- ✅ OBS overlay integration
- ✅ Multi-language support
- ✅ Complete tournament management
- ✅ File upload system
- ✅ Role-based access control

---

**🎮 Your Warzone Tournament Portal will be online in about 15 minutes!**
