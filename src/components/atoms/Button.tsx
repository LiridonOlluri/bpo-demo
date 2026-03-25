import { cn } from '@/lib/utils'

const variants = {
    primary: 'bg-brand-green text-white hover:bg-brand-green-dim',
    secondary: 'bg-surface-muted text-foreground border border-surface-border hover:bg-surface-border',
    ghost: 'bg-transparent text-foreground hover:bg-surface-muted',
    danger: 'bg-status-red text-white hover:bg-red-600',
} as const

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
} as const

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variants
    size?: keyof typeof sizes
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green/50 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}
