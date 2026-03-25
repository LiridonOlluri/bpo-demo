import { cn } from '@/lib/utils'

interface ExecutiveTemplateProps {
    title: string
    subtitle?: string
    summary?: React.ReactNode
    children: React.ReactNode
    className?: string
}

export function ExecutiveTemplate({ title, subtitle, summary, children, className }: ExecutiveTemplateProps) {
    return (
        <div className={cn('space-y-8', className)}>
            <div>
                <h1 className="text-3xl font-bold">{title}</h1>
                {subtitle && <p className="mt-1 text-brand-gray">{subtitle}</p>}
            </div>
            {summary && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">{summary}</div>
            )}
            <div className="space-y-6">{children}</div>
        </div>
    )
}
