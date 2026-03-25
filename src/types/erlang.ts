export interface ErlangInput {
    callsPerInterval: number
    ahtSeconds: number
    intervalMinutes: number
    serviceLevelTarget: number
    serviceLevelSeconds: number
    shrinkagePercent: number
    maxOccupancy: number
}

export interface ErlangOutput {
    trafficIntensityErlangs: number
    baseStaffRequired: number
    scheduledStaffRequired: number
    projectedServiceLevel: number
    projectedOccupancy: number
    projectedASA: number
    probabilityOfWaiting: number
}
