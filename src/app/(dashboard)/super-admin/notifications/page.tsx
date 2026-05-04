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
  CheckCheck,
  Megaphone,
  Send,
  ShieldCheck,
  XCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminNotifications() {
  const [activeTab, setActiveTab] = useState<'ALERTS' | 'BROADCAST'>('ALERTS');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Announcement Form
  const [formData, setFormData] = useState({ title: '', message: '', type: 'INFO', target: 'ALL' });
  const [broadcasting, setBroadcasting] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  useEffect(() => {
    if (activeTab === 'ALERTS') fetchNotifications();
  }, [activeTab]);

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

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;
    
    setBroadcasting(true);
    setStatus({ type: '', text: '' });
    try {
      await apiFetch('/admin/notifications/broadcast', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setStatus({ type: 'success', text: 'Announcement sent successfully to all members.' });
      setFormData({ title: '', message: '', type: 'INFO', target: 'ALL' });
      if (activeTab === 'ALERTS') fetchNotifications();
    } catch (error) {
      setStatus({ type: 'error', text: 'Failed to send announcement. Please try again.' });
    } finally {
      setBroadcasting(false);
      setTimeout(() => setStatus({ type: '', text: '' }), 5000);
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
          <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
            Notifications & Announcements
            <div className="p-1.5 bg-[#164e33]/5 text-[#164e33] rounded-xl border border-[#164e33]/10">
              <Bell className="w-5 h-5" />
            </div>
          </h1>
          <p className="text-slate-700 font-medium mt-1 text-base">Manage system alerts and send updates to all platform members.</p>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-xl">
           <button 
             onClick={() => setActiveTab('ALERTS')}
             className={`px-5 py-2 rounded-lg text-base font-semibold uppercase  transition-all ${activeTab === 'ALERTS' ? 'bg-white text-[#164e33] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
           >
              System Alerts
           </button>
           <button 
             onClick={() => setActiveTab('BROADCAST')}
             className={`px-5 py-2 rounded-lg text-base font-semibold uppercase  transition-all ${activeTab === 'BROADCAST' ? 'bg-white text-[#164e33] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
           >
              Send Announcement
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
         {activeTab === 'ALERTS' ? (
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-base font-semibold text-slate-900 uppercase  flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-600" /> Recent Activity
                 </h2>
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={markAllRead}
                      className="text-base font-semibold text-[#164e33] hover:text-slate-800 transition-colors"
                    >
                      Clear All Notifications
                    </button>
                    <button onClick={fetchNotifications} className="p-2 bg-white border border-gray-200 rounded-xl text-slate-500 hover:bg-gray-50 transition-all shadow-sm">
                       <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                 </div>
              </div>

              <div className="space-y-4">
                 {loading && notifications.length === 0 ? (
                   [1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-50/50 rounded-xl animate-pulse border border-gray-100"></div>)
                 ) : notifications.length > 0 ? (
                   <AnimatePresence>
                     {notifications.map((n) => (
                       <motion.div 
                         key={n.id}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         className={`group p-6 bg-white rounded-2xl border ${n.isRead ? 'border-gray-50 opacity-75' : 'border-gray-100 shadow-sm'} flex items-start gap-6 hover:border-blue-200 transition-all`}
                       >
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${n.isRead ? 'bg-gray-50 text-slate-500' : 'bg-[#164e33]/5 text-[#164e33]'}`}>
                           <Bell className="w-5 h-5" />
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                               <h3 className="text-base font-semibold text-slate-900 ">{n.title}</h3>
                               <p className="text-base font-semibold text-slate-500 uppercase ">{new Date(n.createdAt).toLocaleDateString()}</p>
                            </div>
                            <p className="text-base text-slate-700 leading-relaxed max-w-2xl">{n.message}</p>
                         </div>
                         <button 
                             onClick={() => deleteNotification(n.id)}
                             className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                 ) : (
                   <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-xl opacity-50 bg-gray-50/30">
                      <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-base font-semibold text-slate-500 uppercase ">No notifications found</p>
                   </div>
                 )}
              </div>
           </div>
         ) : (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-8 md:p-10 shadow-sm space-y-8">
                 <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 ">New Announcement</h2>
                    <p className="text-base font-medium text-slate-700">Send a platform-wide message to all selected members.</p>
                 </div>

                 <form onSubmit={handleBroadcast} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-base font-semibold text-slate-800 ml-1">Title</label>
                       <input 
                         type="text" 
                         value={formData.title}
                         onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                         className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-medium outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900"
                         placeholder="e.g. Platform Update: New Features for Vendors"
                       />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-base font-semibold text-slate-800 ml-1">Alert Type</label>
                          <select 
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold text-slate-800 outline-none appearance-none hover:bg-gray-100 transition-colors"
                          >
                             <option value="INFO">Information</option>
                             <option value="WARNING">Warning</option>
                             <option value="DANGER">Critical Alert</option>
                             <option value="SUCCESS">Success Message</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-base font-semibold text-slate-800 ml-1">Target Audience</label>
                          <select 
                            value={formData.target}
                            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold text-slate-800 outline-none appearance-none hover:bg-gray-100 transition-colors"
                          >
                             <option value="ALL">Everyone (Global)</option>
                             <option value="ALL_VENDORS">All Vendors</option>
                             <option value="ALL_BUYERS">All Buyers</option>
                             <option value="SUBADMIN">Admins (Team)</option>
                          </select>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-base font-semibold text-slate-800 ml-1">Message Content</label>
                       <textarea 
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={6}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-medium outline-none focus:border-blue-500 focus:bg-white transition-all resize-none text-slate-900"
                          placeholder="Type your message here..."
                       />
                    </div>

                    <button 
                      type="submit"
                      disabled={broadcasting || !formData.title || !formData.message}
                      className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold text-base flex items-center justify-center gap-3 shadow-lg hover:bg-black transition-all disabled:opacity-50"
                    >
                       {broadcasting ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Megaphone className="w-5 h-5 text-blue-400" />}
                       {broadcasting ? 'Sending Announcement...' : 'Send Announcement'}
                    </button>
                 </form>
              </div>

              <div className="lg:col-span-5 space-y-6">
                 <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm space-y-6">
                    <h3 className="text-base font-semibold text-slate-500 uppercase  flex items-center gap-2">
                       <Info className="w-4 h-4 text-slate-600" /> Important Reminders
                    </h3>
                    <div className="space-y-4">
                       <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                          <p className="text-base font-medium text-amber-800 leading-relaxed">
                            Announcements are sent instantly to all chosen recipients. Please ensure all details are correct before sending, as they will be recorded in the notification history.
                          </p>
                       </div>
                    </div>
                 </div>

                 <AnimatePresence>
                    {status.text && (
                      <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0 }}
                         className={`p-6 rounded-2xl font-semibold text-base flex items-center gap-4 shadow-sm ${status.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
                      >
                         {status.type === 'success' ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
                         {status.text}
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
         )}
      </div>
    </div>
  );
}



