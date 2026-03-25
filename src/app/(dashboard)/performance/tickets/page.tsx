'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { StatCard } from '@/components/molecules/StatCard'
import { TabGroup } from '@/components/molecules/TabGroup'
import { TicketCard } from '@/components/molecules/TicketCard'

const statusTabs = [
    { id: 'all', label: 'All', count: 5 },
    { id: 'open', label: 'Open', count: 1 },
    { id: 'acknowledged', label: 'Acknowledged', count: 1 },
    { id: 'resolved', label: 'Resolved', count: 2 },
    { id: 'recurring', label: 'Recurring', count: 1 },
]

const mockTickets = [
    {
        id: 'tkt-001-abc',
        priority: 'critical' as const,
        status: 'open',
        trigger: 'Team B FTE Loss exceeds 30% — daily cost impact $880+',
        createdAt: '2026-03-25T08:12:00Z',
    },
    {
        id: 'tkt-002-def',
        priority: 'high' as const,
        status: 'acknowledged',
        trigger: 'Team D tardiness spike — 6 agents late >15 min consecutively',
        createdAt: '2026-03-24T14:30:00Z',
    },
    {
        id: 'tkt-003-ghi',
        priority: 'medium' as const,
        status: 'resolved',
        trigger: 'Team A AHT exceeded 5:30 for 3 consecutive intervals',
        createdAt: '2026-03-22T09:45:00Z',
    },
    {
        id: 'tkt-004-jkl',
        priority: 'low' as const,
        status: 'resolved',
        trigger: 'Team C break adherence below 90% threshold',
        createdAt: '2026-03-21T11:20:00Z',
    },
    {
        id: 'tkt-005-mno',
        priority: 'high' as const,
        status: 'recurring',
        trigger: 'Team B schedule adherence <80% — recurring 3rd time in 14 days',
        createdAt: '2026-03-25T06:00:00Z',
    },
]

export default function TicketsPage() {
    const [activeTab, setActiveTab] = useState('all')
    const router = useRouter()

    const filtered = activeTab === 'all' ? mockTickets : mockTickets.filter((t) => t.status === activeTab)

    return (
        <DashboardTemplate
            title="Productivity Tickets"
            statCards={
                <>
                    <StatCard label="Open" value={1} variant="red" />
                    <StatCard label="Acknowledged" value={1} variant="amber" />
                    <StatCard label="Resolved" value={2} variant="green" />
                    <StatCard label="Recurring" value={1} variant="red" />
                </>
            }
        >
            <TabGroup tabs={statusTabs} activeTab={activeTab} onChange={setActiveTab} />

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((ticket) => (
                    <TicketCard
                        key={ticket.id}
                        id={ticket.id}
                        priority={ticket.priority}
                        status={ticket.status}
                        trigger={ticket.trigger}
                        createdAt={ticket.createdAt}
                        onClick={() => router.push(`/performance/${ticket.id}`)}
                    />
                ))}
            </div>
        </DashboardTemplate>
    )
}
