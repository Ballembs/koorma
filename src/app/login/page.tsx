'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { useKoormaStore } from '@/lib/store'

function LoginContent() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [childName, setChildName] = useState('')
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const updateProfile = useKoormaStore(state => state.updateProfile)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      if (isSignUp) {
        if (!childName.trim()) {
          throw new Error('Please enter a name for the child!')
        }

        // 1. Sign up the user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signUpError) throw signUpError

        if (!authData.user) {
          throw new Error('An unknown error occurred during signup.')
        }

        // 2. We use the trigger in Postgres for creating the profile and progress row natively,
        // but we still want to manually update the name if that's easier, or we can just 
        // upsert it here to be safe if the trigger isn't active yet.
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            child_name: childName,
            telugu_level: 'beginner',
            audio_enabled: true,
            speech_rate: 0.75
          })

        if (profileError) {
          console.warn("Could not upsert profile:", profileError)
        }

        // Just in case, ensure progress exists
        const { error: progressError } = await supabase
          .from('user_progress')
          .upsert({ id: authData.user.id }, { onConflict: 'id' })

        if (progressError) {
          console.warn("Could not upsert progress:", progressError)
        }

        updateProfile({ childName, teluguLevel: 1 })

      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
      }

      router.push('/village')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Warning: You must run the supabase-setup.sql script in your Supabase dashboard!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand text-brown font-comic flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements matching Koorma theme */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-sand/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border-4 border-white">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-orange-600 mb-2">🐢 కూర్మ</h1>
            <p className="text-xl text-brown/70">
              {isSignUp ? "Let's create an account!" : "Welcome back!"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {isSignUp && (
              <div>
                <label className="block text-lg font-bold mb-2">Child's Name</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none text-lg bg-white/50"
                  placeholder="e.g. Rahul"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className="block text-lg font-bold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none text-lg bg-white/50"
                placeholder="parent@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-bold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none text-lg bg-white/50"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-100 text-red-600 rounded-xl text-sm font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-500 text-white rounded-2xl text-xl font-bold shadow-[0_4px_0_rgb(194,65,12)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgb(194,65,12)] transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up & Play!' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              className="text-orange-600 font-bold hover:underline"
            >
              {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sand flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
