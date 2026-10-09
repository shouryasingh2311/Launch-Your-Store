import React from 'react'
import { PackageOpen } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../lib/utils'

export function EmptyState({
  icon: Icon = PackageOpen,
  title = "No items found",
  description = "Get started by creating your first item in just a few clicks.",
  actionLabel,
  onAction,
  className
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 my-4", className)}>
      <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-inner">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
