'use client'

import { useRole } from '@/hooks/useRole'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { StatCard } from '@/components/molecules/StatCard'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import { toast } from 'sonner'
import { CheckCircle2, BookOpen, GraduationCap, Star } from 'lucide-react'

// ─── L1 — Own Training ────────────────────────────────────────────────────────
const L1_DATA = {
    phase: 'Production' as 'Training' | 'Nesting' | 'Production',
    nestingBuddy: null,
    progressPct: 100,
    nextGate: 'Fully productive',
    certifications: [
        { module: 'Product Knowledge — Client A E-Commerce', client: 'Client A', status: 'Active', score: 88, expiry: '2027-03' },
        { module: 'CRM System — Client A', client: 'Client A', status: 'Active', score: 85, expiry: '2027-03' },
        { module: 'Voice Skills & Call Handling', client: 'Client A', status: 'Active', score: 91, expiry: '2027-06' },
        { module: 'GDPR & Data Protection', client: 'All', status: 'Active', score: 92, expiry: '2026-12' },
    ],
    microLearning: [
        { title: 'New Product Catalogue Q1 2026', duration: '20 min', status: 'Assigned', due: '2026-04-04' },
        { title: 'Updated Returns Policy — Client A', duration: '10 min', status: 'Completed', due: '2026-03-20' },
        { title: 'Call Handling Refresher', duration: '15 min', status: 'Completed', due: '2026-03-15' },
        { title: 'GDPR Annual Refresher', duration: '30 min', status: 'Completed', due: '2026-03-01' },
    ],
    nextAssessment: '2026-04-15',
    assessmentModule: 'Q1 Knowledge Check — Client A',
}

const PHASE_STEPS = ['Training', 'Nesting', 'Production']
const PHASE_PCTS: Record<string, number> = { Training: 0, Nesting: 50, Production: 100 }

