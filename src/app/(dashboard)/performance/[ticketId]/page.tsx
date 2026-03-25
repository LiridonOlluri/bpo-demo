'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { ProductivityTicketView } from '@/components/organisms/ProductivityTicket'
import type { ProductivityTicket } from '@/types/ticket'
import type { FteLossTeamSummary } from '@/types/fteLoss'

const mockFteLoss: FteLossTeamSummary = {
    teamId: 'team-b',
    teamName: 'Team B',
    teamLeadName: 'Marcus Jones',
    nominalFtes: 22,
    effectiveFtes: 14.7,
    totalLoss: 7.3,
    lossPercentage: 33.3,
    dailyCostImpact: 880,
    monthlyCostProjection: 19360,
    clientAttribution: [
        { clientId: 'client-1', clientName: 'Acme Corp', fteLost: 4.4, slaImpact: 3.2 },
        { clientId: 'client-2', clientName: 'Globex Ltd', fteLost: 2.9, slaImpact: 2.1 },
    ],
    categories: [
        { category: 'tardiness', label: 'Tardiness', fteLost: 2.2, percentageOfNominal: 10.0, priority: 1 },
        { category: 'breaks', label: 'Extended Breaks', fteLost: 1.8, percentageOfNominal: 8.3, priority: 2 },
        { category: 'adherence', label: 'Schedule Adherence', fteLost: 1.5, percentageOfNominal: 6.7, priority: 3 },
        { category: 'aht', label: 'High AHT', fteLost: 1.1, percentageOfNominal: 5.0, priority: 4 },
        { category: 'absence', label: 'Absence', fteLost: 0.7, percentageOfNominal: 3.3, priority: 5 },
    ],
    trend: 'worsening',
}

const mockTicket: ProductivityTicket = {
    id: 'tkt-001-abc',
    teamId: 'team-b',
    teamLeadId: 'tl-002',
    createdAt: '2026-03-25T08:12:00Z',
    priority: 'critical',
    status: 'open',
    trigger: 'Team B FTE Loss exceeds 30% — daily cost impact $880+. Threshold breached at 08:12 UTC.',
    fteLossSummary: mockFteLoss,
    rootCauseAnalysis: [
        'Chronic tardiness cluster: 4 agents arriving 15-25 min late on Mon/Tue shifts consistently over past 3 weeks.',
        'Extended breaks averaging 22 min vs 15 min allowance — primarily mid-shift agents (10:00-18:00 cohort).',
        'Schedule adherence dropped from 91% to 78% after roster change on 2026-03-10.',
        'AHT creeping due to new product launch — agents lack updated knowledge base articles.',
        'One agent on extended sick leave (unplanned) not yet backfilled.',
    ],
    suggestedActions: [
        'Issue formal tardiness warnings to 4 identified agents and adjust shift start monitoring.',
        'Schedule coaching session with TL Marcus Jones on break compliance enforcement.',
        'Revert roster changes from 2026-03-10 or re-optimize with Erlang calculator.',
        'Escalate knowledge base gap to Training team — request urgent product update module.',
        'Request HR backfill for absent agent within 48 hours.',
    ],
    isRecurring: false,
}

export default function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
    const { ticketId } = React.use(params)

    const ticket = { ...mockTicket, id: ticketId }

    return (
        <div className="space-y-6">
            <Link href="/performance/tickets">
                <Button variant="ghost" size="sm">
                    <ArrowLeft size={16} />
                    Back to Tickets
                </Button>
            </Link>

            <ProductivityTicketView ticket={ticket} />
        </div>
    )
}
