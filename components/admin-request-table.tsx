'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, LoaderCircle, RotateCcw, X } from 'lucide-react'
import { updateBorrowRequestStatus } from '@/app/actions/borrowings'
import { formatDate } from '@/lib/format'
import type { AdminBorrowRow, BorrowStatus } from '@/lib/types'
import { StatusBadge } from '@/components/status-badge'

export function AdminRequestTable({ requests }: { requests: AdminBorrowRow[] }) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleStatus(id: string, status: BorrowStatus) {
    setMessage('')
    setBusyId(id)
    startTransition(async () => {
      const result = await updateBorrowRequestStatus(id, status)
      if (!result.ok) setMessage(result.message)
      else router.refresh()
      setBusyId(null)
    })
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.02]">
      <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-slate-900">Daftar pengajuan</h2>
        <p className="text-sm text-slate-500">Tinjau permintaan dan perbarui status peminjaman.</p>
      </div>
      {message && <p role="alert" className="mx-5 mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:mx-6">{message}</p>}
      {requests.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[930px] text-left">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3.5">Mahasiswa</th>
                <th scope="col" className="px-4 py-3.5">Barang</th>
                <th scope="col" className="px-4 py-3.5">Periode</th>
                <th scope="col" className="px-4 py-3.5">Status</th>
                <th scope="col" className="px-5 py-3.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((request) => (
                <tr key={request.id} className="align-top">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">{request.userName ?? 'Mahasiswa'}</p>
                    <p className="mt-1 text-xs text-slate-500">{request.userEmail ?? '—'}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="max-w-52 text-sm font-medium text-slate-800">{request.itemName ?? 'Barang tidak tersedia'}</p>
                    <p className="mt-1 text-xs text-slate-500">{request.quantity} unit · {request.category ?? '—'}</p>
                    <p className="mt-1 max-w-56 text-xs leading-5 text-slate-400">{request.purpose}</p>
                  </td>
                  <td className="px-4 py-4 text-xs leading-5 text-slate-600">{formatDate(request.startDate)}<br />s.d. {formatDate(request.endDate)}</td>
                  <td className="px-4 py-4"><StatusBadge status={request.status} /></td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {request.status === 'pending' && (
                        <>
                          <button type="button" onClick={() => handleStatus(request.id, 'approved')} disabled={isPending} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
                            {busyId === request.id ? <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin" /> : <Check aria-hidden="true" className="size-3.5" />}
                            Setujui
                          </button>
                          <button type="button" onClick={() => handleStatus(request.id, 'rejected')} disabled={isPending} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60">
                            <X aria-hidden="true" className="size-3.5" /> Tolak
                          </button>
                        </>
                      )}
                      {request.status === 'approved' && (
                        <button type="button" onClick={() => handleStatus(request.id, 'returned')} disabled={isPending} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60">
                          {busyId === request.id ? <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin" /> : <RotateCcw aria-hidden="true" className="size-3.5" />}
                          Tandai kembali
                        </button>
                      )}
                      {request.status !== 'pending' && request.status !== 'approved' && <span className="text-xs text-slate-400">Selesai</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-14 text-center">
          <p className="text-sm font-semibold text-slate-800">Belum ada pengajuan</p>
          <p className="mt-1 text-sm text-slate-500">Pengajuan baru akan muncul di sini.</p>
        </div>
      )}
    </section>
  )
}
