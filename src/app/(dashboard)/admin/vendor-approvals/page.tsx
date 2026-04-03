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
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VendorApprovals() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [cities, setCities] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'VERIFIED' | 'ALL'>('PENDING');

  useEffect(() => {
    fetchVendors();
  }, [searchQuery, selectedCity, activeTab]);

  useEffect(() => {
    const header = document.getElementById('main-dashboard-header');
    if (header) {
      if (isModalOpen) {
        header.style.opacity = '0';
        header.style.pointerEvents = 'none';
      } else {
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
      }
    }
  }, [isModalOpen]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCity !== 'All Cities') params.append('city', selectedCity);
      params.append('status', activeTab);

      const data = await apiFetch(`/admin/vendors/pending?${params.toString()}`);
      
      const pendingVendors = (data.data || [])
        .map((vendor: any) => ({
          ...vendor,
          name: vendor.businessName || vendor.user?.name,
          email: vendor.user?.email,
          city: vendor.city || 'India',
          gstNumber: vendor.gstNumber
        }));
      setVendors(pendingVendors);

      // Extract unique cities from vendors if not already set or fetch all
      if (cities.length === 0) {
        try {
          const stats = await apiFetch('/admin/analytics/locations');
          if (stats.data?.vendorLocations) {
            const cityList = stats.data.vendorLocations.map((l: any) => l.city).filter(Boolean);
            setCities(['All Cities', ...cityList]);
          }
        } catch (e) {
          console.error("Failed to fetch cities list", e);
          const uniqueCities = Array.from(new Set(pendingVendors.map((v: any) => v.city))).filter(Boolean) as string[];
          setCities(['All Cities', ...uniqueCities]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch vendor approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, action: 'APPROVE' | 'REJECT' | 'UNVERIFY') => {
    setProcessingId(id);
    try {
      if (action === 'APPROVE') {
        await apiFetch(`/admin/approve-vendor/${id}`, {
          method: 'PATCH'
        });
      } else if (action === 'UNVERIFY') {
        await apiFetch(`/admin/unverify-vendor/${id}`, {
          method: 'PATCH'
        });
      } else {
        await apiFetch(`/admin/reject-vendor/${id}`, {
          method: 'DELETE'
        });
      }
      
      // If we're on pending tab and we approved/rejected, remove it. 
      // If we unverified, it might stay or move depending on tab. Actually always refresh is better.
      fetchVendors();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update vendor status:', error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-3">
             Partnership Verification Registry
             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                <Building2 className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-gray-500 font-medium mt-1 text-sm">Review business credentials and verify new on-boarding applications.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {/* Status Registry Filter */}
           <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer min-w-[200px] font-semibold text-gray-700 outline-none"
              >
                <option value="PENDING">Awaiting Verification</option>
                <option value="VERIFIED">Verified Members</option>
                <option value="ALL">All Applications</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                 <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
              </div>
           </div>
           {/* Search Input */}
           <div className="relative w-full md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search business or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
           </div>

           {/* City Filter */}
           <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer min-w-[140px] outline-none"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                 <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
              </div>
           </div>

           <button onClick={fetchVendors} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                     <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Business Entity</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trust Status</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applied</th>
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
                                 <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-500 font-bold overflow-hidden shadow-sm group-hover:border-blue-200 transition-all">
                                    {vendor.logo ? <img src={vendor.logo} className="w-full h-full object-cover" /> : vendor.name?.charAt(0) || 'V'}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900 leading-none capitalize">{vendor.name}</span>
                                    <div className="flex items-center gap-2 mt-2">
                                       <div className="px-1.5 py-0.5 bg-blue-50/50 border border-blue-100/50 rounded-md flex items-center gap-1.5">
                                          <FileText className="w-3 h-3 text-blue-500" />
                                          <span className="text-[9px] font-mono font-bold text-blue-700 uppercase tracking-tight">
                                            GST: {vendor.gstNumber || 'PENDING'}
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                                 <MapPin className="w-3.5 h-3.5 text-gray-400" /> {vendor.city}, {vendor.country}
                              </div>
                           </td>
                            <td className="px-6 py-4">
                               <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${vendor.verified ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'} transition-all`}>
                                  <div className={`w-1 h-1 rounded-full ${vendor.verified ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                  {vendor.verified ? 'Verified Member' : 'Awaiting Trust'}
                               </div>
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                               {new Date(vendor.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  {vendor.verified ? (
                                     <button 
                                       onClick={() => handleStatusUpdate(vendor.id, 'UNVERIFY')}
                                       disabled={processingId === vendor.id}
                                       className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all shadow-sm border border-transparent hover:border-amber-100 group/btn"
                                       title="Revoke Verification"
                                     >
                                       {processingId === vendor.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                                     </button>
                                  ) : (
                                     <button 
                                       onClick={() => handleStatusUpdate(vendor.id, 'APPROVE')}
                                       disabled={processingId === vendor.id}
                                       className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all shadow-sm border border-transparent hover:border-green-100 group/btn"
                                       title="Quick Verify"
                                     >
                                       {processingId === vendor.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                     </button>
                                  )}
                                  <button 
                                    onClick={() => { setSelectedVendor(vendor); setIsModalOpen(true); }}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all inline-flex items-center gap-2 text-xs font-semibold"
                                  >
                                    Deep Verification
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                               </div>
                            </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={5} className="py-24 text-center">
                           <CheckCheck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                           <p className="text-sm font-semibold text-gray-400">All partnership applications have been reviewed. No pending tasks.</p>
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
               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-90 h-screen overflow-hidden"
            />
            <motion.div 
               initial={{ x: '100%' }} 
               animate={{ x: 0 }} 
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-100 p-10 overflow-y-auto"
            >
               <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-50">
                  <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Business Verification</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                     <AlertCircle className="w-5 h-5 text-gray-400" />
                  </button>
               </div>

               <div className="space-y-12">
                  <div className="flex gap-8 items-start">
                     <div className="w-28 h-28 bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden shadow-lg shrink-0 flex items-center justify-center text-2xl font-bold text-gray-400">
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
                           <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 uppercase tracking-widest">{selectedVendor.city || 'Location Pending'}</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 border-b border-gray-50 pb-2">Verification Documents</h4>
                        <div className="space-y-3">
                           <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-between group/input transition-all hover:bg-white hover:border-blue-100">
                              <div>
                                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                    <FileText className="w-3 h-3 text-blue-500" /> GST Identification
                                 </p>
                                 <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono font-bold text-gray-800 tracking-tight">
                                      {selectedVendor.gstNumber || 'Not Submitted'}
                                    </span>
                                 </div>
                              </div>
                              <button 
                                onClick={() => { navigator.clipboard.writeText(selectedVendor.gstNumber || ''); }}
                                className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-blue-600 transition-all shadow-sm border border-transparent hover:border-blue-50"
                                title="Copy to clipboard"
                              >
                                 <CheckCheck className="w-4 h-4" />
                              </button>
                           </div>
                           <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-between group/input transition-all hover:bg-white hover:border-blue-100">
                              <div>
                                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                    <Globe className="w-3 h-3 text-blue-500" /> Digital Website
                                 </p>
                                 <span className="text-sm font-semibold italic text-blue-600 truncate max-w-[150px] inline-block">{selectedVendor.website || 'No link provided'}</span>
                              </div>
                              <a 
                                href={selectedVendor.website?.startsWith('http') ? selectedVendor.website : `https://${selectedVendor.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-2 rounded-lg transition-all shadow-sm border border-transparent ${selectedVendor.website ? 'hover:bg-white text-gray-400 hover:text-blue-600 hover:border-blue-50' : 'text-gray-200 pointer-events-none'}`}
                              >
                                 <ExternalLink className="w-4 h-4" />
                              </a>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 border-b border-gray-50 pb-2">Application Control</h4>
                         <div className="flex flex-col gap-3 pt-2">
                           {selectedVendor.verified ? (
                             <button 
                               onClick={() => handleStatusUpdate(selectedVendor.id, 'UNVERIFY')}
                               disabled={processingId === selectedVendor.id}
                               className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-50 transition-all disabled:opacity-50"
                             >
                                <ShieldAlert className="w-5 h-5" />
                                Revoke Access
                             </button>
                           ) : (
                             <button 
                               onClick={() => handleStatusUpdate(selectedVendor.id, 'APPROVE')}
                               disabled={processingId === selectedVendor.id}
                               className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-50 transition-all disabled:opacity-50"
                             >
                                <ShieldCheck className="w-5 h-5" />
                                Grant Access
                             </button>
                           )}
                           <button 
                             onClick={() => setIsRejectConfirmOpen(true)}
                             disabled={processingId === selectedVendor.id}
                             className="w-full py-4 bg-white border border-red-100 hover:border-red-200 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                           >
                              <ShieldAlert className="w-5 h-5" />
                              Decline Entry
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Background Insight</h4>
                      <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                        "{selectedVendor.description || 'This applicant has not provided a business summary for public display yet.'}"
                      </p>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Rejection */}
      <AnimatePresence>
        {isRejectConfirmOpen && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsRejectConfirmOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Are you absolutely sure?</h3>
              <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">
                This action is permanent. It will completely remove the vendor profile, products, and all associated business data from the registry.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    handleStatusUpdate(selectedVendor.id, 'REJECT');
                    setIsRejectConfirmOpen(false);
                  }}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-50 transition-all"
                >
                  Yes, Confirm Rejection
                </button>
                <button 
                  onClick={() => setIsRejectConfirmOpen(false)}
                  className="w-full py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
