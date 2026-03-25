'use client'

import { useState } from 'react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { SearchInput } from '@/components/molecules/SearchInput'
import { StatCard } from '@/components/molecules/StatCard'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'

// Demo roster sample (spec: 100 agents + 10 TLs + Ops/AM/HR). Full org in Settings → Teams.
const mockEmployees = [
    // Team A (Client A - Voice)
    { id: 'a01', name: 'Alice Monroe', role: 'Agent', level: 1, team: 'Team A', client: 'Client A', contract: '6-month fixed', status: 'active' },
    { id: 'a02', name: 'Ben Carter', role: 'Agent', level: 1, team: 'Team A', client: 'Client A', contract: '6-month fixed', status: 'active' },
    { id: 'a03', name: 'Clara Singh', role: 'Agent', level: 1, team: 'Team A', client: 'Client A', contract: '6-month fixed', status: 'active' },
    { id: 'a04', name: 'Daniel Reyes', role: 'Agent', level: 1, team: 'Team A', client: 'Client A', contract: '6-month fixed', status: 'active' },
    // Team B (Client A - Voice)
    { id: 'a05', name: 'Ella Brooks', role: 'Agent', level: 1, team: 'Team B', client: 'Client A', contract: '6-month fixed', status: 'active' },
    { id: 'a06', name: 'Frank Osei', role: 'Agent', level: 1, team: 'Team B', client: 'Client A', contract: '6-month fixed', status: 'active' },
    { id: 'a07', name: 'Grace Kim', role: 'Agent', level: 1, team: 'Team B', client: 'Client A', contract: '6-month fixed', status: 'active' },
    { id: 'a08', name: 'Hasan Ali', role: 'Agent', level: 1, team: 'Team B', client: 'Client A', contract: '6-month fixed', status: 'on-leave' },
    // Team C (Client A - Voice)
    { id: 'a09', name: 'Isla Novak', role: 'Agent', level: 1, team: 'Team C', client: 'Client A', contract: '6-month fixed', status: 'active' },
    { id: 'a10', name: 'James Patel', role: 'Agent', level: 1, team: 'Team C', client: 'Client A', contract: '6-month fixed', status: 'active' },
    { id: 'a11', name: 'Karen Müller', role: 'Agent', level: 1, team: 'Team C', client: 'Client A', contract: '6-month fixed', status: 'active' },
    // Team D (Client A - Voice)
    { id: 'a12', name: "Liam O'Brien", role: 'Agent', level: 1, team: 'Team D', client: 'Client A', contract: '6-month fixed', status: 'active' },
    { id: 'a13', name: 'Maya Johnson', role: 'Agent', level: 1, team: 'Team D', client: 'Client A', contract: '6-month fixed', status: 'active' },
    { id: 'a14', name: 'Nina Kowalski', role: 'Agent', level: 1, team: 'Team D', client: 'Client A', contract: '6-month fixed', status: 'probation' },
    // Team E (Client B - Chat)
    { id: 'a15', name: 'Oscar Tran', role: 'Agent', level: 1, team: 'Team E', client: 'Client B', contract: '6-month fixed', status: 'active' },
    { id: 'a16', name: 'Priya Sharma', role: 'Agent', level: 1, team: 'Team E', client: 'Client B', contract: '6-month fixed', status: 'active' },
    { id: 'a17', name: 'Quinn Davis', role: 'Agent', level: 1, team: 'Team E', client: 'Client B', contract: '6-month fixed', status: 'active' },
    { id: 'a18', name: 'Ryan Costa', role: 'Agent', level: 1, team: 'Team B', client: 'Client A', contract: '6-month fixed', status: 'active' },
    // Team Leads (Level 2 - non-production)
    { id: 'tl-001', name: 'Sarah Chen', role: 'Team Lead', level: 2, team: 'Team A', client: 'Client A', contract: 'Permanent', status: 'active' },
    { id: 'tl-002', name: 'Marcus Jones', role: 'Team Lead', level: 2, team: 'Team B', client: 'Client A', contract: 'Permanent', status: 'active' },
    { id: 'tl-003', name: 'Priya Patel', role: 'Team Lead', level: 2, team: 'Team C', client: 'Client A', contract: 'Permanent', status: 'active' },
    { id: 'tl-004', name: 'James Wilson', role: 'Team Lead', level: 2, team: 'Team D', client: 'Client A', contract: 'Permanent', status: 'active' },
    { id: 'tl-005', name: 'Amara Okafor', role: 'Team Lead', level: 2, team: 'Team E', client: 'Client B', contract: 'Permanent', status: 'active' },
    // Level 3+
    { id: 'om-001', name: 'Laura Mitchell', role: 'Operations Manager', level: 3, team: '—', client: 'All', contract: 'Permanent', status: 'active' },
    { id: 'am-001', name: 'Tom Nguyen', role: 'Account Manager', level: 3, team: '—', client: 'Client A', contract: 'Permanent', status: 'active' },
    { id: 'am-002', name: 'Sophie Laurent', role: 'Account Manager', level: 3, team: '—', client: 'Client B', contract: 'Permanent', status: 'active' },
    { id: 'hr-001', name: 'Rachel Adams', role: 'HR Manager', level: 3, team: '—', client: 'All', contract: 'Permanent', status: 'active' },
]

