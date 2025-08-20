import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "K-Ads Admin",
  description: "K-Ads 맞춤형 문자 광고 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard or Inter 등—원하는 폰트로 바꿔도 OK */}
        <link
          href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-ink-100 text-ink-900" style={{ fontFamily: "Pretendard, system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans KR', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'" }}>
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-ink-200">
          <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-brand-500" />
              <h1 className="text-base font-semibold tracking-tight">K-Ads Console</h1>
            </div>
            <nav className="text-sm text-ink-600">Segments</nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      </body>
    </html>
  );
}
