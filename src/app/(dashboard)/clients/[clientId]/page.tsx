'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { DetailTemplate } from '@/components/templates/DetailTemplate'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import { StatCard } from '@/components/molecules/StatCard'
import type { ClientConfig } from '@/types/client'
import { ArrowLeft, Phone, MessageSquare, Users, TrendingUp, Clock, AlertTriangle } from 'lucide-react'

// Demo baseline clients matching the main clients page
const MOCK_CLIENTS: Record<string, ClientConfig> = {
    'client-a': {
        id: 'client-a',
        name: 'Client A',
        industry: 'E-commerce',
        channel: 'voice',
        agentsAssigned: 60,
        slaTarget: { percentage: 80, seconds: 20 },
        ahtTarget: 300,
        acwTarget: 45,
        dailyVolume: 1200,
        peakHours: ['10:00', '11:00', '12:00', '13:00', '14:00', '19:00', '20:00', '21:00'],
        occupancyTarget: 80,
        occupancyCap: 88,
        requiredCertifications: ['Product Knowledge', 'CRM'],
        billingModel: 'per-minute',
        operatingHours: { start: '07:00', end: '00:00' },
    },
    'client-b': {
        id: 'client-b',
        name: 'Client B',
        industry: 'Tech Support',
        channel: 'chat',
        agentsAssigned: 40,
        slaTarget: { percentage: 90, seconds: 60 },
        ahtTarget: 480,
        acwTarget: 60,
        dailyVolume: 900,
        peakHours: ['09:00', '10:00', '11:00', '12:00'],
        occupancyTarget: 75,
        occupancyCap: 85,
        chatConcurrency: 3,
        requiredCertifications: ['Technical Troubleshooting', 'Tier 1/2'],
        billingModel: 'per-fte',
        operatingHours: { start: '08:00', end: '00:00' },
    },
}

// Live demo metrics for mock clients
const LIVE_METRICS: Record<string, { sl: number; aht: string; inQueue: number; abandon: number; occupancy: number; agentsOnline: number; adherence: number }> = {
    'client-a': { sl: 76, aht: '5:42', inQueue: 8, abandon: 6.2, occupancy: 84, agentsOnline: 28, adherence: 91 },
    'client-b': { sl: 92, aht: '7:38', inQueue: 3, abandon: 2.1, occupancy: 72, agentsOnline: 13, adherence: 95 },
}

// Team breakdown per client
const TEAM_BREAKDOWN: Record<string, { team: string; agents: number; sl: number; aht: string; status: string }[]> = {
    'client-a': [
        { team: 'Team A', agents: 10, sl: 82, aht: '4:55', status: 'On Target' },
        { team: 'Team B', agents: 10, sl: 68, aht: '6:12', status: 'At Risk' },
        { team: 'Team C', agents: 10, sl: 79, aht: '5:10', status: 'Near Target' },
        { team: 'Team E', agents: 5, sl: 75, aht: '5:30', status: 'Below' },
    ],
    'client-b': [
        { team: 'Team D', agents: 10, sl: 93, aht: '7:20', status: 'On Target' },
        { team: 'Team E', agents: 5, sl: 89, aht: '8:05', status: 'Near Target' },
    ],
}

// Billing info per client
const BILLING_INFO: Record<string, { model: string; rate: string; mtdRevenue: string; mtdCost: string; margin: string }> = {
    'client-a': { model: 'Per-Minute', rate: '€0.38/min', mtdRevenue: '€18,240', mtdCost: '€14,560', margin: '20.2%' },
    'client-b': { model: 'Per-FTE', rate: '€907/FTE/month', mtdRevenue: '€13,605', mtdCost: '€10,200', margin: '25.0%' },
}

