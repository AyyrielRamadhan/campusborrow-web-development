import 'server-only'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function requireUser() {
  const currentSession = await getCurrentSession()

  if (!currentSession?.user) redirect('/login')

  return currentSession.user
}

export async function requireAdmin() {
  const currentUser = await requireUser()

  if (currentUser.role !== 'admin') redirect('/dashboard')

  return currentUser
}
