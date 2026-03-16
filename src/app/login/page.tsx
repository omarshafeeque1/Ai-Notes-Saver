'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Youtube, Sparkles, LogIn, Github } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      alert(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          {/* Subtle light effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full group-hover:bg-purple-500/20 transition-all duration-700" />
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-purple-500/20 ring-1 ring-white/20">
              <Sparkles size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 font-medium">Sign in to sync your notes with AI</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-16 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-gray-200 transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-white/5"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <div className="relative py-4 flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-[10px] uppercase font-black tracking-widest text-gray-600">Secure Access</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <button className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all opacity-50 cursor-not-allowed">
              <Github size={20} />
              Continue with GitHub
            </button>
          </div>

          <p className="mt-10 text-center text-xs text-gray-600 font-medium px-6 leading-relaxed">
            By continuing, you agree to our <span className="text-gray-400 hover:text-white cursor-pointer transition-colors underline underline-offset-4">Terms of Service</span> and <span className="text-gray-400 hover:text-white cursor-pointer transition-colors underline underline-offset-4">Privacy Policy</span>.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
