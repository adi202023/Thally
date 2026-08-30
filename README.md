# Thally — The Control Plane for Product Knowledge

[![Live Demo](https://img.shields.io/badge/Live%20Demo-thally--kohl.vercel.app-F5A623?style=for-the-badge&logo=vercel&logoColor=black)](https://thally-kohl.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> 🌐 **Live Website**: [https://thally-kohl.vercel.app/](https://thally-kohl.vercel.app/)  
> 📖 **Documentation Portal**: [https://thally-kohl.vercel.app/docs](https://thally-kohl.vercel.app/docs)  
> 🤖 **AI Agent QA Engine**: [https://thally-kohl.vercel.app/agent](https://thally-kohl.vercel.app/agent)  

---

## 💡 What is Thally?

**Thally** is an intelligent documentation and knowledge synchronization platform that bridges the gap between **code reality** and **trusted documentation**. 

When engineers merge code changes into a repository, documentation often goes stale. Thally listens to repository signals, identifies affected knowledge areas across your ecosystem, gathers concrete source evidence, proposes precise documentation updates, lets human maintainers review and edit proposals, generates deployment previews with automated quality checks, and publishes only verified knowledge to both human documentation portals and AI agent surfaces.

---

## 🏆 Track 1: Keep Product Knowledge Current

Thally demonstrates the complete end-to-end lifecycle of carrying a real product change (**Smart Sync v1.1.0 · commit `a3f8c2d`**) through to verified, published documentation:

```
[ Git Commit / PR ] ──► [ Impact Analysis ] ──► [ Source Evidence (14 Signals) ]
                                                            │
[ Live Docs Portal ] ◄── [ Gated Staging Preview ] ◄── [ Human Maintainer Review ]
        │                       (7 Checks Passed)           (Accept / Edit / Reject)
        ▼
[ AI Agent Knowledge QA ] (With Provenance Citations & MCP API)
```

### 📋 Track 1 Submission Workflow Matrix

| Step | Platform Surface | Description |
|---|---|---|
| **1. Meaningful Product Change** | [Dashboard](https://thally-kohl.vercel.app/dashboard) & [Changes](https://thally-kohl.vercel.app/changes) | Detects `Smart Sync v1.1.0` (commit `a3f8c2d`), adding automated documentation sync, `POST /v1/sync`, and `project:write` scope. |
| **2. Knowledge Area Identification** | [Knowledge Impact Report](https://thally-kohl.vercel.app/changes/change-smartsync-001/report) | Evaluates **10 knowledge areas** (6 definitely affected, 1 possibly, 3 unaffected). |
| **3. Topological Blast Radius** | [Impact Radar](https://thally-kohl.vercel.app/impact) | Visualizes real-time dependency impact, touched services, and latency estimates. |
| **4. Source Evidence & Traceability** | [Evidence Sources](https://thally-kohl.vercel.app/changes/change-smartsync-001/evidence) | Gathers 14 connected evidence signals across git AST diffs, schema files, and tests. |
| **5. Maintainer Review & Editing** | [Engineering Review](https://thally-kohl.vercel.app/review) / [Impact Review](https://thally-kohl.vercel.app/impact) | Maintainer can **Accept**, **Edit** (built-in IDE code editor), or **Reject** with feedback. |
| **6. Staging Deployment Preview** | [Deployment Previews](https://thally-kohl.vercel.app/preview) | Deploys isolated preview with **7 automated verification checks** (Link integrity, schema check, RBAC guard). |
| **7. Trusted Documentation Merge** | [Docs Portal](https://thally-kohl.vercel.app/docs) & [Smart Sync Guide](https://thally-kohl.vercel.app/docs/smart-sync) | Publishes vetted documentation with sticky TOC, commit provenance, and version tags. |
| **8. AI Agent Reflection & MCP** | [Agent QA](https://thally-kohl.vercel.app/agent) & `/api/mcp` | Natural language question answering citing exact doc provenance links, plus Model Context Protocol API. |

---

## 🔍 Maintainer Retrospective (Analysis of Thally's Intelligence)

* **What Thally understood correctly**:
  - Automatically detected all 6 affected documentation areas (`smart-sync`, `project-settings`, `getting-started`, `permissions`, `api-reference`, `changelog`).
  - Extracted the exact `project:write` RBAC scope requirement directly from route authorization guards.
  - Formulated the exact JSON schema and parameter types for `POST /v1/sync`.
* **What Thally missed or overstated**:
  - *Overstated*: Initially flagged `Security Overview` as potentially affected because auth middleware was touched, but no token schemas or encryption algorithms changed.
  - *Missed*: Missed the daily quota rate limit (**100 syncs/day**) on the first pass, which the maintainer easily injected using the **Edit Proposal** modal.
* **What was verified manually**:
  - Confirmed that users with `Viewer` role receive `403 Forbidden` on sync endpoints.
  - Verified in the deployment preview that unselected documentation sources remain completely untouched.

---

## 🎨 Key Features & Interactive Architecture

### 1. 🌟 Public Landing Experience (`/`)
- Dynamic, theme-aware interactive canvas knowledge graph.
- Interactive **Pipeline Walkthrough** and **Live Demo Sandbox**.
- Direct workspace access bypassing login walls.
- Instant theme toggle (Dark Mode / Light Mode) without page refresh.

### 2. ⚡ Control Plane Dashboard (`/dashboard`)
- Real-time pipeline health, connected evidence streams, and system metrics.
- Command Palette (`⌘K`) for instant resource search across tools and documentation.

### 3. 🎯 Topological Dependency Graph (`/impact`)
- Visual node graph rendering source nodes, direct dependencies, and cascading downstream impact.
- Floating maintainer action toolbar with **Edit Code Modal**, **Approve Pipeline**, and **Reject Feedback Modal**.

### 4. 🤖 AI Agent Knowledge QA (`/agent`)
- Interactive assistant allowing developers to query product knowledge.
- Responses contain verified provenance badges linking directly to published documentation commits.

### 5. 🔌 Agent Surfaces & Model Context Protocol
- **JSON API**: `GET /api/docs/:slug` for structured document ingestion.
- **Raw Markdown**: `GET /api/docs/:slug?format=markdown` for LLM consumption.
- **JSON-LD Schema**: `GET /api/docs/:slug/jsonld` (`TechArticle` schema.org).
- **MCP Manifest**: `GET /api/mcp` for Model Context Protocol agent discovery.
- **Sitemap & Robots**: `/sitemap.xml` & `/robots.txt` declaring crawlability for GPTBot, ClaudeBot, and AI crawlers.

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/adi202023/Thally.git
cd Thally
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Initialize Database & Seed
```bash
# Push Prisma schema to SQLite
npx prisma db push

# Seed demo knowledge areas & Smart Sync product change
npm run prisma:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Build Commands

```bash
# Type check TypeScript
npx tsc --noEmit

# Production build
npm run build

# Verify API surfaces
curl http://localhost:3000/api/mcp
curl http://localhost:3000/api/docs/smart-sync
```

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS Design System + [Tailwind CSS](https://tailwindcss.com/)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with SQLite (local) / PostgreSQL (production)
- **Icons**: [Lucide React](https://lucide.dev/) & [Google Material Symbols](https://fonts.google.com/icons)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📄 License

MIT © [Aditya Sheregar](https://github.com/adi202023)
