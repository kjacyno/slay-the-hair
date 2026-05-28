'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ComponentPropsWithoutRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { SignUpFormValues, signUpApiSchema, signUpSchema } from '../lib/validations/auth'

export const SignUpForm = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => {
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      phone: '+'
    }
  })
  const handleSignUp = async (data: SignUpFormValues) => {
    setIsLoading(true)
    setApiError(null)

    if (data.password !== data.repeatPassword) {
      setApiError('Passwords do not match')
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    const origin = window.location.origin
    const profile = signUpApiSchema.parse(data)
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data:{
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
          emailRedirectTo: `${origin}/dashboard`,
        },
      })

      if (error) throw error
      if (!signUpData.user) {
        throw new Error('Could not create the account, please try again.')
      }

      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: signUpData.user.id,
          ...profile,
        }),
      })

      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        setApiError(result.error ?? 'Could not create account')
      }

      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setApiError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new client account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSignUp)}>
            <div className="flex flex-col gap-6">
              <Field>
                <FieldLabel htmlFor="first-name">First name</FieldLabel>
                <Input
                  id="first-name"
                  type="text"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'first-name-error' : undefined}
                  {...register('firstName', {required: true})}                                />
                {errors.firstName && (
                  <FieldError id="first-name-error">{errors.firstName.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="first-name">First name</FieldLabel>
                <Input
                  id="last-name"
                  type="text"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.firstName ? 'last-name-error' : undefined}
                  {...register('lastName', {required: true})}                                />
                {errors.lastName && (
                  <FieldError id={'last-name-error'}>{errors.lastName.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+12345678901"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.firstName ? 'phone-error' : undefined}
                  {...register('phone', {required: true})}                                />
                {errors.phone && (
                  <FieldError id="phone-error">
                    {errors.phone.message}
                  </FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.firstName ? 'email-error' : undefined}
                  {...register('email', {required: true})}                                />
                {errors.email && (
                  <FieldError id="email-error">
                    {errors.email.message}
                  </FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.firstName ? 'password-error' : undefined}
                  
                  {...register('password', {required: true, minLength: 6})}                                />
                {errors.password && (
                  <FieldError id="password-error">
                    {errors.password.message}
                  </FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="repeat-password">Repeat Password</FieldLabel>
                <Input
                  id="repeat-password"
                  type="password"
                  aria-invalid={!!errors.repeatPassword}
                  {...register('repeatPassword', {required: true})}
                />
                {errors.repeatPassword && (
                  <FieldError id="repeat-password-error">
                    {errors.repeatPassword.message}
                  </FieldError>
                )}
              </Field>
              {apiError && <p className="text-sm text-red-500">{apiError}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating an account...' : 'Sign up'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
