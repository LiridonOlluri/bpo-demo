'use client'

import { AgentStatusDot } from '@/components/molecules/AgentStatusDot'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'

type AttendanceStatus = 'on-time' | 'late' | 'absent' | 'ncns' | 'on-leave' | 'not-started'

interface AgentAttendance {
    id: string
    name: string
    status: AttendanceStatus
    auxCode?: string
    tardiness?: number
}

interface AttendanceGridProps {
    agents: AgentAttendance[]
}

const STATUS_DOT_COLOR: Record<AttendanceStatus, 'green' | 'amber' | 'red' | 'grey'> = {
    'on-time': 'green',
    'late': 'amber',
    'absent': 'red',
    'ncns': 'red',
    'on-leave': 'grey',
    'not-started': 'grey',
}

const STATUS_BADGE_VARIANT: Record<AttendanceStatus, 'green' | 'amber' | 'red' | 'grey'> = {
    'on-time': 'green',
    'late': 'amber',
    'absent': 'red',
    'ncns': 'red',
    'on-leave': 'grey',
    'not-started': 'grey',
}

const STATUS_LABELS: Record<AttendanceStatus, string> = {
    'on-time': 'On Time',
    'late': 'Late',
    'absent': 'Absent',
    'ncns': 'NCNS',
    'on-leave': 'On Leave',
    'not-started': 'Not Started',
}

function countByStatus(agents: AgentAttendance[]) {
    const counts: Partial<Record<AttendanceStatus, number>> = {}
    for (const a of agents) {
        counts[a.status] = (counts[a.status] ?? 0) + 1
    }
    return counts
}

export function AttendanceGrid({ agents }: AttendanceGridProps) {
    const counts = countByStatus(agents)

    return (
        <div className="space-y-4">
            {/* Summary bar */}
            <div className="flex flex-wrap gap-2">
                {(Object.keys(STATUS_LABELS) as AttendanceStatus[]).map((status) => {
                    const count = counts[status]
                    if (!count) return null
                    return (
                        <Badge key={status} variant={STATUS_BADGE_VARIANT[status]}>
                            {STATUS_LABELS[status]}: {count}
                        </Badge>
                    )
                })}
                <Badge variant="grey">Total: {agents.length}</Badge>
            </div>

            {/* Grid */}
            <Card>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {agents.map((agent) => (
                        <AgentStatusDot
                            key={agent.id}
                            name={agent.name}
                            status={STATUS_DOT_COLOR[agent.status]}
                            subtitle={
                                agent.status === 'late' && agent.tardiness
                                    ? `${agent.tardiness}m late`
                                    : agent.auxCode
                                        ? agent.auxCode
                                        : STATUS_LABELS[agent.status]
                            }
                        />
                    ))}
                </div>
            </Card>
        </div>
    )
}
