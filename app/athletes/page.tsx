// app/athletes/page.tsx
import { getSupabaseServer } from "@/lib/supabaseClient";
import Link from "next/link";

type Athlete = {
  id: string;
  vorname: string;
  nachname: string;
  sportart: string | null;
  verein: string | null;
  pipeline_stage: string;
  score: number | null;
  minor_flag: boolean;
  created_at: string;
  updated_at: string;
};

export const dynamic = "force-dynamic";

export default async function AthletesPage() {
  const supabase = getSupabaseServer();

  // Basis-Abfrage: sortiert nach Score (absteigend), dann Nachname
  const { data, error } = await supabase
    .from("athletes")
    .select(
      "id, vorname, nachname, sportart, verein, pipeline_stage, score, minor_flag, created_at, updated_at"
    )
    .order("score", { ascending: false })
    .order("nachname", { ascending: true });

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold mb-4">Athleten – Kontakte</h1>
        <p className="rounded-md bg-red-50 text-red-700 p-4">
          Fehler beim Laden: {error.message}
        </p>
        <div className="mt-6">
          <Link href="/dashboard" className="underline">
            ← Zurück zum Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const rows = (data ?? []) as Athlete[];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Athleten – Kontakte</h1>
        <Link href="/dashboard" className="underline">
          ← Zurück zum Dashboard
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Sportart</th>
              <th className="px-4 py-3 font-medium">Verein</th>
              <th className="px-4 py-3 font-medium">Pipeline</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Minderjährig</th>
              <th className="px-4 py-3 font-medium">Erstellt</th>
              <th className="px-4 py-3 font-medium">Aktualisiert</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={8}>
                  Noch keine Einträge vorhanden.
                </td>
              </tr>
            ) : (
              rows.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-3">
                    {a.vorname} {a.nachname}
                  </td>
                  <td className="px-4 py-3">{a.sportart ?? "–"}</td>
                  <td className="px-4 py-3">{a.verein ?? "–"}</td>
                  <td className="px-4 py-3">{a.pipeline_stage}</td>
                  <td className="px-4 py-3">{a.score ?? 0}</td>
                  <td className="px-4 py-3">{a.minor_flag ? "Ja" : "Nein"}</td>
                  <td className="px-4 py-3">
                    {new Date(a.created_at).toLocaleString("de-CH")}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(a.updated_at).toLocaleString("de-CH")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Read-only Ansicht. Bearbeiten/Neuanlage folgt im nächsten Schritt.
      </p>
    </main>
  );
}
