"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Users, MapPin, CheckCircle, XCircle } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';
import axiosClient from '@/lib/axiosClient';
import { useRouter } from 'next/navigation';
export default function HostBookings() {
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
        const res = await axiosClient.get(`/host/${user.id}/bookings`);
        setBookings(res.data);
      } catch (error) {
        console.error('Error fetching bookings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [router]);
  const [filter, setFilter] = useState('ALL');
  const [actionConfirm, setActionConfirm] = useState<{ id: string, action: 'approve' | 'reject' } | null>(null);
  const statusConfig: Record<string, { label: string, color: string, bg: string }> = {
    PENDING: { label: 'Chờ duyệt', color: 'text-amber-700', bg: 'bg-amber-100' },
    CONFIRMED: { label: 'Đã nhận', color: 'text-blue-700', bg: 'bg-blue-100' },
    COMPLETED: { label: 'Hoàn thành', color: 'text-emerald-700', bg: 'bg-emerald-100' },
    CANCELLED: { label: 'Đã hủy', color: 'text-red-700', bg: 'bg-red-100' },
  };
  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Đặt phòng</h1>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm theo mã đơn, tên khách..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${filter === f ? 'bg-[#8B4513] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {f === 'ALL' ? 'Tất cả' : statusConfig[f].label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-semibold">Mã Đơn / Khách hàng</th>
                <th className="p-4 font-semibold">Phòng & Ngày</th>
                <th className="p-4 font-semibold">Tổng tiền</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filtered.map(booking => {
                const config = statusConfig[booking.status] || statusConfig['PENDING'];
                return (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <p className="font-mono text-xs text-gray-500 mb-1">{booking.id.substring(0,8)}</p>
                    <p className="font-bold text-gray-800">{booking.user?.name || 'Khách'}</p>
                    <p className="text-sm text-gray-500">{booking.user?.phone || '09xxxxxxxx'}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-800">{booking.room?.homestay?.name || 'Homestay'}</p>
                    <p className="text-sm text-gray-500 mb-1">{booking.room?.name || 'Phòng'}</p>
                    <div className="flex items-center gap-1 text-xs font-medium text-[#8B4513] bg-[#8B4513]/10 inline-flex px-2 py-1 rounded">
                      <Calendar className="w-3.5 h-3.5" /> {booking.checkIn} → {booking.checkOut}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-[#8B4513]">
                      {new Intl.NumberFormat('vi-VN').format(booking.totalPrice)} ₫
                    </p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {booking.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setActionConfirm({ id: booking.id, action: 'approve' })} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Duyệt">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button onClick={() => setActionConfirm({ id: booking.id, action: 'reject' })} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Từ chối">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button className="text-sm font-medium text-[#8B4513] hover:underline">Chi tiết</button>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">Không có đơn đặt phòng nào phù hợp.</div>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={actionConfirm !== null}
        onClose={() => setActionConfirm(null)}
        onConfirm={() => setActionConfirm(null)}
        title={actionConfirm?.action === 'approve' ? 'Duyệt đơn này?' : 'Từ chối đơn này?'}
        message={actionConfirm?.action === 'approve' ? 'Bạn xác nhận có thể đón khách vào thời gian này?' : 'Bạn có chắc chắn muốn từ chối đơn này? Hệ thống sẽ thông báo hoàn tiền cho khách.'}
        confirmText="Xác nhận"
        danger={actionConfirm?.action === 'reject'}
      />
    </div>
  );
}
