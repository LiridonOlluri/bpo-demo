export type ShrinkageType = 'planned' | 'unplanned'
export type ShrinkageScope = 'internal' | 'external'

export interface ShrinkageCategory {
    id: string
    name: string
    type: ShrinkageType
    scope: ShrinkageScope
    percentage: number
    minutesPerDay: number
    isMoveable: boolean
    isActive: boolean
}

export interface ShrinkageConfig {
    categories: ShrinkageCategory[]
    totalPlanned: number
    totalUnplanned: number
    totalShrinkage: number
}
