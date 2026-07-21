"use client";

import { useState } from "react";
import { Star, ThumbsUp, ShieldCheck, Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  comment: string;
  helpfulCount: number;
  userLiked?: boolean;
}

const mockReviews: ReviewItem[] = [
  {
    id: "r1",
    author: "Kwame Osei",
    rating: 5,
    date: "14 July 2026",
    verified: true,
    title: "100% Genuine Apple Ghana stock!",
    comment: "Purchased the iPhone 16 Pro Max from TroyX iStore in East Legon. Delivery was completed within 3 hours. Came with official 12-month Apple warranty card.",
    helpfulCount: 24
  },
  {
    id: "r2",
    author: "Ama Serwaa",
    rating: 5,
    date: "02 July 2026",
    verified: true,
    title: "Incredible battery life & performance",
    comment: "The M3 MacBook Pro is a beast for video editing in 4K. Paystack mobile money payment went through smoothly.",
    helpfulCount: 18
  },
  {
    id: "r3",
    author: "Kofi Mensah",
    rating: 4,
    date: "28 June 2026",
    verified: true,
    title: "Fast delivery to Kumasi",
    comment: "Package arrived in Kumasi via VIP courier within 24 hours. Well packaged and sealed.",
    helpfulCount: 9
  }
];

export function ProductReviews({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(mockReviews);
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"recent" | "helpful">("helpful");

  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [authorInput, setAuthorInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [ratingInput, setRatingInput] = useState(5);

  const toggleHelpful = (id: string) => {
    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const userLiked = !r.userLiked;
          return {
            ...r,
            userLiked,
            helpfulCount: userLiked ? r.helpfulCount + 1 : r.helpfulCount - 1
          };
        }
        return r;
      })
    );
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorInput || !commentInput) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: authorInput,
      rating: ratingInput,
      date: "Today",
      verified: true,
      title: titleInput || "Verified Product Review",
      comment: commentInput,
      helpfulCount: 0
    };

    setReviewsList([newRev, ...reviewsList]);
    setWriteModalOpen(false);
    setAuthorInput("");
    setTitleInput("");
    setCommentInput("");
  };

  const filtered = reviewsList
    .filter((r) => (filterRating === "all" ? true : r.rating === filterRating))
    .sort((a, b) => (sortBy === "helpful" ? b.helpfulCount - a.helpfulCount : 0));

  return (
    <div className="space-y-8">
      {/* Breakdown Header */}
      <div className="grid gap-6 sm:grid-cols-3 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <div className="flex flex-col justify-center items-center text-center border-b sm:border-b-0 sm:border-r border-black/5 dark:border-white/10 pb-4 sm:pb-0">
          <p className="text-4xl font-extrabold text-brand-ink dark:text-white">{rating}</p>
          <div className="flex items-center gap-1 text-amber-500 my-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs text-zinc-500">{reviewCount} Verified Reviews</p>
        </div>

        <div className="space-y-1.5 text-xs flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="w-3 font-semibold text-zinc-500">{star}★</span>
              <div className="h-2 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${star === 5 ? 85 : star === 4 ? 12 : 3}%` }}
                />
              </div>
              <span className="w-8 text-right text-[10px] text-zinc-400">{star === 5 ? "85%" : star === 4 ? "12%" : "3%"}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-center items-center text-center sm:border-l border-black/5 dark:border-white/10 pt-4 sm:pt-0 space-y-2">
          <p className="text-xs font-bold text-brand-ink dark:text-white">Have you used this device?</p>
          <Button onClick={() => setWriteModalOpen(true)} className="h-10 px-5 text-xs font-bold bg-brand-blue text-white">
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
            Write a Review
          </Button>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-4 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Filter rating:</span>
          {["all", 5, 4, 3].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => setFilterRating(val as any)}
              className={`px-3 py-1 rounded-xl transition ${
                filterRating === val
                  ? "bg-brand-blue text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {val === "all" ? "All Stars" : `${val} Stars`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-8 rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 px-2 text-xs font-bold focus:outline-none"
          >
            <option value="helpful">Most Helpful</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid gap-4">
        {filtered.map((rev) => (
          <div key={rev.id} className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand-ink dark:text-white">{rev.author}</span>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-extrabold text-emerald-500 border border-emerald-500/20">
                    <ShieldCheck className="h-3 w-3" /> Verified Purchase
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-400">{rev.date}</span>
            </div>

            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
              ))}
            </div>

            <h4 className="font-bold text-brand-ink dark:text-white">{rev.title}</h4>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{rev.comment}</p>

            <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Was this review helpful?</span>
              <button
                type="button"
                onClick={() => toggleHelpful(rev.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full border transition ${
                  rev.userLiked
                    ? "border-brand-blue bg-brand-blue/10 text-brand-blue font-bold"
                    : "border-black/10 dark:border-white/10 text-zinc-500 hover:text-white"
                }`}
              >
                <ThumbsUp className="h-3 w-3" />
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {writeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-black/10 dark:border-white/15 bg-white dark:bg-zinc-900 p-6 text-brand-ink dark:text-white space-y-4">
            <h2 className="text-base font-bold">Write a Verified Customer Review</h2>
            <form onSubmit={handleAddReview} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-500 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kwame Mensah"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  className="w-full h-10 rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 px-3 font-semibold focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-500 mb-1">Rating</label>
                <select
                  value={ratingInput}
                  onChange={(e) => setRatingInput(Number(e.target.value))}
                  className="w-full h-10 rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 px-3 font-bold focus:border-brand-blue focus:outline-none"
                >
                  <option value={5}>5 Stars - Excellent Product</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Below Expectations</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-500 mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Authentic product and fast delivery!"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full h-10 rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 px-3 focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-500 mb-1">Your Review</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details about performance, packaging, and delivery..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 p-3 focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setWriteModalOpen(false)} className="h-10 text-xs">
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
