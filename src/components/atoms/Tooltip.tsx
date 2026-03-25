'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Info } from 'lucide-react'

interface TooltipProps {
    content: string
    children?: React.ReactNode
    className?: string
}

export function Tooltip({ content, children, className }: TooltipProps) {
    const [show, setShow] = useState(false)
    return (
        <span
            className={cn('relative inline-flex', className)}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children ?? <Info size={14} className="text-brand-gray" />}
            {show && (
                <span className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-brand-dark px-3 py-1.5 text-xs text-white shadow-lg">
                    {content}
                </span>
            )}
        </span>
    )
}
