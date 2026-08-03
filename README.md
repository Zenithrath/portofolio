# Next Portfolio

A modern, full-stack portfolio website built with Next.js App Router, Supabase, and AI-powered chat assistant. Features a cyberpunk-inspired design with GSAP animations, real-time dashboard management, and an intelligent Q&A bot.

## Features

### Public Portfolio
- **Hero Section** — Animated pixel reveal intro with glitch accents and cursor interaction
- **Skills Showcase** — Categorized skills display (Tech, Hard, Soft) with proficiency indicators
- **Projects Gallery** — Featured projects with thumbnails, tags, and external links
- **Certificates** — Verified credentials with issuer information
- **Experience Timeline** — Work, education, and organization history
- **Contact Section** — Multiple contact channels (Email, WhatsApp, Social)
- **Quote Section** — Dynamic quotes with smooth transitions

### AI Portfolio Assistant (Ask DJ)
- Conversational AI powered by OpenRouter API
- Real-time Q&A about portfolio, skills, and experience
- Smart contact detection for hiring inquiries
- LocalStorage conversation memory
- Support for casual conversation beyond portfolio topics

### Admin Dashboard
- Secure authentication via Supabase Auth (login, registration, email confirmation)
- Direct CRUD management for:
  - Personal profile & bio
  - Skills (with categories and sorting)
  - Projects (with thumbnails and tags)
  - Certificates
  - Work & education experiences
  - Contact information
  - CV/resume uploads
- Real-time preview of changes

### Design & UX
- Dark cyberpunk theme with orange accent colors
- GSAP scroll-triggered animations
- Responsive design for all screen sizes
- Glitch text effects and pixel reveal transitions
- Swiper carousel components
- Motion (Framer Motion) animations

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Animations | GSAP, Motion (Framer Motion) |
| UI Components | Headless UI, Lucide Icons |
| Carousel | Swiper |
| AI Chat | OpenRouter API |
| Deployment | Vercel |

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── portfolio/        # Portfolio data API
│   │   └── portfolio-chat/   # AI chat endpoint
│   ├── auth/
│   │   ├── login/            # Login page
│   │   └── callback/         # Auth callback handler
│   ├── dashboard/            # Admin dashboard
│   ├── page.tsx              # Public portfolio homepage
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── robots.ts             # SEO robots config
│   └── sitemap.ts            # Dynamic sitemap
├── components/
│   ├── portfolio/            # Public-facing components
│   │   ├── HeroSection.jsx
│   │   ├── SkillsSection.jsx
│   │   ├── ProjectsSection.jsx
│   │   ├── CertificatesSection.jsx
│   │   ├── ExperienceSection.jsx
│   │   ├── ContactSection.jsx
│   │   ├── QuoteSection.jsx
│   │   ├── FooterSection.jsx
│   │   ├── PortfolioClient.tsx
│   │   └── PortfolioAssistant.tsx
│   └── dashboard/            # Admin panel components
│       ├── DashboardClient.tsx
│       ├── Sidebar.tsx
│       ├── PersonalPanel.tsx
│       ├── SkillsPanel.tsx
│       ├── ProjectsPanel.tsx
│       ├── CertificatesPanel.tsx
│       ├── ExperiencePanel.tsx
│       ├── ContactPanel.tsx
│       ├── QuotePanel.tsx
│       └── CvPanel.tsx
├── lib/
│   ├── supabase/             # Supabase client configs
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── middleware.ts
│   │   ├── config.ts
│   │   └── public.ts
│   └── portfolio-data.ts     # Data fetching utilities
├── types/
│   └── portfolio.ts          # TypeScript type definitions
├── supabase/
│   ├── portfolio-schema.sql            # Database schema
│   └── next-portfolio-security.sql     # RLS policies
└── public/                   # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm
- A Supabase project (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dijerimek
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Your Supabase anon/public key
   - `OPENROUTER_API_KEY` — OpenRouter API key for AI chat (optional)
   - `NEXT_PUBLIC_SITE_URL` — Your deployed site URL

4. **Initialize database**
   
   Go to your Supabase Dashboard → SQL Editor and run:
   ```sql
   -- 1. Create tables
   \i supabase/portfolio-schema.sql
   
   -- 2. Enable Row Level Security
   \i supabase/next-portfolio-security.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   - Portfolio: [http://localhost:3000](http://localhost:3000)
   - Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Authentication

### First-time Setup

1. Navigate to `/auth/login`
2. Register a new account
3. Confirm your email via the confirmation link
4. Sign in and access `/dashboard`

### Dashboard Access

- **URL**: `/dashboard`
- **Authentication**: Email/password via Supabase Auth
- **No separate admin table** — authenticated users can manage all data

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `personals` | Profile information (name, title, bio, photo, CV) |
| `skills` | Skills with categories (tech/hard/soft) and proficiency |
| `projects` | Portfolio projects with thumbnails and metadata |
| `project_tags` | Many-to-many relationship for project tags |
| `certificates` | Certifications and credentials |
| `experiences` | Work history, education, and organizations |
| `contacts` | Contact channels (email, WhatsApp, social links) |

### Row Level Security (RLS)

- **Public read**: All portfolio data is publicly viewable
- **Authenticated write**: Only signed-in users can create, update, or delete records
- **Storage access**: Authenticated users can upload to the `portfolio` bucket

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio/revalidate` | Trigger ISR revalidation |
| POST | `/api/portfolio-chat` | Send message to AI assistant |

## AI Chat (Ask DJ)

The portfolio assistant uses OpenRouter API with a free model to answer visitor questions.

### Features
- Real-time Q&A about portfolio content
- Automatic contact detection for hiring inquiries
- Conversation memory via LocalStorage
- Multi-language support (English & Indonesian)
- Context-aware responses using live portfolio data

### Configuration
Set `OPENROUTER_API_KEY` in your environment variables. Without this key, the chat feature displays a "not configured" message.

## Deployment

### Vercel (Recommended)

1. Push to GitHub/GitLab/Bitbucket
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Project Settings
4. Deploy

### Environment Variables for Production

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
OPENROUTER_API_KEY=your_openrouter_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Post-Deployment Checklist

- [ ] Add Vercel callback URL to Supabase Auth settings
- [ ] Run database migrations if not done
- [ ] Upload initial portfolio data via dashboard
- [ ] Test AI chat functionality
- [ ] Verify SEO metadata and sitemap

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for personal portfolio use. Modify and customize as needed for your own portfolio.

## Acknowledgments

- [Next.js](https://nextjs.org/) — React framework
- [Supabase](https://supabase.com/) — Backend-as-a-Service
- [GSAP](https://greensock.com/gsap/) — Animation library
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [OpenRouter](https://openrouter.ai/) — AI API aggregator
