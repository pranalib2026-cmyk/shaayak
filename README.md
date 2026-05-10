# ಸಹಾಯಕ · Sahaayak

> **"Turning voices into visible action"**  
> A civic grievance and accountability platform for Karnataka, India.

Sahaayak (ಸಹಾಯಕ, *"helper"* in Kannada) lets citizens report civic issues, track real-time progress, and hold government departments accountable — powered by AI-assisted transparency, live maps, and multilingual support.

---

## ✨ Features

| Feature | Status |
|---|---|
| Complaint submission with AI analysis | ✅ Complete |
| Public heatmap dashboard with live map | ✅ Complete |
| Personal complaint tracker (My Complaints) | ✅ Complete |
| Citizen resolution verification (confirm / dispute) | ✅ Complete |
| Evidence & work-proof submission | ✅ Complete |
| Pulse Emergency FAB (one-tap dialing) | ✅ Complete |
| Anonymous complaint posting | ✅ Complete |
| GPS location detection | ✅ Complete |
| Duplicate complaint detection | ✅ Complete |
| Multi-factor AI Trust Score (0–100) | ✅ Complete |
| Bilingual UI — English + Kannada | ✅ Complete |
| Supabase Realtime live updates | ✅ Complete |
| Admin panel | 🔶 Route exists, needs full build |
| Leaderboard live data | 🔶 UI built, API fetch WIP |
| How It Works & Transparency pages | 🔶 Routes exist |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Database / Auth | Supabase (PostgreSQL + RLS + Auth) |
| Realtime | Supabase Realtime (Postgres CDC) |
| Maps | MapLibre GL + react-map-gl (CARTO Voyager) |
| Animations | GSAP + @gsap/react + Framer Motion |
| Charts | Recharts |
| Smooth Scroll | @studio-freight/react-lenis |
| Icons | Lucide React |
| Validation | Zod |
| Fonts | Inter · Noto Sans Kannada · Instrument Serif |

---

## 🗺️ Pages & Routes

| Route | Description |
|---|---|
| `/` | Landing page — cinematic hero, complaint form |
| `/dashboard` | Live civic heatmap (MapLibre + Supabase Realtime) |
| `/dashboard/my-complaints` | Authenticated personal complaint tracker |
| `/ai-verification` | AI trust score & analysis panel |
| `/leaderboard` | Department performance rankings |
| `/track` | Public complaint browser with filters |
| `/transparency` | Governance & SLA compliance metrics |
| `/how-it-works` | Platform explainer |
| `/login` | Supabase Auth — email / password |
| `/admin` | Admin panel (complaint management) |

---

## 🤖 AI Engine

Every complaint passes through a 4-step server-side pipeline (`lib/ai/`):

### Step 1 — Image & Text Analysis (`imageAnalyzer.ts`)
Classifies the issue type (roads, water, electricity, etc.), estimates severity, and maps it to the responsible department (BBMP, BESCOM, BWSSB, etc.).

### Step 2 — Duplicate Detection (`duplicateDetector.ts`)
Queries existing complaints in the same category and ward. Similarity > 85% marks the complaint as a duplicate and links it to the original.

### Step 3 — Multi-Factor Trust Score (`trustScore.ts`)
Scores each complaint 0–100 across six weighted factors:

| Factor | Max Points |
|---|---|
| Description length (>100 chars = full, >30 = partial) | 20 |
| Has photo / video media | 20 |
| Has GPS location | 15 |
| Nearby duplicates (social proof) | 20 |
| User reputation score | 15 |
| Category–AI match | 10 |

Labels: **Highly Trusted** (≥ 90) · **Likely Genuine** (≥ 70) · **Needs Review** (≥ 50) · **Suspicious** (< 50)

### Step 4 — Priority Assignment (`priorityEngine.ts`)
Combines AI severity, duplicate count, and similarity to assign priority: **Low / Medium / High / Critical**, and generates admin recommendations.

---

## 🗄️ Database Schema (Supabase / PostgreSQL)

### Core Tables

| Table | Purpose |
|---|---|
| `profiles` | User profiles with `role` (citizen / admin) |
| `complaints` | Main complaints — category, description, lat/lng, status, priority, trust_score |
| `complaint_media` | Uploaded photos / videos per complaint |
| `complaint_updates` | Work proof updates — media, caption, trust_boost |

### AI Engine Tables

