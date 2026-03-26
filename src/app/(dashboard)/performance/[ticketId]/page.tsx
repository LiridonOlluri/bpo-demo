'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { ProductivityTicketView } from '@/components/organisms/ProductivityTicket'
import type { ProductivityTicket } from '@/types/ticket'
import type { FteLossTeamSummary } from '@/types/fteLoss'

const TICKET_DATA: Record<string, { ticket: ProductivityTicket; fteLoss: FteLossTeamSummary }> = {
    'tkt-001': {
        fteLoss: {
            teamId: 'team-b', teamName: 'Team B', teamLeadName: 'Marcus Jones',
            nominalFtes: 10, effectiveFtes: 4.05, totalLoss: 5.95, lossPercentage: 59.5,
            dailyCostImpact: 238, monthlyCostProjection: 5236,
            clientAttribution: [{ clientId: 'client-a', clientName: 'Client A', fteLost: 3.2, slaImpact: 12 }],
            categories: [
                { category: 'aht', label: 'AHT overrun (6.8 vs 5.0 min)', fteLost: 2.7, percentageOfNominal: 27, priority: 1 },
                { category: 'adherence', label: 'Adherence gaps (83% vs 92%)', fteLost: 1.07, percentageOfNominal: 10.7, priority: 2 },
                { category: 'absence', label: 'Unplanned absence (1 agent sick)', fteLost: 1.0, percentageOfNominal: 10, priority: 3 },
                { category: 'acw', label: 'ACW overrun (78s vs 45s)', fteLost: 0.9, percentageOfNominal: 9, priority: 4 },
                { category: 'breaks', label: 'Break overruns (avg +7 min)', fteLost: 0.21, percentageOfNominal: 2.1, priority: 5 },
                { category: 'tardiness', label: 'Tardiness (2 agents, avg 12 min)', fteLost: 0.07, percentageOfNominal: 0.7, priority: 6 },
            ],
            trend: 'worsening',
        },
        ticket: {
            id: 'tkt-001', teamId: 'team-b', teamLeadId: 'tl-002',
            createdAt: '2026-03-25T08:12:00Z', priority: 'critical', status: 'open',
            trigger: 'Team B FTE Loss 59.5% — AHT overrun 2.7 FTE, adherence gaps 1.1 FTE. Threshold >30% auto-ticket.',
            fteLossSummary: null as never,
            rootCauseAnalysis: [
                'AHT at 6.8 min vs 5.0 target — 4 agents handling new product enquiries without updated training materials.',
                'ACW overrun (78s vs 45s) — CRM form has a new mandatory field slowing post-call wrap.',
                'Extended breaks (+7 min avg) — morning shift pattern indicates agents not returning on time.',
                'Schedule adherence 83% vs 92% target — 3 agents in extended personal AUX during peak 10:00–12:00.',
                'Unplanned absence: 1 agent sick, not yet backfilled for afternoon shift.',
            ],
            suggestedActions: [
                'Brief 4 agents on new product lines — prioritise knowledge base update (Training team ticket).',
                'Raise CRM form issue with IT — request pre-fill or streamlined mandatory field.',
                'Issue break compliance reminder; set break monitor alert for this team.',
                'Review AUX usage patterns with TL Marcus Jones; coach 3 agents on adherence.',
                'Request replacement agent from OT pool for afternoon gap.',
            ],
            isRecurring: false,
        },
    },
    'tkt-006': {
        fteLoss: {
            teamId: 'team-b', teamName: 'Team B', teamLeadName: 'Marcus Jones',
            nominalFtes: 10, effectiveFtes: 7.5, totalLoss: 2.5, lossPercentage: 25,
            dailyCostImpact: 100, monthlyCostProjection: 2200,
            clientAttribution: [{ clientId: 'client-a', clientName: 'Client A', fteLost: 2.5, slaImpact: 5 }],
            categories: [
                { category: 'adherence', label: 'Schedule adherence <80%', fteLost: 2.0, percentageOfNominal: 20, priority: 1 },
                { category: 'tardiness', label: 'Tardiness (recurring pattern)', fteLost: 0.5, percentageOfNominal: 5, priority: 2 },
            ],
            trend: 'worsening',
        },
        ticket: {
            id: 'tkt-006', teamId: 'team-b', teamLeadId: 'tl-002',
            createdAt: '2026-03-25T06:00:00Z', priority: 'high', status: 'open',
            trigger: 'Team B schedule adherence <80% — 3rd occurrence in 14 days. Recurring flag triggered.',
            fteLossSummary: null as never,
            rootCauseAnalysis: [
                'Adherence pattern has been below 80% on 3 separate occasions in the past 14 days.',
                'Previous verbal warnings given on March 10 and March 18 — no sustained improvement.',
                'Pattern suggests systemic issue with shift start compliance, not isolated incidents.',
                'Agent mix on this team has 3 agents who individually scored <75% adherence this week.',
            ],
            suggestedActions: [
                'Escalate to Ops Manager — TL coaching alone has not resolved recurring behaviour.',
                'Issue written warning to top 3 non-compliant agents (2nd formal step in PIP process).',
                'Consider schedule adjustment: move 2 agents to earlier shift start to improve monitoring.',
                'Weekly check-in: adherence target review every Monday with TL Marcus Jones.',
            ],
            isRecurring: true,
        },
    },
}

const FALLBACK_FTE_LOSS: FteLossTeamSummary = {
    teamId: 'team-x', teamName: 'Team', teamLeadName: 'Team Lead',
    nominalFtes: 10, effectiveFtes: 8.5, totalLoss: 1.5, lossPercentage: 15,
    dailyCostImpact: 60, monthlyCostProjection: 1320,
    clientAttribution: [], categories: [], trend: 'stable',
}

export default function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
    const { ticketId } = React.use(params)
    const record = TICKET_DATA[ticketId]
    const fteLoss = record?.fteLoss ?? FALLBACK_FTE_LOSS
    const ticket: ProductivityTicket = record
        ? { ...record.ticket, fteLossSummary: fteLoss }
        : {
              id: ticketId, teamId: 'team-x', teamLeadId: 'tl-x',
              createdAt: new Date().toISOString(), priority: 'medium', status: 'open',
              trigger: `Ticket ${ticketId}`,
              fteLossSummary: fteLoss,
              rootCauseAnalysis: ['Detail not available for this ticket in demo.'],
              suggestedActions: ['Review team metrics and coach accordingly.'],
              isRecurring: false,
          }

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
