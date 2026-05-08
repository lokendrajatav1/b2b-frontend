'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Building2, 
  MapPin, 
  Tag, 
  Globe, 
  Image as ImageIcon, 
  Save, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Briefcase,
  Activity,
  Award,
  RefreshCcw,
  Box,
  Linkedin,
  Instagram,
  Facebook,
  Upload,
  FileText,
  Mail,
  Phone,
  CreditCard,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function SimpleVendorProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [vendorData, setVendorData] = useState<any>({
    businessName: '',
    email: '',
    phone: '',
    city: '',
    categoryIds: [],
    description: '',
    address: '',
    gstNumber: '',
    aadhaarNumber: '',
    logoUrl: '',
    socialLinks: {},
    googleBusinessLink: '',
    workingHours: '',
    verified: false
  });
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [initialSync, setInitialSync] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user && !initialSync) {
      setVendorData((prev: any) => ({
        ...prev,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
      setInitialSync(true);
    }
  }, [user, initialSync]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiFetch('/vendors/me');
        if (res.data) {
          setVendorData({
              ...res.data,
              categoryIds: res.data.categories?.map((c: any) => c.id) || []
          });
        }
      } catch (error: any) {
        if (error.status !== 404) console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await apiFetch('/vendors/categories');
        if (res && res.data) {
           setCategories(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    if (user) {
      fetchProfile();
      fetchCategories();
    } else {
      setLoading(false);
    }
  }, [user?.id]);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'DOCUMENT' | 'LOGO' = 'DOCUMENT') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (type === 'LOGO') setUploadingLogo(true);
    else setUploadingFile(true);

    const formData = new FormData();
    formData.append('image', file); 

    try {
      const res = await apiFetch('/vendors/upload-image', {
        method: 'POST',
        body: formData,
        isMultipart: true 
      });
      
      if (type === 'LOGO') {
        setVendorData((prev: any) => ({ ...prev, logoUrl: res.data.url }));
        setMessage({ type: 'success', text: 'Business logo uploaded successfully!' });
      } else {
        setVendorData((prev: any) => ({ ...prev, verificationDocument: res.data.url }));
        setMessage({ type: 'success', text: 'Document uploaded successfully!' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Upload failed: ' + error.message });
    } finally {
      setUploadingLogo(false);
      setUploadingFile(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const isNew = !vendorData.id;
      
      if (isNew) {
        const { 
            businessName, email, phone, gstNumber, aadhaarNumber, 
            city, categoryIds, description, address, socialLinks, 
            googleBusinessLink, workingHours 
        } = vendorData;

        if (!businessName || !email || !phone || !gstNumber || !aadhaarNumber || !city || !categoryIds?.length) {
           throw new Error('Please fill in all mandatory identity fields and selected at least one business category.');
        }

        const registrationData = {
            businessName, email, phone, gstNumber, aadhaarNumber,
            city, categoryIds, description, address, socialLinks,
            googleBusinessLink, workingHours, verificationDocument: vendorData.verificationDocument,
            logoUrl: vendorData.logoUrl
        };

        const res = await apiFetch('/vendors/register-vendor', {
          method: 'POST',
          body: JSON.stringify(registrationData),
        });
        setVendorData({
          ...res.data,
          categoryIds: res.data.categories?.map((c: any) => c.id) || []
        });
        setMessage({ type: 'success', text: 'Profile created! Under review.' });
      } else {
        const { 
          businessName, description, address, socialLinks, 
          googleBusinessLink, workingHours, categoryIds,
          gstNumber, aadhaarNumber, verificationDocument, logoUrl
        } = vendorData;
        
        const updateData = { 
          businessName, description, address, socialLinks, 
          googleBusinessLink, workingHours, categoryIds,
          gstNumber, aadhaarNumber, verificationDocument, logoUrl
        };

        const res = await apiFetch('/vendors/me', {
          method: 'PUT',
          body: JSON.stringify(updateData),
        });
        setVendorData({
          ...res.data,
          categoryIds: res.data.categories?.map((c: any) => c.id) || []
        });
        setMessage({ type: 'success', text: 'Profile synced successfully!' });
      }
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to sync identity' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 animate-pulse">
      <div className="flex justify-between items-center pb-6 border-b border-gray-100">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-96 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[400px] bg-white border border-gray-100 rounded-xl"></div>
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-white border border-gray-100 rounded-xl"></div>
          <div className="h-64 bg-white border border-gray-100 rounded-xl"></div>
        </div>
      </div>
    </div>
  );

  if (!user && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-4">
           <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Authentication Required</h2>
        <p className="text-slate-600 mt-2">Please login to access your business profile settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-simple-fade pb-20 p-2 lg:p-6">
      {/* Small Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <div>
            <h1 className="text-2xl font-semibold text-slate-900 ">Business Profile</h1>
            <p className="text-sm text-slate-700 font-medium mt-1">Manage your public business details.</p>
        </div>
        
        <button 
            onClick={handleUpdate}
            disabled={saving}
            className="px-5 py-2.5 bg-[#164e33] text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-[#113f29] transition-colors disabled:opacity-50 "
        >
            {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile
        </button>
      </div>

      <AnimatePresence mode="wait">
        {message.text && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl border text-sm font-semibold flex items-center gap-2 ${ message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100' }`}
            >
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message.text}
            </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Section 1: Identity - Spans 2 Columns */}
        <section className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 space-y-6  lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 border-b border-gray-50 pb-4">
                <Building2 className="w-4 h-4 text-[#164e33]" /> Basic Information
            </h3>

            {/* Profile/Logo Upload Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-gray-50">
               <div className="relative group">
                  <div className="w-24 h-24 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative transition-all group-hover:border-blue-300">
                    {vendorData.logoUrl ? (
                      <img src={vendorData.logoUrl} alt="Business Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-gray-500 mx-auto" />
                        <span className="text-sm text-slate-700 font-semibold uppercase mt-1 block">Logo</span>
                      </div>
                    )}
                    
                    {uploadingLogo && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <RefreshCcw className="w-5 h-5 text-[#164e33] animate-spin" />
                      </div>
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-white  border border-gray-100 p-2 rounded-xl text-[#164e33] hover:bg-[#164e33]/5 transition-all hover:scale-110"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <input 
                    type="file" 
                    ref={logoInputRef}
                    onChange={(e) => handleFileUpload(e, 'LOGO')}
                    className="hidden" 
                    accept="image/*"
                  />
               </div>
               <div className="text-center md:text-left">
                  <h4 className="text-sm font-semibold text-slate-900">Business Logo</h4>
                  <p className="text-sm text-slate-700 mt-1 leading-relaxed">This logo will be displayed on your <br /> public profile and search results.</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                         <Building2 className="w-3.5 h-3.5 text-[#164e33] opacity-60" /> Company Name
                    </label>
                    <input 
                        type="text" 
                        value={vendorData.businessName}
                        onChange={(e) => setVendorData({...vendorData, businessName: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all"
                    />
                </div>
                <div className="md:col-span-2 space-y-2.5 relative" ref={dropdownRef}>
                    <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-[#164e33]" /> Business Categories
                    </label>
                    
                    {/* Selected Tags Display */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {vendorData.categoryIds?.map((id: any) => {
                            const cat: any = Array.isArray(categories) ? categories.find((c: any) => c.id === id) : null;
                            if (!cat) return null;
                            return (
                                <motion.span 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    key={id}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#164e33]/5 text-slate-800 border border-[#164e33]/10 rounded-full text-sm font-semibold"
                                >
                                    {cat.name}
                                    <button 
                                        type="button"
                                        onClick={() => setVendorData({
                                            ...vendorData, 
                                            categoryIds: vendorData.categoryIds.filter((cid: any) => cid !== id)
                                        })}
                                        className="hover:bg-blue-200 rounded-full p-0.5"
                                    >
                                        <AlertCircle className="w-3 h-3 rotate-45" />
                                    </button>
                                </motion.span>
                            );
                        })}
                    </div>

                    {/* Search Input Toggle */}
                    <div className="relative group">
                        <input 
                            type="text" 
                            placeholder="Search and select categories..."
                            value={searchTerm}
                            onClick={() => setIsDropdownOpen(true)}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setIsDropdownOpen(true);
                            }}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all"
                        />
                        <button 
                           type="button"
                           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                           className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700"
                        >
                            <Box className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* THE DROPDOWN LIST */}
                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl  z-50 max-h-60 overflow-y-auto p-2"
                                >
                                    {Array.isArray(categories) && categories
                                        .filter((c: any) => c.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((c: any) => {
                                            const isSelected = vendorData.categoryIds?.includes(c.id);
                                            return (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => {
                                                        const current = vendorData.categoryIds || [];
                                                        const next = isSelected 
                                                            ? current.filter((id: any) => id !== c.id)
                                                            : [...current, c.id];
                                                        setVendorData({...vendorData, categoryIds: next});
                                                        setSearchTerm('');
                                                    }}
                                                    className={`w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold transition-all flex items-center justify-between group ${
                                                        isSelected 
                                                        ? 'bg-[#164e33]/5 text-slate-800' 
                                                        : 'hover:bg-gray-50 text-slate-800'
                                                    }`}
                                                >
                                                    {c.name}
                                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#164e33]" />}
                                                </button>
                                            );
                                        })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                        <Mail className="w-3.5 h-3.5 text-[#164e33] opacity-60" /> Business Email
                    </label>
                    <input 
                        type="email" 
                        value={vendorData.email}
                        onChange={(e) => setVendorData({...vendorData, email: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all "
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                         <Phone className="w-3.5 h-3.5 text-[#164e33] opacity-60" /> Official Mobile
                    </label>
                    <input 
                        type="tel" 
                        value={vendorData.phone}
                        onChange={(e) => setVendorData({...vendorData, phone: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all "
                    />
                </div>
                
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                        <Tag className="w-3.5 h-3.5 text-[#164e33] opacity-60" /> GST Number (Optional)
                    </label>
                    <input 
                        type="text" 
                        value={vendorData.gstNumber}
                        onChange={(e) => setVendorData({...vendorData, gstNumber: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all "
                    />
                </div>
                
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                        <CreditCard className="w-3.5 h-3.5 text-[#164e33] opacity-60" /> Aadhaar / ID Number
                    </label>
                    <input 
                        type="text" 
                        value={vendorData.aadhaarNumber}
                        onChange={(e) => setVendorData({...vendorData, aadhaarNumber: e.target.value})}
                        maxLength={12}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all "
                    />
                </div>
            </div>
        </section>

        {/* Section 2: Verification Documents - Spans 1 Column */}
        <section className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 space-y-6 ">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 border-b border-gray-50 pb-4">
                <Box className="w-4 h-4 text-[#164e33]" /> Verification Docs
            </h3>
            
            <div className="space-y-5">
                <div className="pt-2">
                    <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mb-3">
                         <Upload className="w-3.5 h-3.5 text-[#164e33] opacity-60" /> JPG/PNG Proof
                    </label>
                    
                    <div className="p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center gap-3 text-center">
                            {!vendorData.verificationDocument ? (
                                <>
                                    <div className="p-2.5 bg-[#164e33]/5 text-[#164e33] rounded-full">
                                        <Upload className="w-4 h-4" />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingFile}
                                        className="px-4 py-2 bg-[#164e33] text-white rounded-lg text-sm font-semibold uppercase  hover:bg-[#113f29] transition-all disabled:opacity-50"
                                    >
                                        {uploadingFile ? "Uploading..." : "Select File"}
                                    </button>
                                </>
                            ) : (
                                <div className="w-full space-y-3">
                                    <div className="flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-xl">
                                        <FileText className="w-3.5 h-3.5 text-[#164e33] shrink-0" />
                                        <p className="text-sm font-semibold text-slate-700 truncate ml-2">Verification_Proof</p>
                                        <button 
                                           onClick={() => setVendorData({ ...vendorData, verificationDocument: '' })}
                                           className="ml-auto p-1 text-slate-700 hover:text-red-500"
                                        >
                                            <AlertCircle className="w-3.5 h-3.5 rotate-45" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button type="button" onClick={() => setIsPreviewOpen(true)} className="py-2 bg-gray-100 text-slate-800 rounded-lg text-sm font-semibold uppercase flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                                            View
                                        </button>
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="py-2 bg-[#164e33]/5 text-[#164e33] rounded-lg text-sm font-semibold uppercase flex items-center justify-center hover:bg-blue-100 transition-colors">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 3: Connectivity - Full Width Below or Side? Spans 3 columns */}
        <section className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 space-y-6  lg:col-span-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 border-b border-gray-50 pb-4">
                <Globe className="w-4 h-4 text-[#164e33]" /> Professional Presence & Description
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                        <Linkedin className="w-3.5 h-3.5 text-slate-800" /> LinkedIn
                    </label>
                    <input 
                        type="text" 
                        value={vendorData.socialLinks?.linkedin || ''}
                        onChange={(e) => setVendorData({
                            ...vendorData, socialLinks: { ...vendorData.socialLinks, linkedin: e.target.value }
                        })}
                        placeholder="Profile URL"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                        <Instagram className="w-3.5 h-3.5 text-pink-600" /> Instagram
                    </label>
                    <input 
                        type="text" 
                        value={vendorData.socialLinks?.instagram || ''}
                        onChange={(e) => setVendorData({
                            ...vendorData, socialLinks: { ...vendorData.socialLinks, instagram: e.target.value }
                        })}
                        placeholder="Profile URL"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                        <Facebook className="w-3.5 h-3.5 text-[#164e33]" /> Facebook
                    </label>
                    <input 
                        type="text" 
                        value={vendorData.socialLinks?.facebook || ''}
                        onChange={(e) => setVendorData({
                            ...vendorData, socialLinks: { ...vendorData.socialLinks, facebook: e.target.value }
                        })}
                        placeholder="Page URL"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-emerald-600" /> G-Business
                    </label>
                    <input 
                        type="text" 
                        value={vendorData.googleBusinessLink || ''}
                        onChange={(e) => setVendorData({ ...vendorData, googleBusinessLink: e.target.value })}
                        placeholder="Map Link"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all "
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-700" /> Presence City
                            </label>
                            <input 
                                type="text" 
                                value={vendorData.city}
                                onChange={(e) => setVendorData({...vendorData, city: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-700" /> Office Hours
                            </label>
                            <input 
                                type="text" 
                                value={vendorData.workingHours}
                                onChange={(e) => setVendorData({...vendorData, workingHours: e.target.value})}
                                placeholder="e.g. 9:00 AM - 6:00 PM"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                            Physical Address
                        </label>
                        <textarea 
                            value={vendorData.address}
                            onChange={(e) => setVendorData({...vendorData, address: e.target.value})}
                            rows={3}
                            placeholder="Enter your full business/office address..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all resize-none "
                        />
                    </div>
                </div>
                <div className="space-y-4">
                     <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-800">Mission & Descriptions</label>
                        <textarea 
                            value={vendorData.description}
                            onChange={(e) => setVendorData({...vendorData, description: e.target.value})}
                            rows={6}
                            placeholder="Tell buyers about your marketplace expertise..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-sm transition-all resize-none "
                        />
                    </div>
                </div>
            </div>
        </section>
      </div>

      <AnimatePresence>
        {isPreviewOpen && vendorData.verificationDocument && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl  overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#164e33]" />
                  Document Verification Proof
                </h3>
                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 text-slate-700 hover:text-slate-800 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-gray-50 flex items-center justify-center min-h-[500px]">
                {vendorData.verificationDocument.match(/\.(jpg|jpeg|png|webp)/i) ? (
                  <img src={vendorData.verificationDocument} alt="Verification Proof" className="max-w-full max-h-full object-contain rounded-lg " />
                ) : (
                  <iframe src={vendorData.verificationDocument} className="w-full h-full rounded-lg  border-0" title="Verification PDF Proof" />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}



