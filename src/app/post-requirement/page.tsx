'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { 
  User, 
  Phone, 
  Tag, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Globe,
  ArrowLeft,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostRequirementPage() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    buyerName: '',
    phone: '',
    categoryId: '',
    message: '',
    city: '',
    searchKeyword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [matchedVendors, setMatchedVendors] = useState<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('q');
    const city = searchParams.get('city');
    if (q || city) {
      setFormData(prev => ({
        ...prev,
        searchKeyword: q || prev.searchKeyword,
        city: city || prev.city
      }));
    }

    const fetchCategories = async () => {
      try {
        const data = await apiFetch('/vendors/categories');
        setCategories(data.data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/leads/match-with-you', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setMatchedVendors(res.data?.matchedVendors || []);
      setSuccess(true);
      // Wait to allow user to view matches, or just keep them on the matches page
    } catch (err: any) {
      setError(err.message || 'Failed to post requirement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-white rounded-4xl shadow-xl shadow-slate-200 border border-slate-100 p-12">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Smart Match Successful!</h2>
            <p className="text-slate-500 text-sm mb-8 text-center leading-relaxed">
                Your requirement has been transmitted. Based on our AI ranking, here are the top verified partners in {formData.city}:
            </p>

            {matchedVendors.length > 0 ? (
                <div className="space-y-4 mb-10">
                    {matchedVendors.map((vendor, idx) => (
                        <motion.div 
                          key={vendor.id} 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: idx * 0.1 }}
                          className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between"
                        >
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 font-bold shrink-0">
                                 {vendor.businessName.charAt(0)}
                              </div>
                              <div>
                                 <h3 className="text-sm font-bold text-slate-900">{vendor.businessName}</h3>
                                 <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span>Score: {vendor.totalScore?.toFixed(1) || 'N/A'}</span>
                                 </div>
                              </div>
                           </div>
                           <Link 
                             href={`/supplier/${vendor.id}`}
                             className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                           >
                             View Profile
                           </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center mb-10">
                   <Globe className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                   <p className="text-sm font-semibold text-slate-500">Your requirement is active, but no highly-ranked vendors immediately matched. They will contact you shortly.</p>
                </div>
            )}

            <Link href="/" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                Return to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Post Your Requirement</h2>
          <p className="text-slate-500 text-sm">Fill in the details to get direct quotes from verified suppliers.</p>
        </div>

        <div className="bg-white rounded-4xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm font-bold border border-red-100 rounded-xl">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="text"
                    name="buyerName"
                    required
                    value={formData.buyerName}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-sm font-semibold text-slate-700 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-sm font-semibold text-slate-700 transition-all"
                    placeholder="+91 Mobile"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">City / Location</label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-sm font-semibold text-slate-700 transition-all"
                    placeholder="Enter city"
                  />
                </div>
              </div>

              {/* Industry Domain */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Industry Sector</label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <select
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none focus:border-blue-500 focus:bg-white text-sm font-semibold text-slate-700 transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Intent */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Product Intent</label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="text"
                    name="searchKeyword"
                    value={formData.searchKeyword}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-sm font-semibold text-slate-700 transition-all"
                    placeholder="e.g. Copper wire, raw silk"
                  />
                </div>
              </div>

              {/* Detail Requirement */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Requirement Matrix</label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-sm font-semibold text-slate-700 transition-all resize-none"
                    placeholder="Describe your requirement in detail for better matching..."
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Requirement'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
            <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1.5 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to Home
            </Link>
            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
            <Link href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Support Center</Link>
        </div>
      </div>
    </div>
  );
}
