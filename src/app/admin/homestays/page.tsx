"use client";
import React, { useState, useEffect } from 'react';
import { Search, Home, MapPin, CheckCircle, XCircle, MoreVertical, ShieldAlert, User } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';
import NotificationModal from '@/components/NotificationModal';
import axiosClient from '@/lib/axiosClient';
export default function AdminHomestays() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [homestays, setHomestays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Modal states
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'approve' as 'approve' | 'reject', homestayId: '', homestayName: '' });
  const [notification, setNotification] = useState({ isOpen: false, type: 'success' as 'success' | 'error', title: '', message: '' });
  const fetchHomestays = async () => {
    try {
      const res = await axiosClient.get('/admin/homestays');
      setHomestays(res.data);
    } catch (error) {
      console.error('Error fetching homestays', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHomestays();
  }, []);
  const handleAction = async () => {
    try {
      const endpoint = confirmModal.type === 'approve' 
        ? `/admin/homestays/${confirmModal.homestayId}/approve`
        : `/admin/homestays/${confirmModal.homestayId}/reject`;
        
      await axiosClient.post(endpoint);
      
      setConfirmModal({ ...confirmModal, isOpen: false });
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Thành công',
        message: `Đã ${confirmModal.type === 'approve' ? 'phê duyệt' : 'từ chối'} homestay "${confirmModal.homestayName}" thành công.`
      });
      fetchHomestays();
    } catch (error) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Thất bại',
        message: 'Đã xảy ra lỗi khi thực hiện thao tác này.'
      });
    }
  };
  const filteredHomestays = homestays.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || h.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || h.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Duyệt Homestay</h1>
          <p className="text-gray-500 mt-1">Kiểm duyệt các homestay mới do Host đăng ký</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm homestay hoặc địa chỉ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Bị từ chối</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Homestay</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Chủ nhà</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Đánh giá</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Ngày tạo</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-sm text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filteredHomestays.map((homestay) => (
                <tr key={homestay.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-hue-orange">
                        <Home className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 block">{homestay.name}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {homestay.address.substring(0, 30)}...
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3 h-3 text-gray-400" />
                      {homestay.host?.name || 'Không rõ'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">Chờ cập nhật</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      homestay.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      homestay.status === 'REJECTED' ? 'bg-red-50 text-red-600 border border-red-100' : 
                      'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {homestay.status === 'APPROVED' && <CheckCircle className="w-3 h-3" />}
                      {homestay.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                      {homestay.status === 'PENDING' && <ShieldAlert className="w-3 h-3" />}
                      {homestay.status === 'APPROVED' ? 'Đã duyệt' : homestay.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(homestay.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {homestay.status === 'PENDING' ? (
                      <>
                        <button 
                          onClick={() => setConfirmModal({ isOpen: true, type: 'approve', homestayId: homestay.id, homestayName: homestay.name })}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Phê duyệt">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setConfirmModal({ isOpen: true, type: 'reject', homestayId: homestay.id, homestayName: homestay.name })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Từ chối">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                       <button className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition">
                         <MoreVertical className="w-5 h-5" />
                       </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleAction}
        title={confirmModal.type === 'approve' ? 'Phê duyệt Homestay' : 'Từ chối Homestay'}
        message={`Bạn có chắc chắn muốn ${confirmModal.type === 'approve' ? 'phê duyệt' : 'từ chối'} homestay "${confirmModal.homestayName}"?`}
        confirmText={confirmModal.type === 'approve' ? 'Phê duyệt' : 'Từ chối'}
        cancelText="Hủy bỏ"
        danger={confirmModal.type === 'reject'}
      />
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>
  );
}
