import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'danger-solid' | 'success-solid'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xl'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'
    
    const variants = {
      default: 'bg-slate-900 text-white shadow-xs hover:bg-slate-800',
      destructive: 'bg-red-600 text-white shadow-xs hover:bg-red-700',
      'danger-solid': 'bg-rose-600 text-white shadow-sm hover:bg-rose-700 ring-2 ring-rose-200',
      'success-solid': 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700',
      outline: 'border border-slate-200 bg-white shadow-xs hover:bg-slate-100 hover:text-slate-900',
      secondary: 'bg-slate-100 text-slate-900 shadow-xs hover:bg-slate-200',
      ghost: 'hover:bg-slate-100 hover:text-slate-900',
      link: 'text-slate-900 underline-offset-4 hover:underline'
    }

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 rounded-lg px-3 text-xs',
      lg: 'h-11 rounded-xl px-6 text-base',
      xl: 'h-14 rounded-2xl px-8 text-lg font-bold',
      icon: 'h-10 w-10'
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
