import { cn } from '@/lib/utils'

interface SplitCompareTemplateProps {
    leftTitle: string
    rightTitle: string
    left: React.ReactNode
    right: React.ReactNode
    className?: string
}

export function SplitCompareTemplate({ leftTitle, rightTitle, left, right, className }: SplitCompareTemplateProps) {
    return (
        <div className={cn('grid grid-cols-2 gap-6', className)}>
            <div>
                <h2 className="mb-4 text-lg font-semibold text-status-red">{leftTitle}</h2>
                {left}
            </div>
            <div>
                <h2 className="mb-4 text-lg font-semibold text-brand-green">{rightTitle}</h2>
                {right}
            </div>
        </div>
    )
}
