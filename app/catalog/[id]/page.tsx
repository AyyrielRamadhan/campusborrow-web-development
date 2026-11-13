import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, PackageCheck, ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { db } from '@/lib/db'
import { inventoryItems } from '@/lib/db/schema'
import { requireUser } from '@/lib/auth-helpers'
import { eq } from 'drizzle-orm'

export default async function CatalogItemPage({ params }: { params: Promise<{ id: string }> }) {
  const currentUser = await requireUser()
  const { id } = await params
  const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id)).limit(1)
  if (!item) notFound()

  return (
    <AppShell user={{ name: currentUser.name, email: currentUser.email, role: currentUser.role }}>
      <div className="space-y-6">
        <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"><ArrowLeft aria-hidden="true" className="size-4" /> Kembali ke katalog</Link>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[300px] overflow-hidden rounded-3xl bg-slate-100 sm:min-h-[440px]">
            <Image src={item.imageUrl} alt={item.name} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">{item.category}</span>
          </div>
          <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/[0.02] sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700"><PackageCheck aria-hidden="true" className="size-4" /> Detail barang</div>
            <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl">{item.name}</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
            <div className="mt-7 divide-y divide-slate-100 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                <span className="text-sm text-slate-500">Ketersediaan</span>
                <span className={`text-sm font-semibold ${item.availableQuantity ? 'text-emerald-700' : 'text-slate-400'}`}>{item.availableQuantity} dari {item.totalQuantity} unit</span>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                <span className="flex items-center gap-2 text-sm text-slate-500"><MapPin aria-hidden="true" className="size-4" /> Lokasi</span>
                <span className="text-right text-sm font-medium text-slate-800">{item.location}</span>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                <span className="flex items-center gap-2 text-sm text-slate-500"><CalendarDays aria-hidden="true" className="size-4" /> Pengajuan</span>
                <span className="text-sm font-medium text-slate-800">Ditinjau oleh admin</span>
              </div>
            </div>
            <div className="mt-auto pt-7">
              {item.availableQuantity > 0 ? (
                <Link href={`/borrow?item=${encodeURIComponent(item.id)}`} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/15 transition hover:bg-blue-700">Ajukan peminjaman <ArrowRight aria-hidden="true" className="size-4" /></Link>
              ) : (
                <button type="button" disabled className="h-12 w-full rounded-xl bg-slate-100 px-5 text-sm font-semibold text-slate-400">Barang sedang tidak tersedia</button>
              )}
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400"><ShieldCheck aria-hidden="true" className="size-3.5" /> Pengajuan hanya dapat diakses dengan akun kampus.</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
