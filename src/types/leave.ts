export type LeaveType = 'paid' | 'unpaid' | 'sick' | 'training' | 'maternity' | 'bereavement'
export type LeaveRequestStatus = 'pending' | 'approved' | 'blocked' | 'cancelled'

export interface LeaveRequest {
    id: string
    agentId: string
    type: LeaveType
    startDate: string
    endDate: string
    daysRequested: number
    status: LeaveRequestStatus
    blockReason?: string
    alternativeDates?: string[]
    approvedBy?: string
}

export interface LeaveCapacityWeek {
    weekNumber: number
    startDate: string
    slotsAvailable: number
    slotsUsed: number
    slotsRemaining: number
    status: 'green' | 'amber' | 'red'
    volumeForecastDelta: number
    smartPushActive: boolean
}

export interface BradfordEntry {
    agentId: string
    spells: number
    totalDays: number
    score: number
    threshold: 'green' | 'amber' | 'red' | 'critical'
    patterns: {
        mondayFridayClustering: boolean
        prePostHoliday: boolean
        frequencyFlag: boolean
    }
    sickDays: { date: string; dayOfWeek: string; spell: number }[]
}
