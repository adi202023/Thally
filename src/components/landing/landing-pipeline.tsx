"use client"

import React, { useState } from "react"
import { Bot, Code2, type LucideIcon, ScanSearch, Share2, CheckCircle2 } from "lucide-react"
import { Reveal } from "@/components/landing/reveal"

interface Stage {
  icon: LucideIcon
  title: string
  description: string
  detail?: string
}

const stages: Stage[] = [
  {
    icon: Code2,
    title: "Code Ingestion",
    description: "Monitoring GitHub & GitLab repositories for real-time changes.",
    detail: "Active webhooks on main branch",
  },
  {
    icon: ScanSearch,
    title: "Change Analysis",
    description: "14 evidence sources detected in last hour. Diffing metadata.",
    detail: "AST and semantic diffing",
  },
  {
    icon: Share2,
    title: "Knowledge Graph",
    description: "Smart Sync active. Structuring entities and relationships.",
    detail: "128 entity nodes linked",
  },
  {
    icon: Bot,
    title: "Agent Action",
    description: "Drafting documentation updates for immediate engineering review.",
    detail: "Human-in-the-loop review ready",
  },
]

export function LandingPipeline() {
  const [activeStage, setActiveStage] = useState<number | null>(null)

  return (
    <section id="pipeline" className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12 scroll-mt-20">
      <Reveal>
        <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Synthesis Pipeline</h2>
        <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
          From raw code changes to synthesized knowledge, monitored end to end.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stages.map((stage, i) => {
          const Icon = stage.icon
          const isHovered = activeStage === i
          return (
            <Reveal key={stage.title} delay={i * 90}>
              <div
                onMouseEnter={() => setActiveStage(i)}
                onMouseLeave={() => setActiveStage(null)}
                className={`group h-full rounded-xl border border-border bg-card p-6 transition-all duration-300 cursor-pointer ${
                  isHovered
                    ? 'border-[#F5A623]/60 shadow-[0_0_28px_-6px_rgba(245,166,35,0.3)] -translate-y-1 bg-muted/40'
                    : 'hover:border-foreground/30 hover:bg-muted/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`grid size-12 place-items-center rounded-lg transition-colors duration-300 ${
                    isHovered
                      ? 'bg-[#F5A623]/20 text-[#F5A623]'
                      : 'bg-muted text-muted-foreground group-hover:bg-[#F5A623]/15 group-hover:text-[#F5A623]'
                  }`}>
                    <Icon className="size-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-0.5 rounded border border-border bg-muted/60">
                    STAGE 0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-foreground flex items-center gap-2">
                  {stage.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">{stage.description}</p>
                {stage.detail && (
                  <div className="mt-4 pt-3 border-t border-border flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                    <span>{stage.detail}</span>
                  </div>
                )}
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

export default LandingPipeline
