'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  ShieldCheck, 
  Settings, 
  Trash2, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  Clock,
  MoreHorizontal,
  Edit2,
  Lock,
  ArrowUpDown,
  RefreshCcw,
  UserCheck,
  Zap,
  Sparkles,
  MapPin,
  Building2,
  ChevronRight,
  Phone,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  
  // Action States
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [boostConfig, setBoostConfig] = useState<{vendorId: string, score: string} | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [timeRange]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/admin/users?timeRange=${timeRange}`);
      setUsers(data.data?.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBoost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boostConfig || isNaN(parseFloat(boostConfig.score))) return;

    try {
      setUpdatingId('boost');
      await apiFetch(`/admin/vendors/${boostConfig.vendorId}/boost`, {
        method: 'PATCH',
        body: JSON.stringify({ boostScore: parseFloat(boostConfig.score) })
      });
      
      setUsers(users.map(u => {
        if (u.role === 'VENDOR' && u.vendor?.id === boostConfig.vendorId) {
          return { ...u, vendor: { ...u.vendor, manualBoost: parseFloat(boostConfig.score) } };
        }
        return u;
      }));

      setIsBoostModalOpen(false);
      setBoostConfig(null);
    } catch (error) {
      console.error('Failed to apply manual boost:', error);
      alert('Failed to apply boost.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      setUpdatingId('modal');
      await apiFetch(`/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          role: selectedUser.role,
          isActive: selectedUser.isActive
        })
      });
      
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user settings.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      setUpdatingId(userToDelete.id);
      await apiFetch(`/admin/users/${userToDelete.id}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to remove user from registry.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0 font-medium">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div className="space-y-1">
           <div className="flex items-center gap-2 text-[#f58220] font-semibold uppercase  text-base mb-1">
              <Sparkles className="w-3 h-3" /> HUB DIRECTORY
           </div>
           <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
             Platform Members
             <div className="p-1.5 bg-[#164e33]/5 text-[#164e33] rounded-xl border border-[#164e33]/10">
                <Users className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-slate-700 font-medium text-base">Monitor and manage all user accounts associated with your hub.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
            {/* Time Filter */}
            <div className="flex p-1 bg-gray-100 rounded-xl overflow-hidden">
                {[
                  { label: 'All', value: 'all' },
                  { label: 'Weekly', value: 'weekly' },
                  { label: 'Monthly', value: 'monthly' },
                  { label: 'Yearly', value: 'yearly' }
                ].map((range) => (
                    <button 
                      key={range.value}
                      onClick={() => setTimeRange(range.value)}
                      className={`px-4 py-2 text-base font-semibold uppercase  transition-all rounded-lg ${timeRange === range.value ? 'bg-white text-[#164e33] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        {range.label}
                    </button>
                ))}
            </div>

           <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Find a member..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-semibold outline-none focus:border-[#164e33] transition-all w-64 shadow-sm"
              />
           </div>
           <button onClick={fetchUsers} className="p-3 bg-white border border-gray-200 rounded-xl text-slate-500 hover:text-[#164e33] hover:bg-[#164e33]/5 transition-all shadow-sm group">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-base font-semibold text-slate-500 uppercase ">Full Name</th>
                    <th className="px-8 py-5 text-base font-semibold text-slate-500 uppercase ">Email Address</th>
                    <th className="px-8 py-5 text-base font-semibold text-slate-500 uppercase  text-center">Assigned Role</th>
                    <th className="px-8 py-5 text-base font-semibold text-slate-500 uppercase  text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                {loading ? (
                    [1,2,3,4,5].map(i => (
                    <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-8 py-8"><div className="h-10 bg-gray-50 rounded-xl"></div></td>
                    </tr>
                    ))
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            {user.avatar && (
                              <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                 <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div>
                                <p className="text-base font-semibold text-slate-900 capitalize leading-none group-hover:text-[#164e33] transition-colors">{user.name || 'Anonymous User'}</p>
                                {user.role === 'VENDOR' && user.vendor?.businessName && (
                                    <p className="text-base font-semibold text-[#f58220] uppercase er mt-2 flex items-center gap-1">
                                    <Building2 className="w-3 h-3" /> {user.vendor.businessName}
                                    </p>
                                )}
                              </div>
                            </div>
                        </td>
                        <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-700 font-semibold text-base italic">
                            <Mail className="w-3.5 h-3.5 text-[#164e33]/60" />
                            <span>{user.email}</span>
                        </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center gap-2">
                            <div className={`px-4 py-1.5 rounded-full text-base font-semibold  uppercase border ${
                                user.role === 'SUPERADMIN' ? 'bg-[#164e33]/5 text-[#164e33] border-[#164e33]/10' :
                                user.role === 'VENDOR' ? 'bg-[#164e33]/5 text-[#164e33] border-[#164e33]/10' :
                                'bg-gray-50 text-slate-700 border-gray-100'
                            }`}>
                            {user.role}
                            </div>
                            {user.isActive ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-red-500" />}
                        </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                             {user.role === 'VENDOR' && user.vendor && (
                                <button 
                                  onClick={() => { setBoostConfig({vendorId: user.vendor.id, score: (user.vendor.manualBoost || 0).toString()}); setIsBoostModalOpen(true); }}
                                  className={`p-2 rounded-xl transition-all ${ (user.vendor.manualBoost || 0) > 0 ? 'text-amber-600 bg-amber-50' : 'text-slate-500 hover:text-amber-500 hover:bg-amber-50' }`}
                                >
                                  <Zap className={`w-4 h-4 ${(user.vendor.manualBoost || 0) > 0 ? 'fill-amber-500' : ''}`} />
                                </button>
                             )}
                             <button 
                               onClick={() => { setSelectedUser({...user}); setIsModalOpen(true); }}
                               className="p-2 text-slate-500 hover:text-[#164e33] hover:bg-[#164e33]/5 rounded-xl transition-all"
                             >
                               <Edit2 className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => { setUserToDelete(user); setIsDeleteModalOpen(true); }}
                               className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                             >
                               {updatingId === user.id ? <RefreshCcw className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4" />}
                             </button>
                          </div>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan={4} className="py-24 text-center">
                        <Users className="w-20 h-20 text-gray-100 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-slate-500 ">Empty Directory</h3>
                        <p className="text-base font-medium text-gray-300 max-w-xs mx-auto mt-2">No members found matching your current filter criteria.</p>
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      <AnimatePresence>
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#164e33]/5 text-[#164e33] rounded-xl border border-[#164e33]/10">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 uppercase ">Administrative Access</h3>
              </div>
              <form onSubmit={handleUpdateUser} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-base font-bold text-black uppercase  ml-1">Member Role</label>
                  <select value={selectedUser.role} onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})} className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-base font-bold focus:bg-white focus:border-[#164e33]/20 outline-none">
                    <option value="VENDOR">Vendor Partnership</option>
                    <option value="BUYER">Procurement Officer (Buyer)</option>
                    <option value="ADMIN">Strategic Administrator</option>
                    <option value="SUPERADMIN">Global Controller</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-base font-bold text-black uppercase  ml-1">Access Authorization</label>
                  <select value={selectedUser.isActive ? 'true' : 'false'} onChange={(e) => setSelectedUser({...selectedUser, isActive: e.target.value === 'true'})} className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-base font-bold focus:bg-white focus:border-[#164e33]/20 outline-none">
                    <option value="true">Grant Platform Access</option>
                    <option value="false">Restrict / Suspend User</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="submit" disabled={updatingId === 'modal'} className="flex-1 py-4 bg-[#164e33] text-white rounded-xl font-bold uppercase  shadow-lg shadow-[#164e33]/20 transition-all active:scale-95 disabled:opacity-50">
                    {updatingId === 'modal' ? 'Applying...' : 'Commit Changes'}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-50 text-slate-700 rounded-xl font-bold uppercase  hover:bg-gray-100">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Boost Modal */}
      <AnimatePresence>
        {isBoostModalOpen && boostConfig && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBoostModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                    <Zap className="w-5 h-5 fill-amber-500" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 uppercase ">Priority Positioning</h3>
               </div>
               <p className="text-base text-slate-600 mb-6 font-semibold">Adjust the manual boost score to prioritize this vendor in search results and category listings.</p>
               <form onSubmit={handleBoost} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-base font-bold text-black uppercase  ml-1">Strategic Boost Score (0-100)</label>
                     <input type="number" step="0.1" value={boostConfig.score} onChange={(e) => setBoostConfig({...boostConfig, score: e.target.value})} className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-base font-bold focus:bg-white focus:border-[#164e33]/20 outline-none" placeholder="e.g. 5.0" />
                  </div>
                  <div className="pt-4 flex gap-3">
                     <button type="submit" disabled={updatingId === 'boost'} className="flex-1 py-4 bg-amber-600 text-white rounded-xl font-bold uppercase  shadow-lg shadow-amber-500/20">
                        {updatingId === 'boost' ? 'Applying...' : 'Apply Position'}
                     </button>
                     <button type="button" onClick={() => setIsBoostModalOpen(false)} className="flex-1 py-4 bg-gray-50 text-slate-700 rounded-xl font-bold uppercase ">Cancel</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {isDeleteModalOpen && userToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
               <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase ">Remove Registry Member?</h3>
               <p className="text-base text-slate-500 font-semibold mb-8">This action will permanently remove <span className="text-slate-900 font-bold">"{userToDelete.name}"</span> from the platform registry. This cannot be undone.</p>
               <div className="flex flex-col gap-3">
                  <button onClick={handleDelete} className="w-full py-4 bg-red-600 text-white rounded-xl font-bold uppercase  shadow-lg shadow-red-500/20">Remove Permanently</button>
                  <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-4 bg-gray-50 text-slate-700 rounded-xl font-bold uppercase ">Keep Member</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


