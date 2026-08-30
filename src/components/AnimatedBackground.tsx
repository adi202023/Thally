"use client"

import React, { useEffect, useRef } from "react"

type Theme = "dark" | "light"

interface AnimatedBackgroundProps {
  /** Adjusts particle/line color + opacity to sit over dark or light surfaces. */
  theme?: Theme
  /** Used ONLY for the traveling pulse of light. Everything else stays neutral. */
  accentColor?: string
  /** Optional className passthrough for the fixed container. */
  className?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

interface Pulse {
  a: number // index of particle A
  b: number // index of particle B
  t: number // 0 -> 1 progress along the line
  speed: number
  life: number // 0 -> 1, used for fade
}

/**
 * A subtle, performant knowledge-graph background.
 *
 * - Fixed, full-viewport, behind all content, pointer-events: none.
 * - Neutral white/grey particles + connection lines (never purple/blue).
 * - Occasional accent-colored pulse travels along a connection line.
 * - Canvas + requestAnimationFrame, pauses when tab hidden.
 * - Fewer particles + no lines on small screens.
 * - Respects prefers-reduced-motion (renders a static field).
 */
export function AnimatedBackground({
  theme = "dark",
  accentColor = "#F5A623",
  className,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const currentCanvas: HTMLCanvasElement = canvas
    const currentCtx: CanvasRenderingContext2D = ctx

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    // Neutral palette only. Dark theme -> soft white; light theme -> dark grey.
    const isDark = theme === "dark"
    const baseRGB = isDark ? "255, 255, 255" : "40, 40, 45"
    const particleOpacity = isDark ? 0.16 : 0.1
    const lineOpacityMax = isDark ? 0.14 : 0.09
    const accent = accentColor

    let width = 0
    let height = 0
    let dpr = 1
    let isMobile = false
    let particles: Particle[] = []
    let pulses: Pulse[] = []
    let rafId = 0
    let lastPulseAt = 0
    let running = true

    const connectDistance = () => (isMobile ? 0 : 130)

    function seedParticles() {
      isMobile = width < 768
      const area = width * height
      // ~1 particle per ~12k px^2, clamped, halved on mobile.
      let count = Math.round(area / 12000)
      count = Math.max(40, Math.min(150, count))
      if (isMobile) count = Math.round(count / 2)

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.8,
      }))
      pulses = []
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      currentCanvas.width = Math.floor(width * dpr)
      currentCanvas.height = Math.floor(height * dpr)
      currentCanvas.style.width = `${width}px`
      currentCanvas.style.height = `${height}px`
      currentCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seedParticles()
    }

    function drawParticle(p: Particle) {
      currentCtx.beginPath()
      currentCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      currentCtx.fillStyle = `rgba(${baseRGB}, ${particleOpacity})`
      currentCtx.fill()
    }

    function drawConnections() {
      const max = connectDistance()
      if (max <= 0) return
      const maxSq = max * max
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distSq = dx * dx + dy * dy
          if (distSq < maxSq) {
            const alpha = (1 - distSq / maxSq) * lineOpacityMax
            currentCtx.strokeStyle = `rgba(${baseRGB}, ${alpha})`
            currentCtx.lineWidth = 0.6
            currentCtx.beginPath()
            currentCtx.moveTo(a.x, a.y)
            currentCtx.lineTo(b.x, b.y)
            currentCtx.stroke()
          }
        }
      }
    }

    function maybeSpawnPulse(now: number) {
      if (isMobile) return
      if (now - lastPulseAt < 2600) return
      if (Math.random() > 0.5) return
      const max = connectDistance()
      const maxSq = max * max
      // Find a random pair of nearby particles.
      const candidates: Array<[number, number]> = []
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          if (dx * dx + dy * dy < maxSq) candidates.push([i, j])
        }
      }
      if (candidates.length === 0) return
      const [a, b] = candidates[Math.floor(Math.random() * candidates.length)]
      pulses.push({ a, b, t: 0, speed: 0.012 + Math.random() * 0.01, life: 1 })
      lastPulseAt = now
    }

    function drawPulses() {
      for (let k = pulses.length - 1; k >= 0; k--) {
        const pulse = pulses[k]
        const a = particles[pulse.a]
        const b = particles[pulse.b]
        if (!a || !b) {
          pulses.splice(k, 1)
          continue
        }
        pulse.t += pulse.speed
        // Fade in on the first 15%, fade out on the last 25%.
        if (pulse.t >= 1) {
          pulses.splice(k, 1)
          continue
        }
        const fade =
          pulse.t < 0.15
            ? pulse.t / 0.15
            : pulse.t > 0.75
              ? (1 - pulse.t) / 0.25
              : 1
        const x = a.x + (b.x - a.x) * pulse.t
        const y = a.y + (b.y - a.y) * pulse.t

        // Glow.
        const grad = currentCtx.createRadialGradient(x, y, 0, x, y, 6)
        grad.addColorStop(0, hexToRgba(accent, 0.9 * fade))
        grad.addColorStop(1, hexToRgba(accent, 0))
        currentCtx.fillStyle = grad
        currentCtx.beginPath()
        currentCtx.arc(x, y, 6, 0, Math.PI * 2)
        currentCtx.fill()

        // Core dot.
        currentCtx.fillStyle = hexToRgba(accent, fade)
        currentCtx.beginPath()
        currentCtx.arc(x, y, 1.6, 0, Math.PI * 2)
        currentCtx.fill()
      }
    }

    function step(now: number) {
      currentCtx.clearRect(0, 0, width, height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
        p.x = Math.max(0, Math.min(width, p.x))
        p.y = Math.max(0, Math.min(height, p.y))
      }

      drawConnections()
      for (const p of particles) drawParticle(p)
      maybeSpawnPulse(now)
      drawPulses()

      rafId = requestAnimationFrame(step)
    }

    function renderStatic() {
      currentCtx.clearRect(0, 0, width, height)
      drawConnections()
      for (const p of particles) drawParticle(p)
    }

    function handleVisibility() {
      if (document.visibilityState !== "visible") {
        running = false
        cancelAnimationFrame(rafId)
      } else if (!prefersReducedMotion && !running) {
        running = true
        rafId = requestAnimationFrame(step)
      }
    }

    resize()

    if (prefersReducedMotion) {
      renderStatic()
    } else {
      rafId = requestAnimationFrame(step)
    }

    const onResize = () => {
      resize()
      if (prefersReducedMotion) renderStatic()
    }

    window.addEventListener("resize", onResize)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [theme, accentColor])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  )
}

/** Convert #RRGGBB (or #RGB) to an rgba() string with the given alpha. */
function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace("#", "")
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("")
  }
  const r = Number.parseInt(h.slice(0, 2), 16)
  const g = Number.parseInt(h.slice(2, 4), 16)
  const b = Number.parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default AnimatedBackground
