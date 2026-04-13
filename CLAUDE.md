# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a two-service monorepo:

- **`portfolio/`** — React 18 + Vite frontend, served via Nginx in production
- **`mail-server/`** — Express + Nodemailer backend, handles `/send-email` POST requests

In development, Vite proxies `/send-email` to `http://localhost:3000`. In production, both services run in Docker Swarm on a shared network.

## Commands

Use the root `Makefile` to orchestrate both services:

```bash
make start-server-dev       # mail-server in dev mode (port 3000)
make start-portfolio-dev    # portfolio Vite dev server (port 4000)
make build-mock-server      # build Docker image for local Swarm testing
make start-mock-server      # start local Swarm stack (port 80)
make stop-mock-server       # stop local Swarm stack
```

### portfolio/
```bash
npm run dev          # Vite dev server on :4000
npm run build        # production build
npm run build-local  # unminified dev build
npm run lint         # ESLint (zero tolerance for warnings)
npm run preview      # preview production build
```

### mail-server/
```bash
npm run dev          # Express dev server
npm start            # production (NODE_ENV=production)
npm test             # Jest + Supertest
npm run test:debug   # Jest with Node inspector
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
```

## Key Patterns

**Theme:** `ThemeContext.jsx` provides light/dark mode via React Context + localStorage persistence. Access with the `useTheme()` hook.

**Form validation:** Contact form uses Zod schemas (`zod` package) with inline error display. Validation runs client-side before the fetch POST.

**Email rate limiting:** `mail-server/middleware/rateLimter/rateLimiter.js` — 5 requests per IP per 15-minute window.

**Environment / secrets (Docker Swarm):** `mail-server/utils/envHelper.js` reads credentials from `/run/secrets/mail_server_secret` and config from `/run/config/mail_server_config`. For local dev, use `.env.secret` and `.env.config` files (see `.env.secret.example` and `.env.config.example`).

## Deployment

Production runs on Docker Swarm (`docker-compose.yml`): 2 replicas of the portfolio Nginx container, 1 replica of mail-server. Swarm secrets hold `EMAIL`, `EMAIL_PASS`, `FORWARDING_EMAIL`; Swarm configs hold `APP_PORT`, `SMTP_HOST`, `SMTP_PORT`.

## Versioning

Both `portfolio/package.json` and `mail-server/package.json` maintain independent `VERSION` fields. Update the relevant `VERSION` and `CHANGELOG` before merging changes.
