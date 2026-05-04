'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Plus, 
  Trash2, 
  Layers, 
  Search,
  LayoutGrid,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [adding, setAdding] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const header = document.getElementById('main-dashboard-header');
    if (header) {
      if (isAddModalOpen || isDeleteConfirmOpen) {
        header.style.opacity = '0';
        header.style.pointerEvents = 'none';
      } else {
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
      }
    }
  }, [isAddModalOpen, isDeleteConfirmOpen]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/admin/categories');
      setCategories(data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setAdding(true);
    try {
      const data = await apiFetch('/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name: newCatName })
      });
      setCategories([...categories, data.data]);
      setNewCatName('');
      setMessage({ type: 'success', text: 'Market category added successfully.' });
      setIsAddModalOpen(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add category. It might already exist.' });
    } finally {
      setAdding(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/admin/categories/${id}`, { method: 'DELETE' });
      setCategories(categories.filter(c => c.id !== id));
      setMessage({ type: 'success', text: 'Category removed successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove category.' });
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0 font-medium">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
            Industry Categories
            <div className="p-1.5 bg-[#164e33]/5 text-[#164e33] rounded-xl border border-[#164e33]/10">
              <Layers className="w-5 h-5" />
            </div>
          </h1>
          <p className="text-slate-700 font-medium mt-1 text-base">Organize and manage the business categories in your hub.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {/* Search Input */}
           <div className="relative w-full md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search categories..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-semibold outline-none focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/5 transition-all shadow-sm"
              />
           </div>

           <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-[#164e33] hover:bg-[#113f29] text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-[#164e33]/10 transition-all active:scale-95 whitespace-nowrap text-base"
           >
             <Plus className="w-5 h-5" />
             New Category
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* ADD CATEGORY MODAL */}
        <AnimatePresence>
          {isAddModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => { if (!adding) setIsAddModalOpen(false); }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 z-[110]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-[#164e33]/5 text-[#164e33] rounded-2xl flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Add New Industry</h3>
                <p className="text-base text-slate-500 font-medium mb-6">Define a new category for vendors to join in your hub.</p>
                
                <form onSubmit={handleAdd}>
                  <div className="space-y-5">
                    <div className="space-y-2">
                       <label className="text-base font-semibold text-slate-500 uppercase  ml-1">Category Title</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Chemical Manufacturing" 
                         value={newCatName}
                         required
                         autoFocus
                         onChange={(e) => setNewCatName(e.target.value)}
                         className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl text-base font-semibold focus:bg-white focus:border-[#164e33]/20 transition-all outline-none"
                       />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={adding || !newCatName.trim()}
                      className="w-full py-4 bg-[#164e33] hover:bg-[#113f29] text-white rounded-xl font-semibold shadow-lg shadow-[#164e33]/10 transition-all disabled:opacity-50"
                    >
                      {adding ? "Initializing..." : "Create Category"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-base font-semibold shadow-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}
            >
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1,2,3,4,5,6].map(i => <div key={i} className="h-24 bg-gray-50 border border-gray-100 rounded-xl animate-pulse"></div>)
          ) : categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? (
            categories
              .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((cat, idx) => (
              <motion.div 
                key={cat.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-[#164e33]/20 hover:shadow-xl hover:shadow-[#164e33]/5 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
<div>
                    <h3 className="text-base font-semibold text-slate-900 capitalize leading-tight">{cat.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                       <p className="text-base font-semibold text-slate-500 uppercase ">Active Market</p>
                    </div>
                  </div>
                </div>
                
                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setSelectedCatId(cat.id);
                        setIsDeleteConfirmOpen(true);
                      }}
                      className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
               </motion.div>
             ))
           ) : (
             <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                <LayoutGrid className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-500 ">No Markets Found</h3>
                <p className="text-base font-medium text-gray-300 max-w-xs mx-auto mt-2">Try adjusting your search or add a new industry classification to your hub.</p>
             </div>
           )}
         </div>
       </div>

       {/* Confirmation Modal for Deletion */}
       <AnimatePresence>
         {isDeleteConfirmOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => {
                 setIsDeleteConfirmOpen(false);
                 setSelectedCatId(null);
               }}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="relative bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl border border-gray-100"
             >
               <div className="w-16 h-16 bg-red-50 text-red-600 rounded-[1.5rem] flex items-center justify-center mb-6 border border-red-100">
                 <AlertCircle className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-semibold text-slate-900 mb-2">Remove Industry?</h3>
               <p className="text-base text-slate-500 font-medium mb-8 leading-relaxed">
                 Are you sure you want to remove this category? Any vendors currently classified under this category will lose their industry association.
               </p>
               <div className="flex flex-col gap-3">
                 <button 
                   onClick={() => {
                     if (selectedCatId) handleDelete(selectedCatId);
                     setIsDeleteConfirmOpen(false);
                     setSelectedCatId(null);
                   }}
                   className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-semibold shadow-lg shadow-red-50 transition-all"
                 >
                   Yes, Remove Market
                 </button>
                 <button 
                   onClick={() => {
                     setIsDeleteConfirmOpen(false);
                     setSelectedCatId(null);
                   }}
                   className="w-full py-4 bg-gray-50 text-slate-700 rounded-2xl font-semibold hover:bg-gray-100 transition-all"
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



