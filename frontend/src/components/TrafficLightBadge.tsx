import React from 'react'
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react'
import type { RiskLevel } from '../types'
import { cn } from '../lib/utils'

interface Props {
  level: RiskLevel
  size?: 'normal' | 'large'
  className?: string
}

export const TrafficLightBadge: React.FC<Props> = ({ level, size = 'normal', className }) => {
  if (level === 'DANGEROUS') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs',
          size === 'large' ? 'px-5 py-2.5 text-xl' : 'px-3 py-1 text-xs sm:text-sm',
          className
        )}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
        </span>
        <ShieldAlert className={size === 'large' ? 'w-6 h-6 text-rose-600' : 'w-4 h-4 text-rose-600'} />
        <span>NGUY HIỂM (ĐỎ)</span>
      </div>
    )
  }

  if (level === 'SUSPICIOUS') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs',
          size === 'large' ? 'px-5 py-2.5 text-xl' : 'px-3 py-1 text-xs sm:text-sm',
          className
        )}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <AlertTriangle className={size === 'large' ? 'w-6 h-6 text-amber-600' : 'w-4 h-4 text-amber-600'} />
        <span>NGHI NGỜ (VÀNG)</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs',
        size === 'large' ? 'px-5 py-2.5 text-xl' : 'px-3 py-1 text-xs sm:text-sm',
        className
      )}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
      <ShieldCheck className={size === 'large' ? 'w-6 h-6 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />
      <span>AN TOÀN (XANH)</span>
    </div>
  )
}
