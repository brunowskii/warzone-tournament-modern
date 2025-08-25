# 🎮 **Supabase Setup Guide - Warzone Tournament System**

## **Quick Setup (3 Steps)**

### **Step 1: Run Quick Setup Script**
```bash
# Windows
scripts\quick-setup.bat

# Or manually:
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run build
```

### **Step 2: Supabase SQL Setup**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project: `giwlzcfqivutenqemehz`
3. Click **"SQL Editor"** → **"New Query"**
4. Copy and paste the contents of `scripts/supabase-setup.sql`
5. Click **"Run"**

### **Step 3: Vercel Environment Variables**
Add these **9 variables** to your Vercel project:

```
DATABASE_URL=postgresql://postgres:Veronapressanac5!@db.giwlzcfqivutenqemehz.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://giwlzcfqivutenqemehz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpd2x6Y2ZxaXZ1dGVucWVtZWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDYxMjMsImV4cCI6MjA3MTcyMjEyM30.Kt_mD97Xw-zhHRn2NRO4t_zi5tUkBFRbW7S72w3gZgQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpd2x6Y2ZxaXZ1dGVucWVtZWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE0NjEyMywiZXhwIjoyMDcxNzIyMTIzfQ.RjXLmYTWplRGghj8vbLtFQuXbPFBRenAnFb7X9d1TY0
NEXTAUTH_SECRET=warzone-tournament-secret-key-2024-xyz789
NEXTAUTH_URL=https://warzone-tournament-modern.vercel.app
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_STORAGE_BUCKET=evidence
STORAGE_BUCKET=evidence
```

## **What Gets Set Up**

### **✅ Database & Storage**
- PostgreSQL database with all tables
- Storage bucket for evidence files (10MB limit)
- Row Level Security (RLS) policies
- Performance indexes

### **✅ Demo Data**
- **Admin**: `admin@warzone.com`
- **Manager**: `manager@warzone.com`
- **Tournament**: "Warzone Championship 2024"
- **Teams**: Alpha Squad, Beta Warriors, Gamma Elite
- **Matches**: Sample data with scores

### **✅ Security Features**
- Role-based access control
- Encrypted file storage
- Audit logging
- Real-time updates

## **Test Your Setup**

```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) FROM users;        -- Should return 2
SELECT COUNT(*) FROM tournaments;  -- Should return 1
SELECT COUNT(*) FROM teams;        -- Should return 3
```

## **Deploy to Vercel**

1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

**Your Warzone Tournament System is ready!** 🎮
