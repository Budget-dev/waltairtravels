import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  Search, 
  ArrowRight, 
  X, 
  CheckCircle2, 
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
  serverTimestamp 
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
2. **Fixed Toll-Inclusive Pricing:** Waltair Cabs offers transparent upfront pricing with zero surge charges and toll inclusions for the Tagarapuvalasa plaza.
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
* Ask your Waltair Cabs driver to stop for authentic bamboo chicken and Araku honey tastings!`,
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
Always confirm whether the quoted fare includes driver night allowances (typically applied between 10 PM and 6 AM) and daily food batta. At Waltair Cabs, all outstation quotes clearly separate base per-km rates from optional driver allowances.

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

      const local = JSON.parse(localStorage.getItem('waltair_blog_posts') || '[]');
      const combined = [...items, ...local.filter((l: BlogPost) => !items.some(i => i.id === l.id))];

      if (combined.length === 0) {
        setPosts(INITIAL_SEED_POSTS);
        localStorage.setItem('waltair_blog_posts', JSON.stringify(INITIAL_SEED_POSTS));
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

  // Open Editor for Creating a New Post
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

  // Open Editor for Editing an Existing Post
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

  // Delete Post
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

    const updated = posts.filter(p => p.id !== post.id);
    setPosts(updated);
    localStorage.setItem('waltair_blog_posts', JSON.stringify(updated));
    if (activeReadingPost?.id === post.id) {
      setActiveReadingPost(null);
    }
  };

  // Save (Create / Update) Post
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
        await updateDoc(doc(db, 'blog_posts', editingPostId), { ...postPayload });
        const updatedList = posts.map(p => p.id === editingPostId ? { ...postPayload, id: editingPostId } : p);
        setPosts(updatedList);
        localStorage.setItem('waltair_blog_posts', JSON.stringify(updatedList));
      } else {
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
    <section id="blog" className="py-16 sm:py-20 bg-white text-slate-900 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold mb-2.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Travel Guides & Driver Insights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Waltair Cabs Blog & Road Guides
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Practical airport transfers, scenic Araku itineraries, and local Vizag travel secrets written by our chauffeurs.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="write-blog-post-btn"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Guide</span>
          </motion.button>
        </div>

        {/* Filter Tabs and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 shadow-xs">
          
          {/* Category Chips with Animated Pill */}
          <div className="relative flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative z-10 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                    isActive ? 'text-teal-950 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{cat}</span>
                  {isActive && (
                    <motion.div
                      layoutId="blogCatTab"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      className="absolute inset-0 bg-teal-50 text-teal-800 rounded-xl border border-teal-200/80 -z-10 shadow-2xs"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides & routes..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No blog articles found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-3">
              Try selecting another category or write a new travel story.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-teal-800 text-white font-semibold text-xs hover:bg-teal-900 cursor-pointer"
            >
              Write First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredPosts.map(post => (
              <motion.article 
                key={post.id}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => setActiveReadingPost(post)}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden hover:border-teal-400/80 hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-300 cursor-pointer flex flex-col group"
              >
                {/* Preserved Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={post.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'} 
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-teal-800 text-[11px] font-bold shadow-xs">
                      {post.category || 'Travel Guide'}
                    </span>
                  </div>

                  {/* Actions overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleOpenEdit(post, e)}
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-teal-800 shadow-sm transition-colors cursor-pointer"
                      title="Edit Post"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeletePost(post, e)}
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 shadow-sm transition-colors cursor-pointer"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-teal-700" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-teal-700" />
                        {post.readTime || '4 min read'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors line-clamp-2 mb-2 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Author & Read CTA */}
                  <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">
                        {post.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                        {post.author}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-teal-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Story</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>

      {/* 1. ARTICLE READER MODAL */}
      <AnimatePresence>
        {activeReadingPost && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase">
                    {activeReadingPost.category || 'Travel Article'}
                  </span>
                  <span className="text-xs text-slate-500">• {activeReadingPost.readTime || '4 min read'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(activeReadingPost)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeletePost(activeReadingPost)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveReadingPost(null)}
                    className="p-1.5 rounded-full hover:bg-slate-200/60 text-slate-500 transition-colors ml-1 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
                {activeReadingPost.coverImage && (
                  <div className="h-60 sm:h-72 rounded-2xl overflow-hidden bg-slate-100">
                    <img 
                      src={activeReadingPost.coverImage} 
                      alt={activeReadingPost.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {activeReadingPost.title}
                  </h1>

                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      {activeReadingPost.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{activeReadingPost.author}</div>
                      <div>Published on {activeReadingPost.date}</div>
                    </div>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-3 whitespace-pre-line">
                  {activeReadingPost.content}
                </div>

                <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white text-base">Traveling this route?</h4>
                    <p className="text-xs text-teal-200 mt-0.5">Book guaranteed air-conditioned cabs with 24/7 doorstep dispatch.</p>
                  </div>
                  <a
                    href="#home"
                    onClick={() => setActiveReadingPost(null)}
                    className="px-5 py-2.5 rounded-xl bg-white text-teal-950 font-bold text-xs sm:text-sm hover:bg-teal-50 transition-colors whitespace-nowrap"
                  >
                    Book Cab
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. POST CREATOR / EDITOR MODAL */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative"
            >
              <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-5 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {editingPostId ? 'Edit Travel Guide' : 'Write a Travel Guide'}
                  </h3>
                  <p className="text-xs text-teal-200 mt-0.5">Share road advice, itineraries, and taxi tips</p>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePost} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {formError}
                  </div>
                )}

                {formSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Saved successfully!</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Article Headline *</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Navigating Bhogapuram Airport Transfers: Fares & Timings"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 bg-slate-50"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 bg-slate-50"
                    >
                      <option value="Airport & Commute">Airport & Commute</option>
                      <option value="Travel Itineraries">Travel Itineraries</option>
                      <option value="Outstation Tips">Outstation Tips</option>
                      <option value="Local Vizag">Local Vizag</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 bg-slate-50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Author Name *</label>
                    <input
                      type="text"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      placeholder="e.g. Ramesh Varma"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 bg-slate-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image URL</label>
                    <input
                      type="url"
                      value={formCoverImage}
                      onChange={(e) => setFormCoverImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Short Excerpt / Preview</label>
                  <input
                    type="text"
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    placeholder="Short 1-2 sentence preview..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Article Content *</label>
                  <textarea
                    rows={6}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Write your article content here..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 bg-slate-50 font-sans"
                    required
                  ></textarea>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : editingPostId ? 'Update Guide' : 'Publish Guide'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
