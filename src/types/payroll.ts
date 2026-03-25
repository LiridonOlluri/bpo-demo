export interface PayrollLine {
    agentId: string
    agentName: string
    period: string
    baseHours: number
    overtimeHours: number
    overtimeRate: number
    overtimeCost: number
    nightDiffHours: number
    nightDiffPremium: number
    nightDiffCost: number
    tardinessDeductionMinutes: number
    tardinessDeductionAmount: number
    paidLeaveDays: number
    paidLeaveAmount: number
    unpaidLeaveDays: number
    attendanceBonusEligible: boolean
    attendanceBonusAmount: number
    qaBonusEligible: boolean
    qaBonusAmount: number
    grossPay: number
    clientAllocation: { clientId: string; percentage: number; cost: number }[]
}
