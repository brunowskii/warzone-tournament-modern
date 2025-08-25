@echo off
chcp 65001 >nul
echo 🚀 Quick Setup - Warzone Tournament System

echo 📦 Installing dependencies...
call npm install

echo 🔧 Setting up database...
call npx prisma generate
call npx prisma db push

echo 🌱 Seeding database...
call npm run db:seed

echo 🏗️ Building application...
call npm run build

echo.
echo ✅ Setup completed! Your app is ready for deployment.
echo.
echo 📝 Add these environment variables to Vercel:
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
