import { motion } from 'framer-motion';
const categories = [
  { id: 1, title: 'Gần Đại Nội', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', count: '124 chỗ nghỉ' },
  { id: 2, title: 'View Sông Hương', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', count: '85 chỗ nghỉ' },
  { id: 3, title: 'Trung tâm thành phố', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', count: '312 chỗ nghỉ' },
  { id: 4, title: 'Biển Thuận An', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', count: '45 chỗ nghỉ' },
  { id: 5, title: 'Homestay giá rẻ', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', count: '210 chỗ nghỉ' },
  { id: 6, title: 'Cao cấp & Biệt thự', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', count: '56 chỗ nghỉ' },
];
export default function Categories() {
  return (
    <section id="categories" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Danh mục nổi bật</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Khám phá các lựa chọn chỗ nghỉ tuyệt vời nhất tại Huế được phân loại theo sở thích và vị trí.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((cat, index) => (
            <div 
              key={cat.id} 
              className="group cursor-pointer rounded-2xl overflow-hidden relative aspect-[4/5] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url(${cat.image})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="text-white font-bold text-lg leading-tight mb-1">{cat.title}</h3>
                <p className="text-hue-gold text-sm font-medium">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
