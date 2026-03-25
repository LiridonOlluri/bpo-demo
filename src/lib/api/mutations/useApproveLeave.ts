import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '../queryKeys'

export function useApproveLeave() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, action }: { id: string; action: 'approve' | 'block' }) => {
            const response = await fetch(`/api/leave/requests/${id}/approve`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            })
            if (!response.ok) throw new Error('Failed to process leave request')
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leave.requests() })
            queryClient.invalidateQueries({ queryKey: queryKeys.leave.capacity() })
        },
    })
}
