import React from 'react'

interface Props {
  score: number // 0 to 100
  size?: number
  showLabel?: boolean
}

export const RiskGauge: React.FC<Props> = ({ score, size = 160, showLabel = true }) => {
  // Normalize score between 0 and 100
  const normalizedScore = Math.min(Math.max(score, 0), 100)

  // Arc calculations for a 220-degree gauge (from -110deg to +110deg)
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const arcLength = circumference * (220 / 360)
  const strokeDashoffset = arcLength - (arcLength * normalizedScore) / 100

  // Determine color based on score
  const getColor = () => {
    if (normalizedScore >= 70) return '#e11d48' // Rose-600
    if (normalizedScore >= 40) return '#d97706' // Amber-600
    return '#059669' // Emerald-600
  }

  const getLabel = () => {
    if (normalizedScore >= 70) return 'NGUY HIỂM CAO'
    if (normalizedScore >= 40) return 'NGHI NGỜ'
    return 'AN TOÀN'
  }

  const color = getColor()

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg
        width={size}
        height={size * 0.85}
        viewBox="0 0 160 135"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="gaugeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
          <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Background Arc */}
        <path
          d="M 23 115 A 60 60 0 1 1 137 115"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Active Arc with color */}
        <path
          d="M 23 115 A 60 60 0 1 1 137 115"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
          filter="url(#gaugeShadow)"
        />

        {/* Center Score Readout */}
        <text
          x="80"
          y="75"
          textAnchor="middle"
          className="font-mono font-black text-3xl"
          fill="#0f172a"
          style={{ fontSize: '32px', fontWeight: 900 }}
        >
          {normalizedScore}
        </text>
        <text
          x="80"
          y="95"
          textAnchor="middle"
          className="text-xs font-bold uppercase tracking-wider"
          fill="#64748b"
          style={{ fontSize: '10px', letterSpacing: '0.08em' }}
        >
          CHỈ SỐ RỦI RO / 100
        </text>
      </svg>

      {showLabel && (
        <div
          className="mt-1 px-3 py-0.5 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-2xs"
          style={{
            backgroundColor: `${color}15`,
            color: color,
            border: `1px solid ${color}40`
          }}
        >
          {getLabel()}
        </div>
      )}
    </div>
  )
}
