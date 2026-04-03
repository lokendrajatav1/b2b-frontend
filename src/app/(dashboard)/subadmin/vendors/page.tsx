'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Building2, 
  Search, 
  Filter, 
  ShieldCheck, 
  XCircle, 
  Clock, 
  MapPin, 
  Globe, 
  FileText, 
  CheckCircle2, 
  RefreshCcw, 
  AlertCircle,
  MoreVertical,
  ArrowRight,
  UserCheck,
  ChevronRight,
  ExternalLink,
  Zap,
  CheckCheck,
  Mail,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubAdminVendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/admin/vendors/pending');
      const pendingVendors = (data.data || [])
        .map((vendor: any) => ({
          ...vendor,
          name: vendor.businessName || vendor.user?.name,
          email: vendor.user?.email,
          city: vendor.city || 'India',
          gstNumber: vendor.gstNumber
        }));
      setVendors(pendingVendors);
    } catch (error) {
      console.error('Failed to fetch vendor approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, isApproved: boolean) => {
    setProcessingId(id);
    try {
      if (isApproved) {
        await apiFetch(`/admin/approve-vendor/${id}`, {
          method: 'PATCH'
        });
      } else {
        await apiFetch(`/admin/reject-vendor/${id}`, {
          method: 'DELETE'
        });
      }
      setVendors(vendors.filter(v => v.id !== id));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update vendor status:', error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Humanized Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div className="space-y-1">
           <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">
              <Sparkles className="w-3 h-3" /> Staff Workspace
           </div>
           <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
             New Partner Applications
             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                <Building2 className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-gray-500 font-medium text-sm">Review recently joined businesses and verify their account details.</p>
        </div>

        <div className="flex items-center gap-3">
           <button onClick={fetchVendors} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm group">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
         <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                     <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Business Name</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined On</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Review</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {loading ? (
                     [1,2,3,4,5].map(i => (
                        <tr key={i} className="animate-pulse">
                           <td colSpan={5} className="px-6 py-8"><div className="h-10 bg-gray-50 rounded-xl"></div></td>
                        </tr>
                     ))
                  ) : vendors.length > 0 ? (
                     vendors.map((vendor) => (
                        <tr key={vendor.id} className="group hover:bg-gray-50/50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-500 font-bold overflow-hidden shadow-sm group-hover:border-blue-200 transition-all">
                                    {vendor.logo ? <img src={vendor.logo} className="w-full h-full object-cover" /> : vendor.name?.charAt(0) || 'V'}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900 leading-none capitalize">{vendor.name}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                                      <FileText className="w-3 h-3 text-blue-500" /> GST: {vendor.gstNumber || 'PENDING'}
                                    </span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                                 <MapPin className="w-3.5 h-3.5 text-gray-400" /> {vendor.city}
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-100 transition-all">
                                 <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                                 Awaiting Check
                              </div>
                           </td>
                           <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                              {new Date(vendor.createdAt).toLocaleDateString()}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => { setSelectedVendor(vendor); setIsModalOpen(true); }}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all inline-flex items-center gap-2 text-xs font-semibold"
                              >
                                Review Details
                                <ChevronRight className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={5} className="py-24 text-center">
                           <CheckCheck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                           <p className="text-sm font-semibold text-gray-400">The application list is empty. No new partners to review for now.</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedVendor && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100"
            />
            <motion.div 
               initial={{ x: '100%' }} 
               animate={{ x: 0 }} 
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-110 p-10 overflow-y-auto"
            >
               <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-50">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Review Partner Details</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                     <AlertCircle className="w-5 h-5 text-gray-400" />
                  </button>
               </div>

               <div className="space-y-12">
                  <div className="flex gap-8 items-start">
                     <div className="w-28 h-28 bg-gray-50 rounded-4xl border border-gray-100 overflow-hidden shadow-lg shrink-0 flex items-center justify-center text-2xl font-bold text-gray-400">
                        {selectedVendor.logo ? <img src={selectedVendor.logo} className="w-full h-full object-cover" /> : selectedVendor.name?.charAt(0) || 'V'}
                     </div>
                     <div className="space-y-4 pt-1">
                        <div>
                           <h3 className="text-2xl font-bold text-gray-900 leading-tight capitalize">{selectedVendor.name}</h3>
                           <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                             <Mail className="w-4 h-4 text-blue-400" /> {selectedVendor.email}
                           </p>
                        </div>
                        <div className="flex gap-2">
                           <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 uppercase tracking-widest">{selectedVendor.city}</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 border-b border-gray-50 pb-2">Business Documentation</h4>
                        <div className="space-y-3">
                           <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">GST Identification</p>
                              <div className="flex items-center justify-between">
                                 <span className="text-sm font-semibold text-gray-900">{selectedVendor.gstNumber || 'Not provided'}</span>
                                 <ExternalLink className="w-4 h-4 text-blue-500 cursor-pointer" />
                              </div>
                           </div>
                           <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Business Link</p>
                              <div className="flex items-center justify-between">
                                 <span className="text-sm font-semibold italic text-blue-600 truncate mr-4">{selectedVendor.website || 'No website link'}</span>
                                 <ExternalLink className="w-4 h-4 text-gray-400" />
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 border-b border-gray-50 pb-2">Manage Approval</h4>
                        <div className="flex flex-col gap-3 pt-2">
                           <button 
                             onClick={() => handleStatusUpdate(selectedVendor.id, true)}
                             disabled={processingId === selectedVendor.id}
                             className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-50 transition-all disabled:opacity-50"
                           >
                              <ShieldCheck className="w-5 h-5" />
                              Approve Account
                           </button>
                           <button 
                             onClick={() => handleStatusUpdate(selectedVendor.id, false)}
                             disabled={processingId === selectedVendor.id}
                             className="w-full py-4 bg-white border border-red-100 hover:border-red-200 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                           >
                              <ShieldAlert className="w-5 h-5" />
                              Decline Account
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">About the business</h4>
                      <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                        "{selectedVendor.description || 'No business description provided yet.'}"
                      </p>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
