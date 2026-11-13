import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, ClipboardCheck, Clock3, ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BorrowForm } from '@/components/borrow-form'
import { db } from '@/lib/db'
import { inventoryItems } from '@/lib/db/schema'
import { requireUser } from '@/lib/auth-helpers'

export default async function BorrowPage({ searchParams }: { searchParams: Promise<{ item?: string }> }) {
  const currentUser = await requireUser()
  const { item: initialItemId } = await searchParams
  const items = await db.select().from(inventoryItems).orderBy(inventoryItems.name)
  const availableItems = items.filter((item) => item.availableQuantity > 0)

  if (initialItemId && !items.some((item) => item.id === initialItemId)) redirect('/catalog')

  return (
    <AppShell user={{ name: currentUser.name, email: currentUser.email, role: currentUser.role }}>
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href={initialItemId ? `/catalog/${encodeURIComponent(initialItemId)}` : '/catalog'} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"><ArrowLeft aria-hidden="true" className="size-4" /> Kembali</Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Form pengajuan</p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Ajukan peminjaman</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Isi detail kebutuhanmu. Admin akan meninjau pengajuan sebelum barang disiapkan.</p>
        </div>

        {availableItems.length ? <BorrowForm items={availableItems} initialItemId={initialItemId} /> : (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
            <p className="text-sm font-semibold text-slate-800">Belum ada barang yang tersedia</p>
            <p className="mt-1 text-sm text-slate-500">Silakan kembali ke katalog untuk melihat pembaruan stok.</p>
            <Link href="/catalog" className="mt-4 inline-flex items-center text-sm font-semibold text-blue-700">Buka katalog</Link>
          </div>
        )}

        <section aria-label="Informasi peminjaman" className="grid gap-3 sm:grid-cols-3">
          <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><ClipboardCheck aria-hidden="true" className="size-4" /></span><div><p className="text-sm font-semibold text-slate-800">Ajukan</p><p className="mt-1 text-xs leading-5 text-slate-500">Lengkapi barang dan tanggal kebutuhan.</p></div></div>
          <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Clock3 aria-hidden="true" className="size-4" /></span><div><p className="text-sm font-semibold text-slate-800">Menunggu</p><p className="mt-1 text-xs leading-5 text-slate-500">Admin meninjau ketersediaan barang.</p></div></div>
          <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck aria-hidden="true" className="size-4" /></span><div><p className="text-sm font-semibold text-slate-800">Selesai</p><p className="mt-1 text-xs leading-5 text-slate-500">Pantau statusnya di halaman riwayat.</p></div></div>
        </section>
      </div>
    </AppShell>
  )
}
