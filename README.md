<div align="center">

# 💰 Monetra

### Smarter money management, built for the modern web

Track income, manage expenses, organize transactions, and connect your real bank accounts — all in one fast, beautifully designed dashboard.

<br />

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-API-E36002?logo=hono&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-PostgreSQL-C5F74F?logo=drizzle&logoColor=black)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?logo=stripe&logoColor=white)
![Plaid](https://img.shields.io/badge/Plaid-Bank_Linking-000000)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

---

## 📖 About

**Monetra** is a full-stack personal finance and expense-tracking platform. It gives users a single, unified place to monitor income and spending, categorize and manage transactions, connect real bank accounts via Plaid, and visualize their financial health through rich, interactive charts.

Beyond the core tracking experience, Monetra ships as a real SaaS product: it includes **Clerk**-powered authentication, a **Stripe** subscription/paywall system that gates premium features, a type-safe **Hono** API layer, and a **PostgreSQL** database managed with **Drizzle ORM** — making it a complete reference implementation of a production-grade finance web app.

---

## ✨ Features

### 🔐 Authentication
- Full sign-up / sign-in flow powered by **Clerk**, including hosted auth pages and session middleware
- Route protection via Next.js middleware (`proxy.ts`) so dashboard and API routes require an authenticated session
- User identity is threaded through every API route and database query, so all data is scoped per-user

### 🏠 Dashboard & Overview
- **Data grid** summary cards for **Remaining**, **Income**, and **Expenses**, each with period-over-period **percentage change** indicators
- Animated count-up figures for balances and totals
- Date-range aware summaries (defaults to the trailing 30 days) with automatic comparison against the previous period
- A friendly **welcome message** component personalized to the logged-in user

### 📊 Data Visualization
- Multiple interchangeable chart types for income vs. expenses over time — **Area**, **Line**, and **Bar** variants — switchable from a single dropdown
- **Pie**, **Radar**, and **Radial** chart variants for category-based spending breakdowns
- A dedicated **spending-by-category pie chart** with custom tooltips
- Built with **Recharts**, with loading skeletons for a polished, no-flicker UX
- **Premium chart types are gated behind the subscription paywall** — free users default to the area chart

### 🏦 Bank Connections (Plaid)
- **Plaid Link** integration to securely connect real bank accounts
- Exchange of Plaid public tokens for access tokens, stored per user in the `connected_banks` table
- Ability to **disconnect** a linked bank at any time
- Automatic creation of matching `accounts` and `categories` records synced from Plaid data (`plaidId` fields on both tables)

### 💳 Accounts Management
- Full CRUD for financial accounts (create, rename/edit, delete, **bulk delete**)
- Slide-over ("sheet") forms for creating and editing accounts
- Account-based **filtering** across the whole dashboard via a global account filter/query param

### 🏷️ Categories Management
- Full CRUD for spending categories (create, edit, delete, **bulk delete**)
- Categories can originate from Plaid or be created manually
- Transactions display and filter by category, with dedicated category columns and tooltips in charts/tables

### 🧾 Transactions
- Complete transaction ledger with a powerful **TanStack Table**-based data table: sorting, row selection, and **bulk delete**
- Create, edit, and delete individual transactions via form sheets with **Zod**-validated inputs
- **Currency input** field for precise amount entry, stored in fixed-point "miliunits" for accuracy
- Date picker (powered by `react-day-picker`) and payee/notes fields
- **CSV import**: upload a bank statement CSV, map columns (date, payee, amount) via an interactive **import table**, and bulk-create transactions in one step — CSV import is a **premium (paywalled) feature**
- Rich filtering by **account** and **date range**, reflected in the URL query string for shareable, bookmarkable views

### 💎 Subscriptions & Billing (Stripe)
- **Stripe Checkout** integration to purchase a Monetra Premium subscription
- **Stripe Customer Portal** for existing subscribers to manage/cancel their plan
- Full **Stripe webhook handler** covering checkout completion, subscription creation, updates, and cancellation — keeping subscription status in sync with the database
- A **paywall hook** (`usePaywall`) used throughout the app to gate premium functionality (extra chart types, CSV import) and prompt upgrade via a subscription modal

### ⚙️ Settings
- Dedicated settings page for managing account and subscription preferences

### 🖥️ UI / UX
- Clean, responsive dashboard layout with a persistent header/navigation bar
- Component library built on **Radix UI** primitives + **shadcn/ui** patterns (dialogs, sheets, dropdowns, popovers, calendars, tooltips, checkboxes, etc.)
- Toast notifications via **Sonner**
- Light/dark theme support via `next-themes`
- Confirmation dialogs (`useConfirm`) for destructive actions like deletes
- Icons via **Lucide React** and **React Icons**

### 🧱 Architecture & Developer Experience
- **Feature-based folder structure** (`src/features/*`) — each domain (accounts, categories, transactions, plaid, subscriptions, summary, home, settings) owns its API hooks, components, and local hooks
- Type-safe backend API built with **Hono**, mounted on a single Next.js catch-all route (`/api/[[...route]]`), with an auto-inferred, end-to-end typed client (`hono/client`)
- **Zod** schemas (including Drizzle-Zod generated schemas) for request validation on every endpoint
- **TanStack Query** for all client-side data fetching, caching, and mutations
- **Zustand** + custom hooks (e.g. `use-new-account`, `use-open-transaction`) for lightweight global UI state (which sheet/modal is open, selected IDs, etc.)
- **Drizzle ORM** over a serverless **Neon PostgreSQL** database, with migrations and a seed script
- **cuid2** for collision-resistant primary keys
- ESLint + TypeScript throughout for code quality and safety

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4, `tw-animate-css`, `class-variance-authority` |
| **Component Primitives** | Radix UI, shadcn/ui |
| **Icons** | Lucide React, React Icons |
| **Auth** | [Clerk](https://clerk.com/) (`@clerk/nextjs`, `@clerk/hono`, `@clerk/backend`) |
| **API Layer** | [Hono](https://hono.dev/) — mounted inside a Next.js route handler |
| **Data Fetching** | TanStack Query (React Query) |
| **Tables** | TanStack Table |
| **Database** | PostgreSQL via [Neon](https://neon.tech/) (`@neondatabase/serverless`) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) + Drizzle Kit (migrations) |
| **Forms & Validation** | React Hook Form, Zod, `@hono/zod-validator`, `@hookform/resolvers` |
| **Charts** | Recharts (Area / Line / Bar / Pie / Radar / Radial) |
| **Bank Linking** | [Plaid](https://plaid.com/) (`plaid`, `react-plaid-link`) |
| **Payments / Subscriptions** | [Stripe](https://stripe.com/) (Checkout, Billing Portal, Webhooks) |
| **State Management** | Zustand |
| **CSV Parsing** | react-papaparse |
| **Dates** | date-fns, react-day-picker |
| **Notifications** | Sonner |
| **Theming** | next-themes |
| **IDs** | @paralleldrive/cuid2 |

---

## 📁 Project Structure

```
Monetra/
├── src/
│   ├── app/
│   │   ├── (auth)/                # Clerk sign-in / sign-up routes
│   │   ├── (dashboard)/           # Home, accounts, categories, transactions, settings
│   │   ├── api/[[...route]]/      # Hono API: accounts, categories, plaid, subscriptions,
│   │   │                          #   summary, transactions — all in one catch-all route
│   │   └── layout.tsx             # Root layout (Clerk, React Query, toasts, tooltips)
│   ├── components/                # Shared UI: charts, data grid/table, filters, header, nav
│   │   └── ui/                    # shadcn/Radix-based primitives
│   ├── drizzle/                   # Drizzle schema & DB client
│   ├── features/                  # Feature-sliced modules
│   │   ├── accounts/               #   API hooks, forms, sheets, hooks
│   │   ├── categories/
│   │   ├── home/
│   │   ├── plaid/
│   │   ├── settings/
│   │   ├── subscriptions/          #   Checkout, paywall, subscription modal
│   │   ├── summary/
│   │   └── transactions/           #   CRUD, CSV import, filters
│   ├── hooks/                      # Shared hooks (e.g. useConfirm)
│   ├── lib/                        # Hono client, Stripe client, utils
│   ├── providers/                  # React Query & global sheet providers
│   └── proxy.ts                    # Clerk auth middleware
├── scripts/
│   └── seed.ts                     # Database seed script
├── drizzle.config.ts                # Drizzle Kit config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ (or the version required by Next.js 16)
- A package manager: `npm`, `yarn`, `pnpm`, or `bun`
- Accounts/API keys for:
  - [Clerk](https://clerk.com/) (authentication)
  - [Neon](https://neon.tech/) or any PostgreSQL database
  - [Plaid](https://plaid.com/) (sandbox credentials work for local development)
  - [Stripe](https://stripe.com/) (test mode keys + a webhook secret)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/Monetra.git
cd Monetra
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file (used by Drizzle Kit and scripts) and/or `.env.local` in the project root:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (Neon / Postgres)
DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Plaid
PLAID_CLIENT_TOKEN=
PLAID_SECRET_TOKEN=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```

> ⚠️ Never commit your `.env` / `.env.local` files — keep all API keys and secrets private.

### 4. Set up the database

Generate and run migrations against your Postgres/Neon database:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Optionally seed the database with sample data:

```bash
npx tsx scripts/seed.ts
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 6. Build for production

```bash
npm run build
npm run start
```

---

## 🧪 Linting

```bash
npm run lint
```

---

## 🗺️ Key User Flows

1. **Sign up / sign in** via Clerk → redirected into the dashboard.
2. **Connect a bank** (optional) → Plaid Link opens → account and category data syncs in automatically.
3. **Track finances** → view income/expenses summary cards and interactive charts, filterable by account and date range.
4. **Manage transactions** → add manually, edit, delete, or **import a CSV statement** and map its columns in bulk.
5. **Organize** → create custom accounts and categories to keep transactions structured.
6. **Upgrade** → hitting a premium feature (extra chart types, CSV import) triggers the paywall modal → Stripe Checkout → webhook confirms the subscription and unlocks the feature.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or file an issue.

## 📄 License

This project is available under the [MIT License](LICENSE).
