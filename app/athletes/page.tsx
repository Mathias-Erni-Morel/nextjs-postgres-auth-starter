// app/athletes/page.tsx
import { getSupabaseServer } from "@/lib/supabaseClient";
import Link from "next/link";

export const revalidate = 0;

export default async function AthletesPage() {
  const supabase = getSupabaseServer();
  const { data: athletes, error } = await supabase
    .from("athletes_with_alter")
    .select("*")
    .order("erstellt", { ascending: false });

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Fehler beim Laden: {error.message}
        <div>
          <Link href="/dashboard" className="text-blue-600 underline">
            ← Zurück zum Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Athleten – Kontakte</h1>

      <Link href="/dashboard" className="text-blue-600 underline">
        ← Zurück zum Dashboard
      </Link>

      <table className="min-w-full mt-4 border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Vorname</th>
            <th className="p-2 border">Nachname</th>
            <th className="p-2 border">Sportart</th>
            <th className="p-2 border">Verein</th>
            <th className="p-2 border">Pipeline</th>
            <th className="p-2 border">Score</th>
            <th className="p-2 border">Geburtsdatum</th>
            <th className="p-2 border">Alter</th>
            <th className="p-2 border">Erstellt</th>
            <th className="p-2 border">Aktualisiert</th>
          </tr>
        </thead>
        <tbody>
          {athletes && athletes.length > 0 ? (
            athletes.map((a) => {
              const alter = a.alter ?? "–";
              const minderjaehrig =
                typeof alter === "number" && alter < 18 ? true : false;
              return (
                <tr key={a.id}>
                  <td className="p-2 border">{a.vorname}</td>
                  <td className="p-2 border">{a.nachname}</td>
                  <td className="p-2 border">{a.sportart}</td>
                  <td className="p-2 border">{a.verein}</td>
                  <td className="p-2 border">{a.pipeline}</td>
                  <td className="p-2 border">{a.score}</td>
                  <td className="p-2 border">
                    {a.geburtsdatum
                      ? new Date(a.geburtsdatum).toLocaleDateString("de-CH")
                      : "–"}
                  </td>
                  <td
                    className={`p-2 border ${
                      minderjaehrig ? "text-red-600 font-bold" : ""
                    }`}
                  >
                    {alter}
                    {minderjaehrig && " 🔞"}
                  </td>
                  <td className="p-2 border">
                    {new Date(a.erstellt).toLocaleDateString("de-CH")}
                  </td>
                  <td className="p-2 border">
                    {new Date(a.aktualisiert).toLocaleDateString("de-CH")}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={10} className="p-4 text-center text-gray-500">
                Noch keine Einträge vorhanden.
                <br />
                Read-only Ansicht. Bearbeiten/Neuanlage folgt im nächsten Schritt.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
