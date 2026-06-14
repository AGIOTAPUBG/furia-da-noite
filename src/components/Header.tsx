import { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import Logo from './Logo';
import { LogIn, LogOut, ShieldAlert, User as UserIcon, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: any) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export default function Header({ currentTab, setCurrentTab, isAdmin, setIsAdmin }: HeaderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSigniningIn, setIsSigningIn] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        // Check if user is the designated admin
        const adminEmail = 'prhdeoliveira@gmail.com';
        const userIsAdmin = user.email?.toLowerCase() === adminEmail.toLowerCase();
        setIsAdmin(userIsAdmin);

        // Fetch profile
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setProfile(userDocSnap.data() as UserProfile);
          } else {
            // First time login - auto create skeletal profile
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              username: user.displayName || 'Gamer Fúria',
              pubgId: '', // To be updated during scrim register
              whatsapp: '',
              role: userIsAdmin ? 'admin' : 'user',
              createdAt: new Date().toISOString()
            };
            
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err) {
          console.warn("Error processing user metadata setup:", err);
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [setIsAdmin]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      // Force popup as per standard AI Studio development guidelines
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-in failed:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setProfile(null);
    setIsAdmin(false);
    setCurrentTab('home');
  };

  const navLinks = [
    { id: 'home', label: t.common.inicio },
    { id: 'scrims', label: t.common.scrims },
    { id: 'shop', label: t.common.loja },
    { id: 'feed', label: t.common.noticias },
  ];

  if (isAdmin) {
    navLinks.push({ id: 'admin', label: t.common.adminPanel });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/15 bg-[#0B0F19]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="cursor-pointer" onClick={() => setCurrentTab('home')}>
            <Logo className="w-12 h-12" />
          </div>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex space-x-1 border border-purple-500/10 rounded-full bg-slate-950/40 p-1.5 backdrop-blur-sm shadow-[inset_0_1px_5px_rgba(0,0,0,0.6)]">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-btn-${link.id}`}
                  onClick={() => setCurrentTab(link.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-mono font-medium tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'bg-purple-600 font-semibold text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                      : 'text-gray-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* User Section / Login Button / Lang Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switch toggle pill */}
            <div className="flex bg-slate-950/90 border border-purple-500/15 rounded-full p-0.5 select-none h-10 items-center gap-0.5">
              <button
                onClick={() => setLanguage('pt')}
                className={`px-2.5 h-8 rounded-full text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                  language === 'pt'
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30 font-extrabold shadow-[0_0_5px_rgba(168,85,247,0.3)]'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                🇧🇷 BR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 h-8 rounded-full text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                  language === 'en'
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30 font-extrabold shadow-[0_0_5px_rgba(168,85,247,0.3)]'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                🇺🇸 EN
              </button>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-3 h-10 px-3 py-1.5 rounded-full bg-slate-950/80 border border-purple-500/15 hover:border-purple-400/40 transition-colors duration-200">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={profile?.username || 'Avatar'}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full border border-purple-500/40"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center border border-purple-500">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-mono leading-tight font-semibold text-gray-200 max-w-[120px] truncate">
                    {profile?.username || currentUser.displayName}
                  </span>
                  <span className="text-[8px] font-mono text-[#22C55E] tracking-wider uppercase leading-none font-medium">
                    {isAdmin ? 'Admin' : t.common.competitor}
                  </span>
                </div>

                <div className="h-4 w-px bg-slate-800" />

                <button
                  id="btn-signout"
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-1 rounded-full hover:bg-red-500/5"
                  title={t.common.logout}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="btn-signin-google"
                disabled={isSigniningIn}
                onClick={handleSignIn}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-purple-500/35 bg-purple-600/10 hover:bg-purple-600 text-xs font-mono font-bold tracking-wider text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50"
              >
                <LogIn className="w-3.5 h-3.5" />
                {isSigniningIn ? t.common.connecting : t.common.loginGoogle}
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex md:hidden items-center gap-3">
            {currentUser && (
              <div className="w-8 h-8 rounded-full border border-purple-500/40 overflow-hidden">
                <img
                  src={currentUser.photoURL || ''}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg border border-purple-500/20 text-gray-300 hover:text-white bg-slate-900/40"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-500/10 bg-[#0B0F19] px-4 py-6 flex flex-col gap-4 shadow-2xl animate-fade-in">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-3.5 px-4 rounded-xl text-left font-mono text-sm leading-none transition-all ${
                  currentTab === link.id
                    ? 'bg-purple-600 text-white font-semibold shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="h-px bg-slate-800 my-2" />

          {/* Quick Language Selection for Mobile */}
          <div className="flex items-center justify-between px-2 bg-slate-950/70 py-2.5 rounded-xl border border-purple-500/10">
            <span className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              Language:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('pt')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  language === 'pt'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-500 bg-slate-900 hover:text-gray-300'
                }`}
              >
                🇧🇷 PT-BR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  language === 'en'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-500 bg-slate-900 hover:text-gray-300'
                }`}
              >
                🇺🇸 EN
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-800 my-1" />

          <div>
            {currentUser ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full border border-purple-500/40 overflow-hidden">
                    <img
                      src={currentUser.photoURL || ''}
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-mono font-bold text-gray-200">
                      {profile?.username || currentUser.displayName}
                    </span>
                    <span className="text-xs font-mono text-[#22C55E] tracking-widest uppercase font-medium">
                      {isAdmin ? 'ADMINISTRADOR' : 'SQUAD COMPETITOR'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-white font-mono text-sm uppercase font-bold transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  {t.common.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleSignIn();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-purple-600 text-white font-mono font-bold tracking-wider text-sm transition-all"
              >
                <LogIn className="w-4 h-4" />
                {t.common.loginGoogle.toUpperCase()}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
