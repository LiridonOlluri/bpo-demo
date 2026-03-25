'use client'

import { Card } from '@/components/atoms/Card'
import { cn } from '@/lib/utils'
import { X, Ticket, AlertTriangle, Info } from 'lucide-react'

export interface Notification {
    id: string
    title: string
    message: string
    type: 'ticket' | 'alert' | 'info'
    time: string
}

interface NotificationPanelProps {
    isOpen: boolean
    onClose: () => void
    notifications: Notification[]
}

const TYPE_CONFIG = {
    ticket: { icon: Ticket, color: 'text-brand-blue' },
    alert: { icon: AlertTriangle, color: 'text-status-amber' },
    info: { icon: Info, color: 'text-brand-gray' },
} as const

export function NotificationPanel({ isOpen, onClose, notifications }: NotificationPanelProps) {
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30"
                    onClick={onClose}
                    aria-hidden
                />
            )}

            {/* Drawer */}
            <div
                className={cn(
                    'fixed right-0 top-0 z-50 flex h-full w-96 flex-col border-l border-surface-border bg-surface shadow-xl transition-transform duration-300',
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                )}
            >
                <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
                    <h2 className="text-lg font-bold">Notifications</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-brand-gray transition-colors hover:bg-surface-muted hover:text-foreground"
                        aria-label="Close notifications"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {notifications.length === 0 && (
                        <p className="py-12 text-center text-sm text-brand-gray">No notifications</p>
                    )}

                    {notifications.map((n) => {
                        const { icon: Icon, color } = TYPE_CONFIG[n.type]
                        return (
                            <Card key={n.id} className="flex items-start gap-3 p-4">
                                <Icon size={18} className={cn('mt-0.5 shrink-0', color)} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium">{n.title}</p>
                                    <p className="mt-0.5 text-xs text-brand-gray">{n.message}</p>
                                    <p className="mt-1 text-[11px] text-brand-gray/70">{n.time}</p>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
