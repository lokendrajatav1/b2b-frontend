'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  RefreshCcw,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VendorNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading && notifications.length === 0) {
    return <div className="p-10 animate-pulse bg-slate-50 rounded-xl h-80 border border-slate-100"></div>;
  }

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 mb-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
             Notifications
            <div className="p-1.5 bg-gray-50 text-slate-700 rounded-xl border border-gray-100">
              <Bell className="w-4 h-4" />
            </div>
          </h1>
          <p className="text-slate-700 font-medium mt-1 text-sm">Updates on your products, services, and buyer inquiries.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllRead}
            disabled={!notifications.some(n => !n.isRead)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-slate-800 font-semibold text-sm flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 transition-all "
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
          <button 
            onClick={fetchNotifications}
            className="px-4 py-2 bg-[#164e33] text-white rounded-xl font-semibold text-sm flex items-center gap-2  transition-all hover:bg-[#113f29]"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {notifications.length > 0 ? (
          <AnimatePresence>
            {notifications.map((n) => (
              <motion.div 
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`p-6 bg-white rounded-xl border ${n.isRead ? 'border-gray-100' : 'border-blue-200 bg-[#164e33]/5/30'} flex gap-5 group hover:border-blue-300 transition-all `}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${n.isRead ? 'bg-gray-50 text-slate-700 border-gray-100' : 'bg-white text-[#164e33] border-[#164e33]/10'}`}>
                  {n.title.includes('Approved') || n.title.includes('Success') ? <CheckCircle2 className="w-5 h-5 cursor-default" /> : <Bell className="w-5 h-5 cursor-default" />}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-semibold ${n.isRead ? 'text-slate-800' : 'text-slate-900'}`}>{n.title}</h3>
                    <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 ml-4">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm ${n.isRead ? 'text-slate-700' : 'text-slate-800'} leading-relaxed max-w-2xl font-medium`}>{n.message}</p>
                </div>

                <div className="flex flex-col gap-2">
                   <button 
                    onClick={() => deleteNotification(n.id)}
                    className="p-2 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete permanently"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700 border border-gray-100 ">
                <Bell className="w-8 h-8" />
            </div>
            <p className="text-slate-700 font-semibold text-sm">No active notifications</p>
            <p className="text-slate-700 font-medium text-sm mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}



