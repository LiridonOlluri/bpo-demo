import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'

interface TicketCardProps {
    id: string
    priority: 'low' | 'medium' | 'high' | 'critical'
    status: string
    trigger: string
    createdAt: string
    className?: string
    onClick?: () => void
}

const priorityVariant = {
    low: 'grey',
    medium: 'amber',
    high: 'red',
    critical: 'red',
} as const

export function TicketCard({ priority, status, trigger, createdAt, className, onClick }: TicketCardProps) {
    return (
        <Card className={cn('cursor-pointer transition-shadow hover:shadow-md', className)} onClick={onClick}>
            <div className="flex items-start justify-between">
                <Badge variant={priorityVariant[priority]}>{priority.toUpperCase()}</Badge>
                <Badge variant="grey">{status}</Badge>
            </div>
            <p className="mt-2 text-sm font-medium">{trigger}</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-brand-gray">
                <Clock size={12} />
                <span>{new Date(createdAt).toLocaleString()}</span>
            </div>
        </Card>
    )
}
