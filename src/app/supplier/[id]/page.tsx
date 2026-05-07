'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VendorLoginModal from '@/components/VendorLoginModal';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Layers, 
  Star, 
  ArrowLeft, 
  Send,
  Mail,
  Clock,
  Globe,
  Box,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function VendorPublicProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inquiry, setInquiry] = useState({ message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const fetchVendor = async () => {
    try {
      const res = await apiFetch(`/vendors/${id}`);
      setVendor(res.data);
    } catch (error) {
      console.error('Failed to fetch vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [id, user]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setLoginModalOpen(true);
        return;
    }
    
    setSending(true);
    try {
      await apiFetch('/leads', {
        method: 'POST',
        body: JSON.stringify({
          vendorId: vendor.id,
          buyerName: user.name,
          phone: user.phone || 'Logged-in User', 
          city: vendor.city,
          categoryId: vendor.categories?.[0]?.id,
          searchKeyword: 'Direct Inquiry',
          message: inquiry.message
        })
      });
      setSuccess(true);
      setInquiry({ message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Inquiry failed:', error);
    } finally {
      setSending(false);
    }
  };

  const handleDirectAction = (type: 'CALL' | 'WHATSAPP') => {
    if (!user) {
        setLoginModalOpen(true);
        return;
    }
    
    // Background tracking
    apiFetch('/leads/direct', {
        method: 'POST',
        body: JSON.stringify({ vendorId: vendor.id, actionType: type })
    }).catch(() => {});

    if (type === 'CALL') window.location.href = `tel:${vendor.phone}`;
    else window.open(`https://wa.me/${vendor.phone.replace(/[^0-9]/g, '')}`, '_blank');
  };

  const handleModalSuccess = () => {
    // Optionally trigger an action automatically
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center pt-24">
       <div className="w-12 h-12 border-4 border-[#164e33]/20 border-t-[#164e33] rounded-full animate-spin"></div>
    </div>
  );

  if (!vendor) return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center pt-24">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 uppercase tracking-tighter">Supplier Not Found</h2>
        <p className="text-gray-500 mb-8 font-medium">The requested business profile is currently unavailable.</p>
        <button onClick={() => router.back()} className="px-10 py-4 bg-[#164e33] hover:bg-black rounded-xl text-white font-bold flex items-center gap-3 transition-all shadow-lg">
            <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
    </div>
  );

  const approvedOfferings = vendor.products ? vendor.products.filter((p: any) => p.status === 'APPROVED') : [];
  
  const avgRating = vendor.reviews?.length
    ? (vendor.reviews.reduce((a: number, r: any) => a + r.rating, 0) / vendor.reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <VendorLoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        vendor={vendor} 
        onSuccess={handleModalSuccess}
      />

      {/* Profile Header */}
      <div className="bg-[#164e33] pt-24 pb-32 relative overflow-hidden">
        <div className="w-full px-4 md:px-12 relative z-10">
            <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-xs uppercase  w-fit">
                <ArrowLeft className="w-4 h-4" /> Back to Search Results
            </button>

            <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12">
                <div className="space-y-6 max-w-4xl">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Business Logo */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-[#164e33]/10 border border-[#164e33]/20 flex items-center justify-center shrink-0 overflow-hidden shadow-2xl">
                            {vendor.logoUrl ? (
                                <img src={vendor.logoUrl} alt={vendor.businessName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl md:text-5xl font-bold text-[#164e33]">
                                    {vendor.businessName.charAt(0)}
                                </span>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <span className="px-3 py-1 bg-[#164e33]/20 border border-[#164e33]/30 rounded-lg text-[#4ecdc4] text-[10px] font-bold uppercase ">
                                {vendor.category?.name || 'Authorized Partner'}
                                </span>
                                {vendor.verified && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#164e33] rounded-lg text-[10px] font-bold uppercase  text-white">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Business
                                    </div>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
                                {vendor.businessName}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-10 pt-4">
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-[#164e33]" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase ">Base Operations</p>
                                <p className="text-sm font-medium text-white">{vendor.city}</p>
                            </div>
                        </div>
                        {user && (
                            <>
                                {vendor.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-[#164e33]" />
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase ">Phone & Hotline</p>
                                            <p className="text-sm font-medium text-white">{vendor.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {vendor.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-[#164e33]" />
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase ">Official Email</p>
                                            <p className="text-sm font-medium text-white">{vendor.email}</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        <div className="flex items-center gap-3">
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase ">Marketplace Rating</p>
                                <p className="text-sm font-medium text-white">{avgRating} / 5.0</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    {!user ? (
                        <button 
                            onClick={() => setLoginModalOpen(true)}
                            className="w-full lg:w-auto px-10 py-4 bg-white hover:bg-gray-100 text-[#164e33] rounded-xl font-bold text-xs uppercase  transition-all"
                        >
                            Authorize to Connect
                        </button>
                    ) : (
                        <div className="flex gap-4 w-full">
                            <button 
                                onClick={() => handleDirectAction('CALL')}
                                className="flex-1 lg:flex-none px-10 py-4 bg-[#164e33] hover:bg-[#113f29] text-white rounded-xl font-bold text-xs uppercase  transition-all shadow-lg shadow-[#164e33]/20"
                            >
                                Contact Partner
                            </button>
                            <button 
                                onClick={() => handleDirectAction('WHATSAPP')}
                                className="p-4 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all border border-emerald-500/20"
                            >
                                <MessageCircle className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <main className="w-full px-4 md:px-12 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
            
            <div className="flex-1 space-y-20">
                {/* About Section */}
                <section>
                    <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[4px] mb-8 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#164e33]"></div>
                        Company Overview
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed font-normal max-w-5xl border-l-4 border-gray-100 pl-8">
                        {vendor.description || `${vendor.businessName} is a premiere industrial provider in the ${vendor.category?.name || 'Sector'}, delivering high-fidelity business solutions across ${vendor.city} with a commitment to technical excellence and marketplace integrity.`}
                    </p>
                </section>

                {/* Products & Services Grid */}
                <section>
                    <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[4px] mb-12 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Industrial Portfolio
                    </h3>
                    
                    {approvedOfferings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {approvedOfferings.map((p: any) => (
                                <Link key={p.id} href={`/product/${p.id}`} className="block group">
                                <motion.div
                                    whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)' }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col cursor-pointer h-full"
                                >
                                    {/* Image Area */}
                                    <div className="relative h-52 bg-gray-50 overflow-hidden">
                                        {(p.imageUrl || p.image) ? (
                                            <img
                                                src={p.imageUrl || p.image}
                                                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                                                alt={p.name}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-50">
                                                {p.type === 'SERVICE'
                                                    ? <Layers className="w-10 h-10 text-gray-200" />
                                                    : <Box className="w-10 h-10 text-gray-200" />}
                                                <span className="text-[10px] text-gray-300 font-medium uppercase ">No Image</span>
                                            </div>
                                        )}
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        {/* Type Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase  rounded-full ${
                                                p.type === 'SERVICE'
                                                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                            }`}>
                                                {p.type === 'SERVICE' ? 'Service' : 'Product'}
                                            </span>
                                        </div>
                                        {/* Price Tag - top right */}
                                        {p.price > 0 && (
                                            <div className="absolute top-3 right-3">
                                                <span className="bg-white/95 backdrop-blur-sm text-[#164e33] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm border border-gray-100">
                                                    ₹{p.price.toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex-1">
                                            <h4 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-[#164e33] transition-colors leading-snug line-clamp-2">
                                                {p.name}
                                            </h4>
                                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                                                {p.description || 'High-quality offering available for procurement. Contact the supplier for detailed specifications and bulk pricing.'}
                                            </p>
                                        </div>

                                        {/* Footer Meta */}
                                        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {p.category && (
                                                    <span className="text-[11px] text-gray-400 font-medium">{p.category}</span>
                                                )}
                                            </div>
                                            {p.moq > 0 && (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#164e33]/8 rounded-lg">
                                                    <span className="text-[10px] text-gray-400 font-medium">MOQ</span>
                                                    <span className="text-[11px] font-semibold text-[#164e33]">{p.moq} units</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                           <ImageIcon className="w-10 h-10 text-gray-200 mb-3" />
                           <p className="text-sm text-gray-400 font-medium">No offerings available yet</p>
                        </div>
                    )}
                </section>

                {/* Infrastructure Gallery */}
                {vendor.gallery?.length > 0 && (
                    <section>
                        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[4px] mb-10 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            Logistics & Infrastructure
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {vendor.gallery.map((img: any) => (
                                <div key={img.id} className="aspect-square rounded-2xl overflow-hidden bg-gray-100 group relative border border-gray-100 shadow-sm">
                                    <img src={img.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery asset" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Ratings & Reviews Section */}
                <section>
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[4px] flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            Client Feedback
                        </h3>
                        {vendor.reviews?.length > 0 && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full shadow-sm">
                                <span className="text-sm font-bold text-gray-900">{avgRating}</span>
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span className="text-xs text-gray-400 font-medium">({vendor.reviews.length} reviews)</span>
                            </div>
                        )}
                    </div>
                    
                    {vendor.reviews?.length > 0 ? (
                        <div className="space-y-6">
                            {vendor.reviews.map((rev: any) => (
                                <div key={rev.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs relative overflow-hidden group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#164e33]/10 flex items-center justify-center text-[#164e33] font-bold">
                                                {rev.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{rev.user?.name && !rev.user?.name.includes('_') ? rev.user?.name : 'Verified Buyer'}</h4>
                                                <div className="flex items-center gap-0.5 mt-1">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full">
                                            {new Date(rev.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    
                                    <p className="text-gray-600 leading-relaxed italic mb-6">
                                        "{rev.comment}"
                                    </p>

                                    {rev.product && (
                                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] uppercase font-bold text-gray-300 tracking-wider">Review for:</span>
                                                <Link href={`/product/${rev.product.id}`} className="text-xs font-semibold text-[#164e33] hover:underline flex items-center gap-1.5 bg-[#164e33]/5 px-3 py-1 rounded-full">
                                                    <Box className="w-3 h-3" /> {rev.product.name}
                                                </Link>
                                            </div>
                                            <ShieldCheck className="w-4 h-4 text-[#164e33]/30" />
                                        </div>
                                    )}
                                    
                                    {!rev.product && (
                                        <div className="mt-4 pt-4 border-t border-gray-50">
                                            <span className="text-[10px] uppercase font-bold text-gray-300 tracking-wider flex items-center gap-2">
                                                <ShieldCheck className="w-3.5 h-3.5 text-[#164e33]" /> General Merchant Feedback
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                            <Star className="w-12 h-12 text-gray-200 mb-4" />
                            <p className="text-sm font-semibold text-gray-500 uppercase ">No Client Testimonials Yet</p>
                            <p className="text-xs text-gray-400 mt-2">Become the first to verify this merchant's performance.</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Inquiry Context Sidebar */}
            <aside className="lg:w-[400px] shrink-0">
                <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm sticky top-28 space-y-10">
                    <div>
                        <h3 className="text-2xl font-semibold text-[#164e33] mb-3">Send Inquiry</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">Transmit your technical payload or request a quote directly to this authorized partner.</p>
                    </div>

                    <form onSubmit={handleInquiry} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ">Requirement Payload</label>
                            <textarea 
                                value={inquiry.message}
                                onChange={(e) => setInquiry({ message: e.target.value })}
                                required
                                placeholder="State your quantity and delivery timeline..."
                                className="w-full h-32 p-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#164e33] focus:bg-white text-sm font-medium transition-all resize-none shadow-inner"
                            ></textarea>
                        </div>

                        <button 
                            disabled={sending || success}
                            type="submit"
                            className={`w-full py-4 rounded-xl font-bold text-xs uppercase  flex items-center justify-center gap-3 transition-all ${
                                success 
                                  ? 'bg-emerald-500 text-white' 
                                  : 'bg-[#164e33] hover:bg-[#113f29] text-white shadow-lg shadow-[#164e33]/20'
                            }`}
                        >
                            {success ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" /> Transmission Finalized
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" /> {sending ? 'Transmitting...' : 'Post Requirement'}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-10 border-t border-gray-50 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-400 text-[10px] font-semibold uppercase ">
                                <Clock className="w-4 h-4" /> Response Speed
                            </div>
                            <span className="text-xs font-bold text-[#164e33] uppercase tracking-wider">~45 Mins</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-400 text-[10px] font-semibold uppercase ">
                                <Globe className="w-4 h-4" /> Active Hub
                            </div>
                            <span className="text-xs font-medium text-gray-900 tracking-wider">{vendor.city}</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
      </main>
    </div>
  );
}
