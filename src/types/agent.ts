import type { Channel } from './client'

export interface Agent {
    id: string
    name: string
    teamId: string
    teamLeadId: string
    clientId: string
    channel: Channel
    contractType: 'fixed-6m' | 'permanent'
    contractStart: string
    contractEnd: string
    probationEnd?: string
    salary: number
    overtimeRate: number
    nightDifferential: number
    certifications: string[]
    leaveEntitlement: number
    leaveUsed: number
    leaveRemaining: number
    rampPhase?: 'classroom' | 'nesting' | 'guided' | 'production'
    rampEfficiency?: number
    bradfordScore: number
    status: 'active' | 'on-leave' | 'terminated' | 'onboarding'
}
