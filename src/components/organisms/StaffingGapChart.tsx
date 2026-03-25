'use client'

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
} from 'recharts'

interface StaffingGapDataPoint {
    time: string
    requiredAgents: number
    scheduledAgents: number
    actualAgents: number
}

interface StaffingGapChartProps {
    data: StaffingGapDataPoint[]
}

export function StaffingGapChart({ data }: StaffingGapChartProps) {
    return (
        <ResponsiveContainer width="100%" height={360}>
            <BarChart data={data} barGap={2} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-border)" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="var(--color-brand-gray)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--color-brand-gray)" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-surface-border)',
                        borderRadius: 8,
                        fontSize: 12,
                    }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="requiredAgents" name="Required" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="scheduledAgents" name="Scheduled" fill="#22c55e" radius={[2, 2, 0, 0]} />
                <Bar dataKey="actualAgents" name="Actual" radius={[2, 2, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell
                            key={index}
                            fill={entry.actualAgents < entry.requiredAgents ? '#f59e0b' : '#22c55e'}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
