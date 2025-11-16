// src/components/auth/LoginPage.tsx
import React, { useState } from 'react'
import { supabase } from '../../src/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSignIn(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Signed in!')
        // supabase stores session automatically in localStorage
        setTimeout(() => navigate('/'), 300)
      }
    } catch (err: any) {
      setMessage(err.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink() {
    // optional: send magic link instead of password
    if (!email) {
      setMessage('Enter your email to receive a magic link.')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage(error.message)
    else setMessage('Magic link sent — check your email.')
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Sign in</h2>
      <form onSubmit={handleSignIn} className="space-y-3">
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="flex items-center gap-2">
          <button disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <button type="button" onClick={handleMagicLink} disabled={loading} className="px-3 py-2 border rounded">
            Send magic link
          </button>
        </div>
        {message && <div className="mt-2 text-sm">{message}</div>}
      </form>
    </div>
  )
}
