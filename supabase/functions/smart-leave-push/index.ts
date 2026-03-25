import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // Find weeks with low utilisation (green status, slots_used < slots_available)
        const { data: greenWeeks } = await supabase
            .from("leave_capacity_weeks")
            .select("*")
            .eq("status", "green")
            .gte("start_date", new Date().toISOString().split("T")[0])
            .order("start_date", { ascending: true })
            .limit(10);

        if (!greenWeeks?.length) {
            return new Response(JSON.stringify({ pushed: 0, message: "No available green weeks" }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // Find pending leave requests currently blocked (in red/amber weeks)
        const { data: blockedRequests } = await supabase
            .from("leave_requests")
            .select("*, agents!inner(team_id, user_profile_id)")
            .eq("status", "blocked")
            .order("created_at", { ascending: true })
            .limit(20);

        let pushed = 0;
        const suggestions: Array<{ requestId: string; agentId: string; suggestedWeek: string }> = [];

        for (const request of blockedRequests || []) {
            // Find a green week that can accommodate this request
            const available = greenWeeks.find(
                (w: { slots_used: number; slots_available: number; smart_push_active: boolean; id: string }) => w.slots_used < w.slots_available && !w.smart_push_active
            );
            if (!available) break;

            suggestions.push({
                requestId: request.id,
                agentId: request.agent_id,
                suggestedWeek: available.start_date,
            });

            // Update the request with alternative dates
            await supabase
                .from("leave_requests")
                .update({
                    alternative_dates: [available.start_date],
                    updated_at: new Date().toISOString(),
                })
                .eq("id", request.id);

            // Mark week smart push active
            await supabase
                .from("leave_capacity_weeks")
                .update({ smart_push_active: true })
                .eq("id", available.id);

            pushed++;
        }

        return new Response(JSON.stringify({ pushed, suggestions }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
