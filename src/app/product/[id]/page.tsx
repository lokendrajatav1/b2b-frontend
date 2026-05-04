'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import VendorLoginModal from '@/components/VendorLoginModal';
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Box,
  Layers,
  Star,
  Package,
  Tag,
  Phone,
  Mail,
  MessageCircle,
  Send,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  UserCircle,
  X,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Review state
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSending, setReviewSending] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Zoom States
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Enquiry modal
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryCity, setEnquiryCity] = useState('');
  const [enquiryQty, setEnquiryQty] = useState('');
  const [enquiryMsg, setEnquiryMsg] = useState('');
  const [enquirySending, setEnquirySending] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);

  // Call Now modal
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callPhone, setCallPhone] = useState('');
  const [callSending, setCallSending] = useState(false);
  const [callSent, setCallSent] = useState(false);

  useEffect(() => {
    if (user?.phone) setCallPhone(user.phone);
  }, [user]);

  const handleCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { 
      setPendingAction('CALL'); 
      setLoginModalOpen(true); 
      return; 
    }
    try {
      // We only use /leads/direct for Call Now to avoid duplicate leads.
      // The backend has been updated to keep these for Admin review only (vendorId: null).
      await apiFetch('/leads/direct', {
        method: 'POST',
        body: JSON.stringify({
          vendorId: product.vendor.id,
          actionType: 'CALL',
          buyerName: user.name,
          phone: callPhone,
          city: user.city || product.vendor.city || 'India',
          categoryId: product.vendor.categories?.[0]?.id,
          message: `CALL REQUEST: User wants to call ${product.vendor.businessName} regarding ${product.name}. Preferred Phone: ${callPhone}`
        }),
      });
      setCallSent(true);

      setTimeout(() => { 
        setCallSent(false); 
        setCallModalOpen(false);
        // We trigger the tel: link after closing the modal for a cleaner exit
        const phone = product.vendor.phone?.replace(/[^0-9]/g, '');
        if (phone && phone !== '**********') {
          window.location.href = `tel:${phone}`;
        }
      }, 2500);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setCallSending(false); 
    }
  };

  const popularCitySuggestions = ['Indore', 'Bhopal', 'Delhi', 'Bengaluru', 'Mumbai'];

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setPendingAction('inquiry'); setLoginModalOpen(true); return; }
    setEnquirySending(true);
    try {
      await apiFetch('/leads', {
        method: 'POST',
        body: JSON.stringify({
          vendorId: product.vendor.id,
          buyerName: user.name,
          phone: user.phone || enquiryCity,
          city: enquiryCity || product.vendor.city,
          categoryId: product.vendor.categories?.[0]?.id,
          searchKeyword: product.name,
          message: enquiryMsg || `Enquiry for ${product.name}. Qty: ${enquiryQty}`,
        }),
      });
      setEnquirySent(true);
      setTimeout(() => { setEnquirySent(false); setEnquiryOpen(false); }, 2500);
    } catch (e) { console.error(e); }
    finally { setEnquirySending(false); }
  };

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Login modal
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiFetch(`/vendors/products/${id}`);
        setProduct(res.data);
        setReviews(res.data?.reviews || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setPendingAction('inquiry');
      setLoginModalOpen(true);
      return;
    }
    setSending(true);
    try {
      await apiFetch('/leads', {
        method: 'POST',
        body: JSON.stringify({
          vendorId: product.vendor.id,
          buyerName: user.name,
          phone: user.phone || 'Logged-in User',
          city: product.vendor.city,
          categoryId: product.vendor.categories?.[0]?.id,
          searchKeyword: product.name,
          message,
        }),
      });
      setSent(true);
      setMessage('');
      setTimeout(() => setSent(false), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleDirectAction = (type: 'CALL' | 'WHATSAPP') => {
    if (!user) {
      setPendingAction(type);
      setLoginModalOpen(true);
      return;
    }
    apiFetch('/leads/direct', {
      method: 'POST',
      body: JSON.stringify({ vendorId: product.vendor.id, actionType: type }),
    }).catch(() => {});
    const phone = product.vendor.phone?.replace(/[^0-9]/g, '');
    if (type === 'CALL') window.location.href = `tel:${phone}`;
    else window.open(`https://wa.me/${phone}`, '_blank');
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setPendingAction('review');
      setLoginModalOpen(true);
      return;
    }
    if (!reviewRating) { setReviewError('Please select a star rating.'); return; }
    setReviewError('');
    setReviewSending(true);
    try {
      const res = await apiFetch('/vendors/feedback', {
        method: 'POST',
        body: JSON.stringify({
          vendorId: product.vendor.id,
          productId: id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      // Optimistically add to local state
      setReviews(prev => [{
        id: res.data?.id || Date.now().toString(),
        rating: reviewRating,
        comment: reviewComment,
        user: { name: user.name },
        createdAt: new Date().toISOString(),
      }, ...prev]);
      setReviewSent(true);
      setReviewRating(0);
      setReviewComment('');
      setTimeout(() => setReviewSent(false), 4000);
    } catch (e: any) {
      setReviewError(e?.message || 'Failed to submit review.');
    } finally {
      setReviewSending(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center pt-24">
      <div className="w-12 h-12 border-4 border-[#164e33]/20 border-t-[#164e33] rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4 pt-24">
      <h2 className="text-2xl font-semibold text-gray-800">Product not found</h2>
      <button onClick={() => router.back()} className="flex items-center gap-2 text-[#164e33] font-medium hover:underline">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>
    </div>
  );

  const vendor = product.vendor;
  const avgRating = reviews.length
    ? (reviews.reduce((a: number, r: any) => a + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  // Retry pending action after login
  const handleModalSuccess = () => {
    if (pendingAction === 'CALL') {
      setCallModalOpen(true);
    } else if (pendingAction === 'WHATSAPP') {
      setTimeout(() => handleDirectAction('WHATSAPP'), 300);
    }
    setPendingAction(null);
  };

  const vendorForModal = vendor ? {
    id: vendor.id,
    businessName: vendor.businessName,
    city: vendor.city,
    verified: vendor.verified,
    category: vendor.categories?.[0] ? { name: vendor.categories[0].name } : undefined,
  } : null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ── IndiaMart-style Enquiry Modal ── */}
      {enquiryOpen && product && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setEnquiryOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row"
            style={{ maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Product + Supplier */}
            <div className="md:w-[260px] shrink-0 bg-gray-50 border-r border-gray-100 flex flex-col overflow-y-auto">
              <div className="w-full h-44 bg-white border-b border-gray-100 flex items-center justify-center overflow-hidden">
                {(product.images && product.images.length > 0) || product.imageUrl ? (
                  <img
                    src={(product.images && product.images.length > 0) ? product.images[activeImageIndex] : product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-12 h-12 text-gray-200" />
                )}
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{product.name}</h3>
                  {product.price > 0 && (
                    <p className="text-lg font-black text-[#1b5e20]">
                      ₹ {product.price.toLocaleString()}
                      <span className="text-xs font-medium text-gray-500">/{product.moq > 1 ? `${product.moq} units` : 'Piece'}</span>
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-[#0076a8]" />
                    <span className="text-sm font-bold text-[#0076a8]">{vendor.businessName}</span>
                  </div>
                  {vendor.phone && vendor.phone !== '**********' && (
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                      <Phone className="w-3.5 h-3.5 text-[#164e33]" /> {vendor.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5" /> {vendor.city}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#1b5e20] bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> GST
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 fill-amber-400" /> TrustSEAL
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-[#1b5e20] text-white rounded px-2 py-0.5 text-xs font-bold">
                      {avgRating || '4.5'} <Star className="w-3 h-3 fill-white ml-0.5" />
                    </div>
                    <span className="text-xs text-gray-400">({reviews.length})</span>
                  </div>
                  <button
                    onClick={() => { setEnquiryOpen(false); setCallModalOpen(true); }}
                    className="w-full py-2.5 bg-[#e65100] hover:bg-[#c74600] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors mt-2"
                  >
                    <Phone className="w-4 h-4" /> Call Now
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Enquiry Form */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Provide details to talk to the supplier</h2>
                <button onClick={() => setEnquiryOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {enquirySent ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-[#1b5e20]" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">Enquiry Sent!</p>
                  <p className="text-sm text-gray-500 text-center">The supplier will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="flex-1 p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">
                      City or Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={enquiryCity}
                      onChange={(e) => setEnquiryCity(e.target.value)}
                      placeholder="City or Pincode*"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-[#164e33] focus:ring-2 focus:ring-[#164e33]/10 transition-all"
                    />
                    <div className="flex items-center justify-between mt-1.5 text-xs">
                      <span className="text-gray-400">
                        Suggestions:{' '}
                        {popularCitySuggestions.slice(0, 3).map((c) => (
                          <button key={c} type="button" onClick={() => setEnquiryCity(c)} className="text-[#0076a8] hover:underline font-semibold mr-1">{c}</button>
                        ))}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(async (pos) => {
                              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=10`);
                              const data = await res.json();
                              setEnquiryCity(data.address.city || data.address.town || '');
                            });
                          }
                        }}
                        className="text-[#0076a8] hover:underline font-semibold"
                      >
                        Detect My City
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Quantity Required</label>
                    <input
                      type="number"
                      value={enquiryQty}
                      onChange={(e) => setEnquiryQty(e.target.value)}
                      placeholder="e.g. 100 pieces"
                      min="1"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-[#164e33] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Your Message (Optional)</label>
                    <textarea
                      value={enquiryMsg}
                      onChange={(e) => setEnquiryMsg(e.target.value)}
                      rows={3}
                      placeholder="Describe your requirements..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-[#164e33] transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={enquirySending || !enquiryCity}
                    className="w-full py-3.5 bg-[#164e33] hover:bg-[#113f29] disabled:opacity-60 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    {enquirySending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {enquirySending ? 'Sending...' : 'Submit'}
                  </button>
                  <p className="text-center text-xs text-gray-400">By submitting, you agree to our Terms & Privacy Policy.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Call Now Modal (As requested by user) ── */}
      {callModalOpen && product && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setCallModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row"
            style={{ maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Product + Supplier */}
            <div className="md:w-[260px] shrink-0 bg-gray-50 border-r border-gray-100 flex flex-col overflow-y-auto">
              <div className="w-full h-44 bg-white border-b border-gray-100 flex items-center justify-center overflow-hidden relative">
                {(product.images && product.images.length > 0) || product.imageUrl ? (
                  <img
                    src={(product.images && product.images.length > 0) ? product.images[activeImageIndex] : product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-12 h-12 text-gray-200" />
                )}
                <div className="absolute top-2 left-2">
                  <span className="bg-[#1b5e20] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Calling Supplier
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{product.name}</h3>
                  {product.price > 0 && (
                    <p className="text-lg font-black text-[#1b5e20]">
                      ₹ {product.price.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-[#0076a8]" />
                    <span className="text-sm font-bold text-[#0076a8]">{vendor.businessName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5" /> {vendor.city}
                  </div>
                  <div className="pt-2">
                     <div className="flex items-center gap-1.5 bg-[#1b5e20] text-white rounded-lg px-2.5 py-1 w-fit text-[11px] font-bold">
                        <Star className="w-3 h-3 fill-white" /> {avgRating || '4.5'}
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Call Form */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Confirm your number to call</h2>
                <button onClick={() => setCallModalOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {callSent ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 bg-white">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center border-2 border-green-500/20"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <p className="text-xl font-black text-gray-900">Enquiry Sent Successfully!</p>
                    <p className="text-sm text-gray-500 mt-2">Connecting you to the supplier now...</p>
                  </motion.div>
                </div>
              ) : (
                <form onSubmit={handleCallSubmit} className="flex-1 p-6 flex flex-col justify-center space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                      Your Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 pr-3">
                        <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-auto rounded-lg" />
                        <span className="text-sm font-bold text-gray-500">+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        value={callPhone}
                        onChange={(e) => setCallPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                        placeholder="10 digit mobile number"
                        className="w-full border border-gray-300 rounded-xl pl-24 pr-4 py-4 text-lg font-bold text-gray-900 outline-none focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/10 transition-all"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">Supplier will call you back on this number if busy.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={callSending || callPhone.length !== 10}
                    className="w-full py-4 bg-[#e65100] hover:bg-[#c74600] disabled:opacity-60 text-white rounded-xl font-black text-base flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    {callSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Phone className="w-5 h-5 fill-white" />}
                    {callSending ? 'Processing...' : 'Call Now'}
                  </button>
                  
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#1b5e20] shrink-0" />
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Your privacy is our priority. Your number is only shared with this verified supplier to facilitate your business inquiry.
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      
      <VendorLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        vendor={vendorForModal}
        onSuccess={handleModalSuccess}
      />
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-12 pt-24">
        {/* Breadcrumb row */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <button onClick={() => router.back()} className="hover:text-[#1b5e20] transition-colors flex items-center gap-1 font-bold">
            <ArrowLeft className="w-4 h-4" /> Search Results
          </button>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/supplier/${vendor.id}`} className="hover:text-[#1b5e20] transition-colors font-bold uppercase tracking-wider text-[11px]">
            {vendor.businessName}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-black tracking-tight truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left: Image + Details */}
          <div className="flex-1 space-y-8">

            {/* Image Gallery */}
            <div className="flex flex-col md:flex-row gap-5 items-start">
              {/* Thumbnails - Vertical on Desktop, Horizontal on Mobile */}
              {product.images && product.images.length > 1 && (
                <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto md:max-h-[500px] no-scrollbar p-2 w-full md:w-auto">
                  {product.images.map((img: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden border-[3px] transition-all duration-300 ${ activeImageIndex === idx ? 'border-[#1b5e20] shadow-lg scale-110' : 'border-white hover:border-[#1b5e20]/30 shadow-sm opacity-80 hover:opacity-100' }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`${product.name} thumbnail ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image Display - Taller Vertical Aspect */}
              <div className="flex-1 w-full bg-white rounded-2xl border border-gray-100 shadow-sm order-1 md:order-2 relative group">
                { (product.images && product.images.length > 0) || product.imageUrl || product.image ? (
                  <div 
                    className="relative w-full h-[280px] md:h-[400px] bg-gray-50 flex items-center justify-center overflow-hidden rounded-2xl cursor-crosshair"
                    onMouseMove={handleZoom}
                    onMouseEnter={() => setIsZooming(true)}
                    onMouseLeave={() => setIsZooming(false)}
                  >
                    <img
                      src={ (product.images && product.images.length > 0) ? product.images[activeImageIndex] : (product.imageUrl || product.image) }
                      alt={product.name}
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* Lens Effect (Amazon-style) */}
                    {isZooming && (
                      <div 
                        className="absolute border border-gray-300 bg-white/30 pointer-events-none hidden md:block"
                        style={{
                          width: '150px',
                          height: '150px',
                          left: `${zoomPos.x}%`,
                          top: `${zoomPos.y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    )}

                    {/* Type Badge overlay */}
                    <div className="absolute top-4 left-4 z-10 pointer-events-none">
                      <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl border border-white/20 backdrop-blur-md ${
                        product.type === 'SERVICE'
                          ? 'bg-blue-600/90 text-white'
                          : 'bg-[#1b5e20]/90 text-white'
                      }`}>
                        {product.type === 'SERVICE' ? 'Service Available' : 'Product Catalogue'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-80 flex flex-col items-center justify-center gap-3 bg-gray-50">
                    {product.type === 'SERVICE' ? <Layers className="w-14 h-14 text-gray-200" /> : <Box className="w-14 h-14 text-gray-200" />}
                    <span className="text-sm text-gray-300 font-medium tracking-wide">No image available</span>
                  </div>
                )}

                {/* Zoom Window (Amazon-style) - MOVED OUTSIDE OVERFLOW-HIDDEN */}
                {isZooming && (
                  <div 
                    className="absolute left-[calc(100%+20px)] top-0 w-[450px] h-[450px] bg-white border border-gray-200 shadow-2xl z-[999] overflow-hidden hidden md:block rounded-2xl pointer-events-none"
                    style={{
                      backgroundImage: `url("${ (product.images && product.images.length > 0) ? product.images[activeImageIndex] : (product.imageUrl || product.image) }")`,
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundSize: '1200px 1200px',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                )}
              </div>
            </div>

            {/* Premium Title & Meta Data Structure */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 space-y-8 shadow-sm">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-4">
                  {product.category && (
                    <div className="flex items-center gap-2 text-[15px] font-medium text-[#1b5e20] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100/50">
                      <Tag className="w-4 h-4" />
                      <span>{product.category}</span>
                    </div>
                  )}
                  {avgRating && (
                    <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-[15px] font-bold border border-amber-200/50">
                      {avgRating} <Star className="w-4 h-4 fill-current" />
                    </div>
                  )}
                </div>
              </div>

              {/* Premium Price & MOQ Row */}
              <div className="flex flex-wrap items-center justify-between gap-8 py-8 border-y border-gray-100">
                {product.price > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-2">Unit Price</p>
                    <p className="text-xl font-black text-[#1b5e20]">₹{product.price.toLocaleString()}</p>
                  </div>
                )}
                
                {product.moq > 0 && (
                  <div className="hidden sm:block h-12 w-px bg-gray-100" />
                )}
                
                {product.moq > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-2">Min. Order Qty</p>
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-[#e65100]" />
                      <p className="text-xl  text-gray-900">{product.moq} Units</p>
                    </div>
                  </div>
                )}
                
                {product.availability !== undefined && (
                  <>
                    <div className="hidden sm:block h-12 w-px bg-gray-100" />
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-2">Availability</p>
                      <span className={`text-[15px] font-bold flex items-center gap-2 ${product.availability ? 'text-emerald-600' : 'text-red-500'}`}>
                        {product.availability ? <><CheckCircle2 className="w-5 h-5" /> In Stock</> : <><CheckCircle2 className="w-5 h-5" /> Out of Stock</>}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Enhanced Specs & Description with Light Green Shaded Boxes */}
              <div className="space-y-8 pt-2">
                {product.specifications && (
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                      <Box className="w-5 h-5 text-[#1b5e20]" /> Specifications
                    </h3>
                    <div className="bg-emerald-50/60 p-6 md:p-8 rounded-2xl border border-emerald-100/60 text-[15px] font-medium text-gray-700 shadow-inner">
                      {(() => {
                        try {
                          const parsed = typeof product.specifications === 'string' && product.specifications.startsWith('[') ? JSON.parse(product.specifications) : null;
                          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].key) {
                            return (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                {parsed.map((spec: any, idx: number) => (
                                  <div key={idx} className="flex flex-col border-b border-emerald-100/60 pb-2">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{spec.key}</span>
                                    <span className="text-[15px] font-semibold text-gray-900 mt-0.5">{spec.value}</span>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return <div className="leading-loose whitespace-pre-line">{product.specifications}</div>;
                        } catch (e) {
                          return <div className="leading-loose whitespace-pre-line">{product.specifications}</div>;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {product.description && (
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                      <Layers className="w-5 h-5 text-[#1b5e20]" /> Description
                    </h3>
                    <div className="bg-emerald-50/60 p-6 md:p-8 rounded-2xl border border-emerald-100/60 text-[15px] font-medium text-gray-700 leading-loose shadow-inner">
                      {product.description}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Premium Reviews Section ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-sm space-y-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100/50">
                    <MessageSquare className="w-5 h-5 text-[#1b5e20]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Ratings & Reviews</h3>
                  {reviews.length > 0 && (
                    <span className="text-sm font-bold text-[#1b5e20] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50">
                      {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </span>
                  )}
                </div>
                {avgRating && (
                  <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                    <span className="text-2xl font-bold text-amber-600">{avgRating}</span>
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                  </div>
                )}
              </div>

              {/* Write a Review Form */}
              {user ? (
                <form onSubmit={handleReview} className="bg-emerald-50/40 rounded-2xl p-8 space-y-6 border border-emerald-100/60 shadow-inner">
                  <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">Write a Review</h4>

                  {/* Star Picker */}
                  <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl border border-emerald-100/50 w-max shadow-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors drop-shadow-sm ${
                            star <= (hoverRating || reviewRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                    {reviewRating > 0 && (
                      <span className="ml-4 text-[15px] font-bold text-[#1b5e20]">
                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating]}
                      </span>
                    )}
                  </div>

                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    placeholder="Share your experience with this product or service..."
                    className="w-full p-5 bg-white border border-emerald-100/60 rounded-xl text-[15px] font-medium text-gray-700 outline-none focus:border-[#1b5e20] transition-all resize-none shadow-sm"
                  />

                  {reviewError && (
                    <p className="text-[15px] font-medium text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{reviewError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={reviewSending || reviewSent}
                    className={`px-8 py-3.5 rounded-xl text-[15px] font-bold flex items-center gap-3 transition-all shadow-md ${
                      reviewSent
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#1b5e20] hover:bg-[#144216] text-white hover:-translate-y-0.5'
                    }`}
                  >
                    {reviewSent ? (
                      <><CheckCircle2 className="w-5 h-5" /> Review Submitted!</>
                    ) : reviewSending ? 'Submitting...' : (
                      <><Send className="w-5 h-5" /> Submit Review</>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                  <p className="text-sm text-gray-500">
                    <button
                      onClick={() => { setPendingAction('review'); setLoginModalOpen(true); }}
                      className="text-[#1b5e20] font-medium hover:underline"
                    >
                      Sign in
                    </button>{' '}to leave a review
                  </p>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  <div className="space-y-6 divide-y divide-gray-100">
                    {(showAllReviews ? reviews : reviews.slice(0, 5)).map((review: any, idx: number) => (
                      <div key={review.id || idx} className={`flex gap-4 ${idx > 0 ? 'pt-6' : ''}`}>
                        <div className="w-10 h-10 rounded-full bg-[#1b5e20]/10 flex items-center justify-center shrink-0 border border-[#1b5e20]/20">
                          <UserCircle className="w-6 h-6 text-[#1b5e20]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-800 truncate">
                              {review.user?.name && isNaN(Number(review.user.name)) ? review.user.name : 'Guest Reviewer'}
                            </span>
                            <span className="text-xs text-gray-400 shrink-0">
                              {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          {/* Stars */}
                          <div className="flex items-center gap-0.5 mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          {review.comment && (
                            <p className="text-[15px] font-medium text-gray-700 leading-relaxed bg-emerald-50/40 p-5 rounded-xl border border-emerald-100/50">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {reviews.length > 5 && (
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="w-full py-3 border border-gray-200 rounded-xl text-sm font-semibold text-[#1b5e20] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {showAllReviews ? (
                        <>Show Less <ChevronRight className="w-4 h-4 rotate-90" /></>
                      ) : (
                        <>View All {reviews.length} Reviews <ChevronRight className="w-4 h-4" /></>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </motion.div>
          </div>

          <aside className="lg:w-[380px] shrink-0">
            <div className="sticky top-28 space-y-6">
              {/* Supplier Info Card (Premium Sync) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-[#1b5e20]/10 flex items-center justify-center text-[#1b5e20] text-xl font-bold shrink-0 overflow-hidden border border-[#1b5e20]/10">
                      {vendor.logoUrl ? (
                        <img src={vendor.logoUrl} alt={vendor.businessName} className="w-full h-full object-cover" />
                      ) : (
                        vendor.businessName.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-[17px] font-bold text-gray-900 leading-tight truncate">{vendor.businessName}</h2>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="flex items-center gap-0.5 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border border-blue-100">
                          <ShieldCheck className="w-2.5 h-2.5" /> Verified
                        </div>
                        <div className="flex items-center gap-0.5 bg-[#F1C82E]/10 text-[#C92500] px-1.5 py-0.5 rounded text-[9px] font-bold border border-[#F1C82E]">
                          <CheckCircle2 className="w-2.5 h-2.5 fill-[#F1C82E]" /> TrustSeal
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-3 border-y border-gray-50">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">Reputation</p>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center bg-green-700 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {avgRating || '4.5'} <Star className="w-2.5 h-2.5 ml-0.5 fill-current" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">({reviews.length})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">Location</p>
                      <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-gray-700">
                        <MapPin className="w-3 h-3 text-[#1b5e20]" /> {vendor.city}
                      </div>
                    </div>
                  </div>

                  {/* Years Active Analysis */}
                  {(() => {
                    const startYear = vendor.createdAt ? new Date(vendor.createdAt).getFullYear() : new Date().getFullYear() - 1;
                    const years = new Date().getFullYear() - startYear;
                    return (
                      <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                        <Package className="w-3.5 h-3.5 text-gray-400" />
                        Proudly serving for <span className="text-gray-900 font-bold">{years > 0 ? `${years}+ years` : 'under 1 year'}</span>
                      </div>
                    );
                  })()}

                  <Link
                    href={`/supplier/${vendor.id}`}
                    className="w-full py-2.5 bg-gray-50 hover:bg-[#1b5e20] hover:text-white text-[#1b5e20] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-gray-100"
                  >
                    View Supplier Store <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>

              {/* Direct Contact CTA */}
              <div className="bg-white rounded-3xl p-8 shadow-md border border-emerald-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-100/50 transition-all"></div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
                  <Send className="w-5 h-5 text-[#1b5e20]" /> Contact Details
                </h3>
                
                <div className="flex flex-col gap-4 relative z-10">
                  <button
                    onClick={() => {
                      if (!user) { setPendingAction('CALL'); setLoginModalOpen(true); return; }
                      setCallModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-[#e65100] hover:bg-[#c74600] text-white rounded-xl text-[15px] font-bold transition-all shadow-lg active:scale-[0.98]"
                  >
                    <Phone className="w-5 h-5" /> Call Supplier Now
                  </button>
                  <button
                    onClick={() => handleDirectAction('WHATSAPP')}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-50 hover:bg-[#1b5e20] hover:text-white text-[#1b5e20] border border-[#1b5e20]/20 rounded-xl text-[15px] font-bold transition-all"
                  >
                    <MessageCircle className="w-5 h-5" /> Message on WhatsApp
                  </button>
                </div>
              </div>

              {/* Advanced Inquiry Form */}
              <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1b5e20]/10 flex items-center justify-center">
                    <Send className="w-4 h-4 text-[#1b5e20]" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Send an Inquiry</h3>
                </div>
                <p className="text-xs text-gray-400 mb-6 font-medium">Specify your requirements to get the best quote from this supplier.</p>
                
                <form onSubmit={handleInquiry} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {['Pricing', 'Bulk Order'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setMessage(prev => `${type}: ${prev}`)}
                        className="py-2 px-3 border border-gray-100 rounded-lg text-[11px] font-bold text-gray-500 hover:border-[#1b5e20] hover:text-[#1b5e20] transition-all bg-gray-50/50"
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      placeholder={`Explain your specific requirement for ${product.name}...`}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 outline-none focus:border-[#1b5e20] focus:bg-white transition-all resize-none shadow-inner"
                    />

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <Package className="w-4 h-4 text-[#1b5e20]" />
                      <input 
                        type="number" 
                        placeholder="Quantity" 
                        className="bg-transparent text-sm font-bold text-gray-900 outline-none w-full"
                        min="1"
                      />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Units</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending || sent}
                    className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
                      sent ? 'bg-emerald-500 text-white' : 'bg-[#1b5e20] hover:bg-[#144216] text-white'
                    }`}
                  >
                    {sent ? <><CheckCircle2 className="w-4 h-4" /> Inquiry Sent Successfully!</> : sending ? <>Processing...</> : <>Get Best Quote Now</>}
                  </button>
                  
                  {!user && (
                    <div className="text-center bg-gray-50/50 p-2 rounded-lg border border-dashed border-gray-200">
                      <button
                        type="button"
                        onClick={() => { setPendingAction('inquiry'); setLoginModalOpen(true); }}
                        className="text-[#1b5e20] text-xs font-bold hover:underline"
                      >
                        Sign in to proceed
                      </button>
                    </div>
                  )}
                </form>
              </div>

            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
