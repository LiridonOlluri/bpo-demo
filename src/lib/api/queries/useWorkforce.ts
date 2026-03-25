import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '../queryKeys'

export function useWorkforceSchedule(weekId: string) {
    return useQuery({
        queryKey: queryKeys.workforce.schedule(weekId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('agent_schedules')
                .select('*, agents(*, user_profiles(name)), shifts(*)')
                .gte('work_date', weekId)
            if (error) throw error
            return data
        },
    })
}

export function useScheduleIntervals() {
    return useQuery({
        queryKey: queryKeys.workforce.intervals(),
        queryFn: async () => {
            const today = new Date().toISOString().split('T')[0]
            const { data, error } = await supabase
                .from('schedule_intervals')
                .select('*')
                .eq('work_date', today)
                .order('interval_start')
            if (error) throw error
            return data
        },
        refetchInterval: 30_000,
    })
}

export function useShrinkageConfig() {
    return useQuery({
        queryKey: queryKeys.workforce.shrinkage(),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('shrinkage_categories')
                .select('*')
                .order('sort_order')
            if (error) throw error
            return data
        },
    })
}
