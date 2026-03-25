'use client'

import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { StatCard } from '@/components/molecules/StatCard'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'

// QA evaluation data per team
const teamQA = [
    { team: 'Team A', lead: 'Sarah Chen', avgScore: 91, evaluations: 32, failed: 1, calibrationDelta: 1.2 },
    { team: 'Team B', lead: 'Marcus Jones', avgScore: 74, evaluations: 28, failed: 5, calibrationDelta: 4.8 },
    { team: 'Team C', lead: 'Priya Patel', avgScore: 89, evaluations: 30, failed: 2, calibrationDelta: 1.5 },
    { team: 'Team D', lead: 'James Wilson', avgScore: 86, evaluations: 26, failed: 2, calibrationDelta: 2.1 },
    { team: 'Team E', lead: 'Amara Okafor', avgScore: 88, evaluations: 24, failed: 1, calibrationDelta: 1.8 },
]

// Recent QA evaluations (sample)
const recentEvaluations = [
    { id: 'qa-001', agent: 'Ella Brooks', team: 'Team B', score: 62, category: 'Call Handling', evaluator: 'Sarah Chen', date: '25 Mar 2026', status: 'failed' },
    { id: 'qa-002', agent: 'Frank Osei', team: 'Team B', score: 68, category: 'Product Knowledge', evaluator: 'Marcus Jones', date: '25 Mar 2026', status: 'failed' },
    { id: 'qa-003', agent: 'Alice Monroe', team: 'Team A', score: 94, category: 'Call Handling', evaluator: 'Sarah Chen', date: '25 Mar 2026', status: 'passed' },
    { id: 'qa-004', agent: 'Grace Kim', team: 'Team B', score: 71, category: 'Compliance', evaluator: 'Marcus Jones', date: '24 Mar 2026', status: 'failed' },
    { id: 'qa-005', agent: 'James Patel', team: 'Team C', score: 92, category: 'Customer Experience', evaluator: 'Priya Patel', date: '24 Mar 2026', status: 'passed' },
    { id: 'qa-006', agent: 'Oscar Tran', team: 'Team E', score: 88, category: 'Technical Accuracy', evaluator: 'Amara Okafor', date: '24 Mar 2026', status: 'passed' },
]

export default function QualityPage() {
    const totalEvals = teamQA.reduce((s, t) => s + t.evaluations, 0)
    const totalFailed = teamQA.reduce((s, t) => s + t.failed, 0)
    const avgScore = Math.round(teamQA.reduce((s, t) => s + t.avgScore, 0) / teamQA.length)

    return (
        <DashboardTemplate
            title="Quality Assurance"
            statCards={
                <>
                    <StatCard label="Avg QA Score" value={`${avgScore}%`} trend="up" trendValue="+2.1% vs last month" variant={avgScore >= 85 ? 'green' : 'amber'} />
                    <StatCard label="Evaluations (MTD)" value={totalEvals} trend="up" trendValue="+18 this week" />
                    <StatCard label="Calibration Sessions" value={8} />
                    <StatCard label="Failed Evaluations" value={totalFailed} variant="red" trend="down" trendValue="Team B: 5 failures" />
                    <StatCard label="CSAT (Avg)" value="78%" variant="amber" />
                    <StatCard label="FCR" value="74%" variant="green" />
                </>
            }
        >
            <div className="space-y-6">
                {/* Team QA summary */}
                <Card padding={false}>
                    <div className="p-4 border-b border-surface-border">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">QA Score by Team</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                    <th className="p-4 font-medium">Team</th>
                                    <th className="p-4 font-medium">Lead</th>
                                    <th className="p-4 font-medium text-right">Avg Score</th>
                                    <th className="p-4 font-medium text-right">Evaluations</th>
                                    <th className="p-4 font-medium text-right">Failed</th>
                                    <th className="p-4 font-medium text-right">Calibration Δ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamQA.map((t) => (
                                    <tr key={t.team} className={`border-b border-surface-border last:border-0 hover:bg-surface-muted/50 ${t.avgScore < 80 ? 'bg-status-red/5' : ''}`}>
                                        <td className="p-4 font-medium">{t.team} {t.avgScore < 80 && <Badge variant="red">AT RISK</Badge>}</td>
                                        <td className="p-4">{t.lead}</td>
                                        <td className="p-4 text-right">
                                            <span className={`font-bold ${t.avgScore >= 85 ? 'text-status-green' : t.avgScore >= 75 ? 'text-status-amber' : 'text-status-red'}`}>
                                                {t.avgScore}%
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">{t.evaluations}</td>
                                        <td className="p-4 text-right">{t.failed > 0 ? <span className="text-status-red font-medium">{t.failed}</span> : '0'}</td>
                                        <td className="p-4 text-right">{t.calibrationDelta}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Recent evaluations */}
                <Card padding={false}>
                    <div className="p-4 border-b border-surface-border">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Recent Evaluations</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                    <th className="p-4 font-medium">Agent</th>
                                    <th className="p-4 font-medium">Team</th>
                                    <th className="p-4 font-medium">Category</th>
                                    <th className="p-4 font-medium text-right">Score</th>
                                    <th className="p-4 font-medium">Evaluator</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentEvaluations.map((ev) => (
                                    <tr key={ev.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                        <td className="p-4 font-medium">{ev.agent}</td>
                                        <td className="p-4">{ev.team}</td>
                                        <td className="p-4">{ev.category}</td>
                                        <td className="p-4 text-right">
                                            <span className={ev.score >= 80 ? 'text-status-green font-bold' : 'text-status-red font-bold'}>{ev.score}%</span>
                                        </td>
                                        <td className="p-4">{ev.evaluator}</td>
                                        <td className="p-4 text-xs">{ev.date}</td>
                                        <td className="p-4">
                                            <Badge variant={ev.status === 'passed' ? 'green' : 'red'}>{ev.status.toUpperCase()}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <AiFeatureLock title="Automated Interaction Scoring (AI-QM)" description="AI scores 100% of interactions automatically — no manual sampling required" />
                    <AiFeatureLock title="Real-Time Speech & Sentiment Analytics" description="Live sentiment meter and keyword detection during active calls" />
                    <AiFeatureLock title="AI Coaching Recommendations" description="Auto-generated coaching plans based on QA trends and peer benchmarks" />
                </div>
            </div>
        </DashboardTemplate>
    )
}
