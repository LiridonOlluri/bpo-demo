import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface ErlangRequest {
    callsPerHour: number;
    ahtSeconds: number;
    targetSL: number;
    targetSeconds: number;
    shrinkagePercent: number;
    maxOccupancy?: number;
}

function erlangC(agents: number, traffic: number): number {
    if (agents <= traffic) return 1;
    let sum = 0;
    for (let k = 0; k < agents; k++) {
        sum += Math.pow(traffic, k) / factorial(k);
    }
    const last = Math.pow(traffic, agents) / factorial(agents);
    const pWait = last / (last + (1 - traffic / agents) * sum);
    return Math.max(0, Math.min(1, pWait));
}

function factorial(n: number): number {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

function computeServiceLevel(agents: number, traffic: number, targetSeconds: number, ahtSeconds: number): number {
    const pw = erlangC(agents, traffic);
    const sl = 1 - pw * Math.exp(-(agents - traffic) * (targetSeconds / ahtSeconds));
    return Math.max(0, Math.min(1, sl));
}

serve(async (req: Request) => {
    try {
        const body: ErlangRequest = await req.json();
        const { callsPerHour, ahtSeconds, targetSL, targetSeconds, shrinkagePercent, maxOccupancy = 0.88 } = body;

        const trafficIntensity = (callsPerHour * ahtSeconds) / 3600;
        let rawAgents = Math.ceil(trafficIntensity);
        let sl = 0;
        let occupancy = 1;
        let asa = 999;

        // Find minimum agents for target SL
        while (rawAgents < 5000) {
            sl = computeServiceLevel(rawAgents, trafficIntensity, targetSeconds, ahtSeconds);
            occupancy = trafficIntensity / rawAgents;
            const pw = erlangC(rawAgents, trafficIntensity);
            asa = pw * (ahtSeconds / (rawAgents * (1 - occupancy)));

            if (sl >= targetSL / 100 && occupancy <= maxOccupancy) break;
            rawAgents++;
        }

        const shrinkageMultiplier = 1 / (1 - shrinkagePercent / 100);
        const rostered = Math.ceil(rawAgents * shrinkageMultiplier);

        return new Response(JSON.stringify({
            trafficIntensity: +trafficIntensity.toFixed(4),
            rawAgents,
            rostered,
            serviceLevel: +(sl * 100).toFixed(2),
            occupancy: +(occupancy * 100).toFixed(2),
            asa: Math.round(asa),
            shrinkageMultiplier: +shrinkageMultiplier.toFixed(4),
        }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
});
