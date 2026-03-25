import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    padding?: boolean
}

export function Card({ children, className, padding = true, ...rest }: CardProps) {
    return (
        <div className={cn('rounded-xl border border-surface-border bg-surface shadow-sm', padding && 'p-6', className)} {...rest}>
            {children}
        </div>
    )
}
