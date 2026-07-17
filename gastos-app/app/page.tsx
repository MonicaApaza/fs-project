// ─── EQUIVALENCIA .NET ────────────────────────────────────────────────
// app/page.tsx ≈ la acción Index() de HomeController + su vista Razor,
// pero en un solo archivo. La ruta se define por la CARPETA (routing por
// convención de archivos, como los Razor Pages): app/page.tsx → "/",
// app/login/page.tsx → "/login", etc.
//
// SERVER COMPONENT (sin "use client"): se renderiza en el servidor y el
// navegador recibe HTML ya listo. Ideal para contenido estático o que
// lee datos. Solo usaremos Client Components donde haya interactividad
// (formularios, filtros, botones con estado).
// ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    // Tailwind: clases utilitarias en lugar de CSS aparte.
    // "min-h-dvh" = alto mínimo de la pantalla (mobile-first).
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold text-center">Control de Gastos</h1>
      <p className="text-center text-slate-600">
        Gestión de ingresos y gastos por proyecto — próximamente.
      </p>
      <p className="rounded-full bg-emerald-100 px-4 py-1 text-sm text-emerald-800">
        Paso 0: ¡desplegado en Vercel! 🚀
      </p>
    </main>
  );
}
