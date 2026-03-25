import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createSupabaseServerClient()

        const { data, error } = await supabase
            .from('clients')
            .select('*')

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const supabase = await createSupabaseServerClient()

        const { data, error } = await supabase
            .from('clients')
            .insert(body)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 201 })
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
