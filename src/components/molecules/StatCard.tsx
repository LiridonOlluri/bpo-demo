import { Card } from '@/components/atoms/Card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
    label: string
    value: string | number
    trend?: 'up' | 'down' | 'flat'
    trendValue?: string
    variant?: 'green' | 'amber' | 'red' | 'default'
    className?: string
}

const trendColors = {
    up: 'text-status-green',
    down: 'text-status-red',
    flat: 'text-brand-gray',
}



export function StatCard({ label, value, trend, trendValue, variant = 'default', className }: StatCardProps) {
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
    return (
        <Card className={cn( className)}>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-gray">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            {trend && trendValue && (
                <div className={cn('mt-1 flex items-center gap-1 text-xs', trendColors[trend])}>
                    <TrendIcon size={12} />
                    <span>{trendValue}</span>
                </div>
            )}
        </Card>
    )
}
