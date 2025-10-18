// middleware.ts — nur noch für /protected aktiv, ohne Redirect-Logik
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/protected"], // Middleware gilt NUR für /protected
};

export default function middleware(_req: NextRequest) {
  return NextResponse.next(); // keine Umleitung
}
