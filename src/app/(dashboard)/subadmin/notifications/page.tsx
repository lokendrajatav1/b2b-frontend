'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Bell, 
  CheckCircle2, 
  Trash2, 
  RefreshCcw,
  ShieldCheck,
  XCircle,
  Megaphone,
  Info,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubAdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/notifications');
      setNotifications(data.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await apiFetch('/notifications/mark-all-read', { method: 'PATCH' });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}`, { method: 'DELETE' });
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            Team Announcements
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
              <Megaphone className="w-5 h-5" />
            </div>
          </h1>
          <p className="text-gray-500 font-medium mt-1 text-sm">Vital updates and administrative broadcasts for your team.</p>
        </div>

        <div className="flex items-center gap-3">
            <button 
                onClick={markAllRead}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2 rounded-xl border border-blue-100"
            >
                Clear All
            </button>
            <button onClick={fetchNotifications} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
                <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
            {loading && notifications.length === 0 ? (
            [1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-50/50 rounded-2xl animate-pulse border border-gray-100"></div>)
            ) : notifications.length > 0 ? (
            <AnimatePresence>
                {notifications.map((n) => (
                <motion.div 
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`group p-6 bg-white rounded-3xl border ${n.isRead ? 'border-gray-50 opacity-75' : 'border-gray-100 shadow-sm'} flex items-start gap-6 hover:border-blue-200 transition-all`}
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${n.isRead ? 'bg-gray-50 text-gray-400' : 'bg-blue-50 text-blue-600 shadow-sm'}`}>
                    <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-base font-bold text-gray-900 tracking-tight">{n.title}</h3>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">
                                <Clock className="w-3 h-3" />
                                {new Date(n.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">{n.message}</p>
                    </div>
                    <button 
                        onClick={() => deleteNotification(n.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </motion.div>
                ))}
            </AnimatePresence>
            ) : (
            <div className="py-24 text-center border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/30">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center border border-gray-100 mx-auto mb-6 text-gray-200">
                    <Bell className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-400">Vault Secure</h3>
                <p className="text-sm font-medium text-gray-300 max-w-xs mx-auto mt-2">No active announcements addressed to your team at the moment.</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
}
