'use client';

import { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'advertiser' | 'admin' | 'switch';
  currentMode?: string;
  onLoginSuccess: (mode: 'advertiser' | 'admin') => void;
}

export default function LoginModal({ isOpen, onClose, mode, currentMode, onLoginSuccess }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim() && password.trim()) {
      let message = '';
      let targetMode: 'advertiser' | 'admin' = 'advertiser';
      
      if (mode === 'switch') {
        // 모드 전환 시
        if (currentMode === 'advertiser') {
          message = '로그인에 성공하였습니다! 관리자 모드로 전환합니다';
          targetMode = 'admin';
        } else {
          message = '로그인에 성공하였습니다! 광고주 모드로 전환합니다';
          targetMode = 'advertiser';
        }
      } else {
        // 메인 페이지에서 로그인 시
        message = '로그인에 성공하였습니다!';
        targetMode = mode;
      }
      
      alert(message);
      onClose();
      setUsername('');
      setPassword('');
      
      // 로그인 성공 후 페이지 전환
      setTimeout(() => {
        onLoginSuccess(targetMode);
      }, 100);
    } else {
      alert('아이디와 비밀번호를 입력해주세요.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-96 max-w-md mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'switch' ? '모드 전환 로그인' : '로그인'}
          </h2>
          <p className="text-gray-600">
            {mode === 'switch' 
              ? `${currentMode === 'advertiser' ? '관리자' : '광고주'} 모드로 전환하기 위해 로그인이 필요합니다`
              : 'K-ADS 서비스를 이용하기 위해 로그인해주세요'
            }
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              아이디
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="아이디를 입력하세요"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              로그인
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
