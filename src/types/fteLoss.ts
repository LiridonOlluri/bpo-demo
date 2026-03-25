export interface FteLossCategory {
    category: 'aht' | 'acw' | 'breaks' | 'tardiness' | 'adherence' | 'absence'
    label: string
    fteLost: number
    percentageOfNominal: number
    rootCause?: string
    priority: number
}

export interface FteLossTeamSummary {
    teamId: string
    teamName: string
    teamLeadName: string
    nominalFtes: number
    effectiveFtes: number
    totalLoss: number
    lossPercentage: number
    dailyCostImpact: number
    monthlyCostProjection: number
    clientAttribution: { clientId: string; clientName: string; fteLost: number; slaImpact: number }[]
    categories: FteLossCategory[]
    trend: 'improving' | 'stable' | 'worsening'
}
