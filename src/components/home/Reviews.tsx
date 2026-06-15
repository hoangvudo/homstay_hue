"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
const reviews = [
  { id: 1, name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?img=11', content: 'Homestay rất đẹp và sạch sẽ. Chủ nhà thân thiện, nhiệt tình. Vị trí tuyệt vời ngay trung tâm, dễ dàng di chuyển tham quan Đại Nội.', rating: 5, date: '2 ngày trước' },
  { id: 2, name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?img=5', content: 'Trải nghiệm tuyệt vời! Buổi sáng uống trà ngắm sông Hương thật sự thư giãn. Chắc chắn sẽ quay lại vào dịp Festival Huế.', rating: 5, date: '1 tuần trước' },
  { id: 3, name: 'Lê Hoàng C', avatar: 'https://i.pravatar.cc/150?img=33', content: 'Thiết kế phòng mang đậm nét truyền thống nhưng tiện nghi rất hiện đại. Đồ ăn sáng ngon miệng.', rating: 4, date: '2 tuần trước' },
  { id: 4, name: 'Phạm Minh D', avatar: 'https://i.pravatar.cc/150?img=14', content: 'Ứng dụng dễ sử dụng, đặt phòng nhanh chóng. Nhận phòng không gặp bất cứ rắc rối nào. Highly recommend!', rating: 5, date: '1 tháng trước' },
];
export default function Reviews() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Abstract Background pattern */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-hue-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-hue-red/10 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Khách hàng nói gì về chúng tôi?</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hàng ngàn du khách đã tin tưởng và có những trải nghiệm khó quên tại Huế thông qua nền tảng của chúng tôi.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="pb-14"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative h-full">
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-hue-gold/20" />
                  
                  <div className="flex gap-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-hue-gold text-hue-gold" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-8 italic line-clamp-4">
                    "{review.content}"
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-hue-gold/30" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{review.name}</h4>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
