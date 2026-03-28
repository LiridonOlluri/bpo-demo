'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MyTeamOpsPage() {
    const router = useRouter()
    useEffect(() => { router.replace('/my-team-ops/schedule') }, [router])
    return null
}
