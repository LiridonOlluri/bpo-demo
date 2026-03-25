import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '../queryKeys'

export function useLeaveCapacity() {
    return useQuery({
        queryKey: queryKeys.leave.capacity(),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('leave_capacity_weeks')
                .select('*')
                .order('start_date')
            if (error) throw error
            return data
        },
    })
}

export function useLeaveRequests(status?: string) {
    return useQuery({
        queryKey: queryKeys.leave.requests(status),
        queryFn: async () => {
            let query = supabase
                .from('leave_requests')
                .select('*, agents(*, user_profiles(name))')
                .order('created_at', { ascending: false })
            if (status) query = query.eq('status', status)
            const { data, error } = await query
            if (error) throw error
            return data
        },
    })
}

export function useBradfordScores(teamId?: string) {
    return useQuery({
        queryKey: queryKeys.leave.bradford(teamId),
        queryFn: async () => {
            let query = supabase.from('bradford_scores').select('*')
            if (teamId) query = query.eq('team_id', teamId)
            const { data, error } = await query
            if (error) throw error
            return data
        },
    })
}
