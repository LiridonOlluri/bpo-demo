'use client'

import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { ShrinkageBreakdown } from '@/components/organisms/ShrinkageBreakdown'
import { StatCard } from '@/components/molecules/StatCard'
import type { ShrinkageCategory } from '@/types/shrinkage'

const mockCategories: ShrinkageCategory[] = [
    // Planned
    { id: 'p1', name: 'Paid Breaks', type: 'planned', scope: 'internal', percentage: 6.3, minutesPerDay: 30, isMoveable: true, isActive: true },
    { id: 'p2', name: 'Team Meetings', type: 'planned', scope: 'internal', percentage: 2.1, minutesPerDay: 10, isMoveable: true, isActive: true },
    { id: 'p3', name: 'One-to-One Coaching', type: 'planned', scope: 'internal', percentage: 1.5, minutesPerDay: 7, isMoveable: true, isActive: true },
    { id: 'p4', name: 'Training & Upskill', type: 'planned', scope: 'internal', percentage: 3.2, minutesPerDay: 15, isMoveable: true, isActive: true },
    { id: 'p5', name: 'System Downtime', type: 'planned', scope: 'external', percentage: 0.8, minutesPerDay: 4, isMoveable: false, isActive: true },
    { id: 'p6', name: 'Comfort Breaks', type: 'planned', scope: 'internal', percentage: 2.5, minutesPerDay: 12, isMoveable: false, isActive: true },
    { id: 'p7', name: 'Wellness Activities', type: 'planned', scope: 'internal', percentage: 0.5, minutesPerDay: 2, isMoveable: true, isActive: true },
    { id: 'p8', name: 'Floor Support / Supervision', type: 'planned', scope: 'internal', percentage: 1.0, minutesPerDay: 5, isMoveable: true, isActive: true },
    // Unplanned
    { id: 'u1', name: 'Unplanned Absence', type: 'unplanned', scope: 'internal', percentage: 4.0, minutesPerDay: 19, isMoveable: false, isActive: true },
    { id: 'u2', name: 'Lateness / Tardiness', type: 'unplanned', scope: 'internal', percentage: 1.5, minutesPerDay: 7, isMoveable: false, isActive: true },
    { id: 'u3', name: 'Extended Breaks', type: 'unplanned', scope: 'internal', percentage: 1.2, minutesPerDay: 6, isMoveable: false, isActive: true },
    { id: 'u4', name: 'Idle / Unproductive Time', type: 'unplanned', scope: 'internal', percentage: 2.0, minutesPerDay: 10, isMoveable: false, isActive: true },
    { id: 'u5', name: 'IT Issues', type: 'unplanned', scope: 'external', percentage: 0.6, minutesPerDay: 3, isMoveable: false, isActive: true },
    { id: 'u6', name: 'NCNS (No Call No Show)', type: 'unplanned', scope: 'internal', percentage: 0.8, minutesPerDay: 4, isMoveable: false, isActive: true },
    { id: 'u7', name: 'Attrition Buffer', type: 'unplanned', scope: 'internal', percentage: 1.5, minutesPerDay: 7, isMoveable: false, isActive: true },
    { id: 'u8', name: 'Sick Leave (Short-Term)', type: 'unplanned', scope: 'internal', percentage: 1.8, minutesPerDay: 9, isMoveable: false, isActive: true },
]

const totalPlanned = mockCategories.filter((c) => c.type === 'planned').reduce((s, c) => s + c.percentage, 0)
const totalUnplanned = mockCategories.filter((c) => c.type === 'unplanned').reduce((s, c) => s + c.percentage, 0)
const totalShrinkage = totalPlanned + totalUnplanned

export default function ShrinkagePage() {
    return (
        <DashboardTemplate
            title="Shrinkage Configuration"
            statCards={
                <>
                    <StatCard label="Total Shrinkage" value={`${totalShrinkage.toFixed(1)}%`} variant={totalShrinkage > 35 ? 'red' : totalShrinkage > 25 ? 'amber' : 'green'} />
                    <StatCard label="Planned" value={`${totalPlanned.toFixed(1)}%`} variant="default" />
                    <StatCard label="Unplanned" value={`${totalUnplanned.toFixed(1)}%`} variant={totalUnplanned > 15 ? 'red' : 'amber'} />
                    <StatCard label="Categories" value={mockCategories.filter((c) => c.isActive).length} variant="default" />
                </>
            }
        >
            <ShrinkageBreakdown categories={mockCategories} />
        </DashboardTemplate>
    )
}
