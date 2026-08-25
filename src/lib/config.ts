// Thally — Central Configuration Layer
// All environment variables are accessed through this module.
// This prevents scattered process.env access and makes config explicit.

export const config = {
  // ── Application ──────────────────────────────────────────────────────────
  app: {
    name: 'Thally',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  },

  // ── Demo Mode ─────────────────────────────────────────────────────────────
  // When DEMO_MODE=true, all external providers use safe mock implementations.
  // Set DEMO_MODE=false and configure real provider credentials for production.
  demo: {
    enabled: process.env.DEMO_MODE !== 'false',
  },

  // ── Database ──────────────────────────────────────────────────────────────
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },

  // ── GitHub Integration ────────────────────────────────────────────────────
  github: {
    token: process.env.GITHUB_TOKEN,
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },

  // ── AI / Knowledge Engine ────────────────────────────────────────────────
  ai: {
    provider: process.env.AI_PROVIDER || 'demo', // demo | openai | anthropic
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.AI_MODEL || 'gpt-4o',
  },

  // ── Authentication ────────────────────────────────────────────────────────
  auth: {
    secret: process.env.NEXTAUTH_SECRET || 'demo-secret-change-in-production',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },

  // ── Deployment Provider ───────────────────────────────────────────────────
  deployment: {
    provider: process.env.DEPLOYMENT_PROVIDER || 'demo', // demo | vercel | netlify
    vercelToken: process.env.VERCEL_TOKEN,
    vercelTeamId: process.env.VERCEL_TEAM_ID,
    netlifyToken: process.env.NETLIFY_AUTH_TOKEN,
    netlifyAppId: process.env.NETLIFY_SITE_ID,
  },

  // ── Docs Domain ───────────────────────────────────────────────────────────
  docs: {
    // In production, set this to docs.yourdomain.com or yourdomain.com/docs
    domain: process.env.DOCS_DOMAIN || '',
    basePath: process.env.DOCS_BASE_PATH || '/docs',
  },
} as const;

export type Config = typeof config;

// ── Validation ────────────────────────────────────────────────────────────────
// Warn about missing non-demo config at startup in production
if (config.app.isProd && config.demo.enabled) {
  console.warn('[Thally] Warning: Running in Demo Mode in production. Set DEMO_MODE=false and configure real providers.');
}
