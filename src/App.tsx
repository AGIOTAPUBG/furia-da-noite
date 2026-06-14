import { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ScrimsModule from './components/ScrimsModule';
import ShopModule from './components/ShopModule';
import NewsModule from './components/NewsModule';
import AdminPanel from './components/AdminPanel';
import Logo from './components/Logo';
import { Trophy, Shield, Heart } from 'lucide-react';
import { LanguageProvider, useLanguage } from './lib/LanguageContext';

function AppContent() {
  // Use hash-based routing/tabs for simple robustness inside iframe context
  const getTabFromHash = (): 'home' | 'scrims' | 'shop' | 'feed' | 'admin' => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'scrims', 'shop', 'feed', 'admin'].includes(hash)) {
      return hash as any;
    }
    return 'home';
  };

  const [currentTab, setCurrentTab] = useState<'home' | 'scrims' | 'shop' | 'feed' | 'admin'>(getTabFromHash());
  const [isAdmin, setIsAdmin] = useState(false);
  const { t } = useLanguage();

  // Synchronize hash to state and back
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentTab(getTabFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSetTab = (tab: 'home' | 'scrims' | 'shop' | 'feed' | 'admin') => {
    window.location.hash = tab;
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check initial admin authorization on reload once logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAdmin(user.email?.toLowerCase() === 'prhdeoliveira@gmail.com');
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      
      {/* HEADER NAVIGATION bar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={handleSetTab}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      {/* PRIMARY ACTIVE CONTENT COMPONENT */}
      <main className="flex-1">
        {currentTab === 'home' && <HeroSection setCurrentTab={handleSetTab} />}
        {currentTab === 'scrims' && <ScrimsModule isAdmin={isAdmin} />}
        {currentTab === 'shop' && <ShopModule />}
        {currentTab === 'feed' && <NewsModule />}
        {currentTab === 'admin' && <AdminPanel />}
      </main>

      {/* FOOTER SECTION BRAND IDENTITIES */}
      <footer className="w-full bg-[#070A11] border-t border-purple-500/10 py-12 text-gray-500 text-xs font-mono relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          
          <div className="flex flex-col gap-2 items-center md:items-start">
            <Logo className="w-10 h-10" />
            <p className="text-[10px] text-gray-600 mt-2 max-w-sm">
              {t.common.disclaimer}
            </p>
          </div>

          <div className="flex flex-col gap-3 items-center md:items-end">
            <div className="flex gap-6 text-gray-400">
              <button onClick={() => handleSetTab('home')} className="hover:text-purple-400 transition-colors">{t.common.inicio}</button>
              <button onClick={() => handleSetTab('scrims')} className="hover:text-purple-400 transition-colors">{t.common.scrims}</button>
              <button onClick={() => handleSetTab('shop')} className="hover:text-purple-400 transition-colors">{t.common.loja}</button>
              <button onClick={() => handleSetTab('feed')} className="hover:text-purple-400 transition-colors">{t.common.noticias}</button>
            </div>
            
            <div className="flex items-center gap-1.5 text-gray-600 text-[10px] mt-2">
              <span>© {new Date().getFullYear()} furiadanoite.com.br. {t.common.copyright}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {t.common.madeWith} <Heart className="w-3 h-3 text-purple-600 fill-current" /> in Brazil
              </span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
