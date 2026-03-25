import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface FteLossCategory {
    category: string;
    ftes: number;
    percentage: number;
    cost: number;
}

serve(async (req: Request) => {
    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const { teamId, date } = await req.json();
        const workDate = date || new Date().toISOString().split("T")[0];

        // Fetch team agents
        const { data: agents } = await supabase
            .from("agents")
            .select("id, salary, team_id")
            .eq("team_id", teamId)
            .eq("status", "active");

        if (!agents?.length) {
            return new Response(JSON.stringify({ error: "No agents found" }), { status: 404 });
        }

        const nominalFtes = agents.length;
        const avgDailyCost = agents.reduce((s, a) => s + Number(a.salary), 0) / nominalFtes / 22;

        // Fetch attendance events for today
        const { data: events } = await supabase
            .from("attendance_events")
            .select("*")
            .eq("work_date", workDate)
            .in("agent_id", agents.map((a) => a.id));

        const categories: FteLossCategory[] = [];
        let totalLoss = 0;

        // Absent / NCNS
        const absent = events?.filter((e) => ["absent", "ncns"].includes(e.status)).length || 0;
        if (absent > 0) {
            categories.push({ category: "Absent / NCNS", ftes: absent, percentage: (absent / nominalFtes) * 100, cost: absent * avgDailyCost });
            totalLoss += absent;
        }

        // Tardiness (convert minutes to FTE fraction: tardiness_minutes / 480 workday)
        const tardinessMinutes = events?.reduce((s, e) => s + (e.tardiness_minutes || 0), 0) || 0;
        const tardinessFtes = +(tardinessMinutes / 480).toFixed(2);
        if (tardinessFtes > 0) {
            categories.push({ category: "Tardiness", ftes: tardinessFtes, percentage: (tardinessFtes / nominalFtes) * 100, cost: tardinessFtes * avgDailyCost });
            totalLoss += tardinessFtes;
        }

        // On Leave
        const onLeave = events?.filter((e) => e.status === "on-leave").length || 0;
        if (onLeave > 0) {
            categories.push({ category: "On Leave", ftes: onLeave, percentage: (onLeave / nominalFtes) * 100, cost: onLeave * avgDailyCost });
            totalLoss += onLeave;
        }

        // Break overruns
        const breakOverrunMin = events?.reduce((s, e) => s + (e.break_overrun_minutes || 0), 0) || 0;
        const breakFtes = +(breakOverrunMin / 480).toFixed(2);
        if (breakFtes > 0) {
            categories.push({ category: "Break Overruns", ftes: breakFtes, percentage: (breakFtes / nominalFtes) * 100, cost: breakFtes * avgDailyCost });
            totalLoss += breakFtes;
        }

        const effectiveFtes = +(nominalFtes - totalLoss).toFixed(2);
        const lossPercentage = +((totalLoss / nominalFtes) * 100).toFixed(2);
        const dailyCost = +(totalLoss * avgDailyCost).toFixed(2);

        // Determine trend from last snapshot
        const { data: lastSnap } = await supabase
            .from("fte_loss_snapshots")
            .select("loss_percentage")
            .eq("team_id", teamId)
            .order("snapshot_at", { ascending: false })
            .limit(1);

        let trend: "improving" | "stable" | "worsening" = "stable";
        if (lastSnap?.length) {
            const diff = lossPercentage - Number(lastSnap[0].loss_percentage);
            if (diff > 2) trend = "worsening";
            else if (diff < -2) trend = "improving";
        }

        // Insert snapshot
        const { data: snapshot } = await supabase
            .from("fte_loss_snapshots")
            .insert({
                team_id: teamId,
                nominal_ftes: nominalFtes,
                effective_ftes: effectiveFtes,
                total_loss: +totalLoss.toFixed(2),
                loss_percentage: lossPercentage,
                daily_cost_impact: dailyCost,
                monthly_cost_projection: +(dailyCost * 22).toFixed(2),
                category_breakdown: categories,
                trend,
            })
            .select()
            .single();

        // Auto-create ticket if loss > 20%
        if (lossPercentage > 20) {
            const { data: team } = await supabase
                .from("teams")
                .select("team_lead_id")
                .eq("id", teamId)
                .single();

            await supabase.from("productivity_tickets").insert({
                team_id: teamId,
                team_lead_id: team?.team_lead_id,
                priority: lossPercentage > 30 ? "critical" : "high",
                trigger_description: `FTE Loss ${lossPercentage}% exceeds threshold`,
                fte_loss_snapshot_id: snapshot?.id,
                root_cause_analysis: categories.map((c) => `${c.category}: ${c.ftes} FTE (${c.percentage.toFixed(1)}%)`),
                suggested_actions: categories.slice(0, 3).map((c) => `Address ${c.category}`),
            });
        }

        return new Response(JSON.stringify(snapshot), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
