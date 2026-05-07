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
  Smartphone,
  ShieldAlert,
  X,
  Linkedin,
  Instagram,
  Facebook
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminVendorApprovals() {
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
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchVendors();
  }, [searchQuery, selectedCity, activeTab, timeRange]);

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
      if (timeRange !== 'all') params.append('timeRange', timeRange);
      params.append('status', activeTab);

      // Endpoint is the same, but backend now filters by hub for ADMIN
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

      // Extract unique cities
      if (cities.length === 0 && pendingVendors.length > 0) {
        const uniqueCities = Array.from(new Set(pendingVendors.map((v: any) => v.city))).filter(Boolean) as string[];
        setCities(['All Cities', ...uniqueCities]);
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
        await apiFetch(`/admin/approve-vendor/${id}`, { method: 'PATCH' });
      } else if (action === 'UNVERIFY') {
        await apiFetch(`/admin/unverify-vendor/${id}`, { method: 'PATCH' });
      } else {
        await apiFetch(`/admin/reject-vendor/${id}`, { method: 'DELETE' });
      }
      fetchVendors();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update vendor status:', error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0 font-medium">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
             Hub Partner Verification
             <div className="p-1.5 bg-[#164e33]/5 text-[#164e33] rounded-xl border border-[#164e33]/10">
                <Building2 className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-slate-700 font-medium mt-1 text-sm">Manage business on-boarding for your assigned hub.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {/* Status Registry Filter */}
           <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
              <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold appearance-none focus:border-[#164e33] transition-all cursor-pointer min-w-[180px] text-slate-800 outline-none "
              >
                <option value="PENDING">Pending Check</option>
                <option value="VERIFIED">Verified Hub</option>
                <option value="ALL">All Hub Members</option>
              </select>
           </div>

           {/* Time Filter */}
           <div className="relative">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold appearance-none focus:border-[#164e33] transition-all cursor-pointer min-w-[140px] text-slate-800 outline-none "
              >
                <option value="all">Lifetime</option>
                <option value="yearly">This Year</option>
                <option value="monthly">This Month</option>
                <option value="weekly">This Week</option>
              </select>
           </div>

           <div className="relative w-full md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
              <input 
                type="text" 
                placeholder="Search business..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-[#164e33] "
              />
           </div>

           <button onClick={fetchVendors} className="p-2.5 bg-white border border-gray-200 rounded-xl text-slate-700 hover:text-[#164e33] hover:bg-[#164e33]/5 transition-all ">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
         <div className="bg-white rounded-xl border border-gray-100  overflow-hidden">
            <div className="overflow-x-auto w-full">
               <table className="w-full text-left border-collapse">
                  <thead>
                  <tr className="bg-gray-50/50">
                     <th className="px-8 py-5 text-sm font-semibold text-slate-700 uppercase ">Business Entity</th>
                     <th className="px-8 py-5 text-sm font-semibold text-slate-700 uppercase ">Hub Location</th>
                     <th className="px-8 py-5 text-sm font-semibold text-slate-700 uppercase ">Status</th>
                     <th className="px-8 py-5 text-sm font-semibold text-slate-700 uppercase ">Joined</th>
                     <th className="px-8 py-5 text-sm font-semibold text-slate-700 uppercase  text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                     [1,2,3,4,5].map(i => (
                        <tr key={i} className="animate-pulse">
                           <td colSpan={5} className="px-8 py-8"><div className="h-10 bg-gray-50 rounded-xl"></div></td>
                        </tr>
                     ))
                  ) : vendors.length > 0 ? (
                     vendors.map((vendor) => (
                        <tr key={vendor.id} className="group hover:bg-gray-50/30 transition-all">
                           <td className="px-8 py-5">
                              <div className="flex flex-col">
                                 <span className="text-sm font-semibold text-slate-900 leading-none capitalize group-hover:text-[#164e33] transition-colors">{vendor.name}</span>
                                 <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center gap-1.5 mt-2 text-slate-700"><FileText className="w-3.5 h-3.5" /><span className="text-sm font-semibold uppercase ">GST: {vendor.gstNumber || 'PENDING'}</span></div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                                 <MapPin className="w-3.5 h-3.5 text-[#164e33]" /> {vendor.city}
                              </div>
                           </td>
                            <td className="px-8 py-5">
                               <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold uppercase  border ${vendor.verified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'} transition-all`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${vendor.verified ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                  {vendor.verified ? 'Verified Partner' : 'Awaiting Check'}
                               </div>
                            </td>
                            <td className="px-8 py-5 text-sm font-semibold text-slate-700">
                               {new Date(vendor.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-8 py-5 text-right">
                               <div className="flex items-center justify-end gap-3">
                                  <button 
                                    onClick={() => { setSelectedVendor(vendor); setIsModalOpen(true); }}
                                    className="px-5 py-2.5 bg-white border border-gray-100 text-[#164e33] rounded-xl font-semibold text-sm uppercase  hover:bg-[#164e33] hover:text-white transition-all  flex items-center gap-2"
                                  >
                                    Verify
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                               </div>
                            </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={5} className="py-32 text-center bg-gray-50/20">
                           <CheckCheck className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                           <h3 className="text-lg font-semibold text-slate-700 ">Everything Screened</h3>
                           <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto mt-2">No pending applications found in your hub registry.</p>
                        </td>
                     </tr>
                  )}
                </tbody>
               </table>
            </div>
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
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
               initial={{ x: '100%' }} 
               animate={{ x: 0 }} 
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white  z-[110] flex flex-col overflow-hidden"
            >
               <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-10 bg-[#164e33] rounded-full" />
                     <h2 className="text-2xl font-semibold text-slate-900  uppercase">Registry Review</h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
                     <X className="w-6 h-6 text-slate-700" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-12 space-y-12">
                  <div className="flex gap-8 items-center bg-gray-50/50 p-8 rounded-xl border border-gray-100">
                     <div className="w-32 h-32 bg-white rounded-xl border border-gray-100 overflow-hidden  shrink-0 flex items-center justify-center text-4xl font-semibold text-[#164e33]">
                        {(selectedVendor.logoUrl || selectedVendor.logo) ? <img src={selectedVendor.logoUrl || selectedVendor.logo} className="w-full h-full object-cover" /> : selectedVendor.name?.charAt(0) || 'V'}
                     </div>
                     <div className="space-y-4">
                        <div>
                           <h3 className="text-3xl font-semibold text-slate-900 leading-none capitalize">{selectedVendor.name}</h3>
                           <p className="text-sm font-semibold text-[#f58220] mt-3 flex items-center gap-2">
                             <Mail className="w-5 h-5" /> {selectedVendor.email}
                           </p>
                        </div>
                        <div className="flex gap-2">
                           <span className="px-4 py-2 bg-white border border-[#164e33]/10 rounded-xl text-sm font-semibold text-[#164e33] uppercase ">{selectedVendor.city}</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-8">
                        <section className="space-y-4">
                           <h4 className="text-sm font-semibold text-black uppercase  pl-1 border-b border-gray-50 pb-2">Communications</h4>
                           <div className="space-y-3">
                               <div className="p-5 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center gap-4">
                                  <Smartphone className="w-5 h-5 text-[#164e33]" />
                                  <div className="flex-1">
                                     <p className="text-sm font-semibold text-slate-700 uppercase  mb-1">Phone</p>
                                     <p className="text-sm font-semibold text-slate-900">{selectedVendor.phone || 'N/A'}</p>
                                  </div>
                               </div>
                               <div className="p-5 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center gap-4">
                                  <Clock className="w-5 h-5 text-[#164e33]" />
                                  <div className="flex-1">
                                     <p className="text-sm font-semibold text-slate-700 uppercase  mb-1">Office Hours</p>
                                     <p className="text-sm font-semibold text-slate-900">{selectedVendor.workingHours || 'Not Provided'}</p>
                                  </div>
                               </div>
                               <div className="p-5 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center gap-4">
                                  <MapPin className="w-5 h-5 text-[#164e33]" />
                                  <div className="flex-1">
                                     <p className="text-sm font-semibold text-slate-700 uppercase  mb-1">Physical Address</p>
                                     <p className="text-sm font-semibold text-slate-900 leading-snug">{selectedVendor.address || 'Address not submitted'}</p>
                                  </div>
                               </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                           <h4 className="text-sm font-semibold text-black uppercase  pl-1 border-b border-gray-50 pb-2">Professional Presence</h4>
                           <div className="grid grid-cols-1 gap-2.5">
                              {selectedVendor.socialLinks?.linkedin && (
                                 <a href={selectedVendor.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 bg-[#0077b5]/5 border border-[#0077b5]/10 hover:bg-[#0077b5]/10 transition-all group">
                                    <div className="flex items-center gap-3">
                                       <div className="p-2 bg-white rounded-xl border border-[#0077b5]/20">
                                          <Linkedin className="w-4 h-4 text-[#0077b5]" />
                                       </div>
                                       <span className="text-sm font-semibold text-slate-800 uppercase ">LinkedIn Profile</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-[#0077b5] transition-colors" />
                                 </a>
                              )}
                              {selectedVendor.socialLinks?.instagram && (
                                 <a href={selectedVendor.socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 bg-[#e4405f]/5 border border-[#e4405f]/10 hover:bg-[#e4405f]/10 transition-all group">
                                    <div className="flex items-center gap-3">
                                       <div className="p-2 bg-white rounded-xl border border-[#e4405f]/20">
                                          <Instagram className="w-4 h-4 text-[#e4405f]" />
                                       </div>
                                       <span className="text-sm font-semibold text-slate-800 uppercase ">Instagram Feed</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-[#e4405f] transition-colors" />
                                 </a>
                              )}
                              {selectedVendor.socialLinks?.facebook && (
                                 <a href={selectedVendor.socialLinks.facebook} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 bg-[#1877f2]/5 border border-[#1877f2]/10 hover:bg-[#1877f2]/10 transition-all group">
                                    <div className="flex items-center gap-3">
                                       <div className="p-2 bg-white rounded-xl border border-[#1877f2]/20">
                                          <Facebook className="w-4 h-4 text-[#1877f2]" />
                                       </div>
                                       <span className="text-sm font-semibold text-slate-800 uppercase ">Facebook Page</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-[#1877f2] transition-colors" />
                                 </a>
                              )}
                              {selectedVendor.googleBusinessLink && (
                                 <a href={selectedVendor.googleBusinessLink} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 bg-[#34a853]/5 border border-[#34a853]/10 hover:bg-[#34a853]/10 transition-all group">
                                    <div className="flex items-center gap-3">
                                       <div className="p-2 bg-white rounded-xl border border-[#34a853]/20">
                                          <Globe className="w-4 h-4 text-[#34a853]" />
                                       </div>
                                       <span className="text-sm font-semibold text-slate-800 uppercase ">Google Business</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-[#34a853] transition-colors" />
                                 </a>
                              )}
                           </div>
                        </section>
                     </div>

                     <div className="space-y-8">
                        <section className="space-y-4">
                           <h4 className="text-sm font-semibold text-black uppercase  pl-1 border-b border-gray-50 pb-2">Hub Assets</h4>
                           <div className="space-y-3">
                               <div className="p-5 bg-white border border-gray-100 rounded-xl  space-y-4">
                                  <div>
                                     <p className="text-sm font-semibold text-black uppercase  mb-1 flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4 text-[#164e33]" /> GST Identification
                                     </p>
                                     <span className="text-sm font-semibold text-slate-900 ">
                                        {selectedVendor.gstNumber || 'PENDING'}
                                     </span>
                                  </div>
                                  <div className="pt-4 border-t border-gray-50">
                                     <p className="text-sm font-semibold text-black uppercase  mb-1 flex items-center gap-1.5">
                                        <Zap className="w-4 h-4 text-amber-500" /> Aadhaar Verification
                                     </p>
                                     <span className="text-sm font-semibold text-slate-900 ">
                                        {selectedVendor.aadhaarNumber || 'PENDING'}
                                     </span>
                                  </div>
                                  {selectedVendor.verificationDocument && (
                                     <div className="pt-4 border-t border-gray-50">
                                        <p className="text-sm font-semibold text-black uppercase  mb-1 flex items-center gap-1.5">
                                           <FileText className="w-4 h-4 text-[#f58220]" /> Business Document
                                        </p>
                                        <a href={selectedVendor.verificationDocument} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1.5">
                                           View Document <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                     </div>
                                  )}
                               </div>
                           </div>
                        </section>
                     </div>
                  </div>

                  <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-black uppercase  pl-1 border-b border-gray-50 pb-2">Mission & Description</h4>
                      <div className="p-8 bg-gray-50/50 rounded-xl border border-gray-100 italic font-semibold text-slate-800 leading-relaxed border-l-4 border-[#f58220]">
                         "{selectedVendor.description || 'No pitch provided.'}"
                      </div>
                  </div>
               </div>

               <div className="p-8 border-t border-gray-100 bg-white shrink-0">
                  <div className="flex gap-4">
                     {selectedVendor.verified ? (
                       <button 
                         onClick={() => handleStatusUpdate(selectedVendor.id, 'UNVERIFY')}
                         disabled={processingId === selectedVendor.id}
                         className="flex-1 py-5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2   transition-all"
                       >
                          <ShieldAlert className="w-6 h-6" />
                          Revoke Verification
                       </button>
                     ) : (
                       <button 
                         onClick={() => handleStatusUpdate(selectedVendor.id, 'APPROVE')}
                         disabled={processingId === selectedVendor.id}
                         className="flex-1 py-5 bg-[#164e33] hover:bg-[#113f29] text-white rounded-xl font-semibold flex items-center justify-center gap-2  -[#164e33]/20 transition-all"
                       >
                          <ShieldCheck className="w-6 h-6" />
                          Approve Partner
                       </button>
                     )}
                     <button 
                       onClick={() => setIsRejectConfirmOpen(true)}
                       disabled={processingId === selectedVendor.id}
                       className="flex-1 py-5 bg-white border border-red-100 hover:border-red-500 hover:text-red-600 text-red-400 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                     >
                        <XCircle className="w-6 h-6" />
                        Reject Account
                     </button>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Rejection */}
      <AnimatePresence>
        {isRejectConfirmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsRejectConfirmOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white p-8 max-w-md w-full  border border-gray-200"
            >
               <h3 className="text-lg font-semibold text-slate-900 mb-2">Confirm Rejection</h3>
               <p className="text-sm text-slate-700 mb-6 font-medium">Are you sure you want to decline this application? This action will notify the vendor.</p>
               <div className="flex gap-3">
                  <button 
                    onClick={() => { handleStatusUpdate(selectedVendor.id, 'REJECT'); setIsRejectConfirmOpen(false); }}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold uppercase "
                  >
                    Yes, Reject
                  </button>
                  <button 
                    onClick={() => setIsRejectConfirmOpen(false)}
                    className="flex-1 py-3 bg-gray-100 text-slate-700 rounded-xl font-semibold uppercase "
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


