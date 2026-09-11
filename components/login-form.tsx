'use client'

import { useRouter } from 'next/navigation'
import { ComponentPropsWithoutRef, SyntheticEvent, useState } from 'react'
import { Loader2, Lock, Mail } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { checkUserExist } from '@/app/actions/checkUserExists'

export function LoginForm({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    const { error: AuthError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (AuthError) {
      if (AuthError?.message !== 'Invalid login credentials') {
        router.push(`/auth/error?error=${encodeURIComponent(AuthError.message)}`)
        return
      }
      const userExists = await checkUserExist(email)
      console.log('userExists', userExists)
      if (!userExists) {
        setError("You aren't registered yet, babe! Click below to sign up.")
      } else {
        setError('Wrong credentials, queen! Clock your input or reset your password.')
      }
      setIsLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='border-primary/20 shadow-2xl backdrop-blur-md bg-card/95'>
        <CardHeader>
          <CardTitle className='text-center text-3xl font-black tracking-tight uppercase bg-gradient-to-r from-primary via-rose-500 to-amber-500 bg-clip-text text-transparent'>
            Welcome Back, Gorgeous
          </CardTitle>
          <CardDescription className='text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
            Serve your credentials below to enter the salon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className='space-y-5'>
            <div className='flex flex-col gap-4'>
              <div className='grid gap-1.5'>
                <Label
                  htmlFor='email'
                  className='text-xs font-bold uppercase tracking-wider text-muted-foreground'
                >
                  Email Address
                </Label>
                <div className='relative'>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    placeholder='slay@example.com'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='pl-9 focus-visible:ring-primary'
                  />
                  <Mail className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60' />
                </div>
              </div>
              <div className='grid gap-1.5'>
                <div className='flex items-center justify-between'>
                  <Label
                    htmlFor='password'
                    className='text-xs font-bold uppercase tracking-wider text-muted-foreground'
                  >
                    Password
                  </Label>
                  <Link
                    href='/auth/forgot-password'
                    className='text-xs font-semibold text-primary underline-offset-4 hover:underline'
                  >
                    Forgot key?
                  </Link>
                </div>
                <div className='relative'>
                  <Input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='pl-9 focus-visible:ring-primary'
                  />
                  <Lock className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60' />
                </div>
              </div>
              {error && (
                <div className='rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-center text-xs font-semibold text-destructive animate-in fade-in-50 slide-in-from-top-1'>
                  {error}
                </div>
              )}
              <Button
                type='submit'
                disabled={isLoading}
                className='w-full mt-2 font-bold uppercase tracking-wider cursor-pointer shadow-lg hover:shadow-primary/25 transition-all active:scale-[0.98]'
              >
                {isLoading ? (
                  <span className='inline-flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Serving Access...
                  </span>
                ) : (
                  <span className='inline-flex items-center gap-2'>Let&apos;s werk!</span>
                )}
              </Button>
            </div>

            <div className='text-center text-xs font-medium text-muted-foreground pt-2'>
              Don&apos;t have an account yet?{' '}
              <Link
                href='/auth/sign-up'
                className='font-bold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors'
              >
                Sign up & Slay
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
