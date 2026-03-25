'use client'

import { Chip } from '@/components/atoms/Chip'
import { cn } from '@/lib/utils'
import { Replace, X, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface CompetitorReplaceBarProps {
    competitors: string[]
    visible: boolean
}

export function CompetitorReplaceBar({ competitors, visible: initialVisible }: CompetitorReplaceBarProps) {
    const [visible, setVisible] = useState(initialVisible)

    return (
        <div
            className={cn(
                'fixed bottom-0 inset-x-0 z-50 transition-transform duration-300',
                visible ? 'translate-y-0' : 'translate-y-full'
            )}
        >
            <button
                onClick={() => setVisible((v) => !v)}
                className="absolute -top-8 right-4 flex items-center gap-1 rounded-t-lg bg-surface px-3 py-1 text-xs font-medium border border-b-0 border-surface-border text-brand-gray hover:text-foreground"
            >
                {visible ? <X size={12} /> : <ChevronUp size={12} />}
                {visible ? 'Hide' : 'Show competitors'}
            </button>

            <div className="flex items-center gap-3 border-t border-surface-border bg-surface px-6 py-3 overflow-x-auto">
                <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-brand-gray">
                    <Replace size={14} />
                    Replaces:
                </div>
                {competitors.map((name) => (
                    <Chip key={name}>{name}</Chip>
                ))}
            </div>
        </div>
    )
}
