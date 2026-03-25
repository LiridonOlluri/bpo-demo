import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { CalendarCheck, User } from 'lucide-react'
import type { LeaveCapacityWeek } from '@/types/leave'

interface SuggestedAgent {
    name: string
    leaveBalance: number
}

interface SmartLeavePushProps {
    week: LeaveCapacityWeek
    suggestedAgents: SuggestedAgent[]
    onRelease?: () => void
}

export function SmartLeavePush({ week, suggestedAgents, onRelease }: SmartLeavePushProps) {
    const deltaAbs = Math.abs(week.volumeForecastDelta).toFixed(0)

    return (
        <Card className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CalendarCheck size={16} className="text-brand-green" />
                    <h3 className="text-sm font-semibold">Smart Leave Push</h3>
                </div>
                <Badge variant={week.status}>Week {week.weekNumber}</Badge>
            </div>

            <p className="text-sm text-brand-gray">
                Volume is <span className="font-medium text-foreground">{deltaAbs}% below forecast</span> for
                the week starting {week.startDate}. We recommend releasing{' '}
                <span className="font-medium text-foreground">{week.slotsRemaining} extra leave slots</span> to
                reduce cost without impacting SLA.
            </p>

            <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-brand-gray">Suggested Agents</p>
                {suggestedAgents.map((agent) => (
                    <div key={agent.name} className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2">
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-brand-gray" />
                            <span className="text-sm">{agent.name}</span>
                        </div>
                        <Badge variant="blue">{agent.leaveBalance}d balance</Badge>
                    </div>
                ))}
            </div>

            <Button onClick={onRelease} className="w-full">
                Release Slots
            </Button>
        </Card>
    )
}
