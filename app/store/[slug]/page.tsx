"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  MessageSquare,
  Sparkles,
  Heart,
  Package,
  CheckCircle2,
  X,
  Send
} from "lucide-react";
import { useVendorStore } from "@/context/vendor-store";
import { useAdminStore } from "@/context/admin-store";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

export default function PublicVendorStorefrontPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const vendors = useVendorStore((state) => state.vendors);
  const reviews = useVendorStore((state) => state.reviews);
  const addStoreReview = useVendorStore((state) => state.addStoreReview);

  const products = useAdminStore((state) => state.products);

  const vendor = vendors.find((v) => v.slug === slug) || vendors[0];

  const vendorProducts = products.filter(
    (p) => p.vendorId === vendor?.id || (vendor?.isFlagship && (!p.vendorId || p.vendorId === "v-troyx-flagship"))
  );

  const vendorReviews = reviews.filter((r) => r.vendorId === vendor?.id);

  const [following, setFollowing] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [inquiryText, setInquiryText] = useState("");
  const [inquirySent, setInquirySent] = useState(false);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [custName, setCustName] = useState("");
  const [custRating, setCustRating] = useState(5);
  const [custComment, setCustComment] = useState("");

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setContactModalOpen(false);
      setInquiryText("");
    }, 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custComment) return;

    addStoreReview({
      vendorId: vendor.id,
      customerName: custName,
      rating: custRating,
      comment: custComment,
      verifiedPurchase: true
    });

    setReviewModalOpen(false);
    setCustName("");
    setCustComment("");
  };

  return (
    <div className="min-h-screen bg-brand-mist dark:bg-zinc-950 text-brand-ink dark:text-white pb-20">
      {/* Store Banner Hero */}
      <div className="relative h-64 sm:h-80 w-full bg-zinc-900 overflow-hidden">
        <img src={vendor.bannerUrl} alt={vendor.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      </div>

      {/* Store Identity & Profile Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 space-y-8">
        <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 p-6 sm:p-8 backdrop-blur-2xl shadow-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <img
                src={vendor.logoUrl}
                alt={vendor.name}
                className="h-24 w-24 rounded-3xl border-4 border-white dark:border-zinc-900 object-cover bg-white shadow-xl shrink-0"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink dark:text-white">{vendor.name}</h1>
                  {vendor.isFlagship ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-blue px-3 py-1 text-xs font-bold text-white shadow-md">
                      <Sparkles className="h-3.5 w-3.5" /> Flagship Verified Store
                    </span>
                  ) : vendor.isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500 border border-emerald-500/20">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified Merchant
                    </span>
                  ) : null}
                </div>

                <p className="text-xs font-semibold text-brand-blue">{vendor.category}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-brand-blue" />
                    {vendor.address}, {vendor.city}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    {vendor.rating} ({vendor.reviewCount} reviews)
                  </span>
                  <span>&bull; {vendor.salesCount} Sales</span>
                </div>
              </div>
            </div>

            {/* Store Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => setFollowing(!following)}
                variant="outline"
                className={`h-11 px-5 text-xs font-bold border-black/10 dark:border-white/10 ${
                  following ? "bg-red-500/10 text-red-500 border-red-500/30" : "text-brand-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                <Heart className={`h-4 w-4 mr-1.5 ${following ? "fill-red-500 text-red-500" : ""}`} />
                {following ? "Following Store" : "Follow Store"}
              </Button>

              <Button
                onClick={() => setContactModalOpen(true)}
                className="h-11 px-6 text-xs font-bold bg-brand-blue text-white hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20"
              >
                <MessageSquare className="h-4 w-4 mr-1.5" />
                Contact Seller
              </Button>
            </div>
          </div>

          <p className="mt-6 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-black/5 dark:border-white/10 pt-4">
            {vendor.description}
          </p>
        </div>

        {/* Products Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-brand-ink dark:text-white">Store Catalog ({vendorProducts.length})</h2>
              <p className="text-xs text-zinc-500">Products sold directly by {vendor.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {vendorProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>

          {vendorProducts.length === 0 && (
            <div className="py-16 text-center text-xs text-zinc-500 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900">
              No products currently listed for this store.
            </div>
          )}
        </div>

        {/* Customer Reviews Section */}
        <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 space-y-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-brand-ink dark:text-white">Verified Customer Reviews</h2>
              <p className="text-xs text-zinc-500">Overall Store Rating: {vendor.rating} / 5.0</p>
            </div>
            <Button onClick={() => setReviewModalOpen(true)} className="h-9 px-4 text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-brand-ink">
              Write a Review
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {vendorReviews.map((rev) => (
              <div key={rev.id} className="rounded-2xl border border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950 p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-ink dark:text-white">{rev.customerName}</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    <span>{rev.rating}</span>
                  </div>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{rev.comment}</p>
                <p className="text-[10px] text-zinc-400">{rev.date} &bull; Verified Purchase</p>
              </div>
            ))}

            {vendorReviews.length === 0 && (
              <div className="sm:col-span-2 py-8 text-center text-xs text-zinc-500">
                Be the first to leave a review for {vendor.name}!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Seller Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-black/10 dark:border-white/15 bg-white dark:bg-zinc-900 p-6 text-brand-ink dark:text-white space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
              <h2 className="text-base font-bold">Message {vendor.name}</h2>
              <button type="button" onClick={() => setContactModalOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {inquirySent ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                <p className="font-bold text-sm">Message Sent to Merchant!</p>
                <p className="text-xs text-zinc-400">The seller will reply to your account inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-500 mb-1">Your Inquiry Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ask about product availability, bulk pricing, or shipping details..."
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 p-3 text-xs focus:border-brand-blue focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setContactModalOpen(false)} className="h-10 text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="h-10 px-6 text-xs font-bold bg-brand-blue text-white hover:bg-brand-blue/90">
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Send Inquiry
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-black/10 dark:border-white/15 bg-white dark:bg-zinc-900 p-6 text-brand-ink dark:text-white space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
              <h2 className="text-base font-bold">Review {vendor.name}</h2>
              <button type="button" onClick={() => setReviewModalOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-500 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ama K. Osei"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full h-10 rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 px-3 font-semibold focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-500 mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={custRating}
                  onChange={(e) => setCustRating(Number(e.target.value))}
                  className="w-full h-10 rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 px-3 font-bold focus:border-brand-blue focus:outline-none"
                >
                  <option value={5}>5 Stars - Excellent Service</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Bad</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-500 mb-1">Comment</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share your experience buying from this store..."
                  value={custComment}
                  onChange={(e) => setCustComment(e.target.value)}
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 p-3 focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setReviewModalOpen(false)} className="h-10 text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="h-10 px-6 text-xs font-bold bg-brand-blue text-white hover:bg-brand-blue/90">
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
