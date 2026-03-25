'use client'

import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { StatCard } from '@/components/molecules/StatCard'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'

// Client A: per-minute billing, Client B: per-FTE billing
const mockInvoices = [
    { id: 'INV-2026-031', client: 'Client A (E-commerce)', model: 'per-minute', period: 'Mar 2026', amount: 24800, status: 'pending', detail: '600 calls/day × 5 min avg × 22 days × €0.38/min' },
    { id: 'INV-2026-032', client: 'Client B (Tech Support)', model: 'per-FTE', period: 'Mar 2026', amount: 13600, status: 'pending', detail: '15 FTEs × €907/FTE/month (incl. margin)' },
    { id: 'INV-2026-021', client: 'Client A (E-commerce)', model: 'per-minute', period: 'Feb 2026', amount: 23500, status: 'paid', detail: '580 calls/day avg × 5 min × 20 days' },
    { id: 'INV-2026-022', client: 'Client B (Tech Support)', model: 'per-FTE', period: 'Feb 2026', amount: 13600, status: 'paid', detail: '15 FTEs × €907/FTE/month' },
    { id: 'INV-2026-011', client: 'Client A (E-commerce)', model: 'per-minute', period: 'Jan 2026', amount: 22100, status: 'paid', detail: '560 calls/day avg × 5 min × 21 days' },
]

export default function BillingPage() {
    const pendingInvoices = mockInvoices.filter((i) => i.status === 'pending')
    const outstanding = pendingInvoices.reduce((s, i) => s + i.amount, 0)
    const marchRevenue = pendingInvoices.reduce((s, i) => s + i.amount, 0)
    const clientARevenue = mockInvoices.filter(i => i.client.includes('Client A') && i.period === 'Mar 2026').reduce((s, i) => s + i.amount, 0)
    const clientBRevenue = mockInvoices.filter(i => i.client.includes('Client B') && i.period === 'Mar 2026').reduce((s, i) => s + i.amount, 0)

    return (
        <DashboardTemplate
            title="Billing & Revenue"
            statCards={
                <>
                    <StatCard label="March Revenue" value={`€${marchRevenue.toLocaleString()}`} trend="up" trendValue="+3.4% vs last month" variant="green" />
                    <StatCard label="Client A (per-min)" value={`€${clientARevenue.toLocaleString()}`} />
                    <StatCard label="Client B (per-FTE)" value={`€${clientBRevenue.toLocaleString()}`} />
                    <StatCard label="Outstanding" value={`€${outstanding.toLocaleString()}`} variant="amber" />
                </>
            }
        >
            <div className="space-y-6">
                {/* Billing model summary */}
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">Client A — E-commerce</h3>
                            <Badge variant="green">Per-Minute</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-brand-gray">
                            <div className="flex justify-between"><span>Channel</span><span className="text-foreground">Voice (35 agents)</span></div>
                            <div className="flex justify-between"><span>Daily Volume</span><span className="text-foreground">600 calls</span></div>
                            <div className="flex justify-between"><span>AHT Target</span><span className="text-foreground">5 min</span></div>
                            <div className="flex justify-between"><span>Rate</span><span className="text-foreground">€0.38/min</span></div>
                            <div className="flex justify-between"><span>SLA Penalty</span><span className="text-foreground">2% rebate if SL &lt; 75% for &gt; 3 days</span></div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">Client B — Tech Support</h3>
                            <Badge variant="blue">Per-FTE</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-brand-gray">
                            <div className="flex justify-between"><span>Channel</span><span className="text-foreground">Chat (15 agents, ×3 concurrency)</span></div>
                            <div className="flex justify-between"><span>Daily Volume</span><span className="text-foreground">400 chats</span></div>
                            <div className="flex justify-between"><span>AHT Target</span><span className="text-foreground">8 min</span></div>
                            <div className="flex justify-between"><span>Rate</span><span className="text-foreground">€907/FTE/month</span></div>
                            <div className="flex justify-between"><span>SLA Penalty</span><span className="text-foreground">1% rebate if first-response &gt; 60s for &gt; 5 days</span></div>
                        </div>
                    </Card>
                </div>

                {/* Invoice table */}
                <Card padding={false}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                    <th className="p-4 font-medium">Invoice #</th>
                                    <th className="p-4 font-medium">Client</th>
                                    <th className="p-4 font-medium">Model</th>
                                    <th className="p-4 font-medium">Period</th>
                                    <th className="p-4 font-medium text-right">Amount</th>
                                    <th className="p-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockInvoices.map((inv) => (
                                    <tr key={inv.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                        <td className="p-4 font-mono text-xs">{inv.id}</td>
                                        <td className="p-4">{inv.client}</td>
                                        <td className="p-4"><Badge variant={inv.model === 'per-minute' ? 'green' : 'blue'}>{inv.model}</Badge></td>
                                        <td className="p-4">{inv.period}</td>
                                        <td className="p-4 text-right font-medium">€{inv.amount.toLocaleString()}</td>
                                        <td className="p-4">
                                            <Badge variant={inv.status === 'paid' ? 'green' : 'amber'}>
                                                {inv.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* OT cost attribution */}
                <Card>
                    <h3 className="text-sm font-semibold mb-3">Overtime Cost Attribution</h3>
                    <p className="text-sm text-brand-gray">
                        OT approved to cover SLA dips is pre-flagged in payroll and allocated to the client P&L.
                        Executive sees cause attribution: <span className="font-medium text-foreground">€142 OT this week allocated to Client A due to volume spike on 22 Mar</span>.
                    </p>
                </Card>

                <AiFeatureLock title="AI Client Reporting Engine" description="Auto-generate executive billing reports with SLA commentary and cost breakdown by category" />
            </div>
        </DashboardTemplate>
    )
}
