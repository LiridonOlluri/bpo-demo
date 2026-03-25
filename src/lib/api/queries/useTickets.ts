import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '../queryKeys'

export function useTicketsByTeam(teamId: string) {
    return useQuery({
        queryKey: queryKeys.tickets.byTeam(teamId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('productivity_tickets')
                .select('*')
                .eq('team_id', teamId)
                .order('created_at', { ascending: false })
            if (error) throw error
            return data
        },
        enabled: !!teamId,
    })
}

export function useTicket(id: string) {
    return useQuery({
        queryKey: queryKeys.tickets.byId(id),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('productivity_tickets')
                .select('*')
                .eq('id', id)
                .single()
            if (error) throw error
            return data
        },
        enabled: !!id,
    })
}

export function useTicketScorecard() {
    return useQuery({
        queryKey: queryKeys.tickets.scorecard(),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('productivity_tickets')
                .select('team_lead_id, status, created_at, acknowledged_at, resolved_at, is_recurring')
            if (error) throw error
            return data
        },
    })
}
