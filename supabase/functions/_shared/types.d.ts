// Type declarations for Deno runtime used by Supabase Edge Functions.
// These allow VS Code's TypeScript server to understand Deno APIs
// without requiring the Deno VS Code extension.

declare namespace Deno {
    interface Env {
        get(key: string): string | undefined;
        set(key: string, value: string): void;
        delete(key: string): void;
        toObject(): Record<string, string>;
    }
    const env: Env;
    function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "https://deno.land/std@0.177.0/http/server.ts" {
    export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
    export { createClient, SupabaseClient } from "@supabase/supabase-js";
}
