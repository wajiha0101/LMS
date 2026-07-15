# LMS Backend

Backend API for a 2-week Online Learning Management System project. REST API built with Express, backed by PostgreSQL via Prisma, deployed on Railway. Full architecture, database schema, and API contract live in `LMS_CONTEXT.md` - that file is the source of truth, this README is just the practical "how to run it" guide.

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js + Express |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL (Railway) |
| Validation | Zod |
| Auth | JWT (access + refresh) + bcrypt |
| Payments | Stripe |
| Deployment | Railway |

## Prerequisites

- Node.js 18+
- A Railway PostgreSQL instance (or local Postgres for solo dev work)
- Stripe test account (for the Payments module)

## Getting Started

```powershell
git clone <repo-url>
cd lms-backend
npm install
```

Copy the example env file and fill in real values:

```powershell
Copy-Item .env.example .env
```

Run the first migration and generate the Prisma client:

```powershell
npx prisma migrate dev
npx prisma generate
```

Seed the database with test data (categories, sample users/courses):

```powershell
npm run seed
```

Start the dev server:

```powershell
npm run dev
```

## Environment Variables

See `.env.example` in the repo root. Full list and descriptions are in `LMS_CONTEXT.md`, Section 11.

```
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
BCRYPT_SALT_ROUNDS=12
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CORS_ORIGIN=
PORT=
```

## Project Structure

```
/src
  /modules
    /auth
    /users
    /courses
    /materials
    /quizzes
    /assignments
    /cart
    /payments
    /enrollments
    /progress
    /certificates
    /reviews
    /wishlist
    /notifications
    /forum
    /announcements
    /analytics
    /payouts
  /middlewares
    auth.middleware.ts
    rbac.middleware.ts
    validate.middleware.ts
    error.middleware.ts
  /lib
    prisma.ts
    jwt.ts
    stripe.ts
  /utils
  /prisma
    schema.prisma
    /migrations
  app.ts
  server.ts
```

Each module folder is self-contained: its own routes, controller, service, and Zod schema. Full details in `LMS_CONTEXT.md`, Section 6.1.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build (production) |
| `npm run seed` | Populate the database with test data |
| `npx prisma studio` | Browse the database in a GUI |
| `npx prisma migrate dev --name <name>` | Create and apply a new migration |
| `npx prisma migrate deploy` | Apply pending migrations (used on Railway deploy) |

## API Conventions

- Base path: `/api/v1`
- Every response uses the standard envelope:

```json
// success
{ "success": true, "data": {}, "meta": { "page": 1, "limit": 20, "total": 134 } }

// error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] } }
```

- Every mutating route follows: Zod validation -> auth middleware -> RBAC middleware -> controller -> service -> Prisma.
- Full endpoint list per module: `LMS_CONTEXT.md`, Section 9.

## Team Split

Two backend developers, one repo, each owning a fixed, non-overlapping set of modules (`LMS_CONTEXT.md`, Section 14):

| Person A | Person B |
|---|---|
| Auth + shared middleware | Cart |
| Users / Admin | Payments (Stripe) |
| Courses + Categories | Enrollments |
| Materials | Progress |
| Quizzes | Wishlist |
| Assignments | Notifications |
| Reviews | Forum |
| Certificates | Announcements |
| Payouts | Analytics |

Nobody edits a route/controller/service file outside their own modules. Cross-module data access is read-only Prisma queries against the fixed schema, never a shared file - see Section 14.4 for the exact list.

## Git Workflow

- `main` is protected, every PR needs one review from the other backend dev.
- Branch per module: `feat/courses`, `feat/payments`, etc.
- Pull `main` every morning, run `npx prisma generate` after pulling in case the schema changed.
- Sample requests for each endpoint go in `requests.http` in the repo root as they're built, so both devs and the frontend team know what's actually live.

## Deployment

Railway hosts both the Postgres instance and this backend service. Build step runs `npx prisma migrate deploy` before starting the server so migrations apply on every deploy. Full details in `LMS_CONTEXT.md`, Section 11.

## Full Spec

Architecture, database schema (full Prisma model), API contract, requirements traceability matrix, and the 2-week build order all live in `LMS_CONTEXT.md` at the repo root - read that before building any module.
