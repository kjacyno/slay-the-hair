'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Sparkles } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const router = useRouter()
  const [isServingExit, setIsServingExit] = useState(false)

  const logout = async () => {
    try {
      setIsServingExit(true)
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/auth/login')
      router.refresh()
    } catch (error) {
      console.error('Failed to make an exit:', error)
      setIsServingExit(false)
    }
  }

  return (
    <Button
      onClick={logout}
      disabled={isServingExit}
      variant='ghost'
      className='group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-destructive/30 bg-destructive/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-destructive transition-all duration-300 hover:border-destructive hover:bg-destructive hover:text-destructive-foreground hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95 disabled:pointer-events-none disabled:opacity-60 cursor-pointer'
    >
      <span className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full' />

      {isServingExit ? (
        <>
          <Sparkles className='h-4 w-4 animate-spin text-current' />
          <span>Making an Entrance Elsewhere...</span>
        </>
      ) : (
        <>
          <LogOut className='h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1' />
          <span>Sashay away</span>
        </>
      )}
    </Button>
  )
}
