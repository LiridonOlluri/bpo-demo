'use client'

import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { LeaveSlotIndicator } from '@/components/molecules/LeaveSlotIndicator'
import type { LeaveCapacityWeek } from '@/types/leave'

interface LeaveCapacityCalendarProps {
    weeks: LeaveCapacityWeek[]
}

const borderColors = {
    green: 'border-status-green',
    amber: 'border-status-amber',
    red: 'border-status-red',
}

export function LeaveCapacityCalendar({ weeks }: LeaveCapacityCalendarProps) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {weeks.map((week) => (
                <Card
                    key={week.weekNumber}
                    className={`border-l-4 ${borderColors[week.status]}`}
                >
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">W{week.weekNumber}</span>
                            {week.smartPushActive && (
                                <Badge variant="blue">Smart Push</Badge>
                            )}
                        </div>

                        <p className="text-xs text-brand-gray">{week.startDate}</p>

                        <LeaveSlotIndicator
                            slotsUsed={week.slotsUsed}
                            slotsAvailable={week.slotsRemaining}
                            status={week.status}
                        />

                        <div className="flex items-center justify-between text-xs">
                            <span className="text-brand-gray">Remaining</span>
                            <span className="font-medium">{week.slotsRemaining} slots</span>
                        </div>

                        {week.volumeForecastDelta !== 0 && (
                            <p className="text-[10px] text-brand-gray">
                                Volume forecast:{' '}
                                <span className={week.volumeForecastDelta > 0 ? 'text-status-red' : 'text-status-green'}>
                                    {week.volumeForecastDelta > 0 ? '+' : ''}
                                    {week.volumeForecastDelta}%
                                </span>
                            </p>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    )
}
