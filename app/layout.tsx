// app/layout.tsx
import "./globals.css";
import { AppProvider } from "@/lib/context";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 'class' darkMode rejimini qo'llash
    <html lang="uz" suppressHydrationWarning>
      <body>
        {/* AppProvider butun sayt bo'ylab til, rejim va kontent holatini beradi */}
        <AppProvider>{children}</AppProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
