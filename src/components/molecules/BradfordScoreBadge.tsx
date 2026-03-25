import { Badge } from '@/components/atoms/Badge'

interface BradfordScoreBadgeProps {
    score: number
    threshold: 'green' | 'amber' | 'red' | 'critical'
}

export function BradfordScoreBadge({ score, threshold }: BradfordScoreBadgeProps) {
    const variant = threshold === 'critical' ? 'red' : threshold
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{score}</span>
            <Badge variant={variant}>{threshold.toUpperCase()}</Badge>
        </div>
    )
}
