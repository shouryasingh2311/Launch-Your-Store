import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/useAuthStore'
import { useToast } from '../components/ui/Toast'
import { ArrowRight } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const toast = useToast()

  const [email, setEmail] = useState('owner@launchstore.com')
  const [password, setPassword] = useState('Password123')
  const [role, setRole] = useState('owner')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password, role)
      toast.success('Welcome back!', `Logged in as ${role.toUpperCase()}`)
      navigate('/admin/dashboard')
    } catch {
      toast.error('Login Failed', 'Invalid credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--sc-champagne)' }}>
      <div className="clay-card max-w-md w-full p-8 space-y-7">

        {/* Logo + wordmark */}
        <div className="text-center space-y-3">
          <div className="h-12 w-12 bg-brand rounded-2xl flex items-center justify-center mx-auto text-champagne font-black text-base shadow-clay-btn">
            SC
          </div>
          <div>
            <h1 className="font-poppins font-bold text-2xl text-brand">Merchant Sign In</h1>
            <p className="text-xs text-[var(--sc-muted)] mt-1">Access your store analytics and operations</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {/* Role switcher for demo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--sc-ink)] block uppercase tracking-wide">
              Test Role:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { r: 'owner', label: 'Owner', email: 'owner@launchstore.com' },
                { r: 'staff', label: 'Staff', email: 'staff@launchstore.com' },
              ].map(({ r, label, email: e }) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setEmail(e); setPassword('Password123') }}
                  className={`py-2.5 text-xs font-semibold rounded-xl border-2 transition-all min-h-[44px] ${
                    role === r
                      ? 'border-brand bg-brand text-champagne'
                      : 'border-champagne-border bg-champagne-card text-[var(--sc-muted)] hover:border-brand/40'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full font-bold">
            Sign In <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </form>

        <p className="text-center text-xs text-[var(--sc-muted)] border-t border-champagne-border pt-4">
          New store?{' '}
          <Link to="/onboarding" className="font-semibold text-brand hover:underline">
            Start the wizard
          </Link>
        </p>
      </div>
    </div>
  )
}
