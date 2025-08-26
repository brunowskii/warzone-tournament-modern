# Warzone Tournament Management System

A modern, production-ready tournament management system for Warzone competitions with real-time leaderboards, OBS integration, and comprehensive admin tools.

## 🚀 Features

### 🏆 Tournament Management
- **Dynamic Tournament Creation**: Create tournaments with custom scoring profiles
- **Team Registration**: Automated team code generation and registration
- **Real-time Leaderboards**: Live score updates with position-based multipliers
- **Match Review System**: Evidence-based match approval workflow
- **Score Adjustments**: Manual score adjustments with audit logging

### 📺 OBS Integration
- **Multiple Themes**: Ice, neon, and dark overlay themes
- **Real-time Updates**: Live leaderboard and top fragger data
- **Custom Branding**: URL parameters for color customization
- **Admin Preview**: Built-in preview with copy-to-clipboard functionality
- **Responsive Design**: Works on all OBS canvas sizes

### 🔐 Security & Access Control
- **Environment-driven Access**: No hard-coded secrets, owner access via env vars
- **Role-Based Access Control**: Owner, Admin, Manager, Team, Viewer roles
- **Audit Logging**: Complete action tracking with IP/user agent logging
- **Row Level Security**: Supabase RLS policies for data protection

### 🌍 Internationalization
- **Multi-language Support**: English (EN) and Italian (IT)
- **Dynamic Routing**: Locale-based URL structure
- **Message Files**: Centralized translation management

### 📱 Modern UI/UX
- **Ice-Blue Theme**: Consistent glassmorphism design
- **Responsive Design**: Mobile-first approach
- **Framer Motion**: Smooth animations and transitions
- **Modern Typography**: Orbitron and Rajdhani fonts

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 5.22.0
- **Authentication**: NextAuth.js + Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Internationalization**: next-intl
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/warzone-tournament-modern.git
cd warzone-tournament-modern
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Owner Access (Environment-driven)
OWNER_EMAIL="owner@warzone.com"
OWNER_PASSWORD="your-secure-password"
OWNER_OVERRIDE_SECRET="your-override-secret"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Internationalization
NEXT_PUBLIC_DEFAULT_LOCALE="en"

# Storage
NEXT_PUBLIC_STORAGE_BUCKET="evidence"
STORAGE_BUCKET="evidence"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Database Setup

Generate Prisma client and push schema:

```bash
npm run db:generate
npm run db:push
```

### 5. Seed Demo Data

```bash
npm run seed:demo
```

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄️ Database Schema

The system includes comprehensive models for:

- **Users**: Role-based access control
- **Tournaments**: Tournament configuration and settings
- **Teams**: Team registration and management
- **Players**: Individual player tracking
- **Matches**: Match results and evidence
- **PlayerStats**: Top fragger statistics
- **ScoreAdjustments**: Manual score adjustments
- **AccessCodes**: Role-based access codes
- **AuditLogs**: Complete action tracking
- **Evidence**: File uploads and evidence

## 🔐 Access Codes

The system uses environment-driven access codes:

### Owner Access
- Email: `OWNER_EMAIL` from environment
- Password: `OWNER_PASSWORD` from environment
- Override Secret: `OWNER_OVERRIDE_SECRET` from environment

### Manager Access
- Codes: `Overwatch2025`, `Manager2024`
- Permissions: Match review, score adjustments

### Team Access
- Format: 6-character alphanumeric codes
- Auto-generated during team registration

## 📺 OBS Integration

### Overlay URLs

**Leaderboard Overlay:**
```
/en/obs/leaderboard?tournamentId=TOURNAMENT_CODE&theme=ice
```

**Top Fragger Overlay:**
```
/en/obs/leaderboard?tournamentId=TOURNAMENT_CODE&view=fragger&theme=ice
```

### Available Themes
- `ice`: Ice-blue theme (default)
- `neon`: Neon green theme
- `dark`: Dark theme

### Custom Branding
Add URL parameters for custom colors:
- `bg`: Background color
- `accent`: Accent color
- `stripe`: Stripe color
- `text`: Text color

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   - Connect your GitHub repository to Vercel
   - Configure build settings

2. **Environment Variables**
   - Add all environment variables from `.env.example`
   - Update URLs for production

3. **Database Setup**
   - Run Supabase setup script in SQL Editor
   - Configure RLS policies

4. **Deploy**
   - Push to main branch
   - Vercel will auto-deploy

### Manual Deployment

Use the deployment script:

```bash
scripts/deploy.bat
```

## 📊 API Endpoints

### Tournaments
- `GET /api/tournaments` - List all tournaments
- `POST /api/tournaments` - Create tournament
- `GET /api/tournaments/[code]` - Get tournament details
- `POST /api/tournaments/[code]/register-team` - Register team

### Matches
- `GET /api/matches` - List matches
- `POST /api/matches` - Submit match
- `POST /api/matches/[id]/review` - Review match

### Leaderboard
- `GET /api/leaderboard/[tournamentId]/public` - Public leaderboard
- `GET /api/leaderboard/export` - Export CSV

### Audit Logs
- `GET /api/audit-logs` - List audit logs
- `GET /api/audit-logs/export` - Export CSV

### Team Dashboard
- `GET /api/team/dashboard` - Team dashboard data

### File Upload
- `POST /api/upload` - Upload evidence files

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run seed:demo    # Seed demo data
npm run db:studio    # Open Prisma Studio

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests
npm run test:e2e     # Run E2E tests
```

### Project Structure

```
warzone-tournament-modern/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── ui/               # UI components
│   └── obs/              # OBS components
├── lib/                  # Utility libraries
├── prisma/               # Database schema
├── messages/             # i18n translations
├── docs/                 # Documentation
└── scripts/              # Deployment scripts
```

## 📚 Documentation

- [Vercel Readiness Guide](docs/VERCEL_READINESS.md)
- [Deployment Steps](docs/DEPLOY_STEPS.md)
- [OBS Integration Guide](docs/OBS.md)
- [API Documentation](docs/API.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Check the documentation in the `docs/` folder
- Review the [FAQ](docs/FAQ.md)

## 🎯 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Tournament brackets system
- [ ] Mobile app companion
- [ ] Streamer integration (Twitch/YouTube)
- [ ] Advanced scoring algorithms
- [ ] Multi-game support

---

**Built with ❤️ for the Warzone community**
