// app/athletes/page.tsx
import { getSupabaseServer } from "@/lib/supabaseClient";
import Link from "next/link";

type Athlete = {
  id: string;
  vorname: string;
  nachname: string;
  sportart: string | null;
  verein: string | null;
  pipeline_stage: string | null;
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
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Athleten – Kontakte</h1>
        <Link href="/dashboard" className="text-blue-600">
          &larr; Zurück zum Dashboard
        </Link>
        <p className="mt-6 text-red-600">Fehler beim Laden: {error.message}</p>
      </div>
    );
  }

  const rows: Athlete[] = data ?? [];
  const currentYear = new Date().getFullYear();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Athleten – Kontakte</h1>
      <Link href="/dashboard" className="text-blue-600">
        &larr; Zurück zum Dashboard
      </Link>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Sportart</th>
              <th className="px-3 py-2 text-left">Verein</th>
              <th className="px-3 py-2 text-left">Pipeline</th>
              <th className="px-3 py-2 text-left">Score</th>
              <th className="px-3 py-2 text-left">Alter</th>
              <th className="px-3 py-2 text-left">Erstellt</th>
              <th className="px-3 py-2 text-left">Aktualisiert</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-gray-500">
                  Noch keine Einträge vorhanden.
                </td>
              </tr>
            ) : (
              rows.map((a) => {
                const age = a.geburtsjahr ? currentYear - a.geburtsjahr : null;
                return (
                  <tr key={a.id} className="border-t">
                    <td className="px-3 py-2">
                      {a.vorname} {a.nachname}
                    </td>
                    <td className="px-3 py-2">{a.sportart ?? "—"}</td>
                    <td className="px-3 py-2">{a.verein ?? "—"}</td>
                    <td className="px-3 py-2">{a.pipeline_stage ?? "—"}</td>
                    <td className="px-3 py-2">{a.score ?? 0}</td>
                    <td className="px-3 py-2">
                      {age === null ? (
                        "—"
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{age}</span>
                          {age < 18 && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              U18
                            </span>
                          )}
                        </div>
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

      <p className="mt-4 text-xs text-gray-500">
        Read-only Ansicht. Bearbeiten/Neuanlage folgt im nächsten Schritt.
      </p>
    </div>
  );
}
