import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Tag, 
  ArrowRight, 
  ThumbsUp, 
  MessageSquare,
  Search,
  Zap,
  Clock,
  Share2,
  Bookmark
} from 'lucide-react';
import { INITIAL_BLOG_POSTS } from '../data/mockData';
import { BlogPost, AppUser } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface TravelBlogPageProps {
  onNavigateHome: () => void;
  currentUser: AppUser | null;
  onOpenAuth: () => void;
  onOpenBooking: () => void;
}

export const TravelBlogPage: React.FC<TravelBlogPageProps> = ({
  onNavigateHome,
  currentUser,
  onOpenAuth,
  onOpenBooking,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const allTags = ['all', ...Array.from(new Set(INITIAL_BLOG_POSTS.flatMap(p => p.tags || [])))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'all' || (post.tags && post.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const toggleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <PageLayout
      title="Travel Guides & Road Trip Insights"
      subtitle="Expert local travel advice, Bhogapuram airport transit updates, seasonal itineraries, and scenic route recommendations across Andhra Pradesh."
      categoryBadge="Waltair Travel Chronicles"
      breadcrumbs={
        selectedPost
          ? [
              { label: 'Travel Guides', onClick: () => setSelectedPost(null) },
              { label: selectedPost.title },
            ]
          : [{ label: 'Travel Guides' }]
      }
      onNavigateHome={onNavigateHome}
      onOpenBooking={onOpenBooking}
      ctaText="Book a Tour Cab"
      heroImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
    >
      {selectedPost ? (
        /* Single Blog Post Reading View */
        <motion.article 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto space-y-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedPost(null)}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              ← Back to All Travel Guides
            </button>
            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
              {selectedPost.category || 'Travel Guide'}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold">
                {selectedPost.readTime || '5 min read'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-700" />
                {selectedPost.date}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-teal-700" />
                {selectedPost.author}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {selectedPost.title}
            </h1>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-96 relative">
            <img
              src={selectedPost.coverImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80'}
              alt={selectedPost.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-5">
            {selectedPost.excerpt && (
              <p className="font-semibold text-slate-800 text-base sm:text-lg border-l-4 border-teal-600 pl-4 py-1 italic bg-teal-50/50 rounded-r-xl">
                {selectedPost.excerpt}
              </p>
            )}
            
            <div className="whitespace-pre-line text-slate-700 leading-relaxed font-normal">
              {selectedPost.content}
            </div>
          </div>

          {/* Tags & Action Bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {selectedPost.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-md bg-slate-100 text-slate-600 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <button
              onClick={onOpenBooking}
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Book Ride to this Destination</span>
            </button>
          </div>
        </motion.article>
      ) : (
        /* Blog Grid List View */
        <div className="space-y-12">
          
          {/* Search & Tag Filter Bar */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search guides, routes, Bhogapuram tips..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tag === 'all' ? 'All Guides' : `#${tag}`}
                </button>
              ))}
            </div>
          </div>

          {/* Post Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const isLiked = likedPosts[post.id || ''] || false;
              return (
                <motion.div
                  key={post.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedPost(post)}
                  className="rounded-3xl bg-white border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-teal-500 transition-all group cursor-pointer shadow-lg"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-slate-950">
                      <img
                        src={post.coverImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                        {post.readTime || '5 min read'}
                      </span>

                      <button
                        onClick={(e) => toggleLike(post.id || '', e)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                          isLiked ? 'bg-rose-500 text-white' : 'bg-slate-900/60 text-white hover:bg-slate-900'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      {post.category && (
                        <span className="absolute bottom-3 left-3 text-xs font-semibold text-white/90">
                          {post.category}
                        </span>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <Calendar className="w-3 h-3 text-teal-700" />
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>By {post.author}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-teal-700 font-bold">
                    <span className="text-[11px] text-slate-400 font-medium">Click to Read Full Story</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Tour Booking Callout */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-teal-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold">Inspired by Our Travel Guides?</h3>
              <p className="text-xs sm:text-sm text-teal-100">
                Book a dedicated cab with an experienced local chauffeur to take you to any of these destinations.
              </p>
            </div>
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-teal-50 font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-lg cursor-pointer"
            >
              Book Cab Now
            </button>
          </div>

        </div>
      )}
    </PageLayout>
  );
};
