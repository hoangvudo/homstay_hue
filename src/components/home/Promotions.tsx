export default function Promotions() {
  return (
    <section id="promotions" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Khuyến mãi & Combo</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tiết kiệm hơn với các ưu đãi đặc biệt dành riêng cho bạn khi đặt phòng qua nền tảng của chúng tôi.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Banner 1 */}
          <div className="relative rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-hue-red/90 to-transparent z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1517400508447-f8dd518b86db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Flash Sale" 
              className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-12 text-white w-full md:w-2/3">
              <span className="bg-hue-gold text-xs font-bold px-3 py-1 rounded-full w-max mb-4 uppercase tracking-wider">Flash Sale</span>
              <h3 className="text-3xl font-serif font-bold mb-3">Giảm 30% Mùa Hè</h3>
              <p className="mb-6 opacity-90">Áp dụng cho tất cả các Homestay tại trung tâm khi đặt trước 7 ngày.</p>
              <button className="bg-white text-hue-red px-6 py-3 rounded-full font-bold w-max hover:bg-gray-100 transition-colors shadow-lg">
                Nhận Mã Ngay
              </button>
            </div>
          </div>
          {/* Banner 2 */}
          <div className="relative rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Combo" 
              className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-12 text-white w-full md:w-2/3">
              <span className="bg-hue-gold text-xs font-bold px-3 py-1 rounded-full w-max mb-4 uppercase tracking-wider">Combo Tiết Kiệm</span>
              <h3 className="text-3xl font-serif font-bold mb-3">Phòng + Vé Ca Huế</h3>
              <p className="mb-6 opacity-90">Trải nghiệm âm nhạc hoàng cung trên sông Hương với combo siêu hời.</p>
              <button className="bg-hue-gold text-white px-6 py-3 rounded-full font-bold w-max hover:bg-yellow-500 transition-colors shadow-lg shadow-hue-gold/30">
                Khám Phá Combo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
