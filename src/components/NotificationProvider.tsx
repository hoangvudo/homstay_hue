"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axiosClient from '@/lib/axiosClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface NotificationContextType {
  notifications: any[];
  unreadCount: number;
  markAsRead: (id: string) => void;
}
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
});
export const useNotification = () => useContext(NotificationContext);
export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    
    const user = JSON.parse(userStr);
    const userId = user.id;
    const userEmail = user.email;
    // Lấy danh sách thông báo cũ từ API
    axiosClient.get(`/notifications/user/${userId}`)
      .then(res => {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n: any) => !n.read).length);
      })
      .catch(err => console.error(err));
    // Kết nối STOMP/WebSocket
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // console.log(str);
      },
      onConnect: () => {
        console.log('STOMP Connected');
        client.subscribe(`/user/${userEmail}/queue/notifications`, (message) => {
          if (message.body) {
            const notif = JSON.parse(message.body);
            setNotifications(prev => [notif, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Hiển thị Toast
            toast.info(`${notif.title}: ${notif.message}`, {
              position: "top-right",
              autoClose: 5000,
            });
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
      }
    });
    client.activate();
    return () => {
      client.deactivate();
    };
  }, []);
  const markAsRead = async (id: string) => {
    try {
      await axiosClient.post(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
      <ToastContainer />
    </NotificationContext.Provider>
  );
};
