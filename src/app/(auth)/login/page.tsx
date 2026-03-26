'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { Label } from '@/components/atoms/Label'
import { Card } from '@/components/atoms/Card'
import { Spinner } from '@/components/atoms/Spinner'
import type { AccessLevel } from '@/types/roles'
import { getRoleHomePath } from '@/lib/demoRoles'
import { Shield, Users, Briefcase, Settings, BarChart3, LogIn, Mail, Lock } from 'lucide-react'

const ROLES: {
    level: AccessLevel
    name: string
    subRoles?: string
    description: string
    icon: typeof Shield
}[] = [
        {
            level: 1,
            name: 'Agent Associate',
            subRoles: 'Also: QA Associate, HR Assistant',
            description: 'View own schedule (3 weeks), attendance, payroll, leave balance, missing minutes, training progress. Clock in/out, apply for leave, request shift swaps, bid for OT.',
            icon: Users,
        },
        {
            level: 2,
            name: 'Team Lead',
            subRoles: 'Also: SME (Subject Matter Expert)',
            description: 'Team real-time dashboard, coaching Kanban (productivity/quality), individual agent detail, FTE loss widget, missing minutes per agent, Bradford factor, shift change approvals.',
            icon: Shield,
        },
        {
            level: 3,
            name: 'Ops Manager / Account Manager',
            subRoles: 'Also: QA Manager, HR Manager',
            description: 'Multi-team oversight, schedule approval, OT authorisation, client SLA & billing, leave capacity, quality calibration, employee lifecycle, smart leave push.',
            icon: Briefcase,
        },
        {
            level: 4,
            name: 'Department Head',
            subRoles: 'Finance Director, HR Director, Ops Director, Marketing Director',
            description: 'Full department visibility, salary data access, payroll approval, billing, admin controls. Payroll one-click approve, contract annex review, promotion and termination authority.',
            icon: Settings,
        },
        {
            level: 5,
            name: 'Executive',
            subRoles: 'CEO, COO, CTO, System Admin',
            description: 'Full platform access. Executive overview with company-wide snapshot, cross-client FTE effectiveness, attrition & retention, wallboard, leave liability, and client filter drill-down.',
            icon: BarChart3,
        },
    ]

