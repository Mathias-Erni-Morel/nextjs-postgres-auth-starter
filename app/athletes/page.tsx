// app/athletes/page.tsx
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabaseClient";

type AthleteRow = {
  id: string;
  vorname: string | null;
  nachname: string | null;
  sportart: string | null;
  verein: string | null;
  pipeline_stage: string | null;
  score: number | null;
  created_at: string | null;
  updated_at: string | null;
  alter: number | null; // aus View
  u18: boolean | null;  // aus View
};

export default async function AthletesPage() {
  const supabase = getSupabaseServer();

  // Aus der View lesen, damit "alter" und "u18" vorhanden sind
  const { data, error } = await supabase
    .from("athletes_with_alter")
    .select(
      "id, vorname, nachname, sportart, verein, pipeline_stage, score, created_at, updated_at, alter, u18"
    )
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Athleten – Kontakte</h1>
        <p className="text-red-600">Fehler beim Laden: {error.message}</p>
        <div className="mt-4">
          <Link href="/dashboard" className="text-blue-600 underline">
            ← Zurück zum Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const rows: AthleteRow[] = data ?? [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Athleten – Kontakte</h1>
      <div className="mt-2">
        <Link href="/dashboard" className="text-blue-600 underline">
          ← Zurück zum Dashboard
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-700">
              <th className="px-3 py-2 border-b">Name</th>
              <th className="px-3 py-2 border-b">Sportart</th>
              <th className="px-3 py-2 border-b">Verein</th>
              <th className="px-3 py-2 border-b">Pipeline</th>
              <th className="px-3 py-2 border-b">Score</th>
              <th className="px-3 py-2 border-b">Alter</th>
              <th className="px-3 py-2 border-b">Erstellt</th>
              <th className="px-3 py-2 border-b">Aktualisiert</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-gray-500" colSpan={8}>
                  Noch keine Einträge vorhanden.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const name =
                  [r.vorname, r.nachname].filter(Boolean).join(" ") || "—";
                const alterText =
                  typeof r.alter === "number" ? `${r.alter}` : "—";
                return (
                  <tr key={r.id} className="text-sm">
                    <td className="px-3 py-2 border-b">{name}</td>
                    <td className="px-3 py-2 border-b">{r.sportart ?? "—"}</td>
                    <td className="px-3 py-2 border-b">{r.verein ?? "—"}</td>
                    <td className="px-3 py-2 border-b">{r.pipeline_stage ?? "—"}</td>
                    <td className="px-3 py-2 border-b">{r.score ?? 0}</td>
                    <td className="px-3 py-2 border-b">
                      <span className="mr-2">{alterText}</span>
                      {r.u18 ? (
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 align-middle">
                          U18
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 border-b">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-3 py-2 border-b">
                      {r.updated_at ? new Date(r.updated_at).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Read-only Ansicht. Bearbeiten/Neuanlage folgt im nächsten Schritt.
      </p>
    </div>
  );
}
