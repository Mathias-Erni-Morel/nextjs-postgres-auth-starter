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
  geburtsjahr: number | null;
  created_at: string;
  updated_at: string;
};

export default async function AthletesPage() {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("athletes")
    .select(
      "id, vorname, nachname, sportart, verein, pipeline_stage, score, geburtsjahr, created_at, updated_at"
    )
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Athleten – Kontakte</h1>
        <p className="text-red-600">Fehler beim Laden: {error.message}</p>
        <div className="mt-4">
          <Link href="/dashboard" className="text-blue-600 underline">
            ← Zurück zum Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const rows = (data ?? []) as Athlete[];
  const currentYear = new Date().getFullYear();

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link href="/dashboard" className="text-blue-600 underline">
          ← Zurück zum Dashboard
        </Link>
      </div>

      <h1 className="text-xl font-semibold mb-4">Athleten – Kontakte</h1>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Name</th>
              <th className="px-3 py-2 text-left font-medium">Sportart</th>
              <th className="px-3 py-2 text-left font-medium">Verein</th>
              <th className="px-3 py-2 text-left font-medium">Pipeline</th>
              <th className="px-3 py-2 text-left font-medium">Score</th>
              <th className="px-3 py-2 text-left font-medium">Alter</th>
              <th className="px-3 py-2 text-left font-medium">Erstellt</th>
              <th className="px-3 py-2 text-left font-medium">Aktualisiert</th>
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
              rows.map((a) => {
                const age =
                  typeof a.geburtsjahr === "number"
                    ? currentYear - a.geburtsjahr
                    : null;

                return (
                  <tr key={a.id} className="border-t">
                    <td className="px-3 py-2">
                      {a.vorname} {a.nachname}
                    </td>
                    <td className="px-3 py-2">{a.sportart ?? "–"}</td>
                    <td className="px-3 py-2">{a.verein ?? "–"}</td>
                    <td className="px-3 py-2">{a.pipeline_stage}</td>
                    <td className="px-3 py-2">{a.score ?? 0}</td>
                    <td className="px-3 py-2">
                      {age !== null ? (
                        <span className="inline-flex items-center gap-2">
                          <span>{age}</span>
                          {age < 18 && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                              U18
                            </span>
                          )}
                        </span>
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {new Date(a.created_at).toLocaleDateString("de-CH")}
                    </td>
                    <td className="px-3 py-2">
                      {new Date(a.updated_at).toLocaleDateString("de-CH")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-gray-500 mt-3">
        Read-only Ansicht. Bearbeiten/Neuanlage folgt im nächsten Schritt.
      </p>
    </div>
  );
}
