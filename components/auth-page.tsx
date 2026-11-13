import Image from 'next/image'
import Link from 'next/link'
import { Boxes, CircleCheck, ShieldCheck } from 'lucide-react'
import { AuthForm } from '@/components/auth-form'

type AuthPageProps = {
  mode: 'login' | 'register'
}

export function AuthPage({ mode }: AuthPageProps) {
  const isRegister = mode === 'register'

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.02fr_0.98fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#123a78] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div aria-hidden="true" className="absolute -right-24 -top-24 size-96 rounded-full border border-white/10" />
        <div aria-hidden="true" className="absolute -bottom-44 -left-36 size-[480px] rounded-full border border-white/10" />
        <Link href="/login" className="relative z-10 flex w-fit items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <Boxes aria-hidden="true" className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">CampusBorrow</span>
        </Link>

        <div className="relative z-10 max-w-xl py-12">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100">
            <CircleCheck aria-hidden="true" className="size-3.5" />
            Satu tempat untuk kebutuhan kampus
          </p>
          <h1 className="max-w-lg text-4xl font-semibold leading-[1.12] tracking-tight xl:text-5xl">
            Perlengkapan kampus, lebih mudah dijangkau.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-blue-100/80">
            Temukan barang yang kamu butuhkan, ajukan peminjaman, dan pantau statusnya tanpa proses yang berbelit.
          </p>

          <div className="mt-10 flex max-w-md items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.08] p-3.5">
            <div className="relative size-[72px] shrink-0 overflow-hidden rounded-xl bg-white/10">
              <Image src="/items/camera.png" alt="Kamera mirrorless untuk kegiatan kampus" fill priority sizes="72px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-blue-100/75">Koleksi pilihan</p>
              <p className="mt-1 truncate text-sm font-semibold">Peralatan siap dipinjam</p>
              <p className="mt-1 text-xs text-blue-100/70">Untuk belajar, berkarya, dan berorganisasi</p>
            </div>
            <ShieldCheck aria-hidden="true" className="mr-1 size-5 shrink-0 text-blue-200" />
          </div>
        </div>

        <p className="relative z-10 text-xs text-blue-100/60">CampusBorrow · Layanan peminjaman perlengkapan kampus</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-[420px]">
          <Link href="/login" className="mb-12 inline-flex items-center gap-2.5 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Boxes aria-hidden="true" className="size-5" />
            </span>
            <span className="text-base font-bold tracking-tight text-slate-900">CampusBorrow</span>
          </Link>
          <p className="text-sm font-semibold text-blue-700">{isRegister ? 'Mulai gunakan CampusBorrow' : 'Selamat datang kembali'}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{isRegister ? 'Buat akun mahasiswa' : 'Masuk ke akunmu'}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {isRegister ? 'Daftar dengan email kampus untuk mulai meminjam perlengkapan.' : 'Masuk untuk melihat katalog dan mengelola peminjamanmu.'}
          </p>
          <div className="mt-8">
            <AuthForm mode={mode} />
          </div>
          <p className="mt-8 text-center text-xs leading-5 text-slate-400">Dengan melanjutkan, kamu menyetujui kebijakan penggunaan fasilitas kampus.</p>
        </div>
      </section>
    </main>
  )
}
