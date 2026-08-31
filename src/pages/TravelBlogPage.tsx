import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Tag, 
  ArrowRight, 
  Sparkles, 
  ThumbsUp, 
  MessageSquare,
  Search,
  Plus
} from 'lucide-react';
import { INITIAL_BLOG_POSTS } from '../data/mockData';
import { BlogPost, AppUser } from '../types';

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

  const allTags = ['all', ...Array.from(new Set(INITIAL_BLOG_POSTS.flatMap(p => p.tags || [])))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'all' || (post.tags && post.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Waltair Travels Guide & Insights',
    'description': 'Travel guides, Bhogapuram airport news, Araku road trip tips, and taxi booking advice in Visakhapatnam.',
    'publisher': {
      '@type': 'Organization',
      'name': 'Waltair Travels',
    },
  };

  return (
    <>
      
      <PageLayout
        title="Travel Guides & Road Trip Insights"
        subtitle="Expert local travel advice, Bhogapuram airport transit news, seasonal travel itineraries, and scenic route recommendations."
        categoryBadge="Waltair Travel Chronicles"
        breadcrumbs={
          selectedPost
            ? [
                { label: 'Travel Blog', onClick: () => setSelectedPost(null) },
                { label: selectedPost.title },
              ]
            : [{ label: 'Travel Blog' }]
        }
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book a Tour Cab"
      >
        {selectedPost ? (
          /* Single Blog Post View */
          <article className="max-w-4xl mx-auto space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10">
            <button
              onClick={() => setSelectedPost(null)}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              ← Back to All Articles
            </button>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/50">
                  {selectedPost.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedPost.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {selectedPost.authorName} ({selectedPost.authorRole})
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {selectedPost.title}
              </h1>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 max-h-96">
              <img
                src={selectedPost.coverImage}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
              <p className="font-semibold text-slate-200 text-lg">
                {selectedPost.excerpt}
              </p>
              
              <div className="whitespace-pre-line pt-2 text-slate-300">
                {selectedPost.content}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {selectedPost.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={onOpenBooking}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Book Ride to this Destination
              </button>
            </div>
          </article>
        ) : (
          /* Blog Grid List View */
          <div className="space-y-10">
            {/* Search & Tag Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
              <div className="relative max-w-md w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search guides, routes, airport tips..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tag === 'all' ? 'All Guides' : tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Post Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-cyan-500/50 transition-all group cursor-pointer shadow-xl"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 text-[10px] font-bold text-cyan-300 uppercase tracking-wider backdrop-blur-xs border border-slate-700">
                        {post.readTime}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{post.publishedAt}</span>
                        <span>•</span>
                        <span>{post.authorName}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-800/80 mt-2 flex items-center justify-between text-xs text-cyan-400 font-bold">
                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> {post.likesCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> {post.commentsCount}
                      </span>
                    </div>

                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </PageLayout>
    </>
  );
};