const statusVariant: Record<string, 'green' | 'amber' | 'blue' | 'grey'> = {
    active: 'green',
    'on-leave': 'amber',
    probation: 'blue',
    offboarded: 'grey',
}

const levelLabel: Record<number, string> = {
    1: 'L1 — IC',
    2: 'L2 — Team Lead',
    3: 'L3 — Manager',
    4: 'L4 — Director',
    5: 'L5 — Executive',
}

export default function HrPage() {
    const [search, setSearch] = useState('')
    const filtered = mockEmployees.filter(
        (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.role.toLowerCase().includes(search.toLowerCase()) ||
            e.team.toLowerCase().includes(search.toLowerCase()) ||
            e.client.toLowerCase().includes(search.toLowerCase())
    )

    const activeCount = mockEmployees.filter(e => e.status === 'active').length
    const onLeaveCount = mockEmployees.filter(e => e.status === 'on-leave').length
    const probationCount = mockEmployees.filter(e => e.status === 'probation').length

    return (
        <DashboardTemplate
            title="Human Resources"
            statCards={
                <>
                    <StatCard label="Total Headcount" value={mockEmployees.length} variant="default" />
                    <StatCard label="Production Agents" value={18} variant="green" />
                    <StatCard label="Team Leads" value={5} variant="default" />
                    <StatCard label="On Leave" value={onLeaveCount} variant={onLeaveCount > 0 ? 'amber' : 'default'} />
                    <StatCard label="Probation" value={probationCount} variant={probationCount > 0 ? 'amber' : 'default'} />
                    <StatCard label="Contract Type" value="6-month fixed" variant="default" />
                </>
            }
        >
            <div className="space-y-4">
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, role, team, or client..."
                    containerClassName="max-w-md"
                />

                <Card padding={false}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                    <th className="p-4 font-medium">ID</th>
                                    <th className="p-4 font-medium">Name</th>
                                    <th className="p-4 font-medium">Role</th>
                                    <th className="p-4 font-medium">Level</th>
                                    <th className="p-4 font-medium">Team</th>
                                    <th className="p-4 font-medium">Client</th>
                                    <th className="p-4 font-medium">Contract</th>
                                    <th className="p-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((emp) => (
                                    <tr key={emp.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                        <td className="p-4 font-mono text-xs">{emp.id}</td>
                                        <td className="p-4 font-medium">{emp.name}</td>
                                        <td className="p-4">{emp.role}</td>
                                        <td className="p-4"><Badge variant="grey">{levelLabel[emp.level]}</Badge></td>
                                        <td className="p-4">{emp.team}</td>
                                        <td className="p-4">{emp.client}</td>
                                        <td className="p-4 text-xs">{emp.contract}</td>
                                        <td className="p-4">
                                            <Badge variant={statusVariant[emp.status]}>{emp.status.replace('-', ' ').toUpperCase()}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* HR KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <p className="text-xs text-brand-gray">Attrition Rate (Annual)</p>
                        <p className="text-2xl font-bold">12%</p>
                        <p className="text-xs text-brand-gray">6 departures / 50 avg headcount</p>
                    </Card>
                    <Card>
                        <p className="text-xs text-brand-gray">Cost of Attrition (per departure)</p>
                        <p className="text-2xl font-bold">€2,400</p>
                        <p className="text-xs text-brand-gray">Recruiting + training + ramp loss</p>
                    </Card>
                    <Card>
                        <p className="text-xs text-brand-gray">Avg Tenure</p>
                        <p className="text-2xl font-bold">14 months</p>
                        <p className="text-xs text-brand-gray">Across all production agents</p>
                    </Card>
                    <Card>
                        <p className="text-xs text-brand-gray">Burnout Risk Score</p>
                        <p className="text-2xl font-bold text-status-amber">3 agents</p>
                        <p className="text-xs text-brand-gray">OT + QA drops + absence pattern</p>
                    </Card>
                </div>

                <AiFeatureLock title="Predictive Attrition & Culture-Fit Score" description="AI identifies agents at risk of leaving based on behaviour patterns, engagement signals, and peer benchmarks" />
            </div>
        </DashboardTemplate>
    )
}
