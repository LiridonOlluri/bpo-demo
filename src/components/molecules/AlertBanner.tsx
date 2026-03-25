'use client'

import { cn } from '@/lib/utils'
import { X, AlertTriangle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface AlertBannerProps {
    variant: 'amber' | 'red'
    message: string
    dismissible?: boolean
    className?: string
}

export function AlertBanner({ variant, message, dismissible = true, className }: AlertBannerProps) {
    const [dismissed, setDismissed] = useState(false)
    if (dismissed) return null

    const Icon = variant === 'red' ? AlertCircle : AlertTriangle
    return (
        <div className={cn(
            'flex items-center gap-3 rounded-lg px-4 py-3 text-sm',
            variant === 'red' ? 'bg-status-red/10 text-status-red' : 'bg-status-amber/10 text-status-amber',
            className
        )}>
            <Icon size={16} className="shrink-0" />
            <span className="flex-1">{message}</span>
            {dismissible && (
                <button onClick={() => setDismissed(true)} className="shrink-0 hover:opacity-70">
                    <X size={14} />
                </button>
            )}
        </div>
    )
}
