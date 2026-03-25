import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const period = searchParams.get('period')

        if (!period) {
            return NextResponse.json(
                { error: 'Missing required query parameter: period' },
                { status: 400 }
            )
        }

        const supabase = await createSupabaseServerClient()

        const { data, error } = await supabase
            .from('payroll_lines')
            .select('*, agents(*)')
            .eq('period', period)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
