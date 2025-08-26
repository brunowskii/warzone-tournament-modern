@echo off
chcp 65001 >nul
echo 🚀 Starting Warzone Tournament System deployment...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Dependencies check passed

echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully

echo 🔧 Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)
echo ✅ Prisma client generated successfully

echo 🗄️ Pushing database schema...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ❌ Failed to push database schema
    pause
    exit /b 1
)
echo ✅ Database schema pushed successfully

echo 🌱 Seeding database with demo data...
call npm run seed:demo
if %errorlevel% neq 0 (
    echo ❌ Failed to seed database
    pause
    exit /b 1
)
echo ✅ Database seeded successfully

echo 🏗️ Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build application
    pause
    exit /b 1
)
echo ✅ Application built successfully

echo.
echo 🎉 Deployment completed successfully!
echo.
echo 📊 Demo Data Created:
echo - Owner User: owner@warzone.com (password from env)
echo - Demo Tournaments: Warzone Championship 2024, Resurgence Showdown
echo - Sample Teams: BlackCrow Alpha, Shadow Wolves, Phoenix Rising
echo.
echo 🚀 Next Steps:
echo 1. Add environment variables to Vercel
echo 2. Deploy to Vercel
echo 3. Run Supabase setup script in SQL Editor
echo.
echo 📝 Environment Variables for Vercel:
echo DATABASE_URL=your-supabase-database-url
echo NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
echo SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
echo OWNER_EMAIL=your-owner-email
echo OWNER_PASSWORD=your-owner-password
echo OWNER_OVERRIDE_SECRET=your-override-secret
echo NEXTAUTH_SECRET=your-nextauth-secret
echo NEXTAUTH_URL=your-vercel-url
echo NEXT_PUBLIC_DEFAULT_LOCALE=en
echo NEXT_PUBLIC_STORAGE_BUCKET=evidence
echo STORAGE_BUCKET=evidence
echo NEXT_PUBLIC_APP_URL=your-vercel-url
echo NODE_ENV=production
echo.
pause
