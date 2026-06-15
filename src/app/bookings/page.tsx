"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, Clock, CheckCircle, XCircle, Loader, Filter, Search, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
type BookingStatusType = 'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
interface BookingItem {
  id: string;
  homestayName: string;
  roomName: string;
  address: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: BookingStatusType;
  createdAt: string;
}
import axiosClient from '@/lib/axiosClient';
const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  PENDING: {
    label: 'Chờ xác nhận',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    icon: <Clock className="w-4 h-4" />,
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  COMPLETED: {
    label: 'Hoàn thành',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-200',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    icon: <XCircle className="w-4 h-4" />,
  },
};
const filterTabs: { key: BookingStatusType; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ xác nhận' },
  { key: 'CONFIRMED', label: 'Đã xác nhận' },
  { key: 'COMPLETED', label: 'Hoàn thành' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];
export default function BookingsPage() {
  const [activeFilter, setActiveFilter] = useState<BookingStatusType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(storedUser);
    
    const fetchBookings = async () => {
      try {
        const res = await axiosClient.get(`/user/${user.id}/bookings`);
        setBookings(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử đặt phòng:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [router]);
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = activeFilter === 'ALL' || b.status === activeFilter;
    const homestayName = b.room?.homestay?.name || '';
    const roomName = b.room?.name || '';
    const matchesSearch = homestayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  const getNights = (checkIn: string, checkOut: string) => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    return Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  };
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E8] pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Back button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#8B4513] transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Về trang chủ
            </Link>
          </motion.div>
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B4513] to-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg shadow-[#8B4513]/20">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              Lịch sử Đặt phòng
            </h1>
            <p className="text-gray-500 mt-2 ml-[60px]">Theo dõi và quản lý các đơn đặt phòng của bạn</p>
          </motion.div>
          {/* Filters & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6"
          >
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên homestay, phòng hoặc mã đơn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>
            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeFilter === tab.key
                      ? 'bg-[#8B4513] text-white shadow-md shadow-[#8B4513]/20'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                  {tab.key === 'ALL' && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20">
                      {bookings.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
          {/* Booking List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="text-center py-20 text-gray-500">Đang tải dữ liệu...</div>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => {
                  const status = statusConfig[booking.status] || statusConfig['PENDING'];
                  const nights = getNights(booking.checkIn, booking.checkOut);
                  return (
                    <motion.div
                      key={booking.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all group"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Left color stripe */}
                        <div className={`w-full md:w-1.5 h-1.5 md:h-auto ${
                          booking.status === 'CONFIRMED' ? 'bg-blue-500' :
                          booking.status === 'PENDING' ? 'bg-amber-500' :
                          booking.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-red-400'
                        }`} />
                        {/* Content */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            {/* Booking Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">{booking.id}</span>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.bgColor} ${status.color}`}>
                                  {status.icon}
                                  {status.label}
                                </span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#8B4513] transition-colors">{booking.room?.homestay?.name || 'Homestay'}</h3>
                              <p className="text-gray-500 text-sm mt-1">{booking.room?.name || 'Phòng'}</p>
                              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4 text-[#8B4513]" />
                                  {booking.room?.homestay?.address || 'Địa chỉ'}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Users className="w-4 h-4 text-[#8B4513]" />
                                  {booking.guests} khách
                                </span>
                              </div>
                            </div>
                            {/* Price & Dates */}
                            <div className="text-right md:min-w-[180px]">
                              <p className="text-2xl font-bold text-[#8B4513]">{formatPrice(booking.totalPrice)}</p>
                              <p className="text-xs text-gray-400 mt-1">{nights} đêm</p>
                              <div className="mt-4 bg-gray-50 rounded-xl p-3 text-sm">
                                <div className="flex items-center justify-between text-gray-600 mb-1">
                                  <span className="text-gray-400">Nhận phòng:</span>
                                  <span className="font-semibold">{formatDate(booking.checkIn)}</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-600">
                                  <span className="text-gray-400">Trả phòng:</span>
                                  <span className="font-semibold">{formatDate(booking.checkOut)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400">Đặt ngày {formatDate(booking.createdAt)}</p>
                            <div className="flex gap-2">
                              {booking.status === 'PENDING' && (
                                <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                  Hủy đơn
                                </button>
                              )}
                              {booking.status === 'COMPLETED' && (
                                <button className="px-4 py-2 text-sm font-medium text-[#D4AF37] bg-[#D4AF37]/10 rounded-lg hover:bg-[#D4AF37]/20 transition-colors">
                                  ⭐ Đánh giá
                                </button>
                              )}
                              <button className="px-4 py-2 text-sm font-medium text-[#8B4513] bg-[#8B4513]/10 rounded-lg hover:bg-[#8B4513]/20 transition-colors flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                Chi tiết
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Không tìm thấy đơn đặt phòng</h3>
                  <p className="text-gray-400 mb-6">Chưa có đơn đặt phòng nào phù hợp với bộ lọc của bạn.</p>
                  <Link
                    href="/#homestays"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#D4AF37] text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Khám phá Homestay ngay
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
