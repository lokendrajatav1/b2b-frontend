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
,
  UserCheck
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
        <div className="flex items-center gap-5">
           <div className="w-12 h-12 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-center text-indigo-600">
              <UserCheck className="w-6 h-6" />
           </div>
           <div>
           <h1 className="text-xl font-semibold text-slate-900">Admin Management</h1>
           <p className="text-sm text-slate-600 font-normal mt-1">View and manage administrative access for your platform team.</p>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button onClick={fetchAdmins} className="p-2.5 bg-white border border-gray-200 rounded-xl text-slate-700 hover:text-[#164e33] hover:bg-[#164e33]/5 transition-all ">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
           </button>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-6 py-2.5 bg-[#164e33] text-white rounded-xl font-semibold text-sm  hover:bg-[#113f29] transition-all  flex items-center gap-2"
           >
              <Plus className="w-4 h-4" /> Create New Admin
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             [1,2,3].map(i => (
                <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-xl h-80 shadow-sm"></div>
             ))
          ) : admins.length > 0 ? (
             admins.map(admin => (
                  <motion.div 
                    layout
                    key={admin.id} 
                    className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all group relative flex flex-col h-full"
                  >
                     <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                        <button 
                           onClick={() => handleEdit(admin)}
                           className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                           title="Edit Admin"
                        >
                           <UserCircle className="w-4.5 h-4.5" />
                        </button>
                        <button 
                           onClick={() => handleDelete(admin.id)}
                           className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                           title="Revoke Access"
                        >
                           <Trash2 className="w-4.5 h-4.5" />
                        </button>
                     </div>

                     <div className="flex items-center gap-4 mb-6">
                        <div className="relative shrink-0">
                           <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center shadow-sm">
                              {admin.user?.avatar ? (
                                 <img src={admin.user.avatar} alt={admin.name} className="w-full h-full object-cover" />
                              ) : (
                                 <div className="text-xl font-bold text-slate-600 uppercase">
                                    {admin.name.charAt(0)}
                                 </div>
                              )}
                           </div>
                           <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${admin.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        </div>

                        <div>
                           <h3 className="font-bold text-slate-900 text-base leading-tight">{admin.name}</h3>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded border border-slate-200">
                                 {admin.department}
                              </span>
                              <span className={`text-[10px] font-bold uppercase ${admin.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                 {admin.isActive ? 'Active' : 'Inactive'}
                              </span>
                           </div>
                        </div>
                     </div>

                    <div className="flex-1 flex flex-col justify-between gap-6">
                       <div className="space-y-3">
                          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-1">Permissions</p>
                          <div className="flex flex-wrap gap-1.5">
                             {admin.permissions && admin.permissions.length > 0 ? (
                                admin.permissions.map((p: string) => (
                                  <span key={p} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100 uppercase transition-colors group-hover:bg-slate-100 group-hover:text-slate-900">
                                    {p.replace(/_/g, ' ')}
                                  </span>
                                ))
                             ) : (
                                <span className="text-[10px] font-medium text-slate-600 italic px-1">Basic Access</span>
                             )}
                          </div>
                       </div>

                       <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 flex items-center gap-3 mt-2">
                           <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 border border-slate-50">
                              <Mail className="w-3.5 h-3.5" />
                           </div>
                           <span className="text-[11px] font-bold text-slate-600 break-all leading-tight">{admin.email}</span>
                       </div>
                    </div>
                  </motion.div>
             ))
          ) : (
             <div className="col-span-full py-24 text-center border-4 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                 <Users className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                 <h3 className="text-xl font-bold text-slate-900">Platform Team Empty</h3>
                 <p className="text-slate-600 font-medium mt-2 max-w-sm mx-auto">Authorize your first administrative account to begin distributed platform management.</p>
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
               className="bg-white rounded-xl  w-full max-w-lg overflow-hidden border border-gray-100"
             >
               <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-base font-semibold text-slate-900">{editingId ? 'Edit Admin Account' : 'Register New Admin'}</h2>
                  <button onClick={handleClose} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-slate-700">
                     <XCircle className="w-5 h-5" />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  {error && (
                     <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-semibold">
                        {error}
                     </div>
                  )}

                  <div className="space-y-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700 uppercase  ml-1">Full Name</label>
                          <input 
                            required
                            disabled={!!editingId}
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-[#164e33] text-sm font-medium transition-all disabled:opacity-50"
                            placeholder="e.g. Rahul Singh"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700 uppercase  ml-1">Email Identity</label>
                          <input 
                            required
                            disabled={!!editingId}
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-[#164e33] text-sm font-medium transition-all disabled:opacity-50"
                            placeholder="admin@company.com"
                          />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {!editingId && (
                          <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 uppercase  ml-1">Secret Key</label>
                            <input 
                              required
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-[#164e33] text-sm font-medium transition-all"
                              placeholder="Min. 6 chars"
                            />
                          </div>
                        )}
                        <div className={`space-y-1 ${editingId ? 'sm:col-span-2' : ''}`}>
                          <label className="text-sm font-semibold text-slate-700 uppercase  ml-1">Assigned Division</label>
                          <div className="relative">
                            <select 
                              required
                              value={formData.department}
                              onChange={(e) => setFormData({...formData, department: e.target.value})}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-[#164e33] text-sm font-medium transition-all appearance-none cursor-pointer pr-10"
                            >
                               <option value="GENERAL">General Administration</option>
                               <option value="DATA_ENTRY">Operations Control</option>
                               <option value="SALES">Market Demand & Leads</option>
                               <option value="SUPPORT">Customer Success</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 pointer-events-none" />
                          </div>
                         </div>
                     </div>

                     <div className="space-y-3 pt-2">
                        <h4 className="text-sm font-semibold text-slate-700 uppercase  border-b border-gray-50 pb-2">Operational Privileges</h4>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                           {availablePermissions.map(perm => (
                             <label
                                key={perm.id}
                                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.permissions.includes(perm.id) ? 'bg-[#164e33]/5 border-[#164e33]/20 ring-1 ring-[#164e33]/10' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
                             >
                                <input 
                                   type="checkbox"
                                   checked={formData.permissions.includes(perm.id)}
                                   onChange={() => handlePermissionChange(perm.id)}
                                   className="w-4 h-4 rounded-md text-[#164e33] border-gray-300 focus:ring-[#164e33]"
                                />
                                <span className={`text-sm font-semibold ${formData.permissions.includes(perm.id) ? 'text-[#164e33]' : 'text-slate-800'}`}>{perm.label}</span>
                             </label>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                     <button 
                       type="button" 
                       onClick={handleClose}
                       className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                     >
                       Dismiss
                     </button>
                     <button 
                       type="submit" 
                       disabled={submitting}
                       className="px-8 py-2.5 bg-[#164e33] hover:bg-[#113f29] text-white font-semibold text-sm rounded-xl  -[#164e33]/10 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
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
