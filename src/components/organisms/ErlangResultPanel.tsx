import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { DataRow } from '@/components/molecules/DataRow'
import type { ErlangInput, ErlangOutput } from '@/types/erlang'

interface ErlangResultPanelProps {
    input: ErlangInput
    output: ErlangOutput
}

function metricBadge(meets: boolean, value: string) {
    return <Badge variant={meets ? 'green' : 'red'}>{value}</Badge>
}

export function ErlangResultPanel({ input, output }: ErlangResultPanelProps) {
    const meetsSl = output.projectedServiceLevel >= input.serviceLevelTarget
    const meetsOcc = output.projectedOccupancy <= input.maxOccupancy

    return (
        <Card className="space-y-4">
            <h3 className="text-sm font-semibold">Erlang C — Staffing Calculation</h3>

            <DataRow
                label="Traffic Intensity"
                value={`${output.trafficIntensityErlangs.toFixed(2)} Erlangs`}
            />
            <DataRow
                label="Base Staff Required"
                value={<span className="font-bold">{output.baseStaffRequired}</span>}
            />
            <DataRow
                label="Scheduled Staff (incl. shrinkage)"
                value={<span className="font-bold">{output.scheduledStaffRequired}</span>}
            />
            <DataRow
                label="Projected Service Level"
                value={metricBadge(
                    meetsSl,
                    `${(output.projectedServiceLevel * 100).toFixed(1)}% (target ${(input.serviceLevelTarget * 100).toFixed(0)}%)`
                )}
            />
            <DataRow
                label="Projected Occupancy"
                value={metricBadge(
                    meetsOcc,
                    `${(output.projectedOccupancy * 100).toFixed(1)}% (cap ${(input.maxOccupancy * 100).toFixed(0)}%)`
                )}
            />
            <DataRow
                label="Average Speed of Answer"
                value={`${output.projectedASA.toFixed(1)}s`}
            />
            <DataRow
                label="Probability of Waiting (Pw)"
                value={`${(output.probabilityOfWaiting * 100).toFixed(1)}%`}
            />
        </Card>
    )
}
