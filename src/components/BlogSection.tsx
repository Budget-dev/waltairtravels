import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  Edit3, 
  Trash2, 
  Search, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  
  Image as ImageIcon,
  Share2,
  Bookmark,
  ChevronRight
} from 'lucide-react';
import { 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp,
  orderBy,
  query
} from '../firebase';
import { BlogPost, AppUser } from '../types';

interface BlogSectionProps {
  currentUser?: AppUser | null;
  onOpenAuth?: () => void;
}

const INITIAL_SEED_POSTS: BlogPost[] = [
  {
    id: 'seed-blog-1',
    title: 'Complete Guide to Bhogapuram Airport (ASI) Transfers: Fares, Route & Timings',
    excerpt: 'Everything you need to know about reaching the upcoming Alluri Sitharama Raju International Airport with dedicated express cab bookings.',
    content: `The upcoming Bhogapuram International Airport (ASI) is set to become the premier aviation gateway for Andhra Pradesh. Located approximately 42 kilometers northeast of Visakhapatnam city center along NH-16, planning your airport commute in advance ensures a hassle-free trip.

### Why Pre-Booking Your Airport Cab Matters
1. **Distance & Travel Time:** The commute from Siripuram, Gajuwaka, or Rushikonda takes roughly 45 to 65 minutes depending on traffic. Pre-booking guarantees on-time doorstep pickup.
2. **Fixed Toll-Inclusive Pricing:** Waltair Travels offers transparent upfront pricing with zero surge charges and toll inclusions for the Tagarapuvalasa plaza.
3. **Flight Delay Adjustments:** Our dispatch team monitors incoming flight tracking so your chauffeur is stationed at the arrivals bay even if your flight lands ahead or behind schedule.

### Recommended Vehicle Classes
* **Sedan (Dzire / Etios):** Ideal for solo travelers and couples with up to 2 large suitcases.
* **Innova Crysta / SUV:** Perfect for families or business delegates carrying excess luggage.
* **12-Seater Tempo Traveller:** Best suited for corporate teams and wedding delegations.`,
    author: 'Suresh Varma',
    authorEmail: 'suresh@waltairtravels.com',
    date: '2025-05-10',
    category: 'Airport & Commute',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'seed-blog-2',
    title: 'Vizag to Araku Valley Road Trip: 7 Scenic Stops, Borra Caves & Coffee Trails',
    excerpt: 'Discover the winding Eastern Ghats with our curated 2-day cab itinerary covering Tyda, Katiki Waterfalls, and Chaparai rapids.',
    content: `A road trip from Visakhapatnam to Araku Valley through the misty Eastern Ghats is one of South India's most celebrated road journeys. Covering 115 kilometers of smooth ghat roads, this tour is best enjoyed with an experienced local driver.

### Top Stops Along the Route:
1. **Tyda Jungle Bells Nature Camp:** A peaceful eco-tourism haven for bird watching and breakfast.
2. **Ananthagiri Coffee Plantations:** Breath in fresh organic Arabica coffee aroma with breathtaking valley viewpoints.
3. **Borra Caves:** Million-year-old limestone formations featuring naturally sculpted stalactites and stalagmites illuminated in vibrant hues.
4. **Katiki Waterfalls:** A short jeep excursion off the main highway leading to crystal clear natural cascading pools.
5. **Chaparai Water Cascades:** Scenic picnic spot surrounded by lush forest rock beds.

### Travel Tips from Our Drivers:
* Start early by 6:00 AM from Vizag to beat city traffic and catch the morning mist atop Galikonda viewpoint.
* Ask your Waltair Travels driver to stop for authentic bamboo chicken and Araku honey tastings!`,
    author: 'K. Satish',
    authorEmail: 'satish.driver@waltairtravels.com',
    date: '2025-05-02',
    category: 'Travel Itineraries',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'seed-blog-3',
    title: 'Top 5 Tips for Booking Reliable Outstation Cabs Across Andhra Pradesh',
    excerpt: 'Avoid hidden driver allowances, night charges, and vehicle breakdown risks with our straightforward traveler checklist.',
    content: `When booking intercity cabs between Vizag, Vijayawada, Rajahmundry, Kakinada, or Bhubaneswar, having complete clarity on fare structures ensures a relaxed journey.

### 1. Inquire About Driver Batta & Night Allowances
Always confirm whether the quoted fare includes driver night allowances (typically applied between 10 PM and 6 AM) and daily food batta. At Waltair Travels, all outstation quotes clearly separate base per-km rates from optional driver allowances.

### 2. Check Vehicle Fitness & Commercial Permits
Ensure your cab holds a valid commercial yellow plate (AP 31 / AP 39 registration) with active tourist road tax and comprehensive insurance. This prevents unexpected checkpoints delays at state borders.

### 3. One-Way vs Roundtrip Tariffs
If you are only traveling in one direction (e.g. Vizag to Rajahmundry for a flight or meeting), choose dedicated one-way drop fares so you don't pay dead-mileage return costs.`,
    author: 'Priya Sharma',
    authorEmail: 'priya.s@travelwriter.in',
    date: '2025-04-26',
    category: 'Outstation Tips',
    readTime: '3 min read',
    coverImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80'
  }
];

