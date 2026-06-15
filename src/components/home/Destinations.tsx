import { ArrowRight } from 'lucide-react';
const destinations = [
  { id: 1, name: 'Đại Nội Huế', desc: 'Trung tâm chính trị của triều Nguyễn, di sản văn hóa thế giới.', image: 'https://images.unsplash.com/photo-1590050752117-238cb0079cb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', span: 'md:col-span-2 md:row-span-2' },
  { id: 2, name: 'Chùa Thiên Mụ', desc: 'Biểu tượng tâm linh bên dòng sông Hương.', image: 'https://images.unsplash.com/photo-1600864752251-2cf77f6b955c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', span: 'md:col-span-1 md:row-span-1' },
  { id: 3, name: 'Lăng Khải Định', desc: 'Kiến trúc giao thoa Đông - Tây tuyệt đẹp.', image: 'https://images.unsplash.com/photo-1628286950796-03f4219ba482?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', span: 'md:col-span-1 md:row-span-1' },
  { id: 4, name: 'Biển Thuận An', desc: 'Bãi biển hoang sơ, yên bình cách trung tâm 15km.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', span: 'md:col-span-1 md:row-span-1' },
  { id: 5, name: 'Lăng Minh Mạng', desc: 'Vẻ đẹp uy nghi, hài hòa với thiên nhiên.', image: 'https://images.unsplash.com/photo-1596781283626-d668ccbceb9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', span: 'md:col-span-1 md:row-span-1' },
];
export default function Destinations() {
  return (
    <section id="destinations" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Địa điểm không thể bỏ lỡ</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Gợi ý các điểm tham quan nổi tiếng nhất tại Huế để bạn có một chuyến đi trọn vẹn.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
          {destinations.map((dest) => (
            <div 
              key={dest.id} 
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${dest.span}`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${dest.image})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              
              <div className="absolute bottom-0 left-0 p-6 w-full flex flex-col justify-end h-full">
                <h3 className="text-white font-serif font-bold text-2xl mb-2">{dest.name}</h3>
                <p className="text-white/80 text-sm mb-4 line-clamp-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {dest.desc}
                </p>
                <div className="flex items-center text-hue-gold font-medium text-sm gap-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                  Khám phá <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
