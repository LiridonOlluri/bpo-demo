import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '../queryKeys'

export function usePayrollSummary(period: string) {
    return useQuery({
        queryKey: queryKeys.payroll.summary(period),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('payroll_lines')
                .select('*, agents(*, user_profiles(name))')
                .eq('period', period)
            if (error) throw error
            return data
        },
    })
}

export function usePayrollByAgent(agentId: string) {
    return useQuery({
        queryKey: queryKeys.payroll.byAgent(agentId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('payroll_lines')
                .select('*')
                .eq('agent_id', agentId)
                .order('period', { ascending: false })
            if (error) throw error
            return data
        },
    })
}
