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
            <div className="flex items-center gap-3">
              {/* K-Ads 서비스 아이콘 */}
              <div className="relative">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                {/* 작은 점 추가로 브랜드 아이덴티티 강화 */}
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-orange-400 rounded-full"></div>
              </div>
              
              {/* K-Ads 브랜드명 */}
              <div className="flex flex-col">
                <h1 className="text-lg font-bold tracking-tight text-blue-600">K-Ads</h1>
                <div className="text-sm text-gray-600">맞춤형 문자 광고 서비스</div>
              </div>
            </div>
            
            {/* 네비게이션 메뉴 */}
            <nav className="flex items-center gap-4 text-sm">
              <a 
                href="/advertiser" 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <span className="text-lg">🎭</span>
                <span>광고주 모드 전환</span>
              </a>
              <a 
                href="/admin" 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <span className="text-lg">🛡️</span>
                <span>관리자 모드 전환</span>
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      </body>
    </html>
  );
}
