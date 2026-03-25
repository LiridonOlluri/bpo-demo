import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ ticketId: string }> }
) {
    try {
        const { ticketId } = await params
        const body = await request.json()
        const { action_taken, action_category, follow_up_date } = body

        const supabase = await createSupabaseServerClient()

        const { data: ticket, error: updateError } = await supabase
            .from('productivity_tickets')
            .update({
                status: 'acknowledged',
                acknowledged_at: new Date().toISOString(),
                action_taken,
                action_category,
                follow_up_date,
            })
            .eq('id', ticketId)
            .select()
            .single()

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        const { error: auditError } = await supabase
            .from('audit_logs')
            .insert({
                entity_type: 'productivity_ticket',
                entity_id: ticketId,
                action: 'acknowledge',
                changes: { action_taken, action_category, follow_up_date },
            })

        if (auditError) {
            console.error('Audit log insert failed:', auditError.message)
        }

        return NextResponse.json(ticket)
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
