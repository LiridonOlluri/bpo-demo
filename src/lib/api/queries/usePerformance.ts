import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '../queryKeys'

export function useLiveMetrics() {
    return useQuery({
        queryKey: queryKeys.performance.live(),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('live_metrics_snapshots')
                .select('*')
                .order('snapshot_at', { ascending: false })
                .limit(1)
                .single()
            if (error) throw error
            return data
        },
        refetchInterval: 15_000,
        staleTime: 10_000,
    })
}

export function useFteLoss(teamId?: string) {
    return useQuery({
        queryKey: queryKeys.performance.fteLoss(teamId),
        queryFn: async () => {
            let query = supabase
                .from('fte_loss_snapshots')
                .select('*')
                .order('snapshot_at', { ascending: false })
                .limit(1)
            if (teamId) query = query.eq('team_id', teamId)
            const { data, error } = await query.single()
            if (error) throw error
            return data
        },
        refetchInterval: 30_000,
    })
}

export function useFteLossAllTeams() {
    return useQuery({
        queryKey: queryKeys.performance.fteLossAll(),
        queryFn: async () => {
            const { data: teams } = await supabase.from('teams').select('id')
            const results = await Promise.all(
                (teams ?? []).map(async (team) => {
                    const { data } = await supabase
                        .from('fte_loss_snapshots')
                        .select('*')
                        .eq('team_id', team.id)
                        .order('snapshot_at', { ascending: false })
                        .limit(1)
                        .single()
                    return data
                })
            )
            return results.filter(Boolean)
        },
        refetchInterval: 30_000,
    })
}
