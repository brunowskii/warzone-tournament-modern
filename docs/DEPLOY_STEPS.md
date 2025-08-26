# Deployment Steps Guide

## 🚀 Complete Deployment Process

This guide walks you through deploying the Warzone Tournament Management System to production.

## 📋 Prerequisites

### Required Accounts
- [ ] Vercel account (free tier available)
- [ ] Supabase account (free tier available)
- [ ] GitHub account (for repository)

### Required Software
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## 🔧 Step 1: Repository Setup

### 1.1 Clone the Repository
```bash
git clone https://github.com/your-username/warzone-tournament-modern.git
cd warzone-tournament-modern
```

### 1.2 Install Dependencies
```bash
npm install
# or
pnpm install
```

### 1.3 Verify Installation
```bash
npm run type-check
npm run lint
```

## 🗄️ Step 2: Database Setup

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and project name
4. Set database password (save this!)
5. Choose region closest to your users
6. Wait for project to be ready

### 2.2 Get Database Credentials
1. Go to Project Settings > Database
2. Copy the connection string
3. Note the project URL and anon key

### 2.3 Configure Environment Variables
Create `.env.local` file:
```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:6543/postgres?pgbouncer=true&sslmode=require&connection_limit=1"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-SUPABASE-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SUPABASE-SERVICE-ROLE-KEY]"

# Owner Access
OWNER_EMAIL="admin@yourdomain.com"
OWNER_PASSWORD="[SECURE-PASSWORD]"
OWNER_OVERRIDE_SECRET="[SECURE-RANDOM-STRING]"

# Authentication
NEXTAUTH_SECRET="[GENERATE-RANDOM-SECRET]"
NEXTAUTH_URL="http://localhost:3000"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_LOCALE="en"
NEXT_PUBLIC_STORAGE_BUCKET="evidence"
STORAGE_BUCKET="evidence"
NODE_ENV="development"
```

### 2.4 Initialize Database
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database with demo data
npx prisma db seed
```

### 2.5 Verify Database
```bash
# Open Prisma Studio to verify data
npx prisma studio
```

## 🧪 Step 3: Local Testing

### 3.1 Start Development Server
```bash
npm run dev
```

### 3.2 Test Key Features
1. **Homepage**: http://localhost:3000
2. **Tournament List**: http://localhost:3000/en/tournaments
3. **OBS Overlay**: http://localhost:3000/en/obs/leaderboard?tournamentId=WC2024&theme=ice
4. **Admin Login**: http://localhost:3000/auth/login (use MISOKIETI)

### 3.3 Verify Functionality
- [ ] Homepage loads correctly
- [ ] Tournament list displays
- [ ] OBS overlays render
- [ ] Admin dashboard accessible
- [ ] Authentication works
- [ ] Database operations function

## 🚀 Step 4: Vercel Deployment

### 4.1 Install Vercel CLI
```bash
npm i -g vercel
```

### 4.2 Login to Vercel
```bash
vercel login
```

### 4.3 Deploy to Vercel
```bash
vercel --prod
```

### 4.4 Configure Environment Variables
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add all variables from `.env.local`
5. Update URLs to production domain

### 4.5 Update Production URLs
Update these variables in Vercel:
```bash
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

## 🔄 Step 5: Production Database Setup

### 5.1 Update Database URL
Use the pooled connection string for production:
```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true&sslmode=require&connection_limit=1"
```

### 5.2 Run Production Migrations
```bash
# Generate Prisma client
npx prisma generate

# Push schema to production
npx prisma db push

# Seed production database
npx prisma db seed
```

### 5.3 Verify Production Database
```bash
# Check connection
npx prisma db pull

# Verify data
npx prisma studio
```

## 🔒 Step 6: Security Configuration

### 6.1 Supabase Row Level Security
Enable RLS policies in Supabase dashboard:
1. Go to Authentication > Policies
2. Enable RLS on all tables
3. Create appropriate policies

