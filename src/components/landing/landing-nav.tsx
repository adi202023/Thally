"use client"

import Link from "next/link"
import React, { useState, useEffect } from "react"
import { Sun, Moon, ArrowUpRight } from "lucide-react"

import { ThallyLogo } from "@/components/ui/ThallyLogo"

export function LandingNav() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const dark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    setIsDark(dark)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle("dark", next)
    document.documentElement.classList.toggle("light", !next)
    localStorage.theme = next ? "dark" : "light"
    window.dispatchEvent(new Event("theme-change"))
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity no-underline flex items-center gap-2.5"
          >
            <ThallyLogo size={32} />
            <span>Thally</span>
          </Link>
        </div>

        {/* Center: Meaningful public navigation */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-full border border-border bg-card/60 backdrop-blur-sm shadow-sm">
          <a href="#pipeline" className="px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all no-underline">
            Features
          </a>
          <a href="#interactive-playground" className="px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all no-underline">
            Interactive Demo
          </a>
          <Link href="/docs" className="px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all no-underline">
            Documentation
          </Link>
          <Link href="/docs/api-reference" className="px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all no-underline">
            API Ref
          </Link>
          <Link href="/support" className="px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all no-underline">
            FAQs
          </Link>
        </div>

        {/* Right: theme switch + Dashboard CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg border border-foreground/20 bg-foreground text-background px-4 py-2 text-xs font-bold transition-all duration-200 hover:opacity-90 hover:scale-105 no-underline shadow-sm"
          >
            <span>Open Dashboard</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default LandingNav
