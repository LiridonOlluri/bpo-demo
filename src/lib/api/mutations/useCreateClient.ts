import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '../queryKeys'

export function useCreateClient() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (clientData: Record<string, unknown>) => {
            const { data, error } = await supabase
                .from('clients')
                .insert(clientData)
                .select()
                .single()
            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
        },
    })
}
