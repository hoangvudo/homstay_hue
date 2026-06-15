import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
export default function Footer() {
  return (
    <footer id="footer" className="bg-gray-900 text-white/80 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-wider text-white mb-6">
              Hue <span className="text-hue-gold">Homestay</span>
            </h1>
            <p className="mb-6 text-sm leading-relaxed">
              Khám phá vẻ đẹp trầm mặc của cố đô Huế qua lăng kính chân thực nhất. Chúng tôi cung cấp những chỗ nghỉ dưỡng đậm chất Huế, từ cổ kính đến hiện đại.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-hue-gold hover:text-white transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7v-3h3V9.5C10 6.57 11.74 5 14.28 5c1.25 0 2.54.22 2.54.22v2.79h-1.43c-1.41 0-1.85.88-1.85 1.77V12h3.14l-.5 3h-2.64v6.8C18.56 20.87 22 16.84 22 12z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-hue-gold hover:text-white transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.64-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 2.69.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.36-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.36-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1018.16 12 6.16 6.16 0 0012 5.84zm0 10.16A4 4 0 1116 12a4 4 0 01-4 4zm6.4-10.4a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-hue-gold hover:text-white transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.56a9.83 9.83 0 01-2.83.77 4.93 4.93 0 002.16-2.72 9.86 9.86 0 01-3.13 1.2A4.93 4.93 0 0011.8 7.6c0 .38.04.76.13 1.12A13.98 13.98 0 011.67 3.15a4.93 4.93 0 001.52 6.57 4.9 4.9 0 01-2.23-.62v.06a4.93 4.93 0 003.95 4.83 4.92 4.92 0 01-2.22.08 4.93 4.93 0 004.6 3.42 9.87 9.87 0 01-6.1 2.1 10 10 0 01-1.18-.07 13.94 13.94 0 007.55 2.21c9.06 0 14.01-7.51 14.01-14.01 0-.21 0-.42-.01-.63A10.02 10.02 0 0024 4.56z"/></svg>
              </a>
            </div>
          </div>
          {/* Col 2 */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 font-serif">Liên kết nhanh</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-hue-gold transition-colors">Trang chủ</Link></li>
              <li><Link href="#homestays" className="hover:text-hue-gold transition-colors">Danh sách Homestay</Link></li>
              <li><Link href="#destinations" className="hover:text-hue-gold transition-colors">Cẩm nang du lịch</Link></li>
              <li><Link href="#promotions" className="hover:text-hue-gold transition-colors">Khuyến mãi</Link></li>
              <li><Link href="/login" className="hover:text-hue-gold transition-colors">Trở thành chủ nhà</Link></li>
            </ul>
          </div>
          {/* Col 3 */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 font-serif">Chính sách</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-hue-gold transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link href="#" className="hover:text-hue-gold transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="#" className="hover:text-hue-gold transition-colors">Chính sách hoàn tiền</Link></li>
              <li><Link href="#" className="hover:text-hue-gold transition-colors">Quy chế hoạt động</Link></li>
              <li><Link href="#" className="hover:text-hue-gold transition-colors">Giải quyết khiếu nại</Link></li>
            </ul>
          </div>
          {/* Col 4 */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 font-serif">Liên hệ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-hue-gold shrink-0 mt-0.5" />
                <span>01 Lê Lợi, Phường Vĩnh Ninh, TP. Huế, Thừa Thiên Huế</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-hue-gold shrink-0" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-hue-gold shrink-0" />
                <span>support@huehomestay.vn</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>© 2026 Hue Homestay. Nền tảng đặt phòng trực tuyến hàng đầu.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="flex items-center gap-1">Ngôn ngữ: <strong className="text-white">Tiếng Việt</strong></span>
            <span className="flex items-center gap-1">Tiền tệ: <strong className="text-white">VND</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
