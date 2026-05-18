// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // next determines where to send the user after confirmation success
  const next = searchParams.get('next') ?? '/protected'
  
  if (code) {
    const supabaseResponse = NextResponse.redirect(`${origin}${next}`)
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            // Correctly fetch and parse cookies out of the incoming request headers
            const cookieStore = new URLSearchParams(request.headers.get('cookie') ?? '')
            const cookies: { name: string; value: string }[] = []
            
            cookieStore.forEach((value, name) => {
              cookies.push({ name, value })
            })
            
            return cookies
          },
          setAll(cookiesToSet) {
            // Write the updated authentication session cookies onto the response object
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )
    
    // Exchange the single-use temporary email token for a permanent session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return supabaseResponse
    }
  }
  
  // If something goes wrong, boot them to an auth error page or login
  return NextResponse.redirect(`${origin}/auth/login?error=auth-callback-failed`)
}