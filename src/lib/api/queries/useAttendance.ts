import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '../queryKeys'

export function useLiveAttendance(date: string) {
    return useQuery({
        queryKey: queryKeys.attendance.live(),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('attendance_events')
                .select('*, agents(*, user_profiles(name))')
                .eq('work_date', date)
            if (error) throw error
            return data
        },
        refetchInterval: 30_000,
    })
}

export function useAttendanceByTeam(teamId: string, date: string) {
    return useQuery({
        queryKey: queryKeys.attendance.byTeam(teamId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('attendance_events')
                .select('*, agents!inner(*, user_profiles(name))')
                .eq('work_date', date)
                .eq('agents.team_id', teamId)
            if (error) throw error
            return data
        },
        refetchInterval: 30_000,
    })
}
