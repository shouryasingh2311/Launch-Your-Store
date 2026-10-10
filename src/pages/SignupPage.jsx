import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/useAuthStore'
import { useToast } from '../components/ui/Toast'
import { ArrowRight } from 'lucide-react'

export function SignupPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signup } = useAuthStore()
  const toast = useToast()

  const searchParams = new URLSearchParams(location.search)
  const redirectTarget = searchParams.get('redirect') || '/onboarding'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signup(name, email, password)
      toast.success('Account Created', 'Welcome to StoreKraft. Your account is active.')
      navigate(redirectTarget)
    } catch (err) {
      toast.error('Signup Failed', err.message || 'Could not create account.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--sc-champagne)' }}>
      <div className="clay-card max-w-md w-full p-8 space-y-6">

        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <div className="h-12 w-12 bg-brand rounded-2xl flex items-center justify-center mx-auto text-champagne font-black text-base shadow-clay-btn">
              SK
            </div>
          </Link>
          <div>
            <h1 className="font-poppins font-bold text-2xl text-brand">Create Merchant Account</h1>
            <p className="text-xs text-[var(--sc-muted)] mt-1">Craft your store in minutes — zero code required</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name or Business Name"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Jane Doe or Apex Studio"
          />
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="merchant@example.com"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Choose a secure password"
          />

          <Button type="submit" isLoading={isLoading} className="w-full font-bold">
            Create Account & Launch <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </form>

        <div className="text-center text-xs text-[var(--sc-muted)] border-t border-champagne-border pt-4 space-y-1">
          <p>
            Already registered?{' '}
            <Link to={`/login?redirect=${encodeURIComponent(redirectTarget)}`} className="font-semibold text-brand hover:underline">
              Sign In
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
