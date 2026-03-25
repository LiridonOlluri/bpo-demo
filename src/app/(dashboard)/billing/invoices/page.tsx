'use client'

import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'

const mockInvoices = [
    { id: 'INV-2026-031', client: 'Acme Corp', period: 'Mar 2026', amount: 48500, status: 'pending' },
    { id: 'INV-2026-032', client: 'Globex Ltd', period: 'Mar 2026', amount: 32200, status: 'pending' },
    { id: 'INV-2026-021', client: 'Acme Corp', period: 'Feb 2026', amount: 47800, status: 'paid' },
    { id: 'INV-2026-022', client: 'Globex Ltd', period: 'Feb 2026', amount: 31500, status: 'paid' },
    { id: 'INV-2026-011', client: 'Acme Corp', period: 'Jan 2026', amount: 46200, status: 'paid' },
    { id: 'INV-2026-012', client: 'Globex Ltd', period: 'Jan 2026', amount: 30800, status: 'paid' },
    { id: 'INV-2025-121', client: 'Acme Corp', period: 'Dec 2025', amount: 45500, status: 'paid' },
    { id: 'INV-2025-122', client: 'Globex Ltd', period: 'Dec 2025', amount: 29900, status: 'paid' },
]

export default function InvoicesPage() {
    return (
        <DashboardTemplate title="Invoices">
            <Card padding={false}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                <th className="p-4 font-medium">Invoice #</th>
                                <th className="p-4 font-medium">Client</th>
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
                                    <td className="p-4">{inv.period}</td>
                                    <td className="p-4 text-right font-medium">${inv.amount.toLocaleString()}</td>
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
        </DashboardTemplate>
    )
}
