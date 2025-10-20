// app/athletes/page.tsx
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabaseClient";

type Row = {
  id: string;
  vorname: string | null;
  nachname: string | null;
  sportart: string | null;
  verein: string | null;
  pipeline_stage: string | null;
  score: number | null;
  geburtsdatum: string | null; // ISO (YYYY-MM-DD)
  alter: number | null;
  erstellt: string | null;     // ISO timestamp
  aktualisiert: string | null; // ISO timestamp
};

function formatDate(d: string | null) {
  if (!d) return "—";
  // Eingaben kommen als ISO (YYYY-MM-DD oder ISO-Zeit)
  const date = new Date(d);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default async function AthletesPage() {
  const supabase = getSupabaseServer();

  // WICHTIG: Wir lesen aus der Sicht "athletes_with_alter"
  const { data, error } = await supabase
    .from("athletes_with_alter")
    .select(
      "id, vorname, nachname, sportart, verein, pipeline_stage, score, geburtsdatum, alter, erstellt, aktualisiert"
    )
    .order("erstellt", { ascending: false });

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Athleten – Kontakte</h1>
        <Link href="/dashboard" className="text-sm underline">
          ← Zurück zum Dashboard
        </Link>
      </div>

      {/* Kurzer Hinweis */}
      <p className="text-sm text-gray-500">
        Read-only Ansicht. Bearbeiten/Neuanlage folgt in einem nächsten Schritt.
      </p>

      {error ? (
        <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
          Fehler beim Laden: {error.message}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="rounded-md border p-4">Noch keine Einträge vorhanden.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Sportart</th>
                <th className="p-2">Verein</th>
                <th className="p-2">Pipeline</th>
                <th className="p-2">Score</th>
                <th className="p-2">Geburtsdatum</th>
                <th className="p-2">Alter</th>
                <th className="p-2">Erstellt</th>
                <th className="p-2">Aktualisiert</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row: Row) => {
                const name = [row.vorname, row.nachname].filter(Boolean).join(" ");
                const minderjaehrig = typeof row.alter === "number" && row.alter < 18;
                return (
                  <tr key={row.id} className="border-b">
                    <td className="p-2">{name || "—"}</td>
                    <td className="p-2">{row.sportart || "—"}</td>
                    <td className="p-2">{row.verein || "—"}</td>
                    <td className="p-2">{row.pipeline_stage || "—"}</td>
                    <td className="p-2">{row.score ?? 0}</td>
                    <td className="p-2">{formatDate(row.geburtsdatum)}</td>
                    <td className="p-2">
                      {row.alter ?? "—"}
                      {minderjaehrig && (
                        <span className="ml-2 inline-block rounded bg-yellow-100 px-2 py-0.5 text-[11px] font-medium text-yellow-800">
                          U18
                        </span>
                      )}
                    </td>
                    <td className="p-2">{formatDate(row.erstellt)}</td>
                    <td className="p-2">{formatDate(row.aktualisiert)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
