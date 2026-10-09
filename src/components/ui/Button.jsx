import React from 'react'
import { cn } from '../../lib/utils'

export const Button = React.forwardRef(({
  children,
  className,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'store'
  size = 'md',         // 'sm' | 'md' | 'lg' | 'icon'
  isLoading = false,
  disabled = false,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = [
    'inline-flex items-center justify-center font-semibold rounded-[14px] transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sc-ink)] focus-visible:ring-offset-2',
    'active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none select-none',
  ].join(' ')

  const variants = {
    primary: [
      'bg-[var(--sc-ink)] text-[var(--sc-champagne)] hover:bg-[var(--sc-ink-hover)]',
      'shadow-[0_3px_0_0_#0A6048,0_6px_16px_-2px_rgba(6,78,59,0.20)]',
      'active:shadow-[0_1px_0_0_#0A6048]',
    ].join(' '),
    secondary: 'bg-champagne-card text-brand border border-champagne-border hover:bg-champagne hover:border-brand/30',
    outline:   'border-2 border-[var(--sc-ink)] bg-transparent text-[var(--sc-ink)] hover:bg-[var(--sc-ink)] hover:text-[var(--sc-champagne)]',
    ghost:     'bg-transparent text-[var(--sc-muted)] hover:bg-champagne-card hover:text-[var(--sc-ink)]',
    danger:    'bg-[var(--sc-danger-bg)] text-[var(--sc-danger)] border border-red-200 hover:bg-red-600 hover:text-white',
    // Storefront-only: maps to store theme vars
    store:     'bg-[var(--store-primary,#064E3B)] text-[var(--store-primary-contrast,#F8E7C9)] hover:opacity-90 focus-visible:ring-[var(--store-primary)] rounded-[var(--store-radius,8px)]',
  }

  const sizes = {
    sm:   'text-xs  px-3   py-1.5 h-9  gap-1.5 min-h-[36px]',
    md:   'text-sm  px-4.5 py-2   h-11 gap-2   min-h-[44px]',
    lg:   'text-sm  px-6   py-2.5 h-12 gap-2.5 min-h-[48px]',
    icon: 'h-11 w-11 p-0 min-h-[44px] min-w-[44px]',
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
