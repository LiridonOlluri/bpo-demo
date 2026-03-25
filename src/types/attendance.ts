export type AttendanceStatus = 'on-time' | 'late' | 'absent' | 'ncns' | 'on-leave' | 'not-started'
export type AuxCode = 'ready' | 'on-call' | 'wrap-up' | 'break' | 'lunch' | 'meeting' |
    'coaching' | 'training' | 'personal' | 'system-down' | 'project'

export interface AttendanceEvent {
    agentId: string
    date: string
    scheduledStart: string
    scheduledEnd: string
    actualClockIn?: string
    actualClockOut?: string
    status: AttendanceStatus
    tardinessMinutes: number
    earlyDepartureMinutes: number
    overtimeMinutes: number
    breakOverrunMinutes: number
    currentAuxCode?: AuxCode
    auxHistory: { code: AuxCode; start: string; end?: string; duration: number }[]
}

export interface AttendanceSummary {
    totalScheduled: number
    totalLoggedIn: number
    onTimeRate: number
    lateCount: number
    absentCount: number
    ncnsCount: number
}
