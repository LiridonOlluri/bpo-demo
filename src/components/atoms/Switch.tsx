'use client'

import { cn } from '@/lib/utils'

interface SwitchProps {
    checked: boolean
    onChange: (checked: boolean) => void
    className?: string
    label?: string
}

export function Switch({ checked, onChange, className, label }: SwitchProps) {
    return (
        <label className={cn('inline-flex items-center gap-2 cursor-pointer', className)}>
            <button
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={cn(
                    'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                    checked ? 'bg-brand-green' : 'bg-surface-border'
                )}
            >
                <span
                    className={cn(
                        'inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform',
                        checked ? 'translate-x-4.5' : 'translate-x-0.5'
                    )}
                />
            </button>
            {label && <span className="text-sm text-foreground">{label}</span>}
        </label>
    )
}
