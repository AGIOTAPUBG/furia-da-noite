import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { ProductItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Star, ShoppingCart, ArrowRight, CheckCircle2, Copy, X, Tag } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export default function ShopModule() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { t, language } = useLanguage();

  // Sizing selection for merch
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({});

  // Checkout modal state
  const [checkoutProduct, setCheckoutProduct] = useState<ProductItem | null>(null);
  const [checkoutSize, setCheckoutSize] = useState<string | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Testimonials list in Portuguese / English depending on active lang
  const testimonials = [
    { 
      name: 'Lucas "Scylla" Mendes', 
      role: 'Duo Leader, FN Esports', 
      comment: language === 'pt' 
        ? 'O iPad View mudou meu spray de 4x por completo nas scrims diárias. Meu campo lateral aumentou de forma surpreendente! Recomendo muito.'
        : 'The iPad View completely changed my 4x scope spray in daily scrims. My horizontal field of view increased surprisingly! Highly recommended.'
    },
    { 
      name: 'Bruno Alencar', 
      role: 'Pro Competitor', 
      comment: language === 'pt'
        ? 'Excelente compatibilidade. Rodou liso no meu POCO X3 Pro. O suporte via WhatsApp me enviou as configurações em menos de 3 minutos.'
        : 'Excellent compatibility. It ran perfectly smooth on my POCO X3 Pro. Support via WhatsApp sent me files & guides in under 3 minutes.'
    },
    { 
      name: 'Gabriel Rodrigues', 
      role: 'PUBG Mobile Content Creator', 
      comment: language === 'pt'
        ? 'Estava com receio de ban, mas usei por 4 meses seguidos na conta principal e é super seguro. A câmera do jogo fica muito mais estável.'
        : 'I was worried about a ban, but used it for 4 consecutive months on my main account and it is super safe. The game camera is way more stable.'
    }
  ];

  // Rotate testimonials automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Fetch Products in Real-time from Firestore
  useEffect(() => {
    const colName = 'products';
    const unsubscribe = onSnapshot(
      collection(db, colName),
      (snapshot) => {
        const list: ProductItem[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.visible) {
            list.push({ ...data as ProductItem, productId: doc.id });
          }
        });
        setProducts(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, colName);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter products by type
  const digitalProduct = products.find(p => p.type === 'digital');
  const affiliateProducts = products.filter(p => p.type === 'affiliate');
  const merchProducts = products.filter(p => p.type === 'merch');

  // Trigger Pix Checkout Simulation
  const handleOpenCheckout = (product: ProductItem) => {
    if (product.type === 'merch') {
      const sizeSelected = selectedSizes[product.productId];
      if (!sizeSelected) {
        alert(language === 'pt' ? "Por favor, selecione seu tamanho (P, M, G, GG) antes de comprar!" : "Please select your size (S, M, L, XL) before buying!");
        return;
      }
      setCheckoutSize(sizeSelected);
    } else {
      setCheckoutSize(null);
    }
    setCheckoutProduct(product);
    setPaymentSuccess(false);
    setCheckingPayment(false);
  };

  const handleSimulatePayment = () => {
    setCheckingPayment(true);
    setTimeout(() => {
      setCheckingPayment(false);
      setPaymentSuccess(true);
    }, 2500);
  };

  const handleCopyPixKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const mockPixKey = checkoutProduct 
    ? `00020101021126580014br.gov.bcb.pix0136furiadanoite-pix@furiadanoite.com.br5204000053039865405${checkoutProduct.price.toFixed(2)}5802BR5915Furia Da Noite6009Sao Paulo62070503***6304`
    : '';

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#0B0F19] text-white">
      {/* Dynamic Background overlays */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#22C55E]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-16 relative z-10">
        
        {/* PREMIUM DIGITAL HERO HIGHLIGHT: IPAD VIEW */}
        {digitalProduct ? (
          <section className="relative w-full rounded-2xl border border-purple-500/30 overflow-hidden bg-gradient-to-r from-slate-950/90 via-purple-950/20 to-slate-950/90 shadow-[0_4px_35px_rgba(139,92,246,0.15)] flex flex-col lg:flex-row">
            {/* Left Column product assets */}
            <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col justify-center gap-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-[#22C55E] text-[10px] font-mono font-bold uppercase tracking-wider self-start">
                ⭐ {t.shop.bestSeller}
              </div>

              <h2 className="text-3xl md:text-5xl font-sans font-black uppercase text-white tracking-tight leading-none">
                {digitalProduct.name}
              </h2>

              <p className="text-sm font-mono text-gray-400 leading-relaxed">
                {digitalProduct.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {digitalProduct.features.map((spec, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                    <span className="text-xs font-mono text-gray-300">{spec}</span>
                  </div>
                ))}
              </div>

              {/* pricing details and buy action */}
              <div className="flex items-center gap-5 mt-4 border-t border-purple-500/10 pt-6">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-mono text-gray-500 uppercase leading-none">{language === 'pt' ? 'POR APENAS' : 'ONLY FOR'}</span>
                  <span className="text-3xl font-sans font-black text-[#22C55E] mt-1">
                    {digitalProduct.price === 0 ? t.shop.freeLabel : `R$ ${digitalProduct.price.toFixed(2)}`}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenCheckout(digitalProduct)}
                  className="px-6 py-3.5 rounded-xl bg-[#22C55E] hover:bg-green-500 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center gap-2 group cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {t.shop.buyAccess}
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Column mockup display representation */}
            <div className="w-full lg:w-1/2 bg-slate-950/80 border-l border-purple-500/10 relative flex justify-center items-center p-8">
              <div className="absolute top-4 right-4 text-[10px] font-mono text-gray-600">IPAD VIEW SIMULATION</div>
              
              <div className="w-full max-w-md relative aspect-[14/9] rounded-xl border border-purple-500/20 overflow-hidden bg-slate-900 shadow-xl p-1">
                {/* Fake PUBG comparison slider */}
                <div className="absolute inset-0 bg-slate-950">
                  <img 
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80" 
                    alt="Lobby comparison mockup" 
                    className="w-full h-full object-cover opacity-60 filter brightness-90 filter-blur-[1px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                  
                  {/* Scope sight grid overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border-2 border-dashed border-[#22C55E]/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>

                  {/* Wide field indicators */}
                  <div className="absolute inset-y-0 left-0 w-8 bg-green-500/10 border-r border-[#22C55E]/20 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-[#22C55E] -rotate-90 select-none font-bold">+ FOV SIDE</span>
                  </div>
                  <div className="absolute inset-y-0 right-0 w-8 bg-green-500/10 border-l border-[#22C55E]/20 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-[#22C55E] rotate-90 select-none font-bold">+ FOV SIDE</span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-purple-500/20 px-2.5 py-1 rounded text-[10px] font-mono text-purple-300">
                  Active Preset: ULTRA WIDE 16:10
                </div>
              </div>
            </div>
          </section>
        ) : (
          loading && <div className="h-64 rounded-2xl bg-slate-950/40 border border-purple-500/10 animate-pulse flex items-center justify-center font-mono text-xs text-gray-500">Loading shop configs...</div>
        )}

        {/* AFFILIATE ACCESSORIES & GEAR */}
        {affiliateProducts.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 border-l-2 border-[#22C55E] pl-4">
              <h3 className="text-xl font-sans font-black tracking-tight uppercase">
                {t.shop.gearTitle}
              </h3>
              <p className="text-xs font-mono text-gray-400">
                {t.shop.gearSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {affiliateProducts.map((prod) => (
                <div 
                  key={prod.productId}
                  className="rounded-2xl border border-purple-500/10 bg-slate-950/40 hover:border-purple-500/25 transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  <div className="aspect-video w-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
                    <img 
                      src={prod.image || 'https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?w=500&auto=format&fit=crop&q=80'} 
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute top-3 left-3 bg-purple-600 border border-purple-400/20 px-2.5 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {language === 'pt' ? 'Recomendado' : 'Recommended'}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 gap-3 text-left">
                    <h4 className="text-base font-sans font-bold text-gray-100 group-hover:text-purple-400 transition-colors">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-mono leading-relaxed flex-1">
                      {prod.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-purple-500/10 pt-4 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-gray-500 uppercase">{language === 'pt' ? 'MÁXIMO DESCONTO' : 'BEST PRICE'}</span>
                        <span className="text-sm font-sans font-extrabold text-[#22C55E]">R$ {prod.price.toFixed(2)}</span>
                      </div>

                      <a
                        href={prod.affiliateUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
                      >
                        {t.shop.viewStore}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* OFFICIAL MERCHANDISE CLOTHING */}
        {merchProducts.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 border-l-2 border-purple-500 pl-4">
              <h3 className="text-xl font-sans font-black tracking-tight uppercase">
                {t.shop.merchTitle}
              </h3>
              <p className="text-xs font-mono text-gray-400">
                {t.shop.merchSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {merchProducts.map((prod) => {
                const isSelectedSize = selectedSizes[prod.productId];
                return (
                  <div 
                    key={prod.productId}
                    className="rounded-2xl border border-purple-500/10 bg-slate-950/40 flex flex-col overflow-hidden"
                  >
                    <div className="aspect-square w-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
                      <img 
                        src={prod.image || 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&auto=format&fit=crop&q=80'} 
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute top-3 right-3 bg-slate-950/90 border border-purple-500/10 py-1.5 px-3 rounded-lg text-xs font-mono font-extrabold text-[#22C55E]">
                        100% ALGODÃO FIO 30
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1 gap-3.5 text-left">
                      <div className="flex flex-col gap-1">
                        <h4 className="text-base font-sans font-bold text-gray-100">
                          {prod.name}
                        </h4>
                        <p className="text-xs font-mono text-gray-400">
                          {prod.description}
                        </p>
                      </div>

                      {/* Sizes selector grid */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-mono text-gray-500 uppercase">{language === 'pt' ? 'ESCOLHA SEU TAMANHO' : 'SELECT CLOTHING SIZE'}:</span>
                        <div className="flex gap-1.5">
                          {['P', 'M', 'G', 'GG'].map((sz) => (
                            <button
                              key={sz}
                              onClick={() => setSelectedSizes({ ...selectedSizes, [prod.productId]: sz })}
                              className={`w-9 h-9 rounded-md font-mono text-xs font-bold border transition-all ${
                                isSelectedSize === sz
                                  ? 'bg-purple-600 border-purple-400 text-white shadow-md font-black'
                                  : 'bg-slate-900 border-purple-500/10 text-gray-400 hover:text-white'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-purple-500/10 pt-4 mt-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-gray-500 uppercase">{language === 'pt' ? 'PREÇO' : 'PRICE'}</span>
                          <span className="text-base font-sans font-black text-[#22C55E]">R$ {prod.price.toFixed(2)}</span>
                        </div>

                        <button
                          onClick={() => handleOpenCheckout(prod)}
                          className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase flex items-center gap-1.5"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          {language === 'pt' ? 'Comprar' : 'Buy'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ROTATING TESTIMONIALS SLIDER */}
        <section className="max-w-3xl mx-auto w-full bg-slate-950/70 border border-purple-500/10 rounded-2xl p-6 md:p-10 relative overflow-hidden text-center flex flex-col items-center gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.p 
              key={activeTestimonial}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm md:text-base font-mono text-purple-200 leading-relaxed italic"
            >
              "{testimonials[activeTestimonial].comment}"
            </motion.p>
          </AnimatePresence>

          <div className="flex flex-col mt-2">
            <span className="text-xs font-sans font-extrabold text-white uppercase">{testimonials[activeTestimonial].name}</span>
            <span className="text-[9px] font-mono text-[#22C55E] tracking-widest mt-1 uppercase">{testimonials[activeTestimonial].role}</span>
          </div>

          <div className="flex gap-1.5 mt-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeTestimonial === i ? 'bg-purple-500 w-3' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </section>

      </div>

      {/* PIX CHECKOUT MODAL DIALOG */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-6 bg-[#0B0F19] border border-purple-500/25 rounded-2xl shadow-2xl flex flex-col gap-4">
            
            {/* Close button icon */}
            <button
              onClick={() => setCheckoutProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {!paymentSuccess ? (
              <div className="flex flex-col gap-4">
                <div className="mx-auto p-3 bg-purple-500/10 rounded-full border border-purple-500/30 text-purple-400">
                  <CreditCardIcon className="w-8 h-8" />
                </div>

                <div className="flex flex-col gap-1 text-center">
                  <span className="text-[9px] font-mono text-purple-400 tracking-widest uppercase">{language === 'pt' ? 'PAGAMENTO VIA PIX SEGURO' : 'PAY SECURELY WITH PIX'}</span>
                  <h4 className="text-base font-sans font-black text-gray-100 uppercase truncate">
                    {checkoutProduct.name}
                  </h4>
                  {checkoutSize && (
                    <span className="text-[11px] font-mono text-yellow-400">{language === 'pt' ? 'Tamanho Selecionado' : 'Selected Size'}: <b>{checkoutSize}</b></span>
                  )}
                </div>

                <div className="p-4 bg-slate-900 border border-purple-500/10 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-400 leading-none">
                    <span>Subtotal:</span>
                    <span className="text-white font-bold">R$ {checkoutProduct.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-gray-400 leading-none">
                    <span>{language === 'pt' ? 'Taxa Adicional' : 'Fee Amount'}:</span>
                    <span className="text-[#22C55E]">R$ 0,00</span>
                  </div>
                  <div className="h-px bg-slate-800" />
                  <div className="flex items-center justify-between text-sm font-mono leading-none">
                    <span className="font-bold text-gray-300">Total:</span>
                    <span className="font-black text-[#22C55E]">R$ {checkoutProduct.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Simulated QR Code vector */}
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-white rounded-xl">
                    <svg className="w-36 h-36" viewBox="0 0 100 100" fill="black">
                      <rect x="5" y="5" width="20" height="20" />
                      <rect x="75" y="5" width="20" height="20" />
                      <rect x="5" y="75" width="20" height="20" stroke="black" />
                      <path d="M40 20h10v10H40zm10 40h20V50H50z" fill="#8B5CF6" />
                      <circle cx="50" cy="50" r="10" fill="black" />
                      <path d="M5 40h20v5H5zm20 15h15v5H25zm30 10h25v10H55z" />
                    </svg>
                  </div>
                  
                  <span className="text-[10px] font-mono text-[#22C55E] tracking-tight text-center">{language === 'pt' ? 'Escaneie com seu banco ou copie o código Pix abaixo:' : 'Scan with your bank app or copy the Pix code below:'}</span>

                  <div className="flex items-center w-full gap-2">
                    <input
                      type="text"
                      readOnly
                      value={mockPixKey}
                      className="p-3 rounded bg-slate-900 text-[10px] font-mono text-gray-400 flex-1 border border-purple-500/10 focus:outline-none"
                    />
                    <button
                      onClick={() => handleCopyPixKey(mockPixKey)}
                      className="p-3 rounded bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase transition-all shrink-0 min-w-[90px]"
                    >
                      {copiedKey ? (language === 'pt' ? 'Copiado!' : 'Copied!') : (language === 'pt' ? 'Copiar' : 'Copy')}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSimulatePayment}
                  disabled={checkingPayment}
                  className="w-full mt-2 py-4 bg-green-600 hover:bg-green-500 text-slate-950 font-mono text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {checkingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      {language === 'pt' ? 'Verificando Transação...' : 'Verifying Transaction...'}
                    </>
                  ) : (
                    language === 'pt' ? 'Simular Pagamento Pago (Teste)' : 'Simulate Payment (Test)'
                  )}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4 animate-scale-up">
                <CheckCircle2 className="w-14 h-14 text-[#22C55E] animate-bounce" />
                <h3 className="text-xl font-sans font-black text-gray-100 uppercase tracking-tight">
                  {language === 'pt' ? 'Pagamento Confirmado!' : 'Payment Confirmed!'}
                </h3>
                
                <div className="p-4 bg-slate-900 rounded-xl border border-green-500/10 text-xs font-mono text-gray-400 leading-relaxed text-left max-w-sm flex flex-col gap-2.5 w-full">
                  <span className="text-white font-bold block uppercase border-b border-purple-500/10 pb-2">📦 {language === 'pt' ? 'PRÓXIMOS PASSOS:' : 'NEXT STEPS:'}</span>
                  
                  {checkoutProduct.type === 'digital' ? (
                    <>
                      <span>{language === 'pt' ? '1. Chave de acesso e arquivo de config gerados para seu e-mail.' : '1. Access key and configuration file generated for your email.'}</span>
                      <span>{language === 'pt' ? '2. Fale com nosso suporte VIP no link abaixo para importar e instalar.' : '2. Talk to our VIP support on the link below to get setup instructions.'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'pt' ? `1. Seu pedido do vestuário tamanho ${checkoutSize} está reservado.` : `1. Your clothing order size ${checkoutSize} is successfully reserved.`}</span>
                      <span>{language === 'pt' ? '2. Embalamos seu produto para postagem nos correios em até 24 horas!' : '2. We will dispatch your physical package via local post in under 24 hours!'}</span>
                    </>
                  )}
                </div>

                <a
                  href="https://wa.me/5598982319082"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full mt-2 py-3.5 bg-[#22C55E] hover:bg-green-500 text-slate-950 font-mono text-xs font-black uppercase text-center rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                >
                  {language === 'pt' ? 'Falar no WhatsApp' : 'Open WhatsApp Support'}
                </a>

                <button
                  onClick={() => setCheckoutProduct(null)}
                  className="w-full py-3 border border-purple-500/20 hover:bg-slate-900 text-xs font-mono font-medium rounded-xl text-gray-500 hover:text-white transition-all mt-1"
                >
                  {language === 'pt' ? 'Voltar para a Loja' : 'Back to Store'}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 14h2" />
    </svg>
  );
}
