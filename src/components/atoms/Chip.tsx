import { cn } from '@/lib/utils'

interface ChipProps {
    children: React.ReactNode
    className?: string
    onRemove?: () => void
}

export function Chip({ children, className, onRemove }: ChipProps) {
    return (
        <span className={cn('inline-flex items-center gap-1 rounded-md bg-surface-muted px-2 py-1 text-xs font-medium text-brand-gray border border-surface-border', className)}>
            {children}
            {onRemove && (
                <button onClick={onRemove} className="ml-0.5 hover:text-status-red">&times;</button>
            )}
        </span>
    )
}
