import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  label: string
  value: number | string
  helper: string
  icon: LucideIcon
  tone?: 'blue' | 'amber' | 'emerald' | 'slate'
}

const toneStyles = {
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  slate: 'bg-slate-100 text-slate-700',
}

export function StatCard({ label, value, helper, icon: Icon, tone = 'blue' }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/[0.02]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        <span className={`flex size-11 items-center justify-center rounded-xl ${toneStyles[tone]}`}>
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>
      <p className="mt-4 text-xs text-slate-500">{helper}</p>
    </article>
  )
}
