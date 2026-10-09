import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../lib/utils'

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the requested data. Please verify your connection and try again.",
  onRetry,
  className
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-red-200 bg-red-50/50 my-4", className)}>
      <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 max-w-md mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="bg-white hover:bg-slate-50 border-slate-300">
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Retry
        </Button>
      )}
    </div>
  )
}
