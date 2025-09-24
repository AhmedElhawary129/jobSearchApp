# Job Search Application (Node.js · Express · MongoDB)

[![CI](https://github.com/AhmedElhawary129/jobSearchApp/actions/workflows/ci.yml/badge.svg)](https://github.com/AhmedElhawary129/jobSearchApp/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/Node-22%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-16.x-E10098?logo=graphql&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socketdotio&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Production-ready backend for a **job marketplace**, built with **Express (ES Modules)** and **MongoDB (Mongoose)**.  
Provides **REST APIs** for Users/Companies/Jobs/Applications, a **GraphQL** endpoint for administrative queries, and **Socket.IO** for real-time chat. File uploads are handled via **Multer** with optional **Cloudinary** integration. Input validation uses **Joi**.

> **Node.js 22+ · Port 3000 · MIT License · CI enabled**

---

## Features

- **Modules:** users, companies, jobs, applications, chat.
- **APIs:** REST + GraphQL (`graphql-http` + Playground).
- **Auth:** Access/Refresh tokens (user & admin) + Socket authentication.
- **Uploads:** Multer (disk/host) with MIME filtering, optional Cloudinary.
- **Validation:** Joi middleware.
- **Email:** Nodemailer helpers (confirmations / notifications).
- **Errors:** AppError, asyncHandler, globalErrorHandler.
- **Postman:** `job search app.postman_collection.json` included.
- **CI:** GitHub Actions (Node 22, lint non-blocking, tests allowed to pass with no tests).

---

## Tech Stack

- **Runtime:** Node.js (v22+)
- **Framework:** Express (ESM)
- **Database:** MongoDB (Mongoose)
- **Real-time:** Socket.IO
- **GraphQL:** `graphql`, `graphql-http`
- **Validation:** Joi
- **Uploads/Media:** Multer, Cloudinary
- **Email:** Nodemailer
- **Auth:** JWT

---

## Project Structure

```text
jobSearchApp/
├─ README.md
├─ LICENSE
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ index.js                   # entry & bootstrap
├─ config/
│  ├─ .env                    # real secrets (DO NOT COMMIT)
│  └─ .env.example            # safe example (placeholders)
├─ src/
│  ├─ app.controller.js       # express app setup (routes, GraphQL, errors)
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
│  │  ├─ validation.js
│  │  └─ multer.js
│  ├─ modules/
│  │  ├─ users/
│  │  ├─ companies/
│  │  ├─ jobs/
│  │  ├─ applications/
│  │  └─ chat/
│  ├─ service/
│  │  └─ sendEmail.js
│  ├─ uploads/                # local uploads (if disk storage used)
│  └─ utils/
│     ├─ error/               # AppError, asyncHandler, globalErrorHandler
│     ├─ token/               # jwt helpers
│     ├─ encryption/          # crypto helpers
│     ├─ features/            # pagination, filters, ...
│     ├─ cloudinary/          # cloudinary helpers
│     └─ index.js
└─ job-search-app.postman_collection.json
```

---

## Quick Start

```bash
# 1) Install dependencies
npm install

# 2) Create environment file (do NOT commit real secrets)
mkdir -p config
cp config/.env.example config/.env
# then fill real values

# 3) Run in development
npm run dev       # or: npm start

# URLs
# REST Base:   http://localhost:3000
# GraphQL:     http://localhost:3000/graphql
# Socket.IO:   same server/port
```

---

## Environment Variables

Use `config/.env.example` as a template, and keep real secrets only in `config/.env`.

```env
# -------- Server --------
PORT=3000
MODE=DEV

# -------- Database --------
URI_CONNECTION=mongodb://127.0.0.1:27017/jobSearchApp

# -------- JWT / Auth --------
SECRET_KEY=CHANGE_ME
ACCESS_SIGNETURE_USER=CHANGE_ME
ACCESS_SIGNETURE_ADMIN=CHANGE_ME
REFRESH_SIGNETURE_USER=CHANGE_ME
REFRESH_SIGNETURE_ADMIN=CHANGE_ME
PREFIX_TOKEN_USER=Bearer
PREFIX_TOKEN_ADMIN=Admin

# -------- Hashing --------
SALT_ROUNDS=12

# -------- Email (Nodemailer) --------
EMAIL=your_email@example.com
PASSWORD=your_app_password
SIGNETURE_EMAIL_CONFIRMATION=CHANGE_ME
SIGNETURE_UNFREEZE_CONFIRMATION=CHANGE_ME

# -------- Google OAuth --------
CLIENT_ID=your_google_client_id

# -------- Cloudinary --------
CLOUD_NAME=
API_KEY=
API_SECRET=
```

**.gitignore**
```gitignore
config/.env
config/*.env
*.env
```

---

## REST API Overview

> Base: `http://localhost:<PORT>`

### Users
- `POST /users/signUp`
- `PATCH /users/confirmEmail`
- `GET /users/profile` *(auth)*

### Companies
- `POST /companies/addCompany`
- `PATCH /companies/updateCompany/:companyId`
- `DELETE /companies/freezeCompany/:companyId`
- `DELETE /companies/deleteLogo/:companyId`
- `DELETE /companies/deleteCoverImage/:companyId`
- **Nested Jobs:** `/companies/:companyId/jobs/...`

### Jobs
- `GET /jobs/getJobs/:jobId?`
- `GET /jobs/getByFilter`
- `GET /jobs/getApplications/:jobId`
- `PATCH /jobs/updateAppStatus/:jobId/:applicationId`
- **Nested Applications:** `/:jobId/applications/...`

### Applications
- `POST /applications/addApplication`
- `GET /applications/myApplication`

### Chat
- `GET /chat/:userId` *(auth)*
- **Socket Events:** `register`, `sendMessage`, `receiveMessage`, `logout`, `disconnect`, `authError`, `successMessage`.

---

## GraphQL

- **Endpoint:** `POST /graphql`  
- **Schema:** consolidated admin fields (see GraphQL setup in `src/app.controller.js`).

---

## CI

GitHub Actions workflow at `.github/workflows/ci.yml`:
- Node **22**, `npm ci`
- **Build** (skips gracefully if no build script)
- **Lint (non-blocking)**
- **Test** (non-blocking)

The CI badge at the top reflects the latest run status.

---

## License

Released under the **MIT License**. See [LICENSE](LICENSE) for details.
