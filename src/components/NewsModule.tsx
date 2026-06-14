import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { NewsPost } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, MessageCircle, PlayCircle, Eye, Calendar, User, Tag, X } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export default function NewsModule() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  
  // News pop-up modal
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  
  // Highlight Video Modal state
  const [videoEmbedUrl, setVideoEmbedUrl] = useState<string | null>(null);

  // Fetch News in Real-time from Firestore
  useEffect(() => {
    const colName = 'news';
    const unsubscribe = onSnapshot(
      collection(db, colName),
      (snapshot) => {
        const list: NewsPost[] = [];
        snapshot.forEach((doc) => {
          list.push({ ...doc.data() as NewsPost, newsId: doc.id });
        });
        // Sort by youngest news first
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNews(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, colName);
      }
    );

    return () => unsubscribe();
  }, []);

  const textPosts = news.filter(n => !n.videoUrl);
  const videoClips = news.filter(n => n.videoUrl);

  const formatPostDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#0B0F19] text-white">
      {/* Background Grids overlay */}
      <div className="absolute inset-0 bg-[#0F172A] bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] bg-[size:32px_32px] opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12 relative z-10">
        
        {/* HIGHLIGH REELS & VIDEO CLIPS GALLERY (CYBERPUNK GLOW GRID) */}
        {videoClips.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 border-l-2 border-[#A855F7] pl-4 text-left">
              <span className="text-[10px] text-[#A855F7] font-mono tracking-widest uppercase font-black">{language === 'pt' ? 'REEL DE HIGHLIGHTS & CLUTCHES' : 'HIGHLIGHT REELS & OUTSTANDING CLUTCHES'}</span>
              <h3 className="text-xl md:text-2xl font-sans font-black uppercase text-white tracking-tight">
                {language === 'pt' ? 'Melhores Jogadas' : 'Best Highlights'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                [1, 2].map(i => (
                  <div key={i} className="aspect-video rounded-xl bg-slate-900/40 animate-pulse" />
                ))
              ) : (
                videoClips.map((clip) => (
                  <div
                    key={clip.newsId}
                    className="group relative rounded-xl overflow-hidden border border-purple-500/10 hover:border-purple-500/30 bg-slate-950 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                    onClick={() => clip.videoUrl && setVideoEmbedUrl(clip.videoUrl)}
                  >
                    {/* Video Cover */}
                    <div className="relative aspect-video w-full overflow-hidden bg-black">
                      <img
                        src={clip.image}
                        alt={clip.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:blur-[1px]"
                      />
                      {/* Black gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      
                      {/* Play Button Icon Glow */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]" />
                      </div>
                    </div>

                    <div className="p-4 flex flex-col gap-1 text-left">
                      <div className="flex justify-between text-[9px] font-mono text-purple-400">
                        <span>@{clip.author}</span>
                        <span>{formatPostDate(clip.createdAt)}</span>
                      </div>
                      <h4 className="text-sm font-sans font-extrabold uppercase text-gray-100 group-hover:text-purple-300 transition-colors duration-200 mt-1 pb-1">
                        {clip.title}
                      </h4>
                      <p className="text-xs font-mono text-gray-500 line-clamp-2 mt-1">
                        {clip.excerpt}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* RECENT SCRIM NEWS & META WEAPONS FEED */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 border-l-2 border-[#22C55E] pl-4 text-left">
            <span className="text-[10px] text-[#22C55E] font-mono tracking-widest uppercase font-black">{language === 'pt' ? 'FEED DE NOTÍCIAS ESPORTS & PATCH NOTES' : 'ESPORTS NEWS FEED & PATCH UPDATES'}</span>
            <h3 className="text-xl md:text-2xl font-sans font-black uppercase text-white tracking-tight">
              {language === 'pt' ? 'Análises & Informativos' : 'Analyzes & News Feed'}
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loading ? (
              [1, 2].map(i => (
                <div key={i} className="h-64 rounded-xl bg-slate-900/40 animate-pulse" />
              ))
            ) : textPosts.length === 0 ? (
              <div className="col-span-full py-12 border border-dashed border-purple-500/10 text-center text-gray-500 font-mono text-xs rounded-2xl">
                {language === 'pt' ? 'Nenhuma novidade listada no painel. Volte em breve!' : 'No news updates posted yet. Come back later!'}
              </div>
            ) : (
              textPosts.map((post) => (
                <div
                  key={post.newsId}
                  className="flex flex-col sm:flex-row rounded-2xl border border-purple-500/10 bg-slate-950/60 overflow-hidden hover:border-purple-500/20 transition-all duration-300 group"
                >
                  <div className="w-full sm:w-2/5 aspect-video sm:aspect-auto relative min-h-[160px] bg-slate-900 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                    <div className="absolute top-3 left-3 bg-[#0B0F19]/90 border border-purple-500/15 text-purple-300 py-1 px-2.5 rounded text-[10px] font-mono uppercase">
                      {post.category}
                    </div>
                  </div>

                  <div className="w-full sm:w-3/5 p-5 flex flex-col justify-between text-left gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-500 text-[10px] font-mono">
                        <User className="w-3.5 h-3.5" />
                        <span>{language === 'pt' ? 'Por' : 'By'} <b>{post.author}</b></span>
                        <span>•</span>
                        <span>{formatPostDate(post.createdAt)}</span>
                      </div>

                      <h4 className="text-sm font-sans font-black uppercase text-gray-100 group-hover:text-purple-400 transition-colors duration-200 mt-1 line-clamp-2">
                        {post.title}
                      </h4>

                      <p className="text-xs font-mono text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedPost(post)}
                      className="text-xs font-mono font-bold leading-none text-[#22C55E] hover:text-[#22C55E]/80 transition-colors self-start pb-1 outline-none relative mt-1"
                    >
                      [{language === 'pt' ? ' LER ANÁLISE COMPLETA ' : ' READ FULL ANALYSIS '}]
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>

      {/* MODAL WINDOW FOR TEXT READING */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-950 border border-purple-500/30 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 max-h-[85vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category badge */}
            <span className="bg-purple-600/10 border border-purple-500/30 text-purple-400 px-3 py-1 rounded-full text-[10px] font-mono uppercase self-start leading-none mt-1">
              {selectedPost.category}
            </span>

            <div className="text-left flex flex-col gap-2">
              <h3 className="text-xl md:text-2xl font-sans font-black text-white uppercase tracking-tight">
                {selectedPost.title}
              </h3>
              
              <div className="flex gap-4 text-gray-500 text-xs font-mono border-b border-purple-500/10 pb-4">
                <span>{language === 'pt' ? 'Autor' : 'Author'}: <b>{selectedPost.author}</b></span>
                <span>•</span>
                <span>{formatPostDate(selectedPost.createdAt)}</span>
              </div>
            </div>

            {/* Post image cover */}
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-purple-500/10 relative">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Full Post text Content */}
            <div className="text-left text-sm font-mono text-gray-300 leading-relaxed space-y-4 whitespace-pre-wrap">
              {selectedPost.content}
            </div>

            <button
              onClick={() => setSelectedPost(null)}
              className="mt-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-mono text-xs font-bold uppercase transition select-none cursor-pointer text-center"
            >
              {language === 'pt' ? 'Fechar Leitura' : 'Close Article'}
            </button>
          </div>
        </div>
      )}

      {/* HIGHLIGH VIDEO REEL DETAILED WINDOW */}
      {videoEmbedUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#0B0F19] border border-purple-500/40 rounded-2xl p-2 shadow-2xl aspect-video flex items-center justify-center">
            
            <button
              onClick={() => setVideoEmbedUrl(null)}
              className="absolute -top-12 right-0 flex items-center gap-1.5 text-gray-400 hover:text-white font-mono text-xs uppercase cursor-pointer"
            >
              <X className="w-4 h-4" /> [{language === 'pt' ? ' Fechar Vídeo ' : ' Close Video '}]
            </button>

            {/* Embedded Iframe Player */}
            <iframe
              src={videoEmbedUrl}
              title="PUBG Mobile Scrim Highlight"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}
