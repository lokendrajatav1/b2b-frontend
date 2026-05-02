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
    const fetchData = async () => {
      try {
        const [profileData, catsData] = await Promise.all([
          apiFetch('/vendors/me').catch(err => {
            if (err.status === 404) return { data: null };
            throw err;
          }),
          apiFetch('/vendors/categories')
        ]);
        
        if (profileData.data) {
          setVendorData({
              ...profileData.data,
              categoryIds: profileData.data.categories?.map((c: any) => c.id) || []
          });
        } else if (user) {
          setVendorData((prev: any) => ({
              ...prev,
              email: user.email || '',
              phone: user.phone || '',
          }));
        }
        setCategories(catsData.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);
  
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

  if (loading) return <div className="p-10 animate-pulse bg-slate-50 rounded-2xl h-80 border border-slate-100"></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-simple-fade pb-20 p-2 lg:p-6">
      {/* Small Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <div>
            <h1 className="text-2xl font-semibold text-slate-900 ">Business Profile</h1>
            <p className="text-base text-slate-700 font-medium mt-1">Manage your public business details.</p>
        </div>
        
        <button 
            onClick={handleUpdate}
            disabled={saving}
            className="px-5 py-2.5 bg-[#007367] text-white rounded-none font-semibold text-base flex items-center gap-2 hover:bg-[#005e54] transition-colors disabled:opacity-50 shadow-sm"
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
                className={`p-4 rounded-xl border text-base font-semibold flex items-center gap-2 ${ message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100' }`}
            >
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message.text}
            </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Section 1: Identity - Spans 2 Columns */}
        <section className="bg-white p-6 md:p-8 rounded-none border border-gray-100 space-y-6 shadow-sm lg:col-span-2">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-gray-50 pb-4">
                <Building2 className="w-4 h-4 text-[#007367]" /> Basic Information
            </h3>

            {/* Profile/Logo Upload Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-gray-50">
               <div className="relative group">
                  <div className="w-24 h-24 rounded-none bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative transition-all group-hover:border-blue-300">
                    {vendorData.logoUrl ? (
                      <img src={vendorData.logoUrl} alt="Business Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-gray-300 mx-auto" />
                        <span className="text-base text-slate-500 font-semibold uppercase mt-1 block">Logo</span>
                      </div>
                    )}
                    
                    {uploadingLogo && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <RefreshCcw className="w-5 h-5 text-[#007367] animate-spin" />
                      </div>
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-white shadow-lg border border-gray-100 p-2 rounded-none text-[#007367] hover:bg-[#007367]/5 transition-all hover:scale-110"
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
                  <h4 className="text-base font-semibold text-slate-900">Business Logo</h4>
                  <p className="text-base text-slate-700 mt-1 leading-relaxed">This logo will be displayed on your <br /> public profile and search results.</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-base font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                         <Building2 className="w-3.5 h-3.5 text-[#007367] opacity-60" /> Company Name
                    </label>
                    <input 
                        type="text" 
                        value={vendorData.businessName}
                        onChange={(e) => setVendorData({...vendorData, businessName: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-base transition-all"
                    />
                </div>
                <div className="md:col-span-2 space-y-2.5 relative" ref={dropdownRef}>
                    <label className="text-base font-semibold text-slate-800 flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-[#007367]" /> Business Categories
                    </label>
                    
                    {/* Selected Tags Display */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {vendorData.categoryIds?.map((id: any) => {
                            const cat: any = categories.find((c: any) => c.id === id);
                            if (!cat) return null;
                            return (
                                <motion.span 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    key={id}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#007367]/5 text-slate-800 border border-[#007367]/10 rounded-full text-base font-semibold"
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
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-base transition-all"
                        />
                        <button 
                           type="button"
                           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                           className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
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
                                    className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-none shadow-xl z-50 max-h-60 overflow-y-auto p-2"
                                >
                                    {categories
                                        .filter((c: any) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
                                                    className={`w-full px-4 py-2.5 rounded-xl text-left text-base font-semibold transition-all flex items-center justify-between group ${
                                                        isSelected 
                                                        ? 'bg-[#007367]/5 text-slate-800' 
                                                        : 'hover:bg-gray-50 text-slate-800'
                                                    }`}
                                                >
                                                    {c.name}
                                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#007367]" />}
                                                </button>
                                            );
                                        })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-base font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                        <Mail className="w-3.5 h-3.5 text-[#007367] opacity-60" /> Business Email
                    </label>
                    <input 
                        type="email" 
                        value={vendorData.email}
                        onChange={(e) => setVendorData({...vendorData, email: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-base transition-all shadow-xs"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-base font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                         <Phone className="w-3.5 h-3.5 text-[#007367] opacity-60" /> Official Mobile
                    </label>
                    <input 
                        type="tel" 
                        value={vendorData.phone}
                        onChange={(e) => setVendorData({...vendorData, phone: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-base transition-all shadow-xs"
                    />
                </div>
                
                <div className="space-y-1.5">
                    <label className="text-base font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                        <Tag className="w-3.5 h-3.5 text-[#007367] opacity-60" /> GST Number (Optional)
                    </label>
                    <input 
                        type="text" 
                        value={vendorData.gstNumber}
                        onChange={(e) => setVendorData({...vendorData, gstNumber: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-base transition-all shadow-xs"
                    />
                </div>
                
                <div className="space-y-1.5">
                    <label className="text-base font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                        <CreditCard className="w-3.5 h-3.5 text-[#007367] opacity-60" /> Aadhaar / ID Number
                    </label>
                    <input 
                        type="text" 
                        value={vendorData.aadhaarNumber}
                        onChange={(e) => setVendorData({...vendorData, aadhaarNumber: e.target.value})}
                        maxLength={12}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-base transition-all shadow-xs"
                    />
                </div>
            </div>
        </section>

        {/* Section 2: Verification Documents - Spans 1 Column */}
        <section className="bg-white p-6 md:p-8 rounded-none border border-gray-100 space-y-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-gray-50 pb-4">
                <Box className="w-4 h-4 text-[#007367]" /> Verification Docs
            </h3>
            
            <div className="space-y-5">
                <div className="pt-2">
                    <label className="text-base font-semibold text-slate-800 flex items-center gap-1.5 mb-3">
                         <Upload className="w-3.5 h-3.5 text-[#007367] opacity-60" /> JPG/PNG Proof
                    </label>
                    
                    <div className="p-4 border border-dashed border-gray-200 rounded-none bg-gray-50/50 hover:bg-gray-50 transition-colors">
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
                                    <div className="p-2.5 bg-[#007367]/5 text-[#007367] rounded-full">
                                        <Upload className="w-4 h-4" />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingFile}
                                        className="px-4 py-2 bg-[#007367] text-white rounded-lg text-base font-semibold uppercase  hover:bg-[#005e54] transition-all disabled:opacity-50"
                                    >
                                        {uploadingFile ? "Uploading..." : "Select File"}
                                    </button>
                                </>
                            ) : (
                                <div className="w-full space-y-3">
                                    <div className="flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-none">
                                        <FileText className="w-3.5 h-3.5 text-[#007367] shrink-0" />
                                        <p className="text-base font-semibold text-slate-700 truncate ml-2">Verification_Proof</p>
                                        <button 
                                           onClick={() => setVendorData({ ...vendorData, verificationDocument: '' })}
                                           className="ml-auto p-1 text-slate-500 hover:text-red-500"
                                        >
                                            <AlertCircle className="w-3.5 h-3.5 rotate-45" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button type="button" onClick={() => setIsPreviewOpen(true)} className="py-2 bg-gray-100 text-slate-800 rounded-lg text-base font-semibold uppercase flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                                            View
                                        </button>
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="py-2 bg-[#007367]/5 text-[#007367] rounded-lg text-base font-semibold uppercase flex items-center justify-center hover:bg-blue-100 transition-colors">
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
        <section className="bg-white p-6 md:p-8 rounded-none border border-gray-100 space-y-6 shadow-sm lg:col-span-3">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-gray-50 pb-4">
                <Globe className="w-4 h-4 text-[#007367]" /> Professional Presence & Description
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1.5">
                    <label className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
                        <Linkedin className="w-3.5 h-3.5 text-slate-800" /> LinkedIn
                    </label>
                    <input 
                        type="text" 
                        value={vendorData.socialLinks?.linkedin || ''}
                        onChange={(e) => setVendorData({
                            ...vendorData, socialLinks: { ...vendorData.socialLinks, linkedin: e.target.value }
                        })}
                        placeholder="Profile URL"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-base transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
                        <Instagram className="w-3.5 h-3.5 text-pink-600" /> Instagram
                    </label>
                    <input 
                        type="text" 
                        value={vendorData.socialLinks?.instagram || ''}
                        onChange={(e) => setVendorData({
                            ...vendorData, socialLinks: { ...vendorData.socialLinks, instagram: e.target.value }
                        })}
                        placeholder="Profile URL"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-base transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
                        <Facebook className="w-3.5 h-3.5 text-[#007367]" /> Facebook
                    </label>
                    <input 
                        type="text" 
                        value={vendorData.socialLinks?.facebook || ''}
                        onChange={(e) => setVendorData({
                            ...vendorData, socialLinks: { ...vendorData.socialLinks, facebook: e.target.value }
                        })}
                        placeholder="Page URL"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-base transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-emerald-600" /> G-Business
                    </label>
                    <input 
                        type="text" 
                        value={vendorData.googleBusinessLink || ''}
                        onChange={(e) => setVendorData({ ...vendorData, googleBusinessLink: e.target.value })}
                        placeholder="Map Link"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-base transition-all shadow-xs"
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-500" /> Presence City
                            </label>
                            <input 
                                type="text" 
                                value={vendorData.city}
                                onChange={(e) => setVendorData({...vendorData, city: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-base transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-500" /> Office Hours
                            </label>
                            <input 
                                type="text" 
                                value={vendorData.workingHours}
                                onChange={(e) => setVendorData({...vendorData, workingHours: e.target.value})}
                                placeholder="e.g. 9:00 AM - 6:00 PM"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-base transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
                            Physical Address
                        </label>
                        <textarea 
                            value={vendorData.address}
                            onChange={(e) => setVendorData({...vendorData, address: e.target.value})}
                            rows={3}
                            placeholder="Enter your full business/office address..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-base transition-all resize-none shadow-xs"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                     <div className="space-y-1.5">
                        <label className="text-base font-semibold text-slate-800">Mission & Descriptions</label>
                        <textarea 
                            value={vendorData.description}
                            onChange={(e) => setVendorData({...vendorData, description: e.target.value})}
                            rows={6}
                            placeholder="Tell buyers about your marketplace expertise..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-900 text-base transition-all resize-none shadow-xs"
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
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-none shadow-2xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#007367]" />
                  Document Verification Proof
                </h3>
                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-gray-50 flex items-center justify-center min-h-[500px]">
                {vendorData.verificationDocument.match(/\.(jpg|jpeg|png|webp)/i) ? (
                  <img src={vendorData.verificationDocument} alt="Verification Proof" className="max-w-full max-h-full object-contain rounded-lg shadow-sm" />
                ) : (
                  <iframe src={vendorData.verificationDocument} className="w-full h-full rounded-lg shadow-sm border-0" title="Verification PDF Proof" />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}


