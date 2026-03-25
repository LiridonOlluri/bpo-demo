import type { ShrinkageCategory, ShrinkageConfig } from '@/types/shrinkage'

export function calculateShrinkage(categories: ShrinkageCategory[]): ShrinkageConfig {
    const active = categories.filter((c) => c.isActive)
    const totalPlanned = active
        .filter((c) => c.type === 'planned')
        .reduce((sum, c) => sum + c.percentage, 0)
    const totalUnplanned = active
        .filter((c) => c.type === 'unplanned')
        .reduce((sum, c) => sum + c.percentage, 0)

    return {
        categories,
        totalPlanned,
        totalUnplanned,
        totalShrinkage: totalPlanned + totalUnplanned,
    }
}
