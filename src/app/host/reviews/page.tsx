"use client";
import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import axiosClient from '@/lib/axiosClient';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
export default function HostReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(storedUser);
    
    const fetchReviews = async () => {
      try {
        const res = await axiosClient.get(`/host/${user.id}/reviews`);
        setReviews(res.data);
      } catch (error) {
        console.error('Error fetching reviews', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [router]);
  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '0.0';
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Đánh giá của Khách</h1>
          <p className="text-gray-500 mt-1">Lắng nghe phản hồi để cải thiện dịch vụ</p>
        </div>
        <div className="bg-gradient-to-r from-[#D4AF37] to-amber-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <Star className="w-6 h-6 fill-white" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider opacity-80">Điểm trung bình</p>
            <p className="text-2xl font-bold leading-none mt-1">{averageRating} <span className="text-base font-normal opacity-80">/ 5.0</span></p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Chưa có đánh giá nào.</p>
          </div>
        ) : reviews.map(review => (
          <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                  {review.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{review.user?.name || 'Khách'}</h4>
                  <p className="text-xs text-gray-500">Đã ở tại <span className="font-medium text-[#8B4513]">{review.homestay?.name || 'Homestay'}</span></p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full text-sm font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> {review.rating}
                </div>
                <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 bg-gray-50 p-4 rounded-xl italic">"{review.comment}"</p>
            {review.reply ? (
              <div className="ml-12 p-4 bg-[#8B4513]/5 rounded-xl border border-[#8B4513]/10">
                <p className="text-xs font-bold text-[#8B4513] mb-1 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Phản hồi của bạn</p>
                <p className="text-gray-700 text-sm">{review.reply}</p>
              </div>
            ) : (
              <div className="ml-12">
                <button className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> Trả lời đánh giá này
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
