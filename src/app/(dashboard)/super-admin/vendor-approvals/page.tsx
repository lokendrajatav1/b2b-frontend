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
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
             Vendor Verification Queue
             <div className="p-1.5 bg-[#007367]/5 text-[#007367] rounded-none border border-[#007367]/10">
                <Building2 className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-slate-700 font-medium mt-1 text-base">Review and authorize business partnership applications.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {/* Tab Switches */}
           <div className="flex p-1 bg-gray-100 rounded-xl overflow-hidden">
              {['PENDING', 'VERIFIED', 'ALL'].map((tab) => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab as any)}
                   className={`px-4 py-2 text-base font-semibold uppercase  transition-all rounded-lg ${activeTab === tab ? 'bg-white text-[#007367] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                 >
                    {tab === 'PENDING' ? 'Pending Check' : tab === 'VERIFIED' ? 'Verified Hub' : 'All Registry'}
                 </button>
              ))}
           </div>

           <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-none text-base font-semibold appearance-none focus:border-[#007367] transition-all cursor-pointer min-w-[160px] text-slate-800 outline-none shadow-sm"
              >
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
           </div>

           <div className="relative">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-none text-base font-semibold appearance-none focus:border-[#007367] transition-all cursor-pointer min-w-[140px] text-slate-800 outline-none shadow-sm"
              >
                <option value="all">Lifetime</option>
                <option value="yearly">This Year</option>
                <option value="monthly">This Month</option>
                <option value="weekly">This Week</option>
              </select>
           </div>

           <div className="relative w-full md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search business..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-none text-base font-semibold outline-none focus:border-[#007367] shadow-sm"
              />
           </div>

           <button onClick={fetchVendors} className="p-2.5 bg-white border border-gray-200 rounded-none text-slate-500 hover:text-[#007367] hover:bg-[#007367]/5 transition-all shadow-sm">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
         <div className="bg-white rounded-none border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto w-full">
               <table className="w-full text-left border-collapse">
                  <thead>
                  <tr className="bg-gray-50/50">
                     <th className="px-4 sm:px-6 py-5 text-base font-semibold text-slate-500 uppercase ">Business Identity</th>
                     <th className="px-6 py-5 text-base font-semibold text-slate-500 uppercase ">Location Hub</th>
                     <th className="px-6 py-5 text-base font-semibold text-slate-500 uppercase ">Verification</th>
                     <th className="px-6 py-5 text-base font-semibold text-slate-500 uppercase ">Applied On</th>
                     <th className="px-6 py-5 text-base font-semibold text-slate-500 uppercase  text-right">Action</th>
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
                           <td className="px-4 sm:px-6 py-4">
                              <div className="flex items-center gap-4">
                                 <div className="flex flex-col">
                                    <span className="text-base font-semibold text-slate-900 leading-none capitalize">{vendor.name}</span>
                                    <div className="flex items-center gap-2 mt-2">
                                       <div className="flex items-center gap-1.5 mt-2 text-slate-500"><FileText className="w-3.5 h-3.5" /><span className="text-base font-semibold uppercase ">GST: {vendor.gstNumber || 'PENDING'}</span></div>
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5 text-base text-slate-800 font-medium">
                                 <MapPin className="w-3.5 h-3.5 text-slate-500" /> {vendor.city}, {vendor.country}
                              </div>
                           </td>
                            <td className="px-6 py-4">
                               <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-base font-semibold uppercase  border ${vendor.verified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${vendor.verified ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                  {vendor.verified ? 'Authorized' : 'Review Pending'}
                               </div>
                            </td>
                            <td className="px-6 py-4 text-base font-semibold text-slate-500">
                               {new Date(vendor.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-3">
                                  <button 
                                    onClick={() => { setSelectedVendor(vendor); setIsModalOpen(true); }}
                                    className="px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-none font-semibold text-base uppercase  hover:bg-[#007367] hover:text-white transition-all shadow-sm flex items-center gap-2"
                                  >
                                    Review
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                               </div>
                            </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={5} className="py-24 text-center">
                           <CheckCheck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                           <p className="text-base font-semibold text-slate-500">All partnership applications have been reviewed. No pending tasks.</p>
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
               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] h-screen overflow-hidden"
            />
            <motion.div 
               initial={{ x: '100%' }} 
               animate={{ x: 0 }} 
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-[110] flex flex-col overflow-hidden"
            >
               <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                  <h2 className="text-xl font-semibold text-slate-900 ">Business Verification</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2.5 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-none transition-colors text-slate-500 hover:text-slate-900">
                     <AlertCircle className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 sm:space-y-12">
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start text-center sm:text-left">
                     <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto sm:mx-0 bg-[#007367]/10 rounded-none border border-[#007367]/20 overflow-hidden shadow-sm shrink-0 flex items-center justify-center text-4xl font-semibold text-[#007367]">
                        {(selectedVendor.logoUrl || selectedVendor.logo) ? <img src={selectedVendor.logoUrl || selectedVendor.logo} className="w-full h-full object-cover" /> : selectedVendor.name?.charAt(0) || 'V'}
                     </div>
                     <div className="space-y-4 pt-1 flex-1">
                        <div>
                           <h3 className="text-2xl sm:text-3xl font-semibold text-[#007367] leading-tight capitalize">{selectedVendor.name}</h3>
                           <p className="text-base font-medium text-slate-700 mt-1 flex items-center justify-center sm:justify-start gap-2">
                             <Mail className="w-4 h-4 text-[#007367]/60" /> {selectedVendor.email}
                           </p>
                        </div>
                        <div className="flex gap-2 justify-center sm:justify-start">
                           <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-none text-base font-semibold text-slate-800 uppercase ">{selectedVendor.city || 'Location Pending'}</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Left Column: Core Identity */}
                     <div className="space-y-8">
                        <section className="space-y-4">
                           <h4 className="text-base font-bold text-black uppercase  pl-1 border-b border-gray-100 pb-2">Contact & Location</h4>
                           <div className="space-y-3">
                              <div className="flex items-center gap-4 p-5 bg-gray-50/80 rounded-none border border-gray-100">
                                 <div className="w-10 h-10 rounded-none bg-white flex items-center justify-center border border-gray-100 shrink-0">
                                    <Smartphone className="w-5 h-5 text-[#007367]" />
                                 </div>
                                 <div className="flex-1">
                                    <p className="text-base font-semibold text-slate-700 uppercase  mb-1">Primary Phone</p>
                                    <p className="text-base font-semibold text-slate-900">{selectedVendor.phone || 'Not Provided'}</p>
                                 </div>
                              </div>
                               <div className="flex items-center gap-4 p-5 bg-gray-50/80 rounded-none border border-gray-100">
                                 <div className="w-10 h-10 rounded-none bg-white flex items-center justify-center border border-gray-100 shrink-0">
                                    <Clock className="w-5 h-5 text-[#007367]" />
                                 </div>
                                 <div className="flex-1">
                                    <p className="text-base font-semibold text-slate-700 uppercase  mb-1">Office Hours</p>
                                    <p className="text-base font-semibold text-slate-900 leading-snug">{selectedVendor.workingHours || 'Not submitted'}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4 p-5 bg-gray-50/80 rounded-none border border-gray-100">
                                 <div className="w-10 h-10 rounded-none bg-white flex items-center justify-center border border-gray-100 shrink-0">
                                    <MapPin className="w-5 h-5 text-[#007367]" />
                                 </div>
                                 <div className="flex-1">
                                    <p className="text-base font-semibold text-slate-700 uppercase  mb-1">Physical Address</p>
                                    <p className="text-base font-semibold text-slate-900 leading-snug">{selectedVendor.address || 'Address not submitted'}</p>
                                 </div>
                              </div>
                           </div>
                        </section>

                        <section className="space-y-4">
                           <h4 className="text-base font-bold text-black uppercase  pl-1 border-b border-gray-100 pb-2">Professional Presence</h4>
                           <div className="grid grid-cols-1 gap-2.5">
                              {selectedVendor.socialLinks?.linkedin && (
                                 <a href={selectedVendor.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 bg-[#0077b5]/5 border border-[#0077b5]/10 hover:bg-[#0077b5]/10 transition-all group">
                                    <div className="flex items-center gap-3">
                                       <div className="p-2 bg-white rounded-none border border-[#0077b5]/20">
                                          <Linkedin className="w-4 h-4 text-[#0077b5]" />
                                       </div>
                                       <span className="text-base font-bold text-slate-800 uppercase ">LinkedIn Profile</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#0077b5] transition-colors" />
                                 </a>
                              )}
                              {selectedVendor.socialLinks?.instagram && (
                                 <a href={selectedVendor.socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 bg-[#e4405f]/5 border border-[#e4405f]/10 hover:bg-[#e4405f]/10 transition-all group">
                                    <div className="flex items-center gap-3">
                                       <div className="p-2 bg-white rounded-none border border-[#e4405f]/20">
                                          <Instagram className="w-4 h-4 text-[#e4405f]" />
                                       </div>
                                       <span className="text-base font-bold text-slate-800 uppercase ">Instagram Feed</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#e4405f] transition-colors" />
                                 </a>
                              )}
                              {selectedVendor.socialLinks?.facebook && (
                                 <a href={selectedVendor.socialLinks.facebook} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 bg-[#1877f2]/5 border border-[#1877f2]/10 hover:bg-[#1877f2]/10 transition-all group">
                                    <div className="flex items-center gap-3">
                                       <div className="p-2 bg-white rounded-none border border-[#1877f2]/20">
                                          <Facebook className="w-4 h-4 text-[#1877f2]" />
                                       </div>
                                       <span className="text-base font-bold text-slate-800 uppercase ">Facebook Page</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#1877f2] transition-colors" />
                                 </a>
                              )}
                              {selectedVendor.googleBusinessLink && (
                                 <a href={selectedVendor.googleBusinessLink} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 bg-[#34a853]/5 border border-[#34a853]/10 hover:bg-[#34a853]/10 transition-all group">
                                    <div className="flex items-center gap-3">
                                       <div className="p-2 bg-white rounded-none border border-[#34a853]/20">
                                          <Globe className="w-4 h-4 text-[#34a853]" />
                                       </div>
                                       <span className="text-base font-bold text-slate-800 uppercase ">Google Business</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#34a853] transition-colors" />
                                 </a>
                              )}
                              {(!selectedVendor.socialLinks?.linkedin && !selectedVendor.socialLinks?.instagram && !selectedVendor.socialLinks?.facebook && !selectedVendor.googleBusinessLink) && (
                                 <div className="p-4 bg-gray-50 border border-gray-100 text-center italic text-slate-400 font-medium">No social presence submitted</div>
                              )}
                           </div>
                        </section>
                     </div>

                     {/* Right Column: Verification & Control */}
                     <div className="space-y-8">
                        <section className="space-y-4">
                           <h4 className="text-base font-bold text-black uppercase  pl-1 border-b border-gray-100 pb-2">Verification Assets</h4>
                           <div className="space-y-3">
                              <div className="p-5 bg-gray-50/80 rounded-none border border-gray-100 flex items-center justify-between group/input transition-all hover:bg-white hover:border-[#007367]/30">
                                 <div>
                                    <p className="text-base font-semibold text-slate-700 uppercase  mb-1 flex items-center gap-1.5">
                                       <ShieldCheck className="w-4 h-4 text-[#007367]" /> GST Identification
                                    </p>
                                    <span className="text-base font-mono font-semibold text-slate-900 ">
                                       {selectedVendor.gstNumber || (selectedVendor.verified ? 'VERIFIED' : 'PENDING')}
                                    </span>
                                 </div>
                              </div>

                              <div className="p-5 bg-gray-50/80 rounded-none border border-gray-100 flex items-center justify-between group/input transition-all hover:bg-white hover:border-[#007367]/30">
                                 <div>
                                    <p className="text-base font-semibold text-slate-700 uppercase  mb-1 flex items-center gap-1.5">
                                       <Zap className="w-4 h-4 text-amber-500" /> Aadhaar Verification
                                    </p>
                                    <span className="text-base font-mono font-semibold text-slate-900 ">
                                       {selectedVendor.aadhaarNumber || (selectedVendor.verified ? 'VERIFIED' : 'PENDING')}
                                    </span>
                                 </div>
                              </div>

                              {selectedVendor.verificationDocument && (
                                <div className="p-5 bg-gray-50/80 rounded-none border border-gray-100 flex items-center justify-between group/input transition-all hover:bg-white hover:border-[#007367]/30">
                                   <div>
                                      <p className="text-base font-semibold text-slate-700 uppercase  mb-1 flex items-center gap-1.5">
                                         <FileText className="w-4 h-4 text-[#e88c30]" /> Business Document
                                      </p>
                                      <a href={selectedVendor.verificationDocument} target="_blank" rel="noreferrer" className="text-base font-semibold text-blue-600 hover:underline flex items-center gap-1.5">
                                         View Document <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                   </div>
                                </div>
                              )}

                              {(selectedVendor.logoUrl || selectedVendor.logo) && (
                                <div className="p-5 bg-gray-50/80 rounded-none border border-gray-100 flex items-center justify-between group/input transition-all hover:bg-white hover:border-[#007367]/30">
                                   <div>
                                      <p className="text-base font-semibold text-slate-700 uppercase  mb-1 flex items-center gap-1.5">
                                         <ShieldCheck className="w-4 h-4 text-[#007367]" /> Company Logo
                                      </p>
                                      <a href={selectedVendor.logoUrl || selectedVendor.logo} target="_blank" rel="noreferrer" className="text-base font-semibold text-blue-600 hover:underline flex items-center gap-1.5">
                                         View Logo <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                   </div>
                                </div>
                              )}
                           </div>
                        </section>

                        <section className="space-y-4">
                           <h4 className="text-base font-bold text-black uppercase  pl-1 border-b border-gray-100 pb-2">Business Categories</h4>
                           <div className="flex flex-wrap gap-2 pt-1">
                              {selectedVendor.categories && selectedVendor.categories.length > 0 ? (
                                 selectedVendor.categories.map((cat: any) => (
                                    <span key={cat.id} className="px-3 py-1.5 bg-[#007367]/10 text-[#007367] border border-[#007367]/20 rounded-none text-base font-semibold uppercase ">
                                       {cat.name}
                                    </span>
                                 ))
                              ) : (
                                 <span className="text-base font-medium text-slate-500 italic">No categories assigned</span>
                              )}
                           </div>
                        </section>
                     </div>
                  </div>

                   <div className="space-y-4">
                       <h4 className="text-base font-bold text-black uppercase  pl-1 border-b border-gray-100 pb-2">Mission & Description</h4>
                       <div className="p-6 bg-[#007367]/5 rounded-none border border-[#007367]/10">
                          <p className="text-base text-slate-800 font-medium leading-relaxed italic">
                            "{selectedVendor.description || 'This applicant has not provided a business summary for public display yet.'}"
                          </p>
                       </div>
                   </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-50 text-base font-semibold text-slate-500 uppercase  text-center sm:text-left">
                      <span>Registration Date: {new Date(selectedVendor.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 shrink-0">
                     <button 
                        onClick={() => handleStatusUpdate(selectedVendor.id, 'APPROVE')}
                        disabled={processingId === selectedVendor.id}
                        className="flex-1 bg-[#007367] hover:bg-[#005e54] text-white py-4 rounded-none font-bold text-base uppercase  flex items-center justify-center gap-2 shadow-lg shadow-[#007367]/20 transition-all disabled:opacity-50"
                     >
                        <ShieldCheck className="w-5 h-5" />
                        {processingId === selectedVendor.id ? 'Processing...' : 'Authorize Partnership'}
                     </button>
                     <button 
                        onClick={() => setIsRejectConfirmOpen(true)}
                        disabled={processingId === selectedVendor.id}
                        className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-4 rounded-none font-bold text-base uppercase  flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                     >
                        <XCircle className="w-5 h-5" />
                        Decline Application
                     </button>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRejectConfirmOpen && (
           <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
                 onClick={() => setIsRejectConfirmOpen(false)}
                 className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 className="relative bg-white rounded-none p-8 max-w-md w-full shadow-2xl border border-gray-100"
              >
                 <div className="w-16 h-16 bg-red-50 text-red-600 rounded-none flex items-center justify-center mb-6 border border-red-100">
                    <ShieldAlert className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-semibold text-slate-900 mb-2">Decline Application?</h3>
                 <p className="text-base text-slate-500 font-medium mb-8">This action will remove the applicant from the queue and notify them of the rejection. This cannot be undone.</p>
                 <div className="flex flex-col gap-3">
                    <button 
                       onClick={() => {
                          handleStatusUpdate(selectedVendor.id, 'REJECT');
                          setIsRejectConfirmOpen(false);
                       }}
                       className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-none font-bold uppercase  shadow-lg shadow-red-500/20"
                    >
                       Confirm Decline
                    </button>
                    <button 
                       onClick={() => setIsRejectConfirmOpen(false)}
                       className="w-full py-4 bg-gray-50 text-slate-700 rounded-none font-bold uppercase  hover:bg-gray-100"
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
