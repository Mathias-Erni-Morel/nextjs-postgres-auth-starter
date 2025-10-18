// app/protected/page.tsx
import { redirect } from "next/navigation";

export default function ProtectedPage() {
  redirect("/dashboard");
  return null;
}
