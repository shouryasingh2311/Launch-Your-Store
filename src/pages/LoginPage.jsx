import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/useAuthStore'
import { useToast } from '../components/ui/Toast'
import { ArrowRight, ShieldCheck, Store, Globe, UserCheck } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const toast = useToast()

  const searchParams = new URLSearchParams(location.search)
  const redirectTarget = searchParams.get('redirect')

  // Two portal options: 'merchant' (User portal) vs 'owner' (Platform owner admin)
  const [portalType, setPortalType] = useState('merchant')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await login(identifier, password)
      
      if (portalType === 'owner') {
        toast.success('Platform Owner Sign In', 'Welcome to the StoreKraft Platform Management Suite')
        navigate(redirectTarget || '/owner/dashboard')
      } else {
        toast.success('Merchant Sign In', `Welcome back, ${res.user?.name || 'Store Merchant'}`)
        navigate(redirectTarget || '/admin/dashboard')
      }
    } catch (err) {
      toast.error('Sign In Failed', err.message || 'Invalid username or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--sc-champagne)' }}>
      <div className="clay-card max-w-md w-full p-8 space-y-6">

        {/* Logo + wordmark */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <div className="h-12 w-12 bg-brand rounded-2xl flex items-center justify-center mx-auto text-champagne font-black text-base shadow-clay-btn">
              SK
            </div>
          </Link>
          <div>
            <h1 className="font-poppins font-bold text-2xl text-brand">StoreKraft Sign In</h1>
            <p className="text-xs text-[var(--sc-muted)] mt-1">Select your access portal to proceed</p>
          </div>
        </div>

        {/* 2 Portal Options: Platform Owner vs Store Merchant (User Portal) */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-brand/5 border border-champagne-border">
          <button
            type="button"
            onClick={() => setPortalType('merchant')}
            className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              portalType === 'merchant'
                ? 'bg-brand text-champagne shadow-clay-btn'
                : 'text-[var(--sc-muted)] hover:text-brand hover:bg-white/50'
            }`}
          >
            <Store className="h-4 w-4 mb-1" />
            <span>Store Merchant</span>
            <span className={`text-[10px] font-normal opacity-80 ${portalType === 'merchant' ? 'text-champagne' : 'text-[var(--sc-muted)]'}`}>
              User Portal
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPortalType('owner')}
            className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              portalType === 'owner'
                ? 'bg-brand text-champagne shadow-clay-btn'
                : 'text-[var(--sc-muted)] hover:text-brand hover:bg-white/50'
            }`}
          >
            <Globe className="h-4 w-4 mb-1" />
            <span>Platform Owner</span>
            <span className={`text-[10px] font-normal opacity-80 ${portalType === 'owner' ? 'text-champagne' : 'text-[var(--sc-muted)]'}`}>
              Website Analytics
            </span>
          </button>
        </div>

        {portalType === 'owner' ? (
          <div className="p-3 rounded-xl bg-champagne-surface border border-champagne-border text-[11px] text-[var(--sc-muted)] leading-relaxed">
            <strong className="text-brand font-semibold block mb-0.5">Platform Owner Portal</strong>
            Inspect platform-wide statistics, live stores created, niche distribution pie charts, and merchant business details.
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-champagne-surface border border-champagne-border text-[11px] text-[var(--sc-muted)] leading-relaxed">
            <strong className="text-brand font-semibold block mb-0.5">Store Merchant (User Portal)</strong>
            Manage your store orders, live product catalogue, pricing, and daily revenue metrics.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username or Email"
            type="text"
            required
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="Enter your username or email"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <Button type="submit" isLoading={isLoading} className="w-full font-bold">
            {portalType === 'owner' ? 'Sign In as Platform Owner' : 'Sign In to Store Portal'} <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </form>

        <div className="text-center text-xs text-[var(--sc-muted)] border-t border-champagne-border pt-4 space-y-1">
          <p>
            Need a new store account?{' '}
            <Link to="/onboarding" className="font-semibold text-brand hover:underline">
              Create a store
            </Link>
          </p>
          <p>
            <Link to="/" className="text-[11px] text-[var(--sc-muted)] hover:text-brand transition-colors">
              Return to StoreKraft home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
