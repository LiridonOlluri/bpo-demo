'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/api/queryKeys'

export function useLiveMetricsRealtime() {
    const queryClient = useQueryClient()
    useEffect(() => {
        const channel = supabase
            .channel('live-metrics')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'live_metrics_snapshots',
            }, () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.performance.live() })
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [queryClient])
}

export function useTicketRealtime(teamId: string) {
    const queryClient = useQueryClient()
    useEffect(() => {
        const channel = supabase
            .channel(`tickets-${teamId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'productivity_tickets',
                filter: `team_id=eq.${teamId}`,
            }, () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.tickets.byTeam(teamId) })
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [teamId, queryClient])
}

export function useFteLossRealtime(teamId: string) {
    const queryClient = useQueryClient()
    useEffect(() => {
        const channel = supabase
            .channel(`fte-loss-${teamId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'fte_loss_snapshots',
                filter: `team_id=eq.${teamId}`,
            }, () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.performance.fteLoss(teamId) })
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [teamId, queryClient])
}
