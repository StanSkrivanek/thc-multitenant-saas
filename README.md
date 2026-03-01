# Multi-Tenant SaaS Starter

![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)
![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00?logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-package--manager-F69220?logo=pnpm&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-icons-f97316)
![License](https://img.shields.io/badge/License-MIT-22c55e)

A fully working **multi-tenant SaaS demo** built with **SvelteKit** and the **Svelte 5 Context API**. Tenant branding, feature flags, and role-based access control — all driven by context, zero prop-drilling.

## Features

- **Multi-tenancy** — tenant is resolved from the subdomain (`acme.localhost`) or a `?tenant=` query param; all isolation happens in a single server hook before any load function runs
- **Per-tenant branding** — each tenant has its own logo icon, primary color, and accent color applied at runtime
- **Plan-based feature flags** — `free`, `pro`, and `enterprise` plans control which features are visible per tenant
- **Role-based access** — `member`, `admin`, `owner`, and `superadmin` roles gate different parts of the UI; the platform superadmin can see all customer tenants across the platform
- **Svelte 5 Context API** — tenant, session, features, theme, and app config are distributed via typed context helpers; no prop-drilling anywhere
- **Server-side session isolation** — cross-tenant sessions are silently rejected in the hook layer
- **Zero external dependencies** — no database, no auth library; everything runs in-memory for instant local setup

## Tech Stack

| Layer           | Technology                                                             |
| --------------- | ---------------------------------------------------------------------- |
| Framework       | [SvelteKit 2](https://kit.svelte.dev) + [Svelte 5](https://svelte.dev) |
| Language        | TypeScript 5                                                           |
| Bundler         | Vite 7                                                                 |
| Icons           | [Lucide Svelte](https://lucide.dev)                                    |
| Package manager | [pnpm](https://pnpm.io)                                                |

## Getting Started

```sh
# 1. Clone the repo
git clone https://github.com/stanskrivanek/sv-saas-mt.git
cd sv-saas-mt

# 2. Install dependencies
pnpm install

# 3. Start the dev server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) — you'll land on the Acme Corp tenant by default.

## Demo Tenants & Accounts

Use `?tenant=<slug>` or a subdomain — both work out of the box (`*.localhost` resolves automatically in modern browsers, no `/etc/hosts` needed).

| Email              | Password    | Role       | Tenant        | Plan       |
| ------------------ | ----------- | ---------- | ------------- | ---------- |
| admin@platform.com | password123 | superadmin | SaaS Platform | —          |
| alice@acme.com     | password123 | owner      | Acme Corp     | enterprise |
| bob@acme.com       | password123 | member     | Acme Corp     | enterprise |
| carol@globex.com   | password123 | owner      | Globex Inc    | pro        |
| dave@initech.com   | password123 | owner      | Initech LLC   | free       |

**Query param:**

- `http://localhost:5173?tenant=acme`
- `http://localhost:5173?tenant=globex`
- `http://localhost:5173?tenant=initech`

**Subdomain (no setup needed):**

- `http://platform.localhost:5173` — superadmin login
- `http://acme.localhost:5173`
- `http://globex.localhost:5173`
- `http://initech.localhost:5173`

> Cross-tenant credentials are silently rejected — each account only works on its own tenant's URL.

## How It Works

```
Request → hooks.server.ts
  ├── Resolve tenant from subdomain / ?tenant= param
  ├── Validate session cookie against that tenant's users
  └── Attach tenant + session to event.locals

Load functions → read event.locals, pass data to the layout

Root layout → set Svelte 5 context (tenant, session, features, theme)

Components → getTenantCtx() / getSessionCtx() / getFeaturesCtx()
             — no prop drilling, fully reactive
```

## Project Structure

```
src/
├── hooks.server.ts          # Tenant + session resolution
├── app.d.ts                 # Locals type augmentation
├── lib/
│   ├── components/          # Shared UI components
│   │   ├── AppHeader.svelte
│   │   ├── AppSidebar.svelte
│   │   ├── AdminNav.svelte
│   │   ├── RequireFeature.svelte
│   │   ├── StatsCard.svelte
│   │   └── TenantLogo.svelte
│   ├── context-helpers.ts   # Typed getContext() wrappers
│   ├── types/context.ts     # Shared TypeScript interfaces
│   └── server/db.ts         # In-memory DB + seed data
└── routes/
    ├── +page.svelte          # Landing / demo hub
    ├── login/                # Login form (tenant-scoped)
    ├── logout/               # Session cleanup
    ├── (app)/dashboard/      # Authenticated app shell
    ├── (admin)/admin/panel/   # Superadmin — all tenants view
    └── (admin)/admin/members/ # Admin/owner — tenant members view
```

## Scripts

```sh
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm check        # Svelte type-check
pnpm lint         # Prettier + ESLint
pnpm format       # Auto-format with Prettier
```

## License

[MIT](./LICENSE)
