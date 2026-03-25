'use client'

import { ShiftBlock } from '@/components/molecules/ShiftBlock'

interface TimelineBreak {
    start: string
    end: string
    type: 'break'
}

interface TimelineAgent {
    name: string
    shift: {
        start: string
        end: string
        type: 'early' | 'mid' | 'late' | 'custom'
    }
    breaks: TimelineBreak[]
}

interface ScheduleTimelineProps {
    agents: TimelineAgent[]
}

const TIMELINE_START = 7 // 07:00
const TIMELINE_END = 24 // 00:00 next day
const TOTAL_HOURS = TIMELINE_END - TIMELINE_START

function timeToOffset(time: string): number {
    const [h, m] = time.split(':').map(Number)
    const hours = h + m / 60
    return ((hours - TIMELINE_START) / TOTAL_HOURS) * 100
}

function timeToWidth(start: string, end: string): number {
    const s = start.split(':').map(Number)
    const e = end.split(':').map(Number)
    const startH = s[0] + s[1] / 60
    const endH = e[0] + e[1] / 60
    return ((endH - startH) / TOTAL_HOURS) * 100
}

const hourLabels = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
    const h = TIMELINE_START + i
    return h === 24 ? '00:00' : `${String(h).padStart(2, '0')}:00`
})

export function ScheduleTimeline({ agents }: ScheduleTimelineProps) {
    return (
        <div className="overflow-x-auto">
            <div className="min-w-[800px]">
                {/* Time axis */}
                <div className="flex border-b border-surface-border pb-1 mb-2 pl-32">
                    {hourLabels.map((label) => (
                        <div
                            key={label}
                            className="text-[10px] text-brand-gray"
                            style={{ width: `${100 / TOTAL_HOURS}%` }}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                {/* Agent rows */}
                <div className="space-y-1">
                    {agents.map((agent) => (
                        <div key={agent.name} className="flex items-center h-10">
                            <div className="w-32 shrink-0 truncate pr-3 text-xs font-medium">
                                {agent.name}
                            </div>
                            <div className="relative flex-1 h-full bg-surface-muted rounded">
                                {/* Shift block */}
                                <div
                                    className="absolute top-0 h-full"
                                    style={{
                                        left: `${timeToOffset(agent.shift.start)}%`,
                                        width: `${timeToWidth(agent.shift.start, agent.shift.end)}%`,
                                    }}
                                >
                                    <ShiftBlock
                                        type={agent.shift.type}
                                        label={agent.shift.type}
                                        start={agent.shift.start}
                                        end={agent.shift.end}
                                        className="h-full w-full text-[10px]"
                                    />
                                </div>
                                {/* Break blocks */}
                                {agent.breaks.map((brk, i) => (
                                    <div
                                        key={i}
                                        className="absolute top-1 bottom-1"
                                        style={{
                                            left: `${timeToOffset(brk.start)}%`,
                                            width: `${timeToWidth(brk.start, brk.end)}%`,
                                        }}
                                    >
                                        <ShiftBlock
                                            type="break"
                                            label="Break"
                                            start={brk.start}
                                            end={brk.end}
                                            className="h-full w-full text-[10px]"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
