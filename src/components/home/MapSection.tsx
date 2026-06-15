"use client";
import dynamic from 'next/dynamic';
// Import component Map mà KHÔNG chạy trên Server (tránh lỗi của leaflet window is not defined)
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse flex items-center justify-center">
      <p className="text-gray-500 font-medium">Đang tải bản đồ...</p>
    </div>
  )
});
export default function MapSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Khám phá trên bản đồ</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Dễ dàng tìm kiếm chỗ nghỉ có vị trí thuận lợi nhất cho hành trình của bạn.
            </p>
          </div>
        </div>
        <Map />
      </div>
    </section>
  );
}
