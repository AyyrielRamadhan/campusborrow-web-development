'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

type AuthFormProps = {
  mode: 'login' | 'register'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const isRegister = mode === 'register'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim().toLowerCase()
    const password = String(formData.get('password') ?? '')

    try {
      const result = isRegister
        ? await authClient.signUp.email({
            name: String(formData.get('name') ?? '').trim(),
            email,
            password,
          })
        : await authClient.signIn.email({ email, password })

      if (result.error) {
        setError(isRegister ? 'Akun belum dapat dibuat. Periksa data dan coba lagi.' : 'Email atau kata sandi tidak sesuai. Periksa kembali lalu coba lagi.')
        return
      }

      router.replace('/dashboard')
      router.refresh()
    } catch {
      setError('Terjadi kendala. Silakan coba lagi beberapa saat.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {isRegister && (
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">Nama lengkap</label>
          <input id="name" name="name" type="text" autoComplete="name" required maxLength={80} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="Nama mahasiswa" />
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email kampus</label>
        <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="nama@kampus.ac.id" />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">Kata sandi</label>
          {!isRegister && <span className="text-xs text-slate-400">Minimal 8 karakter</span>}
        </div>
        <input id="password" name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={8} maxLength={128} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="Masukkan kata sandi" />
      </div>
      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      <button type="submit" disabled={pending} className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/15 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70">
        {pending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
        {isRegister ? 'Buat akun mahasiswa' : 'Masuk ke akun'}
        {!pending && <ArrowRight aria-hidden="true" className="size-4" />}
      </button>
      <p className="text-center text-sm text-slate-500">
        {isRegister ? 'Sudah punya akun?' : 'Belum memiliki akun?'}{' '}
        <Link href={isRegister ? '/login' : '/register'} className="font-semibold text-blue-700 hover:text-blue-800">
          {isRegister ? 'Masuk' : 'Daftar mahasiswa'}
        </Link>
      </p>
      {isRegister && <p className="text-center text-xs leading-5 text-slate-400">Setiap pendaftaran baru menggunakan akses mahasiswa. Akses admin hanya diberikan melalui konfigurasi server.</p>}
    </form>
  )
}
