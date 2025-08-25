# Deploy Steps (Vercel)

1. Fork or clone the repo.
2. Create a new Vercel project from this GitHub repo.
3. Set Environment Variables (Project → Settings → Environment Variables):
   - DATABASE_URL
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXTAUTH_SECRET (if using auth)
   - NEXTAUTH_URL (Production)
   - NEXT_PUBLIC_DEFAULT_LOCALE
   - NEXT_PUBLIC_STORAGE_BUCKET
4. Build & Output Settings:
   - Framework: Next.js
   - Install Command: npm install
   - Build Command: npm run vercel-build
   - Output Directory: . (auto)
5. Deploy.

Optional:
- Run migrations separately against your DB before first prod deploy.
