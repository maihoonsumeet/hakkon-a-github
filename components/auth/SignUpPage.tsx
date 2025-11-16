// src/components/auth/SignUpPage.tsx
import React, { useState } from 'react'
import { supabase } from '../../src/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSignUp(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
      } else {
        // signUp success: Supabase may require email confirmation depending on settings
        setMessage('Sign-up successful. Check your email for a confirmation link (if enabled).')
        // optionally create profile row here (if you want)
        // await supabase.from('profiles').insert({ id: data.user?.id, display_name: '' })
        // redirect after a short pause
        setTimeout(() => navigate('/'), 900)
      }
    } catch (err: any) {
      setMessage(err.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Sign up</h2>
      <form onSubmit={handleSignUp} className="space-y-3">
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          required
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          className="w-full p-2 border rounded"
        />
        <div className="flex items-center gap-2">
          <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </div>
        {message && <div className="mt-2 text-sm">{message}</div>}
      </form>
    </div>
  )
}
