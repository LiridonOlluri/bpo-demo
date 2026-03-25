import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'

interface AcknowledgePayload {
    ticketId: string
    actionCategory: string
    actionTaken: string
    followUpDate: string
}

export function useAcknowledgeTicket() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (payload: AcknowledgePayload) => {
            const response = await fetch(`/api/tickets/${payload.ticketId}/acknowledge`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (!response.ok) throw new Error('Failed to acknowledge ticket')
            return response.json()
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.tickets.byId(variables.ticketId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.tickets.scorecard() })
        },
    })
}
