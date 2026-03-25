'use client'

import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { StatCard } from '@/components/molecules/StatCard'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'

// Audit log matching demo scenarios
const auditLog = [
    { id: 'aud-001', timestamp: '2026-03-25T10:15:00Z', user: 'System', action: 'Auto-ticket TKT-042 generated — Team B FTE Loss >30% (59.5%)', severity: 'warning' },
    { id: 'aud-002', timestamp: '2026-03-25T07:12:00Z', user: 'System', action: 'Tardiness recorded: Priya Sharma (7 min), Quinn Davis (12 min) — payroll deduction flagged', severity: 'info' },
    { id: 'aud-003', timestamp: '2026-03-25T07:10:00Z', user: 'System', action: 'NCNS alert: Ryan Costa — escalation to TL Marcus Jones triggered', severity: 'warning' },
    { id: 'aud-004', timestamp: '2026-03-25T07:05:00Z', user: 'System', action: 'Early shift attendance: 15/18 on-time (83%). SL projection recalculated.', severity: 'info' },
    { id: 'aud-005', timestamp: '2026-03-24T16:45:00Z', user: 'Laura Mitchell', action: 'Approved overtime for 2 agents (Team B) to cover SLA gap — cost allocated to Client A P&L', severity: 'info' },
    { id: 'aud-006', timestamp: '2026-03-24T14:30:00Z', user: 'Rachel Adams', action: 'Updated Bradford Factor exclusion: added pregnancy-related absence for agent a08', severity: 'info' },
    { id: 'aud-007', timestamp: '2026-03-24T09:30:00Z', user: 'System', action: 'Bradford Factor alert: Ryan Costa score 186 — return-to-work interview required', severity: 'warning' },
    { id: 'aud-008', timestamp: '2026-03-23T13:10:00Z', user: 'System', action: 'Max weekly hours check: all agents within 48h limit (EU Working Time Directive)', severity: 'info' },
    { id: 'aud-009', timestamp: '2026-03-23T10:00:00Z', user: 'System', action: 'Minimum rest between shifts validated: no violations detected', severity: 'info' },
    { id: 'aud-010', timestamp: '2026-03-22T15:20:00Z', user: 'Rachel Adams', action: 'Contract renewal — annex signed for agents a05, a06, a07 (6-month extension)', severity: 'info' },
]

const severityVariant: Record<string, 'green' | 'amber' | 'red' | 'grey'> = {
    info: 'grey',
    warning: 'amber',
    critical: 'red',
}

// 5-level role hierarchy from documentation
const roleHierarchy = [
    {
        level: 5,
        name: 'System Admin / Executive',
        roles: ['CEO', 'COO', 'CTO', 'System Administrator'],
        users: 1,
        permissions: 'Full platform access. Configuration, integrations, role management, global dashboards.',
    },
    {
        level: 4,
        name: 'Department Heads',
        roles: ['HR Director', 'Finance Director', 'Operations Director'],
        users: 0,
        permissions: 'Department-wide visibility. Can manage Level 3, 2, and 1 within their department.',
    },
    {
        level: 3,
        name: 'Quality/Ops/Account Managers',
        roles: ['Operations Manager', 'Account Manager', 'HR Manager', 'Quality Manager'],
        users: 6,
        permissions: 'Multi-team/multi-client oversight. Escalation handling, schedule approval, overtime auth.',
    },
    {
        level: 2,
        name: 'Team Leads + SMEs',
        roles: ['Team Lead', 'Senior Agent/SME', 'QA Lead', 'Training Lead'],
        users: 10,
        permissions: 'Team dashboard, individual member detail, coaching tasks, leave requests.',
    },
    {
        level: 1,
        name: 'Individual Contributors',
        roles: ['Agent Associate', 'QA Associate', 'HR Assistant', 'Finance Clerk'],
        users: 100,
        permissions: 'Own data only: schedule, payslip, QA scores, coaching history, KB.',
    },
]

export default function CompliancePage() {
    const warnings = auditLog.filter(e => e.severity === 'warning').length
    const criticals = auditLog.filter(e => e.severity === 'critical').length

    return (
        <DashboardTemplate
            title="Compliance & Audit"
            statCards={
                <>
                    <StatCard label="Audit Entries (7d)" value={auditLog.length} />
                    <StatCard label="Warnings" value={warnings} variant="amber" />
                    <StatCard label="Critical Events" value={criticals} variant={criticals > 0 ? 'red' : 'default'} />
                    <StatCard label="Access Levels" value={5} />
                    <StatCard label="Labour Law Checks" value="All Pass" variant="green" />
                    <StatCard label="Contract Renewals Due" value={3} variant="amber" />
                </>
            }
        >
            <div className="space-y-6">
                {/* Labour law compliance */}
                <Card>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray mb-3">Auto-Compliance Checks</h2>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="rounded-lg border border-status-green/30 bg-status-green/5 p-3">
                            <p className="font-medium text-status-green">Max Weekly Hours (48h)</p>
                            <p className="text-xs text-brand-gray mt-1">All 50 agents within EU Working Time Directive limit</p>
                        </div>
                        <div className="rounded-lg border border-status-green/30 bg-status-green/5 p-3">
                            <p className="font-medium text-status-green">Minimum Rest (11h between shifts)</p>
                            <p className="text-xs text-brand-gray mt-1">No violations detected this week</p>
                        </div>
                        <div className="rounded-lg border border-status-amber/30 bg-status-amber/5 p-3">
                            <p className="font-medium text-status-amber">Contract Expiry (30-day window)</p>
                            <p className="text-xs text-brand-gray mt-1">3 agents due for annex renewal by 25 Apr 2026</p>
                        </div>
                    </div>
                </Card>

                {/* Audit log */}
                <Card padding={false}>
                    <div className="p-4 border-b border-surface-border">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Recent Audit Log</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                    <th className="p-4 font-medium">Timestamp</th>
                                    <th className="p-4 font-medium">User</th>
                                    <th className="p-4 font-medium">Action</th>
                                    <th className="p-4 font-medium">Severity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLog.map((entry) => (
                                    <tr key={entry.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                        <td className="p-4 font-mono text-xs whitespace-nowrap">
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-4">{entry.user}</td>
                                        <td className="p-4">{entry.action}</td>
                                        <td className="p-4">
                                            <Badge variant={severityVariant[entry.severity]}>{entry.severity.toUpperCase()}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* 5-level role hierarchy */}
                <Card padding={false}>
                    <div className="p-4 border-b border-surface-border">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Role Hierarchy — 5 Access Levels</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                    <th className="p-4 font-medium">Level</th>
                                    <th className="p-4 font-medium">Name</th>
                                    <th className="p-4 font-medium">Default Roles</th>
                                    <th className="p-4 font-medium text-right">Users</th>
                                    <th className="p-4 font-medium">Permissions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roleHierarchy.map((r) => (
                                    <tr key={r.level} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                        <td className="p-4">
                                            <Badge variant={r.level >= 4 ? 'green' : r.level >= 3 ? 'blue' : r.level >= 2 ? 'amber' : 'grey'}>
                                                L{r.level}
                                            </Badge>
                                        </td>
                                        <td className="p-4 font-medium">{r.name}</td>
                                        <td className="p-4 text-xs text-brand-gray">{r.roles.join(', ')}</td>
                                        <td className="p-4 text-right font-medium">{r.users}</td>
                                        <td className="p-4 text-xs text-brand-gray max-w-xs">{r.permissions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardTemplate>
    )
}
