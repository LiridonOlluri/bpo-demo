'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getRoleHomePath } from '@/lib/demoRoles'
import { Spinner } from '@/components/atoms/Spinner'

export default function Home() {
    const router = useRouter()
    const { isAuthenticated, isLoading, user } = useAuth()

    useEffect(() => {
        if (isLoading) return
        if (!isAuthenticated || !user) {
            router.replace('/login')
            return
        }
        router.replace(getRoleHomePath(user.role.level))
    }, [isLoading, isAuthenticated, user, router])

    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <Spinner size={32} />
        </div>
    )
}
