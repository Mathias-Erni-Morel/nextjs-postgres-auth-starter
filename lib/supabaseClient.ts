// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

/**
 * Client für Server-Komponenten/Server-Functions.
 * Achtung: Wir verwenden den ANON-Key (RLS ist aktiv),
 * kein service_role Key im Frontend.
 */
export function getSupabaseServer() {
  if (!url || !anon) {
    throw new Error("Supabase URL oder ANON KEY fehlt in Environment Variables.");
  }
  return createClient(url, anon, {
    auth: {
      persistSession: false, // in Server-Kontext keine Session lokal speichern
    },
  });
}
