'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { getInitials } from '@/lib/format'

type CampusUser = {
  name: string
  email: string
  role?: string | null
}

type AppShellProps = {
  user: CampusUser
  children: React.ReactNode
}

const studentNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/catalog', label: 'Katalog barang', icon: Boxes },
  { href: '/history', label: 'Riwayat pinjam', icon: ClipboardList },
]

function SidebarContents({ user, onNavigate }: { user: CampusUser; onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const nav = (user.role ?? 'student') === 'admin'
    ? [...studentNav, { href: '/admin', label: 'Dashboard admin', icon: ShieldCheck }]
    : studentNav

  const signOut = async () => {
    await authClient.signOut()
    router.replace('/login')
    router.refresh()
  }

  return (
    <div className="flex h-full flex-col">
      <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-3 px-6 py-6">
        <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
          <Boxes aria-hidden="true" className="size-5" />
        </span>
        <span className="leading-tight">
          <span className="block text-[17px] font-bold tracking-tight text-slate-900">CampusBorrow</span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Portal perlengkapan</span>
        </span>
      </Link>

      <div className="px-4 pt-3">
        <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Menu utama</p>
        <nav aria-label="Navigasi utama" className="flex flex-col gap-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`) || (href === '/catalog' && pathname === '/borrow')

            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Icon aria-hidden="true" className="size-[18px]" />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="mb-3 rounded-2xl bg-blue-50/80 p-4">
          <p className="text-sm font-semibold text-slate-900">Perlu alat untuk kuliah?</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Cari perlengkapan kampus dan ajukan peminjaman dengan mudah.</p>
          <Link href="/catalog" onClick={onNavigate} className="mt-3 inline-flex items-center text-xs font-semibold text-blue-700 hover:text-blue-800">
            Jelajahi katalog <span aria-hidden="true" className="ml-1">→</span>
          </Link>
        </div>
        <div className="flex items-center gap-3 border-t border-slate-100 px-2 pt-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700" aria-hidden="true">
            {getInitials(user.name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-slate-800">{user.name}</span>
            <span className="block truncate text-xs text-slate-500">{(user.role ?? 'student') === 'admin' ? 'Administrator' : 'Mahasiswa'}</span>
          </span>
          <button
            type="button"
            onClick={signOut}
            aria-label="Keluar dari akun"
            title="Keluar"
            className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <LogOut aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function AppShell({ user, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-slate-200 bg-white lg:flex">
        <SidebarContents user={user} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigasi utama">
          <button type="button" className="absolute inset-0 size-full cursor-default bg-slate-950/30" onClick={() => setMobileOpen(false)} aria-label="Tutup menu" />
          <aside className="absolute inset-y-0 left-0 w-[min(84vw,300px)] bg-white shadow-2xl">
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Tutup navigasi" className="absolute right-3 top-5 z-10 flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden">
              <X aria-hidden="true" className="size-5" />
            </button>
            <SidebarContents user={user} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="min-h-screen lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} aria-label="Buka navigasi" aria-expanded={mobileOpen} className="flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden">
              <Menu aria-hidden="true" className="size-5" />
            </button>
            <div className="lg:hidden">
              <span className="block text-sm font-bold tracking-tight text-slate-900">CampusBorrow</span>
              <span className="text-[10px] text-slate-500">Portal perlengkapan</span>
            </div>
            <p className="hidden text-sm text-slate-500 lg:block">Portal peminjaman perlengkapan kampus</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/catalog" aria-label="Cari barang di katalog" className="flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
              <Search aria-hidden="true" className="size-[18px]" />
            </Link>
            <span className="hidden h-8 w-px bg-slate-200 sm:block" />
            <div className="hidden items-center gap-2.5 sm:flex">
              <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700" aria-hidden="true">{getInitials(user.name)}</span>
              <span className="max-w-36 truncate text-sm font-semibold text-slate-700">{user.name}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
          {children}
        </main>
      </div>
    </div>
  )
}
