import {NextResponse} from 'next/server'

import {prisma} from '@/lib/prisma/prisma'
import {signUpProfileSchema} from '@/lib/validations/auth'

export const POST = async (request: Request) => {
  const body = await request.json().catch(() => null)
  const parsed = signUpProfileSchema.safeParse(body)
  
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid sign-up data.'}, {status: 400})
  }
  
  const {email, firstName, lastName, phone, userId, passwordHash} = parsed.data
  
  try {
    await prisma.user.upsert({
      where: {userId},
      create: {
        userId,
        email,
        firstName,
        lastName,
        phone,
        role: 'CLIENT',
        isApproved: false,
      },
      update: {
        // email,
        // firstName,
        // lastName,
        // phone,
      },
    })
  } catch {
    return NextResponse.json(
      {error: 'Could not create the user profile.'},
      {status: 500},
    )
  }
  
  return NextResponse.json({ok: true}, {status: 201})
}