function L1Training() {
    const phase = L1_DATA.phase
    const activeIdx = PHASE_STEPS.indexOf(phase)

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Current Phase" value={phase} variant="green" />
                <StatCard label="Certifications" value={L1_DATA.certifications.filter(c => c.status === 'Active').length} variant="green" trendValue="Active" />
                <StatCard label="Assigned Modules" value={L1_DATA.microLearning.filter(m => m.status === 'Assigned').length} variant={L1_DATA.microLearning.filter(m => m.status === 'Assigned').length > 0 ? 'amber' : 'green'} trendValue="Pending" />
                <StatCard label="Next Assessment" value={L1_DATA.nextAssessment} variant="default" />
            </div>

            {/* Training Phase Indicator */}
            <Card>
                <div className="flex items-center gap-2 mb-4">
                    <GraduationCap size={17} className="text-brand-gray" />
                    <h2 className="text-sm font-semibold">Training Phase</h2>
                </div>
                <div className="flex items-center gap-0 mb-4">
                    {PHASE_STEPS.map((step, i) => (
                        <div key={step} className="flex items-center flex-1">
                            <div className={`flex flex-col items-center flex-1 ${i <= activeIdx ? 'text-green-700' : 'text-brand-gray'}`}>
                                <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${i < activeIdx ? 'bg-green-600 border-green-600 text-white' : i === activeIdx ? 'bg-white border-green-600 text-green-600' : 'bg-white border-zinc-300 text-zinc-400'}`}>
                                    {i < activeIdx ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{i + 1}</span>}
                                </div>
                                <p className={`mt-1 text-xs font-medium ${i === activeIdx ? 'text-green-700' : i < activeIdx ? 'text-green-600' : 'text-brand-gray'}`}>{step}</p>
                                {i === activeIdx && <p className="text-[10px] text-brand-gray">{L1_DATA.nextGate}</p>}
                            </div>
                            {i < PHASE_STEPS.length - 1 && (
                                <div className={`h-0.5 flex-1 ${i < activeIdx ? 'bg-green-500' : 'bg-zinc-200'}`} />
                            )}
                        </div>
                    ))}
                </div>
                <ProgressBar value={PHASE_PCTS[phase]} />
                <p className="mt-2 text-xs text-brand-gray">{PHASE_PCTS[phase]}% through training programme — {phase} phase</p>
                {L1_DATA.nestingBuddy && (
                    <p className="mt-1 text-xs text-brand-gray">Nesting buddy: <span className="font-medium">{L1_DATA.nestingBuddy}</span></p>
                )}
            </Card>

            {/* Certifications */}
            <Card padding={false}>
                <div className="border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">My Certifications</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                <th className="p-3 font-medium">Module</th>
                                <th className="p-3 font-medium">Client</th>
                                <th className="p-3 font-medium text-center">Status</th>
                                <th className="p-3 font-medium text-right">Score</th>
                                <th className="p-3 font-medium">Expiry</th>
                            </tr>
                        </thead>
                        <tbody>
                            {L1_DATA.certifications.map((c) => (
                                <tr key={c.module} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                    <td className="p-3 font-medium text-xs">{c.module}</td>
                                    <td className="p-3"><Badge variant={c.client === 'Client A' ? 'blue' : c.client === 'Client B' ? 'green' : 'grey'}>{c.client}</Badge></td>
                                    <td className="p-3 text-center"><Badge variant={c.status === 'Active' ? 'green' : c.status === 'Expired' ? 'red' : 'amber'}>{c.status}</Badge></td>
                                    <td className="p-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Star size={11} className={c.score >= 90 ? 'text-yellow-500' : 'text-brand-gray'} />
                                            <span className={c.score >= 85 ? 'font-semibold text-status-green' : 'text-status-amber'}>{c.score}%</span>
                                        </div>
                                    </td>
                                    <td className="p-3 text-xs text-brand-gray">{c.expiry}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Assigned Micro-Learning */}
            <Card>
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={16} className="text-brand-gray" />
                    <h2 className="text-sm font-semibold">Assigned Micro-Learning Modules</h2>
                </div>
                <div className="space-y-2">
                    {L1_DATA.microLearning.map((m) => (
                        <div key={m.title} className="flex items-center justify-between rounded-lg border border-surface-border px-3 py-2 text-sm">
                            <div>
                                <p className="font-medium text-xs">{m.title}</p>
                                <p className="text-[11px] text-brand-gray">{m.duration} · Due {m.due}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={m.status === 'Completed' ? 'green' : 'amber'}>{m.status}</Badge>
                                {m.status === 'Assigned' && (
                                    <Button size="sm" variant="ghost" className="border border-surface-border" onClick={() => toast.info(`Opening: ${m.title}`)}>
                                        Start
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Next Assessment */}
            <Card className="border-blue-200 bg-blue-50/30">
                <h3 className="mb-2 text-sm font-semibold">Next Assessment Due</h3>
                <p className="text-sm"><span className="font-medium">{L1_DATA.assessmentModule}</span></p>
                <p className="text-xs text-brand-gray mt-0.5">Due: {L1_DATA.nextAssessment}</p>
                <Button size="sm" className="mt-3" onClick={() => toast.info('Opening assessment…')}>
                    Start Assessment
                </Button>
            </Card>

            {/* KB Access */}
            <Card>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold">Knowledge Base</h3>
                        <p className="text-xs text-brand-gray mt-0.5">Access product guides, scripts, policies, and FAQs</p>
                    </div>
                    <Button variant="ghost" className="border border-surface-border" onClick={() => toast.info('Opening Knowledge Base…')}>
                        Open KB →
                    </Button>
                </div>
            </Card>

            {/* AI Feature (greyed) */}
            <AiFeatureLock
                title="AI Skill-Gap Recommender"
                description="Automatically identifies certification gaps and suggests targeted micro-learning paths based on QA scores, client requirements, and performance trends."
            />
        </div>
    )
}

// ─── L2+ — Team Training Overview ────────────────────────────────────────────
const TEAM_CERTS = [
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

const rampUpStages = [
    { week: 'Week 1–2', efficiency: '50%', label: 'Nesting — supervised', color: 'bg-status-red' },
    { week: 'Week 3–4', efficiency: '70%', label: 'Supported — reduced load', color: 'bg-status-amber' },
    { week: 'Week 5–6', efficiency: '85%', label: 'Near-ready — standard load', color: 'bg-brand-primary' },
    { week: 'Week 7–8', efficiency: '95%', label: 'Proficient — monitored', color: 'bg-status-green' },
    { week: 'Week 9+', efficiency: '100%', label: 'Fully productive', color: 'bg-status-green' },
]

function TeamTraining() {
    const activeCourses = TEAM_CERTS.filter(c => c.status === 'active').length
    const totalCompleted = TEAM_CERTS.reduce((sum, c) => sum + c.completed, 0)
    const totalEnrolled = TEAM_CERTS.reduce((sum, c) => sum + c.enrolled, 0)
    const avgScore = TEAM_CERTS.filter(c => c.avgScore > 0)
    const overallAvg = avgScore.length > 0 ? Math.round(avgScore.reduce((s, c) => s + c.avgScore, 0) / avgScore.length) : 0

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <StatCard label="Active Courses" value={activeCourses} />
                <StatCard label="Certifications Earned" value={totalCompleted} trend="up" trendValue={`of ${totalEnrolled} enrolled`} variant="green" />
                <StatCard label="Pending" value={totalEnrolled - totalCompleted} variant="amber" />
                <StatCard label="Avg Assessment Score" value={`${overallAvg}%`} variant="green" />
                <StatCard label="Agents in Nesting" value={4} variant="amber" />
            </div>

            <Card>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray mb-4">New Agent Ramp-Up Efficiency Curve</h2>
                <div className="flex items-end gap-3 h-40">
                    {rampUpStages.map((stage) => (
                        <div key={stage.week} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-xs font-bold">{stage.efficiency}</span>
                            <div className={`w-full rounded-t ${stage.color} opacity-80`} style={{ height: `${parseInt(stage.efficiency)}%` }} />
                            <span className="text-[10px] text-brand-gray text-center mt-1">{stage.week}</span>
                        </div>
                    ))}
                </div>
            </Card>

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
                            {TEAM_CERTS.map((c) => (
                                <tr key={c.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                    <td className="p-4 font-medium">{c.name}</td>
                                    <td className="p-4"><Badge variant={c.client === 'Client A' ? 'blue' : c.client === 'Client B' ? 'green' : 'grey'}>{c.client}</Badge></td>
                                    <td className="p-4">{c.type}</td>
                                    <td className="p-4 text-right">{c.enrolled}</td>
                                    <td className="p-4 text-right">{c.completed}</td>
                                    <td className="p-4 text-right">{c.avgScore > 0 ? `${c.avgScore}%` : '—'}</td>
                                    <td className="p-4"><Badge variant={c.status === 'active' ? 'blue' : c.status === 'completed' ? 'green' : 'amber'}>{c.status.toUpperCase()}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <AiFeatureLock
                title="AI Skill-Gap Recommender"
                description="Automatically identifies certification gaps per agent and suggests targeted micro-learning paths based on QA scores, client requirements, and performance trends."
            />
        </div>
    )
}

// ─── Page root ────────────────────────────────────────────────────────────────
export default function TrainingPage() {
    const { level } = useRole()

    return (
        <div className="space-y-1">
            <div className="mb-4">
                <h1 className="text-xl font-bold tracking-tight">Training</h1>
                <p className="text-sm text-brand-gray">
                    {level === 1 ? 'My training phase · certifications · assigned modules · KB access' : 'Team training overview · certifications · ramp-up curve'}
                </p>
            </div>
            {level === 1 ? <L1Training /> : <TeamTraining />}
        </div>
    )
}
