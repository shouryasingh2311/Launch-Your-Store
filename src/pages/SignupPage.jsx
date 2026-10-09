import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuthStore } from '../store/useAuthStore'
import { useToast } from '../components/ui/Toast'
import { ArrowRight } from 'lucide-react'

export function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuthStore()
  const toast = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signup(name, email, password)
      toast.success('Account Created', 'Welcome to Launch-Your-Store!')
      navigate('/onboarding')
    } catch (err) {
      toast.error('Signup Failed', 'Could not create account.')
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
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Merchant Account</h2>
          <p className="text-xs text-slate-400">Launch your ecommerce store in minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-slate-900 border-slate-700 text-white"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-slate-900 border-slate-700 text-white"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 font-bold text-xs"
          >
            Create Store Account <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-800">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  )
}
