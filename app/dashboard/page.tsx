// app/dashboard/page.tsx
import { auth } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Auth-Check (geschützte Seite)
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Sehr simples Dashboard (MVP)
  return (
    <main style={{ maxWidth: 880, margin: "40px auto", padding: "0 16px", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Besser-im-Sport CRM</h1>
      <p style={{ opacity: 0.85, marginBottom: 24 }}>
        Willkommen, <strong>{session.user?.email}</strong>.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <a href="/protected" style={tileStyle}>🔐 Geschützte Testseite</a>
        <a href="/athletes" style={tileStyle}>🏃 Athleten</a>
        <a href="/purchases" style={tileStyle}>💳 Käufe</a>
        <a href="/communications" style={tileStyle}>✉️ Kommunikation</a>
      </div>

      <section style={{ marginTop: 32, padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Nächste Schritte</h2>
        <ol style={{ paddingLeft: 18, lineHeight: 1.6 }}>
          <li>„Athleten“-Liste anlegen (Table-View + Detailseite)</li>
          <li>Kauf-Registrierung (manuell) hinzufügen</li>
          <li>Kommunikations-Log (manuell) hinzufügen</li>
        </ol>
      </section>
    </main>
  );
}

// Inline-Stil für einfache, klare Kacheln
const tileStyle: React.CSSProperties = {
  display: "block",
  padding: "16px 14px",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  textDecoration: "none",
  color: "#111827",
  background: "#fff",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};
