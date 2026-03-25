import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { action } = body as { action: 'approve' | 'block' }

        if (!action || !['approve', 'block'].includes(action)) {
            return NextResponse.json(
                { error: 'Invalid action. Must be "approve" or "block".' },
                { status: 400 }
            )
        }

        const supabase = await createSupabaseServerClient()

        // Fetch the leave request
        const { data: leaveRequest, error: fetchError } = await supabase
            .from('leave_requests')
            .select('*')
            .eq('id', id)
            .single()

        if (fetchError || !leaveRequest) {
            return NextResponse.json(
                { error: 'Leave request not found' },
                { status: 404 }
            )
        }

        // Check capacity for the week
        const { data: capacity, error: capacityError } = await supabase
            .from('leave_capacity_weeks')
            .select('*')
            .eq('id', leaveRequest.capacity_week_id)
            .single()

        if (capacityError || !capacity) {
            return NextResponse.json(
                { error: 'Capacity week not found' },
                { status: 404 }
            )
        }

        let newStatus: string

        if (action === 'approve' && capacity.slots_used < capacity.slots_total) {
            newStatus = 'approved'

            // Update capacity slots
            const { error: capUpdateError } = await supabase
                .from('leave_capacity_weeks')
                .update({ slots_used: capacity.slots_used + 1 })
                .eq('id', capacity.id)

            if (capUpdateError) {
                return NextResponse.json(
                    { error: capUpdateError.message },
                    { status: 500 }
                )
            }

            // Update agent leave_used
            const { error: agentUpdateError } = await supabase
                .from('agents')
                .update({ leave_used: (leaveRequest.agent_leave_used ?? 0) + 1 })
                .eq('id', leaveRequest.agent_id)

            if (agentUpdateError) {
                console.error('Agent leave_used update failed:', agentUpdateError.message)
            }
        } else {
            newStatus = 'blocked'
        }

        // Update leave request status
        const { data: updated, error: updateError } = await supabase
            .from('leave_requests')
            .update({ status: newStatus })
            .eq('id', id)
            .select()
            .single()

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
