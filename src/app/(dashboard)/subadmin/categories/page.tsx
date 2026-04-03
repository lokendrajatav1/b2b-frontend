'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Plus, 
  Trash2, 
  Layers, 
  ChevronRight, 
  Search,
  LayoutGrid,
  Info,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  Edit2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubAdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

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
      setMessage({ type: 'success', text: 'New category added to the marketplace.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add category. Try again later.' });
    } finally {
      setAdding(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure? Removing this category might affect vendors currently assigned to it.')) return;
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
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Humanized Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">
              <Sparkles className="w-3 h-3" /> Team Workspace
           </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
             Industry Categories
             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
               <Layers className="w-5 h-5" />
             </div>
          </h1>
          <p className="text-gray-500 font-medium text-sm">Manage how businesses and products are classified on the platform.</p>
        </div>

        <form onSubmit={handleAdd} className="flex items-center gap-3">
          <div className="relative">
             <input 
               type="text" 
               placeholder="Enter category name..." 
               value={newCatName}
               onChange={(e) => setNewCatName(e.target.value)}
               className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-blue-500 transition-all w-64 shadow-sm"
             />
          </div>
          <button 
             type="submit" 
             disabled={adding || !newCatName}
             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-blue-50 flex items-center gap-2"
          >
            {adding ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add New
          </button>
        </form>
      </div>

      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-3xl border flex items-center gap-3 text-sm font-bold shadow-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}
            >
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1,2,3,4,5,6].map(i => <div key={i} className="h-24 bg-gray-50 border border-gray-100 rounded-3xl animate-pulse"></div>)
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <motion.div 
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 capitalize">{cat.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Classification Hub</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => handleDelete(cat.id)}
                     className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/50">
               <LayoutGrid className="w-12 h-12 text-gray-200 mx-auto mb-4" />
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No categories listed yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
