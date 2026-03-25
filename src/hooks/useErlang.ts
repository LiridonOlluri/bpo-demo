'use client'

import { useMemo, useCallback, useState } from 'react'
import { calculateErlangC } from '@/lib/erlang'
import type { ErlangInput, ErlangOutput } from '@/types/erlang'

export function useErlang(defaultInput?: Partial<ErlangInput>) {
    const [input, setInput] = useState<ErlangInput>({
        callsPerInterval: 25,
        ahtSeconds: 300,
        intervalMinutes: 30,
        serviceLevelTarget: 0.80,
        serviceLevelSeconds: 20,
        shrinkagePercent: 0.30,
        maxOccupancy: 0.88,
        ...defaultInput,
    })

    const output: ErlangOutput = useMemo(() => calculateErlangC(input), [input])

    const updateInput = useCallback((updates: Partial<ErlangInput>) => {
        setInput((prev) => ({ ...prev, ...updates }))
    }, [])

    return { input, output, updateInput }
}
