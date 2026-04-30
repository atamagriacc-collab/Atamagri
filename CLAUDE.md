# CLAUDE.md — Atamagri IoT Project Guide

## Project Overview

Atamagri is an IoT agriculture monitoring platform using Firebase (RTDB + Auth), a Next.js frontend, ESP32 sensors, and a Python drone API backend. Deployed on Vercel with the domain `atamagri.app`.

## Tech Stack

| Layer       | Technology                           |
|-------------|--------------------------------------|
| Frontend    | Next.js (in `frontend/`)            |
| Backend     | Node.js (Firebase Functions), Python (drone_api.py) |
| Database    | Firebase Realtime Database           |
| Auth        | Firebase Authentication              |
| Hosting     | Vercel                               |
| IoT Devices | ESP32 sensors                        |
| Domain      | atamagri.app (Vercel DNS)            |

## Directory Structure

```
Atamagri/
├── frontend/          # Next.js web app
├── backend/           # Python backend services
├── functions/         # Firebase Cloud Functions
├── atamagri_mobile/   # Mobile app
├── drone_api.py       # Drone control API
├── esp32-sensor-*.ino # ESP32 firmware
├── firebase.json      # Firebase config
└── *.md               # Documentation files
```

## 🔒 Security Rules — CRITICAL

### NEVER commit secrets to tracked files
- **All tokens, API keys, and secrets** must live in `.env.local` (which is git-ignored).
- Documentation files (`.md`) must **NEVER** contain hardcoded tokens or credentials.
- Use placeholder references like `$VERCEL_TOKEN` or `$VERCEL_TEAM_ID` in docs.
- The `.gitignore` already excludes `.env.local`, `.env`, and `serviceAccountKey.json`.

### Known secrets to protect
- Vercel Token (`VERCEL_TOKEN`) — stored in `.env.local`
- Vercel Team ID (`VERCEL_TEAM_ID`) — stored in `.env.local`
- Firebase service account key — stored in `serviceAccountKey.json` (git-ignored)

### If you find a hardcoded secret
1. Immediately redact it from the file, replacing with an env-var reference.
2. Remind the user to **rotate the secret** on the provider dashboard.
3. Ensure `.gitignore` covers the env file.

## Environment Variables

Secrets and configuration are loaded from `.env.local` at the project root:

```env
VERCEL_TOKEN=<your-rotated-vercel-token>
VERCEL_TEAM_ID=<your-vercel-team-id>
```

## Conventions

- DNS and deployment docs live as `*.md` in the project root.
- Firebase project ID: `atamagri-iot`
- Firebase Hosting is configured via `firebase.json`.
- ESP32 firmware: use `esp32-sensor-updated.ino` (the `.DEPRECATED` file is legacy).

## Recent Changes

- **2026-04-30**: Redacted exposed Vercel token from `DNS_SETUP_COMPLETE.md`. Token and team ID replaced with env-var references. **The old token must be rotated on the Vercel dashboard.**
- **2026-04-30**: Created `GCP_STARTUP_APPLICATION_REPLY.md` — draft email reply to Google Cloud for Startup application (Nabilla). Answers all 7 verification questions using NIB data.
- **2026-04-30**: Updated `frontend/pages/about.tsx` to include three sections required by GCP for Startup review: **Business Description** (problem/solution/market), **Team Information** (founder + departments), and **Product Information** (all 5 products with stage badges). Sections have anchor IDs: `#business-description`, `#team-information`, `#product-information`.
