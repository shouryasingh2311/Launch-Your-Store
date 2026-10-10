import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/useAuthStore'
import { useToast } from '../components/ui/Toast'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const toast = useToast()

  const searchParams = new URLSearchParams(location.search)
  const redirectTarget = searchParams.get('redirect') || '/admin/dashboard'

  const [identifier, setIdentifier] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await login(identifier, password)
      toast.success('Welcome back', `Signed in as ${res.user?.role?.toUpperCase() || 'MERCHANT'}`)
      navigate(redirectTarget)
    } catch (err) {
      toast.error('Sign In Failed', err.message || 'Invalid credentials.')
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
            <p className="text-xs text-[var(--sc-muted)] mt-1">Access your store analytics and operations</p>
          </div>
        </div>

        {/* Demo Credentials Hint */}
        <div className="p-3 rounded-xl bg-brand/10 border border-brand/20 text-xs text-brand space-y-1">
          <div className="font-semibold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            Default Admin Credentials:
          </div>
          <div className="font-mono text-[11px] text-[var(--sc-muted)]">
            Username: <strong className="text-brand">admin</strong> &nbsp;|&nbsp; Password: <strong className="text-brand">admin</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username or Email"
            type="text"
            required
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="admin or user@storekraft.com"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="admin"
          />

          <Button type="submit" isLoading={isLoading} className="w-full font-bold">
            Sign In <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </form>

        <div className="text-center text-xs text-[var(--sc-muted)] border-t border-champagne-border pt-4 space-y-1">
          <p>
            Need a merchant account?{' '}
            <Link to={`/signup?redirect=${encodeURIComponent(redirectTarget)}`} className="font-semibold text-brand hover:underline">
              Create account
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
