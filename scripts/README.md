# 🚀 Scripts Directory

This directory contains all the setup and deployment scripts for the Warzone Tournament System.

## 📁 Files

### **quick-setup.bat**
- **Purpose**: Quick setup for Windows users
- **What it does**: Installs dependencies, sets up database, seeds data, builds app
- **Usage**: `scripts\quick-setup.bat`

### **deploy.bat**
- **Purpose**: Full deployment script with error checking
- **What it does**: Same as quick-setup but with detailed error handling
- **Usage**: `scripts\deploy.bat`



### **supabase-setup.sql**
- **Purpose**: Supabase database setup
- **What it does**: Creates storage bucket, RLS policies, indexes
- **Usage**: Run in Supabase SQL Editor

## 🎯 Quick Start

1. **Windows**: Run `scripts\quick-setup.bat`
2. **Manual**: Follow the steps in `SUPABASE-SETUP-GUIDE.md`

## 📝 Environment Variables

All scripts will show you the required environment variables for Vercel deployment.

## ✅ What Gets Set Up

- ✅ Node.js dependencies
- ✅ Prisma database schema
- ✅ Demo data (users, tournaments, teams)
- ✅ Application build
- ✅ Supabase storage and security

**Your app will be ready for deployment!** 🎮
