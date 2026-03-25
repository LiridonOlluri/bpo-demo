'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/atoms/Badge'
import { Bell, Menu } from 'lucide-react'

const PATHNAME_TITLES: Record<string, string> = {
    '/settings/indicators': 'Indicators registry',
    '/overview': 'Overview',
    '/clients': 'Clients',
    '/workforce': 'Workforce',
    '/attendance': 'Attendance',
    '/performance': 'Performance',
    '/quality': 'Quality',
    '/payroll': 'Payroll',
    '/billing': 'Billing',
    '/hr': 'HR',
    '/training': 'Training',
    '/compliance': 'Compliance',
    '/settings': 'Settings',
}

function deriveTitle(pathname: string): string {
    const sorted = Object.entries(PATHNAME_TITLES).sort((a, b) => b[0].length - a[0].length)
    const match = sorted.find(([prefix]) => pathname.startsWith(prefix))
    return match ? match[1] : 'Dashboard'
}

interface HeaderProps {
    onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
    const pathname = usePathname()
    const { user } = useAuth()
    const title = deriveTitle(pathname)

    return (
        <header className="flex h-14 min-h-14 items-center justify-between gap-3 border-b border-surface-border bg-surface px-4 pt-[env(safe-area-inset-top)] sm:h-16 sm:min-h-16 sm:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                {onMenuClick && (
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="shrink-0 rounded-lg p-2 text-brand-gray transition-colors hover:bg-surface-muted hover:text-foreground lg:hidden"
                        aria-label="Open navigation menu"
                    >
                        <Menu size={22} />
                    </button>
                )}
                <h1 className="truncate text-lg font-bold sm:text-xl">{title}</h1>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                <button
                    type="button"
                    className="relative rounded-lg p-2 text-brand-gray transition-colors hover:bg-surface-muted hover:text-foreground"
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                </button>

                <div className="flex min-w-0 items-center gap-2">
                    <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline md:max-w-none">
                        {user?.name}
                    </span>
                    <Badge variant="green" className="max-w-[100px] truncate text-xs sm:max-w-none sm:text-sm">
                        {user?.role.name}
                    </Badge>
                </div>
            </div>
        </header>
    )
}
