import { cn } from '@/lib/utils'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean
}

export function Label({ className, children, required, ...props }: LabelProps) {
    return (
        <label className={cn('block text-sm font-medium text-foreground', className)} {...props}>
            {children}
            {required && <span className="ml-0.5 text-status-red">*</span>}
        </label>
    )
}
