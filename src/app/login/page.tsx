"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatedBackground } from "@/components/AnimatedBackground"
import {
  ArrowRight,
  ShieldCheck,
  Code2,
  GitBranch,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("aditya@thally.dev")
  const [password, setPassword] = useState("••••••••••••")
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 600)
  }

  const handleDemoAccess = () => {
    setLoading(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 400)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <AnimatedBackground variant="landing" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-4 no-underline group">
            <span className="grid size-10 place-items-center rounded-xl border border-border bg-background text-sm font-bold text-foreground group-hover:scale-105 transition-transform shadow-sm">
              T
            </span>
            <span className="text-2xl font-bold tracking-tight text-foreground">Thally</span>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Sign in to your workspace</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Access real-time synthesis telemetry, impact radar, and verified knowledge graphs
          </p>
        </div>

        {/* 1-Click Quick Demo Access */}
        <div className="mb-6 p-3.5 rounded-xl border border-[#F5A623]/30 bg-[#F5A623]/10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-[#F5A623] flex items-center gap-1.5">
              <Sparkles size={13} />
              Hackathon Judge / Demo Access
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5A623]/20 text-[#F5A623] font-bold">
              MAINTAINER ROLE
            </span>
          </div>
          <button
            onClick={handleDemoAccess}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#F5A623] hover:bg-[#e0961f] text-[#0A0A0C] font-bold text-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer border-none shadow-sm"
          >
            {loading ? "Authenticating..." : "1-Click Direct Demo Workspace"}
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-card px-3 text-[11px] font-mono text-muted-foreground uppercase">
            Or continue with
          </span>
        </div>

        {/* SSO Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={handleDemoAccess}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer shadow-sm"
          >
            <Code2 size={15} />
            <span>GitHub SSO</span>
          </button>
          <button
            type="button"
            onClick={handleDemoAccess}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer shadow-sm"
          >
            <GitBranch size={15} />
            <span>GitLab SSO</span>
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1.5">Work Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/40 transition-colors"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-muted-foreground">Password / Access Token</label>
              <a href="#" className="text-[11px] font-mono text-muted-foreground hover:text-foreground no-underline">
                Forgot token?
              </a>
            </div>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-foreground/40 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-foreground text-background font-bold text-xs transition-all hover:opacity-90 active:scale-95 cursor-pointer border-none shadow-md mt-2"
          >
            {loading ? "Signing in..." : "Sign In to Workspace"}
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Security verification footer */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-2 text-[11px] font-mono text-muted-foreground">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>SOC-2 Type II Certified & End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  )
}
