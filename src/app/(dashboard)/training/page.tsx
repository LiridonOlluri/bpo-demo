'use client'

import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { StatCard } from '@/components/molecules/StatCard'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'

// Client-specific certifications matching documentation
const certifications = [
    { id: 'cert-001', name: 'Product Knowledge — Client A E-Commerce', client: 'Client A', type: 'E-Learning', enrolled: 35, completed: 30, avgScore: 88, status: 'active' },
    { id: 'cert-002', name: 'CRM System — Client A', client: 'Client A', type: 'E-Learning', enrolled: 35, completed: 28, avgScore: 85, status: 'active' },
    { id: 'cert-003', name: 'Voice Skills & Call Handling', client: 'Client A', type: 'Instructor-Led', enrolled: 35, completed: 35, avgScore: 91, status: 'completed' },
    { id: 'cert-004', name: 'Technical Troubleshooting — Client B', client: 'Client B', type: 'E-Learning', enrolled: 15, completed: 12, avgScore: 82, status: 'active' },
    { id: 'cert-005', name: 'Tier 1/2 Support Frameworks', client: 'Client B', type: 'Blended', enrolled: 15, completed: 10, avgScore: 79, status: 'active' },
    { id: 'cert-006', name: 'Chat Handling & Multi-Session', client: 'Client B', type: 'Workshop', enrolled: 15, completed: 15, avgScore: 87, status: 'completed' },
    { id: 'cert-007', name: 'GDPR & Data Protection', client: 'All', type: 'E-Learning', enrolled: 50, completed: 46, avgScore: 90, status: 'active' },
    { id: 'cert-008', name: 'New Agent Induction (Nesting)', client: 'All', type: 'Blended', enrolled: 4, completed: 1, avgScore: 0, status: 'active' },
    { id: 'cert-009', name: 'De-escalation Techniques', client: 'All', type: 'Workshop', enrolled: 20, completed: 0, avgScore: 0, status: 'scheduled' },
]

const statusVariant: Record<string, 'green' | 'amber' | 'blue' | 'grey'> = {
    active: 'blue',
    completed: 'green',
    scheduled: 'amber',
    archived: 'grey',
}

// Ramp-up efficiency curve from documentation
const rampUpStages = [
    { week: 'Week 1–2', efficiency: '50%', label: 'Nesting — supervised', color: 'bg-status-red' },
    { week: 'Week 3–4', efficiency: '70%', label: 'Supported — reduced load', color: 'bg-status-amber' },
    { week: 'Week 5–6', efficiency: '85%', label: 'Near-ready — standard load', color: 'bg-brand-primary' },
    { week: 'Week 7–8', efficiency: '95%', label: 'Proficient — monitored', color: 'bg-status-green' },
    { week: 'Week 9+', efficiency: '100%', label: 'Fully productive', color: 'bg-status-green' },
]

export default function TrainingPage() {
    const activeCourses = certifications.filter(c => c.status === 'active').length
    const totalCompleted = certifications.reduce((sum, c) => sum + c.completed, 0)
    const totalEnrolled = certifications.reduce((sum, c) => sum + c.enrolled, 0)
    const avgScore = certifications.filter(c => c.avgScore > 0)
    const overallAvg = avgScore.length > 0 ? Math.round(avgScore.reduce((s, c) => s + c.avgScore, 0) / avgScore.length) : 0

    return (
        <DashboardTemplate
            title="Training & Certifications"
            statCards={
                <>
                    <StatCard label="Active Courses" value={activeCourses} />
                    <StatCard label="Certifications Earned" value={totalCompleted} trend="up" trendValue={`of ${totalEnrolled} enrolled`} variant="green" />
                    <StatCard label="Pending" value={totalEnrolled - totalCompleted} variant="amber" />
                    <StatCard label="Avg Assessment Score" value={`${overallAvg}%`} variant="green" />
                    <StatCard label="Agents in Nesting" value={4} variant="amber" />
                </>
            }
        >
            <div className="space-y-6">
                {/* Ramp-up efficiency curve */}
                <Card>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray mb-4">New Agent Ramp-Up Efficiency Curve</h2>
                    <div className="flex items-end gap-3 h-40">
                        {rampUpStages.map((stage) => (
                            <div key={stage.week} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-xs font-bold">{stage.efficiency}</span>
                                <div
                                    className={`w-full rounded-t ${stage.color} opacity-80`}
                                    style={{ height: `${parseInt(stage.efficiency)}%` }}
                                />
                                <span className="text-[10px] text-brand-gray text-center mt-1">{stage.week}</span>
                                <span className="text-[9px] text-brand-gray text-center">{stage.label}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-brand-gray mt-3">
                        4 agents currently in Week 1-2 nesting. Erlang C staffing model accounts for 50% efficiency during this phase.
                    </p>
                </Card>

                {/* Client-specific certifications */}
                <Card padding={false}>
                    <div className="p-4 border-b border-surface-border">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Client-Specific Certifications</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                    <th className="p-4 font-medium">Module</th>
                                    <th className="p-4 font-medium">Client</th>
                                    <th className="p-4 font-medium">Type</th>
                                    <th className="p-4 font-medium text-right">Enrolled</th>
                                    <th className="p-4 font-medium text-right">Completed</th>
                                    <th className="p-4 font-medium text-right">Avg Score</th>
                                    <th className="p-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {certifications.map((c) => (
                                    <tr key={c.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                        <td className="p-4 font-medium">{c.name}</td>
                                        <td className="p-4">
                                            <Badge variant={c.client === 'Client A' ? 'blue' : c.client === 'Client B' ? 'green' : 'grey'}>
                                                {c.client}
                                            </Badge>
                                        </td>
                                        <td className="p-4">{c.type}</td>
                                        <td className="p-4 text-right">{c.enrolled}</td>
                                        <td className="p-4 text-right">{c.completed}</td>
                                        <td className="p-4 text-right">{c.avgScore > 0 ? `${c.avgScore}%` : '—'}</td>
                                        <td className="p-4">
                                            <Badge variant={statusVariant[c.status]}>{c.status.toUpperCase()}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* AI Feature Lock */}
                <AiFeatureLock
                    title="AI Skill-Gap Recommender"
                    description="Automatically identifies certification gaps per agent and suggests targeted micro-learning paths based on QA scores, client requirements, and performance trends."
                />
            </div>
        </DashboardTemplate>
    )
}
