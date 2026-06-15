"use client";
import React, { useState, useEffect } from 'react';
import { Users, Home, DollarSign, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import axiosClient from '@/lib/axiosClient';
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHomestays: 0,
    totalRevenue: 0,
    pendingHomestays: 0
  });
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, homestaysRes] = await Promise.all([
          axiosClient.get('/admin/dashboard'),
          axiosClient.get('/admin/homestays')
        ]);
        setStats(statsRes.data);
        const pending = homestaysRes.data.filter((h: any) => h.status === 'PENDING');
        setPendingList(pending);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan Hệ thống</h1>
        <p className="text-gray-500 mt-1">Theo dõi các chỉ số quan trọng của Hue Homestay</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng Người dùng</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-2">{loading ? '...' : stats.totalUsers}</h3>
            <p className="text-xs text-green-500 mt-2 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" /> +12% so với tháng trước
            </p>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng Homestay</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-2">{loading ? '...' : stats.totalHomestays}</h3>
            <p className="text-xs text-green-500 mt-2 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" /> +5 homestay mới
            </p>
          </div>
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Home className="w-7 h-7" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-500 font-medium">Doanh thu nền tảng</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-2">{loading ? '...' : (stats.totalRevenue > 0 ? stats.totalRevenue.toLocaleString() + ' ₫' : '0 ₫')}</h3>
            <p className="text-xs text-green-500 mt-2 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" /> +18% so với tháng trước
            </p>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <DollarSign className="w-7 h-7" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Homestay cần duyệt gấp</h2>
          <Link href="/admin/homestays" className="text-sm font-medium text-blue-600 hover:text-blue-700">Xem tất cả</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-gray-500 text-sm rounded-l-xl">Tên Homestay</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-sm">Chủ nhà</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-sm">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-sm rounded-r-xl">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pendingList.length > 0 ? pendingList.map(homestay => (
                <tr key={homestay.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&q=80" alt="hs" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="font-semibold text-gray-800">{homestay.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600 font-medium">{homestay.host?.name || 'Không rõ'}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold border border-amber-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Chờ duyệt
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition" title="Duyệt">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition" title="Từ chối">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Không có homestay nào cần duyệt gấp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
