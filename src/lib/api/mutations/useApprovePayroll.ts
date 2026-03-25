import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '../queryKeys'

export function useApprovePayroll() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ period }: { period: string }) => {
            const { data, error } = await supabase
                .from('payroll_lines')
                .update({ approved: true, approved_at: new Date().toISOString() })
                .eq('period', period)
                .select()
            if (error) throw error
            return data
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.payroll.summary(variables.period) })
        },
    })
}
