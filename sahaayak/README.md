# Sahaayak

Sahaayak is a next-generation platform for citizen empowerment, transparent governance, and real-time grievance redressal.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **Animations**: GSAP + Lenis
- **Payments**: Stripe

## Project Structure
The project follows a feature-based modular architecture to ensure scalability and maintainability.

- `app/`: Next.js App Router (Citizen, Admin, Open Data portals)
- `components/`: Shared UI and complex components (3D, Maps, Dashboards)
- `features/`: Business logic grouped by feature
- `services/`: External API and service integrations
- `lib/`: Configuration and initialization of 3rd party libraries

## Getting Started
1. Install dependencies: `npm install`
2. Configure environment variables in `.env.local`
3. Run development server: `npm run dev`
