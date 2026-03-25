import { cn } from '@/lib/utils'

const variants = {
    green: 'bg-status-green/15 text-status-green',
    amber: 'bg-status-amber/15 text-status-amber',
    red: 'bg-status-red/15 text-status-red',
    grey: 'bg-status-grey/15 text-status-grey',
    blue: 'bg-brand-blue/15 text-brand-blue',
} as const

interface BadgeProps {
    variant?: keyof typeof variants
    children: React.ReactNode
    className?: string
}

export function Badge({ variant = 'grey', children, className }: BadgeProps) {
    return (
        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
            {children}
        </span>
    )
}
