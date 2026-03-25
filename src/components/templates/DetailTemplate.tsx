import { cn } from '@/lib/utils'

interface DetailTemplateProps {
    title: string
    sidebar?: React.ReactNode
    children: React.ReactNode
    actions?: React.ReactNode
    className?: string
}

export function DetailTemplate({ title, sidebar, children, actions, className }: DetailTemplateProps) {
    return (
        <div className={cn('space-y-6', className)}>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{title}</h1>
                {actions}
            </div>
            <div className="flex gap-6">
                <div className="flex-1">{children}</div>
                {sidebar && <div className="w-80 shrink-0">{sidebar}</div>}
            </div>
        </div>
    )
}
