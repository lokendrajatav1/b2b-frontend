'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { 
  Package,
  Box,
  Plus, 
  Trash2, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  X,
  Target,
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
  Tag,
  ImageIcon,
  Upload,
  Info,
  Edit3,
  ChevronDown,
  Lock,
  CreditCard,
  ChevronRight,
  Filter,
  Eye,
  MoreVertical,
  ChevronLeft,
  TrendingUp,
  Clock,
  Search,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── subscription helpers ── */
function isSubscriptionActive(vendor: any): boolean {
  if (!vendor?.packageId) return false;
  if (!vendor?.planExpiry) return false;
  return new Date(vendor.planExpiry) > new Date();
}

/* ── Subscription Gate Screen ── */
function SubscriptionGate({ vendorName }: { vendorName: string }) {
  const router = useRouter();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-10 space-y-8">
      <div className="w-20 h-20 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto">
        <Lock className="w-9 h-9 text-amber-500" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-lg font-semibold text-slate-900">Subscription Required</h2>
        <p className="text-sm text-slate-800">
          Hi <span className="font-medium text-slate-800">{vendorName || 'there'}</span>, you need an active subscription to list and manage your products.
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 w-full max-w-md text-left space-y-3">
        <p className="text-sm font-medium text-slate-800">What you get with a subscription:</p>
        {[
          'List your products & services on the marketplace',
          'Get verified badge & trust signals',
          'Receive business leads from buyers',
          'Appear in search results with ranking boost',
          'Email & WhatsApp lead notifications',
        ].map(f => (
          <div key={f} className="flex items-center gap-2 text-sm text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-[#2e7d32] shrink-0" />{f}
          </div>
        ))}
      </div>
      <button
        onClick={() => router.push('/vendor/billing')}
        className="flex items-center gap-2 bg-[#2e7d32] text-white px-7 py-3 rounded-xl text-sm font-medium hover:bg-[#1b5e20] transition-all"
      >
        <CreditCard className="w-4 h-4" />
        View Plans & Subscribe
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function VendorProducts() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categories, setCategories] = useState<any[]>([]);
  const [hasSubscription, setHasSubscription] = useState(true);
  
  const [vendorData, setVendorData] = useState<any>({
    products: [],
    keywords: []
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [] as string[],
    moq: '1',
    availability: true,
    specifications: '',
    type: 'PRODUCT',
    sku: ''
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  
  const [newKeyword, setNewKeyword] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'PRODUCT' | 'SERVICE'>('PRODUCT');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const profileData = await apiFetch('/vendors/me');
        if (profileData && profileData.data) {
          setVendorData({
            ...profileData.data,
            products: profileData.data.products || [],
            keywords: profileData.data.keywords || []
          });
          setHasSubscription(isSubscriptionActive(profileData.data));
          
          // Trigger categories fetch after getting profile (for filtering)
          fetchCategories(profileData.data);
        }
      } catch (error) {
        console.error('Failed to fetch catalog:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async (pData: any) => {
      try {
        const categoriesData = await apiFetch('/vendors/categories');
        if (categoriesData && categoriesData.data) {
          const registeredCategoryIds = pData?.categories?.map((c: any) => c.id) || [];
          const filtered = categoriesData.data.filter((cat: any) => registeredCategoryIds.includes(cat.id));
          setCategories(filtered);
          if (!newProduct.category && filtered.length > 0) {
             setNewProduct(prev => ({ ...prev, category: filtered[0].name }));
          }
        }
      } catch (error) {
        console.error('Categories fetch failed:', error);
      }
    };

    fetchCatalog();
  }, []);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const keywords = vendorData.keywords.map((k: any) => typeof k === 'string' ? k : k.name);
      await apiFetch('/vendors/me', {
        method: 'PUT',
        body: JSON.stringify({ keywords }),
      });
      setMessage({ type: 'success', text: 'Catalog Synced Successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Sync failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setNewProduct({ ...newProduct, images: [...newProduct.images, data.data.url] });
        setMessage({ type: 'success', text: 'Image added' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed' });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const saveProduct = async () => {
    if (!newProduct.name.trim()) return;
    setSaving(true);
    try {
      const payload = { ...newProduct, type: activeTab };
      let response;
      if (editingId) {
        response = await apiFetch(`/vendors/products/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        response = await apiFetch('/vendors/products', { method: 'POST', body: JSON.stringify(payload) });
      }
      if (response && response.data) {
        setVendorData({
          ...vendorData,
          products: editingId 
            ? vendorData.products.map((p: any) => p.id === editingId ? response.data : p)
            : [response.data, ...vendorData.products]
        });
        setShowProductForm(false);
        setEditingId(null);
        setNewProduct({ name: '', description: '', price: '', category: categories[0]?.name || '', images: [], moq: '1', availability: true, specifications: '', type: activeTab, sku: '' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save item' });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setNewProduct({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || '',
      images: product.images || [],
      moq: product.moq?.toString() || '1',
      availability: product.availability ?? true,
      specifications: product.specifications || '',
      type: product.type || 'PRODUCT',
      sku: product.sku || ''
    });
    setShowProductForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this item?')) return;
    try {
      await apiFetch(`/vendors/products/${id}`, { method: 'DELETE' });
      setVendorData({
        ...vendorData,
        products: vendorData.products.filter((p: any) => p.id !== id)
      });
      setMessage({ type: 'success', text: 'Item removed successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove item' });
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    setVendorData({
      ...vendorData,
      keywords: [...vendorData.keywords, { id: Math.random().toString(), name: newKeyword.trim() }]
    });
    setNewKeyword('');
  };

  const removeKeyword = (id: string) => {
    setVendorData({
      ...vendorData,
      keywords: vendorData.keywords.filter((k: any) => (typeof k === 'string' ? k : k.id) !== id)
    });
  };

  if (loading) return (
    <div className="space-y-8 animate-pulse p-4 md:p-0">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-96 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="h-12 w-40 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-40 bg-white border border-slate-100 rounded-xl"></div>
        ))}
      </div>
      <div className="h-[500px] bg-white border border-slate-100 rounded-xl"></div>
    </div>
  );

  if (!hasSubscription) return <SubscriptionGate vendorName={vendorData?.businessName || ''} />;

  const filteredItems = vendorData.products.filter((p: any) => (p.type || 'PRODUCT') === activeTab);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-16 px-4 md:px-0">
      
      {/* Standardized Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
         <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-center text-emerald-600">
               <Package className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-xl font-semibold text-slate-900">Catalog Management</h1>
               <p className="text-sm text-slate-800 font-normal mt-1">Manage your products, services and search visibility settings.</p>
            </div>
         </div>
         <button 
           onClick={handleUpdate}
           disabled={saving}
           className="px-6 py-2.5 bg-[#164e33] text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-[#113f29] transition-all shadow-sm disabled:opacity-50"
         >
            {saving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
         </button>
      </div>

      {/* Stats Grid - Refined Spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
            { label: 'Total Products', value: vendorData.products.length, sub: `+${Math.floor(vendorData.products.length * 0.1)} growth`, icon: Box, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Approved Items', value: vendorData.products.filter((p: any) => p.status === 'APPROVED').length, sub: 'Verified & Active', icon: CheckCircle2, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Visibility Score', value: `${vendorData.totalScore || 82}%`, sub: 'Search Ranking', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Views', value: vendorData.views || '1,248', sub: 'Last 30 Days', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
         ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition-all">
               <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shrink-0 border border-gray-50`}>
                  <stat.icon size={22} />
               </div>
               <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-800 uppercase tracking-tight">{stat.label}</p>
                  <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
                  <p className="text-[10px] font-bold text-emerald-600">{stat.sub}</p>
               </div>
            </div>
         ))}
      </div>

      {/* Main Content Layout */}
      <div className="space-y-6 md:space-y-8">
         
         {/* Catalog Controls */}
         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div className="flex items-center gap-6 md:gap-8">
                  <button 
                    onClick={() => setActiveTab('PRODUCT')}
                    className={`text-[11px] font-bold uppercase tracking-wider pb-1 relative transition-all ${activeTab === 'PRODUCT' ? 'text-[#164e33]' : 'text-slate-800 hover:text-slate-800'}`}
                  >
                     Products
                     {activeTab === 'PRODUCT' && <motion.div layoutId="tab-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#164e33] rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setActiveTab('SERVICE')}
                    className={`text-[11px] font-bold uppercase tracking-wider pb-1 relative transition-all ${activeTab === 'SERVICE' ? 'text-[#164e33]' : 'text-slate-800 hover:text-slate-800'}`}
                  >
                     Services
                     {activeTab === 'SERVICE' && <motion.div layoutId="tab-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#164e33] rounded-full" />}
                  </button>
               </div>
               
               <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowProductForm(true)}
                    className="px-5 py-2 bg-[#164e33] text-white rounded-xl text-[11px] font-bold flex items-center gap-2 hover:bg-[#113f29] transition-all active:scale-95 shadow-sm"
                  >
                     <Plus size={14} /> Add {activeTab === 'PRODUCT' ? 'Product' : 'Service'}
                  </button>
               </div>
            </div>

            {/* Add/Edit Drawer */}
            <AnimatePresence>
               {showProductForm && (
                  <motion.div 
                     initial={{ opacity: 0, height: 0 }} 
                     animate={{ opacity: 1, height: 'auto' }} 
                     exit={{ opacity: 0, height: 0 }} 
                     className="bg-slate-50/50 border-b border-gray-100 overflow-hidden"
                  >
                        <div className="p-6 md:p-8 space-y-8">
                           <div className="flex items-center justify-between">
                              <h3 className="text-xs font-bold text-slate-900 uppercase">Item Configuration</h3>
                              <button onClick={()=>{setShowProductForm(false); setEditingId(null);}} className="p-2 text-slate-800 hover:text-red-500 transition-colors"><X size={18} /></button>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                              <div className="space-y-4">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-800 uppercase">Item Identity</label>
                                    <input type="text" placeholder="e.g. Herbal Ayurveda Hub" className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all outline-none" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name: e.target.value})} />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-800 uppercase">Details & Specifications</label>
                                    <textarea placeholder="Tell buyers about your item..." className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all outline-none min-h-[120px] resize-none" value={newProduct.description} onChange={e=>setNewProduct({...newProduct, description: e.target.value})} />
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] font-bold text-slate-800 uppercase">Commercials & Category</label>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-bold text-slate-800">Price (INR)</label>
                                       <input type="text" placeholder="0.00" className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all outline-none" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-bold text-slate-800">SKU Code</label>
                                       <input type="text" placeholder="REF-001" className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all outline-none" value={newProduct.sku} onChange={e=>setNewProduct({...newProduct, sku: e.target.value})} />
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-800">Category Placement</label>
                                    <select className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all outline-none appearance-none" value={newProduct.category} onChange={e=>setNewProduct({...newProduct, category: e.target.value})}>
                                       <option value="">Select Category</option>
                                       {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                 </div>
                                 <div className="space-y-2 pt-2">
                                    <label className="text-[10px] font-bold text-slate-800 uppercase">Gallery Assets</label>
                                    <div 
                                       className="w-full p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all group/upload"
                                       onClick={() => fileInputRef.current?.click()}
                                    >
                                       <Upload size={20} className="text-slate-300 group-hover/upload:text-emerald-500 transition-colors" />
                                       <p className="text-[10px] font-bold text-slate-800 group-hover/upload:text-emerald-700 uppercase">{uploading ? 'Processing...' : 'Upload Media'}</p>
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                                 </div>
                              </div>
                           </div>
                           <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
                              <button onClick={()=>{setShowProductForm(false); setEditingId(null);}} className="h-11 px-8 text-[11px] font-bold text-slate-800 hover:text-slate-800 transition-colors uppercase">Cancel</button>
                              <button onClick={saveProduct} disabled={saving} className="h-11 px-10 bg-[#164e33] text-white rounded-xl text-[11px] font-bold uppercase hover:bg-[#113f29] transition-all shadow-sm active:scale-95">
                                 {saving ? 'Syncing...' : editingId ? 'Update Item' : 'Publish Item'}
                              </button>
                           </div>
                        </div>
                  </motion.div>
               )}
            </AnimatePresence>

            <div className="overflow-x-auto w-full max-h-[60vh] relative scrollbar-hide">
               <table className="w-full text-left whitespace-nowrap">
                  <thead className="sticky top-0 z-20 bg-white">
                     <tr className="bg-gray-50/50 border-b border-gray-100 shadow-sm">
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-800 uppercase tracking-wider">Item Details</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-800 uppercase tracking-wider text-center">Status</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-800 uppercase tracking-wider">Visibility</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-slate-800 uppercase tracking-wider text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {filteredItems.length > 0 ? (
                        filteredItems
                          .slice((page - 1) * limit, page * limit)
                          .map((item: any, idx: number) => {
                           const score = item.visibilityScore || Math.floor(Math.random() * 40) + 60;
                           return (
                              <tr key={item.id} className="group hover:bg-slate-50/30 transition-all duration-300">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                       <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                                          {(item.images?.length > 0 || item.imageUrl) ? (
                                             <img src={item.images?.[0] || item.imageUrl} className="w-full h-full object-cover" />
                                          ) : (
                                             <div className="w-full h-full flex items-center justify-center text-slate-300"><Box size={20} /></div>
                                          )}
                                       </div>
                                       <div className="space-y-0.5">
                                          <div className="flex items-center gap-2">
                                             <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                             <span className="px-2 py-0.5 bg-gray-100 text-slate-800 text-[9px] font-bold rounded uppercase">
                                                {item.category || 'General'}
                                             </span>
                                          </div>
                                          <div className="flex items-center gap-3">
                                             <p className="text-[10px] font-bold text-slate-800">SKU: {item.sku || `REF-${idx+1001}`}</p>
                                             <p className="text-[11px] font-bold text-emerald-700">₹{item.price}</p>
                                          </div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="flex items-center justify-center">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                                           item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                           item.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                           'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                           {item.status === 'APPROVED' ? <CheckCircle2 size={10} /> : 
                                            item.status === 'REJECTED' ? <X size={10} /> : <Clock size={10} />}
                                           {item.status === 'APPROVED' ? 'Verified' : 
                                            item.status === 'REJECTED' ? 'Rejected' : 'Reviewing'}
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-6 py-4">
                                     <div className="flex items-center gap-3">
                                        <span className="text-[11px] font-bold text-slate-800">{score}%</span>
                                        <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                           <motion.div 
                                             initial={{ width: 0 }}
                                             animate={{ width: `${score}%` }}
                                             transition={{ duration: 1, ease: 'easeOut' }}
                                             className="h-full bg-emerald-500 rounded-full"
                                           />
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                     <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => startEdit(item)} className="p-2 text-slate-800 hover:text-[#164e33] hover:bg-emerald-50 rounded-lg transition-all">
                                           <Edit3 size={15} />
                                        </button>
                                        <button onClick={() => removeProduct(item.id)} className="p-2 text-slate-800 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                           <Trash2 size={15} />
                                        </button>
                                     </div>
                                  </td>
                              </tr>
                           );
                        })
                     ) : (
                        <tr>
                           <td colSpan={4} className="py-24 text-center">
                              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                 <Package className="w-8 h-8 text-slate-300" />
                              </div>
                              <p className="text-sm font-semibold text-slate-800 uppercase tracking-tight">No {activeTab.toLowerCase()}s listed yet</p>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-8 py-6 bg-slate-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
               <p className="text-xs font-semibold text-slate-800 uppercase tracking-tight">
                  Showing <span className="text-slate-900 font-bold">{Math.min(((page - 1) * limit) + 1, (vendorData.products?.filter((p: any) => p.type === activeTab).length || 0))}</span> to <span className="text-slate-900 font-bold">{Math.min(page * limit, (vendorData.products?.filter((p: any) => p.type === activeTab).length || 0))}</span> of <span className="text-slate-900 font-bold">{(vendorData.products?.filter((p: any) => p.type === activeTab).length || 0)}</span> items
               </p>

               <div className="flex items-center gap-6">
                  <select
                     value={limit}
                     onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
                     className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-800 outline-none hover:border-slate-300 transition-all cursor-pointer uppercase appearance-none pr-8"
                     style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23475569\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                  >
                     <option value={10}>10 items</option>
                     <option value={20}>20 items</option>
                     <option value={50}>50 items</option>
                  </select>

                  <div className="flex items-center gap-2">
                     <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-slate-800 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                     >
                        <ChevronLeft size={18} />
                     </button>
                     
                     <div className="flex items-center gap-1">
                        {[...Array((Math.max(0, Math.ceil((vendorData.products?.filter((p: any) => p.type === activeTab).length || 0) / (limit || 10)) || 0)))].slice(0, 5).map((_, i) => (
                           <button
                              key={i}
                              onClick={() => setPage(i + 1)}
                              className={`w-9 h-9 rounded-xl text-[11px] font-bold transition-all ${page === i + 1 ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-800 hover:bg-slate-100'}`}
                           >
                              {i + 1}
                           </button>
                        ))}
                     </div>

                     <button
                        onClick={() => setPage(p => Math.min((limit > 0 ? Math.ceil((vendorData.products?.filter((p: any) => p.type === activeTab).length || 0) / limit) : 0), p + 1))}
                        disabled={page >= (limit > 0 ? Math.ceil((vendorData.products?.filter((p: any) => p.type === activeTab).length || 0) / limit) : 0)}
                        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-slate-800 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                     >
                        <ChevronRight size={18} />
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Tools & Strategy Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            {/* Keywords Management */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100">
                     <Target size={16} />
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-slate-900 uppercase">Search Keywords</h3>
               </div>
               
               <div className="space-y-4">
                  <div className="flex gap-2">
                     <input 
                       type="text" 
                       placeholder="e.g. Organic Soap" 
                       value={newKeyword}
                       onChange={e=>setNewKeyword(e.target.value)}
                       onKeyDown={e=>e.key === 'Enter' && addKeyword()}
                       className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:bg-white focus:border-[#164e33] transition-all outline-none"
                     />
                     <button 
                       onClick={addKeyword}
                       disabled={!newKeyword.trim()}
                       className="px-4 bg-[#164e33] text-white rounded-xl text-[11px] font-bold hover:bg-[#113f29] disabled:opacity-30 transition-all"
                     >
                        Add
                     </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                     {vendorData.keywords.length > 0 ? (
                        vendorData.keywords.map((k: any, i: number) => (
                           <div key={i} className="px-3 py-1.5 bg-gray-50 text-slate-800 text-[11px] font-bold rounded-lg border border-gray-100 flex items-center gap-2 group/tag hover:bg-white hover:border-[#164e33]/20 transition-all">
                              #{typeof k === 'string' ? k : k.name}
                              <button onClick={() => removeKeyword(typeof k === 'string' ? k : k.id)} className="text-slate-800 hover:text-rose-500 transition-all"><X size={10} /></button>
                           </div>
                        ))
                     ) : (
                        <p className="text-[11px] font-medium text-slate-800 italic">No keywords indexed yet...</p>
                     )}
                  </div>
               </div>
            </div>

            {/* Growth Engine Card */}
            <div className="bg-[#164e33] rounded-xl p-6 md:p-8 relative overflow-hidden group shadow-xl shadow-emerald-950/10">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-all" />
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
                        <Zap size={20} className="text-emerald-400" />
                     </div>
                     <h3 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">Growth Engine</h3>
                  </div>
                  
                  <ul className="space-y-4">
                     {[
                       { text: 'Add 5+ Images', desc: 'Boosts visibility by 3x', icon: ImageIcon, color: 'text-blue-400' },
                       { text: 'Keyword Strategy', desc: 'Higher search ranking', icon: Target, color: 'text-purple-400' },
                       { text: 'Rich Details', desc: 'Better buyer conversion', icon: Box, color: 'text-emerald-400' }
                     ].map((tip, i) => (
                       <li key={i} className="flex items-center gap-4">
                          <div className={`w-9 h-9 bg-white/10 ${tip.color} rounded-xl flex items-center justify-center shrink-0 border border-white/10`}>
                             <tip.icon size={16} />
                          </div>
                          <div>
                             <p className="text-[11px] font-bold text-white uppercase tracking-tight">{tip.text}</p>
                             <p className="text-[10px] font-medium text-emerald-100/60">{tip.desc}</p>
                          </div>
                       </li>
                     ))}
                  </ul>

                  <button className="w-full py-3.5 bg-white text-[#164e33] rounded-xl text-[11px] font-bold uppercase hover:bg-emerald-50 transition-all shadow-lg flex items-center justify-center gap-2">
                     Learn Strategy <ArrowRight size={14} />
                  </button>
               </div>
            </div>
         </div>

      </div>

      <AnimatePresence>
        {message.text && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
                className={`fixed bottom-8 right-8 p-5 rounded-xl border z-[100] flex items-center gap-4 bg-white shadow-2xl shadow-slate-300/40 ${ message.type === 'success' ? 'text-emerald-700 border-emerald-100' : 'text-rose-700 border-rose-100' }`}
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'success' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                   {message.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <AlertCircle size={18} className="text-rose-500" />}
                </div>
                <p className="text-sm font-bold tracking-tight">{message.text}</p>
            </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
