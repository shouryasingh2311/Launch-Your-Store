import React from 'react'
import { cn } from '../../lib/utils'

export function Badge({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'indigo' | 'store'
  size = 'md',
  className
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    store: 'bg-[var(--store-primary,#4f46e5)]/10 text-[var(--store-primary,#4f46e5)] border-[var(--store-primary,#4f46e5)]/20'
  }

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold'
  }

  return (
    <span className={cn('inline-flex items-center rounded-full border', variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}
