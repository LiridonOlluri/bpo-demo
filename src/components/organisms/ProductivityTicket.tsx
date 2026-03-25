'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, ListOrdered } from 'lucide-react'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { DataRow } from '@/components/molecules/DataRow'
import type { ProductivityTicket as ProductivityTicketType } from '@/types/ticket'

interface ProductivityTicketProps {
    ticket: ProductivityTicketType
    onAcknowledge?: (ticketId: string, action: string, category: string) => void
}

const priorityVariant: Record<string, 'red' | 'amber' | 'blue' | 'grey'> = {
    critical: 'red',
    high: 'red',
    medium: 'amber',
    low: 'grey',
}

const statusVariant: Record<string, 'red' | 'amber' | 'green' | 'blue' | 'grey'> = {
    open: 'red',
    acknowledged: 'amber',
    'action-taken': 'green',
    'follow-up': 'blue',
    resolved: 'green',
    recurring: 'red',
}

export function ProductivityTicketView({ ticket, onAcknowledge }: ProductivityTicketProps) {
    const [showForm, setShowForm] = useState(false)
    const [action, setAction] = useState('')
    const [category, setCategory] = useState('coaching')

    return (
        <Card>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-status-amber" />
                        <h2 className="text-lg font-semibold">Ticket #{ticket.id.slice(0, 8)}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={priorityVariant[ticket.priority]}>
                            {ticket.priority.toUpperCase()}
                        </Badge>
                        <Badge variant={statusVariant[ticket.status]}>
                            {ticket.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        {ticket.isRecurring && <Badge variant="red">Recurring</Badge>}
                    </div>
                </div>

                {/* Trigger */}
                <div>
                    <h3 className="text-sm font-semibold mb-1">Trigger</h3>
                    <p className="text-sm text-brand-gray">{ticket.trigger}</p>
                </div>

                {/* Root Cause Analysis */}
                <div>
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <ListOrdered className="h-4 w-4" /> Root Cause Analysis
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {ticket.rootCauseAnalysis.map((item, i) => (
                            <li key={i} className="text-sm text-brand-gray">{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Suggested Actions */}
                <div>
                    <h3 className="text-sm font-semibold mb-2">Suggested Actions</h3>
                    <ol className="list-decimal pl-5 space-y-1">
                        {ticket.suggestedActions.map((item, i) => (
                            <li key={i} className="text-sm text-brand-gray">{item}</li>
                        ))}
                    </ol>
                </div>

                {/* Action Taken */}
                {ticket.actionTaken && (
                    <div>
                        <h3 className="text-sm font-semibold mb-1 flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4 text-status-green" /> Action Taken
                        </h3>
                        <p className="text-sm text-brand-gray">{ticket.actionTaken}</p>
                        {ticket.actionCategory && (
                            <Badge variant="blue" className="mt-1">{ticket.actionCategory}</Badge>
                        )}
                    </div>
                )}

                {/* Follow-up */}
                {ticket.followUpDate && (
                    <div className="border-t border-surface-border pt-4">
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                            <Clock className="h-4 w-4" /> Follow-up
                        </h3>
                        <DataRow label="Follow-up Date" value={ticket.followUpDate} />
                        {ticket.followUpResult && (
                            <DataRow
                                label="Result"
                                value={
                                    <Badge variant={ticket.followUpResult === 'improved' ? 'green' : ticket.followUpResult === 'not-improved' ? 'red' : 'amber'}>
                                        {ticket.followUpResult}
                                    </Badge>
                                }
                            />
                        )}
                    </div>
                )}

                {/* Acknowledge / Action Form */}
                {ticket.status === 'open' && onAcknowledge && (
                    <div className="border-t border-surface-border pt-4">
                        {!showForm ? (
                            <Button onClick={() => setShowForm(true)}>Acknowledge & Take Action</Button>
                        ) : (
                            <div className="space-y-3">
                                <textarea
                                    className="w-full rounded-lg border border-surface-border bg-surface-muted p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50"
                                    rows={3}
                                    placeholder="Describe action taken..."
                                    value={action}
                                    onChange={(e) => setAction(e.target.value)}
                                />
                                <select
                                    className="w-full rounded-lg border border-surface-border bg-surface-muted p-2 text-sm"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="coaching">Coaching</option>
                                    <option value="schedule-adjustment">Schedule Adjustment</option>
                                    <option value="agent-reassignment">Agent Reassignment</option>
                                    <option value="hr-escalation">HR Escalation</option>
                                    <option value="it-ticket">IT Ticket</option>
                                    <option value="other">Other</option>
                                </select>
                                <div className="flex gap-2">
                                    <Button onClick={() => onAcknowledge(ticket.id, action, category)} disabled={!action.trim()}>
                                        Submit
                                    </Button>
                                    <Button variant="secondary" onClick={() => setShowForm(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    )
}
