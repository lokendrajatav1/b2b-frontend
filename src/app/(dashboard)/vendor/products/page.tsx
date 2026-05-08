'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { 
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
        <p className="text-sm text-slate-700">
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
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Products & Services</h1>
            <p className="text-xs md:text-sm font-medium text-slate-600">Manage your catalog items and visibility settings</p>
         </div>
         <button 
           onClick={handleUpdate}
           disabled={saving}
           className="px-6 md:px-8 py-2.5 md:py-3 bg-[#062d1d] text-white rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-[#041d13] transition-all shadow-xl shadow-emerald-950/10 active:scale-[0.98]"
         >
            {saving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
         </button>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         {[
            { label: 'Total Products', value: vendorData.products.length, sub: `+${Math.floor(vendorData.products.length * 0.1)} from last month`, icon: Box, color: '#10b981', bg: 'bg-emerald-50' },
            { label: 'Approved Products', value: vendorData.products.filter((p: any) => p.status === 'APPROVED').length, sub: `${Math.round((vendorData.products.filter((p: any) => p.status === 'APPROVED').length / (vendorData.products.length || 1)) * 100)}% of total`, icon: CheckCircle2, color: '#f58220', bg: 'bg-orange-50' },
            { label: 'Avg. Visibility Score', value: `${vendorData.totalScore || 82}%`, sub: 'Good visibility', icon: Eye, color: '#3b82f6', bg: 'bg-blue-50' },
            { label: 'Total Views', value: vendorData.views || '1,248', sub: '+18% from last month', icon: TrendingUp, color: '#8b5cf6', bg: 'bg-purple-50' },
         ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 relative flex flex-col justify-between min-h-[165px]">
               <div className="flex items-start gap-4 relative z-10">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500`} style={{ color: stat.color }}>
                     <stat.icon size={20} />
                  </div>
                  <div className="space-y-1.5 flex-1">
                     <div className="min-h-[32px] flex items-start">
                        <p className="text-[10px] md:text-[11px] font-bold text-slate-600 uppercase leading-tight">{stat.label}</p>
                     </div>
                     <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-none">{stat.value}</h3>
                  </div>
               </div>
               <div className="relative z-10 pt-4 border-t border-slate-50 mt-4">
                  <p className={`text-[10px] md:text-[11px] font-bold ${i === 1 || i === 2 ? 'text-slate-600' : 'text-emerald-500'}`}>{stat.sub}</p>
               </div>
            </div>
         ))}
      </div>

      {/* Main Content Layout */}
      <div className="space-y-8">
         
         {/* Table Section */}
         <div className="space-y-6">
            <div className="bg-white rounded-xl md:rounded-xl border border-slate-100 shadow-sm overflow-hidden">
               
               {/* Controls Header */}
               <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-8 md:gap-10">
                     <button 
                       onClick={() => setActiveTab('PRODUCT')}
                       className={`text-[10px] md:text-xs font-bold uppercase pb-3 relative transition-all ${activeTab === 'PRODUCT' ? 'text-slate-900' : 'text-slate-600 hover:text-slate-800'}`}
                     >
                        Products
                        {activeTab === 'PRODUCT' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#062d1d] rounded-full" />}
                     </button>
                     <button 
                       onClick={() => setActiveTab('SERVICE')}
                       className={`text-[10px] md:text-xs font-bold uppercase pb-3 relative transition-all ${activeTab === 'SERVICE' ? 'text-slate-900' : 'text-slate-600 hover:text-slate-800'}`}
                     >
                        Services
                        {activeTab === 'SERVICE' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#062d1d] rounded-full" />}
                     </button>
                  </div>
                  
                  <div className="flex items-center gap-3 md:gap-4">
                     <button className="h-10 md:h-11 px-4 md:px-5 bg-slate-50 text-slate-700 rounded-xl text-[10px] md:text-xs font-bold flex items-center gap-2 border border-slate-100 hover:bg-slate-100 transition-all active:scale-95">
                        <Filter size={14} /> Filters
                     </button>
                     <button 
                       onClick={() => setShowProductForm(true)}
                       className="h-10 md:h-11 px-5 md:px-6 bg-[#062d1d] text-white rounded-xl text-[10px] md:text-xs font-bold flex items-center gap-2 hover:bg-black transition-all active:scale-95 shadow-lg shadow-emerald-950/10"
                     >
                        <Plus size={16} /> Add Item
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
                        className="bg-slate-50/80 border-b border-slate-100 overflow-hidden"
                     >
                        <div className="p-6 md:p-8 space-y-8">
                           <div className="flex items-center justify-between">
                              <h3 className="text-[10px] md:text-xs font-bold text-slate-900 uppercase">Item Configuration</h3>
                              <button onClick={()=>{setShowProductForm(false); setEditingId(null);}} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={18} /></button>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                              <div className="space-y-4 md:space-y-5">
                                 <div className="space-y-2">
                                    <label className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase">Item Identity</label>
                                    <input type="text" placeholder="e.g. Herbal Ayurveda Hub" className="w-full p-3 md:p-4 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-semibold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all outline-none" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name: e.target.value})} />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase">Details & Specifications</label>
                                    <textarea placeholder="Tell buyers about your item..." className="w-full p-3 md:p-4 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-semibold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all outline-none min-h-[100px] md:min-h-[120px] resize-none" value={newProduct.description} onChange={e=>setNewProduct({...newProduct, description: e.target.value})} />
                                 </div>
                              </div>
                              <div className="space-y-4 md:space-y-5">
                                 <label className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase">Commercials & Category</label>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                       <label className="text-[9px] md:text-[10px] font-bold text-slate-500">Price (INR)</label>
                                       <input type="text" placeholder="0.00" className="w-full p-3 md:p-4 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-semibold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all outline-none" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[9px] md:text-[10px] font-bold text-slate-500">SKU Code</label>
                                       <input type="text" placeholder="REF-001" className="w-full p-3 md:p-4 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-semibold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all outline-none" value={newProduct.sku} onChange={e=>setNewProduct({...newProduct, sku: e.target.value})} />
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[9px] md:text-[10px] font-bold text-slate-500">Category Placement</label>
                                    <select className="w-full p-3 md:p-4 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-semibold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all outline-none appearance-none" value={newProduct.category} onChange={e=>setNewProduct({...newProduct, category: e.target.value})}>
                                       <option value="">Select Category</option>
                                       {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                 </div>
                                 <div className="space-y-2 pt-2">
                                    <label className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase">Gallery Assets</label>
                                    <div 
                                       className="w-full p-3 md:p-4 bg-white border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all group/upload"
                                       onClick={() => fileInputRef.current?.click()}
                                    >
                                       <Upload size={20} className="text-slate-300 group-hover/upload:text-emerald-500 transition-colors" />
                                       <p className="text-[9px] md:text-[10px] font-bold text-slate-600 group-hover/upload:text-emerald-700 uppercase">{uploading ? 'Processing...' : 'Upload Media'}</p>
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                                 </div>
                              </div>
                           </div>
                           <div className="flex justify-end gap-4 pt-8 border-t border-slate-200/60">
                              <button onClick={()=>{setShowProductForm(false); setEditingId(null);}} className="h-11 md:h-12 px-6 md:px-8 text-[10px] md:text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors uppercase">Cancel</button>
                              <button onClick={saveProduct} disabled={saving} className="h-11 md:h-12 px-8 md:px-10 bg-[#062d1d] text-white rounded-xl text-[10px] md:text-xs font-bold uppercase hover:bg-black transition-all shadow-xl shadow-emerald-950/5 active:scale-95">
                                 {saving ? 'Syncing...' : editingId ? 'Update Item' : 'Publish Item'}
                              </button>
                           </div>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>

               {/* Product Matrix */}
               <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full border-collapse">
                     <thead className="bg-slate-50/50">
                        <tr>
                           <th className="px-6 md:px-8 py-4 md:py-5 text-left text-[9px] md:text-[10px] font-bold text-slate-600 uppercase">Product & Info</th>
                           <th className="px-6 md:px-8 py-4 md:py-5 text-left text-[9px] md:text-[10px] font-bold text-slate-600 uppercase">Moderation</th>
                           <th className="px-6 md:px-8 py-4 md:py-5 text-left text-[9px] md:text-[10px] font-bold text-slate-600 uppercase">Visibility</th>
                           <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold text-slate-600 uppercase text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100/60">
                        {filteredItems.map((item: any, idx: number) => {
                           const score = item.visibilityScore || Math.floor(Math.random() * 40) + 60;
                           return (
                              <tr key={item.id} className="group hover:bg-slate-50/30 transition-all duration-300">
                                 <td className="px-6 md:px-8 py-5 md:py-6">
                                    <div className="flex items-center gap-4 md:gap-6">
                                       <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-xl md:rounded-xl overflow-hidden border border-slate-100 shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-500">
                                          {(item.images?.length > 0 || item.imageUrl) ? (
                                             <img src={item.images?.[0] || item.imageUrl} className="w-full h-full object-cover" />
                                          ) : (
                                             <div className="w-full h-full flex items-center justify-center text-slate-300"><Box size={20} /></div>
                                          )}
                                       </div>
                                       <div className="space-y-1 flex-1 min-w-0">
                                          <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                             <p className="text-sm md:text-base font-bold text-slate-900 truncate">{item.name}</p>
                                             <span className="px-2 py-0.5 bg-emerald-50/50 text-emerald-700 text-[9px] md:text-[10px] font-bold rounded-lg border border-emerald-100/30 uppercase shrink-0">
                                                {item.category || 'General'}
                                             </span>
                                          </div>
                                          <div className="flex items-center gap-3 md:gap-4">
                                             <p className="text-[10px] md:text-[11px] font-bold text-slate-600">SKU: {item.sku || `REF-${idx+1001}`}</p>
                                             <p className="text-xs md:text-[13px] font-bold text-emerald-700">₹{item.price}</p>
                                          </div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 md:px-8 py-5 md:py-6">
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] md:text-[11px] font-bold border w-fit shadow-sm ${
                                       item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                       item.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                       'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                       {item.status === 'APPROVED' ? <CheckCircle2 size={12} /> : 
                                        item.status === 'REJECTED' ? <X size={12} /> : <Clock size={12} />}
                                       {item.status === 'APPROVED' ? 'Verified' : 
                                        item.status === 'REJECTED' ? 'Rejected' : 'Reviewing'}
                                    </div>
                                 </td>
                                 <td className="px-6 md:px-8 py-5 md:py-6">
                                    <div className="flex items-center gap-3 md:gap-4">
                                       <span className="text-[11px] md:text-[12px] font-bold text-slate-800 w-8 md:w-10">{score}%</span>
                                       <div className="h-1.5 md:h-2 w-20 md:w-24 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                          <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${score}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            className={`h-full rounded-full ${score > 80 ? 'bg-emerald-500' : score > 60 ? 'bg-amber-400' : 'bg-rose-400'}`} 
                                          />
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 md:px-8 py-5 md:py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 transition-all">
                                       <button onClick={()=>startEdit(item)} className="p-2 md:p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Edit3 size={16} /></button>
                                       <button onClick={()=>removeProduct(item.id)} className="p-2 md:p-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                                    </div>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>

               {/* Pagination Footer */}
               <div className="p-6 md:p-8 border-t border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
                  <p className="text-[10px] md:text-[11px] font-bold text-slate-600 uppercase">
                     Catalog Density: {filteredItems.length} items active
                  </p>
                  <div className="flex items-center gap-4 md:gap-6">
                     <div className="flex items-center gap-1.5 md:gap-2">
                        <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-300 hover:bg-slate-50 transition-all">
                           <ChevronLeft size={16} />
                        </button>
                        <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-[#062d1d] text-white rounded-xl font-bold text-[10px] md:text-xs shadow-lg shadow-emerald-950/10">1</button>
                        <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-600 font-bold text-[10px] md:text-xs hover:bg-slate-50 transition-all">2</button>
                        <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50 transition-all">
                           <ChevronRight size={16} />
                        </button>
                     </div>
                     <div className="bg-white border border-slate-200 px-4 md:px-5 py-2 md:py-2.5 rounded-xl flex items-center gap-2 md:gap-3 cursor-pointer hover:border-slate-300 transition-all group">
                        <span className="text-[9px] md:text-[11px] font-bold text-slate-700 uppercase">10 PER PAGE</span>
                        <ChevronDown size={12} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                     </div>
                  </div>
               </div>

            </div>
         </div>

         {/* Tools & Strategy Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            {/* Keywords Management */}
            <div className="bg-white rounded-xl md:rounded-xl border border-slate-100 p-6 md:p-8 shadow-sm">
               <h3 className="text-xs md:text-sm font-bold text-slate-900 uppercase mb-6 md:mb-8">Search Keywords</h3>
               
               <div className="space-y-4 md:space-y-5">
                  <div className="relative group">
                     <input 
                       type="text" 
                       placeholder="e.g. Organic Soap" 
                       value={newKeyword}
                       onChange={e=>setNewKeyword(e.target.value)}
                       onKeyDown={e=>e.key === 'Enter' && addKeyword()}
                       className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs md:text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all outline-none"
                     />
                  </div>
                  <button 
                    onClick={addKeyword}
                    disabled={!newKeyword.trim()}
                    className="w-full py-3 md:py-4 bg-[#10b981]/10 text-[#10b981] rounded-xl text-[10px] md:text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#10b981] hover:text-white transition-all active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none"
                  >
                     <Plus size={16} /> Add Keyword
                  </button>
               </div>

               <div className="mt-8 md:mt-10">
                  <p className="text-[9px] md:text-[11px] font-bold text-slate-600 uppercase mb-4 md:mb-5">Current Library</p>
                  <div className="flex flex-wrap gap-2 md:gap-2.5">
                     {vendorData.keywords.length > 0 ? (
                        vendorData.keywords.map((k: any, i: number) => (
                           <div key={i} className="px-3 py-1 md:px-3.5 md:py-1.5 bg-slate-50 text-slate-700 text-[9px] md:text-[11px] font-bold rounded-xl border border-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100 transition-all flex items-center gap-2 group/tag">
                              #{typeof k === 'string' ? k : k.name}
                              <button onClick={() => removeKeyword(typeof k === 'string' ? k : k.id)} className="opacity-0 group-hover/tag:opacity-100 text-slate-400 hover:text-rose-500 transition-all"><X size={10} /></button>
                           </div>
                        ))
                     ) : (
                        <p className="text-[10px] md:text-[11px] font-medium text-slate-400 italic">No keywords indexed yet...</p>
                     )}
                  </div>
               </div>
            </div>

            {/* Visibility Tips Alert */}
            <div className="bg-slate-50 rounded-xl md:rounded-xl p-6 md:p-8 border border-slate-100 relative overflow-hidden group">
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
                        <Zap size={18} className="text-[#10b981]" />
                     </div>
                     <h3 className="text-xs md:text-sm font-bold text-slate-900 uppercase">Growth Engine</h3>
                  </div>
                  
                  <ul className="space-y-4 md:space-y-5">
                     {[
                       { text: 'Add 5+ Images', desc: 'Boosts visibility by 3x', icon: ImageIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
                       { text: 'Keyword Strategy', desc: 'Use search terms', icon: Target, color: 'text-purple-500', bg: 'bg-purple-50' },
                       { text: 'Deep Catalog', desc: 'Rich descriptions help', icon: Box, color: 'text-emerald-500', bg: 'bg-emerald-50' }
                     ].map((tip, i) => (
                       <li key={i} className="flex items-start gap-3 md:gap-4 group/tip">
                          <div className={`w-9 h-9 md:w-10 md:h-10 ${tip.bg} ${tip.color} rounded-xl flex items-center justify-center shrink-0 border border-white`}>
                             <tip.icon size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] md:text-[11px] font-bold text-slate-900 uppercase">{tip.text}</p>
                             <p className="text-[9px] md:text-[10px] font-bold text-slate-600">{tip.desc}</p>
                          </div>
                       </li>
                     ))}
                  </ul>

                  <button className="w-full py-3 md:py-4 bg-white text-slate-900 rounded-xl text-[10px] md:text-[11px] font-bold uppercase border border-slate-200 hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2">
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
