'use client'

import { cn } from '@/lib/utils'

interface Tab {
    id: string
    label: string
    count?: number
}

interface TabGroupProps {
    tabs: Tab[]
    activeTab: string
    onChange: (id: string) => void
    className?: string
}

export function TabGroup({ tabs, activeTab, onChange, className }: TabGroupProps) {
    return (
        <div className={cn('flex flex-wrap gap-1 border-b border-surface-border', className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                        activeTab === tab.id
                            ? 'border-brand-green text-brand-green'
                            : 'border-transparent text-brand-gray hover:text-foreground'
                    )}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className="ml-1.5 rounded-full bg-surface-muted px-1.5 py-0.5 text-xs">{tab.count}</span>
                    )}
                </button>
            ))}
        </div>
    )
}
