// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import LoginProvider from "@/components/LoginProvider";

export const metadata: Metadata = {
  title: "K-Ads Admin",
  description: "K-Ads 맞춤형 문자 광고 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard (본문용) */}
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"
          rel="stylesheet"
        />
      </head>

      {/* 화면 전체 파스텔 그라디언트 배경 */}
      <body
        className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900 antialiased"
        style={{
          fontFamily:
            "Pretendard Variable, Pretendard, system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans KR', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
        }}
      >
        <LoginProvider>
          {children}
        </LoginProvider>
      </body>
    </html>
  );
}
