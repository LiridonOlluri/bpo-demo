'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { StatCard } from '@/components/molecules/StatCard'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'
import type { ClientConfig } from '@/types/client'
import { Plus, Phone, MessageSquare, Trash2 } from 'lucide-react'

// Demo baseline: 2 active clients (expandable)
const MOCK_CLIENTS: ClientConfig[] = [
    {
        id: 'client-a',
        name: 'Client A',
        industry: 'E-commerce',
        channel: 'voice',
        agentsAssigned: 60,
        slaTarget: { percentage: 80, seconds: 20 },
        ahtTarget: 300,   // 5 min
        acwTarget: 45,    // 45 sec
        dailyVolume: 1200,
        peakHours: ['10:00', '11:00', '12:00', '13:00', '14:00', '19:00', '20:00', '21:00'],
        occupancyTarget: 80,
        occupancyCap: 88,
        requiredCertifications: ['Product Knowledge', 'CRM'],
        billingModel: 'per-minute',
        operatingHours: { start: '07:00', end: '00:00' },
    },
    {
        id: 'client-b',
        name: 'Client B',
        industry: 'Tech Support',
        channel: 'chat',
        agentsAssigned: 40,
        slaTarget: { percentage: 90, seconds: 60 },
        ahtTarget: 480,   // 8 min
        acwTarget: 60,    // 60 sec
        dailyVolume: 900,
        peakHours: ['09:00', '10:00', '11:00', '12:00'],
        occupancyTarget: 75,
        occupancyCap: 85,
        chatConcurrency: 3,
        requiredCertifications: ['Technical Troubleshooting', 'Tier 1/2'],
        billingModel: 'per-fte',
        operatingHours: { start: '08:00', end: '00:00' },
    },
]

const channelBadge: Record<string, 'green' | 'blue' | 'amber' | 'grey'> = {
    voice: 'green',
    chat: 'blue',
    email: 'amber',
    'back-office': 'grey',
}

const ChannelIcon = ({ channel }: { channel: string }) =>
    channel === 'chat' ? <MessageSquare size={18} /> : <Phone size={18} />

export default function ClientsPage() {
    const [localClients, setLocalClients] = useState<ClientConfig[]>([])

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('bpo-demo-clients') ?? '[]')
            setLocalClients(stored)
        } catch { /* ignore */ }
    }, [])

    const removeLocalClient = (id: string) => {
        const updated = localClients.filter(c => c.id !== id)
        setLocalClients(updated)
        localStorage.setItem('bpo-demo-clients', JSON.stringify(updated))
    }

    const allClients = [...MOCK_CLIENTS, ...localClients]
    const totalAgents = allClients.reduce((s, c) => s + (c.agentsAssigned ?? 0), 0)

    return (
        <DashboardTemplate
            title="Client Programmes"
            statCards={
                <>
                    <StatCard label="Active Clients" value={allClients.length} variant="default" />
                    <StatCard label="Total Agents Deployed" value={totalAgents} variant="green" />
                    <StatCard label="Channels" value="80 Voice + 20 Chat" variant="default" />
                    <StatCard label="Operating Hours" value="07:00 - 00:00" variant="default" />
                </>
            }
            actions={
                <Link href="/clients/new">
                    <Button size="sm">
                        <Plus size={16} />
                        Add Client
                    </Button>
                </Link>
            }
        >
            <div className="grid gap-6 lg:grid-cols-2">
                {allClients.map((client) => {
                    const isLocal = localClients.some(c => c.id === client.id)
                    return (
                        <Link key={client.id} href={`/clients/${client.id}`} className="block">
                            <Card className="transition-all hover:border-brand-green hover:shadow-md cursor-pointer">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                                            <ChannelIcon channel={client.channel} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-semibold">{client.name}</h3>
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                <Badge variant={channelBadge[client.channel] ?? 'grey'}>{client.channel}</Badge>
                                                <Badge variant="grey">{client.industry}</Badge>
                                                <Badge variant="blue">{client.billingModel}</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-brand-gray">Agents</span>
                                            <span className="font-medium">{client.agentsAssigned}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-brand-gray">SLA Target</span>
                                            <span className="font-medium">{client.slaTarget.percentage}% / {client.slaTarget.seconds}s</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-brand-gray">AHT Target</span>
                                            <span className="font-medium">{Math.floor(client.ahtTarget / 60)} min</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-brand-gray">ACW Target</span>
                                            <span className="font-medium">{client.acwTarget}s</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-brand-gray">Daily Volume</span>
                                            <span className="font-medium">{client.dailyVolume.toLocaleString()} {client.channel === 'chat' ? 'chats' : 'calls'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-brand-gray">Occupancy</span>
                                            <span className="font-medium">{client.occupancyTarget}% (max {client.occupancyCap}%)</span>
                                        </div>
                                        {client.chatConcurrency && (
                                            <div className="flex justify-between">
                                                <span className="text-brand-gray">Chat Concurrency</span>
                                                <span className="font-medium">{client.chatConcurrency} sessions/agent</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-brand-gray">Operating Hours</span>
                                            <span className="font-medium">{client.operatingHours.start} - {client.operatingHours.end}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-brand-gray">Peak Hours</span>
                                            <span className="font-medium">{client.peakHours.slice(0, 3).join(', ')}...</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-brand-gray">Certifications</span>
                                            <span className="font-medium text-right">{client.requiredCertifications.join(', ')}</span>
                                        </div>
                                    </div>

                                    {/* Live SLA snapshot */}
                                    <div className="rounded-lg border border-surface-border bg-surface-muted/50 p-3">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-gray mb-2">Live Snapshot</h4>
                                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                                            <div>
                                                <p className="text-brand-gray">Current SL</p>
                                                <p className={`text-lg font-bold ${client.id === 'client-a' ? 'text-status-amber' : 'text-status-green'}`}>
                                                    {client.id === 'client-a' ? '76%' : '92%'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-brand-gray">In Queue</p>
                                                <p className="text-lg font-bold">{client.id === 'client-a' ? '8' : '3'}</p>
                                            </div>
                                            <div>
                                                <p className="text-brand-gray">AHT Live</p>
                                                <p className={`text-lg font-bold ${client.id === 'client-a' ? 'text-status-amber' : 'text-status-green'}`}>
                                                    {client.id === 'client-a' ? '5:42' : '7:38'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-brand-gray">Abandon %</p>
                                                <p className={`text-lg font-bold ${client.id === 'client-a' ? 'text-status-red' : 'text-status-green'}`}>
                                                    {client.id === 'client-a' ? '6.2%' : '2.1%'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {isLocal && (
                                        <div className="flex justify-end pt-2 border-t border-surface-border">
                                            <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); removeLocalClient(client.id) }} className="text-status-red hover:text-status-red">
                                                <Trash2 size={14} />
                                                Remove
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                <AiFeatureLock title="AI Client Reporting Engine" description="Auto-generate executive reports with SLA commentary, root-cause analysis, and recommendations" />
                <AiFeatureLock title="AI-Powered Pricing Recommendations" description="Suggest optimal rate cards based on volume, complexity, and market benchmarks" />
                <AiFeatureLock title="Predictive Client Demand Modelling" description="ML-based forecasting of client volume trends for proactive capacity planning" />
            </div>
        </DashboardTemplate>
    )
}
