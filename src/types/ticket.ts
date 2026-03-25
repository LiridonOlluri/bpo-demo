import type { FteLossTeamSummary } from './fteLoss'

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'
export type TicketStatus = 'open' | 'acknowledged' | 'action-taken' | 'follow-up' | 'resolved' | 'recurring'

export interface ProductivityTicket {
    id: string
    teamId: string
    teamLeadId: string
    createdAt: string
    acknowledgedAt?: string
    resolvedAt?: string
    priority: TicketPriority
    status: TicketStatus
    trigger: string
    fteLossSummary: FteLossTeamSummary
    rootCauseAnalysis: string[]
    suggestedActions: string[]
    actionTaken?: string
    actionCategory?: 'coaching' | 'schedule-adjustment' | 'agent-reassignment' | 'hr-escalation' | 'it-ticket' | 'other'
    followUpDate?: string
    followUpResult?: 'improved' | 'not-improved' | 'pending'
    isRecurring: boolean
    escalatedTo?: string
}
