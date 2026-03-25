import { Label } from '@/components/atoms/Label'
import { Input } from '@/components/atoms/Input'
import { cn } from '@/lib/utils'

interface FormFieldProps {
    label: string
    error?: string
    required?: boolean
    className?: string
    children?: React.ReactNode
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export function FormField({ label, error, required, className, children, inputProps }: FormFieldProps) {
    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            <Label required={required}>{label}</Label>
            {children ?? <Input error={!!error} {...inputProps} />}
            {error && <p className="text-xs text-status-red">{error}</p>}
        </div>
    )
}
