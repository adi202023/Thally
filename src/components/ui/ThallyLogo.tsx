import React from 'react'

interface ThallyLogoProps {
  size?: number
  className?: string
}

export function ThallyLogo({ size = 32, className = '' }: ThallyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none flex-shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="logoBgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B0E14" />
          <stop offset="100%" stopColor="#161B26" />
        </linearGradient>

        <linearGradient id="logoTopBarGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="60%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#FF3366" />
        </linearGradient>

        <linearGradient id="logoStemGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="40%" stopColor="#FF6B35" />
          <stop offset="85%" stopColor="#63F5FF" />
          <stop offset="100%" stopColor="#00E5FF" />
        </linearGradient>

        <linearGradient id="logoSyncBladeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#63F5FF" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Squircle Base Tile */}
      <rect
        x="20"
        y="20"
        width="472"
        height="472"
        rx="116"
        fill="url(#logoBgGrad2)"
        stroke="rgba(255, 255, 255, 0.14)"
        strokeWidth="10"
      />
      <rect
        x="28"
        y="28"
        width="456"
        height="456"
        rx="108"
        fill="none"
        stroke="rgba(245, 166, 35, 0.3)"
        strokeWidth="3"
      />

      {/* Subtle Background Mesh Line */}
      <circle
        cx="256"
        cy="240"
        r="160"
        fill="none"
        stroke="url(#logoStemGrad2)"
        strokeWidth="3"
        strokeDasharray="10 14"
        opacity="0.25"
      />

      {/* Top Crossbar of 'T' */}
      <path
        d="M 116 140 C 116 122.3 130.3 108 148 108 L 364 108 C 381.7 108 396 122.3 396 140 C 396 157.7 381.7 172 364 172 L 148 172 C 130.3 172 116 157.7 116 140 Z"
        fill="url(#logoTopBarGrad2)"
      />

      {/* Accent Detailing Notches */}
      <circle cx="152" cy="140" r="12" fill="#0B0E14" />
      <circle cx="152" cy="140" r="6" fill="#F5A623" />

      <circle cx="360" cy="140" r="12" fill="#0B0E14" />
      <circle cx="360" cy="140" r="6" fill="#FF3366" />

      {/* Vertical Stem of 'T' */}
      <path
        d="M 224 172 L 288 172 L 288 328 C 288 345.7 273.7 360 256 360 C 238.3 360 224 345.7 224 328 Z"
        fill="url(#logoStemGrad2)"
      />

      {/* Synchronizing Orbit Wave */}
      <path
        d="M 172 268 C 172 220 200 200 256 200 C 312 200 340 220 340 268 C 340 316 300 356 256 356 C 220 356 192 332 188 300"
        fill="none"
        stroke="url(#logoSyncBladeGrad2)"
        strokeWidth="24"
        strokeLinecap="round"
        strokeDasharray="140 30"
        opacity="0.95"
      />

      {/* Glowing Terminal Pulse Bead */}
      <circle cx="256" cy="356" r="18" fill="#0B0E14" stroke="#63F5FF" strokeWidth="6" />
      <circle cx="256" cy="356" r="8" fill="#63F5FF" />
    </svg>
  )
}
