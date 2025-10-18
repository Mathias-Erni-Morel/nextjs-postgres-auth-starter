// app/discovery/page.tsx
export const dynamic = "force-dynamic";

export default function DiscoveryPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        Discovery – Webseiten scannen & Quellen protokollieren
      </h1>
      <p style={{ marginBottom: 16 }}>
        Diese Seite ist vorbereitet. Als Nächstes fügen wir das Formular zum
        Seed-URL-Scan und die Ergebnisliste hinzu.
      </p>
      <ul style={{ lineHeight: 1.6 }}>
        <li>🔎 Seed-URL Eingabe</li>
        <li>🧠 Namens-Extraktion (Vorschau)</li>
        <li>📚 Quellen-Logs (mit anklickbaren Links)</li>
      </ul>
    </main>
  );
}
