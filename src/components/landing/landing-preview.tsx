"use client"

import React, { useState } from "react"
import {
  ArrowRight,
  Terminal,
  Bot,
  Radar,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  RefreshCw,
  GitPullRequest,
  BookOpen
} from "lucide-react"
import { Reveal } from "@/components/landing/reveal"
import Link from "next/link"

type TabType = "radar" | "agent" | "pipeline"

interface TopologyNode {
  id: string
  name: string
  service: string
  risk: "low" | "moderate" | "high"
  endpoints: number
  dependents: string[]
}

const TOPOLOGY_NODES: TopologyNode[] = [
  {
    id: "auth",
    name: "Auth Middleware",
    service: "services/auth/jwt.ts",
    risk: "moderate",
    endpoints: 12,
    dependents: ["API Gateway", "User Service", "Billing Portal"],
  },
  {
    id: "gateway",
    name: "API Gateway",
    service: "gateway/proxy.go",
    risk: "low",
    endpoints: 48,
    dependents: ["Checkout Flow", "Notification Worker"],
  },
  {
    id: "user",
    name: "User Service",
    service: "apps/api/users.rs",
    risk: "low",
    endpoints: 19,
    dependents: ["Profile API", "Audit Logger"],
  },
  {
    id: "billing",
    name: "Billing DB Adapter",
    service: "packages/db/billing.ts",
    risk: "high",
    endpoints: 6,
    dependents: ["Stripe Webhook", "Subscription Daemon"],
  },
]

const SAMPLE_QUERIES = [
  {
    q: "What permissions are required for Smart Sync?",
    title: "RBAC & Scopes — Smart Sync",
    summary: "Smart Sync requires the project:write scope for write access, and docs:read for schema indexing.",
    citations: ["docs/permissions.md", "packages/auth/scopes.ts"],
    confidence: "99.4%",
  },
  {
    q: "Show blast radius for PR #4092 auth update",
    title: "PR #4092 Impact Analysis",
    summary: "3 services touched: Auth Middleware, API Gateway, and User Service. 0 breaking schema changes detected.",
    citations: ["PR #4092", "graph/topology.json"],
    confidence: "98.8%",
  },
  {
    q: "What sync frequencies are available?",
    title: "Sync Scheduling Modes",
    summary: "Supported modes: Manual, Hourly (on commit detect), Daily, and Weekly cron configurations.",
    citations: ["docs/smart-sync.md"],
    confidence: "100%",
  },
]

