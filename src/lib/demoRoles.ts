import type { AccessLevel, Role } from '@/types/roles'

/**
 * Demo role definitions — mirrors the meTru ERP BPO 5-level hierarchy:
 *
 * L1 — Individual Contributors (Agent Associate, QA Associate, HR Assistant)
 *      Created by HR. Sees own data only.
 *
 * L2 — Team Leads + SMEs
 *      Team real-time dashboard, coaching Kanban, attendance panel, FTE loss widget.
 *
 * L3 — Ops Manager | Account Manager | QA Manager | HR Manager
 *      Multi-team oversight, schedule approval, OT auth, client SLA, billing,
 *      quality, leave capacity, employee lifecycle, payroll oversight.
 *
 * L4 — Department Heads (Finance Director | HR Director | Ops Director | Marketing Director)
 *      Full department visibility, salary data access, billing, admin controls.
 *
 * L5 — Executive / System Admin (CEO | COO | CTO | System Admin)
 *      Full platform access including executive overview.
 */
export const DEMO_ROLES: Record<AccessLevel, Role> = {
    1: {
        id: 'role-1',
        name: 'Agent Associate',
        level: 1,
        modules: ['home', 'attendance', 'performance', 'payroll', 'training'],
        permissions: {
            home: ['view'],
            attendance: ['view', 'edit'],
            performance: ['view'],
            payroll: ['view'],
            training: ['view'],
        },
    },
    2: {
        id: 'role-2',
        name: 'Team Lead',
        level: 2,
        modules: ['home', 'coaching', 'attendance', 'my-team-ops', 'performance', 'quality', 'payroll'],
        permissions: {
            home: ['view'],
            coaching: ['view', 'edit', 'approve'],
            attendance: ['view', 'edit', 'approve'],
            'my-team-ops': ['view'],
            performance: ['view', 'edit'],
            quality: ['view', 'edit'],
            payroll: ['view'],
        },
    },
    3: {
        id: 'role-3',
        name: 'Ops Manager / Account Manager',
        level: 3,
        modules: ['attendance', 'workforce', 'performance', 'quality', 'leave', 'payroll', 'billing', 'hr', 'clients', 'compliance'],
        permissions: {
            attendance: ['view', 'edit', 'approve'],
            workforce: ['view', 'edit', 'approve'],
            performance: ['view', 'edit', 'approve'],
            quality: ['view', 'edit', 'approve'],
            leave: ['view', 'edit', 'approve'],
            payroll: ['view', 'approve'],
            billing: ['view'],
            hr: ['view', 'edit'],
            clients: ['view', 'edit'],
            compliance: ['view'],
        },
    },
    4: {
        id: 'role-4',
        name: 'Department Head',
        level: 4,
        modules: ['attendance', 'workforce', 'performance', 'quality', 'leave', 'payroll', 'billing', 'hr', 'clients', 'compliance', 'training', 'settings'],
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
    home: '/home',
    overview: '/overview',
    clients: '/clients',
    coaching: '/coaching',
    workforce: '/workforce',
    'my-team-ops': '/my-team-ops',
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
    return '/home'
}
