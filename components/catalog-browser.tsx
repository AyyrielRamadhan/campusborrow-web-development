'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Search } from 'lucide-react'
import type { InventoryItem } from '@/components/item-card'

export function CatalogBrowser({ items }: { items: InventoryItem[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Semua kategori')
  const categories = useMemo(() => ['Semua kategori', ...new Set(items.map((item) => item.category))], [items])
  const filteredItems = items.filter((item) => {
    const matchesQuery = `${item.name} ${item.category} ${item.location}`.toLowerCase().includes(query.trim().toLowerCase())
    const matchesCategory = category === 'Semua kategori' || item.category === category
    return matchesQuery && matchesCategory
  })

  return (
    <section aria-label="Daftar katalog barang" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.02]">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="text-sm text-slate-500"><span className="font-semibold text-slate-800">{filteredItems.length}</span> barang ditemukan</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block sm:w-64">
            <span className="sr-only">Cari nama barang, kategori, atau lokasi</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari barang..." className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
          </label>
          <label>
            <span className="sr-only">Filter kategori</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:w-44">
              {categories.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
        </div>
      </div>

      {filteredItems.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3.5">Nama barang</th>
                <th scope="col" className="px-4 py-3.5">Kategori</th>
                <th scope="col" className="px-4 py-3.5">Lokasi</th>
                <th scope="col" className="px-4 py-3.5">Ketersediaan</th>
                <th scope="col" className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div className="flex min-w-64 items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <Image src={item.imageUrl} alt={item.name} fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <Link href={`/catalog/${item.id}`} className="block truncate text-sm font-semibold text-slate-800 hover:text-blue-700">{item.name}</Link>
                        <span className="mt-1 block text-xs text-slate-500">{item.totalQuantity} unit inventaris</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{item.category}</span></td>
                  <td className="px-4 py-4 text-sm text-slate-600">{item.location}</td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-semibold ${item.availableQuantity > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>{item.availableQuantity} tersedia</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/catalog/${item.id}`} aria-label={`Detail ${item.name}`} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">
                      Detail <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-16 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"><Search aria-hidden="true" className="size-5" /></span>
          <h3 className="mt-4 text-sm font-semibold text-slate-900">Barang tidak ditemukan</h3>
          <p className="mt-1 text-sm text-slate-500">Coba kata kunci atau kategori lain.</p>
        </div>
      )}
    </section>
  )
}
