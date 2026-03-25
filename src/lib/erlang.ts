import type { ErlangInput, ErlangOutput } from '@/types/erlang'

function erlangC(agents: number, trafficIntensity: number): number {
    if (agents <= trafficIntensity) return 1.0
    let sum = 1.0
    for (let i = 1; i < agents; i++) {
        let term = 1.0
        for (let j = 1; j <= i; j++) term *= trafficIntensity / j
        sum += term
    }
    let lastTerm = 1.0
    for (let j = 1; j <= agents; j++) lastTerm *= trafficIntensity / j
    const pw = (lastTerm / (1 - trafficIntensity / agents)) /
        (sum + lastTerm / (1 - trafficIntensity / agents))
    return pw
}

export function calculateErlangC(input: ErlangInput): ErlangOutput {
    const { callsPerInterval, ahtSeconds, intervalMinutes, serviceLevelTarget,
        serviceLevelSeconds, shrinkagePercent, maxOccupancy } = input

    const trafficIntensity = (callsPerInterval * ahtSeconds) / (intervalMinutes * 60)
    let agents = Math.ceil(trafficIntensity) + 1
    let sl = 0, pw = 0, asa = 0, occupancy = 0

    while (agents < 200) {
        pw = erlangC(agents, trafficIntensity)
        sl = 1 - pw * Math.exp(-(agents - trafficIntensity) * serviceLevelSeconds / ahtSeconds)
        asa = (pw * ahtSeconds) / (agents - trafficIntensity)
        occupancy = trafficIntensity / agents
        if (sl >= serviceLevelTarget && occupancy <= maxOccupancy) break
        agents++
    }

    const scheduledStaff = Math.ceil(agents / (1 - shrinkagePercent))

    return {
        trafficIntensityErlangs: trafficIntensity,
        baseStaffRequired: agents,
        scheduledStaffRequired: scheduledStaff,
        projectedServiceLevel: sl,
        projectedOccupancy: occupancy,
        projectedASA: Math.round(asa),
        probabilityOfWaiting: pw,
    }
}
