import React from 'react'
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react'
import type { RiskLevel } from '../types'

interface Props {
  level: RiskLevel
  size?: 'normal' | 'large'
}

export const TrafficLightBadge: React.FC<Props> = ({ level, size = 'normal' }) => {
  if (level === 'DANGEROUS') {
    return (
      <div className={`inline-flex items-center gap-2 rounded-full font-bold bg-red-100 text-red-700 border-2 border-red-500 ${size === 'large' ? 'px-6 py-3 text-2xl' : 'px-4 py-1.5 text-base'}`}>
        <ShieldAlert className={size === 'large' ? 'w-8 h-8 text-red-600' : 'w-5 h-5 text-red-600'} />
        <span>NGUY HIỂM (ĐỎ)</span>
      </div>
    )
  }

  if (level === 'SUSPICIOUS') {
    return (
      <div className={`inline-flex items-center gap-2 rounded-full font-bold bg-amber-100 text-amber-800 border-2 border-amber-500 ${size === 'large' ? 'px-6 py-3 text-2xl' : 'px-4 py-1.5 text-base'}`}>
        <AlertTriangle className={size === 'large' ? 'w-8 h-8 text-amber-600' : 'w-5 h-5 text-amber-600'} />
        <span>NGHI NGỜ (VÀNG)</span>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded-full font-bold bg-emerald-100 text-emerald-800 border-2 border-emerald-500 ${size === 'large' ? 'px-6 py-3 text-2xl' : 'px-4 py-1.5 text-base'}`}>
      <ShieldCheck className={size === 'large' ? 'w-8 h-8 text-emerald-600' : 'w-5 h-5 text-emerald-600'} />
      <span>AN TOÀN (XANH)</span>
    </div>
  )
}