export function LandingPreview() {
  const [activeTab, setActiveTab] = useState<TabType>("radar")
  const [selectedNode, setSelectedNode] = useState<TopologyNode>(TOPOLOGY_NODES[0])
  const [activeQueryIndex, setActiveQueryIndex] = useState(0)
  const [isQuerying, setIsQuerying] = useState(false)

  // Pipeline runner simulation
  const [pipelineRunning, setPipelineRunning] = useState(false)
  const [pipelineStep, setPipelineStep] = useState(0)

  const handleRunPipeline = () => {
    if (pipelineRunning) return
    setPipelineRunning(true)
    setPipelineStep(1)
    setTimeout(() => setPipelineStep(2), 700)
    setTimeout(() => setPipelineStep(3), 1400)
    setTimeout(() => setPipelineStep(4), 2100)
    setTimeout(() => {
      setPipelineRunning(false)
    }, 2800)
  }

  const handleQueryClick = (idx: number) => {
    setActiveQueryIndex(idx)
    setIsQuerying(true)
    setTimeout(() => setIsQuerying(false), 300)
  }

  return (
    <section id="interactive-playground" className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12 scroll-mt-20">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-card font-mono text-[11px] font-semibold text-[#F5A623] uppercase tracking-wider mb-2">
              <Zap size={13} className="text-[#F5A623]" />
              Interactive Control Plane
            </span>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Experience the Engine in Real-Time
            </h2>
            <p className="mt-2 max-w-2xl text-pretty text-sm sm:text-base text-muted-foreground">
              Interact directly with live dependency radar, query the knowledge graph, and simulate automated documentation synthesis.
            </p>
          </div>

          {/* Interactive Mode Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-border bg-card shadow-sm self-start md:self-auto">
            <button
              onClick={() => setActiveTab("radar")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
                activeTab === "radar"
                  ? "bg-foreground text-background shadow"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Radar size={15} />
              <span>Impact Radar</span>
            </button>

            <button
              onClick={() => setActiveTab("agent")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
                activeTab === "agent"
                  ? "bg-foreground text-background shadow"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bot size={15} />
              <span>Agent Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab("pipeline")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
                activeTab === "pipeline"
                  ? "bg-foreground text-background shadow"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Terminal size={15} />
              <span>CI/CD Pipeline</span>
            </button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl min-h-[460px] flex flex-col justify-between">
          {/* ── TAB 1: IMPACT RADAR SANDBOX ──────────────────────────── */}
          {activeTab === "radar" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-foreground">Service Dependency Graph & Risk Analysis</h3>
                  <p className="text-xs text-muted-foreground">Select a service node below to calculate upstream blast radius</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    LIVE TOPOLOGY
                  </span>
                </div>
              </div>

              {/* Node Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {TOPOLOGY_NODES.map((node) => {
                  const isSelected = selectedNode.id === node.id
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#F5A623] bg-muted/60 shadow-[0_0_20px_-5px_rgba(245,166,35,0.3)] ring-1 ring-[#F5A623]"
                          : "border-border bg-background hover:border-foreground/30 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          node.risk === "high"
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : node.risk === "moderate"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        }`}>
                          {node.risk} risk
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">{node.endpoints} APIs</span>
                      </div>
                      <h4 className="font-semibold text-sm text-foreground mt-3">{node.name}</h4>
                      <p className="text-xs font-mono text-muted-foreground truncate mt-1">{node.service}</p>
                    </div>
                  )
                })}
              </div>

              {/* Selected Node Details Card */}
              <div className="p-5 rounded-xl border border-border bg-background flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">ACTIVE INSPECTION:</span>
                    <span className="font-bold text-sm text-foreground">{selectedNode.name}</span>
                    <span className="text-xs font-mono text-muted-foreground">({selectedNode.service})</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground pt-1">
                    <span>Direct Dependents:</span>
                    {selectedNode.dependents.map((dep) => (
                      <span key={dep} className="px-2 py-0.5 rounded bg-muted border border-border text-foreground font-medium text-[11px]">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/impact"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity no-underline self-start md:self-auto flex-shrink-0"
                >
                  <span>Open Full Radar</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* ── TAB 2: AGENT QUERY SANDBOX ───────────────────────────── */}
          {activeTab === "agent" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-foreground">Natural Language Context Engine</h3>
                  <p className="text-xs text-muted-foreground">Ask questions against synchronized repository documentation and schemas</p>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">100% PROVENANCE VERIFIED</span>
              </div>

              {/* Prompt Suggestion Chips */}
              <div className="flex gap-2 flex-wrap">
                {SAMPLE_QUERIES.map((sq, i) => (
                  <button
                    key={sq.q}
                    onClick={() => handleQueryClick(i)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                      activeQueryIndex === i
                        ? "bg-foreground text-background border-foreground font-semibold"
                        : "bg-muted text-muted-foreground border-border hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {sq.q}
                  </button>
                ))}
              </div>

              {/* Verified Answer Panel */}
              <div className="p-6 rounded-xl border border-border bg-background relative overflow-hidden">
                {isQuerying ? (
                  <div className="py-8 flex items-center justify-center gap-3 text-muted-foreground text-sm font-medium">
                    <RefreshCw size={16} className="animate-spin text-[#F5A623]" />
                    <span>Querying knowledge graph chunks...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center">
                          <ShieldCheck size={14} />
                        </div>
                        <h4 className="font-bold text-sm text-foreground m-0">
                          {SAMPLE_QUERIES[activeQueryIndex].title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {SAMPLE_QUERIES[activeQueryIndex].confidence} MATCH
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed m-0">
                      {SAMPLE_QUERIES[activeQueryIndex].summary}
                    </p>

                    <div className="pt-3 border-t border-border flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono text-muted-foreground">Citations:</span>
                      {SAMPLE_QUERIES[activeQueryIndex].citations.map((cite) => (
                        <span key={cite} className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-muted border border-border text-foreground">
                          <FileCode size={12} className="text-muted-foreground" />
                          {cite}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  href="/agent"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:opacity-80 transition-opacity no-underline"
                >
                  <span>Open Knowledge Agent</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}

          {/* ── TAB 3: CI/CD PIPELINE INGESTION SIMULATOR ─────────────── */}
          {activeTab === "pipeline" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-foreground">Automated Sync Ingestion Runner</h3>
                  <p className="text-xs text-muted-foreground">Test the automated pipeline triggers from commit to verified documentation PR</p>
                </div>
                <button
                  onClick={handleRunPipeline}
                  disabled={pipelineRunning}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F5A623] text-[#0A0A0C] text-xs font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer border-none shadow-sm"
                >
                  <Play size={13} className={pipelineRunning ? "animate-spin" : ""} />
                  <span>{pipelineRunning ? "Running Pipeline..." : "Trigger Mock Ingestion"}</span>
                </button>
              </div>

              {/* Stepper visualization */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { step: 1, title: "1. Webhook Ingest", desc: "PR #4092 received from GitHub" },
                  { step: 2, title: "2. AST Semantic Diff", desc: "3 route handlers analyzed" },
                  { step: 3, title: "3. Graph Entity Update", desc: "Entity relationships linked" },
                  { step: 4, title: "4. Proposal PR Created", desc: "Ready for maintainer sign-off" },
                ].map((s) => {
                  const isDone = pipelineStep >= s.step
                  const isCurrent = pipelineStep === s.step && pipelineRunning
                  return (
                    <div
                      key={s.step}
                      className={`p-4 rounded-xl border transition-all ${
                        isDone
                          ? "border-emerald-500/40 bg-emerald-500/5"
                          : isCurrent
                          ? "border-[#F5A623] bg-muted/60 animate-pulse"
                          : "border-border bg-background opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">STEP 0{s.step}</span>
                        {isDone ? (
                          <CheckCircle2 size={15} className="text-emerald-500" />
                        ) : (
                          <span className="size-2 rounded-full bg-border" />
                        )}
                      </div>
                      <h4 className="font-semibold text-xs text-foreground mt-2">{s.title}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  )
                })}
              </div>

              {/* Terminal Log */}
              <div className="p-4 rounded-xl border border-border bg-[#090a0f] font-mono text-xs text-zinc-300 space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-zinc-800 pb-2 mb-2">
                  <span>TELEMETRY STDOUT · PIPELINE #8841</span>
                  <span>SYNC ENGINE v2.4.0</span>
                </div>
                <p className="text-zinc-400 m-0">[00:00.02] Hook received: push payload to branch &apos;main&apos; (sha: a7b2c9f)</p>
                {pipelineStep >= 2 && <p className="text-emerald-400 m-0">[00:00.64] Parser OK: 3 AST nodes changed in services/auth/jwt.ts</p>}
                {pipelineStep >= 3 && <p className="text-amber-400 m-0">[00:01.32] Graph Sync: 128 entity nodes refreshed with 0 circular dependencies</p>}
                {pipelineStep >= 4 && <p className="text-blue-400 m-0">[00:02.10] Documentation Proposal Draft created &rarr; PR-4092 Human Review Gate Active</p>}
              </div>
            </div>
          )}

          {/* Bottom Footer Telemetry */}
          <div className="mt-8 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-time synthesis engine ready</span>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-foreground font-semibold hover:opacity-80 transition-opacity no-underline"
            >
              <span>Go to Full Workspace Control Plane</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default LandingPreview
