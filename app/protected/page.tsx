// app/protected/page.tsx
export default function ProtectedTestPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Protected – Test-Render OK</h1>
      <p>Wenn du diesen Text siehst, rendert die Route /protected korrekt.</p>
    </main>
  );
}
