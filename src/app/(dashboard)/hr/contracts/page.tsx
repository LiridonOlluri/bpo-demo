'use client'

import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'

const mockContracts = [
    { agent: 'Ana Lopez', type: 'Permanent', start: '2024-06-01', end: '—', probationEnd: '2024-12-01', status: 'active' },
    { agent: 'Ben Carter', type: 'Permanent', start: '2025-01-15', end: '—', probationEnd: '2025-07-15', status: 'active' },
    { agent: 'Clara Reyes', type: 'Fixed-Term', start: '2025-09-01', end: '2026-04-01', probationEnd: '2026-03-01', status: 'expiring' },
    { agent: 'David Kim', type: 'Fixed-Term', start: '2025-10-01', end: '2026-04-15', probationEnd: '2026-04-01', status: 'expiring' },
    { agent: 'Elena Rossi', type: 'Permanent', start: '2025-03-01', end: '—', probationEnd: '2025-09-01', status: 'active' },
    { agent: 'Farid Hassan', type: 'Probationary', start: '2026-01-15', end: '2026-07-15', probationEnd: '2026-07-15', status: 'probation' },
    { agent: 'Grace Tan', type: 'Permanent', start: '2024-09-01', end: '—', probationEnd: '2025-03-01', status: 'active' },
    { agent: 'Hugo Mendez', type: 'Fixed-Term', start: '2025-06-01', end: '2026-06-01', probationEnd: '2025-12-01', status: 'active' },
]

const statusVariant: Record<string, 'green' | 'amber' | 'blue' | 'grey'> = {
    active: 'green',
    expiring: 'amber',
    probation: 'blue',
    expired: 'grey',
}

export default function ContractsPage() {
    return (
        <DashboardTemplate title="Contract Management">
            <Card padding={false}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                <th className="p-4 font-medium">Agent</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Start</th>
                                <th className="p-4 font-medium">End</th>
                                <th className="p-4 font-medium">Probation End</th>
                                <th className="p-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockContracts.map((c) => (
                                <tr key={c.agent} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                    <td className="p-4 font-medium">{c.agent}</td>
                                    <td className="p-4">{c.type}</td>
                                    <td className="p-4">{c.start}</td>
                                    <td className="p-4">{c.end}</td>
                                    <td className="p-4">{c.probationEnd}</td>
                                    <td className="p-4">
                                        <Badge variant={statusVariant[c.status]}>{c.status.toUpperCase()}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </DashboardTemplate>
    )
}
