'use client'

import { Loader2, Lock, Mail, Phone, ShieldCheck, Sparkles, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ComponentPropsWithoutRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { signUpApiSchema, SignUpFormValues, signUpSchema } from '@/lib/validations/auth'
import { checkUserExist } from '@/app/actions/checkUserExists'

export const SignUpForm = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => {
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (apiError) {
      console.log('apiError', apiError)
      router.push(`/auth/error?error=${encodeURIComponent(apiError)}`)
    }
  }, [apiError, router])

  const {
    register,
    handleSubmit,
    setError,
    trigger,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const handleSignUp = async (data: SignUpFormValues) => {
    setIsLoading(true)
    setApiError(null)

    const userExists = await checkUserExist(data.email)

    if (userExists) {
      setError('email', {
        type: 'validate',
        message: 'An account with this email already exists.',
      })
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    const profile = signUpApiSchema.parse(data)

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
        emailRedirectTo: `dashboard`,
      },
    })

    if (error) {
      setApiError(error.message)
      return
    }
    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: signUpData.user?.id,
          ...profile,
        }),
      })
      if (!response.ok) {
        const result = (await response.json()) as { error?: string }
        setApiError(result.error ?? 'Could not create account profile')
        return
      }
      router.push(`/auth/sign-up-success`)
    } catch (err) {
      setApiError(`A network error occurred: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='border-primary/20 shadow-2xl backdrop-blur-md bg-card/95'>
        <CardHeader className='space-y-1 text-center pb-6'>
          <CardTitle className='text-3xl font-black tracking-tight uppercase bg-gradient-to-r from-primary via-rose-500 to-amber-500 bg-clip-text text-transparent'>
            Join The Main Character Club
          </CardTitle>
          <CardDescription className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
            Create a new diva account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSignUp)} className='space-y-5'>
            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <Field className='space-y-1.5'>
                  <FieldLabel
                    htmlFor='first-name'
                    className='text-xs font-bold uppercase tracking-wider text-muted-foreground'
                  >
                    First Name
                  </FieldLabel>
                  <div className='relative'>
                    <Input
                      id='first-name'
                      type='text'
                      placeholder='Ziggy'
                      autoComplete='given-name'
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? 'first-name-error' : undefined}
                      className='pl-9 focus-visible:ring-primary'
                      {...register('firstName', { required: true })}
                    />
                    <User className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60' />
                  </div>
                  {errors.firstName && (
                    <FieldError
                      id='first-name-error'
                      className='text-xs font-semibold text-destructive animate-in fade-in-50'
                    >
                      {errors.firstName.message}
                    </FieldError>
                  )}
                </Field>

                <Field className='space-y-1.5'>
                  <FieldLabel
                    htmlFor='last-name'
                    className='text-xs font-bold uppercase tracking-wider text-muted-foreground'
                  >
                    Last Name
                  </FieldLabel>
                  <div className='relative'>
                    <Input
                      id='last-name'
                      type='text'
                      placeholder='Stardust'
                      autoComplete='family-name'
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? 'last-name-error' : undefined}
                      className='pl-9 focus-visible:ring-primary'
                      {...register('lastName', { required: true })}
                    />
                    <User className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60' />
                  </div>
                  {errors.lastName && (
                    <FieldError
                      id='last-name-error'
                      className='text-xs font-semibold text-destructive animate-in fade-in-50'
                    >
                      {errors.lastName.message}
                    </FieldError>
                  )}
                </Field>
              </div>

              <Field className='space-y-1.5'>
                <FieldLabel
                  htmlFor='phone'
                  className='text-xs font-bold uppercase tracking-wider text-muted-foreground'
                >
                  Phone Number
                </FieldLabel>
                <div className='relative'>
                  <Input
                    id='phone'
                    type='tel'
                    autoComplete='tel'
                    placeholder='+48 XXX XXX XXX'
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className='pl-9 focus-visible:ring-primary'
                    {...register('phone', {
                      required: true,
                      onChange: () => void trigger('phone'),
                    })}
                  />
                  <Phone className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60' />
                </div>
                {errors.phone && (
                  <FieldError
                    id='phone-error'
                    className='text-xs font-semibold text-destructive animate-in fade-in-50'
                  >
                    {errors.phone.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor='email'
                  className='text-xs font-bold uppercase tracking-wider text-muted-foreground'
                >
                  Email Address
                </FieldLabel>
                <div className='relative'>
                  <Input
                    id='email'
                    type='email'
                    autoComplete='email'
                    placeholder='slay@example.com'
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className='pl-9 focus-visible:ring-primary'
                    {...register('email', {
                      required: true,
                      onChange: () => void trigger('email'),
                    })}
                  />
                  <Mail className='absolute left-3 top-2.5 h-4 w-4 text-muted--foreground/60' />
                </div>
                {errors.email && (
                  <FieldError
                    id='email-error'
                    className='text-xs font-semibold text-destructive animate-in fade-in-50'
                  >
                    {errors.email.message}
                  </FieldError>
                )}
              </Field>

              <Field className='space-y-1.5'>
                <FieldLabel
                  htmlFor='password'
                  className='text-xs font-bold uppercase tracking-wider text-muted-foreground'
                >
                  Password
                </FieldLabel>
                <div className='relative'>
                  <Input
                    id='password'
                    type='password'
                    autoComplete='new-password'
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    className='pl-9 focus-visible:ring-primary'
                    {...register('password', { required: true, minLength: 6 })}
                  />
                  <Lock className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60' />
                </div>
                {errors.password && (
                  <FieldError
                    id='password-error'
                    className='text-xs font-semibold text-destructive animate-in fade-in-50'
                  >
                    {errors.password.message}
                  </FieldError>
                )}
              </Field>

              <Field className='space-y-1.5'>
                <FieldLabel
                  htmlFor='repeat-password'
                  className='text-xs font-bold uppercase tracking-wider text-muted-foreground'
                >
                  Confirm Password
                </FieldLabel>
                <div className='relative'>
                  <Input
                    id='repeat-password'
                    type='password'
                    aria-invalid={!!errors.repeatPassword}
                    aria-describedby={errors.repeatPassword ? 'repeat-password-error' : undefined}
                    className='pl-9 focus-visible:ring-primary'
                    {...register('repeatPassword', { required: true })}
                  />
                  <ShieldCheck className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60' />
                </div>
                {errors.repeatPassword && (
                  <FieldError
                    id='repeat-password-error'
                    className='text-xs font-semibold text-destructive animate-in fade-in-50'
                  >
                    {errors.repeatPassword.message}
                  </FieldError>
                )}
              </Field>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full mt-2 font-bold uppercase tracking-wider cursor-pointer shadow-lg hover:shadow-primary/25'
              >
                {isLoading ? (
                  <span className='inline-flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Preparing The Crown...
                  </span>
                ) : (
                  <span className='inline-flex items-center gap-2'>
                    <Sparkles className='h-4 w-4' />
                    Claim My Chair
                    <Sparkles className='h-4 w-4' />
                  </span>
                )}
              </Button>
            </div>

            <div className='text-center text-xs font-medium text-muted-foreground pt-2'>
              Already part of the inner circle?{' '}
              <Link
                href='/auth/login'
                className='font-bold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors'
              >
                Log in & Slay
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
