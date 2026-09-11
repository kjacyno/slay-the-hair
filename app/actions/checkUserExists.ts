'use server'
import { prisma } from '@/lib/prisma/prisma'

export const checkUserExist = async (email: string) => {
  try {
    const userExists = await prisma.user.findUnique({ where: { email }, select: { userId: true } })
    console.log('user exists', userExists)
    return !!userExists
  } catch (err) {
    console.log('DB error', err)
    return false
  }
}
