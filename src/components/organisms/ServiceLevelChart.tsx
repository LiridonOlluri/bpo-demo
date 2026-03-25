'use client'

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine,
    Tooltip,
} from 'recharts'

interface ServiceLevelDataPoint {
    time: string
    serviceLevel: number
    target: number
}

interface ServiceLevelChartProps {
    data: ServiceLevelDataPoint[]
    target: number
}

function DotRenderer(props: { cx: number; cy: number; payload: ServiceLevelDataPoint }) {
    const { cx, cy, payload } = props
    const color = payload.serviceLevel >= payload.target ? '#22c55e' : '#ef4444'
    return <circle cx={cx} cy={cy} r={4} fill={color} stroke={color} />
}

export function ServiceLevelChart({ data, target }: ServiceLevelChartProps) {
    return (
        <ResponsiveContainer width="100%" height={360}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-border)" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="var(--color-brand-gray)" />
                <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 12 }}
                    stroke="var(--color-brand-gray)"
                />
                <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Service Level']}
                    contentStyle={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-surface-border)',
                        borderRadius: 8,
                        fontSize: 12,
                    }}
                />
                <ReferenceLine
                    y={target}
                    stroke="#3b82f6"
                    strokeDasharray="6 4"
                    label={{ value: `Target ${target}%`, position: 'right', fontSize: 11, fill: '#3b82f6' }}
                />
                <Line
                    type="monotone"
                    dataKey="serviceLevel"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={<DotRenderer cx={0} cy={0} payload={{ time: '', serviceLevel: 0, target: 0 }} />}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
