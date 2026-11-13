import Link from 'next/link'
import Image from 'next/image'
import { desc, eq } from 'drizzle-orm'
import { ArrowRight, ClipboardList } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { StatusBadge } from '@/components/status-badge'
import { db } from '@/lib/db'
import { borrowRequests, inventoryItems } from '@/lib/db/schema'
import { formatDate } from '@/lib/format'
import { requireUser } from '@/lib/auth-helpers'

export default async function HistoryPage() {
  const currentUser = await requireUser()
  const requests = await db.select({
    id: borrowRequests.id,
    itemId: borrowRequests.itemId,
    itemName: inventoryItems.name,
    imageUrl: inventoryItems.imageUrl,
    category: inventoryItems.category,
    quantity: borrowRequests.quantity,
    startDate: borrowRequests.startDate,
    endDate: borrowRequests.endDate,
    status: borrowRequests.status,
    purpose: borrowRequests.purpose,
    createdAt: borrowRequests.createdAt,
  })
    .from(borrowRequests)
    .leftJoin(inventoryItems, eq(borrowRequests.itemId, inventoryItems.id))
    .where(eq(borrowRequests.userId, currentUser.id))
    .orderBy(desc(borrowRequests.createdAt))

  return (
    <AppShell user={{ name: currentUser.name, email: currentUser.email, role: currentUser.role }}>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Aktivitas akun</p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Riwayat peminjaman</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Semua pengajuan barangmu, dari yang menunggu hingga selesai.</p>
        </div>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.02]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div><h2 className="text-base font-semibold text-slate-900">Daftar peminjaman</h2><p className="mt-1 text-sm text-slate-500">{requests.length} pengajuan tercatat</p></div>
            <Link href="/catalog" className="hidden items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800 sm:inline-flex">Pinjam barang <ArrowRight aria-hidden="true" className="size-4" /></Link>
          </div>
          {requests.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[790px] text-left">
                <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th scope="col" className="px-5 py-3.5 sm:px-6">Barang</th><th scope="col" className="px-4 py-3.5">Periode</th><th scope="col" className="px-4 py-3.5">Jumlah</th><th scope="col" className="px-4 py-3.5">Diajukan</th><th scope="col" className="px-5 py-3.5 sm:px-6">Status</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-slate-100">{request.imageUrl && <Image src={request.imageUrl} alt={request.itemName ?? 'Barang katalog'} fill sizes="44px" className="object-cover" />}</div>
                          <div><p className="text-sm font-semibold text-slate-800">{request.itemName ?? 'Barang tidak tersedia'}</p><p className="mt-1 text-xs text-slate-500">{request.category ?? '—'}</p></div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs leading-5 text-slate-600">{formatDate(request.startDate)}<br />s.d. {formatDate(request.endDate)}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{request.quantity} unit</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{formatDate(request.createdAt)}</td>
                      <td className="px-5 py-4 sm:px-6"><StatusBadge status={request.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-14 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><ClipboardList aria-hidden="true" className="size-5" /></span>
              <p className="mt-4 text-sm font-semibold text-slate-900">Riwayatmu masih kosong</p>
              <p className="mt-1 text-sm text-slate-500">Pengajuan yang kamu buat akan muncul di sini.</p>
              <Link href="/catalog" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">Jelajahi katalog <ArrowRight aria-hidden="true" className="size-4" /></Link>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}
