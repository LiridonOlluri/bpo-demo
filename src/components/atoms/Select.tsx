import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[]
}

export function Select({ className, options, ...props }: SelectProps) {
    return (
        <select
            className={cn(
                'w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/50',
                className
            )}
            {...props}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    )
}
