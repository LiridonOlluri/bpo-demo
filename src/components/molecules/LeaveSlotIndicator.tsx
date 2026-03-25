import { cn } from '@/lib/utils'

const slotColors = {
    green: 'bg-status-green',
    amber: 'bg-status-amber',
    red: 'bg-status-red',
}

interface LeaveSlotIndicatorProps {
    slotsUsed: number
    slotsAvailable: number
    status: 'green' | 'amber' | 'red'
    className?: string
}

export function LeaveSlotIndicator({ slotsUsed, slotsAvailable, status, className }: LeaveSlotIndicatorProps) {
    const total = slotsAvailable + slotsUsed
    return (
        <div className={cn('flex items-center gap-1', className)}>
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        'h-3 w-3 rounded-sm',
                        i < slotsUsed ? slotColors[status] : 'bg-surface-border'
                    )}
                />
            ))}
            <span className="ml-1 text-xs text-brand-gray">{slotsUsed}/{total}</span>
        </div>
    )
}
