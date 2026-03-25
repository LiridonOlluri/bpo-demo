'use client'

import { Card } from '@/components/atoms/Card'
import { KpiGauge } from '@/components/molecules/KpiGauge'
import type { TeamLeadScore } from '@/types/performance'

interface TeamLeadScorecardProps {
    scores: TeamLeadScore[]
    /** e.g. filtered client context */
    subtitle?: string
}

export function TeamLeadScorecard({ scores, subtitle }: TeamLeadScorecardProps) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold">Team Lead Scorecard</h2>
                {subtitle && <p className="mt-1 text-sm text-brand-gray">{subtitle}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {scores.map((tl) => (
                    <Card key={tl.teamLeadId} className="space-y-4">
                        <h3 className="text-sm font-semibold">{tl.teamLeadName}</h3>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div>
                                <p className="text-brand-gray">Total</p>
                                <p className="text-lg font-bold">{tl.ticketsTotal}</p>
                            </div>
                            <div>
                                <p className="text-brand-gray">Resolved</p>
                                <p className="text-lg font-bold text-status-green">{tl.ticketsResolved}</p>
                            </div>
                            <div>
                                <p className="text-brand-gray">Recurring</p>
                                <p className="text-lg font-bold text-status-amber">{tl.ticketsRecurring}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-brand-gray">Avg Response</span>
                            <span className="font-medium">{tl.avgResponseMinutes} min</span>
                        </div>

                        <div className="flex justify-center">
                            <KpiGauge
                                value={tl.resolutionRate}
                                target={1}
                                label="Resolution Rate"
                                format="percent"
                                size={90}
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