export default function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
    const { clientId } = use(params)
    const [localClients, setLocalClients] = useState<ClientConfig[]>([])

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('bpo-demo-clients') ?? '[]')
            setLocalClients(stored)
        } catch { /* ignore */ }
    }, [])

    const localMatch = localClients.find(c => c.id === clientId)
    const client = MOCK_CLIENTS[clientId] ?? localMatch
    const metrics = LIVE_METRICS[clientId]
    const teams = TEAM_BREAKDOWN[clientId]
    const billing = BILLING_INFO[clientId]

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-brand-gray">
                <p>Client not found.</p>
                <Link href="/clients">
                    <Button variant="secondary" size="sm">Back to Clients</Button>
                </Link>
            </div>
        )
    }

    const slaCurrent = metrics?.sl ?? 80
    const slaOnTarget = slaCurrent >= client.slaTarget.percentage
    const slaVariant = slaOnTarget ? 'green' : 'red'
    const isLocal = !!localMatch

    return (
        <DetailTemplate
            title={client.name}
            actions={
                <Link href="/clients">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft size={16} />
                        Back to Clients
                    </Button>
                </Link>
            }
            sidebar={
                <div className="space-y-4">
                    {/* SLA Performance */}
                    <Card>
                        <h3 className="mb-3 text-sm font-semibold">SLA Performance</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-brand-gray">Current</span>
                                <Badge variant={slaVariant}>{slaCurrent}%</Badge>
                            </div>
                            <ProgressBar value={slaCurrent} max={100} variant={slaVariant} />
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-brand-gray">Target</span>
                                <span className="font-medium">{client.slaTarget.percentage}% / {client.slaTarget.seconds}s</span>
                            </div>
                        </div>
                    </Card>

                    {/* Occupancy */}
                    <Card>
                        <h3 className="mb-3 text-sm font-semibold">Occupancy</h3>
                        <div className="space-y-2 text-sm">
                            {metrics && (
                                <div className="flex justify-between">
                                    <span className="text-brand-gray">Current</span>
                                    <Badge variant={metrics.occupancy > client.occupancyCap ? 'red' : metrics.occupancy >= client.occupancyTarget ? 'green' : 'amber'}>
                                        {metrics.occupancy}%
                                    </Badge>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-brand-gray">Target</span>
                                <span className="font-medium">{client.occupancyTarget}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-gray">Cap</span>
                                <span className="font-medium">{client.occupancyCap}%</span>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Stats */}
                    {metrics && (
                        <Card>
                            <h3 className="mb-3 text-sm font-semibold">Live Metrics</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-brand-gray">Agents Online</span>
                                    <span className="font-medium">{metrics.agentsOnline} / {client.agentsAssigned}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-brand-gray">AHT</span>
                                    <span className="font-medium">{metrics.aht}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-brand-gray">In Queue</span>
                                    <span className="font-medium">{metrics.inQueue}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-brand-gray">Abandon %</span>
                                    <Badge variant={metrics.abandon > 5 ? 'red' : 'green'}>{metrics.abandon}%</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-brand-gray">Adherence</span>
                                    <span className="font-medium">{metrics.adherence}%</span>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            }
        >
            <div className="space-y-6">
                {/* Stat cards row */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard label="Agents" value={client.agentsAssigned} />
                    <StatCard label="Daily Volume" value={`${client.dailyVolume.toLocaleString()} ${client.channel === 'chat' ? 'chats' : 'calls'}`} />
                    <StatCard label="Channel" value={client.channel} />
                    <StatCard label="Billing" value={client.billingModel} />
                </div>

                {/* Client details */}
                <Card>
                    <h2 className="mb-4 text-lg font-semibold">Client Configuration</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm lg:grid-cols-3">
                        <div>
                            <span className="text-brand-gray">Industry</span>
                            <p className="font-medium">{client.industry}</p>
                        </div>
                        <div>
                            <span className="text-brand-gray">Channel</span>
                            <p className="font-medium capitalize flex items-center gap-1.5">
                                {client.channel === 'chat' ? <MessageSquare size={14} /> : <Phone size={14} />}
                                {client.channel}
                            </p>
                        </div>
                        <div>
                            <span className="text-brand-gray">Agents Assigned</span>
                            <p className="font-medium">{client.agentsAssigned}</p>
                        </div>
                        <div>
                            <span className="text-brand-gray">Billing Model</span>
                            <p className="font-medium">{client.billingModel}</p>
                        </div>
                        <div>
                            <span className="text-brand-gray">AHT Target</span>
                            <p className="font-medium">{Math.floor(client.ahtTarget / 60)} min {client.ahtTarget % 60 > 0 ? `${client.ahtTarget % 60}s` : ''}</p>
                        </div>
                        <div>
                            <span className="text-brand-gray">ACW Target</span>
                            <p className="font-medium">{client.acwTarget}s</p>
                        </div>
                        <div>
                            <span className="text-brand-gray">Daily Volume</span>
                            <p className="font-medium">{client.dailyVolume.toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="text-brand-gray">Operating Hours</span>
                            <p className="font-medium">{client.operatingHours.start} – {client.operatingHours.end}</p>
                        </div>
                        {client.chatConcurrency && (
                            <div>
                                <span className="text-brand-gray">Chat Concurrency</span>
                                <p className="font-medium">×{client.chatConcurrency} sessions/agent</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Team breakdown */}
                {teams && (
                    <Card padding={false}>
                        <div className="p-4 border-b border-surface-border">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Team Breakdown</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                        <th className="p-4 font-medium">Team</th>
                                        <th className="p-4 font-medium text-right">Agents</th>
                                        <th className="p-4 font-medium text-right">Service Level</th>
                                        <th className="p-4 font-medium text-right">AHT</th>
                                        <th className="p-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teams.map((t) => (
                                        <tr key={t.team} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                            <td className="p-4 font-medium">{t.team}</td>
                                            <td className="p-4 text-right">{t.agents}</td>
                                            <td className="p-4 text-right">
                                                <Badge variant={t.sl >= client.slaTarget.percentage ? 'green' : t.sl >= client.slaTarget.percentage - 5 ? 'amber' : 'red'}>
                                                    {t.sl}%
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right">{t.aht}</td>
                                            <td className="p-4">
                                                <Badge variant={t.status === 'On Target' ? 'green' : t.status === 'At Risk' ? 'red' : 'amber'}>
                                                    {t.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* Billing summary */}
                {billing && (
                    <Card>
                        <h2 className="mb-4 text-lg font-semibold">Billing Summary (MTD)</h2>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm lg:grid-cols-5">
                            <div>
                                <span className="text-brand-gray">Model</span>
                                <p className="font-medium">{billing.model}</p>
                            </div>
                            <div>
                                <span className="text-brand-gray">Rate</span>
                                <p className="font-medium">{billing.rate}</p>
                            </div>
                            <div>
                                <span className="text-brand-gray">Revenue</span>
                                <p className="font-medium text-status-green">{billing.mtdRevenue}</p>
                            </div>
                            <div>
                                <span className="text-brand-gray">Cost</span>
                                <p className="font-medium">{billing.mtdCost}</p>
                            </div>
                            <div>
                                <span className="text-brand-gray">Margin</span>
                                <p className="font-medium text-status-green">{billing.margin}</p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Certifications & Peak Hours */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <h2 className="mb-3 text-lg font-semibold">Required Certifications</h2>
                        <div className="flex flex-wrap gap-2">
                            {client.requiredCertifications.map((cert) => (
                                <Badge key={cert} variant="blue">{cert}</Badge>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h2 className="mb-3 text-lg font-semibold">Peak Hours</h2>
                        <div className="flex flex-wrap gap-2">
                            {client.peakHours.map((hour) => (
                                <Badge key={hour} variant="grey">{hour}</Badge>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Alert for at-risk SLA (Client A) */}
                {metrics && slaCurrent < client.slaTarget.percentage && (
                    <Card className="border-status-amber/50 bg-status-amber/5">
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={20} className="text-status-amber shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-status-amber">SLA Below Target</h3>
                                <p className="text-xs text-brand-gray mt-1">
                                    Current service level is {slaCurrent}% against a target of {client.slaTarget.percentage}%.
                                    AHT is running above target at {metrics.aht} and abandon rate is {metrics.abandon}%.
                                    Consider reviewing Team B performance or authorising overtime coverage.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Info for localStorage clients */}
                {isLocal && !metrics && (
                    <Card className="border-brand-primary/30 bg-brand-primary/5">
                        <p className="text-sm text-brand-gray">
                            This client was created locally. Live metrics, team breakdowns, and billing data will appear once the client is connected to the real-time pipeline.
                        </p>
                    </Card>
                )}
            </div>
        </DetailTemplate>
    )
}
