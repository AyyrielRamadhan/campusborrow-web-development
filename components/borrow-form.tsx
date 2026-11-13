'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { createBorrowRequest } from '@/app/actions/borrowings'
import type { InventoryItem } from '@/components/item-card'

function getTodayDate() {
  const today = new Date()
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 10)
}

export function BorrowForm({ items, initialItemId = '' }: { items: InventoryItem[]; initialItemId?: string }) {
  const router = useRouter()
  const [selectedItemId, setSelectedItemId] = useState(initialItemId)
  const [feedback, setFeedback] = useState('')
  const [isPending, startTransition] = useTransition()
  const today = getTodayDate()
  const selectedItem = items.find((item) => item.id === selectedItemId)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await createBorrowRequest(formData)
      if (!result.ok) {
        setFeedback(result.message)
        return
      }
      router.push('/history')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/[0.02] sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="itemId" className="mb-2 block text-sm font-medium text-slate-700">Pilih barang</label>
          <select id="itemId" name="itemId" required value={selectedItemId} onChange={(event) => setSelectedItemId(event.target.value)} disabled={items.length === 0} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50">
            <option value="">Pilih perlengkapan dari katalog</option>
            {items.map((item) => <option key={item.id} value={item.id} disabled={item.availableQuantity < 1}>{item.name} · {item.availableQuantity} tersedia</option>)}
          </select>
          {selectedItem && <p className="mt-2 text-xs text-slate-500">Tersedia {selectedItem.availableQuantity} dari {selectedItem.totalQuantity} unit · {selectedItem.location}</p>}
        </div>
        <div>
          <label htmlFor="quantity" className="mb-2 block text-sm font-medium text-slate-700">Jumlah unit</label>
          <input id="quantity" name="quantity" type="number" min="1" max="5" defaultValue="1" required className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
          <p className="mt-1.5 text-xs text-slate-400">Maksimal 5 unit per pengajuan.</p>
        </div>
        <div>
          <label htmlFor="startDate" className="mb-2 block text-sm font-medium text-slate-700">Tanggal mulai</label>
          <input id="startDate" name="startDate" type="date" min={today} required className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
        </div>
        <div>
          <label htmlFor="endDate" className="mb-2 block text-sm font-medium text-slate-700">Tanggal pengembalian</label>
          <input id="endDate" name="endDate" type="date" min={today} required className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="purpose" className="mb-2 block text-sm font-medium text-slate-700">Keperluan peminjaman</label>
          <textarea id="purpose" name="purpose" required minLength={6} maxLength={400} rows={4} placeholder="Ceritakan singkat kegiatan atau mata kuliah yang membutuhkan barang ini" className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
          <p className="mt-1.5 text-xs text-slate-400">Maksimal 400 karakter.</p>
        </div>
      </div>

      {feedback && <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{feedback}</p>}
      <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-5 text-slate-500">Pengajuan akan ditinjau admin. Barang baru tercatat dipinjam setelah disetujui.</p>
        <button type="submit" disabled={isPending || items.length === 0} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-600/15 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60">
          {isPending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
          Kirim pengajuan {!isPending && <ArrowRight aria-hidden="true" className="size-4" />}
        </button>
      </div>
    </form>
  )
}
