"use client";
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
export default function Statistics() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const stats = [
    { id: 1, label: 'Homestay chất lượng', value: 1000, suffix: '+' },
    { id: 2, label: 'Khách hàng tin dùng', value: 5000, suffix: '+' },
    { id: 3, label: 'Đơn đặt phòng', value: 10000, suffix: '+' },
    { id: 4, label: 'Tỉ lệ hài lòng', value: 98, suffix: '%' },
  ];
  return (
    <section className="py-16 bg-gradient-to-r from-hue-red-dark to-hue-red text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
          {stats.map((stat, index) => (
            <div key={stat.id} className={`px-4 ${index % 2 === 0 ? 'border-none md:border-solid' : 'border-none'}`}>
              <div className="text-4xl md:text-5xl font-bold font-serif mb-2 text-hue-gold-light">
                {inView ? (
                  <CountUp end={stat.value} duration={2.5} separator="," />
                ) : (
                  '0'
                )}
                {stat.suffix}
              </div>
              <p className="text-white/80 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
