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
  Hash, 
  X,
  Target,
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
  FileText,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Upload,
  Info,
  ShoppingCart,
  Edit3,
  ChevronDown,
  Lock,
  CreditCard,
  Gem,
  Package2,
  ChevronRight
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
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto">
        <Lock className="w-9 h-9 text-amber-500" />
      </div>

      {/* Heading */}
      <div className="space-y-2 max-w-md">
        <h2 className="text-lg font-semibold text-slate-900">Subscription Required</h2>
        <p className="text-sm text-slate-700">
          Hi <span className="font-medium text-slate-800">{vendorName || 'there'}</span>, you need an active subscription to list and manage your products.
        </p>
      </div>

      {/* What you get */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 w-full max-w-md text-left  space-y-3">
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

      {/* CTA */}
      <button
        onClick={() => router.push('/vendor/billing')}
        className="flex items-center gap-2 bg-[#2e7d32] text-white px-7 py-3 rounded-xl text-sm font-medium hover:bg-[#1b5e20] transition-all "
      >
        <CreditCard className="w-4 h-4" />
        View Plans & Subscribe
        <ChevronRight className="w-4 h-4" />
      </button>

      <p className="text-sm text-slate-700">
        After subscribing, come back here to manage your products.
      </p>
    </div>
  );
}

