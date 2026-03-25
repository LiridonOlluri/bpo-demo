import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '../queryKeys'

export function useAgents() {
    return useQuery({
        queryKey: queryKeys.agents.all,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('agents')
                .select('*, user_profiles(name, email), teams(name)')
            if (error) throw error
            return data
        },
    })
}

export function useAgentsByTeam(teamId: string) {
    return useQuery({
        queryKey: queryKeys.agents.byTeam(teamId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('agents')
                .select('*, user_profiles(name, email)')
                .eq('team_id', teamId)
            if (error) throw error
            return data
        },
        enabled: !!teamId,
    })
}
