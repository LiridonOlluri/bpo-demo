import type { FteLossCategory, FteLossTeamSummary } from '@/types/fteLoss'

interface FteLossInput {
    teamId: string
    teamName: string
    teamLeadName: string
    nominalFtes: number
    ahtCurrent: number
    ahtTarget: number
    acwCurrent: number
    acwTarget: number
    adherence: number
    absentAgents: number
    tardinessMinutes: number
    breakOverrunMinutes: number
    avgSalary: number
}

export function calculateFteLoss(input: FteLossInput): FteLossTeamSummary {
    const {
        teamId, teamName, teamLeadName, nominalFtes,
        ahtCurrent, ahtTarget, acwCurrent, acwTarget,
        adherence, absentAgents, tardinessMinutes, breakOverrunMinutes, avgSalary,
    } = input

    const ahtFteLost = ahtCurrent > ahtTarget
        ? nominalFtes * ((ahtCurrent - ahtTarget) / ahtCurrent) : 0

    const acwFteLost = acwCurrent > acwTarget
        ? nominalFtes * 0.1 * ((acwCurrent - acwTarget) / acwCurrent) : 0

    const absenceFteLost = absentAgents
    const tardinessFteLost = (tardinessMinutes / 60) / 8
    const breaksFteLost = (breakOverrunMinutes / 60) / 8
    const adherenceFteLost = nominalFtes * (1 - Math.min(adherence, 0.92)) * 1.5

    const totalLoss = ahtFteLost + acwFteLost + absenceFteLost +
        tardinessFteLost + breaksFteLost + adherenceFteLost
    const effectiveFtes = Math.max(nominalFtes - totalLoss, 0)
    const lossPercentage = (totalLoss / nominalFtes) * 100

    const hourlyRate = avgSalary / (22 * 8)
    const dailyCostImpact = totalLoss * hourlyRate * 8

    const categories: FteLossCategory[] = [
        { category: 'aht', label: 'AHT Overrun', fteLost: ahtFteLost, percentageOfNominal: (ahtFteLost / nominalFtes) * 100, priority: 1, rootCause: ahtFteLost > 1 ? 'Agents handling new product enquiries without training' : undefined },
        { category: 'adherence', label: 'Adherence Gap', fteLost: adherenceFteLost, percentageOfNominal: (adherenceFteLost / nominalFtes) * 100, priority: 2, rootCause: adherenceFteLost > 0.5 ? 'Agents in extended personal AUX' : undefined },
        { category: 'absence', label: 'Absence', fteLost: absenceFteLost, percentageOfNominal: (absenceFteLost / nominalFtes) * 100, priority: 3 },
        { category: 'breaks', label: 'Break Overruns', fteLost: breaksFteLost, percentageOfNominal: (breaksFteLost / nominalFtes) * 100, priority: 3 },
        { category: 'acw', label: 'ACW Overrun', fteLost: acwFteLost, percentageOfNominal: (acwFteLost / nominalFtes) * 100, priority: 4, rootCause: acwFteLost > 0.5 ? 'CRM form has new mandatory field slowing wrap-up' : undefined },
        { category: 'tardiness', label: 'Tardiness', fteLost: tardinessFteLost, percentageOfNominal: (tardinessFteLost / nominalFtes) * 100, priority: 4 },
    ]

    return {
        teamId,
        teamName,
        teamLeadName,
        nominalFtes,
        effectiveFtes,
        totalLoss,
        lossPercentage,
        dailyCostImpact,
        monthlyCostProjection: dailyCostImpact * 22,
        clientAttribution: [],
        categories: categories.sort((a, b) => a.priority - b.priority),
        trend: lossPercentage > 30 ? 'worsening' : lossPercentage < 15 ? 'improving' : 'stable',
    }
}
