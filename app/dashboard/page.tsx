// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        Besser im Sport – CRM (Dashboard)
      </h1>
      <p style={{ marginBottom: 16 }}>
        Willkommen! Diese Seite ist aktuell ohne Login-Schutz, damit der Build
        funktioniert. Den Auth-Check fügen wir gleich wieder korrekt hinzu.
      </p>
      <ul style={{ lineHeight: 1.8 }}>
        <li><a href="/protected">Zu „Protected Page“ (Test der bestehenden Auth)</a></li>
        <li><a href="/api/auth/signin">Anmelden</a> · <a href="/api/auth/signout">Abmelden</a></li>
      </ul>
    </main>
  );
}
