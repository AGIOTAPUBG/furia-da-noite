import { motion } from 'motion/react';
import { Send, Instagram, Youtube, Flame, Shield, Users, Radio, MessageSquare, ExternalLink } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface HeroSectionProps {
  setCurrentTab: (tab: any) => void;
}

export default function HeroSection({ setCurrentTab }: HeroSectionProps) {
  const { t, language } = useLanguage();

  const socialLinks = [
    {
      name: language === 'pt' ? 'Grupo Oficial WhatsApp Scrims' : 'Official WhatsApp Scrims Group',
      url: 'https://whatsapp.com',
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-600 shadow-[0_0_15px_rgba(34,197,94,0.3)]',
      accent: 'text-emerald-400',
      tag: language === 'pt' ? 'Suporte & Lobby Recitativo' : 'Support & Match Lobby',
      desc: language === 'pt' 
        ? 'Entre no grupo oficial para receber senhas e ID das salas de forma imediata!' 
        : 'Join the official group to get custom room credentials instantly!'
    },
    {
      name: language === 'pt' ? 'Instagram Oficial' : 'Official Instagram',
      url: 'https://instagram.com/furiadanoite',
      icon: Instagram,
      color: 'from-pink-600 to-purple-600 shadow-[0_0_15px_rgba(219,39,119,0.3)]',
      accent: 'text-pink-400',
      tag: language === 'pt' ? 'Fotos & Agenda Geral' : 'Photos & Schedule',
      desc: language === 'pt'
        ? 'Acompanhe as tabelas, MVPs das copas diárias e anúncios exclusivos.'
        : 'Track general daily leaderboards, MVP rewards, and official updates.'
    },
    {
      name: language === 'pt' ? 'Canal do YouTube' : 'Official YouTube Channel',
      url: 'https://youtube.com',
      icon: Youtube,
      color: 'from-red-600 to-rose-700 shadow-[0_0_15px_rgba(220,38,38,0.3)]',
      accent: 'text-red-400',
      tag: language === 'pt' ? 'Transmissões ao Vivo MD3' : 'Live Broadcasts Best of 3',
      desc: language === 'pt'
        ? 'Assista a cobertura em tempo real dos torneios com narração profissional.'
        : 'Don\'t miss top-tier live tournament matches with professional shoutcasting.'
    },
    {
      name: language === 'pt' ? 'Canal Oficial TikTok Highlights' : 'Official TikTok Highlights',
      url: 'https://tiktok.com',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ),
      color: 'from-cyan-500 to-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
      accent: 'text-cyan-400',
      tag: language === 'pt' ? 'Clips Diários & Shorts' : 'Daily Reels & Shorts',
      desc: language === 'pt'
        ? 'Os melhores clutches, granadas perfeitas e momentos engraçados do Duo.'
        : 'Discover outstanding clutches, perfect grenade plays, and funny gameplay compilations.'
    }
  ];

  const partners = [
    { name: 'Tencent Mobile Gaming', role: language === 'pt' ? 'Plataforma Oficial' : 'Official Platform', logo: 'TMG' },
    { name: 'ROG Asus Gaming', role: language === 'pt' ? 'Parceiro de Hardware' : 'Hardware Affiliate', logo: 'ROG' },
    { name: 'Mercado Livre', role: language === 'pt' ? 'Afiliado de Equipamentos' : 'Device Sponsor', logo: 'ML' },
    { name: 'Red Bull Energy', role: language === 'pt' ? 'Suporte Hidratação' : 'Hydration Sponsor', logo: 'RB' },
    { name: 'NVIDIA GeForce', role: language === 'pt' ? 'Patrocinador Visual' : 'Visual Partner', logo: 'NV' }
  ];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[#0B0F19] text-white">
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>
      
      {/* Purple glow radial overlay */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10 flex flex-col gap-16">
        
        {/* HERO HEADER */}
        <section className="text-center flex flex-col items-center max-w-4xl mx-auto gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/20 text-[#A855F7] text-xs font-mono font-semibold"
          >
            <Flame className="w-4 h-4 animate-pulse text-purple-400" />
            {t.hero.badgeText}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-sans font-black tracking-tight uppercase"
          >
            {t.hero.titleMain} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-purple-600 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              {t.hero.titleHighlight}
            </span> {t.hero.titleEnd}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base md:text-lg text-gray-400 font-mono tracking-wide max-w-2xl leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4"
          >
            <button
              id="scrims-hero-cta"
              onClick={() => setCurrentTab('scrims')}
              className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 font-mono font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] border border-purple-400/30"
            >
              {t.hero.ctaRegister}
            </button>
            <button
              id="shop-hero-cta"
              onClick={() => setCurrentTab('shop')}
              className="px-8 py-4 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-purple-500/25 text-[#A855F7] hover:text-white font-mono font-bold text-sm tracking-wider uppercase transition-all duration-300"
            >
              {t.hero.ctaIpadView}
            </button>
          </motion.div>
        </section>

        {/* HIGH-TECH EMBEDDED SCENE MOCKUP */}
        <section className="relative w-full max-w-5xl mx-auto rounded-2xl border border-purple-500/20 overflow-hidden shadow-2xl bg-slate-900/40 backdrop-blur-md p-1 group">
          {/* Inner glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
          
          {/* Corner highlight graphics */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#22C55E]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#22C55E]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-500" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-500" />

          {/* Fake Dashboard Stats Header */}
          <div className="flex h-12 bg-slate-950/90 items-center justify-between px-4 border-b border-purple-500/10 text-xs font-mono text-gray-500">
            <span className="flex items-center gap-2 text-[#22C55E]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              {t.hero.ecosystemLive}
            </span>
            <div className="flex items-center gap-4">
              <span>{t.hero.formatDuo}</span>
              <span>{t.hero.registered100}</span>
            </div>
          </div>

          <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex flex-col justify-center items-center p-6 text-center">
            {/* Background Image / Illustration mock */}
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80" 
              alt="PUBG Scrim Landscape" 
              className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-50 contrast-125"
            />
            {/* Dark gradient blur over image */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950 pointer-events-none" />

            {/* Inner text content simulating esports banner */}
            <div className="z-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-purple-600/35 border border-purple-400 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <Shield className="w-8 h-8 text-purple-200" />
              </div>
              <h3 className="text-2xl md:text-3xl font-sans font-black uppercase text-white tracking-tight leading-none">
                {t.hero.arenaTitle}
              </h3>
              <p className="text-xs font-mono max-w-md text-purple-300 leading-normal">
                {t.hero.arenaSubtitle}
              </p>
              <div className="flex gap-4 mt-2">
                <div className="bg-slate-950/90 py-1.5 px-3.5 rounded-lg border border-purple-500/10 flex flex-col items-center">
                  <span className="text-[10px] font-mono text-gray-500">Daily Scrims</span>
                  <span className="text-sm font-sans font-extrabold text-[#22C55E]">{t.hero.dailyScrimsTime}</span>
                </div>
                <div className="bg-slate-950/90 py-1.5 px-3.5 rounded-lg border border-purple-500/10 flex flex-col items-center">
                  <span className="text-[10px] font-mono text-gray-500">{t.hero.formatLabel}</span>
                  <span className="text-sm font-sans font-extrabold text-white">DUO TPP</span>
                </div>
                <div className="bg-slate-950/90 py-1.5 px-3.5 rounded-lg border border-purple-500/10 flex flex-col items-center">
                  <span className="text-[10px] font-mono text-gray-500">{t.hero.rewardsLabel}</span>
                  <span className="text-sm font-sans font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">{t.hero.rewardsDetail}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HUB OF LINKS SECTION - TREE REPLACEMENT */}
        <section className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
          <div className="text-center flex flex-col items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-sans font-black tracking-tight uppercase">
              {t.hero.connectionHubTitle}
            </h2>
            <p className="text-xs font-mono text-purple-400">
              {t.hero.connectionHubSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialLinks.map((social) => {
              const IconComp = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-b from-slate-950/90 to-slate-950 border border-purple-500/10 hover:border-purple-400/40 transition-all duration-300 hover:shadow-[0_4px_30px_rgba(139,92,246,0.15)] overflow-hidden"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${social.color} text-white transition-all duration-300 group-hover:scale-110 flex items-center justify-center`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  
                  <div className="flex flex-col gap-1 text-left flex-1 min-w-0 pr-4">
                    <span className="text-xs font-mono font-bold leading-none tracking-widest text-[#22C55E]">
                      {social.tag}
                    </span>
                    <h4 className="text-sm font-sans font-bold text-gray-200 mt-1 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                      {social.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-normal font-mono break-words">
                      {social.desc}
                    </p>
                  </div>

                  <div className="text-gray-600 group-hover:text-purple-400 transition-colors duration-200 self-center">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* SPONSORS AND PARTNERS */}
        <section className="flex flex-col gap-8 w-full max-w-4xl mx-auto border-t border-purple-500/10 pt-16">
          <div className="text-center font-mono text-xs tracking-widest text-gray-500 uppercase">
            {t.hero.sponsorsTitle}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-purple-500/[0.04] bg-slate-950/40 hover:bg-slate-900/40 hover:border-purple-500/10 text-center transition-colors duration-300 group"
              >
                {/* SVG Mock logo for sponsors */}
                <span className="text-lg font-sans font-black text-gray-600 group-hover:text-purple-400 tracking-wider transition-colors duration-200 uppercase">
                  {partner.logo}
                </span>
                <span className="text-[11px] font-sans font-bold text-gray-400 mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  {partner.name}
                </span>
                <span className="text-[9px] font-mono text-gray-600 uppercase">
                  {partner.role}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
