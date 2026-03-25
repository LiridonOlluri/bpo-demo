export interface LiveMetrics {
    timestamp: string
    interval: string
    serviceLevel: number
    callsInQueue: number
    occupancy: number
    ahtCurrent: number
    ahtTarget: number
    acwCurrent: number
    acwTarget: number
    abandonmentRate: number
    asa: number
    adherence: number
    agentsScheduled: number
    agentsLoggedIn: number
    shrinkagePlanned: number
    shrinkageActual: number
}

export interface TeamLeadScore {
    teamLeadId: string
    teamLeadName: string
    ticketsTotal: number
    ticketsResolved: number
    ticketsRecurring: number
    avgResponseMinutes: number
    resolutionRate: number
}
