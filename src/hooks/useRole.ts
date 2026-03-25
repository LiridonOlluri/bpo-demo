'use client'

import { useAuth } from './useAuth'

export function useRole() {
    const { user } = useAuth()
    const level = user?.role.level ?? 1

    return {
        level,
        isAgent: level === 1,
        isTeamLead: level === 2,
        isAccountManager: level === 3,
        isOpsManager: level >= 3,
        isExecutive: level === 5,
        canView: (module: string) => user?.role.modules.includes(module) ?? false,
        canEdit: (module: string) => {
            const perms = user?.role.permissions[module] ?? user?.role.permissions['*'] ?? []
            return perms.includes('edit') || perms.includes('admin')
        },
        canApprove: (module: string) => {
            const perms = user?.role.permissions[module] ?? user?.role.permissions['*'] ?? []
            return perms.includes('approve') || perms.includes('admin')
        },
    }
}
