'use client'

import React, { useState } from 'react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface Role {
    name: string
    level: number
    modules: string[]
    permissionCount: number
    permissions: string[]
}

const mockRoles: Role[] = [
    {
        name: 'Super Admin',
        level: 0,
        modules: ['All Modules'],
        permissionCount: 48,
        permissions: ['manage:users', 'manage:roles', 'manage:settings', 'manage:billing', 'manage:clients', 'approve:payroll', 'view:audit-log', 'delete:records'],
    },
    {
        name: 'Operations Manager',
        level: 1,
        modules: ['Performance', 'Workforce', 'Attendance', 'Payroll', 'Clients', 'HR'],
        permissionCount: 36,
        permissions: ['view:all-teams', 'manage:tickets', 'approve:overtime', 'approve:leave', 'view:payroll', 'manage:schedules', 'approve:payroll'],
    },
    {
        name: 'Team Lead',
        level: 2,
        modules: ['Performance', 'Attendance', 'Workforce'],
        permissionCount: 18,
        permissions: ['view:own-team', 'acknowledge:tickets', 'manage:breaks', 'approve:leave:own-team', 'view:fte-loss:own-team'],
    },
    {
        name: 'WFM Analyst',
        level: 2,
        modules: ['Workforce', 'Attendance', 'Performance'],
        permissionCount: 22,
        permissions: ['manage:schedules', 'manage:erlang', 'view:all-teams', 'export:reports', 'manage:leave-calendar'],
    },
    {
        name: 'Agent',
        level: 3,
        modules: ['Self-Service'],
        permissionCount: 6,
        permissions: ['view:own-schedule', 'request:leave', 'view:own-payslip', 'view:own-attendance', 'view:own-qa-scores'],
    },
]

const levelBadge: Record<number, 'red' | 'amber' | 'blue' | 'grey'> = {
    0: 'red',
    1: 'amber',
    2: 'blue',
    3: 'grey',
}

export default function RolesPage() {
    const [expanded, setExpanded] = useState<string | null>(null)

    return (
        <DashboardTemplate title="Role Management">
            <Card padding={false}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                <th className="p-4 font-medium w-8"></th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Level</th>
                                <th className="p-4 font-medium">Modules</th>
                                <th className="p-4 font-medium">Permissions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockRoles.map((role) => {
                                const isExpanded = expanded === role.name
                                return (
                                    <React.Fragment key={role.name}>
                                        <tr
                                            className="border-b border-surface-border hover:bg-surface-muted/50 cursor-pointer"
                                            onClick={() => setExpanded(isExpanded ? null : role.name)}
                                        >
                                            <td className="p-4">
                                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            </td>
                                            <td className="p-4 font-medium">{role.name}</td>
                                            <td className="p-4">
                                                <Badge variant={levelBadge[role.level]}>{role.level}</Badge>
                                            </td>
                                            <td className="p-4 text-brand-gray">{role.modules.join(', ')}</td>
                                            <td className="p-4">{role.permissionCount}</td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="bg-surface-muted/30">
                                                <td colSpan={5} className="p-4 pl-12">
                                                    <div className="flex flex-wrap gap-2">
                                                        {role.permissions.map((perm) => (
                                                            <Badge key={perm} variant="blue">{perm}</Badge>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </DashboardTemplate>
    )
}
