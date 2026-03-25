import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/erlang-calculate`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                },
                body: JSON.stringify(body),
            }
        )

        if (!response.ok) {
            const errorText = await response.text()
            return NextResponse.json(
                { error: errorText },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
