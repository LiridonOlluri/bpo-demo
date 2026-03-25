import type { ExecutiveClientFilter, ExecutivePeriod } from '@/types/executive'

const CLIENTS = new Set(['all', 'client-a', 'client-b'])
const PERIODS = new Set<ExecutivePeriod>(['today', 'wow', 'mom'])

export function parseExecutiveClient(s: string | null): ExecutiveClientFilter {
    if (s === 'client-a' || s === 'client-b' || s === 'all') return s
    return 'all'
}

export function parseExecutivePeriod(s: string | null): ExecutivePeriod {
    if (s === 'today' || s === 'wow' || s === 'mom') return s
    return 'wow'
}

export function isValidExecutiveQuery(client: string | null, period: string | null): boolean {
    if (client !== null && client !== '' && !CLIENTS.has(client)) return false
    if (period !== null && period !== '' && !PERIODS.has(period as ExecutivePeriod)) return false
    return true
}
