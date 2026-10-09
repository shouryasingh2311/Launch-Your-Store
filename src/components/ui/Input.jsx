import React from 'react'
import { cn } from '../../lib/utils'

export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className,
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--sc-ink)] tracking-wide uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--sc-muted)]">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'clay-input w-full px-3.5 py-2.5 text-sm text-[var(--sc-ink)] placeholder:text-[var(--sc-muted)] min-h-[44px]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            Icon && 'pl-9',
            error && 'border-red-400 focus:border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-[var(--sc-danger)] font-medium">⚠ {error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-[var(--sc-muted)]">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
