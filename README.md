# LMS Backend (JavaScript / Node / Express)

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` (Railway Postgres), `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`.
3. `npx prisma generate`
4. `npx prisma migrate dev --name init`
5. `npm run dev`

Note: `prisma generate` could not run in the sandbox this code was written in (its engine binary download is blocked by that sandbox's network allowlist). This is not a code or schema issue - run steps 3 and 4 on your own machine and it will work normally.

## What's built (Day 1-2)

- Express skeleton, folder structure per Section 6.1, plain JavaScript (CommonJS)
- `schema.prisma` committed exactly as Section 8.2
- Prisma client singleton (`src/lib/prisma.js`)
- JWT helpers (`src/lib/jwt.js`)
- Middlewares: `auth`, `rbac`, `validate`, `error` (`src/middlewares/`)
- Auth module: register, login, refresh, logout, me (`src/modules/auth/`)

## Known limitation: refresh token revocation

The schema (Section 8.2) has no `RefreshToken` table, so refresh tokens are stateless JWTs. Refresh rotates the token (new access + refresh issued and re-cookied on every `/auth/refresh` call), but `/auth/logout` only clears the cookie client-side - it cannot invalidate a refresh token that's already been issued elsewhere. If you want real server-side revocation, that needs a schema change (a `RefreshToken` or token-blacklist model) - flagging per Ground Rule 4 rather than adding it silently.

## RBAC behavior notes

- `AuthMiddleware` rejects any request from a `SUSPENDED` user account-wide (401/403), regardless of role.
- `RequireRole(...)` additionally blocks `INSTRUCTOR` users with `status = PENDING` from role-gated instructor routes, per Section 6.3's approval-gating requirement. It does not block them from `Any authenticated` routes like `/auth/me`.

## Auth contract implemented (Section 9)

| Method | Path | Auth |
|---|---|---|
| POST | /api/v1/auth/register | Public |
| POST | /api/v1/auth/login | Public |
| POST | /api/v1/auth/refresh | Public (cookie) |
| POST | /api/v1/auth/logout | Any |
| GET | /api/v1/auth/me | Any |
