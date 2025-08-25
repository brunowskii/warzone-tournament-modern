<<<<<<< HEAD
# 🎮 Warzone Tournament Portal

A **next-generation, immersive tournament management platform** for Call of Duty: Warzone, featuring a **cinematic Warzone aesthetic** with **3D interactions**, **real-time updates**, and **professional OBS overlays**.

## 🌟 **NEW: Warzone-Themed Design System**

### **🎨 Visual Design**
- **Cyan Ice & Green Color Scheme**: Primary cyan ice (#00ffff) with green accents
- **Metallic Textures**: HUD-inspired surfaces with cyan edge lighting
- **Military Typography**: Orbitron (headings) + Rajdhani (body) fonts
- **Cinematic Backgrounds**: Gradient overlays with animated elements
- **3D Interactions**: Tilt effects, parallax scrolling, floating animations

### **🎬 3D Elements**
- **Warzone Trophy**: Rotating 3D trophy with metallic reflections
- **Supply Crate**: Parachuting crate with cyan glow effects
- **UAV Radar**: Sweeping radar with animated beam
- **Interactive Cards**: 3D tilt on hover with perspective transforms

### **📱 Responsive Design**
- **Mobile-First**: Optimized for thumb navigation and swipe gestures
- **Floating Navigation**: Bottom nav bar with glowing 3D icons
- **Parallax Scrolling**: Smooth scroll effects with depth
- **Touch Interactions**: Scale and tilt animations on touch

## 🚀 **Features**

### **🏆 Tournament Management**
- **Dynamic Configuration**: BR/Resurgence modes with Solo/Duos/Trios/Quads
- **Real-time Updates**: Live leaderboards with Supabase Realtime
- **Team Registration**: Unique access codes with Activision ID tracking
- **Score Submission**: Evidence-based match submissions (2-5 files)
- **Review System**: Admin approval workflow with audit logging

### **📊 Leaderboards & Scoring**
- **Warzone Portal System**: Position-based multipliers (1st=2.0, 2nd=1.8, etc.)
- **Best X of Y Matches**: Configurable scoring per tournament
- **Top Fragger Tracking**: Individual player statistics
- **Score Adjustments**: Penalties, rewards, and crash compensation
- **Real-time Updates**: Live score changes with animations

### **📺 OBS Integration**
- **Professional Overlays**: Warzone HUD-style leaderboards
- **Multiple Themes**: Dark, Light, and Transparent modes
- **Real-time Updates**: Auto-refresh with smooth animations
- **Customizable**: CSS variables for branding
- **Browser Source Ready**: Fully compatible with OBS

### **🔐 Authentication & Roles**
- **Role-Based Access**: Admin, Manager, Team roles
- **Team Access Codes**: Unique codes for team registration
- **Supabase Auth**: Secure authentication with RLS
- **Audit Logging**: Complete action tracking

## 🛠 **Tech Stack**

### **Frontend**
- **Next.js 14**: App Router with Server Components
- **TypeScript**: Full type safety
- **TailwindCSS**: Utility-first styling
- **shadcn/ui**: Modern component library
- **Framer Motion**: Smooth animations
- **Three.js**: 3D interactions and effects

### **Backend**
- **PostgreSQL**: Robust database
- **Prisma ORM**: Type-safe database access
- **Supabase**: Auth, Storage, Realtime
- **Next.js API Routes**: Serverless functions

### **3D & Animations**
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers and abstractions
- **Three.js**: 3D graphics library
- **Framer Motion**: Animation library

## 🎨 **Design System**

### **Color Palette**
```css
/* Primary Colors */
--warzone-cyan: 180 100% 50%;     /* Cyan Ice */
--warzone-cyan-glow: 180 100% 60%; /* Cyan Glow */
--warzone-green: 120 100% 40%;    /* Green */
--warzone-green-glow: 120 100% 50%; /* Green Glow */

/* HUD Colors */
--hud-gold: 45 100% 60%;          /* Gold */
--hud-silver: 0 0% 85%;           /* Silver */
--hud-bronze: 25 100% 55%;        /* Bronze */
```

### **Typography**
```css
/* Headings */
font-family: 'Orbitron', monospace;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.1em;

/* Body Text */
font-family: 'Rajdhani', sans-serif;
```

### **Animations**
```css
/* Floating Animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Glow Pulse */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
  50% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.8); }
}

/* XP Counter */
@keyframes xp-counter {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database
- Supabase account

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd warzone-tournament-modern

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your Supabase credentials

# Set up database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

### **Environment Variables**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url

# Storage
STORAGE_BUCKET=your_storage_bucket
```

## 📱 **Mobile Experience**

### **Design Features**
- **Floating Bottom Navigation**: Glowing 3D icons with smooth transitions
- **Swipe Gestures**: Intuitive card interactions
- **Thumb Navigation**: Optimized for one-handed use
- **Parallax Scrolling**: Depth effects on scroll
- **Touch Feedback**: Scale and tilt animations

### **Responsive Breakpoints**
```css
/* Mobile First */
.mobile-nav {
  @apply fixed bottom-0 left-0 right-0 z-50;
  @apply bg-black/80 backdrop-blur-md border-t border-cyan-500/30;
}

/* Touch Interactions */
.mobile-card:active {
  @apply scale-95;
}
```

## 🎬 **3D Components**

### **Warzone Trophy**
```tsx
<WarzoneTrophy size="lg" className="mx-auto" />
```
- Rotating 3D trophy with metallic reflections
- Cyan glow effects
- Floating animation

### **Supply Crate**
```tsx
<SupplyCrate size="md" />
```
- Parachuting animation
- Cyan glow lines
- Realistic crate design

### **UAV Radar**
```tsx
<UAVRadar size="md" />
```
- Sweeping radar beam
- Animated rings
- HUD-style interface

## 📺 **OBS Integration**

### **Leaderboard Overlay**
```tsx
<OBSLeaderboard 
  tournamentId="tournament-id"
  theme="dark"
  maxEntries={10}
  refreshRate={5000}
/>
```

### **Features**
- **Real-time Updates**: Auto-refresh every 5 seconds
- **Multiple Themes**: Dark, Light, Transparent
- **Smooth Animations**: Framer Motion transitions
- **Professional Design**: Warzone HUD aesthetic
- **Browser Source Ready**: Transparent background support

### **URL Parameters**
```
/obs/leaderboard?tournamentId=abc123&theme=dark
```

## 🎨 **Customization**

### **CSS Variables**
```css
:root {
  --warzone-cyan: 180 100% 50%;
  --warzone-green: 120 100% 40%;
  --metallic-gradient: linear-gradient(135deg, ...);
  --cyan-glow: 0 0 20px rgba(0, 255, 255, 0.5);
}
```

### **Theme Classes**
```css
.metallic-surface { /* Metallic texture */ }
.border-cyan-glow { /* Cyan border glow */ }
.text-cyan-glow { /* Cyan text glow */ }
.btn-warzone { /* Warzone button style */ }
.card-warzone { /* Warzone card style */ }
.tilt-3d { /* 3D tilt effect */ }
.glow-pulse { /* Glow pulse animation */ }
```

## 🔧 **Development**

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

### **File Structure**
```
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalization
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── obs/              # OBS overlay components
│   └── tournament/       # Tournament components
├── lib/                  # Utilities and configs
├── prisma/               # Database schema
├── messages/             # i18n translations
└── tests/                # Test files
```

## 🌍 **Internationalization**

Supports **English** and **Italian** with `next-intl`:
- Route-based locale switching
- Component-level translations
- Dynamic content localization

## 🧪 **Testing**

### **Unit Tests**
```bash
npm run test
```

### **E2E Tests**
```bash
npm run test:e2e
```

### **Test Coverage**
- Component testing with Vitest
- E2E testing with Playwright
- API route testing

## 🚀 **Deployment**

### **Vercel Deployment**
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### **Supabase Setup**
1. Create new Supabase project
2. Run database migrations
3. Configure RLS policies
4. Set up storage buckets

## 📄 **License**

MIT License - see LICENSE file for details.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 🎯 **Roadmap**

- [ ] **Advanced 3D Effects**: More complex Three.js scenes
- [ ] **VR Support**: Virtual reality tournament viewing
- [ ] **Mobile App**: React Native companion app
- [ ] **AI Integration**: Automated match validation
- [ ] **Streaming Integration**: Twitch/YouTube API
- [ ] **Advanced Analytics**: Detailed tournament insights

---

**Built with ❤️ for the Warzone community**
=======
# 🎮 Warzone Tournament Portal

A **next-generation, immersive tournament management platform** for Call of Duty: Warzone, featuring a **cinematic Warzone aesthetic** with **3D interactions**, **real-time updates**, and **professional OBS overlays**.

## 🌟 **NEW: Warzone-Themed Design System**

### **🎨 Visual Design**
- **Cyan Ice & Green Color Scheme**: Primary cyan ice (#00ffff) with green accents
- **Metallic Textures**: HUD-inspired surfaces with cyan edge lighting
- **Military Typography**: Orbitron (headings) + Rajdhani (body) fonts
- **Cinematic Backgrounds**: Gradient overlays with animated elements
- **3D Interactions**: Tilt effects, parallax scrolling, floating animations

### **🎬 3D Elements**
- **Warzone Trophy**: Rotating 3D trophy with metallic reflections
- **Supply Crate**: Parachuting crate with cyan glow effects
- **UAV Radar**: Sweeping radar with animated beam
- **Interactive Cards**: 3D tilt on hover with perspective transforms

### **📱 Responsive Design**
- **Mobile-First**: Optimized for thumb navigation and swipe gestures
- **Floating Navigation**: Bottom nav bar with glowing 3D icons
- **Parallax Scrolling**: Smooth scroll effects with depth
- **Touch Interactions**: Scale and tilt animations on touch

## 🚀 **Features**

### **🏆 Tournament Management**
- **Dynamic Configuration**: BR/Resurgence modes with Solo/Duos/Trios/Quads
- **Real-time Updates**: Live leaderboards with Supabase Realtime
- **Team Registration**: Unique access codes with Activision ID tracking
- **Score Submission**: Evidence-based match submissions (2-5 files)
- **Review System**: Admin approval workflow with audit logging

### **📊 Leaderboards & Scoring**
- **Warzone Portal System**: Position-based multipliers (1st=2.0, 2nd=1.8, etc.)
- **Best X of Y Matches**: Configurable scoring per tournament
- **Top Fragger Tracking**: Individual player statistics
- **Score Adjustments**: Penalties, rewards, and crash compensation
- **Real-time Updates**: Live score changes with animations

### **📺 OBS Integration**
- **Professional Overlays**: Warzone HUD-style leaderboards
- **Multiple Themes**: Dark, Light, and Transparent modes
- **Real-time Updates**: Auto-refresh with smooth animations
- **Customizable**: CSS variables for branding
- **Browser Source Ready**: Fully compatible with OBS

### **🔐 Authentication & Roles**
- **Role-Based Access**: Admin, Manager, Team roles
- **Team Access Codes**: Unique codes for team registration
- **Supabase Auth**: Secure authentication with RLS
- **Audit Logging**: Complete action tracking

## 🛠 **Tech Stack**

### **Frontend**
- **Next.js 14**: App Router with Server Components
- **TypeScript**: Full type safety
- **TailwindCSS**: Utility-first styling
- **shadcn/ui**: Modern component library
- **Framer Motion**: Smooth animations
- **Three.js**: 3D interactions and effects

### **Backend**
- **PostgreSQL**: Robust database
- **Prisma ORM**: Type-safe database access
- **Supabase**: Auth, Storage, Realtime
- **Next.js API Routes**: Serverless functions

### **3D & Animations**
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers and abstractions
- **Three.js**: 3D graphics library
- **Framer Motion**: Animation library

## 🎨 **Design System**

### **Color Palette**
```css
/* Primary Colors */
--warzone-cyan: 180 100% 50%;     /* Cyan Ice */
--warzone-cyan-glow: 180 100% 60%; /* Cyan Glow */
--warzone-green: 120 100% 40%;    /* Green */
--warzone-green-glow: 120 100% 50%; /* Green Glow */

/* HUD Colors */
--hud-gold: 45 100% 60%;          /* Gold */
--hud-silver: 0 0% 85%;           /* Silver */
--hud-bronze: 25 100% 55%;        /* Bronze */
```

### **Typography**
```css
/* Headings */
font-family: 'Orbitron', monospace;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.1em;

/* Body Text */
font-family: 'Rajdhani', sans-serif;
```

### **Animations**
```css
/* Floating Animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Glow Pulse */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
  50% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.8); }
}

/* XP Counter */
@keyframes xp-counter {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database
- Supabase account

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd warzone-tournament-modern

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your Supabase credentials

# Set up database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

### **Environment Variables**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url

# Storage
STORAGE_BUCKET=your_storage_bucket
```

## 📱 **Mobile Experience**

### **Design Features**
- **Floating Bottom Navigation**: Glowing 3D icons with smooth transitions
- **Swipe Gestures**: Intuitive card interactions
- **Thumb Navigation**: Optimized for one-handed use
- **Parallax Scrolling**: Depth effects on scroll
- **Touch Feedback**: Scale and tilt animations

### **Responsive Breakpoints**
```css
/* Mobile First */
.mobile-nav {
  @apply fixed bottom-0 left-0 right-0 z-50;
  @apply bg-black/80 backdrop-blur-md border-t border-cyan-500/30;
}

/* Touch Interactions */
.mobile-card:active {
  @apply scale-95;
}
```

## 🎬 **3D Components**

### **Warzone Trophy**
```tsx
<WarzoneTrophy size="lg" className="mx-auto" />
```
- Rotating 3D trophy with metallic reflections
- Cyan glow effects
- Floating animation

### **Supply Crate**
```tsx
<SupplyCrate size="md" />
```
- Parachuting animation
- Cyan glow lines
- Realistic crate design

### **UAV Radar**
```tsx
<UAVRadar size="md" />
```
- Sweeping radar beam
- Animated rings
- HUD-style interface

## 📺 **OBS Integration**

### **Leaderboard Overlay**
```tsx
<OBSLeaderboard 
  tournamentId="tournament-id"
  theme="dark"
  maxEntries={10}
  refreshRate={5000}
/>
```

### **Features**
- **Real-time Updates**: Auto-refresh every 5 seconds
- **Multiple Themes**: Dark, Light, Transparent
- **Smooth Animations**: Framer Motion transitions
- **Professional Design**: Warzone HUD aesthetic
- **Browser Source Ready**: Transparent background support

### **URL Parameters**
```
/obs/leaderboard?tournamentId=abc123&theme=dark
```

## 🎨 **Customization**

### **CSS Variables**
```css
:root {
  --warzone-cyan: 180 100% 50%;
  --warzone-green: 120 100% 40%;
  --metallic-gradient: linear-gradient(135deg, ...);
  --cyan-glow: 0 0 20px rgba(0, 255, 255, 0.5);
}
```

### **Theme Classes**
```css
.metallic-surface { /* Metallic texture */ }
.border-cyan-glow { /* Cyan border glow */ }
.text-cyan-glow { /* Cyan text glow */ }
.btn-warzone { /* Warzone button style */ }
.card-warzone { /* Warzone card style */ }
.tilt-3d { /* 3D tilt effect */ }
.glow-pulse { /* Glow pulse animation */ }
```

## 🔧 **Development**

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

### **File Structure**
```
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalization
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── obs/              # OBS overlay components
│   └── tournament/       # Tournament components
├── lib/                  # Utilities and configs
├── prisma/               # Database schema
├── messages/             # i18n translations
└── tests/                # Test files
```

## 🌍 **Internationalization**

Supports **English** and **Italian** with `next-intl`:
- Route-based locale switching
- Component-level translations
- Dynamic content localization

## 🧪 **Testing**

### **Unit Tests**
```bash
npm run test
```

### **E2E Tests**
```bash
npm run test:e2e
```

### **Test Coverage**
- Component testing with Vitest
- E2E testing with Playwright
- API route testing

## 🚀 **Deployment**

### **Vercel Deployment**
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### **Supabase Setup**
1. Create new Supabase project
2. Run database migrations
3. Configure RLS policies
4. Set up storage buckets

## 📄 **License**

MIT License - see LICENSE file for details.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 🎯 **Roadmap**

- [ ] **Advanced 3D Effects**: More complex Three.js scenes
- [ ] **VR Support**: Virtual reality tournament viewing
- [ ] **Mobile App**: React Native companion app
- [ ] **AI Integration**: Automated match validation
- [ ] **Streaming Integration**: Twitch/YouTube API
- [ ] **Advanced Analytics**: Detailed tournament insights

---

**Built with ❤️ for the Warzone community**
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
