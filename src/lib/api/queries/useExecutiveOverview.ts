'use client'

import { useQuery } from '@tanstack/react-query'
import type { ExecutiveClientFilter, ExecutiveOverviewBundle, ExecutivePeriod } from '@/types/executive'
import { queryKeys } from '@/lib/api/queryKeys'

async function fetchExecutiveOverview(client: ExecutiveClientFilter, period: ExecutivePeriod): Promise<ExecutiveOverviewBundle> {
    const q = new URLSearchParams({ client, period })
    const res = await fetch(`/api/executive/overview?${q.toString()}`)
    if (!res.ok) throw new Error('Failed to load executive overview')
    return res.json()
}

export function useExecutiveOverview(client: ExecutiveClientFilter, period: ExecutivePeriod) {
    return useQuery({
        queryKey: queryKeys.executive.overview(client, period),
        queryFn: () => fetchExecutiveOverview(client, period),
    })
}
