"use client"

import React from "react"
import { LandingNav } from "@/components/landing/landing-nav"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingPipeline } from "@/components/landing/landing-pipeline"
import { LandingPreview } from "@/components/landing/landing-preview"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen font-sans">
      <LandingNav />
      <main>
        <LandingHero />
        <LandingPipeline />
        <LandingPreview />
      </main>
      <LandingFooter />
    </div>
  )
}
