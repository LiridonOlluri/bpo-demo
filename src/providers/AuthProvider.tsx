'use client'

import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User, AccessLevel } from '@/types/roles'
import type { Session } from '@supabase/supabase-js'
import { DEMO_ROLES } from '@/lib/demoRoles'

interface AuthContextType {
    user: User | null
    session: Session | null
    switchRole: (level: AccessLevel) => void
    login: (email: string, password: string) => Promise<{ error?: string }>
    logout: () => Promise<void>
    isAuthenticated: boolean
    isLoading: boolean
    selectedRole: AccessLevel | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

function buildUser(session: Session, level: AccessLevel): User {
    const meta = session.user.user_metadata ?? {}
    const name = [meta.name ?? 'TruDev', meta.surname ?? 'User'].join(' ')
    return {
        id: session.user.id,
        name,
        email: session.user.email ?? '',
        role: DEMO_ROLES[level],
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [selectedRole, setSelectedRole] = useState<AccessLevel | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Restore session on mount
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session: s } }) => {
            setSession(s)
            if (s) {
                const savedRole = localStorage.getItem('bpo-demo-role')
                if (savedRole) {
                    const level = Number(savedRole) as AccessLevel
                    setSelectedRole(level)
                    setUser(buildUser(s, level))
                }
            }
            setIsLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
            setSession(s)
            if (!s) {
                setUser(null)
                setSelectedRole(null)
                localStorage.removeItem('bpo-demo-role')
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return { error: error.message }
        // Don't set user yet — wait for role selection
        return {}
    }, [])

    const logout = useCallback(async () => {
        await supabase.auth.signOut()
        setUser(null)
        setSession(null)
        setSelectedRole(null)
        localStorage.removeItem('bpo-demo-role')
    }, [])

    const switchRole = useCallback((level: AccessLevel) => {
        setSelectedRole(level)
        localStorage.setItem('bpo-demo-role', String(level))
        if (session) {
            setUser(buildUser(session, level))
        }
    }, [session])

    const isAuthenticated = !!session && !!selectedRole && !!user

    return (
        <AuthContext.Provider value={{ user, session, switchRole, login, logout, isAuthenticated, isLoading, selectedRole }}>
            {children}
        </AuthContext.Provider>
    )
}
