<<<<<<< HEAD
import { supabase } from './supabase'
import { prisma } from './prisma'
import { Role } from '@prisma/client'

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    if (!dbUser) {
      // Create user if doesn't exist
      const newUser = await prisma.user.create({
        data: {
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!.split('@')[0],
        },
      })
      return newUser
    }

    return dbUser
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function signOut() {
  await supabase.auth.signOut()
}

export function isAdmin(user: { role: Role }) {
  return user.role === Role.ADMIN
}

export function isManager(user: { role: Role }) {
  return user.role === Role.MANAGER || user.role === Role.ADMIN
}

export function isTeam(user: { role: Role }) {
  return user.role === Role.TEAM
}
=======
import { supabase } from './supabase'
import { prisma } from './prisma'
import { Role } from '@prisma/client'

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    if (!dbUser) {
      // Create user if doesn't exist
      const newUser = await prisma.user.create({
        data: {
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!.split('@')[0],
        },
      })
      return newUser
    }

    return dbUser
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function signOut() {
  await supabase.auth.signOut()
}

export function isAdmin(user: { role: Role }) {
  return user.role === Role.ADMIN
}

export function isManager(user: { role: Role }) {
  return user.role === Role.MANAGER || user.role === Role.ADMIN
}

export function isTeam(user: { role: Role }) {
  return user.role === Role.TEAM
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
