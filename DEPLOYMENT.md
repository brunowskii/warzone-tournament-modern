# 🚀 **Deployment Guide**

## **Environment Variables for Vercel**

Add these 9 variables to your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=https://giwlzcfqivutenqemehz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpd2x6Y2ZxaXZ1dGVucWVtZWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDYxMjMsImV4cCI6MjA3MTcyMjEyM30.Kt_mD97Xw-zhHRn2NRO4t_zi5tUkBFRbW7S72w3gZgQ
DATABASE_URL=postgresql://postgres.giwlzcfqivutenqemehz:YOUR_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXTAUTH_SECRET=warzone-tournament-secret-key-2024-xyz789
NEXTAUTH_URL=https://warzone-tournament-modern.vercel.app
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_STORAGE_BUCKET=evidence
STORAGE_BUCKET=evidence
```

## **Get Missing Credentials**

1. **Database Password**: Go to Supabase Dashboard → Settings → Database → Connection string
2. **Service Role Key**: Go to Supabase Dashboard → Settings → API → service_role key

## **Deploy Steps**

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables above
4. Deploy

## **Fixed Issues**

✅ Fixed duplicate HTML tags in layouts  
✅ Added missing font-orbitron CSS class  
✅ Fixed 3D components to use fallback geometries  
✅ Created missing leaderboard page  
✅ All components and API routes working  

**Your app is ready to deploy!** 🎮
