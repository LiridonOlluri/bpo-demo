'use client'

import { cn } from '@/lib/utils'

interface KpiGaugeProps {
    value: number
    target: number
    label: string
    format?: 'percent' | 'seconds' | 'number'
    size?: number
    className?: string
}

export function KpiGauge({ value, target, label, format = 'percent', size = 100, className }: KpiGaugeProps) {
    const pct = Math.min(value / target, 1.2)
    const color = pct >= 1 ? '#22C55E' : pct >= 0.9 ? '#F59E0B' : '#EF4444'
    const radius = (size - 12) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference * (1 - Math.min(pct, 1))

    const displayValue = format === 'percent'
        ? `${(value * 100).toFixed(1)}%`
        : format === 'seconds'
            ? `${value}s`
            : String(value)

    return (
        <div className={cn('flex flex-col items-center gap-1', className)}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={6} />
                <circle
                    cx={size / 2} cy={size / 2} r={radius} fill="none"
                    stroke={color} strokeWidth={6} strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
                <text x="50%" y="50%" textAnchor="middle" dy="0.35em" className="text-sm font-bold fill-foreground">
                    {displayValue}
                </text>
            </svg>
            <span className="text-xs text-brand-gray">{label}</span>
        </div>
    )
}
