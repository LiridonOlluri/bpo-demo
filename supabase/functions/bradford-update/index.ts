import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const { agentId } = await req.json();

        // Fetch spells in last 12 months
        const cutoff = new Date();
        cutoff.setFullYear(cutoff.getFullYear() - 1);

        const { data: entries } = await supabase
            .from("bradford_entries")
            .select("*")
            .eq("agent_id", agentId)
            .gte("start_date", cutoff.toISOString().split("T")[0])
            .order("start_date", { ascending: true });

        const spells = entries?.length || 0;
        const totalDays = entries?.reduce((s: number, e: { days: number }) => s + e.days, 0) || 0;
        const score = spells * spells * totalDays;

        // Update agent record
        await supabase
            .from("agents")
            .update({ bradford_score: score, updated_at: new Date().toISOString() })
            .eq("id", agentId);

        return new Response(JSON.stringify({ agentId, spells, totalDays, score }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
