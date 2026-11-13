import Link from 'next/link'
import { count, desc, eq, sum } from 'drizzle-orm'
import { ArrowRight, ClipboardClock, Package, PackageCheck, Users } from 'lucide-react'
import { AdminRequestTable } from '@/components/admin-request-table'
import { AppShell } from '@/components/app-shell'
import { StatCard } from '@/components/stat-card'
import { db } from '@/lib/db'
import { borrowRequests, inventoryItems, user } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/auth-helpers'

export default async function AdminDashboardPage() {
  const currentUser = await requireAdmin()
  const [inventoryCount, pendingCount, activeCount, totalUnits, requests] = await Promise.all([
    db.select({ value: count() }).from(inventoryItems),
    db.select({ value: count() }).from(borrowRequests).where(eq(borrowRequests.status, 'pending')),
    db.select({ value: count() }).from(borrowRequests).where(eq(borrowRequests.status, 'approved')),
    db.select({ value: sum(inventoryItems.availableQuantity) }).from(inventoryItems),
    db.select({
      id: borrowRequests.id,
      itemId: borrowRequests.itemId,
      itemName: inventoryItems.name,
      category: inventoryItems.category,
      imageUrl: inventoryItems.imageUrl,
      quantity: borrowRequests.quantity,
      purpose: borrowRequests.purpose,
      startDate: borrowRequests.startDate,
      endDate: borrowRequests.endDate,
      status: borrowRequests.status,
      createdAt: borrowRequests.createdAt,
      userName: user.name,
      userEmail: user.email,
    })
      .from(borrowRequests)
      .leftJoin(user, eq(borrowRequests.userId, user.id))
      .leftJoin(inventoryItems, eq(borrowRequests.itemId, inventoryItems.id))
      .orderBy(desc(borrowRequests.createdAt))
      .limit(30),
  ])

  return (
    <AppShell user={{ name: currentUser.name, email: currentUser.email, role: currentUser.role }}>
      <div className="space-y-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Pusat pengelolaan</p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Dashboard admin</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Tinjau permintaan mahasiswa dan pantau inventaris kampus.</p>
          </div>
          <Link href="/catalog" className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:self-auto">Lihat katalog <ArrowRight aria-hidden="true" className="size-4" /></Link>
        </div>

        <section aria-label="Ringkasan administrasi" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Jenis barang" value={inventoryCount[0]?.value ?? 0} helper="Item inventaris di katalog" icon={Package} tone="blue" />
          <StatCard label="Menunggu tinjauan" value={pendingCount[0]?.value ?? 0} helper="Perlu ditindaklanjuti" icon={ClipboardClock} tone="amber" />
          <StatCard label="Sedang dipinjam" value={activeCount[0]?.value ?? 0} helper="Pengajuan yang disetujui" icon={PackageCheck} tone="emerald" />
          <StatCard label="Unit tersedia" value={Number(totalUnits[0]?.value ?? 0)} helper="Total stok siap digunakan" icon={Users} tone="slate" />
        </section>

        <AdminRequestTable requests={requests} />
        <p className="text-xs text-slate-400">Daftar menampilkan hingga 30 pengajuan terbaru. Perubahan status akan memperbarui stok secara otomatis.</p>
      </div>
    </AppShell>
  )
}