function MetruLogo({ className }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2.5 sm:gap-3 ${className ?? ''}`}>
            <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green text-base font-bold text-white shadow-sm sm:h-11 sm:w-11 sm:text-lg"
                aria-hidden
            >
                M
            </div>
            <div className="text-left leading-tight">
                <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">meTru ERP - </span>
                <span className="text-lg font-semibold tracking-tight text-brand-gray sm:text-xl">BPO</span>
            </div>
        </div>
    )
}

function WelcomePanel({
    mode,
    desktopSide,
    fillViewportColumn,
}: {
    mode: 'login' | 'roles'
    desktopSide: 'left' | 'right'
    fillViewportColumn?: boolean
}) {
    const desktopRound =
        desktopSide === 'right'
            ? 'lg:rounded-l-[2rem]'
            : 'lg:rounded-r-[2rem]'

    const desktopHeight = fillViewportColumn
        ? 'lg:h-full lg:min-h-0'
        : 'lg:min-h-screen'

    return (
        <div
            className={
                'relative flex flex-col justify-center overflow-hidden bg-brand-dark text-white ' +
                'min-h-[220px] px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))] sm:min-h-[260px] sm:px-8 sm:pb-10 ' +
                'rounded-b-[1.75rem] sm:rounded-b-[2rem] ' +
                `lg:rounded-none ${desktopRound} lg:px-14 lg:py-10 lg:pt-[max(2rem,env(safe-area-inset-top))] lg:pb-10 ${desktopHeight}`
            }
        >
            <div
                className="pointer-events-none absolute -right-10 -top-12 text-[12rem] font-bold leading-none text-white/[0.06] sm:-right-14 sm:-top-16 sm:text-[16rem] lg:-right-16 lg:-top-24 lg:text-[22rem]"
                aria-hidden
            >
                M
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(46,204,113,0.08)_100%)]" />
            <div className="relative z-10 space-y-3 sm:space-y-5 lg:space-y-6">
                <p className="text-xs font-medium text-white/70 sm:text-sm">meTru ERP - BPO</p>
                <h2 className="text-[1.65rem] font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                    {mode === 'login' ? 'Welcome to meTru ERP - BPO' : 'Choose how you explore'}
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                    {mode === 'login'
                        ? 'Workforce, attendance, payroll, and performance in one operations workspace. Sign in to explore the demo with role-based dashboards tailored to your team.'
                        : 'Pick a demo persona to see the right screens and permissions. You can switch again anytime from settings.'}
                </p>
                <p className="text-xs text-white/50 sm:text-sm">
                    {mode === 'login'
                        ? 'Purpose-built for BPO teams who need clarity at scale.'
                        : 'Five levels from agent to executive — each with a realistic slice of the platform.'}
                </p>
            </div>
            <div className="relative z-10 mt-6 rounded-xl border border-white/10 bg-brand-dark-light/80 p-4 backdrop-blur-sm sm:mt-8 sm:rounded-2xl sm:p-5 lg:mt-10">
                <p className="text-sm font-semibold text-white sm:text-base">Operations that stay in sync</p>
                <p className="mt-1 text-xs text-white/65 sm:text-sm">
                    Live metrics, leave capacity, and SLA views — demo data updates like a real floor.
                </p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    const router = useRouter()
    const { login, switchRole, session } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const showRoleSelection = !!session
    const panelOnRight = !showRoleSelection

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        const result = await login(email, password)
        setLoading(false)
        if (result.error) {
            setError(result.error)
        }
    }

    function handleSelectRole(level: AccessLevel) {
        switchRole(level)
        router.push(getRoleHomePath(level))
    }

    const roleDesktopSplit = showRoleSelection

    return (
        <div className="min-h-dvh bg-[#f4f5f7] lg:min-h-screen">
            <div
                className={
                    'flex min-h-dvh flex-col lg:grid lg:grid-cols-2 ' +
                    (roleDesktopSplit
                        ? 'lg:h-[100dvh] lg:max-h-[100dvh] lg:min-h-0 lg:overflow-hidden'
                        : 'lg:min-h-screen')
                }
            >
                {/* Form column: scrolls on small screens; on role desktop only this column scrolls */}
                <div
                    className={
                        'order-2 flex min-h-0 flex-1 flex-col justify-start overflow-y-auto overflow-x-hidden ' +
                        'px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pb-8 sm:pt-8 ' +
                        (roleDesktopSplit
                            ? 'lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-y-contain lg:px-16 lg:py-8 xl:px-20'
                            : 'lg:justify-center lg:overflow-visible lg:px-16 lg:py-12 xl:px-20') +
                        ' ' +
                        (panelOnRight ? 'lg:order-1' : 'lg:order-2')
                    }
                >
                    <div
                        className={
                            'mx-auto w-full max-w-md ' +
                            (showRoleSelection ? 'lg:max-w-lg xl:max-w-xl' : '')
                        }
                    >
                        <MetruLogo />

                        <div className="mt-8 space-y-1.5 sm:mt-10 sm:space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {showRoleSelection ? 'Select a role' : 'Sign in'}
                            </h1>
                            <p className="text-sm text-brand-gray">
                                {showRoleSelection
                                    ? 'Select a role to explore the demo'
                                    : 'Use your credentials to continue'}
                            </p>
                        </div>

                        {!showRoleSelection ? (
                            <form onSubmit={handleLogin} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail
                                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray"
                                            aria-hidden
                                        />
                                        <Input
                                            id="email"
                                            type="email"
                                            inputMode="email"
                                            autoComplete="email"
                                            placeholder="email@gmail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoFocus
                                            className="min-h-11 border-0 bg-white py-2.5 pl-10 pr-3 text-base shadow-sm ring-1 ring-surface-border focus:ring-2 focus:ring-brand-green/40 sm:min-h-0 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock
                                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray"
                                            aria-hidden
                                        />
                                        <Input
                                            id="password"
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="min-h-11 border-0 bg-white py-2.5 pl-10 pr-3 text-base shadow-sm ring-1 ring-surface-border focus:ring-2 focus:ring-brand-green/40 sm:min-h-0 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-brand-gray sm:min-h-0">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="h-4 w-4 shrink-0 rounded border-surface-border text-brand-green focus:ring-brand-green/50"
                                    />
                                    Remember me
                                </label>

                                {error && <p className="text-sm text-status-red">{error}</p>}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-12 w-full min-h-12 rounded-xl bg-foreground text-base text-white hover:bg-foreground/90 focus:ring-foreground/30 sm:h-11 sm:min-h-11 sm:text-sm"
                                >
                                    {loading ? <Spinner size={18} /> : <LogIn size={18} />}
                                    Sign in
                                </Button>

                                <div className="flex flex-col gap-3 pt-1 text-center text-sm sm:flex-row sm:justify-between sm:gap-2 sm:text-left">
                                    <span className="text-brand-gray">
                                        Don&apos;t have an account?{' '}
                                        <button
                                            type="button"
                                            className="font-medium text-foreground underline-offset-4 hover:underline"
                                        >
                                            Sign up
                                        </button>
                                    </span>
                                    <button
                                        type="button"
                                        className="font-medium text-foreground underline-offset-4 hover:underline sm:whitespace-nowrap"
                                    >
                                        Forgot Password
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="mt-6 space-y-2.5 sm:mt-8 sm:space-y-3">
                                {ROLES.map((role) => {
                                    const Icon = role.icon
                                    return (
                                        <button
                                            key={role.level}
                                            type="button"
                                            onClick={() => handleSelectRole(role.level)}
                                            className="w-full text-left active:opacity-90"
                                        >
                                            <Card className="cursor-pointer border-surface-border bg-white shadow-sm transition-all hover:border-brand-green/50 hover:shadow-md active:scale-[0.99]">
                                                <div className="flex items-start gap-3 p-3 sm:gap-4 sm:p-4">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                                                        <Icon size={20} />
                                                    </div>
                                                    <div className="min-w-0 flex-1 space-y-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h2 className="text-sm font-semibold leading-snug">{role.name}</h2>
                                                            <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-xs text-brand-gray">
                                                                Level {role.level}
                                                            </span>
                                                        </div>
                                                        {role.subRoles && (
                                                            <p className="text-[11px] font-medium text-brand-gray/70">{role.subRoles}</p>
                                                        )}
                                                        <p className="text-xs leading-relaxed text-brand-gray">{role.description}</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Brand panel: top on mobile; desktop right (sign-in) or left (role select) */}
                <div
                    className={
                        'order-1 shrink-0 lg:flex lg:flex-col ' +
                        (roleDesktopSplit ? 'lg:h-full lg:min-h-0 lg:overflow-hidden' : 'lg:min-h-0 lg:flex-1') +
                        ' ' +
                        (panelOnRight ? 'lg:order-2' : 'lg:order-1')
                    }
                >
                    <WelcomePanel
                        mode={showRoleSelection ? 'roles' : 'login'}
                        desktopSide={panelOnRight ? 'right' : 'left'}
                        fillViewportColumn={roleDesktopSplit}
                    />
                </div>
            </div>
        </div>
    )
}
