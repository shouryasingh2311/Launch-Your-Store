import React from 'react'
import { Link } from 'react-router-dom'
import { Store, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="h-16 w-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/20">
          <Store className="h-8 w-8" />
        </div>
        <div>
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
            404 Error
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Page Not Found</h1>
          <p className="text-xs text-slate-400 mt-2">
            The storefront link or admin route you are looking for does not exist or has moved.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Home
            </Button>
          </Link>
          <Link to="/onboarding">
            <Button variant="primary" size="sm">
              Create New Store
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
