import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '../queryKeys'

export function useApproveOvertime() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'declined' }) => {
            const { data, error } = await supabase
                .from('overtime_requests')
                .update({ status, responded_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single()
            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.workforce.all })
        },
    })
}
