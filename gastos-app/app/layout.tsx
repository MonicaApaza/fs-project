import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// ─── EQUIVALENCIA .NET ────────────────────────────────────────────────
// layout.tsx ≈ _Layout.cshtml en ASP.NET Core MVC: define el HTML común
// (html, body, fuentes, estilos globales) y {children} es como
// @RenderBody(). Todas las páginas dentro de app/ se renderizan aquí.
// ──────────────────────────────────────────────────────────────────────

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// metadata ≈ configurar <title> y <meta> desde el servidor.
// En MVC lo harías con ViewData["Title"] en la vista.
export const metadata: Metadata = {
  title: "Control de Gastos",
  description:
    "Control de gastos e ingresos por proyecto para estudio de arquitectura",
};

// Este es un SERVER COMPONENT (el default en App Router): se ejecuta
// solo en el servidor, como una vista Razor. No lleva "use client"
// porque no necesita estado ni eventos del navegador.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
