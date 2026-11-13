import type { BorrowStatus } from '@/lib/types'

type StatusBadgeProps = {
  status: BorrowStatus | string
}

const statusLabels: Record<string, string> = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  returned: 'Dikembalikan',
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  approved: 'bg-blue-50 text-blue-700 ring-blue-200',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
  returned: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status] ?? 'bg-slate-100 text-slate-600 ring-slate-200'}`}
    >
      {statusLabels[status] ?? status}
    </span>
  )
}