export default function VendorProducts() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categories, setCategories] = useState<any[]>([]);
  const [hasSubscription, setHasSubscription] = useState(false);
  
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
    type: 'PRODUCT'
  });
  
  const [newKeyword, setNewKeyword] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'PRODUCT' | 'SERVICE'>('PRODUCT');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, categoriesData] = await Promise.all([
          apiFetch('/vendors/me'),
          apiFetch('/vendors/categories')
        ]);

        if (profileData && profileData.data) {
          setVendorData({
            ...profileData.data,
            products: profileData.data.products || [],
            keywords: profileData.data.keywords || []
          });
          setHasSubscription(isSubscriptionActive(profileData.data));
        }

        if (categoriesData && categoriesData.data) {
          // Filter categories to show ALL categories the vendor is registered in
          const registeredCategoryIds = profileData.data?.categories?.map((c: any) => c.id) || [];
          const filtered = categoriesData.data.filter((cat: any) => registeredCategoryIds.includes(cat.id));
          setCategories(filtered);
          
          // Set default category from the filtered list (first available)
          if (!newProduct.category && filtered.length > 0) {
             setNewProduct(prev => ({ ...prev, category: filtered[0].name }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard requirements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const products = vendorData.products.map((p: any) => ({
        name: p.name,
        description: p.description || '',
        price: parseFloat(p.price) || 0,
        category: p.category || '',
        images: Array.isArray(p.images) ? p.images : (p.imageUrl || p.image ? [p.imageUrl || p.image] : []),
        moq: parseInt(p.moq) || 1,
        availability: p.availability,
        specifications: p.specifications || '',
        type: p.type || 'PRODUCT'
      }));

      const keywords = vendorData.keywords.map((k: any) => typeof k === 'string' ? k : k.name);

      const updateData = { 
        products, 
        keywords 
      };

      const response = await apiFetch('/vendors/me', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      if (response && response.data) {
        setVendorData({
            ...response.data,
            products: response.data.products || [],
            keywords: response.data.keywords || []
        });
      }

      setMessage({ type: 'success', text: 'Ecosystem Matrix Synced!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Sync operation failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (newProduct.images.length >= 5) {
      setMessage({ type: 'error', text: 'Maximum 5 images allowed per item' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/vendors/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        setNewProduct({ ...newProduct, images: [...newProduct.images, data.data.url] });
        setMessage({ type: 'success', text: 'Visual asset uploaded' });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Upload failed: ' + error.message });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const removeImage = (index: number) => {
    setNewProduct({
      ...newProduct,
      images: newProduct.images.filter((_, i) => i !== index)
    });
  };

  const saveProduct = async () => {
    if (!newProduct.name.trim()) return;
    
    setSaving(true);
    try {
      const payload = {
          ...newProduct,
          type: activeTab,
      };

      let response;
      if (editingId) {
        response = await apiFetch(`/vendors/products/${editingId}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
      } else {
        response = await apiFetch('/vendors/products', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
      }

      if (response && response.data) {
          if (editingId) {
            setVendorData({
                ...vendorData,
                products: vendorData.products.map((p: any) => p.id === editingId ? response.data : p)
            });
          } else {
            setVendorData({
                ...vendorData,
                products: [response.data, ...vendorData.products]
            });
          }
          
          setNewProduct({ 
              name: '', description: '', price: '', 
              category: (vendorData.categories && vendorData.categories[0]?.name) || categories[0]?.name || '', 
              images: [], moq: '1', availability: true, specifications: '',
              type: activeTab
          });
          setShowProductForm(false);
          setEditingId(null);
          setMessage({ type: 'success', text: `Offering ${editingId ? 'updated' : 'indexed'} successfully` });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Action failed: ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this offering?')) return;
    
    try {
      await apiFetch(`/vendors/products/${id}`, { method: 'DELETE' });
      setVendorData({
        ...vendorData,
        products: vendorData.products.filter((p: any) => p.id !== id)
      });
      setMessage({ type: 'success', text: 'Offering removed from matrix' });
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Delete operation failed' });
    }
  };

  const startEdit = (product: any) => {
    setNewProduct({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || categories[0]?.name || '',
        images: Array.isArray(product.images) ? product.images : (product.imageUrl || product.image ? [product.imageUrl || product.image] : []),
        moq: product.moq?.toString() || '1',
        availability: product.availability !== undefined ? product.availability : true,
        specifications: product.specifications || '',
        type: product.type || activeTab
    });
    setEditingId(product.id);
    setShowProductForm(true);
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
      keywords: vendorData.keywords.filter((k: any) => k.id !== id)
    });
  };

  if (loading) return (
    <div className="p-12 space-y-8 animate-pulse">
       <div className="h-40 bg-slate-100 rounded-3xl w-full"></div>
       <div className="grid grid-cols-5 gap-8">
          <div className="col-span-3 h-96 bg-slate-50 rounded-3xl"></div>
          <div className="col-span-2 h-96 bg-slate-50 rounded-3xl"></div>
       </div>
    </div>
  );

  // ── Subscription Gate ──
  if (!hasSubscription) {
    return <SubscriptionGate vendorName={vendorData?.businessName || ''} />;
  }

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Simple Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
               Products & Services
            </h1>
            <p className="text-slate-700 font-medium text-sm">Manage your catalog items and visibility settings</p>
        </div>
        
        <button 
            onClick={handleUpdate}
            disabled={saving}
            className="px-6 py-2.5 bg-[#164e33] text-white rounded-xl font-medium text-sm flex items-center gap-2 disabled:opacity-50 hover:bg-[#113f29] transition-all "
        >
            {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Main Catalog View */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 ">
                <div className="flex items-center justify-between border-b border-gray-50 pb-6 mb-6">
                    <div className="flex items-center gap-8">
                        <button 
                            onClick={() => { setActiveTab('PRODUCT'); setShowProductForm(false); }}
                            className={`text-sm font-semibold transition-all relative pb-2 ${activeTab === 'PRODUCT' ? 'text-slate-900' : 'text-slate-700 hover:text-slate-800'}`}
                        >
                            Products
                            {activeTab === 'PRODUCT' && <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#164e33] rounded-full" />}
                        </button>
                        <button 
                            onClick={() => { setActiveTab('SERVICE'); setShowProductForm(false); }}
                            className={`text-sm font-semibold transition-all relative pb-2 ${activeTab === 'SERVICE' ? 'text-slate-900' : 'text-slate-700 hover:text-slate-800'}`}
                        >
                            Services
                            {activeTab === 'SERVICE' && <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#164e33] rounded-full" />}
                        </button>
                    </div>

                    {!showProductForm && (
                        <button 
                            onClick={() => {
                                setNewProduct(prev => ({ 
                                    ...prev, 
                                    type: activeTab, 
                                    category: (vendorData.categories && vendorData.categories[0]?.name) || categories[0]?.name || '' 
                                }));
                                setShowProductForm(true);
                            }}
                            className="bg-[#164e33]/5 text-[#164e33] px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-100 transition-all text-sm font-semibold"
                        >
                            <Plus className="w-4 h-4" /> Add Item
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {showProductForm && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gray-50 rounded-xl border border-gray-100 mb-8 overflow-hidden"
                        >
                            <div className="p-6 space-y-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                   <h3 className="text-sm font-semibold text-slate-800">Add New {activeTab === 'PRODUCT' ? 'Product' : 'Service'}</h3>
                                   <button onClick={() => { setShowProductForm(false); setEditingId(null); }} className="p-2 text-slate-700 hover:text-red-500 rounded-lg hover:bg-red-50"><X className="w-4 h-4" /></button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-slate-700">Images ({newProduct.images.length}/5)</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {newProduct.images.map((img, idx) => (
                                                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 group">
                                                    <img src={img} className="w-full h-full object-cover" />
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            
                                            {newProduct.images.length < 5 && (
                                                <div 
                                                    className="aspect-video bg-white border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:bg-gray-50 transition-colors" 
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <div className="text-center space-y-1">
                                                       <Upload className="w-5 h-5 text-gray-500 mx-auto" />
                                                       <span className="text-sm font-semibold text-slate-700">Add Image</span>
                                                    </div>
                                                    {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><RefreshCcw className="w-4 h-4 animate-spin text-[#164e33]" /></div>}
                                                </div>
                                            )}
                                        </div>
                                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Name</label>
                                            <input 
                                                type="text" 
                                                value={newProduct.name}
                                                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                                placeholder="Item name..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Price (INR)</label>
                                            <input 
                                                type="number" 
                                                value={newProduct.price}
                                                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Category</label>
                                            <select 
                                                value={newProduct.category}
                                                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                   <div className="space-y-2">
                                      <label className="text-sm font-semibold text-slate-700">Description</label>
                                      <textarea 
                                          value={newProduct.description}
                                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 min-h-[80px]"
                                          placeholder="Detailed description..."
                                      />
                                   </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button 
                                      onClick={() => { setShowProductForm(false); setEditingId(null); }}
                                      className="px-5 py-2.5 bg-white border border-gray-200 text-slate-800 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
                                    >
                                      Cancel
                                    </button>
                                    <button 
                                        onClick={saveProduct}
                                        className="px-5 py-2.5 bg-[#164e33] text-white rounded-xl font-semibold text-sm hover:bg-[#113f29] transition-all "
                                    >
                                        {editingId ? 'Update Item' : 'Save Item'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-4">
                    {vendorData.products.filter((p: any) => (p.type || 'PRODUCT') === activeTab).map((p: any) => (
                        <div key={p.id} className="group relative flex items-start gap-5 p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover: transition-all">
                             <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                {p.images && p.images.length > 0 ? (
                                    <img src={p.images[0]} className="w-full h-full object-cover" />
                                ) : p.imageUrl || p.image ? (
                                    <img src={p.imageUrl || p.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-50">
                                       {activeTab === 'PRODUCT' ? <Box className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                                    </div>
                                )}
                             </div>

                             <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 truncate">{p.name}</h4>
                                        <p className="text-sm font-medium text-slate-700 mt-0.5">₹{p.price || '--'}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEdit(p)} className="p-2 bg-gray-50 text-slate-700 rounded-xl hover:text-[#164e33] hover:bg-[#164e33]/5 transition-all"><Edit3 className="w-4 h-4" /></button>
                                        <button onClick={() => removeProduct(p.id)} className="p-2 bg-gray-50 text-slate-700 rounded-xl hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm font-semibold text-[#164e33] bg-[#164e33]/5 px-2 py-0.5 rounded-md">
                                       {p.category || 'Uncategorized'}
                                    </span>
                                    <div className={`px-2 py-0.5 rounded-md text-sm font-semibold ${p.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                       {p.status || 'PENDING'}
                                    </div>
                                </div>
                             </div>
                        </div>
                    ))}

                    {vendorData.products.filter((p: any) => (p.type || 'PRODUCT') === activeTab).length === 0 && !showProductForm && (
                        <div className="py-16 text-center">
                           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                             {activeTab === 'PRODUCT' ? <Box className="w-6 h-6 text-gray-500" /> : <Layers className="w-6 h-6 text-gray-500" />}
                           </div>
                           <h4 className="text-sm font-semibold text-slate-900 mb-1">No items found</h4>
                           <p className="text-sm font-medium text-slate-700">Click "Add Item" to start building your catalog.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">

            {/* Keywords Card */}
            <div className="bg-white rounded-xl border border-gray-200 ">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">Keywords</h3>
                        {vendorData.keywords.length > 0 && (
                            <span className="text-sm bg-blue-100 text-[#164e33] px-1.5 py-0.5 rounded-full font-medium">
                                {vendorData.keywords.length}
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-4 space-y-3">
                    {/* Input */}
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                            placeholder="Add keyword..."
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-700 outline-none focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
                        />
                        <button
                            onClick={addKeyword}
                            disabled={!newKeyword.trim()}
                            className="w-full py-2 bg-[#164e33] text-white text-sm font-medium rounded-xl hover:bg-[#113f29] transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add Keyword
                        </button>
                    </div>

                    {/* Tags */}
                    {vendorData.keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-100">
                            {vendorData.keywords.map((k: any) => (
                                <div key={k.id} className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-slate-800 rounded-md text-sm">
                                    <span>#{typeof k === 'string' ? k : k.name}</span>
                                    <button onClick={() => removeKeyword(k.id)} className="text-slate-700 hover:text-red-500 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-700 text-center py-1">No keywords yet. Add some to improve visibility.</p>
                    )}
                </div>
            </div>

            {/* Visibility Tips */}
            <div className="bg-green-50 rounded-2xl border border-green-100 p-4">
                <div className="flex items-center gap-2 mb-2.5">
                    <Info className="w-4 h-4 text-green-600 shrink-0" />
                    <h4 className="text-sm font-semibold text-green-800">Visibility Tips</h4>
                </div>
                <div className="space-y-1.5">
                    {[
                        'Add 5+ images for 3x more leads',
                        'Use buyer search terms as keywords',
                        'Write detailed descriptions',
                    ].map(tip => (
                        <div key={tip} className="flex items-start gap-1.5 text-sm text-green-700">
                            <span className="w-1 h-1 rounded-full bg-green-400 mt-1.5 shrink-0" />
                            {tip}
                        </div>
                    ))}
                </div>
            </div>

        </div>

      </div>


      <AnimatePresence>
        {message.text && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`fixed bottom-6 right-6 p-4 rounded-xl border z-[100] flex items-center gap-3  ${ message.type === 'success' ? 'bg-white text-green-700 border-green-200' : 'bg-white text-red-700 border-red-200' }`}
            >
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                <p className="text-sm font-semibold">{message.text}</p>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



