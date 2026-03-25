import { cn } from '@/lib/utils'

interface DataRowProps {
    label: string
    value: React.ReactNode
    className?: string
}

export function DataRow({ label, value, className }: DataRowProps) {
    return (
        <div className={cn('flex items-center justify-between py-2 border-b border-surface-border last:border-0', className)}>
            <span className="text-sm text-brand-gray">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    )
}
