"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, Shield, User, Lock, Unlock, MoreVertical, Plus, Edit, Trash2 } from 'lucide-react';
import axiosClient from '@/lib/axiosClient';
import NotificationModal from '@/components/NotificationModal';
import ConfirmModal from '@/components/ConfirmModal';
import SlidePanel from '@/components/SlidePanel';
export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ isOpen: false, type: 'success' as 'success'|'error', title: '', message: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'USER' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: '', userName: '' });

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    try {
      await axiosClient.post(`/admin/users/${userId}/toggle-status`);
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Thành công',
        message: `Đã ${currentStatus === 'ACTIVE' ? 'khóa' : 'mở khóa'} tài khoản thành công.`
      });
      fetchUsers();
    } catch (error) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Thất bại',
        message: 'Không thể cập nhật trạng thái người dùng.'
      });
    }
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setFormData({ name: user.name, email: user.email, phone: user.phone || '', password: '', role: user.role });
    setIsFormOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', password: '', role: 'USER' });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await axiosClient.put(`/admin/users/${editingId}`, {
          name: formData.name,
          phone: formData.phone,
          role: formData.role
        });
        setNotification({ isOpen: true, type: 'success', title: 'Thành công', message: 'Cập nhật người dùng thành công' });
      } else {
        await axiosClient.post('/admin/users', formData);
        setNotification({ isOpen: true, type: 'success', title: 'Thành công', message: 'Tạo người dùng mới thành công' });
      }
      setIsFormOpen(false);
      fetchUsers();
    } catch (error: any) {
      setNotification({ isOpen: true, type: 'error', title: 'Thất bại', message: error.response?.data?.error || 'Đã xảy ra lỗi' });
    }
  };

  const handleDelete = async () => {
    try {
      await axiosClient.delete(`/admin/users/${deleteModal.userId}`);
      setNotification({ isOpen: true, type: 'success', title: 'Thành công', message: 'Xóa người dùng thành công' });
      fetchUsers();
    } catch (error: any) {
      setNotification({ isOpen: true, type: 'error', title: 'Thất bại', message: error.response?.data?.error || 'Không thể xóa người dùng này. Hãy dùng chức năng Khóa tài khoản.' });
    } finally {
      setDeleteModal({ isOpen: false, userId: '', userName: '' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
          <p className="text-gray-500 mt-1">Quản lý tài khoản Khách hàng và Chủ Homestay</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm hover:shadow-md flex items-center gap-2">
          <Plus className="w-5 h-5" /> Thêm người dùng
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition w-full sm:w-auto">
            <Filter className="w-4 h-4" /> Lọc danh sách
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Họ và tên</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Email</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Vai trò</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Ngày tham gia</th>
                <th className="px-6 py-4 font-semibold text-gray-500 text-sm text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'HOST' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 
                      user.role === 'ADMIN' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {user.role === 'HOST' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {user.role !== 'ADMIN' && (
                      <>
                        <button 
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={`p-2 rounded-lg transition ${user.status === 'ACTIVE' ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                          title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        >
                          {user.status === 'ACTIVE' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          title="Sửa"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setDeleteModal({ isOpen: true, userId: user.id, userName: user.name })}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
      
      <SlidePanel isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? 'Sửa Người dùng' : 'Thêm Người dùng mới'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" disabled={!!editingId} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          {!editingId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="USER">Khách hàng (USER)</option>
              <option value="HOST">Chủ nhà (HOST)</option>
              <option value="ADMIN">Quản trị viên (ADMIN)</option>
            </select>
          </div>
          <div className="pt-4">
            <button onClick={handleSave} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
              {editingId ? 'Cập nhật tài khoản' : 'Tạo tài khoản'}
            </button>
          </div>
        </div>
      </SlidePanel>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: '', userName: '' })}
        onConfirm={handleDelete}
        title="Xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng "${deleteModal.userName}"? Việc xóa sẽ thất bại nếu họ đã có Homestay hoặc Đặt phòng.`}
        confirmText="Xóa vĩnh viễn"
        cancelText="Hủy bỏ"
        danger={true}
      />
    </div>
  );
}
