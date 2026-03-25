'use client'

import { useState } from 'react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { TabGroup } from '@/components/molecules/TabGroup'
import { Card } from '@/components/atoms/Card'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import { Switch } from '@/components/atoms/Switch'
import Link from 'next/link'
import { Button } from '@/components/atoms/Button'
import { Label } from '@/components/atoms/Label'

const tabs = [
    { id: 'general', label: 'General' },
    { id: 'shrinkage', label: 'Shrinkage Config' },
    { id: 'leave', label: 'Leave Setup' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'integrations', label: 'Integrations' },
]

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general')
    const [ticketAlerts, setTicketAlerts] = useState(true)
    const [fteLossAlerts, setFteLossAlerts] = useState(true)
    const [payrollReminders, setPayrollReminders] = useState(true)
    const [contractWarnings, setContractWarnings] = useState(true)
    const [bradfordAlerts, setBradfordAlerts] = useState(true)
    const [slaBreach, setSlaBreach] = useState(true)

    return (
        <DashboardTemplate title="Settings">
            <TabGroup tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            <div className="mt-6">
                {activeTab === 'general' && (
                    <>
                    <Card className="mb-6 border-brand-green/20 bg-brand-light/30">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-foreground">Specification registry</h2>
                                <p className="text-xs text-brand-gray">
                                    95 configurable indicators (A–K), 10 modules, smart leave & FTE loss engines — per meTru BPO spec v1.0
                                </p>
                            </div>
                            <Link href="/settings/indicators">
                                <Button variant="secondary" size="sm">
                                    Open indicators catalog
                                </Button>
                            </Link>
                        </div>
                    </Card>
                    <Card>
                        <div className="space-y-6 max-w-lg">
                            <div className="space-y-2">
                                <Label>Company Name</Label>
                                <Input defaultValue="BPO Demo Corp" />
                            </div>
                            <div className="space-y-2">
                                <Label>Operating Hours</Label>
                                <div className="flex gap-3">
                                    <div className="flex-1 space-y-1">
                                        <span className="text-xs text-brand-gray">Start</span>
                                        <Input defaultValue="07:00" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <span className="text-xs text-brand-gray">End</span>
                                        <Input defaultValue="00:00" />
                                    </div>
                                </div>
                                <p className="text-xs text-brand-gray">17-hour operating window — 3 shift patterns (Early, Mid, Late)</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Timezone</Label>
                                <Select
                                    options={[
                                        { value: 'UTC', label: 'UTC' },
                                        { value: 'Europe/Berlin', label: 'Europe/Berlin (CET)' },
                                        { value: 'Europe/London', label: 'Europe/London (GMT)' },
                                        { value: 'America/New_York', label: 'America/New_York (EST)' },
                                    ]}
                                    defaultValue="Europe/Berlin"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Default Currency</Label>
                                <Select
                                    options={[
                                        { value: 'EUR', label: 'EUR (€)' },
                                        { value: 'USD', label: 'USD ($)' },
                                        { value: 'GBP', label: 'GBP (£)' },
                                    ]}
                                    defaultValue="EUR"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Base Hourly Rate (€)</Label>
                                <Input type="number" defaultValue="4.55" step="0.01" />
                                <p className="text-xs text-brand-gray">€800/month ÷ 176h = €4.55/h</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>OT Multiplier</Label>
                                    <Input type="number" defaultValue="1.5" step="0.1" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Night Differential (%)</Label>
                                    <Input type="number" defaultValue="15" />
                                    <p className="text-xs text-brand-gray">22:00–00:00</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Contract Type (Default)</Label>
                                <Select
                                    options={[
                                        { value: '6m-fixed', label: '6-Month Fixed-Term' },
                                        { value: '12m-fixed', label: '12-Month Fixed-Term' },
                                        { value: 'permanent', label: 'Permanent' },
                                    ]}
                                    defaultValue="6m-fixed"
                                />
                            </div>
                            <Button>Save Changes</Button>
                        </div>
                    </Card>
                    </>
                )}

                {activeTab === 'shrinkage' && (
                    <Card>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray mb-4">Shrinkage Configuration — 30% Total</h2>
                        <div className="grid grid-cols-2 gap-6 max-w-2xl">
                            <div>
                                <h3 className="text-xs font-semibold text-brand-gray mb-3 uppercase">Planned (21%)</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Annual Leave', value: '5.0' },
                                        { label: 'Public Holidays', value: '2.5' },
                                        { label: 'Breaks (Paid)', value: '6.3' },
                                        { label: 'Training & Nesting', value: '3.0' },
                                        { label: 'Coaching / 1-on-1', value: '1.5' },
                                        { label: 'Team Meetings', value: '1.0' },
                                        { label: 'Project / Off-Phone', value: '0.5' },
                                        { label: 'Union / Works Council', value: '0.2' },
                                        { label: 'System Downtime (sched)', value: '1.0' },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between">
                                            <Label className="text-xs">{item.label}</Label>
                                            <Input type="number" defaultValue={item.value} step="0.1" className="w-20 text-right" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold text-brand-gray mb-3 uppercase">Unplanned (9%)</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Sick Leave (short-term)', value: '3.0' },
                                        { label: 'Sick Leave (long-term)', value: '1.5' },
                                        { label: 'NCNS (No-Call No-Show)', value: '0.5' },
                                        { label: 'Tardiness (avg 7 min)', value: '0.8' },
                                        { label: 'Early Departure', value: '0.3' },
                                        { label: 'Unplanned AUX / Idle', value: '1.5' },
                                        { label: 'System Outage (unplanned)', value: '0.7' },
                                        { label: 'Emergency Leave', value: '0.7' },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between">
                                            <Label className="text-xs">{item.label}</Label>
                                            <Input type="number" defaultValue={item.value} step="0.1" className="w-20 text-right" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-between max-w-2xl">
                            <p className="text-sm font-medium">Total Shrinkage: <span className="text-brand-primary">30.0%</span></p>
                            <Button>Save Shrinkage Config</Button>
                        </div>
                    </Card>
                )}

                {activeTab === 'leave' && (
                    <Card>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray mb-4">Leave Management Setup</h2>
                        <div className="space-y-6 max-w-lg">
                            <div className="space-y-2">
                                <Label>Annual Leave Entitlement (days/year)</Label>
                                <Input type="number" defaultValue="20" />
                            </div>
                            <div className="space-y-2">
                                <Label>Leave Slots per Week (Dynamic)</Label>
                                <Input type="number" defaultValue="2" />
                                <p className="text-xs text-brand-gray">
                                    Max agents allowed on leave simultaneously per team. System adjusts based on forecast volume.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>FIFO Priority</Label>
                                <Select
                                    options={[
                                        { value: 'fifo', label: 'First-Come First-Served' },
                                        { value: 'seniority', label: 'Seniority-Based' },
                                        { value: 'rotation', label: 'Rotation' },
                                    ]}
                                    defaultValue="fifo"
                                />
                                <p className="text-xs text-brand-gray">FIFO with Bradford Factor tie-break — lower Bradford scores get priority</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Bradford Factor Thresholds</Label>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-status-green" />
                                        <span>0–50: No action</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-status-amber" />
                                        <span>51–124: Verbal warning</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-status-red" />
                                        <span>125–399: Return-to-work interview</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-brand-primary" />
                                        <span>400–649: Formal escalation</span>
                                    </div>
                                    <div className="flex items-center gap-2 col-span-2">
                                        <span className="w-3 h-3 rounded-full bg-black dark:bg-white" />
                                        <span>650+: Investigation / review panel</span>
                                    </div>
                                </div>
                            </div>
                            <Button>Save Leave Config</Button>
                        </div>
                    </Card>
                )}

                {activeTab === 'notifications' && (
                    <Card>
                        <div className="space-y-6 max-w-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Productivity Ticket Alerts</p>
                                    <p className="text-xs text-brand-gray">Auto-ticket when FTE Loss exceeds threshold</p>
                                </div>
                                <Switch checked={ticketAlerts} onChange={setTicketAlerts} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">FTE Loss Threshold Breach</p>
                                    <p className="text-xs text-brand-gray">Alert when any team exceeds 30% FTE loss</p>
                                </div>
                                <Switch checked={fteLossAlerts} onChange={setFteLossAlerts} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">SLA Breach Warning</p>
                                    <p className="text-xs text-brand-gray">Alert when projected SL drops below target (80/20 or 90%)</p>
                                </div>
                                <Switch checked={slaBreach} onChange={setSlaBreach} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Bradford Factor Alerts</p>
                                    <p className="text-xs text-brand-gray">Notify when agent crosses a Bradford threshold</p>
                                </div>
                                <Switch checked={bradfordAlerts} onChange={setBradfordAlerts} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Payroll Approval Reminders</p>
                                    <p className="text-xs text-brand-gray">Reminder 3 days before payroll deadline</p>
                                </div>
                                <Switch checked={payrollReminders} onChange={setPayrollReminders} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Contract Expiry Warnings</p>
                                    <p className="text-xs text-brand-gray">30-day advance notice for expiring 6-month contracts</p>
                                </div>
                                <Switch checked={contractWarnings} onChange={setContractWarnings} />
                            </div>
                            <Button>Save Preferences</Button>
                        </div>
                    </Card>
                )}

                {activeTab === 'integrations' && (
                    <Card>
                        <div className="space-y-6 max-w-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Supabase</p>
                                    <p className="text-xs text-brand-gray">Database & real-time subscriptions</p>
                                </div>
                                <span className="text-xs font-medium text-status-green">Connected</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Telephony (NICE/Genesys)</p>
                                    <p className="text-xs text-brand-gray">ACD metrics, call recording, real-time queue data</p>
                                </div>
                                <span className="text-xs font-medium text-brand-gray">Not configured</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">HRIS Sync</p>
                                    <p className="text-xs text-brand-gray">Employee data, contracts, leave balances</p>
                                </div>
                                <span className="text-xs font-medium text-brand-gray">Not configured</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Chat Platform (Client B)</p>
                                    <p className="text-xs text-brand-gray">Live chat queue integration for ×3 concurrency tracking</p>
                                </div>
                                <span className="text-xs font-medium text-brand-gray">Not configured</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Slack / Teams Notifications</p>
                                    <p className="text-xs text-brand-gray">Send alerts and escalations to channels</p>
                                </div>
                                <span className="text-xs font-medium text-brand-gray">Not configured</span>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </DashboardTemplate>
    )
}
