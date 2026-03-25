import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number): number {
    return Math.floor(randomBetween(min, max + 1));
}

serve(async (_req: Request) => {
    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const now = new Date();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes();
        const intervalStart = `${String(hours).padStart(2, "0")}:${String(minutes - (minutes % 15)).padStart(2, "0")}`;

        // Fetch all clients
        const { data: clients } = await supabase.from("clients").select("*");

        const snapshots = [];

        for (const client of clients || []) {
            const isPeak = (client.peak_hours || []).some((ph: string) => {
                const [start, end] = ph.split("-");
                return intervalStart >= start && intervalStart <= end;
            });

            const baseAgents = client.agents_assigned || 20;
            const agentsScheduled = baseAgents;
            const agentsLoggedIn = baseAgents - randomInt(0, Math.ceil(baseAgents * 0.15));
            const volumeActual = isPeak
                ? randomInt(Math.floor(client.daily_volume * 0.08), Math.floor(client.daily_volume * 0.12))
                : randomInt(Math.floor(client.daily_volume * 0.03), Math.floor(client.daily_volume * 0.06));

            const sl = randomBetween(isPeak ? 0.70 : 0.80, isPeak ? 0.90 : 0.95);
            const occupancy = randomBetween(isPeak ? 0.78 : 0.65, isPeak ? 0.90 : 0.82);
            const ahtCurrent = client.aht_target + randomInt(-30, 40);
            const acwCurrent = client.acw_target + randomInt(-10, 15);
            const abandonRate = randomBetween(isPeak ? 0.03 : 0.01, isPeak ? 0.08 : 0.04);
            const asa = randomInt(isPeak ? 15 : 5, isPeak ? 35 : 20);
            const adherence = randomBetween(0.85, 0.95);
            const shrinkagePlanned = randomBetween(0.12, 0.18);
            const shrinkageActual = shrinkagePlanned + randomBetween(-0.03, 0.05);

            snapshots.push({
                client_id: client.id,
                interval_start: intervalStart,
                service_level: +sl.toFixed(4),
                calls_in_queue: randomInt(0, isPeak ? 12 : 5),
                occupancy: +occupancy.toFixed(4),
                aht_current: ahtCurrent,
                aht_target: client.aht_target,
                acw_current: acwCurrent,
                acw_target: client.acw_target,
                abandonment_rate: +abandonRate.toFixed(4),
                asa,
                adherence: +adherence.toFixed(4),
                agents_scheduled: agentsScheduled,
                agents_logged_in: agentsLoggedIn,
                shrinkage_planned: +shrinkagePlanned.toFixed(4),
                shrinkage_actual: +shrinkageActual.toFixed(4),
                volume_actual: volumeActual,
            });
        }

        if (snapshots.length > 0) {
            await supabase.from("live_metrics_snapshots").insert(snapshots);
        }

        return new Response(JSON.stringify({ inserted: snapshots.length, interval: intervalStart }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
