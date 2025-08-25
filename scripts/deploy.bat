<<<<<<< HEAD
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
call npm run db:seed
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
echo - Admin User: admin@warzone.com
echo - Manager User: manager@warzone.com
echo - Demo Tournament: Warzone Championship 2024
echo.
echo 🚀 Next Steps:
echo 1. Add environment variables to Vercel
echo 2. Deploy to Vercel
echo 3. Run Supabase setup script in SQL Editor
echo.
echo 📝 Environment Variables for Vercel:
echo DATABASE_URL=postgresql://postgres:Veronapressanac5!@db.giwlzcfqivutenqemehz.supabase.co:5432/postgres
echo NEXT_PUBLIC_SUPABASE_URL=https://giwlzcfqivutenqemehz.supabase.co
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpd2x6Y2ZxaXZ1dGVucWVtZWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDYxMjMsImV4cCI6MjA3MTcyMjEyM30.Kt_mD97Xw-zhHRn2NRO4t_zi5tUkBFRbW7S72w3gZgQ
echo SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpd2x6Y2ZxaXZ1dGVucWVtZWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE0NjEyMywiZXhwIjoyMDcxNzIyMTIzfQ.RjXLmYTWplRGghj8vbLtFQuXbPFBRenAnFb7X9d1TY0
echo NEXTAUTH_SECRET=warzone-tournament-secret-key-2024-xyz789
echo NEXTAUTH_URL=https://warzone-tournament-modern.vercel.app
echo NEXT_PUBLIC_DEFAULT_LOCALE=en
echo NEXT_PUBLIC_STORAGE_BUCKET=evidence
echo STORAGE_BUCKET=evidence
echo.
pause
=======
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
call npm run db:seed
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
echo - Admin User: admin@warzone.com
echo - Manager User: manager@warzone.com
echo - Demo Tournament: Warzone Championship 2024
echo.
echo 🚀 Next Steps:
echo 1. Add environment variables to Vercel
echo 2. Deploy to Vercel
echo 3. Run Supabase setup script in SQL Editor
echo.
echo 📝 Environment Variables for Vercel:
echo DATABASE_URL=postgresql://postgres:Veronapressanac5!@db.giwlzcfqivutenqemehz.supabase.co:5432/postgres
echo NEXT_PUBLIC_SUPABASE_URL=https://giwlzcfqivutenqemehz.supabase.co
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpd2x6Y2ZxaXZ1dGVucWVtZWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDYxMjMsImV4cCI6MjA3MTcyMjEyM30.Kt_mD97Xw-zhHRn2NRO4t_zi5tUkBFRbW7S72w3gZgQ
echo SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpd2x6Y2ZxaXZ1dGVucWVtZWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE0NjEyMywiZXhwIjoyMDcxNzIyMTIzfQ.RjXLmYTWplRGghj8vbLtFQuXbPFBRenAnFb7X9d1TY0
echo NEXTAUTH_SECRET=warzone-tournament-secret-key-2024-xyz789
echo NEXTAUTH_URL=https://warzone-tournament-modern.vercel.app
echo NEXT_PUBLIC_DEFAULT_LOCALE=en
echo NEXT_PUBLIC_STORAGE_BUCKET=evidence
echo STORAGE_BUCKET=evidence
echo.
pause
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
