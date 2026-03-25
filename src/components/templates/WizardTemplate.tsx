'use client'

import { cn } from '@/lib/utils'

interface WizardTemplateProps {
    title: string
    steps: { id: string; label: string }[]
    currentStep: number
    children: React.ReactNode
    className?: string
}

export function WizardTemplate({ title, steps, currentStep, children, className }: WizardTemplateProps) {
    return (
        <div className={cn('mx-auto max-w-3xl space-y-8', className)}>
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="flex items-center gap-2">
                {steps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-2">
                        <div className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                            i < currentStep ? 'bg-brand-green text-white' :
                                i === currentStep ? 'bg-brand-green/20 text-brand-green border-2 border-brand-green' :
                                    'bg-surface-muted text-brand-gray'
                        )}>
                            {i + 1}
                        </div>
                        <span className={cn('text-sm', i === currentStep ? 'font-medium' : 'text-brand-gray')}>{step.label}</span>
                        {i < steps.length - 1 && <div className="mx-2 h-px w-8 bg-surface-border" />}
                    </div>
                ))}
            </div>
            <div>{children}</div>
        </div>
    )
}
