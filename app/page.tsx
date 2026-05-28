import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className='flex min-h-svh flex-col bg-zinc-950 text-zinc-50 overflow-hidden relative'>
      <div className='absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none' />
      <div className='absolute bottom-0 right-1/4 translate-x-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none' />
      
      <section className='mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-12 px-6 py-20 md:px-10 relative z-10'>
        
        <div className='max-w-3xl space-y-6'>
          <p className='text-xs font-black uppercase tracking-[0.3em] bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent'>
            ✨ The Ultimate Hair Serve ✨
          </p>
          
          <h1 className='text-5xl font-black tracking-tight text-balance md:text-7xl leading-none bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent'>
            Claim your crown. No phone calls. <br className='hidden md:block'/>No gatekeeping.
          </h1>
          
          <p className='max-w-xl text-lg leading-relaxed text-zinc-400 md:text-xl font-light'>
            Honey, the queue is exclusive. Create your profile to access some real V.I.P. treatment. Once the administration verifies your immaculate energy, you&#39;re free to book the baddest stylists in the game.
          </p>
        </div>
        
        <div className='flex flex-col gap-4 sm:flex-row pt-4'>
          <Button
            asChild
            size='lg'
            className='w-full sm:w-auto bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 text-white font-bold tracking-wide shadow-lg shadow-fuchsia-500/20 transition-all duration-300 hover:scale-105 rounded-full px-8'
          >
            <Link href='/auth/sign-up'>Sign up, no shade</Link>
          </Button>
          
          <Button
            asChild
            variant='outline'
            size='lg'
            className='w-full sm:w-auto border-zinc-700 hover:bg-zinc-900/50 hover:text-fuchsia-400 font-medium tracking-wide transition-all rounded-full px-8 backdrop-blur-sm'
          >
            <Link href='/auth/login'>Already an Icon? Log In</Link>
          </Button>
        </div>
        
        <div className='grid gap-6 border-t border-zinc-800/80 pt-10 text-sm md:grid-cols-3'>
          <div className='p-4 rounded-2xl bg-zinc-900/30 border border-zinc-900 backdrop-blur-sm'>
            <p className='font-semibold text-fuchsia-400 mb-1'>The Velvet Rope</p>
            <p className='text-zinc-400 leading-snug'>We filter the vibes. Clients wait for admin approval before they can touch the calendar.</p>
          </div>
          
          <div className='p-4 rounded-2xl bg-zinc-900/30 border border-zinc-900 backdrop-blur-sm'>
            <p className='font-semibold text-violet-400 mb-1'>Quick Slay or Full Transformation</p>
            <p className='text-zinc-400 leading-snug'>Whether it’s a standard trim or a 10-hour structural masterpiece, we accommodate the vision.</p>
          </div>
          
          <div className='p-4 rounded-2xl bg-zinc-900/30 border border-zinc-900 backdrop-blur-sm'>
            <p className='font-semibold text-zinc-200 mb-1'>Zero Double-Booking Drama</p>
            <p className='text-zinc-400 leading-snug'>Our master schedules are locked, loaded, and real-time. No overlaps, no excuses.</p>
          </div>
        </div>
      
      </section>
    </main>
  )
}