| Table | Purpose |
|---|---|
| `ai_trust_scores` | Per-complaint AI confidence, fake & duplicate probability |
| `duplicate_complaints` | Matched duplicate pairs with similarity % |
| `ai_risk_analysis` | Area danger probability, citizen impact, escalation urgency |
| `ai_recommendations` | Text recommendations per complaint |
| `complaint_scans` | Image scan results (detected objects as JSONB) |

All tables have **Row-Level Security (RLS)** enabled. Citizens can only modify their own complaints; admins can modify all.

---

## 🔑 API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/ai/analyze` | POST | Run full AI pipeline on a complaint |
| `/api/complaints` | GET | List all public complaints |
| `/api/complaints` | POST | Submit new complaint (+ Supabase Storage upload) |
| `/api/complaints/my` | GET | Authenticated user's own complaints |
| `/api/complaints/[id]/feedback` | PATCH | Submit resolution verification (confirmed / disputed) |
| `/api/complaints/[id]/updates` | POST | Submit work-proof evidence |

---

## 🧩 Key Components

**`PulseFAB.tsx`** — Fixed bottom-right emergency button. Expands to one-tap emergency contacts: Police (100), Fire (101), Ambulance (102), Water Emergency (1916), Gas Leak (1906).

**`ComplaintSection.tsx`** — Main submission form on the landing page. Includes 8-category grid, AI grammar auto-fix, GPS detection, media upload (up to 3 files), anonymous toggle, and a two-step AI-then-save submission flow.

**`HeatmapDashboard.tsx`** — Full-screen MapLibre GL map with animated, department-colour-coded markers. Live feed panel, city quick-jump, department filter, and Supabase Realtime subscription for instant updates.

**`EvidenceModal.tsx`** — Framer Motion modal for citizens to upload work-proof photos with captions. Triggers AI image verification and increments the complaint's trust score.

---

## 🌐 Internationalisation

The UI is fully bilingual. Toggle between **English** and **ಕನ್ನಡ (Kannada)** via the language switcher in the navbar. Translations are managed through `LanguageContext.tsx` and stored in the `locales/` directory.

---

## 🎨 Design System

- **Dark hero:** `#0a0a0c` background with cinematic video
- **Light sections:** `#FAFAFA` for forms and dashboards
- **Glassmorphism:** `bg-white/40 backdrop-blur-3xl border border-white/40`
- **Aurora gradient:** cyan → purple → rose, used on CTAs, text highlights, and progress bars
- **Animations:** GSAP scroll-trigger timelines, Framer Motion, CSS `animate-pulse-soft`, `animate-marquee`
- **Fonts:** Inter (body) · Instrument Serif (display headings) · Noto Sans Kannada (Kannada text)

---

## 📐 Architecture

```
Browser
  │
  ├── Next.js App Router (SSR + Client Components)
  │     ├── /                         → Landing + ComplaintSection
  │     ├── /dashboard                → HeatmapDashboard (MapLibre + Realtime)
  │     ├── /dashboard/my-complaints  → MyComplaintsPage + EvidenceModal
  │     ├── /leaderboard              → Department Rankings
  │     ├── /ai-verification          → AI Trust Panel
  │     ├── /track                    → Public complaint browser
  │     └── /login                    → Supabase Auth
  │
  ├── API Routes (app/api/)
  │     ├── /api/ai/analyze           → AI Pipeline (classify → deduplicate → trust → priority)
  │     ├── /api/complaints           → CRUD + Supabase Storage upload
  │     └── /api/complaints/[id]/     → Updates, Feedback
  │
  └── lib/
        ├── ai/       → imageAnalyzer, trustScore, duplicateDetector, priorityEngine
        ├── supabase/ → client.ts, server.ts
        └── scoring/  → Gamification helpers

Supabase (PostgreSQL)
  ├── Tables:   complaints, profiles, complaint_media, complaint_updates
  ├── AI:       ai_trust_scores, duplicate_complaints, ai_risk_analysis
  ├── Storage:  complaints bucket (public)
  ├── Auth:     email / password
  └── Realtime: complaints CDC → dashboard live feed

Global UI
  ├── PulseFAB       (fixed, every page) → emergency dialer
  ├── Navbar         (auth-aware, i18n switcher)
  └── LanguageProvider + SmoothScrollProvider (root layout)
```

---
## 📄 License

This project is licensed under the MIT License. See `LICENSE` for details.
