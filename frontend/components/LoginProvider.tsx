'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginModal from './LoginModal';

export default function LoginProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<'advertiser' | 'admin' | 'switch'>('advertiser');
  const [currentMode, setCurrentMode] = useState<string>('');

  const handleModeSwitch = (mode: 'advertiser' | 'admin') => {
    setLoginMode('switch');
    setCurrentMode(mode === 'advertiser' ? 'advertiser' : 'admin');
    setIsLoginModalOpen(true);
  };

  const handleDirectLogin = (mode: 'advertiser' | 'admin') => {
    setLoginMode(mode);
    setCurrentMode('');
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (mode: 'advertiser' | 'admin') => {
    // 로그인 성공 시 해당 페이지로 이동
    if (mode === 'advertiser') {
      router.push('/advertiser');
    } else if (mode === 'admin') {
      router.push('/admin');
    }
  };

  return (
    <>
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* K-Ads 서비스 아이콘 - 클릭 가능한 링크로 변경 */}
            <Link href="/" className="relative hover:scale-105 transition-transform">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-orange-400 rounded-full" />
            </Link>

            {/* K-Ads 브랜드명 - 클릭 가능한 링크로 변경 */}
            <Link href="/" className="flex flex-col hover:opacity-80 transition-opacity">
              <h1 className="text-lg font-bold tracking-tight text-blue-600">K-Ads</h1>
              <div className="text-sm text-gray-600">맞춤형 문자 광고 서비스</div>
            </Link>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="flex items-center gap-4 text-sm">
            <button
              onClick={() => handleDirectLogin('advertiser')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <span className="text-lg">🎭</span>
              <span>광고주 모드</span>
            </button>
            <button
              onClick={() => handleDirectLogin('admin')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <span className="text-lg">🛡️</span>
              <span>관리자 모드</span>
            </button>
          </nav>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="mx-auto max-w-6xl px-5 py-8 bg-transparent">
        {children}
      </main>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        mode={loginMode}
        currentMode={currentMode}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
