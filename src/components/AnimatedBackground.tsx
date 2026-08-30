"use client"

import React, { useEffect, useRef, useState } from "react"

type Theme = "dark" | "light"
type Variant = "dashboard" | "landing"

interface AnimatedBackgroundProps {
  /** Adjusts particle/line color + opacity to sit over dark or light surfaces. */
  theme?: Theme
  /** Controls intensity: dashboard is subtle & calm; landing is balanced & refined. */
  variant?: Variant
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
  originR: number
}

interface Pulse {
  a: number // index of particle A
  b: number // index of particle B
  t: number // 0 -> 1 progress along the line
  speed: number
  life: number // 0 -> 1, used for fade
}

/**
 * A reactive, non-clingy knowledge-graph background.
 * Automatically updates on theme toggle without page reload.
 */
export function AnimatedBackground({
  theme,
  variant = "dashboard",
  accentColor = "#F5A623",
  className,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeTheme, setActiveTheme] = useState<Theme>(() => {
    if (theme) return theme
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light"
    }
    return "dark"
  })

  // Keep activeTheme in sync with explicit prop
  useEffect(() => {
    if (theme) setActiveTheme(theme)
  }, [theme])

  // Instant real-time MutationObserver on <html> class list to switch theme without refresh
  useEffect(() => {
    const updateThemeFromDOM = () => {
      const isDark = document.documentElement.classList.contains("dark")
      setActiveTheme(isDark ? "dark" : "light")
    }

    updateThemeFromDOM()

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "class") {
          updateThemeFromDOM()
        }
      }
    })

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    window.addEventListener("theme-change", updateThemeFromDOM)

    return () => {
      observer.disconnect()
      window.removeEventListener("theme-change", updateThemeFromDOM)
    }
  }, [])

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

    const isDark = activeTheme === "dark"
    const isLanding = variant === "landing"

    // Dashboard: exact original intensity. Landing: refined, non-clingy subtle intensity.
    const baseRGB = isDark ? "255, 255, 255" : isLanding ? "30, 41, 59" : "40, 40, 45"
    const particleOpacity = isDark
      ? (isLanding ? 0.18 : 0.16)
      : (isLanding ? 0.22 : 0.12)
    const lineOpacityMax = isDark
      ? (isLanding ? 0.15 : 0.14)
      : (isLanding ? 0.18 : 0.10)
    const accent = isDark ? accentColor : "#D97706"

    let width = 0
    let height = 0
    let dpr = 1
    let isMobile = false
    let particles: Particle[] = []
    let pulses: Pulse[] = []
    let rafId = 0
    let lastPulseAt = 0
    let running = true

    let mouseX = -9999
    let mouseY = -9999

    const connectDistance = () => (isMobile ? 0 : isLanding ? 135 : 130)
    // Non-clingy subtle cursor range on landing only
    const mouseConnectDistance = isLanding ? 120 : 0

    function seedParticles() {
      isMobile = width < 768
      const area = width * height
      let count = Math.round(area / (isLanding ? 12000 : 12000))
      count = Math.max(40, Math.min(140, count))
      if (isMobile) count = Math.round(count / 2)

      particles = Array.from({ length: count }, () => {
        const r = Math.random() * 1.3 + 0.9
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r,
          originR: r,
        }
      })
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
            currentCtx.lineWidth = isDark ? 0.6 : 0.7
            currentCtx.beginPath()
            currentCtx.moveTo(a.x, a.y)
            currentCtx.lineTo(b.x, b.y)
            currentCtx.stroke()
          }
        }
      }

      // Subtle, non-clingy cursor connection on landing only
      if (mouseConnectDistance > 0 && mouseX > 0 && mouseY > 0 && !isMobile) {
        const mouseSq = mouseConnectDistance * mouseConnectDistance
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          const dx = p.x - mouseX
          const dy = p.y - mouseY
          const distSq = dx * dx + dy * dy
          if (distSq < mouseSq) {
            const ratio = 1 - distSq / mouseSq
            const alpha = ratio * (isDark ? 0.28 : 0.32)
            currentCtx.strokeStyle = `rgba(${baseRGB}, ${alpha})`
            currentCtx.lineWidth = 0.75
            currentCtx.beginPath()
            currentCtx.moveTo(p.x, p.y)
            currentCtx.lineTo(mouseX, mouseY)
            currentCtx.stroke()
          }
        }
      }
    }

    function maybeSpawnPulse(now: number) {
      if (isMobile) return
      if (now - lastPulseAt < 2400) return
      if (Math.random() > 0.45) return
      const max = connectDistance()
      const maxSq = max * max
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
      pulses.push({ a, b, t: 0, speed: 0.013 + Math.random() * 0.01, life: 1 })
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

        // Glow
        const grad = currentCtx.createRadialGradient(x, y, 0, x, y, 6)
        grad.addColorStop(0, hexToRgba(accent, 0.9 * fade))
        grad.addColorStop(1, hexToRgba(accent, 0))
        currentCtx.fillStyle = grad
        currentCtx.beginPath()
        currentCtx.arc(x, y, 6, 0, Math.PI * 2)
        currentCtx.fill()

        // Core dot
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

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleMouseLeave = () => {
      mouseX = -9999
      mouseY = -9999
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
    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [activeTheme, variant, accentColor])

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
