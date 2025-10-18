// app/outreach/page.tsx
export const dynamic = "force-dynamic";

export default function OutreachPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        Outreach – Entwürfe & Follow-ups
      </h1>
      <p style={{ marginBottom: 16 }}>
        Diese Seite zeigt später alle Entwürfe, Kontaktprotokolle und Follow-ups.
        Der tatsächliche Versand bleibt dauerhaft deaktiviert.
      </p>
      <ul style={{ lineHeight: 1.6 }}>
        <li>📨 Entwürfe anzeigen</li>
        <li>🧩 Kontaktmethoden prüfen</li>
        <li>🕓 Follow-ups planen (ohne Versand)</li>
      </ul>
    </main>
  );
}
