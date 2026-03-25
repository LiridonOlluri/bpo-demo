export type ShiftType = 'early' | 'mid' | 'late' | 'custom'

export interface Shift {
    id: string
    type: ShiftType
    name: string
    start: string
    end: string
    breaks: { start: string; end: string; type: 'paid-break' | 'lunch'; isMoveable: boolean }[]
    agentIds: string[]
}

export interface ScheduleInterval {
    time: string
    requiredAgents: number
    scheduledAgents: number
    actualAgents: number
    gap: number
    serviceLevel: number
    volumeForecast: number
    volumeActual?: number
}
