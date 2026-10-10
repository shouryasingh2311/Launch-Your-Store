import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
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
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined)
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type

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
          type={effectiveType}
          className={cn(
            'clay-input w-full px-3.5 py-2.5 text-sm text-[var(--sc-ink)] placeholder:text-[var(--sc-muted)] min-h-[44px]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            Icon && 'pl-9',
            isPassword && 'pr-11',
            error && 'border-red-400 focus:border-red-500',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--sc-muted)] hover:text-brand transition-colors focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-[var(--sc-danger)] font-medium">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-[var(--sc-muted)]">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
