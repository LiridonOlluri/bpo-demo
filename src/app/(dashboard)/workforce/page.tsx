'use client'

import { useState } from 'react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { ErlangResultPanel } from '@/components/organisms/ErlangResultPanel'
import { Slider } from '@/components/atoms/Slider'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { StatCard } from '@/components/molecules/StatCard'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'
import { useErlang } from '@/hooks/useErlang'

// Scenarios matching demo baseline (Client A voice, Client B chat)
const scenarios = {
    clientA_peak: {
        label: 'Client A — Peak',
        values: { callsPerInterval: 50, ahtSeconds: 300, intervalMinutes: 30, serviceLevelTarget: 0.80, shrinkagePercent: 0.30, maxOccupancy: 0.88 },
    },
    clientA_normal: {
        label: 'Client A — Normal',
        values: { callsPerInterval: 25, ahtSeconds: 300, intervalMinutes: 30, serviceLevelTarget: 0.80, shrinkagePercent: 0.30, maxOccupancy: 0.88 },
    },
    clientB_peak: {
        label: 'Client B — Peak',
        values: { callsPerInterval: 35, ahtSeconds: 480, intervalMinutes: 30, serviceLevelTarget: 0.90, shrinkagePercent: 0.30, maxOccupancy: 0.85 },
    },
    clientB_normal: {
        label: 'Client B — Normal',
        values: { callsPerInterval: 18, ahtSeconds: 480, intervalMinutes: 30, serviceLevelTarget: 0.90, shrinkagePercent: 0.30, maxOccupancy: 0.85 },
    },
} as const

export default function WorkforcePage() {
    const { input, output, updateInput } = useErlang()
    const [activeScenario, setActiveScenario] = useState<string | null>(null)

    function applyScenario(key: keyof typeof scenarios) {
        setActiveScenario(key)
        updateInput(scenarios[key].values)
    }

    return (
        <DashboardTemplate
            title="Workforce Planning — Erlang C Calculator"
            statCards={
                <>
                    <StatCard label="Total Headcount" value={50} variant="default" />
                    <StatCard label="Channel Split" value="35V + 15C" variant="default" />
                    <StatCard label="Planned Shrinkage" value="21%" variant="default" />
                    <StatCard label="Unplanned Shrinkage" value="9%" variant="amber" />
                    <StatCard label="Total Shrinkage" value="30%" variant="amber" />
                    <StatCard label="Cost/Agent/Month" value="€800" variant="default" />
                </>
            }
            actions={
                <div className="flex flex-wrap gap-2">
                    {Object.entries(scenarios).map(([key, s]) => (
                        <Button
                            key={key}
                            variant={activeScenario === key ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => applyScenario(key as keyof typeof scenarios)}
                        >
                            {s.label}
                        </Button>
                    ))}
                </div>
            }
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold">Staffing Inputs</h2>
                        {activeScenario && (
                            <Badge variant="green">{scenarios[activeScenario as keyof typeof scenarios]?.label}</Badge>
                        )}
                    </div>

                    <Slider
                        label="Calls/Chats per Interval"
                        displayValue={String(input.callsPerInterval)}
                        min={1}
                        max={120}
                        step={1}
                        value={input.callsPerInterval}
                        onChange={(e) => {
                            setActiveScenario(null)
                            updateInput({ callsPerInterval: Number(e.target.value) })
                        }}
                    />

                    <Slider
                        label="Avg Handle Time (seconds)"
                        displayValue={`${input.ahtSeconds}s (${(input.ahtSeconds / 60).toFixed(1)} min)`}
                        min={60}
                        max={900}
                        step={10}
                        value={input.ahtSeconds}
                        onChange={(e) => {
                            setActiveScenario(null)
                            updateInput({ ahtSeconds: Number(e.target.value) })
                        }}
                    />

                    <Slider
                        label="Interval (minutes)"
                        displayValue={`${input.intervalMinutes}m`}
                        min={15}
                        max={60}
                        step={15}
                        value={input.intervalMinutes}
                        onChange={(e) => {
                            setActiveScenario(null)
                            updateInput({ intervalMinutes: Number(e.target.value) })
                        }}
                    />

                    <Slider
                        label="Service Level Target"
                        displayValue={`${(input.serviceLevelTarget * 100).toFixed(0)}%`}
                        min={0.5}
                        max={0.99}
                        step={0.01}
                        value={input.serviceLevelTarget}
                        onChange={(e) => {
                            setActiveScenario(null)
                            updateInput({ serviceLevelTarget: Number(e.target.value) })
                        }}
                    />

                    <Slider
                        label="Total Shrinkage (Planned 21% + Unplanned 9%)"
                        displayValue={`${(input.shrinkagePercent * 100).toFixed(0)}%`}
                        min={0.05}
                        max={0.5}
                        step={0.01}
                        value={input.shrinkagePercent}
                        onChange={(e) => {
                            setActiveScenario(null)
                            updateInput({ shrinkagePercent: Number(e.target.value) })
                        }}
                    />

                    <Slider
                        label="Max Occupancy (above 90% = burnout risk)"
                        displayValue={`${(input.maxOccupancy * 100).toFixed(0)}%`}
                        min={0.7}
                        max={0.95}
                        step={0.01}
                        value={input.maxOccupancy}
                        onChange={(e) => {
                            setActiveScenario(null)
                            updateInput({ maxOccupancy: Number(e.target.value) })
                        }}
                    />
                </Card>

                <ErlangResultPanel input={input} output={output} />
            </div>

            {/* Shift pattern overview */}
            <Card className="mt-6">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">
                    Shift Patterns — 3 Shifts with Peak Overlap (10:00-15:00)
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { name: 'Early', time: '07:00 - 15:00', agents: 18, color: 'bg-blue-100 text-blue-800' },
                        { name: 'Mid', time: '10:00 - 18:00', agents: 16, color: 'bg-green-100 text-green-800' },
                        { name: 'Late', time: '16:00 - 00:00', agents: 16, color: 'bg-purple-100 text-purple-800' },
                    ].map((shift) => (
                        <div key={shift.name} className="rounded-lg border border-surface-border p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${shift.color}`}>{shift.name}</span>
                                <span className="text-xs text-brand-gray">{shift.agents} agents</span>
                            </div>
                            <p className="text-sm font-medium">{shift.time}</p>
                            <p className="text-xs text-brand-gray mt-1">8h shift incl. 30 min unpaid lunch, 2 × 15 min paid breaks</p>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                <AiFeatureLock title="AI Forecast Tuner" description="ML model refines volume forecasts using weather, events, and historical patterns" />
                <AiFeatureLock title="Preference-Aware Schedule Optimiser" description="Generates optimal schedules balancing agent preferences, skills, and SLA targets" />
                <AiFeatureLock title="Natural-Language Scenario Builder" description="Ask 'What if volume increases 20% next week?' and get instant staffing projections" />
            </div>
        </DashboardTemplate>
    )
}
