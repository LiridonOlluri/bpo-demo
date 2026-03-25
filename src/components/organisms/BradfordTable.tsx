'use client'

import { useMemo, useState } from 'react'
import { ArrowDownWideNarrow, Calendar, Palmtree } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { BradfordScoreBadge } from '@/components/molecules/BradfordScoreBadge'
import type { BradfordEntry } from '@/types/leave'

interface BradfordTableProps {
    entries: BradfordEntry[]
}

export function BradfordTable({ entries }: BradfordTableProps) {
    const [sortDesc, setSortDesc] = useState(true)

    const sorted = useMemo(
        () => [...entries].sort((a, b) => (sortDesc ? b.score - a.score : a.score - b.score)),
        [entries, sortDesc]
    )

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                        <th className="pb-3 pr-4 font-medium">Agent</th>
                        <th className="pb-3 pr-4 font-medium">Spells (S)</th>
                        <th className="pb-3 pr-4 font-medium">Days (D)</th>
                        <th
                            className="pb-3 pr-4 font-medium cursor-pointer select-none"
                            onClick={() => setSortDesc((p) => !p)}
                        >
                            <span className="inline-flex items-center gap-1">
                                Score (S²×D)
                                <ArrowDownWideNarrow className={`h-3 w-3 transition-transform ${sortDesc ? '' : 'rotate-180'}`} />
                            </span>
                        </th>
                        <th className="pb-3 pr-4 font-medium">Threshold</th>
                        <th className="pb-3 font-medium">Patterns</th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.map((entry) => (
                        <tr key={entry.agentId} className="border-b border-surface-border last:border-0">
                            <td className="py-3 pr-4 font-medium">{entry.agentId}</td>
                            <td className="py-3 pr-4">{entry.spells}</td>
                            <td className="py-3 pr-4">{entry.totalDays}</td>
                            <td className="py-3 pr-4">
                                <BradfordScoreBadge score={entry.score} threshold={entry.threshold} />
                            </td>
                            <td className="py-3 pr-4">
                                <Badge variant={entry.threshold === 'critical' ? 'red' : entry.threshold}>
                                    {entry.threshold.toUpperCase()}
                                </Badge>
                            </td>
                            <td className="py-3">
                                <div className="flex items-center gap-2">
                                    {entry.patterns.mondayFridayClustering && (
                                        <span title="Mon/Fri clustering">
                                            <Calendar className="h-4 w-4 text-status-amber" />
                                        </span>
                                    )}
                                    {entry.patterns.prePostHoliday && (
                                        <span title="Pre/post holiday">
                                            <Palmtree className="h-4 w-4 text-status-amber" />
                                        </span>
                                    )}
                                    {entry.patterns.frequencyFlag && (
                                        <Badge variant="red">Freq</Badge>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
