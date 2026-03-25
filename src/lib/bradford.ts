export interface BradfordInput {
    spells: number
    totalDays: number
}

export function calculateBradford(input: BradfordInput): number {
    return input.spells * input.spells * input.totalDays
}

export function getBradfordThreshold(score: number): 'green' | 'amber' | 'red' | 'critical' {
    if (score >= 650) return 'critical'
    if (score >= 400) return 'red'
    if (score >= 125) return 'amber'
    return 'green'
}