const CATEGORIES = ['All Posts', 'Airport & Commute', 'Travel Itineraries', 'Outstation Tips', 'Local Vizag'];

export const BlogSection: React.FC<BlogSectionProps> = ({ currentUser, onOpenAuth }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Posts');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [activeReadingPost, setActiveReadingPost] = useState<BlogPost | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Editor Form Fields
  const [formTitle, setFormTitle] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  const [formAuthor, setFormAuthor] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Travel Itineraries');
  const [formDate, setFormDate] = useState<string>('');
  const [formExcerpt, setFormExcerpt] = useState<string>('');
  const [formCoverImage, setFormCoverImage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  // 1. Fetch & Listen to Real-time Blog Posts
  const fetchPosts = async () => {
    try {
      const q = collection(db, 'blog_posts');
      const snap = await getDocs(q);
      const items: BlogPost[] = [];
      snap.forEach(d => {
        items.push({ id: d.id, ...d.data() } as BlogPost);
      });

      // Also read local fallback
      const local = JSON.parse(localStorage.getItem('waltair_blog_posts') || '[]');
      const combined = [...items, ...local.filter((l: BlogPost) => !items.some(i => i.id === l.id))];

      if (combined.length === 0) {
        // Seed initial articles
        setPosts(INITIAL_SEED_POSTS);
        localStorage.setItem('waltair_blog_posts', JSON.stringify(INITIAL_SEED_POSTS));
        // Try writing initial seeds to Firestore in background
        INITIAL_SEED_POSTS.forEach(async (p) => {
          try {
            await addDoc(collection(db, 'blog_posts'), {
              ...p,
              createdAt: serverTimestamp ? serverTimestamp() : new Date().toISOString()
            });
          } catch (e) {
            // ignore
          }
        });
      } else {
        setPosts(combined);
      }
    } catch (err) {
      console.warn('Firestore blog fetch fallback:', err);
      const local = JSON.parse(localStorage.getItem('waltair_blog_posts') || '[]');
      setPosts(local.length > 0 ? local : INITIAL_SEED_POSTS);
    }
  };

  useEffect(() => {
    fetchPosts();

    try {
      const unsubscribe = onSnapshot(collection(db, 'blog_posts'), (snapshot) => {
        const items: BlogPost[] = [];
        snapshot.forEach(docSnap => {
          items.push({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        });
        if (items.length > 0) {
          setPosts(items);
          localStorage.setItem('waltair_blog_posts', JSON.stringify(items));
        }
      }, (err) => {
        console.warn('Blog snapshot listener info:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      // ignore
    }
  }, []);

  // 2. Open Editor for Creating a New Post
  const handleOpenCreate = () => {
    setEditingPostId(null);
    setFormTitle('');
    setFormContent('');
    setFormAuthor(currentUser?.name || 'Waltair Traveler');
    setFormCategory('Travel Itineraries');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormExcerpt('');
    setFormCoverImage('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80');
    setFormError('');
    setFormSuccess(false);
    setIsEditorOpen(true);
  };

  // 3. Open Editor for Editing an Existing Post
  const handleOpenEdit = (post: BlogPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPostId(post.id || null);
    setFormTitle(post.title);
    setFormContent(post.content);
    setFormAuthor(post.author);
    setFormCategory(post.category || 'Travel Itineraries');
    setFormDate(post.date || new Date().toISOString().split('T')[0]);
    setFormExcerpt(post.excerpt || '');
    setFormCoverImage(post.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80');
    setFormError('');
    setFormSuccess(false);
    setIsEditorOpen(true);
    if (activeReadingPost) {
      setActiveReadingPost(null);
    }
  };

  // 4. Delete Post
  const handleDeletePost = async (post: BlogPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm(`Are you sure you want to delete "${post.title}"?`);
    if (!confirmed) return;

    try {
      if (post.id && !post.id.startsWith('seed-')) {
        await deleteDoc(doc(db, 'blog_posts', post.id));
      }
    } catch (err) {
      console.warn('Firestore blog delete fallback:', err);
    }

    // Update local state
    const updated = posts.filter(p => p.id !== post.id);
    setPosts(updated);
    localStorage.setItem('waltair_blog_posts', JSON.stringify(updated));
    if (activeReadingPost?.id === post.id) {
      setActiveReadingPost(null);
    }
  };

  // 5. Save (Create / Update) Post
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim() || !formAuthor.trim()) {
      setFormError('Please fill in Title, Content, and Author name.');
      return;
    }

    setIsSaving(true);
    setFormError('');

    const wordCount = formContent.trim().split(/\s+/).length;
    const estTime = `${Math.max(1, Math.ceil(wordCount / 180))} min read`;
    const finalExcerpt = formExcerpt.trim() || formContent.substring(0, 140).trim() + '...';

    const postPayload: BlogPost = {
      title: formTitle.trim(),
      content: formContent.trim(),
      author: formAuthor.trim(),
      authorEmail: currentUser?.email || undefined,
      date: formDate || new Date().toISOString().split('T')[0],
      category: formCategory,
      excerpt: finalExcerpt,
      readTime: estTime,
      coverImage: formCoverImage.trim() || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      updatedAt: serverTimestamp ? serverTimestamp() : new Date().toISOString(),
    };

    try {
      if (editingPostId && !editingPostId.startsWith('seed-')) {
        // Update existing Firestore doc
        await updateDoc(doc(db, 'blog_posts', editingPostId), { ...postPayload });
        const updatedList = posts.map(p => p.id === editingPostId ? { ...postPayload, id: editingPostId } : p);
        setPosts(updatedList);
        localStorage.setItem('waltair_blog_posts', JSON.stringify(updatedList));
      } else {
        // Create new Firestore doc
        const docRef = await addDoc(collection(db, 'blog_posts'), {
          ...postPayload,
          createdAt: serverTimestamp ? serverTimestamp() : new Date().toISOString()
        });
        const newPost = { ...postPayload, id: docRef.id };
        const updatedList = [newPost, ...posts];
        setPosts(updatedList);
        localStorage.setItem('waltair_blog_posts', JSON.stringify(updatedList));
      }

      setFormSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
        setIsEditorOpen(false);
      }, 700);
    } catch (err: any) {
      console.warn('Firestore blog write fallback:', err);
      // Fallback save locally
      const localId = editingPostId || `local-${Date.now()}`;
      const savedPost = { ...postPayload, id: localId };
      const updatedList = editingPostId 
        ? posts.map(p => p.id === editingPostId ? savedPost : p)
        : [savedPost, ...posts];
      setPosts(updatedList);
      localStorage.setItem('waltair_blog_posts', JSON.stringify(updatedList));
      setFormSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
        setIsEditorOpen(false);
      }, 700);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All Posts' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="py-16 md:py-24 bg-slate-950 text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Travel Insights & Guides</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Waltair Travels Blog & Road Stories
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Practical airport taxi guides, scenic Araku road trip itineraries, and local Visakhapatnam travel secrets written by our chauffeurs and community.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              id="write-blog-post-btn"
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-900/30 hover:scale-105 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Post</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
          
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-cyan-600 text-white font-bold shadow-xs' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles & routes..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">No blog posts found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Try choosing another category or be the first to publish a new travel guide!
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-semibold text-xs"
            >
              Write First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <article 
                key={post.id}
                onClick={() => setActiveReadingPost(post)}
                className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 hover:shadow-xl transition-all cursor-pointer flex flex-col group"
              >
                {/* Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                  <img 
                    src={post.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'} 
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs text-cyan-300 text-[11px] font-semibold uppercase tracking-wider border border-white/10">
                      {post.category || 'Travel Guide'}
                    </span>
                  </div>

                  {/* Quick Action Overlay (Edit/Delete) */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleOpenEdit(post, e)}
                      className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-cyan-700 text-white transition-colors"
                      title="Edit Post"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeletePost(post, e)}
                      className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-rose-600 text-white transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {post.readTime || '4 min read'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Author & Read More */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-cyan-800 text-cyan-200 flex items-center justify-center text-xs font-bold">
                        {post.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-slate-300 truncate max-w-[120px]">
                        {post.author}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Story</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* 1. ARTICLE READER MODAL */}
      {activeReadingPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase">
                  {activeReadingPost.category || 'Travel Article'}
                </span>
                <span className="text-xs text-slate-400">• {activeReadingPost.readTime || '4 min read'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(activeReadingPost)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeletePost(activeReadingPost)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-white transition-colors"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveReadingPost(null)}
                  className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Article Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {/* Cover Banner */}
              {activeReadingPost.coverImage && (
                <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-800">
                  <img 
                    src={activeReadingPost.coverImage} 
                    alt={activeReadingPost.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title & Author Info */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {activeReadingPost.title}
                </h1>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800 text-xs sm:text-sm text-slate-400">
                  <div className="w-9 h-9 rounded-full bg-cyan-700 text-white flex items-center justify-center font-bold text-sm">
                    {activeReadingPost.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white">{activeReadingPost.author}</div>
                    <div className="text-xs text-slate-500">Published on {activeReadingPost.date}</div>
                  </div>
                </div>
              </div>

              {/* Content Formatted Paragraphs */}
              <div className="prose prose-invert prose-cyan max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
                {activeReadingPost.content}
              </div>

              {/* Bottom Call to Action for Booking */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[#005a66] to-slate-900 border border-cyan-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-base">Planning this route soon?</h4>
                  <p className="text-xs text-cyan-200 mt-0.5">Book guaranteed air-conditioned cabs with 24x7 doorstep dispatch.</p>
                </div>
                <a
                  href="#home"
                  onClick={() => setActiveReadingPost(null)}
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-cyan-100 transition-colors whitespace-nowrap"
                >
                  Book This Cab Now
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 2. POST CREATOR / EDITOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden relative">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-950 via-[#005a66] to-slate-950 p-5 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-0.5">
                                    <span>Waltair Editorial Desk</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {editingPostId ? 'Edit Travel Blog Post' : 'Create New Travel Blog Post'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePost} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {formError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Blog post saved successfully to Firebase!</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Article Headline / Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Navigating Bhogapuram Airport Transfers: Fares & Timings"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Airport & Commute">Airport & Commute</option>
                    <option value="Travel Itineraries">Travel Itineraries</option>
                    <option value="Outstation Tips">Outstation Tips</option>
                    <option value="Local Vizag">Local Vizag</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Publication Date *</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              {/* Author Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Author Name *</label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="e.g. Ramesh Varma"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formCoverImage}
                    onChange={(e) => setFormCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Excerpt / Preview Summary</label>
                <input
                  type="text"
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="A short 1-2 sentence preview shown on article cards..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Article Content (Markdown or Text) *</label>
                <textarea
                  rows={8}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write the full travel guide, tips, scenic stops, and chauffeur insights here..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500 font-mono"
                  required
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs sm:text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <span>Saving to Firebase...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingPostId ? 'Update Blog Post' : 'Publish Blog Post'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
