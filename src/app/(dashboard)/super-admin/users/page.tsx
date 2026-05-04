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
  Phone,
  Trophy,
  Sparkles,
  TrendingUp,
  Target
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/admin/users');
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

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
             Platform Members
             <div className="p-1.5 bg-[#164e33]/5 text-[#164e33] rounded-xl border border-[#164e33]/10">
                <Users className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-slate-700 font-medium mt-1 text-base">Review activity, manage permissions, and assign administrative roles.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-3 py-2 flex items-center justify-center bg-gray-50 border-r border-gray-200">
                 <Filter className="w-4 h-4 text-slate-700" />
              </div>
              <select 
                 value={roleFilter}
                 onChange={(e) => setRoleFilter(e.target.value)}
                 className="px-3 py-2 text-base font-medium text-slate-800 bg-transparent outline-none cursor-pointer hover:bg-gray-50 transition-colors w-32"
              >
                 <option value="ALL">All Roles</option>
                 <option value="SUPERADMIN">Super Admin</option>
                 <option value="ADMIN">Admin</option>
                 <option value="VENDOR">Vendor</option>
                 <option value="BUYER">Buyer (Standard User)</option>
              </select>
           </div>
           
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-base font-medium outline-none focus:border-blue-500 transition-all w-64 shadow-sm"
              />
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-[calc(100vh-240px)] flex flex-col">
          <div className="overflow-y-auto overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse relative min-w-[800px]">
              <thead className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md">
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase ">Profile</th>
                  <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase ">Email</th>
                  <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase ">Phone</th>
                  <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase ">Access Role</th>
                  <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase ">Joined On</th>
                  <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase  text-right">Actions</th>
                </tr>
              </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8"><div className="h-10 bg-gray-50 rounded-xl"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar && (
                            <div className="w-8 h-8 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                               <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <p className="text-base font-semibold text-slate-900 capitalize leading-none">
                               {user.name && isNaN(Number(user.name)) ? user.name : 'Guest Member'}
                            </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`}></span>
                            <span className="text-base font-semibold text-slate-500 uppercase  leading-none">
                               {user.isActive ? 'Access Active' : 'Restricted'}
                            </span>
                          </div>
                          </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="text-base font-medium">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-base font-medium">{user.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-4">
                         <div className={`px-2.5 py-1 rounded-lg text-base font-semibold  uppercase border ${
                            user.role === 'SUPERADMIN' ? 'bg-[#164e33]/5 text-indigo-700 border-[#164e33]/10' : 
                            user.role === 'VENDOR' ? 'bg-[#164e33]/5 text-slate-800 border-[#164e33]/10' : 
                            user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                            'bg-gray-50 text-slate-700 border-gray-100'
                         }`}>
                           {user.role}
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-base font-semibold text-slate-700">{new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity duration-300">
                         {user.role === 'VENDOR' && user.vendor && (
                            <button 
                              onClick={() => { setBoostConfig({vendorId: user.vendor.id, score: (user.vendor.manualBoost || 0).toString()}); setIsBoostModalOpen(true); }}
                              className={`relative p-2 rounded-xl transition-all group/zap ${
                                (user.vendor.manualBoost || 0) > 0 
                                ? 'text-amber-600 bg-amber-50 ring-1 ring-amber-200 shadow-sm' 
                                : 'text-slate-500 hover:text-amber-500 hover:bg-amber-50'
                              }`}
                            >
                              <Zap className={`w-4 h-4 ${(user.vendor.manualBoost || 0) > 0 ? 'fill-amber-500' : ''}`} />
                              {(user.vendor.manualBoost || 0) > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-600 text-base font-semibold text-white ring-2 ring-white">
                                  {user.vendor.manualBoost}
                                </span>
                              )}
                            </button>
                         )}
                         <button 
                           onClick={() => { setSelectedUser({...user}); setIsModalOpen(true); }}
                           title="Edit Access"
                           className="p-2 text-slate-500 hover:text-[#164e33] hover:bg-[#164e33]/5 rounded-xl transition-all duration-300"
                         >
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => { setUserToDelete(user); setIsDeleteModalOpen(true); }}
                           title="Delete Profile"
                           className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                         >
                           {updatingId === user.id ? <RefreshCcw className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4" />}
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Users className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                    <p className="text-base font-semibold text-slate-500 uppercase ">Workspace Isolated</p>
                    <p className="text-base font-medium text-slate-500 mt-1">No members match the current search filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-500" />
                  Edit Access Profile
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800 p-1 rounded-lg hover:bg-gray-200 transition-colors">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="p-6 space-y-5">
                <div>
                  <label className="block text-base font-semibold text-slate-500 uppercase  mb-1.5">Member Name</label>
                  <input type="text" disabled value={(selectedUser.name && !selectedUser.name.includes('_') ? selectedUser.name : selectedUser.phone) || 'Anonymous User'} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-base font-semibold text-slate-700 cursor-not-allowed" />
                </div>
                
                <div>
                  <label className="block text-base font-semibold text-slate-500 uppercase  mb-1.5">Platform Role</label>
                  <select 
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-base font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all uppercase "
                  >
                    <option value="BUYER">Buyer (Standard User)</option>
                    <option value="VENDOR">Vendor</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPERADMIN">Super Admin</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">Account Access</h4>
                    <p className="text-base font-medium text-slate-700 mt-0.5">Allow login and platform usage</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSelectedUser({...selectedUser, isActive: !selectedUser.isActive})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${selectedUser.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${selectedUser.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-base font-semibold text-slate-700 hover:text-slate-800 hover:bg-gray-100 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={updatingId === 'modal'} className="px-5 py-2.5 bg-[#164e33] text-white text-base font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-[#113f29] hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
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
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setIsBoostModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-md overflow-hidden border border-white/50"
            >
              <div className={`px-8 py-7 relative overflow-hidden transition-colors duration-500 ${
                parseFloat(boostConfig.score) <= 0 ? 'bg-gray-100 text-slate-900' : 
                parseFloat(boostConfig.score) < 10 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' :
                parseFloat(boostConfig.score) < 25 ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white' :
                'bg-gradient-to-br from-purple-600 to-indigo-700 text-white'
              }`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
                      {parseFloat(boostConfig.score) >= 25 ? <Sparkles className="w-6 h-6" /> : 
                       parseFloat(boostConfig.score) >= 10 ? <Trophy className="w-6 h-6" /> : 
                       <TrendingUp className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold ">Boost Visibility</h3>
                      <p className="text-white/70 text-base font-semibold uppercase  mt-0.5">Admin Influence Matrix</p>
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
                    <span className="text-base font-semibold text-slate-500 uppercase ">Multiplier Intensity</span>
                    <span className={`px-2.5 py-1 rounded-full text-base font-semibold uppercase  transition-colors ${
                      parseFloat(boostConfig.score) <= 0 ? 'bg-gray-100 text-slate-700' : 
                      parseFloat(boostConfig.score) < 10 ? 'bg-amber-100 text-amber-600' :
                      parseFloat(boostConfig.score) < 25 ? 'bg-orange-100 text-orange-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {parseFloat(boostConfig.score) <= 0 ? 'Normal Level' : 
                       parseFloat(boostConfig.score) < 10 ? 'Active Boost' :
                       parseFloat(boostConfig.score) < 25 ? 'Priority Access' : 'Absolute Dominance'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input type="range" min="0" max="50" step="0.5" value={boostConfig.score} onChange={(e) => setBoostConfig({...boostConfig, score: e.target.value})} className="flex-1 accent-amber-500 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer" />
                    <div className="relative min-w-[100px]">
                      <input type="number" step="0.1" min="0.0" max="100.0" value={boostConfig.score} onChange={(e) => setBoostConfig({...boostConfig, score: e.target.value})} className={`w-full bg-gray-50 border-2 rounded-2xl px-4 py-4 text-3xl font-semibold transition-all text-center focus:ring-4 focus:ring-amber-500/10 ${parseFloat(boostConfig.score) <= 0 ? 'border-gray-100 text-slate-500 focus:border-gray-300' : parseFloat(boostConfig.score) < 10 ? 'border-amber-100 text-amber-600 focus:border-amber-400' : parseFloat(boostConfig.score) < 25 ? 'border-orange-100 text-orange-600 focus:border-orange-400' : 'border-purple-100 text-purple-600 focus:border-purple-400'}`} />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className={`w-4 h-4 ${parseFloat(boostConfig.score) > 0 ? 'text-amber-500' : 'text-slate-500'}`} />
                    <span className="text-base font-semibold text-slate-900">Experience Impact Preview</span>
                  </div>
                  <p className="text-base leading-relaxed text-slate-700 font-medium">
                    {parseFloat(boostConfig.score) <= 0 ? "No manual preference applied. The vendor will appear based on organic performance metrics only." : `Boosting by ${boostConfig.score}x will place this vendor above ${parseFloat(boostConfig.score) > 10 ? 'major competitors' : 'similarly ranked vendors'} in search queries.`}
                  </p>
                </div>
                
                <div className="pt-2 flex flex-col gap-3">
                  <button type="submit" disabled={updatingId === 'boost'} className={`w-full py-4 text-base font-semibold rounded-2xl shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${parseFloat(boostConfig.score) <= 0 ? 'bg-gray-900 text-white shadow-gray-200' : parseFloat(boostConfig.score) < 10 ? 'bg-amber-500 text-white shadow-amber-500/20 hover:bg-amber-600' : parseFloat(boostConfig.score) < 25 ? 'bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-600' : 'bg-purple-600 text-white shadow-purple-600/20 hover:bg-purple-700'}`}>
                    {updatingId === 'boost' ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5" />Apply Intensity Level</>}
                  </button>
                  <button type="button" onClick={() => setIsBoostModalOpen(false)} className="w-full py-3 text-base font-semibold text-slate-500 hover:text-slate-800 transition-colors">Dismiss Editor</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
              onClick={() => !updatingId && setIsDeleteModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100"
            >
               <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
                    <Trash2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Confirm Removal</h3>
                  <p className="text-slate-700 font-medium text-base leading-relaxed mb-8">
                    Are you sure you want to delete <span className="text-slate-900 font-semibold">{userToDelete.name || userToDelete.email}</span>? 
                    This will permanently remove their profile and all associated data.
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleDeleteUser}
                      disabled={updatingId === userToDelete.id}
                      className="w-full py-4 bg-red-600 text-white text-base font-semibold rounded-2xl shadow-xl shadow-red-500/20 hover:bg-red-700 hover:shadow-red-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {updatingId === userToDelete.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : null}
                      Yes, Remove Member
                    </button>
                    <button 
                      onClick={() => setIsDeleteModalOpen(false)}
                      disabled={updatingId === userToDelete.id}
                      className="w-full py-4 text-base font-semibold text-slate-700 hover:text-slate-800 hover:bg-gray-50 rounded-2xl transition-all"
                    >
                      Keep Account
                    </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}



