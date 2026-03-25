import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '../queryKeys'

export function useClients() {
    return useQuery({
        queryKey: queryKeys.clients.all,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
            if (error) throw error
            return data
        },
    })
}

export function useClient(id: string) {
    return useQuery({
        queryKey: queryKeys.clients.byId(id),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .eq('id', id)
                .single()
            if (error) throw error
            return data
        },
        enabled: !!id,
    })
}
