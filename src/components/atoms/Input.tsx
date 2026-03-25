import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean
}

export function Input({ className, error, ...props }: InputProps) {
    return (
        <input
            className={cn(
                'w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-green/50',
                error ? 'border-status-red' : 'border-surface-border',
                className
            )}
            {...props}
        />
    )
}
