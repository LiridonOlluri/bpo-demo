'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Sidebar } from '@/components/organisms/Sidebar'
import { Header } from '@/components/organisms/Header'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/atoms/Spinner'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    const [mobileNavOpen, setMobileNavOpen] = useState(false)

    const closeMobileNav = useCallback(() => setMobileNavOpen(false), [])

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login')
        }
    }, [isLoading, isAuthenticated, router])

    useEffect(() => {
        if (!mobileNavOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileNavOpen(false)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [mobileNavOpen])

    useEffect(() => {
        if (mobileNavOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [mobileNavOpen])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Spinner size={32} />
            </div>
        )
    }

    if (!isAuthenticated) return null

    return (
        <div className="min-h-dvh bg-gradient-to-b from-zinc-100 via-white to-zinc-50 lg:min-h-screen">
            {/* Mobile overlay */}
            <button
                type="button"
                aria-label="Close navigation menu"
                className={cn(
                    'fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] transition-opacity lg:hidden',
                    mobileNavOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                )}
                onClick={closeMobileNav}
            />

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-[260px] max-w-[85vw] border-r border-zinc-200/80 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.04)] transition-transform duration-200 ease-out lg:translate-x-0 lg:rounded-r-2xl',
                    mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <Sidebar onNavigate={closeMobileNav} />
            </aside>

            <div className="flex min-h-dvh flex-col pl-0 lg:min-h-screen lg:pl-[260px]">
                <div className="sticky top-0 z-20">
                    <Header onMenuClick={() => setMobileNavOpen(true)} />
                </div>
                <main className="flex-1 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">{children}</main>
            </div>
        </div>
    )
}
