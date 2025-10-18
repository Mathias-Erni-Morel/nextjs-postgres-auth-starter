// app/athletes/page.tsx
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabaseClient";

type AthleteRow = {
  id: string;
  vorname: string;
  nachname: string;
  sportart: string | null;
  verein: string | null;
  pipeline_stage: string;
  score: number | null;
  alter: number | null;
  ist_minderjaehrig: boolean | null;
  created_at: string;
  updated_at: string;
};

export const revalidate = 0; // immer frisch laden

export default async function AthletesPage() {
  const supabase = getSupabaseServer();

  // WICHTIG: aus der View athletes_with_alter lesen (liefert alter + ist_minderjaehrig)
  const { data, error } = await supabase
    .from("athletes_with_alter")
    .select(
      "id, vorname, nachname, sportart, verein, pipeline_stage, score, alter, ist_minderjaehrig, created_at, updated_at"
    )
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Athleten – Kontakte</h1>
        <p className="text-red-600 mb-4">Fehler beim Laden: {error.message}</p>
        <Link href="/dashboard" className="text-blue-600 underline">
          ← Zurück zum Dashboard
        </Link>
      </div>
    );
  }

  const rows: AthleteRow[] = data ?? [];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Athleten – Kontakte</h1>
      <Link href="/dashboard" className="text-blue-600 underline">
        ← Zurück zum Dashboard
      </Link>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Sportart</th>
              <th className="px-4 py-2">Verein</th>
              <th className="px-4 py-2">Pipeline</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Alter</th>
              <th className="px-4 py-2">Erstellt</th>
              <th className="px-4 py-2">Aktualisiert</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={8}>
                  Noch keine Einträge vorhanden.
                </td>
              </tr>
            ) : (
              rows.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2">
                    {a.vorname} {a.nachname}
                  </td>
                  <td className="px-4 py-2">{a.sportart ?? "—"}</td>
                  <td className="px-4 py-2">{a.verein ?? "—"}</td>
                  <td className="px-4 py-2">{a.pipeline_stage}</td>
                  <td className="px-4 py-2">{a.score ?? 0}</td>
                  <td className="px-4 py-2">
                    {a.alter ?? "—"}
                    {a.ist_minderjaehrig ? (
                      <span className="ml-2 inline-block rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-medium align-middle">
                        U18
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(a.created_at).toLocaleDateString("de-CH")}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(a.updated_at).toLocaleDateString("de-CH")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">
        Read-only Ansicht. Bearbeiten/Neuanlage folgt im nächsten Schritt.
      </p>
    </div>
  );
}
