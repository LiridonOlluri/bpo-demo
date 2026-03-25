export type Channel = 'voice' | 'chat' | 'email' | 'back-office'
export type BillingModel = 'per-minute' | 'per-fte' | 'fixed' | 'hybrid'

export interface ClientConfig {
    id: string
    name: string
    industry: string
    channel: Channel
    agentsAssigned: number
    slaTarget: { percentage: number; seconds: number }
    ahtTarget: number
    acwTarget: number
    dailyVolume: number
    peakHours: string[]
    occupancyTarget: number
    occupancyCap: number
    chatConcurrency?: number
    requiredCertifications: string[]
    billingModel: BillingModel
    operatingHours: { start: string; end: string }
}
