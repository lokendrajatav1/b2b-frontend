'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  RefreshCcw,
  ShieldCheck,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  User,
  Target,
  Package,
  Megaphone,
  Briefcase,
  Box,
  Trash2,
  CheckCheck,
  Send,
  Info,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function AdminNotifications() {
  const [activeTab, setActiveTab] = useState<'ALERTS' | 'BROADCAST'>('ALERTS');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(24); 
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Broadcast Form
  const [formData, setFormData] = useState({ title: '', message: '', type: 'INFO', target: 'ALL' });
  const [broadcasting, setBroadcasting] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  useEffect(() => {
    if (activeTab === 'ALERTS') fetchNotifications();
  }, [activeTab, page, limit]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/notifications?page=${page}&limit=${limit}`);
      setNotifications(data.data || []);
      if (!data.data || data.data.length === 0) {
        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications(mockNotifications);
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
      setStatus({ type: 'success', text: 'Announcement sent successfully.' });
      setFormData({ title: '', message: '', type: 'INFO', target: 'ALL' });
    } catch (error) {
      setStatus({ type: 'error', text: 'Failed to send announcement.' });
    } finally {
      setBroadcasting(false);
      setTimeout(() => setStatus({ type: '', text: '' }), 5000);
    }
  };

  const getCategoryStyle = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('vendor')) return { label: 'Vendor', color: 'text-emerald-500 bg-emerald-50 border-emerald-100', icon: <Briefcase size={12} /> };
    if (t.includes('lead')) return { label: 'Lead', color: 'text-blue-500 bg-blue-50 border-blue-100', icon: <Target size={12} /> };
    if (t.includes('product') || t.includes('offering')) return { label: 'Product', color: 'text-orange-500 bg-orange-50 border-orange-100', icon: <Box size={12} /> };
    if (t.includes('user')) return { label: 'User', color: 'text-rose-500 bg-rose-50 border-rose-100', icon: <User size={12} /> };
    if (t.includes('package')) return { label: 'Package', color: 'text-purple-500 bg-purple-50 border-purple-100', icon: <Package size={12} /> };
    if (t.includes('announcement')) return { label: 'Announcement', color: 'text-amber-500 bg-amber-50 border-amber-100', icon: <Megaphone size={12} /> };
    return { label: 'System', color: 'text-slate-700 bg-slate-50 border-slate-100', icon: <Bell size={12} /> };
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className="w-12 h-12 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-center text-emerald-600 ">
              <Bell className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-xl font-semibold text-slate-900">Notifications & Announcements</h1>
              <p className="text-sm text-gray-600 font-normal mt-1">
                 Manage system alerts and send updates to all members.
              </p>
           </div>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
           <button 
             onClick={() => setActiveTab('ALERTS')}
             className={`px-6 py-2 rounded-lg text-sm font-bold uppercase transition-all duration-200 ${activeTab === 'ALERTS' ? 'bg-white text-slate-900 ' : 'text-slate-600 hover:text-slate-600'}`}
           >
              System Alerts
           </button>
           <button 
             onClick={() => setActiveTab('BROADCAST')}
             className={`px-6 py-2 rounded-lg text-sm font-bold uppercase transition-all duration-200 ${activeTab === 'BROADCAST' ? 'bg-white text-slate-900 ' : 'text-slate-600 hover:text-slate-600'}`}
           >
              Send Announcement
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'ALERTS' ? (
          <motion.div 
            key="alerts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-gray-100 rounded-xl  overflow-hidden flex flex-col"
          >
            {/* TABS BAR */}
            <div className="px-4 sm:px-8 py-5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button className="text-sm font-bold text-slate-900 relative pb-2 sm:pb-5 sm:-mb-5 w-fit">
                   Recent Activity
                   <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900 rounded-full" />
                </button>
 
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <button onClick={markAllRead} className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700">
                       <CheckCheck size={16} /> Mark all read
                    </button>
                    <button onClick={fetchNotifications} className="p-2 bg-white border border-gray-200 rounded-lg text-slate-600 hover:text-slate-600 transition-all ">
                       <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* LIST */}
            <div className="flex flex-col divide-y divide-gray-50">
               {notifications.map((n, idx) => {
                 const style = getCategoryStyle(n.title);
                 return (
                   <div key={n.id || idx} className={`group px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 hover:bg-slate-50/50 transition-all ${n.isRead ? 'opacity-50' : ''}`}>
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative shrink-0">
                           <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <Bell size={18} />
                           </div>
                           {!n.isRead && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h3 className="text-base font-bold text-slate-900 mb-0.5 truncate">{n.title}</h3>
                           <p className="text-sm font-medium text-slate-600 truncate">{n.message}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:min-w-[300px]">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-[10px] uppercase ${style.color}`}>
                           {style.icon} {style.label}
                        </div>
                        <div className="text-right whitespace-nowrap">
                           <p className="text-[11px] font-bold text-slate-900 mb-0.5">{format(new Date(n.createdAt || Date.now()), 'MMM dd, yyyy')}</p>
                           <p className="text-[10px] font-bold text-slate-500 uppercase">{format(new Date(n.createdAt || Date.now()), 'hh:mm a')}</p>
                        </div>
                        <button className="p-2 text-slate-200 hover:text-slate-700 sm:block hidden"><MoreVertical size={16} /></button>
                      </div>
                   </div>
                 );
               })}
            </div>

            {/* PAGINATION */}
            <div className="px-8 py-6 bg-slate-50/30 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm font-bold text-slate-700">Showing 1 to {notifications.length} of {total}</p>
                <div className="flex items-center gap-2">
                   <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-slate-600"><ChevronLeft size={16} /></button>
                   <button className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs">1</button>
                   <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-slate-600"><ChevronRight size={16} /></button>
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="broadcast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
             <div className="lg:col-span-7 bg-white rounded-xl border border-gray-100 p-8  space-y-8">
                <div className="space-y-1">
                   <h2 className="text-base font-bold text-slate-900">New Announcement</h2>
                   <p className="text-sm font-medium text-slate-600">Send a platform-wide message to members.</p>
                </div>

                <form onSubmit={handleBroadcast} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase ml-1">Title</label>
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all"
                        placeholder="Announcement Title"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-700 uppercase ml-1">Type</label>
                         <select 
                           value={formData.type}
                           onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                           className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold outline-none"
                         >
                            <option value="INFO">Information</option>
                            <option value="WARNING">Warning</option>
                            <option value="SUCCESS">Success</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-700 uppercase ml-1">Audience</label>
                         <select 
                           value={formData.target}
                           onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                           className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold outline-none"
                         >
                            <option value="ALL">All Users</option>
                            <option value="VENDORS">Vendors Only</option>
                            <option value="ADMINS">Admins Only</option>
                         </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase ml-1">Message</label>
                      <textarea 
                         value={formData.message}
                         onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                         rows={5}
                         className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
                         placeholder="Message details..."
                      />
                   </div>

                   <button 
                     type="submit"
                     disabled={broadcasting || !formData.title || !formData.message}
                     className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-black transition-all disabled:opacity-50"
                   >
                      {broadcasting ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {broadcasting ? 'Sending...' : 'Broadcast Message'}
                   </button>
                </form>
             </div>

             <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 p-8 ">
                   <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2 mb-6">
                      <Info className="w-4 h-4" /> Guidelines
                   </h3>
                   <div className="p-5 bg-amber-50 rounded-xl border border-amber-100 flex gap-4">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                      <p className="text-xs font-bold text-amber-800 leading-relaxed">
                        Broadcasts are sent instantly. Verify details carefully before sending.
                      </p>
                   </div>
                </div>

                <AnimatePresence>
                   {status.text && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`p-6 rounded-xl font-bold text-sm flex items-center gap-4  ${status.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
                     >
                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        {status.text}
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const mockNotifications = [
  { id: '1', title: 'New vendor registered', message: 'Vendor "Piyush Enterprises" has been successfully registered.', createdAt: '2026-05-05T10:45:00', isRead: false },
  { id: '2', title: 'Lead reassigned', message: 'Lead has been reassigned to vendor "3 Wings".', createdAt: '2026-05-05T09:30:00', isRead: false },
  { id: '3', title: 'Product approved', message: 'Product "Toilet Cleaning Agent" has been approved.', createdAt: '2026-05-05T08:15:00', isRead: false },
  { id: '4', title: 'User deleted', message: 'User "Piyush (Vendor)" has been permanently deleted.', createdAt: '2026-05-04T19:10:00', isRead: false },
  { id: '5', title: 'Vendor approved', message: 'Vendor "3 Wings" has been approved.', createdAt: '2026-05-04T18:05:00', isRead: false },
  { id: '6', title: 'Lead status updated', message: 'Lead status updated to "Closed - Won".', createdAt: '2026-05-04T17:50:00', isRead: false },
  { id: '7', title: 'Package activated', message: 'Gold package has been activated for "Sai Exports".', createdAt: '2026-05-04T16:30:00', isRead: false },
  { id: '8', title: 'Announcement sent', message: 'New platform update announcement has been sent to all users.', createdAt: '2026-05-04T15:15:00', isRead: false },
];
