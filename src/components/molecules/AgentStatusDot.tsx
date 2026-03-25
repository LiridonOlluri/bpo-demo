import { cn } from '@/lib/utils'

const dotColors = {
    green: 'bg-status-green',
    amber: 'bg-status-amber',
    red: 'bg-status-red',
    grey: 'bg-status-grey',
}

interface AgentStatusDotProps {
    name: string
    status: 'green' | 'amber' | 'red' | 'grey'
    subtitle?: string
    className?: string
}

export function AgentStatusDot({ name, status, subtitle, className }: AgentStatusDotProps) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <span className={cn('h-2.5 w-2.5 rounded-full', dotColors[status])} />
            <div>
                <p className="text-sm font-medium">{name}</p>
                {subtitle && <p className="text-xs text-brand-gray">{subtitle}</p>}
            </div>
        </div>
    )
}
