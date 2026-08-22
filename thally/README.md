# Thally — The Control Plane for Product Knowledge

> **Keep product knowledge synchronized with product reality.**

Thally detects meaningful product changes, identifies the documentation and knowledge affected by those changes, gathers source evidence, proposes documentation updates, lets a human maintainer review them, creates an isolated deployment preview, and publishes only approved documentation to both the public documentation portal and agent context.

---

## 🌟 Core Architecture & Workflow

```text
Product Change (Git Commit / PR)
          ↓
Impact Analysis (Deterministic or AI Model)
          ↓
Source Evidence (AST diffs, Zod schemas, tests, UI screenshots)
          ↓
Documentation Task (Scope & acceptance criteria)
          ↓
Proposed Update (Markdown diff generation)
          ↓
Human-in-the-Loop Review (Accept, Edit, or Reject with reasons)
          ↓
Deployment Preview (/preview/{id} with 7-point validation)
          ↓
Merge Gate (Gated until checks pass)
          ↓
Published Docs (docs.thally.dev or thally.dev/docs)
          ↓
Agent Knowledge (Structured chunks & provenance citations)
```

---

## 🏗️ Architecture Layers

Thally is built as a production-grade **Next.js 14 (App Router)** full-stack SaaS application:

* **Frontend Layer**: Modern vanilla CSS design system, responsive layouts, interactive D3 impact graph, side-by-side diff viewers, and command palette (`⌘K`).
* **API / Backend Layer**: REST endpoints for change detection, knowledge analysis, task creation, human review, deployment previews, and agent indexing.
* **Service Layer**: Pluggable provider abstractions for:
  * `RepositoryProvider` (Mock demo vs real GitHub Octokit provider)
  * `KnowledgeEngine` (Deterministic demo vs OpenAI GPT-4o / Anthropic provider)
  * `DeploymentProvider` (Simulated demo vs Vercel / Netlify API)
* **Data Layer**: Prisma ORM with SQLite for zero-config local development, seamlessly upgradeable to PostgreSQL for production hosting.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js `>= 18.17.0`
- npm `>= 9.0.0`

### 2. Installation
```bash
git clone <repo-url> thally
cd thally
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Database Setup & Seeding
```bash
# Push Prisma schema to SQLite
npx prisma db push

# Seed the Smart Sync scenario
npm run prisma:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the Thally Control Plane.
Open [http://localhost:3000/docs](http://localhost:3000/docs) to access the Live Documentation Site.

---

## 🔌 Switching from Demo Mode to Connected Production Mode

Thally cleanly distinguishes **Demo Mode** from **Connected Mode**. To connect real external services:

### 1. Switch Database to PostgreSQL
In `prisma/schema.prisma`, change:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
Set in `.env`:
```env
DATABASE_URL="postgresql://username:password@your-db-host:5432/thally?schema=public"
```

### 2. Connect Real GitHub Integration
Set in `.env`:
```env
DEMO_MODE=false
GITHUB_TOKEN="ghp_yourPersonalAccessToken"
GITHUB_WEBHOOK_SECRET="your_webhook_secret"
```

### 3. Connect Real AI Model (OpenAI / Anthropic)
Set in `.env`:
```env
AI_PROVIDER=openai
OPENAI_API_KEY="sk-yourOpenAiKey"
AI_MODEL="gpt-4o"
```

### 4. Configure Documentation Routing
Serve docs under a custom domain or path:
```env
DOCS_DOMAIN="docs.yourproduct.com"
DOCS_BASE_PATH="/docs"
```

---

## 🧪 Testing & Verification

Run the comprehensive test suite covering the full Smart Sync workflow:

```bash
# Run unit and integration tests
npm test

# Type-check TypeScript
npm run typecheck

# Production build test
npm run build
```

---

## 🛡️ Security & Health

- **Health Check Endpoint**: `GET /api/health` returns status of the database, AI engine, and repository provider without exposing secrets.
- **Role-Based Scopes**: Critical actions require explicit permissions (`project:write`, `docs:publish`).
- **Human Gating**: Documentation is never silently deployed without explicit review.
