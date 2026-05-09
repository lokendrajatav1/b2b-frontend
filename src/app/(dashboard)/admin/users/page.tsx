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
  XCircle,
  Clock,
  Edit2,
  RefreshCcw,
  Zap,
  Phone,
  Trophy,
  Sparkles,
  TrendingUp,
  Target,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  CheckCheck,
  Eye,
  EyeOff,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [boostConfig, setBoostConfig] = useState<{vendorId: string, score: string} | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, page, limit]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter !== 'ALL') params.append('role', roleFilter);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const data = await apiFetch(`/admin/users?${params.toString()}`);
      // Filter out Super Admins from the list for standard Admin view
      const allUsers = data.data?.users || [];
      const visibleUsers = allUsers.filter((u: any) => u.role !== 'SUPERADMIN');
      
      setUsers(visibleUsers);
      setTotal(data.data?.total || 0);
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
          isActive: selectedUser.isActive,
          password: selectedUser.password || undefined
        })
      });
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: selectedUser.role, isActive: selectedUser.isActive } : u));
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setUpdatingId(userToDelete.id);
      await apiFetch(`/admin/users/${userToDelete.id}`, {
        method: 'DELETE'
      });
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete member account.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users; // Already filtered in fetchUsers

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-8 min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div className="flex items-center gap-5">
           <div className="w-12 h-12 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Users className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-xl font-semibold text-slate-900">Hub Platform Members</h1>
              <p className="text-sm text-slate-600 font-normal mt-1">Review activity, manage permissions, and oversee hub registrations.</p>
           </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
         {[
           { label: 'Total Members', value: users.length, sub: 'All registered users', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Vendors', value: users.filter(u => u.role === 'VENDOR').length, sub: 'Vendor accounts', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, sub: 'Administrative users', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Joined This Month', value: users.filter(u => new Date(u.createdAt).getMonth() === new Date().getMonth()).length, sub: 'New registrations', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                 <stat.icon size={22} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-0.5">{stat.label}</p>
                 <h4 className="text-xl font-semibold text-slate-900">{stat.value}</h4>
                 <p className="text-[10px] font-medium text-slate-600 mt-0.5">{stat.sub}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="max-w-7xl mx-auto space-y-4">
        {/* Filter Header */}
        <div className="flex flex-col md:flex-row items-center gap-4">
           <div className="relative shrink-0">
              <select 
                 value={roleFilter}
                 onChange={(e) => setRoleFilter(e.target.value)}
                 className="pl-10 pr-10 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-slate-700 outline-none hover:bg-gray-50 transition-all shadow-sm appearance-none cursor-pointer min-w-[160px]"
              >
                 <option value="ALL">All Roles</option>
                 <option value="ADMIN">Admin</option>
                 <option value="VENDOR">Vendor</option>
                 <option value="BUYER">Standard User</option>
              </select>
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
           </div>

           <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input 
                type="text" 
                placeholder="Search members by name or email..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm"
              />
           </div>
           
           <button onClick={fetchUsers} className="p-3 bg-white border border-gray-100 rounded-xl text-slate-600 hover:text-slate-900 shadow-sm transition-all shrink-0">
              <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>

        {/* Members Table */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="overflow-x-auto overflow-y-auto w-full max-h-[calc(70vh-50px)] relative">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 z-20 bg-white">
                <tr className="bg-white border-b border-gray-100 shadow-sm">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight whitespace-nowrap">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight whitespace-nowrap">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight whitespace-nowrap">Phone</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight whitespace-nowrap">Access Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight whitespace-nowrap">Joined On</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-8"><div className="h-10 bg-gray-50/50 rounded-xl"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 border-2 border-white shadow-sm flex items-center justify-center shrink-0 font-semibold text-sm overflow-hidden relative group/avatar">
                              {(user.avatar || user.profileImage || user.vendor?.logoUrl) ? (
                                <img 
                                  src={user.avatar || user.profileImage || user.vendor?.logoUrl} 
                                  className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110" 
                                  alt="" 
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).parentElement!.classList.add('bg-orange-50', 'text-orange-600');
                                  }}
                                />
                              ) : (
                                <span className="uppercase">{user.name?.charAt(0) || 'U'}</span>
                              )}
                           </div>
                           <div>
                              <p className="text-[13px] font-semibold text-slate-900 capitalize leading-tight">
                                 {user.name && isNaN(Number(user.name)) ? user.name : 'Guest User'}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></span>
                                <span className={`text-[10px] font-semibold uppercase tracking-tighter ${user.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                   {user.isActive ? 'Access Active' : 'Restricted'}
                                </span>
                              </div>
                           </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[12px] font-semibold">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[12px] font-semibold">{user.phone || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase border ${
                           user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                           user.role === 'VENDOR' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                           'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                           {user.role}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="text-[12px] font-semibold text-slate-700">
                          {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                       </div>
                       <div className="text-[10px] font-semibold text-slate-600 uppercase mt-0.5 tracking-tighter">
                          {new Date(user.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase border shadow-sm transition-all ${
                          user.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                       }`}>
                          <span className={`w-1 h-1 rounded-full animate-pulse ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {user.isActive ? 'Active' : 'Banned'}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-1">
                          {user.role === 'VENDOR' && user.vendor && (
                            <button onClick={() => { setBoostConfig({vendorId: user.vendor.id, score: (user.vendor.manualBoost || 0).toString()}); setIsBoostModalOpen(true); }} className={`p-2 rounded-lg transition-all ${ (user.vendor.manualBoost || 0) > 0 ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50' }`}>
                              <Zap size={14} className={(user.vendor.manualBoost || 0) > 0 ? 'fill-amber-500' : ''} />
                            </button>
                          )}
                          <button onClick={() => { setSelectedUser({...user}); setIsModalOpen(true); }} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => { setUserToDelete(user); setIsDeleteModalOpen(true); }} className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                            <Trash2 size={14} />
                          </button>
                          <button className="p-2 text-slate-600 hover:text-slate-900 rounded-lg transition-all">
                             <MoreVertical size={14} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                       <Users className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Workspace Isolated</p>
                    <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-widest">No members match criteria</p>
                  </td>
                </tr>
              )}
               </tbody>
             </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-8 py-6 bg-slate-50/30 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
             <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">
                Showing <span className="text-slate-900 font-bold">{Math.min(((page - 1) * limit) + 1, total)}</span> to <span className="text-slate-900 font-bold">{Math.min(page * limit, total)}</span> of <span className="text-slate-900 font-bold">{total}</span> members
             </p>

             <div className="flex items-center gap-6">
                <select
                   value={limit}
                   onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
                   className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-700 outline-none hover:border-slate-300 transition-all cursor-pointer uppercase appearance-none pr-8"
                   style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23475569\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                >
                   <option value={10}>10 members</option>
                   <option value={25}>25 members</option>
                   <option value={50}>50 members</option>
                </select>

                <div className="flex items-center gap-2">
                   <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                   >
                      <ChevronLeft size={18} />
                   </button>
                   
                   <div className="flex items-center gap-1">
                      {[...Array(Math.ceil(total / limit))].slice(0, 5).map((_, i) => (
                         <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`w-9 h-9 rounded-xl text-[11px] font-bold transition-all ${page === i + 1 ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
                         >
                            {i + 1}
                         </button>
                      ))}
                   </div>

                   <button
                      onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))}
                      disabled={page >= Math.ceil(total / limit)}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                   >
                      <ChevronRight size={18} />
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>

      <AnimatePresence>
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white rounded-xl w-full max-md overflow-hidden border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-700" />
                  Edit Membership Access
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-700 hover:text-slate-800 p-1 rounded-lg hover:bg-gray-200 transition-colors">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateUser} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 uppercase mb-1.5">Member Name</label>
                  <input type="text" disabled value={(selectedUser.name && !selectedUser.name.includes('_') ? selectedUser.name : selectedUser.phone) || 'Anonymous User'} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 uppercase mb-1.5">Platform Role</label>
                  <select value={selectedUser.role} onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all uppercase ">
                    <option value="BUYER">Buyer (Standard User)</option>
                    <option value="VENDOR">Vendor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 uppercase mb-1.5">Set Password</label>
                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={selectedUser.password || ''}
                      onChange={(e) => setSelectedUser({...selectedUser, password: e.target.value})}
                      placeholder="Type new password for member..."
                      autoComplete="new-password"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${showPassword ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-600'}`}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Account Access</h4>
                    <p className="text-sm font-medium text-slate-700 mt-0.5">Allow login and platform usage</p>
                  </div>
                  <button type="button" onClick={() => setSelectedUser({...selectedUser, isActive: !selectedUser.isActive})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${selectedUser.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${selectedUser.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-800 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={updatingId === 'modal'} className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {updatingId === 'modal' ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBoostModalOpen && boostConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsBoostModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }} className="relative bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-white/50">
              <div className={`px-8 py-7 relative overflow-hidden transition-colors duration-500 ${parseFloat(boostConfig.score) <= 0 ? 'bg-gray-100 text-slate-900' : parseFloat(boostConfig.score) < 10 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' : parseFloat(boostConfig.score) < 25 ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white' : 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white'}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
                      {parseFloat(boostConfig.score) >= 25 ? <Sparkles className="w-6 h-6" /> : parseFloat(boostConfig.score) >= 10 ? <Trophy className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold ">Boost Visibility</h3>
                      <p className="text-white/70 text-sm font-semibold uppercase mt-0.5">Admin Influence Matrix</p>
                    </div>
                  </div>
                  <button onClick={() => setIsBoostModalOpen(false)} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleBoost} className="p-8 space-y-8">
                <div className="relative group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-slate-700 uppercase ">Multiplier Intensity</span>
                    <span className={`px-2.5 py-1 rounded-full text-sm font-semibold uppercase transition-colors ${parseFloat(boostConfig.score) <= 0 ? 'bg-gray-100 text-slate-700' : parseFloat(boostConfig.score) < 10 ? 'bg-amber-100 text-amber-600' : parseFloat(boostConfig.score) < 25 ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                      {parseFloat(boostConfig.score) <= 0 ? 'Normal Level' : parseFloat(boostConfig.score) < 10 ? 'Active Boost' : parseFloat(boostConfig.score) < 25 ? 'Priority Access' : 'Absolute Dominance'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input type="range" min="0" max="50" step="0.5" value={boostConfig.score} onChange={(e) => setBoostConfig({...boostConfig, score: e.target.value})} className="flex-1 accent-amber-500 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer" />
                    <div className="relative min-w-[100px]">
                      <input type="number" step="0.1" min="0.0" max="100.0" value={boostConfig.score} onChange={(e) => setBoostConfig({...boostConfig, score: e.target.value})} className={`w-full bg-gray-50 border-2 rounded-xl px-4 py-4 text-3xl font-semibold transition-all text-center focus:ring-4 focus:ring-amber-500/10 ${parseFloat(boostConfig.score) <= 0 ? 'border-gray-100 text-slate-700 focus:border-gray-300' : parseFloat(boostConfig.score) < 10 ? 'border-amber-100 text-amber-600 focus:border-amber-400' : parseFloat(boostConfig.score) < 25 ? 'border-orange-100 text-orange-600 focus:border-orange-400' : 'border-purple-100 text-purple-600 focus:border-purple-400'}`} />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className={`w-4 h-4 ${parseFloat(boostConfig.score) > 0 ? 'text-amber-500' : 'text-slate-700'}`} />
                    <span className="text-sm font-semibold text-slate-900">Experience Impact Preview</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 font-medium">
                    {parseFloat(boostConfig.score) <= 0 ? "No manual preference applied. The vendor will appear based on organic performance metrics only." : `Boosting by ${boostConfig.score}x will place this vendor above ${parseFloat(boostConfig.score) > 10 ? 'major competitors' : 'similarly ranked vendors'} in search queries.`}
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-3">
                  <button type="submit" disabled={updatingId === 'boost'} className={`w-full py-4 text-sm font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${parseFloat(boostConfig.score) <= 0 ? 'bg-gray-900 text-white ' : parseFloat(boostConfig.score) < 10 ? 'bg-amber-500 text-white hover:bg-amber-600' : parseFloat(boostConfig.score) < 25 ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                    {updatingId === 'boost' ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5" />Apply Intensity Level</>}
                  </button>
                  <button type="button" onClick={() => setIsBoostModalOpen(false)} className="w-full py-3 text-sm font-semibold text-slate-700 hover:text-slate-800 transition-colors">Dismiss Editor</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => !updatingId && setIsDeleteModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-xl w-full max-w-sm overflow-hidden border border-gray-100 shadow-2xl">
               <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-6 border border-red-100">
                    <Trash2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Confirm Removal</h3>
                  <p className="text-sm text-gray-600 font-normal mt-1 leading-relaxed mb-8">
                    Are you sure you want to delete <span className="text-slate-900 font-semibold">{userToDelete.name || userToDelete.email}</span>? This will permanently remove their profile and all associated data.
                  </p>
                  <div className="flex flex-col gap-3">
                    <button onClick={handleDeleteUser} disabled={updatingId === userToDelete.id} className="w-full py-4 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {updatingId === userToDelete.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : null}
                      Yes, Remove Member
                    </button>
                    <button onClick={() => setIsDeleteModalOpen(false)} disabled={updatingId === userToDelete.id} className="w-full py-4 text-sm font-semibold text-slate-700 hover:text-slate-800 hover:bg-gray-50 rounded-xl transition-all">Keep Account</button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
