import Link from 'next/link'
import { and, count, desc, eq } from 'drizzle-orm'
import { ArrowRight, BookOpenCheck, ClipboardClock, History, PackageCheck } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { ItemCard } from '@/components/item-card'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { db } from '@/lib/db'
import { borrowRequests, inventoryItems } from '@/lib/db/schema'
import { formatDate } from '@/lib/format'
import { requireUser } from '@/lib/auth-helpers'

export default async function DashboardPage() {
  const currentUser = await requireUser()
  const [activeRows, pendingRows, totalRows, recentRequests, featuredItems] = await Promise.all([
    db.select({ value: count() }).from(borrowRequests).where(and(eq(borrowRequests.userId, currentUser.id), eq(borrowRequests.status, 'approved'))),
    db.select({ value: count() }).from(borrowRequests).where(and(eq(borrowRequests.userId, currentUser.id), eq(borrowRequests.status, 'pending'))),
    db.select({ value: count() }).from(borrowRequests).where(eq(borrowRequests.userId, currentUser.id)),
    db.select({ id: borrowRequests.id, itemName: inventoryItems.name, startDate: borrowRequests.startDate, endDate: borrowRequests.endDate, status: borrowRequests.status, quantity: borrowRequests.quantity })
      .from(borrowRequests)
      .leftJoin(inventoryItems, eq(borrowRequests.itemId, inventoryItems.id))
      .where(eq(borrowRequests.userId, currentUser.id))
      .orderBy(desc(borrowRequests.createdAt))
      .limit(4),
    db.select().from(inventoryItems).orderBy(desc(inventoryItems.availableQuantity)).limit(3),
  ])

  return (
    <AppShell user={{ name: currentUser.name, email: currentUser.email, role: currentUser.role }}>
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-5 rounded-3xl bg-gradient-to-br from-blue-700 to-blue-600 px-6 py-7 text-white shadow-lg shadow-blue-900/10 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-8">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-blue-100">Ruang belajar jadi lebih siap</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Halo, {currentUser.name.split(' ')[0]}.</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-blue-100/85">Temukan perlengkapan kampus yang kamu butuhkan, lalu ajukan peminjaman dengan beberapa langkah sederhana.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/catalog" className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">Jelajahi katalog <ArrowRight aria-hidden="true" className="size-4" /></Link>
              <Link href="/history" className="inline-flex h-10 items-center rounded-xl border border-white/25 px-4 text-sm font-semibold text-white transition hover:bg-white/10">Lihat riwayat</Link>
            </div>
          </div>
          <div className="hidden shrink-0 rounded-2xl border border-white/15 bg-white/10 p-5 sm:block">
            <BookOpenCheck aria-hidden="true" className="size-9 text-blue-100" />
            <p className="mt-5 text-2xl font-semibold">Mudah & tertata</p>
            <p className="mt-1 text-xs text-blue-100/75">Pantau setiap pengajuanmu</p>
          </div>
        </section>

        <section aria-label="Ringkasan peminjaman" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Peminjaman aktif" value={activeRows[0]?.value ?? 0} helper="Barang yang sedang kamu gunakan" icon={PackageCheck} tone="blue" />
          <StatCard label="Menunggu persetujuan" value={pendingRows[0]?.value ?? 0} helper="Pengajuan yang sedang ditinjau admin" icon={ClipboardClock} tone="amber" />
          <StatCard label="Total pengajuan" value={totalRows[0]?.value ?? 0} helper="Semua permintaan peminjamanmu" icon={History} tone="slate" />
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Pilihan untukmu</p>
              <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-slate-900">Barang yang tersedia</h2>
            </div>
            <Link href="/catalog" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800">Lihat katalog <ArrowRight aria-hidden="true" className="size-4" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featuredItems.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.02]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Peminjaman terbaru</h2>
              <p className="mt-1 text-sm text-slate-500">Pantau status pengajuan terakhirmu.</p>
            </div>
            <Link href="/history" className="text-sm font-semibold text-blue-700 hover:text-blue-800">Lihat semua</Link>
          </div>
          {recentRequests.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr><th scope="col" className="px-5 py-3.5 sm:px-6">Barang</th><th scope="col" className="px-4 py-3.5">Periode</th><th scope="col" className="px-4 py-3.5">Unit</th><th scope="col" className="px-5 py-3.5 sm:px-6">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-800 sm:px-6">{request.itemName ?? 'Barang tidak tersedia'}</td>
                      <td className="px-4 py-4 text-xs leading-5 text-slate-600">{formatDate(request.startDate)} – {formatDate(request.endDate)}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{request.quantity}</td>
                      <td className="px-5 py-4 sm:px-6"><StatusBadge status={request.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-sm font-semibold text-slate-800">Belum ada peminjaman</p>
              <p className="mt-1 text-sm text-slate-500">Ajukan barang dari katalog untuk memulai.</p>
              <Link href="/catalog" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">Buka katalog <ArrowRight aria-hidden="true" className="size-4" /></Link>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}
