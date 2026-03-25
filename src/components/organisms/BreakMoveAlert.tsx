'use client'

import { AlertBanner } from '@/components/molecules/AlertBanner'
import { Clock, ArrowRight } from 'lucide-react'

interface BreakMoveAlertProps {
    agentName: string
    originalTime: string
    newTime: string
    reason: string
}

export function BreakMoveAlert({ agentName, originalTime, newTime, reason }: BreakMoveAlertProps) {
    return (
        <AlertBanner
            variant="amber"
            message={`${agentName}: Break moved from ${originalTime} to ${newTime} — ${reason}`}
        />
    )
}
