import { cn } from '@/lib/utils'

interface ProgressBarProps {
    value: number
    max?: number
    variant?: 'green' | 'amber' | 'red' | 'blue'
    className?: string
}

const barColors = {
    green: 'bg-status-green',
    amber: 'bg-status-amber',
    red: 'bg-status-red',
    blue: 'bg-brand-blue',
}

export function ProgressBar({ value, max = 100, variant = 'green', className }: ProgressBarProps) {
    const pct = Math.min((value / max) * 100, 100)
    return (
        <div className={cn('h-2 w-full rounded-full bg-surface-muted', className)}>
            <div
                className={cn('h-full rounded-full transition-all', barColors[variant])}
                style={{ width: `${pct}%` }}
            />
        </div>
    )
}
