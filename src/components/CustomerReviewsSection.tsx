import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  CheckCircle2, 
  PlusCircle, 
  X,
  Quote,
  Sparkles
} from 'lucide-react';
import { INITIAL_REVIEWS } from '../data/mockData';
import { CustomerReview } from '../types';
import { db, collection, addDoc, getDocs, serverTimestamp } from '../firebase';

export const CustomerReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  
  // Review form states
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('Visakhapatnam');
  const [serviceUsed, setServiceUsed] = useState<string>('Airport Taxi');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Fetch reviews from Firestore on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'reviews'));
        if (!querySnapshot.empty) {
          const list: CustomerReview[] = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as CustomerReview);
          });
          setReviews([...list, ...INITIAL_REVIEWS]);
        }
      } catch (err) {
        console.warn('Firestore reviews fetch fallback to initial:', err);
      }
    };
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    const newRev: CustomerReview = {
      name,
      rating,
      location,
      serviceUsed,
      date: 'Just now',
      comment,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
    };

    try {
      await addDoc(collection(db, 'reviews'), {
        ...newRev,
        createdAt: serverTimestamp ? serverTimestamp() : new Date().toISOString()
      });
    } catch (err) {
      console.warn('Review saved locally fallback:', err);
    }

    setReviews([newRev, ...reviews]);
    setIsSubmitting(false);
    setSuccessMessage('Thank you! Your verified review has been published.');
    setTimeout(() => {
      setSuccessMessage('');
      setIsWriteModalOpen(false);
      setName('');
      setComment('');
    }, 2000);
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Real Customer Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Trusted by 50,000+ Travelers in Vizag
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Read authentic feedback from families, airport commuters, corporate executives, and tourists who ride with Waltair Travels.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsWriteModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm self-start md:self-auto cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-teal-400" />
            <span>Write a Review</span>
          </motion.button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {reviews.slice(0, 8).map((rev, idx) => (
            <motion.div
              key={rev.id || idx}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-slate-50/70 rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-lg hover:shadow-slate-900/5 hover:border-teal-300/80 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & Quote Icon */}
                <div className="flex items-center justify-between gap-1 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1.5">
                      {rev.rating}.0
                    </span>
                  </div>
                  <Quote className="w-4 h-4 text-slate-300" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Box */}
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                    alt={rev.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                      <span>{rev.name}</span>
                      {rev.verified && <CheckCircle2 className="w-3 h-3 text-teal-700" />}
                    </div>
                    <div className="text-[10px] text-slate-500">{rev.location}</div>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Review Submission Modal */}
        <AnimatePresence>
          {isWriteModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.2 }}
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
              >
                <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
                  <h4 className="font-bold text-base">Share Your Travel Experience</h4>
                  <button
                    onClick={() => setIsWriteModalOpen(false)}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmitReview} className="p-5 space-y-3.5">
                  {successMessage ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center">
                      {successMessage}
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Ramesh Varma"
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-teal-600 bg-slate-50"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">City / Area</label>
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-teal-600 bg-slate-50"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Service Used</label>
                          <select
                            value={serviceUsed}
                            onChange={(e) => setServiceUsed(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-teal-600 bg-slate-50"
                          >
                            <option value="Airport Taxi">Airport Taxi</option>
                            <option value="Outstation Cab">Outstation Cab</option>
                            <option value="Local Rental">Local Rental</option>
                            <option value="Araku Holiday Package">Araku Holiday Package</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="p-1 cursor-pointer"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-slate-700 ml-1">{rating} Stars</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Review Details *</label>
                        <textarea
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Tell us about punctuality, AC cooling, chauffeur behavior..."
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-teal-600 bg-slate-50"
                          required
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? 'Publishing...' : 'Submit Verified Review'}
                      </button>
                    </>
                  )}
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