### 6.2 Environment Variable Security
- [ ] All secrets are in environment variables
- [ ] No hard-coded passwords
- [ ] Service role key is server-only
- [ ] Owner credentials are secure

### 6.3 Access Control
- [ ] Admin access via environment variables
- [ ] Team access codes generated securely
- [ ] Audit logging enabled
- [ ] RBAC implemented

## 📊 Step 7: Performance Optimization

### 7.1 Build Optimization
```bash
# Build for production
npm run build

# Check bundle size
npm run analyze
```

### 7.2 Caching Strategy
- [ ] Static pages cached
- [ ] API responses optimized
- [ ] Images optimized
- [ ] Fonts optimized

### 7.3 Monitoring Setup
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring set up

## 🧪 Step 8: Final Testing

### 8.1 Production Testing Checklist
- [ ] Homepage loads in <3 seconds
- [ ] Tournament list displays correctly
- [ ] OBS overlays render properly
- [ ] Admin dashboard accessible
- [ ] Authentication functional
- [ ] Database operations work
- [ ] All API endpoints return 200
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility tested

### 8.2 Performance Testing
```bash
# Run Lighthouse audit
npm run lighthouse

# Check Core Web Vitals
# Use Chrome DevTools Performance tab
```

### 8.3 Security Testing
- [ ] No secrets in client bundles
- [ ] API endpoints secured
- [ ] Authentication flows work
- [ ] RBAC enforced
- [ ] Audit logs functional

## 📈 Step 9: Go Live

### 9.1 Pre-Launch Checklist
- [ ] All tests passing
- [ ] Performance optimized
- [ ] Security verified
- [ ] Documentation complete
- [ ] Backup strategy in place
- [ ] Monitoring active
- [ ] Support channels ready

### 9.2 Launch Steps
1. **Announce to team**: Notify stakeholders
2. **Monitor closely**: Watch for issues
3. **Gather feedback**: Collect user input
4. **Iterate quickly**: Fix issues promptly

### 9.3 Post-Launch Monitoring
- [ ] Monitor error rates
- [ ] Track performance metrics
- [ ] Watch user engagement
- [ ] Monitor database performance
- [ ] Check OBS overlay usage

## 🔧 Step 10: Maintenance

### 10.1 Regular Tasks
- [ ] Update dependencies monthly
- [ ] Monitor performance weekly
- [ ] Review security monthly
- [ ] Backup database daily
- [ ] Update documentation as needed

### 10.2 Scaling Considerations
- [ ] Database connection pooling
- [ ] CDN for static assets
- [ ] Caching strategy
- [ ] Load balancing (if needed)
- [ ] Database optimization

## 🆘 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall dependencies
npm install

# Check TypeScript errors
npm run type-check
```

#### Database Connection Issues
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
npx prisma db pull

# Check Supabase status
# Visit supabase.com/status
```

#### Environment Variable Issues
```bash
# Check Vercel environment variables
vercel env ls

# Pull environment variables
vercel env pull .env.local
```

## 📞 Support Resources

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

### Community Support
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Next.js Community](https://github.com/vercel/next.js/discussions)

### Professional Support
- [Vercel Support](https://vercel.com/support)
- [Supabase Support](https://supabase.com/support)
- [Prisma Support](https://www.prisma.io/support)

---

## 🎉 Success!

Your Warzone Tournament Management System is now deployed and ready for production use!

### Quick Links
- **Production URL**: https://your-domain.vercel.app
- **Admin Dashboard**: https://your-domain.vercel.app/auth/login
- **OBS Overlays**: https://your-domain.vercel.app/en/obs/leaderboard
- **Tournament List**: https://your-domain.vercel.app/en/tournaments

### Next Steps
1. **Train your team** on the admin interface
2. **Set up OBS overlays** for streaming
3. **Create your first tournament**
4. **Invite teams** to register
5. **Start streaming** with live leaderboards!

---

**Happy Tournaments! 🏆**
