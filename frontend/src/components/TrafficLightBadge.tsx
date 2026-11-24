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
          'inline-flex items-center gap-2 rounded-xl font-black bg-rose-50 text-rose-800 border-2 border-rose-300 shadow-xs',
          size === 'large' ? 'px-4 py-2.5 text-base sm:text-lg' : 'px-3 py-1.5 text-xs sm:text-sm',
          className
        )}
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
        </span>
        <ShieldAlert className={size === 'large' ? 'w-5 h-5 text-rose-700' : 'w-4 h-4 text-rose-700'} />
        <span>NGUY HIỂM — TUYỆT ĐỐI KHÔNG CHUYỂN TIỀN</span>
      </div>
    )
  }

  if (level === 'SUSPICIOUS') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-xl font-black bg-amber-50 text-amber-900 border-2 border-amber-300 shadow-xs',
          size === 'large' ? 'px-4 py-2.5 text-base sm:text-lg' : 'px-3 py-1.5 text-xs sm:text-sm',
          className
        )}
      >
        <span className="h-3 w-3 rounded-full bg-amber-500"></span>
        <AlertTriangle className={size === 'large' ? 'w-5 h-5 text-amber-700' : 'w-4 h-4 text-amber-700'} />
        <span>NGHI NGỜ — CẦN KIỂM CHỨNG KỸ LƯỠNG</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-xl font-black bg-emerald-50 text-emerald-900 border-2 border-emerald-300 shadow-xs',
        size === 'large' ? 'px-4 py-2.5 text-base sm:text-lg' : 'px-3 py-1.5 text-xs sm:text-sm',
        className
      )}
    >
      <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
      <ShieldCheck className={size === 'large' ? 'w-5 h-5 text-emerald-700' : 'w-4 h-4 text-emerald-700'} />
      <span>AN TOÀN — NGUỒN CHÍNH THỨC ĐÃ XÁC MINH</span>
    </div>
  )
}
