// app/athletes/page.tsx
import { getSupabaseServer } from "@/lib/supabaseClient";
import Link from "next/link";

type Row = {
  id: string;
  vorname: string | null;
  nachname: string | null;
  sportart: string | null;
  verein: string | null;
  pipeline: string | null;
  score: number | null;
  geburtsdatum: string | null; // ISO-Date (Rohwert, kann null sein)
  geburtsdatum_formatiert: string | null; // "DD.MM.YYYY"
  alter: number | null; // z.B. 17
  u18: boolean | null; // true/false/null
  erstellt: string | null; // timestamptz
  aktualisiert: string | null; // timestamptz
};

export const dynamic = "force-dynamic";

export default async function AthletesPage() {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("athletes_with_alter")
    .select(
      "id, vorname, nachname, sportart, verein, pipeline, score, geburtsdatum, geburtsdatum_formatiert, alter, u18, erstellt, aktualisiert"
    )
    .order("aktualisiert", { ascending: false });

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Athleten – Kontakte</h1>
        <p className="text-red-600 mt-4">
          Fehler beim Laden: {error.message}
        </p>
        <div className="mt-6">
          <Link href="/dashboard" className="text-blue-600 underline">
            ← Zurück zum Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const rows = (data ?? []) as Row[];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Athleten – Kontakte</h1>

      <div className="mb-4">
        <Link href="/dashboard" className="text-blue-600 underline">
          ← Zurück zum Dashboard
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Sportart</th>
              <th className="px-3 py-2 text-left">Verein</th>
              <th className="px-3 py-2 text-left">Pipeline</th>
              <th className="px-3 py-2 text-left">Score</th>
              <th className="px-3 py-2 text-left">Geburtsdatum</th>
              <th className="px-3 py-2 text-left">Alter</th>
              <th className="px-3 py-2 text-left">Erstellt</th>
              <th className="px-3 py-2 text-left">Aktualisiert</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-gray-500" colSpan={9}>
                  Noch keine Einträge vorhanden.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const name = [r.vorname, r.nachname].filter(Boolean).join(" ");
                const altText =
                  r.alter === null || r.alter === undefined ? "—" : `${r.alter}`;
                const datumText = r.geburtsdatum_formatiert ?? "—";

                return (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">{name || "—"}</td>
                    <td className="px-3 py-2">{r.sportart ?? "—"}</td>
                    <td className="px-3 py-2">{r.verein ?? "—"}</td>
                    <td className="px-3 py-2">{r.pipeline ?? "—"}</td>
                    <td className="px-3 py-2">{r.score ?? 0}</td>
                    <td className="px-3 py-2">{datumText}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span>{altText}</span>
                        {r.u18 === true && (
                          <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
                            U18
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {r.erstellt
                        ? new Date(r.erstellt).toLocaleDateString("de-CH")
                        : "—"}
                    </td>
                    <td className="px-3 py-2">
                      {r.aktualisiert
                        ? new Date(r.aktualisiert).toLocaleDateString("de-CH")
                        : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-gray-500 mt-4">
        Read-only Ansicht. Bearbeiten/Neuanlage folgt im nächsten Schritt.
      </p>
    </div>
  );
}
