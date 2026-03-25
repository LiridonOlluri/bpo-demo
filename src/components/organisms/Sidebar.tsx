'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useRole } from '@/hooks/useRole'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Building2,
    Users,
    Clock,
    BarChart3,
    ShieldCheck,
    Wallet,
    Receipt,
    UserCog,
    GraduationCap,
    Scale,
    Settings,
    LogOut,
    ArrowLeftRight,
} from 'lucide-react'

const NAV_ITEMS = [
    { label: 'Overview', href: '/overview', icon: LayoutDashboard, module: 'overview' },
    { label: 'Clients', href: '/clients', icon: Building2, module: 'clients' },
    { label: 'Workforce', href: '/workforce', icon: Users, module: 'workforce' },
    { label: 'Attendance', href: '/attendance', icon: Clock, module: 'attendance' },
    { label: 'Performance', href: '/performance', icon: BarChart3, module: 'performance' },
    { label: 'Quality', href: '/quality', icon: ShieldCheck, module: 'quality' },
    { label: 'Payroll', href: '/payroll', icon: Wallet, module: 'payroll' },
    { label: 'Billing', href: '/billing', icon: Receipt, module: 'billing' },
    { label: 'HR', href: '/hr', icon: UserCog, module: 'hr' },
    { label: 'Training', href: '/training', icon: GraduationCap, module: 'training' },
    { label: 'Compliance', href: '/compliance', icon: Scale, module: 'compliance' },
    { label: 'Settings', href: '/settings', icon: Settings, module: 'settings' },
] as const

interface SidebarProps {
    onNavigate?: () => void
}

function NavLink({
    href,
    label,
    Icon,
    isActive,
    onClick,
}: {
    href: string
    label: string
    Icon: typeof LayoutDashboard
    isActive: boolean
    onClick?: () => void
}) {
    return (
        <li>
            <Link
                href={href}
                onClick={onClick}
                className={cn(
                    'flex items-center gap-3 rounded-full px-3 py-2.5 text-[13px] font-medium transition-colors',
                    isActive
                        ? 'bg-zinc-900 text-white shadow-sm'
                        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
                )}
            >
                <Icon className="shrink-0" size={18} strokeWidth={1.5} />
                <span className="min-w-0 truncate">{label}</span>
            </Link>
        </li>
    )
}

export function Sidebar({ onNavigate }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuth()
    const { canView } = useRole()

    const visible = NAV_ITEMS.filter((item) => canView(item.module))

    const handleChangeRole = () => {
        localStorage.removeItem('bpo-demo-role')
        window.location.href = '/login'
    }

    const handleLogout = async () => {
        await logout()
        router.push('/login')
    }

    const close = () => onNavigate?.()

    return (
        <div className="flex h-full w-full flex-col bg-white">
            <div className="flex items-center gap-3 px-4 pb-1 pt-5 sm:px-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                    M
                </div>
                <div className="min-w-0 leading-tight">
                    <p className="truncate text-[15px] font-bold tracking-tight text-zinc-900">
                        meTru ERP<span className="font-semibold text-zinc-600"> - BPO</span>
                    </p>
                </div>
            </div>

            <nav className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-2 pt-5">
                {visible.length > 0 && (
                    <ul className="space-y-1">
                        {visible.map((item) => (
                            <NavLink
                                key={item.href}
                                href={item.href}
                                label={item.label}
                                Icon={item.icon}
                                isActive={pathname.startsWith(item.href)}
                                onClick={close}
                            />
                        ))}
                    </ul>
                )}
            </nav>

            <div className="mt-auto border-t border-zinc-100 px-4 py-4">
                <button
                    type="button"
                    onClick={() => {
                        handleChangeRole()
                        close()
                    }}
                    className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-[13px] font-semibold text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50"
                >
                    <ArrowLeftRight size={16} strokeWidth={1.5} />
                    Change role
                </button>
                <div className="rounded-xl bg-zinc-50 px-3 py-2.5">
                    <p className="truncate text-sm font-medium text-zinc-900">{user?.name}</p>
                    <p className="truncate text-xs text-zinc-500">{user?.role.name}</p>
                </div>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut size={16} strokeWidth={1.5} />
                    Log out
                </button>
            </div>
        </div>
    )
}
