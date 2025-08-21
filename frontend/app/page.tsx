// app/page.tsx
import { Jua } from "next/font/google";

const jua = Jua({
  weight: "400",
  subsets: ["latin"], // 한국어 포함됨
});

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6">
            <span className="text-3xl font-bold text-white">K</span>
          </div>

          {/* Jua 폰트 + 그라디언트 텍스트 */}
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
          >
            <span className="text-blue-600">K-ADS</span>
            <span className="text-white">와 함께 성공적인 마케팅을 경험해보세요</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            맞춤형 문자광고 서비스로 고객과의 소통을 더욱 효과적으로 만들 수 있습니다
          </p>
        </div>

        {/* Stats Section */}
        <div className="mb-16 grid md:grid-cols-4 gap-8 text-center">
          <div className="outer">
            <div className="dot"></div>
            <div className="card">
              <div className="ray"></div>
              <div className="line topl"></div>
              <div className="line bottoml"></div>
              <div className="line leftl"></div>
              <div className="line rightl"></div>
              <div className="text">99.9%</div>
              <div className="text-sm mt-2">전송 성공률</div>
            </div>
          </div>
          
          <div className="outer">
            <div className="dot"></div>
            <div className="card">
              <div className="ray"></div>
              <div className="line topl"></div>
              <div className="line bottoml"></div>
              <div className="line leftl"></div>
              <div className="line rightl"></div>
              <div className="text">24/7</div>
              <div className="text-sm mt-2">실시간 모니터링</div>
            </div>
          </div>
          
          <div className="outer">
            <div className="dot"></div>
            <div className="card">
              <div className="ray"></div>
              <div className="line topl"></div>
              <div className="line bottoml"></div>
              <div className="line leftl"></div>
              <div className="line rightl"></div>
              <div className="text">1000+</div>
              <div className="text-sm mt-2">활성 캠페인</div>
            </div>
          </div>
          
          <div className="outer">
            <div className="dot"></div>
            <div className="card">
              <div className="ray"></div>
              <div className="line topl"></div>
              <div className="line bottoml"></div>
              <div className="line leftl"></div>
              <div className="line rightl"></div>
              <div className="text">50만+</div>
              <div className="text-sm mt-2">월간 메시지</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="container">
            <div className="glass" style={{"--r": "-15"} as React.CSSProperties} data-text="스마트 타겟팅">
              <div className="text-center">
                <div className="text-5xl mb-8 mt-4">📱</div>
                <div className="text-base text-gray-300 px-4 leading-relaxed">
                  고객 세그먼트를 분석하여 정확한 타겟에게 맞춤형 광고를 전달합니다
                </div>
              </div>
            </div>
            
            <div className="glass" style={{"--r": "0"} as React.CSSProperties} data-text="실시간 분석">
              <div className="text-center">
                <div className="text-5xl mb-8 mt-4">📊</div>
                <div className="text-base text-gray-300 px-4 leading-relaxed">
                  캠페인 성과를 실시간으로 모니터링하고<br />데이터 기반 의사결정을 지원합니다
                </div>
              </div>
            </div>
            
            <div className="glass" style={{"--r": "15"} as React.CSSProperties} data-text="효율적인 관리">
              <div className="text-center">
                <div className="text-5xl mb-8 mt-4">🚀</div>
                <div className="text-base text-gray-300 px-4 leading-relaxed">
                  직관적인 인터페이스로 캠페인과 메시지를 쉽게 관리할 수 있습니다
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
