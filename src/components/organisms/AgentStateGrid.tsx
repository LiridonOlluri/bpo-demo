'use client'

import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/atoms/Tooltip'

type AgentState = 'active' | 'late' | 'sick' | 'ncns' | 'on-leave' | 'scheduled'

interface AgentTile {
    id: number
    name: string
    team: string
    state: AgentState
    minutesLate?: number
}

const STATE_CONFIG: Record<AgentState, { bg: string; label: string; pulse?: boolean }> = {
    active: { bg: 'bg-status-green', label: 'Active' },
    late: { bg: 'bg-status-amber', label: 'Late', pulse: true },
    sick: { bg: 'bg-yellow-400', label: 'Sick' },
    ncns: { bg: 'bg-status-red', label: 'NCNS', pulse: true },
    'on-leave': { bg: 'bg-blue-400', label: 'On Leave' },
    scheduled: { bg: 'bg-surface-border', label: 'Scheduled' },
}

function buildAgentGrid(active: number, leave: number, sick: number, late: number, ncns: number): AgentTile[] {
    const teams = ['Team A','Team B','Team C','Team D','Team E','Team F','Team G','Team H','Team I','Team J']
    const names = [
        'Alice M','Ben C','Clara S','Daniel R','Ella B','Frank O','Grace K','Hasan A','Isla N','James P',
        'Karen M','Liam O','Maya J','Nina K','Oscar T','Priya S','Quinn D','Ryan C','Sara L','Tom N',
        'Uma P','Vera K','Will H','Xena T','Yuki M','Zoe A','Aaron B','Beth C','Cole D','Diana E',
        'Evan F','Fay G','Gus H','Hana I','Ivan J','Jade K','Kyle L','Luna M','Matt N','Nova O',
        'Owen P','Petra Q','Quinn R','Rosa S','Sam T','Tina U','Ursa V','Vince W','Wren X','Xander Y',
        'Yana Z','Zack A','Anna B','Boris C','Cleo D','Dean E','Echo F','Finn G','Gina H','Hugo I',
        'Iris J','Jack K','Kira L','Leon M','Mia N','Noel O','Opal P','Pete Q','Quin R','Ruth S',
        'Seth T','Tara U','Ugo V','Vita W','Wade X','Xia Y','Yara Z','Zeus A','Alma B','Beau C',
        'Cara D','Duke E','Elsa F','Fern G','Glen H','Hope I','Indy J','Joel K','Kate L','Lore M',
        'Mack N','Nell O','Orla P','Phil Q','Riva R','Skip S','Thea T','Umar U','Val V','Wes W',
    ]
    const total = 100
    const scheduled = total - active - leave - sick - late - ncns
    const distribution: AgentState[] = [
        ...Array(active).fill('active'),
        ...Array(late).fill('late'),
        ...Array(sick).fill('sick'),
        ...Array(ncns).fill('ncns'),
        ...Array(leave).fill('on-leave'),
        ...Array(Math.max(0, scheduled)).fill('scheduled'),
    ]
    return Array.from({ length: total }, (_, i) => ({
        id: i + 1,
        name: names[i] ?? `Agent ${i + 1}`,
        team: teams[Math.floor(i / 10)] ?? 'Team A',
        state: distribution[i] ?? 'scheduled',
        minutesLate: distribution[i] === 'late' ? [7, 12, 8, 15][i % 4] : undefined,
    }))
}

const STATE_LEGEND: AgentState[] = ['active', 'late', 'sick', 'ncns', 'on-leave', 'scheduled']

interface AgentStateGridProps {
    active: number
    leave: number
    sick: number
    late: number
    ncns: number
}

export function AgentStateGrid({ active, leave, sick, late, ncns }: AgentStateGridProps) {
    const tiles = buildAgentGrid(active, leave, sick, late, ncns)

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
                {STATE_LEGEND.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 text-xs text-brand-gray">
                        <span className={cn('inline-block h-2.5 w-2.5 rounded-sm', STATE_CONFIG[s].bg)} />
                        {STATE_CONFIG[s].label}
                    </span>
                ))}
            </div>
            <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1">
                {tiles.map((tile) => {
                    const cfg = STATE_CONFIG[tile.state]
                    return (
                        <Tooltip
                            key={tile.id}
                            content={`${tile.name} · ${tile.team} · ${cfg.label}${tile.minutesLate ? ` (${tile.minutesLate} min late)` : ''}`}
                        >
                            <div
                                className={cn(
                                    'h-4 w-full rounded-sm',
                                    cfg.bg,
                                    cfg.pulse && 'animate-pulse'
                                )}
                            />
                        </Tooltip>
                    )
                })}
            </div>
            <p className="text-[11px] text-brand-gray">100 agents · hover for detail · updates every 30 s (demo)</p>
        </div>
    )
}
