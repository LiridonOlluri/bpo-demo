import type { AccessLevel, Role } from '@/types/roles'

/** Demo role definitions — keep in sync with sidebar `module` keys and first-route logic. */
export const DEMO_ROLES: Record<AccessLevel, Role> = {
    1: {
        id: 'role-1',
        name: 'Agent Associate',
        level: 1,
        modules: ['attendance', 'payroll', 'leave', 'training'],
        permissions: {
            attendance: ['view'],
            payroll: ['view'],
            leave: ['view', 'edit'],
            training: ['view'],
        },
    },
    2: {
        id: 'role-2',
        name: 'Team Lead',
        level: 2,
        modules: ['attendance', 'workforce', 'performance', 'quality', 'leave', 'payroll'],
        permissions: {
            attendance: ['view', 'edit'],
            workforce: ['view'],
            performance: ['view', 'edit'],
            quality: ['view', 'edit'],
            leave: ['view', 'approve'],
            payroll: ['view'],
        },
    },
    3: {
        id: 'role-3',
        name: 'Operations Manager',
        level: 3,
        modules: ['attendance', 'workforce', 'performance', 'quality', 'leave', 'payroll', 'hr', 'clients', 'compliance'],
        permissions: {
            attendance: ['view', 'edit', 'approve'],
            workforce: ['view', 'edit', 'approve'],
            performance: ['view', 'edit', 'approve'],
            leave: ['view', 'edit', 'approve'],
            payroll: ['view', 'approve'],
            hr: ['view', 'edit'],
        },
    },
    4: {
        id: 'role-4',
        name: 'Operations Manager',
        level: 4,
        modules: ['attendance', 'workforce', 'performance', 'quality', 'leave', 'payroll', 'hr', 'clients', 'compliance'],
        permissions: {
            '*': ['view', 'edit', 'approve', 'admin'],
        },
    },
    5: {
        id: 'role-5',
        name: 'Executive',
        level: 5,
        modules: ['overview', 'clients', 'workforce', 'attendance', 'performance', 'quality', 'payroll', 'billing', 'hr', 'compliance', 'training', 'settings'],
        permissions: {
            '*': ['view', 'edit', 'approve', 'admin'],
        },
    },
}

/** Maps a role module id to the default dashboard path (first segment matches Sidebar). */
const MODULE_HOME: Record<string, string> = {
    overview: '/overview',
    clients: '/clients',
    workforce: '/workforce',
    attendance: '/attendance',
    performance: '/performance',
    quality: '/quality',
    payroll: '/payroll',
    billing: '/billing',
    hr: '/hr',
    training: '/training',
    compliance: '/compliance',
    settings: '/settings',
    leave: '/attendance/leave',
}

/** Landing route after login / for `/` — first module the role may access (Executive → overview). */
export function getRoleHomePath(level: AccessLevel): string {
    const modules = DEMO_ROLES[level].modules
    for (const m of modules) {
        const path = MODULE_HOME[m]
        if (path) return path
    }
    return '/attendance'
}
