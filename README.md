# Enterprise Carpooling Platform

Production-oriented monorepo for a multi-tenant employee carpooling platform.

## Stack

- Backend: Java 21, Spring Boot 3.5, Spring Security, JPA/Hibernate, PostgreSQL, Redis, WebSocket, Maven
- Frontend: React 19, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, shadcn-style component layout
- Integrations: Google Maps, Razorpay, Firebase Cloud Messaging, S3 or local MinIO

## Repository Layout

```text
backend/    Spring Boot API
frontend/   React app
docs/       Architecture, schema, API, and delivery notes
```

## First Milestone

The first practical build slice is:

1. Multi-tenant company and user model
2. JWT auth with refresh tokens and Redis logout blacklist
3. Vehicle CRUD
4. Ride offer/search and booking workflow
5. Wallet transaction ledger
6. WebSocket channels for chat and live tracking
7. Admin dashboard read models

See [docs/implementation-plan.md](docs/implementation-plan.md) for the full phased plan.

## Local Services

```bash
docker compose up -d postgres redis minio
```

The backend expects configuration through environment variables. Development defaults are defined in `backend/src/main/resources/application.yml`.

