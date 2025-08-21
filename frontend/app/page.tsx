export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Hero Section */}
      <div className="px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6">
            <span className="text-3xl font-bold text-white">K</span>
          </div>
          <h1 className="text-6xl font-extrabold text-white mb-4 font-serif">
            K-ADS에 오신 것을 환영합니다
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            맞춤형 문자광고 서비스로 고객과의 소통을 더욱 효과적으로 만들어보세요
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">스마트 타겟팅</h3>
            <p className="text-gray-600 leading-relaxed">
              고객 세그먼트를 분석하여 정확한 타겟에게 맞춤형 광고를 전달합니다
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">실시간 분석</h3>
            <p className="text-gray-600 leading-relaxed">
              캠페인 성과를 실시간으로 모니터링하고 데이터 기반 의사결정을 지원합니다
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">효율적인 관리</h3>
            <p className="text-gray-600 leading-relaxed">
              직관적인 인터페이스로 캠페인과 메시지를 쉽게 관리할 수 있습니다
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-gray-600">전송 성공률</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">실시간 모니터링</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
            <div className="text-gray-600">활성 캠페인</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">50만+</div>
            <div className="text-gray-600">월간 메시지</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">지금 시작해보세요</h2>
            <p className="text-xl opacity-90">
              K-ADS와 함께 성공적인 디지털 마케팅을 경험해보세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
