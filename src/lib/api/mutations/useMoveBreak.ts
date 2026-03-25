import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '../queryKeys'

export function useMoveBreak() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ breakId, newStart, newEnd }: { breakId: string; newStart: string; newEnd: string }) => {
            const { data, error } = await supabase
                .from('shift_breaks')
                .update({ break_start: newStart, break_end: newEnd })
                .eq('id', breakId)
                .select()
                .single()
            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.workforce.schedule('current') })
        },
    })
}
