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
      <div className="w-12 h-12 border-4 border-[#007367]/20 border-t-[#007367] rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4 pt-24">
      <h2 className="text-2xl font-semibold text-gray-800">Product not found</h2>
      <button onClick={() => router.back()} className="flex items-center gap-2 text-[#007367] font-medium hover:underline">
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
    if (pendingAction === 'CALL' || pendingAction === 'WHATSAPP') {
      setTimeout(() => handleDirectAction(pendingAction as 'CALL' | 'WHATSAPP'), 300);
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

      <VendorLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        vendor={vendorForModal}
        onSuccess={handleModalSuccess}
      />
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-12 pt-24">
        {/* Breadcrumb row */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <button onClick={() => router.back()} className="hover:text-[#007367] transition-colors flex items-center gap-1 font-medium">
            <ArrowLeft className="w-4 h-4" /> Search Results
          </button>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/supplier/${vendor.id}`} className="hover:text-[#007367] transition-colors font-medium">
            {vendor.businessName}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left: Image + Details */}
          <div className="flex-1 space-y-8">

            {/* Image Gallery */}
            <div className="flex flex-col md:flex-row gap-5 items-start">
              {/* Thumbnails - Vertical on Desktop, Horizontal on Mobile */}
              {product.images && product.images.length > 1 && (
                <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto md:max-h-[450px] no-scrollbar p-2 w-full md:w-auto">
                  {product.images.map((img: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${ activeImageIndex === idx ? 'border-[#007367] shadow-md scale-105' : 'border-white hover:border-gray-200 opacity-70 hover:opacity-100' }`}
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
                      <span className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-full shadow-sm ${
                        product.type === 'SERVICE'
                          ? 'bg-blue-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {product.type === 'SERVICE' ? 'Service' : 'Product'}
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

            {/* Title & Meta */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">{product.name}</h1>
                {product.category && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{product.category}</span>
                  </div>
                )}
              </div>

              {/* Price & MOQ Row */}
              <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-50">
                {product.price > 0 && (
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-1">Unit Price</p>
                    <p className="text-xl font-bold text-[#05252e]">₹{product.price.toLocaleString()}</p>
                  </div>
                )}
                {product.moq > 0 && (
                  <div className="h-10 w-px bg-gray-100 hidden sm:block" />
                )}
                {product.moq > 0 && (
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-1">Min. Order Qty</p>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#007367]" />
                      <p className="text-lg font-semibold text-[#007367]">{product.moq} Units</p>
                    </div>
                  </div>
                )}
                {product.availability !== undefined && (
                  <>
                    <div className="h-10 w-px bg-gray-100 hidden sm:block" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-1">Availability</p>
                      <span className={`text-sm font-semibold ${product.availability ? 'text-emerald-600' : 'text-red-500'}`}>
                        {product.availability ? '✓ In Stock' : '✗ Out of Stock'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Description</h3>
                  <p className="text-gray-500 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Specifications</h3>
                  <p className="text-gray-500 leading-relaxed whitespace-pre-line">{product.specifications}</p>
                </div>
              )}
            </div>


            {/* ── Reviews Section ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl border border-gray-100 p-8 space-y-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-[#007367]" />
                  <h3 className="text-base font-semibold text-gray-900">Ratings & Reviews</h3>
                  {reviews.length > 0 && (
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                      {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </span>
                  )}
                </div>
                {avgRating && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-semibold text-gray-900">{avgRating}</span>
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                )}
              </div>

              {/* Write a Review Form */}
              {user ? (
                <form onSubmit={handleReview} className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700">Write a Review</h4>

                  {/* Star Picker */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            star <= (hoverRating || reviewRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                    {reviewRating > 0 && (
                      <span className="ml-2 text-sm text-gray-500">
                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating]}
                      </span>
                    )}
                  </div>

                  {/* Comment */}
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Share your experience with this product or service..."
                    className="w-full p-3.5 bg-white border border-gray-100 rounded-xl text-sm text-gray-700 outline-none focus:border-[#007367] transition-all resize-none"
                  />

                  {reviewError && (
                    <p className="text-sm text-red-500">{reviewError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={reviewSending || reviewSent}
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                      reviewSent
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#007367] hover:bg-[#005e54] text-white'
                    }`}
                  >
                    {reviewSent ? (
                      <><CheckCircle2 className="w-4 h-4" /> Review Submitted!</>
                    ) : reviewSending ? 'Submitting...' : (
                      <><Send className="w-4 h-4" /> Submit Review</>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-gray-50 rounded-xl p-5 text-center border border-gray-100">
                  <p className="text-sm text-gray-500">
                    <button
                      onClick={() => { setPendingAction('review'); setLoginModalOpen(true); }}
                      className="text-[#007367] font-medium hover:underline"
                    >
                      Sign in
                    </button>{' '}to leave a review
                  </p>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  <div className="space-y-5 divide-y divide-gray-50">
                    {(showAllReviews ? reviews : reviews.slice(0, 5)).map((review: any, idx: number) => (
                      <div key={review.id || idx} className={`flex gap-4 ${idx > 0 ? 'pt-5' : ''}`}>
                        <div className="w-10 h-10 rounded-full bg-[#007367]/10 flex items-center justify-center shrink-0">
                          <UserCircle className="w-6 h-6 text-[#007367]" />
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
                            <p className="text-sm text-gray-500 leading-relaxed">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {reviews.length > 5 && (
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="w-full py-3 border border-gray-100 rounded-xl text-sm font-semibold text-[#007367] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
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
                    <div className="w-14 h-14 rounded-xl bg-[#007367]/10 flex items-center justify-center text-[#007367] text-xl font-bold shrink-0 overflow-hidden border border-[#007367]/10">
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
                        <MapPin className="w-3 h-3 text-[#007367]" /> {vendor.city}
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
                    className="w-full py-2.5 bg-gray-50 hover:bg-[#007367] hover:text-white text-[#007367] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-gray-100"
                  >
                    View Supplier Store <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>

              {/* Direct Contact CTA (Industrial Dark Theme) */}
              <div className="bg-[#05252e] rounded-2xl p-6 text-white shadow-xl border border-[#007367]/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#007367]/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#007367]/20 transition-all"></div>
                
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#4ecdc4]" /> Direct Engagement
                </h3>
                
                <div className="flex flex-col gap-3 relative z-10">
                  <button
                    onClick={() => handleDirectAction('CALL')}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#007367] hover:bg-[#005e54] text-white rounded-xl text-sm font-bold transition-all shadow-lg active:scale-[0.98]"
                  >
                    <Phone className="w-4 h-4 animate-shake" /> Call Supplier Now
                  </button>
                  <button
                    onClick={() => handleDirectAction('WHATSAPP')}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl text-sm font-bold transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> Message on WhatsApp
                  </button>
                </div>
              </div>

              {/* Advanced Inquiry Form */}
              <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#007367]/10 flex items-center justify-center">
                    <Send className="w-4 h-4 text-[#007367]" />
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
                        className="py-2 px-3 border border-gray-100 rounded-lg text-[11px] font-bold text-gray-500 hover:border-[#007367] hover:text-[#007367] transition-all bg-gray-50/50"
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
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 outline-none focus:border-[#007367] focus:bg-white transition-all resize-none shadow-inner"
                    />

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <Package className="w-4 h-4 text-[#007367]" />
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
                      sent ? 'bg-emerald-500 text-white' : 'bg-[#007367] hover:bg-[#005e54] text-white'
                    }`}
                  >
                    {sent ? <><CheckCircle2 className="w-4 h-4" /> Inquiry Sent Successfully!</> : sending ? <>Processing...</> : <>Get Best Quote Now</>}
                  </button>
                  
                  {!user && (
                    <div className="text-center bg-gray-50/50 p-2 rounded-lg border border-dashed border-gray-200">
                      <button
                        type="button"
                        onClick={() => { setPendingAction('inquiry'); setLoginModalOpen(true); }}
                        className="text-[#007367] text-xs font-bold hover:underline"
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
