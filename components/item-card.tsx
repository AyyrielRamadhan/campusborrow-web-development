import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, MapPin } from 'lucide-react'
import type { inventoryItems } from '@/lib/db/schema'

export type InventoryItem = typeof inventoryItems.$inferSelect

type ItemCardProps = {
  item: InventoryItem
}

export function ItemCard({ item }: ItemCardProps) {
  const unavailable = item.availableQuantity < 1

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.02] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/[0.06]">
      <Link href={`/catalog/${item.id}`} className="block" aria-label={`Lihat detail ${item.name}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            {item.category}
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 font-semibold leading-6 text-slate-900">{item.name}</h3>
            <ArrowUpRight aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-400 transition group-hover:text-blue-600" />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="truncate">{item.location}</span>
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className={`text-sm font-semibold ${unavailable ? 'text-slate-400' : 'text-emerald-700'}`}>
              {unavailable ? 'Sedang habis' : `${item.availableQuantity} tersedia`}
            </span>
            <span className="text-xs text-slate-400">dari {item.totalQuantity} unit</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
