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
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSubAdmins() {
  const [subadmins, setSubadmins] = useState<any[]>([]);
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

  const fetchSubadmins = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/subadmins');
      setSubadmins(res.data || []);
    } catch (err) {
      console.error('Failed to fetch subadmins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubadmins();
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
      password: '', // Password not editable this way for security
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
      fetchSubadmins();
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
      fetchSubadmins();
    } catch (err) {
      console.error(err);
      alert('Failed to revoke access');
    }
  };

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-3">
             Team Members
             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                <ShieldAlert className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-gray-500 font-medium mt-1 text-sm">View and manage account access for your team.</p>
        </div>

        <div className="flex items-center gap-3">
           <button onClick={fetchSubadmins} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
           </button>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
           >
              <Plus className="w-4 h-4" /> Invite Team Member
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             [1,2,3].map(i => (
                <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-3xl h-64"></div>
             ))
          ) : subadmins.length > 0 ? (
             subadmins.map(admin => (
                  <div key={admin.id} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:border-blue-100 transition-all group relative flex flex-col h-full">
                     <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                           onClick={() => handleEdit(admin)}
                           className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                           title="Edit Account"
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
                       <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl border border-blue-100">
                          {admin.name.charAt(0)}
                       </div>
                        <div>
                           <h3 className="font-bold text-gray-900 text-lg">{admin.name}</h3>
                           <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase mt-0.5">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md border border-gray-200">{admin.department}</span>
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
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Active Permissions</p>
                          <div className="flex flex-wrap gap-2">
                             {admin.permissions && admin.permissions.length > 0 ? (
                               admin.permissions.map((p: string) => (
                                 <span key={p} className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100 uppercase tracking-wider">
                                   {p.replace('_', ' ')}
                                 </span>
                               ))
                             ) : (
                               <span className="text-xs font-medium text-gray-400 italic">No specific permissions set</span>
                             )}
                          </div>
                       </div>

                       <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                           <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                             <Mail className="w-4 h-4 text-gray-400" />
                             <span className="truncate">{admin.email}</span>
                           </div>
                       </div>
                    </div>
                 </div>
             ))
          ) : (
             <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-200 rounded-[3rem] bg-gray-50/50">
                 <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-lg font-bold text-gray-900">The team list is empty</h3>
                 <p className="text-sm font-medium text-gray-500 mt-1">Invite your first team member to start managing the platform together.</p>
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
               className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100"
             >
               <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Account' : 'Invite Staff'}</h2>
                  <button onClick={handleClose} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500">
                     <XCircle className="w-5 h-5" />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {error && (
                     <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold">
                        {error}
                     </div>
                  )}

                  <div className="space-y-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700 ml-0.5">Full Name</label>
                          <input 
                            required
                            disabled={!!editingId}
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="e.g. John Doe"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700 ml-0.5">Email Address</label>
                          <input 
                            required
                            disabled={!!editingId}
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="staff@company.com"
                          />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {!editingId && (
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 ml-0.5">Password</label>
                            <input 
                              required
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                              placeholder="Min. 6 characters"
                            />
                          </div>
                        )}
                        <div className={`space-y-1 ${editingId ? 'sm:col-span-2' : ''}`}>
                          <label className="text-xs font-bold text-gray-700 ml-0.5">Assigned Module</label>
                          <div className="relative">
                            <select 
                              required
                              value={formData.department}
                              onChange={(e) => setFormData({...formData, department: e.target.value})}
                              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all appearance-none cursor-pointer pr-10"
                            >
                               <option value="GENERAL">General Access</option>
                               <option value="DATA_ENTRY">Operations</option>
                               <option value="SALES">Business Development & Leads</option>
                               <option value="SUPPORT">Customer Support</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                         </div>
                     </div>

                     <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">Module Permissions</h4>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                           {availablePermissions.map(perm => (
                             <label
                               key={perm.id}
                               className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.permissions.includes(perm.id) ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-100' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                             >
                                <input 
                                   type="checkbox"
                                   checked={formData.permissions.includes(perm.id)}
                                   onChange={() => handlePermissionChange(perm.id)}
                                   className="w-4 h-4 rounded-md text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-offset-0"
                                />
                                <span className={`text-[13px] font-medium ${formData.permissions.includes(perm.id) ? 'text-blue-700' : 'text-gray-600'}`}>{perm.label}</span>
                             </label>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                     <button 
                       type="button" 
                       onClick={handleClose}
                       className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 rounded-xl"
                     >
                       Cancel
                     </button>
                     <button 
                       type="submit" 
                       disabled={submitting}
                       className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-50 active:scale-95"
                     >
                       {submitting ? 'Please wait...' : editingId ? 'Update Role' : 'Invite Staff'}
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
