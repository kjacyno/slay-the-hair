import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, CheckCircle, Clock, PlusCircle, Sparkles, User, UserCog } from 'lucide-react'
import { prisma } from '@/lib/prisma/prisma'
import { LogoutButton } from '@/components/logout-button'

const upcomingAppointments = [
  {
    id: 1,
    service: 'Full Platinum Slay & Silk Press',
    stylist: 'House of Roxxy',
    date: 'Oct 24, 2026',
    time: '2:00 PM',
    status: 'Confirmed',
  },
  {
    id: 2,
    service: 'Structural Trim & Blowout',
    stylist: 'Matteo',
    date: 'Nov 12, 2026',
    time: '11:30 AM',
    status: 'Pending Approval',
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  // await supabase.auth.refreshSession()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect('/auth/login')
  }
  const userName = (
    await prisma.user.findUnique({
      where: { email: data.claims.email },
      select: {
        firstName: true,
      },
    })
  )?.firstName
  return (
    <main className='flex min-h-screen flex-col bg-zinc-950 text-zinc-50 relative overflow-hidden'>
      <div className='absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none' />
      <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none' />

      <section className='mx-auto w-full max-w-6xl flex-1 px-6 py-12 md:px-10 relative z-10 space-y-12'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/60 pb-8'>
          <div>
            <p className='text-xs font-black uppercase tracking-[0.2em] text-fuchsia-400 mb-1 flex items-center gap-1.5'>
              <Sparkles className='w-3 h-3 animate-pulse' /> Welcome Back, {userName} The Queen.
            </p>
            <h1 className='text-3xl font-black tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent md:text-4xl'>
              Your Glam Command Center
            </h1>
          </div>
          {/*here the profile pic with click to settings & logout*/}
          <LogoutButton />
          {/*book glow up*/}
        </div>

        <div className='grid gap-8 lg:grid-cols-3 items-start'>
          <div className='lg:col-span-2 space-y-6'>
            <h2 className='text-xl font-bold tracking-tight text-zinc-200 flex items-center gap-2'>
              <Calendar className='w-5 h-5 text-violet-400' /> Your Upcoming Slays
            </h2>

            <div className='space-y-4'>
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className='p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-zinc-700'
                >
                  <div className='space-y-1.5'>
                    <div className='flex items-center gap-3.5'>
                      <span className='text-lg font-bold text-white'>{apt.service}</span>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                          apt.status === 'Confirmed'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <p className='text-sm text-zinc-400'>
                      with <span className='text-zinc-200 font-medium'>{apt.stylist}</span>
                    </p>
                    <div className='flex items-center gap-4 text-xs text-zinc-500 pt-1'>
                      <span className='flex items-center gap-1'>
                        <Calendar className='w-3.5 h-3.5' /> {apt.date}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Clock className='w-3.5 h-3.5' /> {apt.time}
                      </span>
                    </div>
                  </div>

                  {apt.status !== 'Confirmed' && (
                    <Button
                      size='sm'
                      variant='outline'
                      className='border-fuchsia-500/30 text-fuchsia-400 hover:bg-fuchsia-500/10 hover:text-fuchsia-300 rounded-full font-semibold transition-all shrink-0'
                    >
                      <CheckCircle className='w-4 h-4 mr-1.5' /> Confirm Attendance
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className='space-y-6'>
            <h2 className='text-xl font-bold tracking-tight text-zinc-200 flex items-center gap-2'>
              <User className='w-5 h-5 text-fuchsia-400' /> VIP Profile
            </h2>
            <div className='flex lg:flex-col space-y-6 space-x-6'>
              <Button
                asChild
                size='lg'
                className='w-64 bg-linear-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 text-white font-bold tracking-wide rounded-full shadow-lg shadow-fuchsia-500/10 transition-all hover:scale-105'
              >
                <Link href='/book' className='flex items-center gap-2'>
                  <PlusCircle className='w-5 h-5' />
                  Book a New Glow-Up
                </Link>
              </Button>
              {/*<div className='p-6 rounded-xl bg-linear-to-b from-zinc-900/60 to-zinc-900/20 border border-zinc-800/80 backdrop-blur-md space-y-6'>*/}
              <Button
                asChild
                size='lg'
                className='w-64 bg-linear-to-r from-violet-500 to-zinc-900/80 border border-zinc-800/80 backdrop-blur-md /*hover:from-fuchsia-600 hover:to-violet-700*/ text-white font-bold tracking-wide rounded-full shadow-lg shadow-fuchsia-500/10 transition-all hover:scale-105'
              >
                <Link href='/user-profile' className='flex items-center gap-2'>
                  <UserCog className='w-5 h-5' />
                  Reinvent your settings
                </Link>
              </Button>
            </div>
            {/*    <div className='space-y-4'>*/}
            {/*      <div className='space-y-1'>*/}
            {/*        <label className='text-xs font-bold uppercase tracking-wider text-zinc-500'>Full Name</label>*/}
            {/*        <input*/}
            {/*          type='text'*/}
            {/*          defaultValue='Katarzyna Slayowska'*/}
            {/*          className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-fuchsia-500/50 transition-all'*/}
            {/*        />*/}
            {/*      </div>*/}
            {/*      */}
            {/*      <div className='space-y-1'>*/}
            {/*        <label className='text-xs font-bold uppercase tracking-wider text-zinc-500'>Phone Number</label>*/}
            {/*        <input*/}
            {/*          type='tel'*/}
            {/*          defaultValue='+48 555 123 456'*/}
            {/*          className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-fuchsia-500/50 transition-all'*/}
            {/*        />*/}
            {/*      </div>*/}
            {/*      */}
            {/*      <div className='space-y-1'>*/}
            {/*        <label className='text-xs font-bold uppercase tracking-wider text-zinc-500'>Email Address</label>*/}
            {/*        <input*/}
            {/*          type='email'*/}
            {/*          defaultValue='queen@slaythehair.pl'*/}
            {/*          className='w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-400 cursor-not-allowed opacity-70'*/}
            {/*          disabled*/}
            {/*        />*/}
            {/*        <span className='text-[10px] text-zinc-600 block pl-1'>Email locked to auth account</span>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*    */}
            {/*    <Button*/}
            {/*      className='w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-full py-2 text-sm transition-all'*/}
            {/*    >*/}
            {/*      Update My Details*/}
            {/*    </Button>*/}
            {/*  </div>*/}
          </div>
        </div>
      </section>
    </main>
  )
}
