import { cn } from '@/lib/utils'

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    displayValue?: string
}

export function Slider({ className, label, displayValue, ...props }: SliderProps) {
    return (
        <div className={cn('flex flex-col gap-1', className)}>
            {label && (
                <div className="flex justify-between text-sm">
                    <span className="text-brand-gray">{label}</span>
                    {displayValue && <span className="font-medium">{displayValue}</span>}
                </div>
            )}
            <input type="range" className="w-full accent-brand-green" {...props} />
        </div>
    )
}
