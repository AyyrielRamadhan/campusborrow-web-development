'use server'

import { and, eq, gte, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { borrowRequests, inventoryItems } from '@/lib/db/schema'
import type { BorrowStatus } from '@/lib/types'

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export async function createBorrowRequest(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { ok: false as const, message: 'Sesi berakhir. Silakan masuk kembali.' }

  const itemId = String(formData.get('itemId') ?? '').trim()
  const quantity = Number(formData.get('quantity'))
  const startDate = String(formData.get('startDate') ?? '')
  const endDate = String(formData.get('endDate') ?? '')
  const purpose = String(formData.get('purpose') ?? '').trim()

  if (!itemId || itemId.length > 100) return { ok: false as const, message: 'Pilih barang yang ingin dipinjam.' }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) return { ok: false as const, message: 'Jumlah unit harus berupa angka bulat antara 1 dan 5.' }
  if (!isValidDate(startDate) || !isValidDate(endDate) || endDate < startDate) return { ok: false as const, message: 'Periksa kembali tanggal peminjaman dan pengembalian.' }
  if (startDate < new Date().toISOString().slice(0, 10)) return { ok: false as const, message: 'Tanggal mulai tidak boleh berada di masa lalu.' }
  if (purpose.length < 6 || purpose.length > 400) return { ok: false as const, message: 'Keperluan harus berisi 6–400 karakter.' }

  const [item] = await db.select({ id: inventoryItems.id, availableQuantity: inventoryItems.availableQuantity })
    .from(inventoryItems)
    .where(eq(inventoryItems.id, itemId))
    .limit(1)

  if (!item) return { ok: false as const, message: 'Barang tidak ditemukan di katalog.' }
  if (item.availableQuantity < quantity) return { ok: false as const, message: 'Jumlah yang tersedia tidak mencukupi. Muat ulang katalog dan coba lagi.' }

  await db.insert(borrowRequests).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    itemId,
    quantity,
    purpose,
    startDate,
    endDate,
    status: 'pending',
  })

  revalidatePath('/dashboard')
  revalidatePath('/history')
  revalidatePath('/admin')

  return { ok: true as const }
}

export async function updateBorrowRequestStatus(id: string, nextStatus: BorrowStatus) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== 'admin') return { ok: false as const, message: 'Kamu tidak memiliki akses untuk mengubah pengajuan.' }
  if (!id || id.length > 100 || !['approved', 'rejected', 'returned'].includes(nextStatus)) return { ok: false as const, message: 'Permintaan tidak valid.' }

  try {
    await db.transaction(async (tx) => {
      const [request] = await tx.select().from(borrowRequests).where(eq(borrowRequests.id, id)).for('update').limit(1)
      if (!request) throw new Error('Pengajuan tidak ditemukan.')

      if (nextStatus === 'approved') {
        if (request.status !== 'pending') throw new Error('Hanya pengajuan yang menunggu yang dapat disetujui.')
        const updatedItems = await tx.update(inventoryItems)
          .set({ availableQuantity: sql`${inventoryItems.availableQuantity} - ${request.quantity}`, updatedAt: new Date() })
          .where(and(eq(inventoryItems.id, request.itemId), gte(inventoryItems.availableQuantity, request.quantity)))
          .returning({ id: inventoryItems.id })
        if (!updatedItems.length) throw new Error('Stok tidak cukup untuk menyetujui pengajuan ini.')
      } else if (nextStatus === 'rejected') {
        if (request.status !== 'pending') throw new Error('Hanya pengajuan yang menunggu yang dapat ditolak.')
      } else {
        if (request.status !== 'approved') throw new Error('Hanya peminjaman aktif yang dapat ditandai kembali.')
        await tx.update(inventoryItems)
          .set({ availableQuantity: sql`${inventoryItems.availableQuantity} + ${request.quantity}`, updatedAt: new Date() })
          .where(eq(inventoryItems.id, request.itemId))
      }

      await tx.update(borrowRequests)
        .set({ status: nextStatus, updatedAt: new Date() })
        .where(and(eq(borrowRequests.id, id), eq(borrowRequests.status, request.status)))
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    const knownMessages = [
      'Pengajuan tidak ditemukan.',
      'Hanya pengajuan yang menunggu yang dapat disetujui.',
      'Hanya pengajuan yang menunggu yang dapat ditolak.',
      'Stok tidak cukup untuk menyetujui pengajuan ini.',
      'Hanya peminjaman aktif yang dapat ditandai kembali.',
    ]
    return { ok: false as const, message: knownMessages.includes(message) ? message : 'Status pengajuan belum dapat diperbarui. Coba lagi.' }
  }

  revalidatePath('/admin')
  revalidatePath('/dashboard')
  revalidatePath('/history')
  revalidatePath('/catalog')

  return { ok: true as const }
}
