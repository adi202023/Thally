"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, Activity } from "lucide-react"
import { Reveal } from "@/components/landing/reveal"

export function LandingHero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-12 sm:pt-32">
      <Reveal className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#F5A623]/30 bg-[#F5A623]/10 px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-[#F5A623] transition-all hover:bg-[#F5A623]/20 cursor-default select-none shadow-sm">
          <span className="size-2 rounded-full bg-[#F5A623] animate-pulse" />
          Live infrastructure
        </span>

        <h1 className="mt-7 max-w-4xl text-balance text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Understand every signal across your stack
        </h1>

        <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-xl">
          A calm, connected view of your systems. The background renders a sparse knowledge graph — neutral by design,
          with a single amber pulse tracing the connections.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-md bg-[#F5A623] px-6 py-3 text-sm font-semibold text-[#0A0A0C] transition-all duration-200 hover:scale-105 hover:shadow-lg no-underline"
          >
            Get Started
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40 hover:bg-muted/80 no-underline"
          >
            View Docs
          </Link>
        </div>
      </Reveal>
    </section>
  )
}

export default LandingHero
