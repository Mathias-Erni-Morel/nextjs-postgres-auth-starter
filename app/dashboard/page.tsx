// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Besser-im-Sport CRM</h1>
        <p className="text-gray-500 mt-1">Schnellzugriff</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/protected"
          className="rounded-xl border p-6 hover:shadow transition"
        >
          <h2 className="text-xl font-medium mb-2">Athleten</h2>
          <p className="text-sm text-gray-600">
            Kontakte anzeigen & bearbeiten
          </p>
        </a>

        <a
          href="/protected"
          className="rounded-xl border p-6 hover:shadow transition"
        >
          <h2 className="text-xl font-medium mb-2">Discovery</h2>
          <p className="text-sm text-gray-600">
            Webseiten scannen & Quellen protokollieren
          </p>
        </a>

        <a
          href="/protected"
          className="rounded-xl border p-6 hover:shadow transition"
        >
          <h2 className="text-xl font-medium mb-2">Outreach</h2>
          <p className="text-sm text-gray-600">
            Entwürfe & Follow-ups (kein Versand)
          </p>
        </a>
      </div>
    </main>
  );
}
