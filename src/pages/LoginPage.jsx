import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuthStore } from '../store/useAuthStore'
import { useToast } from '../components/ui/Toast'
import { Shield, ArrowRight } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const toast = useToast()

  const [email, setEmail] = useState('owner@crafthaven.store')
  const [password, setPassword] = useState('password123')
  const [role, setRole] = useState('owner')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password, role)
      toast.success('Welcome back!', `Logged in as ${role.toUpperCase()}`)
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error('Login Failed', 'Invalid credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 bg-slate-950 border-slate-800 text-slate-100 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto text-white font-black text-base">
            LYS
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Merchant Sign In</h2>
          <p className="text-xs text-slate-400">Access your store analytics and operations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-slate-900 border-slate-700 text-white"
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 block uppercase tracking-wide">
              Test Role Login:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole('owner')
                  setEmail('owner@crafthaven.store')
                }}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                  role === 'owner'
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                Owner Mode
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('staff')
                  setEmail('staff@crafthaven.store')
                }}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                  role === 'staff'
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                Staff Mode
              </button>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 font-bold text-xs"
          >
            Sign In to Dashboard <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-800">
          Want to create a new store?{' '}
          <Link to="/onboarding" className="text-indigo-400 hover:underline font-semibold">
            Launch Wizard
          </Link>
        </div>
      </Card>
    </div>
  )
}
