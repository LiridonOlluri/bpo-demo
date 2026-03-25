import { cn } from '@/lib/utils'

interface DashboardTemplateProps {
    title: string
    statCards?: React.ReactNode
    children: React.ReactNode
    actions?: React.ReactNode
    className?: string
}

export function DashboardTemplate({ title, statCards, children, actions, className }: DashboardTemplateProps) {
    return (
        <div className={cn('space-y-6', className)}>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{title}</h1>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
            {statCards && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{statCards}</div>
            )}
            <div>{children}</div>
        </div>
    )
}
