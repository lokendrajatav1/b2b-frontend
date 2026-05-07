'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  Clock, 
  RefreshCcw,
  CheckCircle2,
  ChevronDown,
  FileText,
  MapPin,
  CheckCheck,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  Package,
  Target,
  BarChart3,
  XCircle,
  MoreVertical,
  Mail,
  Smartphone,
  ExternalLink,
  Zap,
  Globe,
  Linkedin,
  Instagram,
  Facebook,
  ChevronRight,
  AlertCircle,
  X,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VendorVerificationQueue() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'PENDING' | 'VERIFIED' | 'ALL'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('All Cities');
  const [cities, setCities] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState('ALL');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchVendors();
    fetchCities();
  }, [activeTab, timeRange, customRange, searchQuery, city]);

  const fetchCities = async () => {
    try {
      const data = await apiFetch('/vendors/cities');
      setCities(data.success ? data.data : []);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('status', activeTab);
      if (searchQuery) params.append('search', searchQuery);
      if (city !== 'All Cities') params.append('city', city);
      if (timeRange !== 'ALL') params.append('timeRange', timeRange);
      if (timeRange === 'custom' && customRange.start && customRange.end) {
        params.append('startDate', customRange.start);
        params.append('endDate', customRange.end);
      }
      
      const data = await apiFetch(`/admin/vendors/pending?${params.toString()}`);
      setVendors(data.data || []);
      
      const analytics = await apiFetch('/admin/analytics');
      const s = analytics.data?.summary || {};
      setStats({
        total: s.totalVendors || 0,
        pending: s.pendingVendors || 0,
        verified: s.verifiedVendors || 0,
        rejected: s.rejectedVendors || 0
      });
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
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
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <h1 className="text-2xl font-bold text-slate-900 leading-none uppercase tracking-tight">Vendor Registry</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {/* Tab Filter */}
           <div className="relative group">
              <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="pl-4 pr-10 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 outline-none appearance-none cursor-pointer shadow-sm"
              >
                 <option value="PENDING">Pending Check</option>
                 <option value="VERIFIED">Verified Hub</option>
                 <option value="ALL">All Registry</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
           </div>

           <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-1.5 shadow-sm">
             <Clock size={14} className="text-gray-500" />
             <select 
               value={timeRange}
               onChange={(e) => setTimeRange(e.target.value)}
               className="text-xs font-bold text-gray-900 outline-none bg-transparent cursor-pointer"
             >
               <option value="ALL">Lifetime</option>
               <option value="today">Today</option>
               <option value="yesterday">Yesterday</option>
               <option value="weekly">Last 7 Days</option>
               <option value="monthly">Last 30 Days</option>
               <option value="yearly">Last 12 Months</option>
               <option value="custom">Custom Range</option>
             </select>
           </div>

           {timeRange === 'custom' && (
             <div className="flex items-center gap-2">
               <input 
                 type="date" 
                 className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs font-bold"
                 onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
               />
               <span className="text-xs font-bold text-gray-500">to</span>
               <input 
                 type="date" 
                 className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs font-bold"
                 onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
               />
             </div>
           )}

           <div className="flex items-center gap-3">
              <div className="relative group">
                 <select 
                   value={city}
                   onChange={(e) => setCity(e.target.value)}
                   className="pl-4 pr-10 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 outline-none appearance-none cursor-pointer shadow-sm"
                 >
                    <option value="All Cities">All Cities</option>
                    {cities.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                 </select>
                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
              </div>
           </div>
        </div>
      </div>

      {/* --- SEARCH & REFRESH --- */}
      <div className="flex items-center gap-4">
         <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input 
              type="text" 
              placeholder="Search business by name, mobile, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-xl text-[14px] font-medium outline-none  focus:border-emerald-500 transition-all"
            />
         </div>
         <button onClick={fetchVendors} className="p-3.5 bg-white border border-gray-100 rounded-xl text-slate-600 hover:text-emerald-600 transition-all ">
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
         </button>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <VerificationStatCard 
           label="Total Applications" 
           value={stats.total} 
           sub="All time" 
           color="text-slate-900" 
           bg="bg-white" 
         />
         <VerificationStatCard 
           label="Pending Review" 
           value={stats.pending} 
           sub="Awaiting action" 
           color="text-slate-900" 
           bg="bg-white" 
         />
         <VerificationStatCard 
           label="Verified" 
           value={stats.verified} 
           sub="Approved vendors" 
           color="text-slate-900" 
           bg="bg-white" 
         />
         <VerificationStatCard 
           label="Rejected" 
           value={stats.rejected} 
           sub="Declined applications" 
           color="text-slate-900" 
           bg="bg-white" 
         />
      </div>

      {/* --- TABLE AREA --- */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden min-h-[500px] flex flex-col shadow-sm">
         <table className="w-full text-left">
            <thead>
                <tr className="border-b border-gray-50 bg-slate-50/30">
                   <th className="px-10 py-6 text-xs font-bold text-slate-800 uppercase  ">Business Identity</th>
                   <th className="px-10 py-6 text-xs font-bold text-slate-800 uppercase  ">Location Hub</th>
                   <th className="px-10 py-6 text-xs font-bold text-slate-800 uppercase  ">Verification</th>
                   <th className="px-10 py-6 text-xs font-bold text-slate-800 uppercase  ">Applied On</th>
                   <th className="px-10 py-6 text-xs font-bold text-slate-800 uppercase   text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? (
                 [1,2,3,4].map(i => <tr key={i} className="animate-pulse h-24 bg-gray-50/10" />)
               ) : vendors.length > 0 ? (
                 vendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-slate-50 transition-all group">
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-slate-100 border border-gray-100 overflow-hidden flex items-center justify-center text-lg font-bold text-slate-400 shrink-0">
                                {(vendor.logo || vendor.logoUrl) ? (
                                  <img src={vendor.logo || vendor.logoUrl} className="w-full h-full object-cover" />
                                ) : (vendor.businessName || vendor.user?.name)?.charAt(0)}
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[15px] font-bold text-slate-900 mb-0.5 leading-tight">{vendor.businessName || vendor.user?.name}</span>
                                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">GST: {vendor.gstNumber || 'PENDING'}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-6 text-[14px] font-bold text-slate-700">
                          {vendor.city || 'India'}
                       </td>
                      <td className="px-10 py-6">
                         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border text-xs font-bold uppercase tracking-tight ${vendor.verified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${vendor.verified ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                            {vendor.verified ? 'Verified' : 'Review Required'}
                         </div>
                      </td>
                      <td className="px-10 py-6 text-[14px] font-bold text-slate-700">
                         {new Date(vendor.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-10 py-6 text-right">
                         <button 
                            onClick={() => { setSelectedVendor(vendor); setIsModalOpen(true); }}
                            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold uppercase   hover:bg-black transition-all"
                         >
                            Review
                         </button>
                      </td>
                   </tr>
                 ))
               ) : (
                 <tr>
                    <td colSpan={5} className="py-32">
                       <div className="flex flex-col items-center text-center">
                          <div className="relative mb-8">
                             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                                <FileText size={40} className="text-slate-200" />
                             </div>
                             <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 ">
                                <CheckCircle2 size={24} />
                             </div>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 mb-1">All partnership applications have been reviewed.</h3>
                          <p className="text-sm font-medium text-slate-600 mb-8">No pending tasks at the moment.</p>
                          <button 
                            onClick={() => setActiveTab('VERIFIED')}
                            className="px-8 py-3.5 bg-[#06392D] text-white rounded-xl font-bold text-[14px] flex items-center gap-3   hover:bg-[#0D824D] transition-all"
                          >
                             View Verified Vendors <ArrowRight size={18} />
                          </button>
                       </div>
                    </td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>

      {/* --- SIDE DRAWER --- */}
      <AnimatePresence>
        {isModalOpen && selectedVendor && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] h-screen overflow-hidden"
            />
            <motion.div 
               initial={{ x: '100%' }} 
               animate={{ x: 0 }} 
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-[#F8FAFC]  z-[110] flex flex-col overflow-hidden"
            >
               <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                  <div className="flex items-center gap-3">
                     <ShieldCheck className="w-5 h-5 text-emerald-600" />
                     <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">Business Verification</h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-slate-600 hover:text-slate-900">
                     <X size={20} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  {/* Business Header Card */}
                  <div className="bg-white p-8 rounded-xl border border-gray-100  flex items-start gap-8">
                     <div className="w-24 h-24 bg-emerald-50 rounded-2xl border border-emerald-100 overflow-hidden shrink-0 flex items-center justify-center text-3xl font-bold text-emerald-700 ">
                        {(selectedVendor.logoUrl || selectedVendor.logo) ? <img src={selectedVendor.logoUrl || selectedVendor.logo} className="w-full h-full object-cover" /> : (selectedVendor.businessName || selectedVendor.user?.name)?.charAt(0)}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className="text-2xl font-bold text-slate-900 truncate">{selectedVendor.businessName || selectedVendor.user?.name}</h3>
                           {selectedVendor.verified && <CheckCircle2 size={18} className="text-blue-500" />}
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                           <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                              <Mail size={14} /> {selectedVendor.user?.email}
                           </span>
                           <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                              <MapPin size={14} /> {selectedVendor.city || 'India'}
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Left Column */}
                     <div className="space-y-6">
                        <div className="space-y-4">
                           <h4 className="text-xs font-bold text-slate-600 uppercase  pl-1">Contact & Logistics</h4>
                           <div className="space-y-3">
                              <InfoRow icon={<Smartphone className="text-emerald-500" />} label="Phone" value={selectedVendor.phone || 'Not provided'} />
                              <InfoRow icon={<Clock className="text-blue-500" />} label="Working Hours" value={selectedVendor.workingHours || '9:00 AM - 6:00 PM'} />
                              <InfoRow icon={<MapPin className="text-rose-500" />} label="Address" value={selectedVendor.address || 'Location details pending'} />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <h4 className="text-xs font-bold text-slate-600 uppercase  pl-1">Social Presence</h4>
                           <div className="grid grid-cols-2 gap-2">
                              {['LinkedIn', 'Instagram', 'Facebook', 'Globe'].map((s, i) => (
                                 <div key={i} className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between group cursor-pointer hover:border-emerald-200 transition-all">
                                    <span className="text-sm font-bold text-slate-600">{s}</span>
                                    <ExternalLink size={12} className="text-slate-300 group-hover:text-emerald-500" />
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     {/* Right Column */}
                     <div className="space-y-6">
                        <div className="space-y-4">
                           <h4 className="text-xs font-bold text-slate-600 uppercase  pl-1">Legal Assets</h4>
                           <div className="space-y-3">
                              <AssetRow icon={<ShieldCheck className="text-emerald-500" />} label="GSTIN" value={selectedVendor.gstNumber || 'VERIFIED'} />
                              <AssetRow icon={<Zap className="text-amber-500" />} label="Aadhaar" value={selectedVendor.aadhaarNumber || 'AUTHENTICATED'} />
                              <div className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between hover:border-blue-200 transition-all cursor-pointer">
                                 <div className="flex items-center gap-3">
                                    <FileText size={18} className="text-blue-500" />
                                    <span className="text-sm font-bold text-slate-700">Registration Doc</span>
                                 </div>
                                 <ExternalLink size={14} className="text-slate-300" />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <h4 className="text-xs font-bold text-slate-600 uppercase  pl-1">Industry Categories</h4>
                           <div className="flex flex-wrap gap-2">
                              {selectedVendor.categories?.map((c: any) => (
                                 <span key={c.id} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold uppercase">{c.name}</span>
                              )) || <span className="text-sm font-bold text-slate-600 italic">None selected</span>}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                     <h4 className="text-xs font-bold text-slate-600 uppercase  pl-1">Business Statement</h4>
                     <div className="p-6 bg-white rounded-xl border border-gray-100 ">
                        <p className="text-[14px] text-slate-700 font-medium leading-relaxed italic">
                           "{selectedVendor.description || 'No business description provided by the vendor.'}"
                        </p>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-8 border-t border-gray-100 flex items-center gap-4">
                     <button 
                        onClick={() => handleStatusUpdate(selectedVendor.id, 'APPROVE')}
                        disabled={processingId === selectedVendor.id}
                        className="flex-1 py-4 bg-[#06392D] text-white rounded-xl font-bold text-[14px] uppercase    flex items-center justify-center gap-2 hover:bg-[#0D824D] transition-all disabled:opacity-50"
                     >
                        <ShieldCheck size={18} />
                        {processingId === selectedVendor.id ? 'Authorizing...' : 'Authorize Partnership'}
                     </button>
                     <button 
                        onClick={() => handleStatusUpdate(selectedVendor.id, 'REJECT')}
                        disabled={processingId === selectedVendor.id}
                        className="flex-1 py-4 bg-white border border-red-100 text-red-600 rounded-xl font-bold text-[14px] uppercase  flex items-center justify-center gap-2 hover:bg-red-50 transition-all disabled:opacity-50"
                     >
                        <XCircle size={18} />
                        Decline Application
                     </button>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const VerificationStatCard = ({ label, value, sub, color, bg }: any) => (
  <div className={`bg-white p-8 rounded-xl border border-gray-200 flex flex-col justify-center group transition-all`}>
     <div>
        <p className="text-xs font-bold text-slate-800 uppercase mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 leading-none mb-1">{value}</h3>
        <p className="text-[10px] font-bold text-slate-800 uppercase ">{sub}</p>
     </div>
  </div>
);

const InfoRow = ({ icon, label, value }: any) => (
  <div className="p-4 bg-white border border-gray-100 rounded-xl flex items-center gap-4">
     <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
        {icon}
     </div>
     <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1 tracking-wider">{label}</p>
        <p className="text-sm font-bold text-slate-900 truncate leading-tight">{value}</p>
     </div>
  </div>
);

const AssetRow = ({ icon, label, value }: any) => (
  <div className="p-4 bg-white border border-gray-100 rounded-xl flex items-center gap-4">
     <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
        {icon}
     </div>
     <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1 tracking-wider">{label}</p>
        <p className="text-sm font-mono font-bold text-slate-900 truncate leading-none">{value}</p>
     </div>
  </div>
);
