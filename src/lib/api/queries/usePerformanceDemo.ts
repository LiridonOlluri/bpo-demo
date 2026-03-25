'use client'

import { useQuery } from '@tanstack/react-query'
import type { PerformanceDemoPayload } from '@/types/executive'
import { queryKeys } from '@/lib/api/queryKeys'

async function fetchPerformanceDemo(): Promise<PerformanceDemoPayload> {
    const res = await fetch('/api/performance/demo')
    if (!res.ok) throw new Error('Failed to load performance demo')
    return res.json()
}

export function usePerformanceDemo() {
    return useQuery({
        queryKey: queryKeys.performance.demo(),
        queryFn: fetchPerformanceDemo,
    })
}
