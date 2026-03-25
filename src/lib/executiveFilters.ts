import type { FteLossTeamSummary } from '@/types/fteLoss'
import type { TeamLeadScore } from '@/types/performance'
import type { ExecutiveClientFilter } from '@/types/executive'

export function filterTeamsByClient(teams: FteLossTeamSummary[], f: ExecutiveClientFilter): FteLossTeamSummary[] {
    if (f === 'all') return teams
    const needle = f === 'client-a' ? 'Client A' : 'Client B'
    return teams.filter((t) => t.teamName.includes(needle))
}

export function filterTlScoresByClient(
    teams: FteLossTeamSummary[],
    scores: TeamLeadScore[],
    f: ExecutiveClientFilter
): TeamLeadScore[] {
    if (f === 'all') return scores
    const names = new Set(filterTeamsByClient(teams, f).map((t) => t.teamLeadName))
    return scores.filter((s) => names.has(s.teamLeadName))
}
