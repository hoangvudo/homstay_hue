"use client";
import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, Star, DollarSign, ArrowUpRight, ArrowDownRight, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import axiosClient from '@/lib/axiosClient';

export default function HostDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const res = await axiosClient.get(`/host/${user.id}/dashboard`);
          setData(res.data);
        } catch (error) {
          console.error('Error fetching host dashboard', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
  }

  const stats = [
    { title: 'Tổng doanh thu', value: `${data?.totalRevenue?.toLocaleString('vi-VN') || 0} ₫`, change: '+0%', trend: 'up', icon: <DollarSign className="w-6 h-6" />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Lượt khách', value: data?.totalGuests || 0, change: '+0%', trend: 'up', icon: <Users className="w-6 h-6" />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Đơn đặt phòng', value: data?.totalBookings || 0, change: '+0%', trend: 'up', icon: <Calendar className="w-6 h-6" />, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Đánh giá TB', value: data?.averageRating?.toFixed(1) || '0.0', change: '+0.0', trend: 'up', icon: <Star className="w-6 h-6" />, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/20' },
  ];

  const recentBookings = data?.recentBookings || [];
  const availableRooms = data?.availableRooms || 0;
  const occupiedRooms = data?.occupiedRooms || 0;
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">Yêu cầu Đặt phòng mới</h2>
            <Link href="/host/bookings" className="text-sm font-medium text-[#8B4513] hover:underline">Xem tất cả</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentBookings.length > 0 ? recentBookings.map((booking: any) => (
              <div key={booking.id} className="p-6 flex flex-col sm:flex-row gap-4 justify-between hover:bg-gray-50 transition">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                    {booking.user?.name ? booking.user.name.substring(0, 2) : 'KH'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{booking.user?.name || 'Khách hàng'}</h4>
                    <p className="text-sm text-gray-500 mt-1">{booking.room?.name} • {Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 3600 * 24))} đêm</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(booking.checkInDate).toLocaleDateString('vi-VN')} - {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {booking.numberOfGuests} khách</span>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
                  <p className="font-bold text-[#8B4513]">{booking.totalPrice?.toLocaleString('vi-VN')} ₫</p>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      booking.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      'bg-gray-50 text-gray-600 border border-gray-100'
                    }`}>
                      {booking.status === 'PENDING' ? 'Chờ duyệt' : booking.status === 'CONFIRMED' ? 'Đã xác nhận' : booking.status}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500">
                Chưa có yêu cầu đặt phòng nào.
              </div>
            )}
          </div>
        </div>
        {/* Status / Activities */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Trạng thái phòng hôm nay</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Phòng trống</span>
                </div>
                <span className="text-xl font-bold">{availableRooms}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-700">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Đang có khách</span>
                </div>
                <span className="text-xl font-bold">{occupiedRooms}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Chờ dọn dẹp</span>
                </div>
                <span className="text-xl font-bold">0</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#8B4513] to-[#A0522D] rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h3 className="font-bold text-lg mb-2 relative z-10">Mẹo tăng doanh thu</h3>
            <p className="text-sm text-white/80 mb-4 relative z-10">Cập nhật hình ảnh chất lượng cao và thêm các tiện ích đặc biệt giúp tăng 30% tỷ lệ đặt phòng.</p>
            <Link href="/host/homestays" className="inline-block px-4 py-2 bg-white text-[#8B4513] font-semibold rounded-lg text-sm hover:shadow-md transition relative z-10">
              Cập nhật ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
