import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Lock } from 'lucide-react'
import { Tooltip } from '@/components/atoms/Tooltip'

interface AiFeatureLockProps {
    name?: string
    title?: string
    description: string
    badgeText?: string
}

export function AiFeatureLock({ name, title, description, badgeText = 'Premium' }: AiFeatureLockProps) {
    const displayName = title ?? name ?? ''
    return (
        <Card className="relative opacity-60 cursor-not-allowed">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <Lock size={14} className="text-brand-gray" />
                    <p className="text-sm font-medium">{displayName}</p>
                </div>
                <Badge variant="blue">{badgeText}</Badge>
            </div>
            <p className="mt-1 text-xs text-brand-gray">{description}</p>
            <Tooltip content="This feature activates with the AI module — no architectural change required." />
        </Card>
    )
}
