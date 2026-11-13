import { AppShell } from '@/components/app-shell'
import { CatalogBrowser } from '@/components/catalog-browser'
import { db } from '@/lib/db'
import { inventoryItems } from '@/lib/db/schema'
import { requireUser } from '@/lib/auth-helpers'

export default async function CatalogPage() {
  const currentUser = await requireUser()
  const items = await db.select().from(inventoryItems).orderBy(inventoryItems.name)

  return (
    <AppShell user={{ name: currentUser.name, email: currentUser.email, role: currentUser.role }}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Koleksi kampus</p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Katalog barang</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Jelajahi perlengkapan yang tersedia untuk kegiatan belajar, organisasi, dan produksi kreatif.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm shadow-slate-950/[0.02]">
            <span className="font-semibold text-slate-900">{items.length}</span> jenis barang di katalog
          </div>
        </div>
        <CatalogBrowser items={items} />
      </div>
    </AppShell>
  )
}
