'use client'

import { usePathname } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/atoms/Badge'
import { Modal } from '@/components/atoms/Modal'
import { Bell, Menu, AlertTriangle, TrendingDown, Clock } from 'lucide-react'

interface Notification {
    id: string
    title: string
    summary: string
    detail: string
    time: string
    variant: 'red' | 'amber' | 'grey'
    icon: 'alert' | 'trending' | 'clock'
    unread: boolean
}

const NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'SLA Breach — Client A',
        summary: 'Service level dropped below 75% threshold.',
        detail: 'Team B recorded a service level of 71.4% between 10:00–10:30 today, breaching the Client A contractual threshold of 75%. This is the second consecutive interval below target. An SLA penalty of up to €320 may apply if the trend continues. Immediate action recommended: re-queue waiting contacts and request TL override.',
        time: '10 min ago',
        variant: 'red',
        icon: 'alert',
        unread: true,
    },
    {
        id: '2',
        title: 'FTE Loss Spike — Team D',
        summary: 'Unplanned shrinkage reached 28% this morning.',
        detail: 'Team D has accumulated 28% unplanned shrinkage today (target ≤ 9%). Three agents called in sick (NCNS ×1), and two are currently on extended break beyond the permitted 15-minute window. Estimated daily cost impact: €84. If the pattern persists for the week, projected loss is €420. Consider redistributing volume to Team F which is currently at 11% shrinkage.',
        time: '42 min ago',
        variant: 'amber',
        icon: 'trending',
        unread: true,
    },
    {
        id: '3',
        title: 'Overtime Request Pending',
        summary: '2 overtime requests awaiting approval for tomorrow.',
        detail: 'Agents Sara M. and João P. have submitted overtime requests for tomorrow 18:00–20:00 (2h each). Combined cost: €36.40 at 1.5× rate. Forecasted volume for that slot is high (+22% vs. average), making approval cost-effective relative to the €180 SLA penalty risk at current staffing. Both requests require TL sign-off before 17:00 today.',
        time: '1 hr ago',
        variant: 'grey',
        icon: 'clock',
        unread: false,
    },
]

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

const variantDot: Record<Notification['variant'], string> = {
    red: 'bg-status-red',
    amber: 'bg-status-amber',
    grey: 'bg-brand-gray',
}

const variantBadge: Record<Notification['variant'], string> = {
    red: 'bg-status-red/10 text-status-red',
    amber: 'bg-status-amber/10 text-status-amber',
    grey: 'bg-surface-muted text-brand-gray',
}

function NotifIcon({ icon }: { icon: Notification['icon'] }) {
    if (icon === 'alert') return <AlertTriangle size={14} />
    if (icon === 'trending') return <TrendingDown size={14} />
    return <Clock size={14} />
}

export function Header({ onMenuClick }: HeaderProps) {
    const pathname = usePathname()
    const { user } = useAuth()
    const title = deriveTitle(pathname)

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [selected, setSelected] = useState<Notification | null>(null)
    const [notifications, setNotifications] = useState(NOTIFICATIONS)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const unreadCount = notifications.filter((n) => n.unread).length

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function openNotification(n: Notification) {
        setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, unread: false } : x))
        setSelected(n)
        setDropdownOpen(false)
    }

    return (
        <>
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
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setDropdownOpen((o) => !o)}
                            className="relative rounded-lg p-2 cursor-pointer text-brand-gray transition-colors hover:bg-surface-muted hover:text-foreground"
                            aria-label="Notifications"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-status-red text-[10px] font-bold text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-surface-border bg-surface shadow-lg">
                                <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
                                    <p className="text-sm font-semibold">Notifications</p>
                                    {unreadCount > 0 && (
                                        <span className="rounded-full bg-status-red/10 px-2 py-0.5 text-xs font-medium text-status-red">
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                                <ul className="divide-y divide-surface-border">
                                    {notifications.map((n) => (
                                        <li key={n.id}>
                                            <button
                                                type="button"
                                                onClick={() => openNotification(n)}
                                                className="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted"
                                            >
                                                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? variantDot[n.variant] : 'bg-transparent'}`} />
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium">{n.title}</p>
                                                    <p className="mt-0.5 truncate text-xs text-brand-gray">{n.summary}</p>
                                                    <p className="mt-1 text-[10px] text-brand-gray">{n.time}</p>
                                                </div>
                                                <span className={`mt-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${variantBadge[n.variant]}`}>
                                                    <NotifIcon icon={n.icon} />
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* <div className="flex min-w-0 items-center gap-2">
                        <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline md:max-w-none">
                            {user?.name}
                        </span>
                        <Badge variant="green" className="max-w-[100px] truncate text-xs sm:max-w-none sm:text-sm">
                            {user?.role.name}
                        </Badge>
                    </div> */}
                </div>
            </header>

            <Modal
                open={!!selected}
                onClose={() => setSelected(null)}
                title={
                    selected && (
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${variantBadge[selected.variant]}`}>
                                <NotifIcon icon={selected.icon} />
                                {selected.variant === 'red' ? 'Critical' : selected.variant === 'amber' ? 'Warning' : 'Info'}
                            </span>
                            <span className="text-xs text-brand-gray">{selected.time}</span>
                        </div>
                    )
                }
                footer={
                    <button
                        type="button"
                        onClick={() => setSelected(null)}
                        className="w-full rounded-lg bg-surface-muted py-2 text-sm font-medium transition-colors hover:bg-surface-border"
                    >
                        Dismiss
                    </button>
                }
            >
                {selected && (
                    <>
                        <h2 className="text-base font-semibold">{selected.title}</h2>
                        <p className="mt-3 text-sm leading-relaxed text-brand-gray">{selected.detail}</p>
                    </>
                )}
            </Modal>
        </>
    )
}
