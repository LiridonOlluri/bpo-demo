import { InboxIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
    title: string
    description?: string
    className?: string
    children?: React.ReactNode
}

export function EmptyState({ title, description, className, children }: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
            <InboxIcon size={48} className="text-surface-border" />
            <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
            {description && <p className="mt-1 text-xs text-brand-gray">{description}</p>}
            {children && <div className="mt-4">{children}</div>}
        </div>
    )
}
