import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '../queryKeys'

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
