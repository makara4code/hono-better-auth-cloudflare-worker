# Backend Hono API

A modern backend API built with Hono framework, Better Auth for authentication, and Drizzle ORM, deployed on Cloudflare Workers.

## Tech Stack

- **[Hono](https://hono.dev/)** - Ultrafast web framework for the Edge
- **[Better Auth](https://www.better-auth.com/)** - Authentication library
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM
- **[Neon](https://neon.tech/)** - Serverless Postgres
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Edge runtime

## Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- A Neon database account (or any PostgreSQL database)
- Cloudflare account (for deployment)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create environment files for local development and production:

#### Local Development (.dev.vars)

Create a `.dev.vars` file in the root directory:

```bash
DATABASE_URL=your_neon_database_url
BETTER_AUTH_URL=http://localhost:8787
BETTER_AUTH_SECRET=your_secret_key_here
```

#### Production (.env)

For production deployment, you'll need to set secrets using Wrangler CLI (see Deployment section).

### 3. Database Setup

#### Run Database Migrations

```bash
npx drizzle-kit push
```

This will create the following tables in your database:

- `user` - User accounts
- `session` - User sessions
- `account` - OAuth provider accounts
- `verification` - Email verification tokens

#### Generate Database Types (Optional)

```bash
npx drizzle-kit generate
```

### 4. Development

Start the development server:

```bash
npm run dev
```

The server will start at `http://localhost:8787`

#### Available Endpoints

- `GET /` - Hello world endpoint
- `GET /health` - Health check endpoint
- `GET /api/*` - Better Auth endpoints (sign-in, sign-up, etc.)
- `POST /api/*` - Better Auth endpoints

### 5. Type Generation

Generate TypeScript types for Cloudflare Workers bindings:

```bash
npm run cf-typegen
```

This creates type definitions based on your Worker configuration in [wrangler.jsonc](wrangler.jsonc).

## Deployment

### 1. Set Production Secrets

```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put BETTER_AUTH_URL
npx wrangler secret put BETTER_AUTH_SECRET
```

### 2. Deploy to Cloudflare Workers

```bash
npm run deploy
```

## Project Structure

```txt
backend-hono/
├── src/
│   ├── db/
│   │   └── schema.ts          # Drizzle database schema
│   ├── lib/
│   │   └── better-auth/
│   │       ├── index.ts       # Better Auth instance
│   │       └── options.ts     # Better Auth configuration
│   └── index.ts               # Main application entry
├── drizzle/                   # Database migrations
├── better-auth.config.ts      # Better Auth CLI config
├── drizzle.config.ts          # Drizzle Kit configuration
├── wrangler.jsonc             # Cloudflare Workers config
└── package.json
```

## Database Schema

The application uses the following schema:

- **user**: User profiles with email, name, and avatar
- **session**: User sessions with expiration and device info
- **account**: OAuth provider accounts linked to users
- **verification**: Email verification tokens

## Scripts

- `npm run dev` - Start development server
- `npm run deploy` - Deploy to Cloudflare Workers (production)
- `npm run cf-typegen` - Generate Cloudflare bindings types

## Notes

- The `CloudflareBindings` type is passed as generics when instantiating Hono:

  ```ts
  const app = new Hono<{ Bindings: CloudflareBindings }>()
  ```

- Environment variables in development are stored in `.dev.vars`
- Production secrets are managed via Wrangler CLI
- The database adapter uses Neon's HTTP driver for edge compatibility

## Resources

- [Hono Documentation](https://hono.dev/)
- [Better Auth Documentation](https://www.better-auth.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
