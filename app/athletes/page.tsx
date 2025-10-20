// app/athletes/page.tsx
import { revalidatePath } from "next/cache";
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
  geburtsdatum: string | null; // DD.MM.YYYY formatiert aus der View
  alter: number | null;
  u18: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

async function loadRows(): Promise<Row[]> {
  const supa = getSupabaseServer();
  const { data, error } = await supa
    .from("athletes_with_alter")
    .select(
      "id, vorname, nachname, sportart, verein, pipeline_stage, score, geburtsdatum, alter, u18, created_at, updated_at"
    )
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as Row[];
}

// ---- SERVER ACTION: neuen Athleten anlegen (Service-Rolle NUR serverseitig) ----
async function createAthlete(formData: FormData) {
  "use server";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const { createClient } = await import("@supabase/supabase-js");

  // Werte aus dem Formular lesen
  const vorname = String(formData.get("vorname") || "").trim();
  const nachname = String(formData.get("nachname") || "").trim();
  const sportart = String(formData.get("sportart") || "").trim();
  const verein = String(formData.get("verein") || "").trim();
  const geburtsdatum = String(formData.get("geburtsdatum") || "").trim(); // YYYY-MM-DD vom <input type="date">
  const pipeline_stage = String(formData.get("pipeline_stage") || "Gefunden");
  const scoreStr = String(formData.get("score") || "").trim();
  const score = scoreStr ? Number(scoreStr) : 0;

  if (!vorname || !nachname) {
    throw new Error("Vorname und Nachname sind Pflichtfelder.");
  }

  const supaSrv = createClient(url, service, { auth: { persistSession: false } });

  const { error } = await supaSrv.from("athletes").insert({
    vorname,
    nachname,
    sportart: sportart || null,
    verein: verein || null,
    geburtsdatum: geburtsdatum || null, // Tabelle ist DATE; leer = null
    pipeline_stage,
    score,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Liste aktualisieren
  revalidatePath("/athletes");
}

function BadgeU18({ u18 }: { u18: boolean | null }) {
  if (!u18) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs font-medium">
      U18
    </span>
  );
}

export default async function AthletesPage() {
  let rows: Row[] = [];
  let loadError: string | null = null;

  try {
    rows = await loadRows();
  } catch (e: any) {
    loadError = e?.message ?? "Unbekannter Fehler beim Laden";
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Athleten – Kontakte</h1>
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Zurück zum Dashboard
        </Link>
      </div>

      {/* Erstellen-Formular */}
      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-medium mb-3">Neuen Athleten anlegen</h2>
        <form action={createAthlete} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm mb-1">Vorname *</label>
            <input name="vorname" required className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm mb-1">Nachname *</label>
            <input name="nachname" required className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm mb-1">Sportart</label>
            <input name="sportart" className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm mb-1">Verein</label>
            <input name="verein" className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm mb-1">Geburtsdatum</label>
            <input type="date" name="geburtsdatum" className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm mb-1">Pipeline</label>
            <select name="pipeline_stage" className="w-full border rounded px-2 py-1" defaultValue="Gefunden">
              <option>Gefunden</option>
              <option>Qualifiziert</option>
              <option>Kontaktierbar</option>
              <option>Erstkontakt gesendet</option>
              <option>Antwort</option>
              <option>Follow-up</option>
              <option>Kauf</option>
              <option>Nicht kontaktieren</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Score</label>
            <input type="number" name="score" min={0} className="w-full border rounded px-2 py-1" defaultValue={0} />
          </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                className="inline-flex items-center rounded bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700"
              >
                Speichern
              </button>
              <p className="text-xs text-gray-500 mt-1">* Pflichtfelder</p>
            </div>
        </form>
      </div>

      {/* Tabelle */}
      {loadError ? (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700">
          Fehler beim Laden: {loadError}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-md border p-3 text-gray-600">
          Noch keine Einträge vorhanden.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Sportart</th>
                <th className="px-3 py-2">Verein</th>
                <th className="px-3 py-2">Pipeline</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Geburtsdatum</th>
                <th className="px-3 py-2">Alter</th>
                <th className="px-3 py-2">Erstellt</th>
                <th className="px-3 py-2">Aktualisiert</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">
                    {(r.vorname ?? "") + " " + (r.nachname ?? "")}
                  </td>
                  <td className="px-3 py-2">{r.sportart ?? "—"}</td>
                  <td className="px-3 py-2">{r.verein ?? "—"}</td>
                  <td className="px-3 py-2">{r.pipeline_stage ?? "—"}</td>
                  <td className="px-3 py-2">{r.score ?? 0}</td>
                  <td className="px-3 py-2">{r.geburtsdatum ?? "—"}</td>
                  <td className="px-3 py-2">
                    {r.alter ?? "—"} {r.u18 ? <BadgeU18 u18={true} /> : null}
                  </td>
                  <td className="px-3 py-2">{r.created_at?.slice(0, 10) ?? "—"}</td>
                  <td className="px-3 py-2">{r.updated_at?.slice(0, 10) ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Hinweis: Der Versand bleibt dauerhaft deaktiviert. Dieses Formular speichert nur Datensätze in der Tabelle <code>athletes</code>.
      </p>
    </div>
  );
}
