'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Users, 
  RefreshCcw, 
  Plus, 
  UserCircle,
  Mail,
  ShieldAlert,
  XCircle,
  MoreVertical,
  CheckCircle2,
  Trash2,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminManagement() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'GENERAL',
    permissions: [] as string[]
  });

  const availablePermissions = [
    { id: 'verify_vendors', label: 'Vendor Verification' },
    { id: 'verify_products', label: 'Product Moderation' },
    { id: 'manage_users', label: 'User Management' },
    { id: 'manage_leads', label: 'Lead Handling' },
    { id: 'manage_categories', label: 'Category Settings' }
  ];

  const handlePermissionChange = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId]
    }));
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/subadmins'); // Still using /subadmins route for logic
      setAdmins(res.data || []);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', email: '', password: '', department: 'GENERAL', permissions: [] });
    setError('');
  };

  const handleEdit = (admin: any) => {
    setEditingId(admin.id);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '', 
      department: admin.department,
      permissions: admin.permissions || []
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editingId) {
        await apiFetch(`/subadmins/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            department: formData.department,
            permissions: formData.permissions
          })
        });
      } else {
        await apiFetch('/subadmins', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      handleClose();
      fetchAdmins();
    } catch (err: any) {
      setError(err.message || 'Failed to process request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke access? This cannot be undone easily.')) return;
    try {
      await apiFetch(`/subadmins/${id}`, { method: 'DELETE' });
      fetchAdmins();
    } catch (err) {
      console.error(err);
      alert('Failed to revoke access');
    }
  };

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
             Admin Management
             <div className="p-1.5 bg-[#007367]/10 text-[#007367] rounded-none border border-[#007367]/10">
                <ShieldCheck className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-slate-700 font-medium mt-1 text-base">View and manage administrative access for your platform team.</p>
        </div>

        <div className="flex items-center gap-3">
           <button onClick={fetchAdmins} className="p-2.5 bg-white border border-gray-200 rounded-none text-slate-500 hover:text-[#007367] hover:bg-[#007367]/5 transition-all shadow-sm">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
           </button>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-6 py-2.5 bg-[#007367] text-white rounded-none font-semibold text-base tracking-wide hover:bg-[#005e54] transition-all shadow-md flex items-center gap-2"
           >
              <Plus className="w-4 h-4" /> Create New Admin
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             [1,2,3].map(i => (
                <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-none h-64 shadow-sm"></div>
             ))
          ) : admins.length > 0 ? (
             admins.map(admin => (
                  <div key={admin.id} className="bg-white border border-gray-100 rounded-none p-8 shadow-sm hover:border-[#007367]/20 transition-all group relative flex flex-col h-full">
                     <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                           onClick={() => handleEdit(admin)}
                           className="p-2 text-slate-500 hover:text-[#007367] hover:bg-[#007367]/5 rounded-none transition-all"
                           title="Edit Admin"
                        >
                           <UserCircle className="w-5 h-5" />
                        </button>
                        <button 
                           onClick={() => handleDelete(admin.id)}
                           className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                           title="Revoke Access"
                        >
                           <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                     <div className="flex items-center gap-4 mb-6">
                       <div className="w-14 h-14 bg-[#007367]/10 text-[#007367] rounded-none flex items-center justify-center font-semibold text-xl border border-[#007367]/10">
                          {admin.name.charAt(0)}
                       </div>
                        <div>
                           <h3 className="font-semibold text-slate-900 text-lg">{admin.name}</h3>
                           <div className="flex items-center gap-2 text-base font-semibold  uppercase mt-0.5">
                              <span className="px-2 py-0.5 bg-gray-100 text-slate-700 rounded-md border border-gray-200">{admin.department}</span>
                              {admin.isActive ? (
                                <span className="text-emerald-500 flex items-center gap-1.5 ml-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Authorized
                                </span>
                              ) : (
                                <span className="text-rose-500 flex items-center gap-1.5 ml-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Revoked
                                </span>
                              )}
                           </div>
                        </div>
                     </div>

                    <div className="flex-1 space-y-6">
                       <div className="space-y-3">
                          <p className="text-base font-semibold text-slate-500 uppercase  pl-1">Operational Permissions</p>
                          <div className="flex flex-wrap gap-2">
                             {admin.permissions && admin.permissions.length > 0 ? (
                               admin.permissions.map((p: string) => (
                                 <span key={p} className="px-2.5 py-1 bg-[#007367]/5 text-[#007367] text-base font-semibold rounded-none border border-[#007367]/10 uppercase ">
                                   {p.replace('_', ' ')}
                                 </span>
                               ))
                             ) : (
                               <span className="text-base font-medium text-slate-500 italic">No specific permissions set</span>
                             )}
                          </div>
                       </div>

                       <div className="p-4 bg-gray-50/50 rounded-none border border-gray-100">
                           <div className="flex items-center gap-3 text-base font-medium text-slate-800">
                             <Mail className="w-4 h-4 text-slate-500" />
                             <span className="truncate">{admin.email}</span>
                           </div>
                       </div>
                    </div>
                  </div>
             ))
          ) : (
             <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-200 rounded-none bg-gray-50/50">
                 <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-lg font-semibold text-slate-900">No admins found</h3>
                 <p className="text-base font-medium text-slate-700 mt-1">Create your first administrative user to help manage the platform.</p>
             </div>
          )}
      </div>

       {/* Update Modal */}
       <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white rounded-none shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
             >
               <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Admin Account' : 'Register New Admin'}</h2>
                  <button onClick={handleClose} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-slate-700">
                     <XCircle className="w-5 h-5" />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  {error && (
                     <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-base font-semibold">
                        {error}
                     </div>
                  )}

                  <div className="space-y-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-base font-semibold text-slate-500 uppercase  ml-1">Full Name</label>
                          <input 
                            required
                            disabled={!!editingId}
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-none outline-none focus:bg-white focus:border-[#007367] text-base font-medium transition-all disabled:opacity-50"
                            placeholder="e.g. Rahul Singh"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-base font-semibold text-slate-500 uppercase  ml-1">Email Identity</label>
                          <input 
                            required
                            disabled={!!editingId}
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-none outline-none focus:bg-white focus:border-[#007367] text-base font-medium transition-all disabled:opacity-50"
                            placeholder="admin@company.com"
                          />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {!editingId && (
                          <div className="space-y-1">
                            <label className="text-base font-semibold text-slate-500 uppercase  ml-1">Secret Key</label>
                            <input 
                              required
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-none outline-none focus:bg-white focus:border-[#007367] text-base font-medium transition-all"
                              placeholder="Min. 6 chars"
                            />
                          </div>
                        )}
                        <div className={`space-y-1 ${editingId ? 'sm:col-span-2' : ''}`}>
                          <label className="text-base font-semibold text-slate-500 uppercase  ml-1">Assigned Division</label>
                          <div className="relative">
                            <select 
                              required
                              value={formData.department}
                              onChange={(e) => setFormData({...formData, department: e.target.value})}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-none outline-none focus:bg-white focus:border-[#007367] text-base font-medium transition-all appearance-none cursor-pointer pr-10"
                            >
                               <option value="GENERAL">General Administration</option>
                               <option value="DATA_ENTRY">Operations Control</option>
                               <option value="SALES">Market Demand & Leads</option>
                               <option value="SUPPORT">Customer Success</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                          </div>
                         </div>
                     </div>

                     <div className="space-y-3 pt-2">
                        <h4 className="text-base font-semibold text-slate-500 uppercase  border-b border-gray-50 pb-2">Operational Privileges</h4>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                           {availablePermissions.map(perm => (
                             <label
                                key={perm.id}
                                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.permissions.includes(perm.id) ? 'bg-[#007367]/5 border-[#007367]/20 ring-1 ring-[#007367]/10' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
                             >
                                <input 
                                   type="checkbox"
                                   checked={formData.permissions.includes(perm.id)}
                                   onChange={() => handlePermissionChange(perm.id)}
                                   className="w-4 h-4 rounded-md text-[#007367] border-gray-300 focus:ring-[#007367]"
                                />
                                <span className={`text-base font-semibold ${formData.permissions.includes(perm.id) ? 'text-[#007367]' : 'text-slate-800'}`}>{perm.label}</span>
                             </label>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                     <button 
                       type="button" 
                       onClick={handleClose}
                       className="px-6 py-2.5 text-base font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                     >
                       Dismiss
                     </button>
                     <button 
                       type="submit" 
                       disabled={submitting}
                       className="px-8 py-2.5 bg-[#007367] hover:bg-[#005e54] text-white font-semibold text-base rounded-none shadow-lg shadow-[#007367]/10 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
                     >
                       {submitting ? <RefreshCcw className="w-4 h-4 animate-spin" /> : editingId ? 'Update Admin' : 'Authorize Admin'}
                     </button>
                  </div>
               </form>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


