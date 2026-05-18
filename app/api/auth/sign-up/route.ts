import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma/prisma'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  
  const { email, password, firstName, lastName, phone } = body;
  
  const supabase = await createClient()
  const origin = request.headers.get('origin') ?? new URL(request.url).origin
  // const existingUser = await prisma.user.findUnique({
  //   where: { email },
  //   select: { id: true },
  // });
  //
  // if (existingUser) {
  //   return NextResponse.json(
  //     { error: "An account with this email already exists." },
  //     { status: 409 }
  //   );
  // }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/protected`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (!data.user) {
    return NextResponse.json(
      { error: 'Could not create the account, please try again.' },
      { status: 500 },
    )
  }

  try {
    await prisma.user.create({
      data: {
        id: data.user.id,
        email,
        firstName,
        lastName,
        phone,
        role: 'CLIENT',
        isApproved: false,
      },
    })
  } catch {
    await supabase.auth.signOut()

    return NextResponse.json(
      { error: "Could not create the user profile." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
