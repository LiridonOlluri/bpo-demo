import { cn } from '@/lib/utils'

const shiftColors = {
    early: 'bg-brand-blue/20 border-brand-blue text-brand-blue',
    mid: 'bg-brand-green/20 border-brand-green text-brand-green-dim',
    late: 'bg-status-amber/20 border-status-amber text-status-amber',
    custom: 'bg-brand-gray/20 border-brand-gray text-brand-gray',
    break: 'bg-surface-muted border-surface-border text-brand-gray',
}

interface ShiftBlockProps {
    type: 'early' | 'mid' | 'late' | 'custom' | 'break'
    label: string
    start: string
    end: string
    className?: string
}

export function ShiftBlock({ type, label, start, end, className }: ShiftBlockProps) {
    return (
        <div className={cn('rounded-md border px-2 py-1 text-xs font-medium', shiftColors[type], className)}>
            <p>{label}</p>
            <p className="font-normal opacity-70">{start} – {end}</p>
        </div>
    )
}
