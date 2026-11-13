import { redirect } from 'next/navigation'
import { AuthPage } from '@/components/auth-page'
import { getCurrentSession } from '@/lib/auth-helpers'

export default async function LoginPage() {
  const session = await getCurrentSession()
  if (session?.user) redirect('/dashboard')

  return <AuthPage mode="login" />
}
