# Job Search Application (Node.js · Express · MongoDB)

[![CI](https://github.com/AhmedElhawary129/jobSearchApp/actions/workflows/ci.yml/badge.svg)](https://github.com/AhmedElhawary129/jobSearchApp/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/Node-22%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-16.x-E10098?logo=graphql&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socketdotio&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Table of Contents
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Run Locally](#run-locally)
  - [Build & Run in Production](#build--run-in-production)
- [API Overview](#api-overview)
  - [Authentication](#authentication)
  - [Companies](#companies)
  - [Jobs](#jobs)
  - [Applications](#applications)
  - [Chat & Realtime](#chat--realtime)
  - [GraphQL Admin](#graphql-admin)
  - [Pagination](#pagination)
  - [Error Format](#error-format)
- [Security & Hardening](#security--hardening)
- [Conventions](#conventions)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [CI](#ci)
- [License](#license)

---

## Features
- **Authentication & Authorization**
  - Email/password sign‑up & sign‑in with **OTP email confirmation**
  - **Google OAuth** login (ID Token verification)
  - JWT‑based **access/refresh** tokens with **separate signatures** per role
  - Role‑based access control: `user`, `admin`, `superAdmin`
  - Password reset via OTP (send, verify, reset)
- **User Profiles**
  - Profile & cover images (**Cloudinary**) with upload/delete endpoints
  - Social graph: **add/remove friend**, **block/unblock**, share profile
  - Account moderation: **freeze/unfreeze**, admin **ban/unban**
- **Companies & Jobs**
  - Companies CRUD, logo/cover uploads, search by name
  - Jobs CRUD with location/working‑time/seniority enums & freeze/unfreeze
- **Applications**
  - Apply to a job with CV upload, update status, “my applications” listing
- **Realtime Chat**
  - **Socket.IO** one‑to‑one chat with online presence & message persistence
  - REST to fetch chat history between two users
- **DX & Safety**
  - **Joi** validation schemas, **rate‑limiting**, **CORS**
  - Centralized errors with a consistent JSON shape
  - Utilities for Cloudinary, crypto/encryption, hashing, tokens, email
- **Admin GraphQL Dashboard (Read‑only)**
  - Aggregate queries for users, companies, and jobs

> _Note:_ GraphQL is used for an admin‑style read layer; HTTP/REST drives the main app.

---

## Architecture Overview
- **`index.js`**: App entrypoint. Loads env, boots Express, mounts routes, starts Socket.IO.
- **`src/app.controller.js`**: App wiring — CORS, rate‑limit, JSON parsing, GraphQL handler, routes, and global error handler.
- **Database (`src/DB/`)**:
  - `connectionDB.js`, `dbService.js`
  - Mongoose models: **User**, **Company**, **Job**, **Application**, **Chat**
  - Shared enums: gender, roles, providers, token types, job metadata, application status
- **Middlewares (`src/middleware/`)**: Auth (JWT for HTTP + sockets/GraphQL), Multer upload, Validation (Joi)
- **Modules (`src/modules/`)**:
  - `users/`, `companies/`, `jobs/`, `applications/`, `chat/`
  - `users/graphql/` for admin dashboard
- **Utilities (`src/utils/`)**: Cloudinary, email (Nodemailer), encryption/hashing, tokens, pagination rules, error classes
- **GraphQL**: `src/modules/graph.schema.js` + `users/graphql/*` (types, fields, resolvers)

---

## Tech Stack
- **Runtime**: Node.js (ESM)
- **Framework**: Express
- **Database**: MongoDB (Mongoose)
- **Realtime**: Socket.IO
- **Auth**: JWT (access/refresh), bcrypt, Google ID Token
- **Uploads**: Multer + Cloudinary
- **Email**: Nodemailer (Gmail App Password)
- **Validation**: Joi
- **Ops**: express‑rate‑limit, CORS

---

## Project Structure
```
jobSearchApp/
├─ index.js
├─ src/
│  ├─ app.controller.js
│  ├─ DB/
│  │  ├─ connectionDB.js
│  │  ├─ dbService.js
│  │  ├─ enums.js
│  │  └─ models/
│  │     ├─ user.model.js
│  │     ├─ company.model.js
│  │     ├─ job.model.js
│  │     ├─ application.model.js
│  │     └─ chat.model.js
│  ├─ middleware/
│  │  ├─ auth.js
│  │  ├─ multer.js
│  │  └─ validation.js
│  ├─ modules/
│  │  ├─ users/ (controller, service, validation, graphql)
│  │  ├─ companies/
│  │  ├─ jobs/
│  │  ├─ applications/
│  │  └─ chat/
│  └─ utils/
│     ├─ cloudinary/
│     ├─ encryption/
│     ├─ error/
│     ├─ features/
│     ├─ generalRules/
│     ├─ sendEmail.events/
│     └─ token/
└─ config/
   └─ .env.example
```

---

## Getting Started

### Prerequisites
- **Node.js**: v22.x or later
- **MongoDB**: 6.x or later (local or Atlas)
- A **Cloudinary** account + **Gmail App Password** (for email)
- (Optional) **Google OAuth Client** for login with Gmail

### Installation
```bash
# 1) Install dependencies
npm install

# 2) Copy env template and fill it
cp config/.env.example config/.env
# or create config/.env manually (see below)
```

### Environment Variables
Create `config/.env` using the following keys (do **NOT** commit secrets):

```dotenv
# Server
PORT=3000
MODE=DEV

# Database
URI_CONNECTION=mongodb://localhost:27017/jobSearchApp

# Crypto / JWT
SALT_ROUNDS=12
SECRET_KEY=CHANGE_ME
ACCESS_SIGNATURE_USER=CHANGE_ME
ACCESS_SIGNATURE_ADMIN=CHANGE_ME
REFRESH_SIGNATURE_USER=CHANGE_ME
REFRESH_SIGNATURE_ADMIN=CHANGE_ME
PREFIX_TOKEN_USER=user_prefix
PREFIX_TOKEN_ADMIN=admin_prefix

# Email (Gmail w/ App Password)
EMAIL=you@example.com
PASSWORD=your_app_password

# OAuth (Google ID token verification)
CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Cloudinary
CLOUD_NAME=
API_KEY=
API_SECRET=
```

> Keep secrets out of version control. Use a secret manager in production.

### Run Locally
```bash
# Dev (auto-reload via node --watch)
npm run dev

# Production-like start
npm run start
```
The API will be available at `http://localhost:3000/` (unless you change `PORT`).

### Build & Run in Production
- Set `MODE=PROD` (or reduce debug logs).
- Restrict **CORS** to trusted origins.
- Consider enabling security/perf middlewares:
  ```js
  import helmet from "helmet";
  import compression from "compression";
  app.use(helmet());
  app.use(compression());
  ```
- Use a process manager (PM2, systemd, Docker); add health checks.
- Use MongoDB Atlas / managed DB with backups.

---

## API Overview

### Authentication
**Headers**: `Authorization: <PREFIX> <token>` — where `<PREFIX>` is `Bearer` for users and `Admin` for admin tokens.

Common REST endpoints:
- `POST   /users/signUp`
- `PATCH  /users/confirmEmail`
- `POST   /users/resendOTP`
- `POST   /users/signIn`
- `POST   /users/loginWithGmail`
- `POST   /users/forgetPassword`
- `PATCH  /users/resetPassword`
- `POST   /users/refreshToken`
- `PATCH  /users/changePassword` (auth)
- `PATCH  /users/updateAccount` (auth)
- `PATCH  /users/updateEmail` (auth)
- `PATCH  /users/replaceEmail` (auth)
- `PATCH  /users/freezeAccount/:userId` (auth/admin)
- `PATCH  /users/unFreezeAccount/:userId` (auth/admin)
- `PATCH  /users/dashboard/updateRole/:userId` (admin)
- `PATCH  /users/dashboard/banUser/:userId` (admin)
- `PATCH  /users/dashboard/unBanUser/:userId` (admin)
- `GET    /users/profile` (auth)
- Media:
  - `PATCH /users/uploadProfileImage` (multer + Cloudinary) (auth)
  - `PATCH /users/uploadCoverImage`   (auth)
  - `DELETE /users/deleteProfileImage` `DELETE /users/deleteCoverImage`

Social:
- `PATCH /users/addFriend/:userId`
- `PATCH /users/removeFriend/:userId`
- `PATCH /users/blockUser/:userId`
- `PATCH /users/unBlockUser/:userId`
- `GET   /users/shareProfile/:id`

### Companies
Mounted at `/companies`:
- `POST   /addCompany` (auth)
- `PATCH  /updateCompany/:companyId` (auth)
- `DELETE /freezeCompany/:companyId` (auth)
- `PATCH  /unFreezeCompany/:companyId` (auth)
- `GET    /getCompany/:companyId`
- `GET    /searchByName?companyName=...`
- Media:
  - `PATCH /uploadLogo/:companyId` (auth)
  - `PATCH /uploadCoverImage/:companyId` (auth)
  - `DELETE /deleteLogo/:companyId` (auth)
  - `DELETE /deleteCoverImage/:companyId` (auth)

### Jobs
Mounted at `/jobs` (also under `/companies/:companyId/jobs`):
- `POST   /addJob` (auth)
- `PATCH  /updateJob/:jobId` (auth)
- `DELETE /freezeJob/:jobId` (auth)
- `PATCH  /unFreezeJob/:jobId` (auth)
- `GET    /getJob/:jobId`
- `GET    /searchByFilters`
- `GET    /searchByName?jobTitle=...`

**Enums** (from DB `enums.js`): jobLocation (`onsite|remotely|hybrid`), workingTime (`fullTime|partTime`), seniorityLevel (`fresh|junior|midLevel|senior|teamLeader|CTO`).

### Applications
Mounted under `/applications` and nested `/jobs/:jobId/applications`:
- `POST /addApplication` (auth, CV upload via Multer/Cloudinary)
- `GET  /myApplication` (auth) — filter by `companyId` &/or `jobId`

### Chat & Realtime
- **REST**: `GET /chat/:userId` — returns chat with messages (auth)
- **Socket.IO events**:
  - Client connects → `registerAccount` (JWT in handshake)
  - `sendMessage` → persists & emits `receiveMessage` to target
  - `logout` / disconnect → clean up presence map

> Emit to rooms by userId and target with `io.to(targetUserId).emit('receiveMessage', payload)`.

### GraphQL Admin
- Endpoint: `POST /graphql`, Playground at `/play` (non‑prod usage)
- Queries (admin/superAdmin only via `authorization` header arg):
  - `getUsers`
  - `getCompanise` (companies)
  - `getJobs`

### Pagination
Query params: `page`, `limit`, `sort`  
Typical response:
```json
{
  "items": [/* documents */],
  "total": 123,
  "page": 2,
  "pages": 13
}
```

### Error Format
All errors use a consistent JSON shape:
```json
{
  "status": "error",
  "message": "Human-readable message",
  "code": "OPTIONAL_ERROR_CODE",
  "details": {}
}
```

---

## Security & Hardening
- **CORS**: In production, whitelist trusted origins only.
- **Rate Limiting**: App-level limiter; consider per‑route tightening for Auth.
- **JWT**: Separate signatures for user/admin + token type; enforce expiration; refresh rotation.
- **Uploads**: Validate MIME types; use Cloudinary folders per entity (`jobSearchApp/<entityId>/...`).
- **Headers**: Consider `helmet()` for secure headers.
- **Secrets**: Keep secrets out of git; use secret manager.
- **Indexes** (suggested):
  - `User.email` unique
  - `Company.userId, Company.name`
  - `Job.companyId, Job.createdAt`
  - `Application.userEmail, Application.jobId`
  - `Chat.mainUser + Chat.subParticipant`

---

## Conventions
- **Language**: JavaScript (ESM). Consider ESLint + Prettier.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, etc.).
- **HTTP**: Nouns & plural collections; prefer `PATCH` for partial updates.
- **Validation**: All inputs validated via Joi schemas per module.

---

## Testing
- (Pluggable) Unit tests for utils/middlewares (Jest recommended).
- Integration tests for core flows (auth → companies → jobs → applications → chat).

_Run tests (placeholder):_
```bash
npm run test
```

---

## Troubleshooting
- **MongoDB connection**: Check `URI_CONNECTION` and DB is reachable (Atlas IP allowlist).
- **Invalid token**: Ensure correct prefix is used (`Bearer` vs `Admin`), token not expired, signatures match env.
- **Uploads failing**: Verify Cloudinary credentials and allowed MIME types.
- **Emails not sent**: Use Gmail **App Password**; confirm `EMAIL` and `PASSWORD` env.
- **GraphQL auth**: Provide `authorization` string arg containing `<PREFIX> <token>` for admin/superAdmin.

---

## Roadmap
- [ ] Admin notifications & auditing
- [ ] Saved jobs & favorites
- [ ] Organization members/roles
- [ ] Public search & indexing
- [ ] E2E tests and load testing (k6/Artillery)

---

## CI
If you add **`.github/workflows/ci.yml`**, the badge above will reflect status. A typical flow:
- Node **22** setup, `npm ci`
- **Build** (optional)
- **Lint** (non‑blocking)
- **Test** (non‑blocking)

---

## License
Released under the **MIT License**. See [LICENSE](LICENSE) for details.
