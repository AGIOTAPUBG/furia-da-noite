import React, { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { ScrimRoom, Inscription, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Trophy, ShieldAlert, CheckCircle2, Copy, Clock, Key, CreditCard } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface ScrimsModuleProps {
  isAdmin: boolean;
}

export default function ScrimsModule({ isAdmin }: ScrimsModuleProps) {
  const [scrims, setScrims] = useState<ScrimRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScrim, setSelectedScrim] = useState<ScrimRoom | null>(null);
  const [isInscribing, setIsInscribing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { t, language } = useLanguage();

  // Form states for multi-step signup
  const [formStep, setFormStep] = useState(1);
  const [p1User, setP1User] = useState('');
  const [p1Pubg, setP1Pubg] = useState('');
  const [p2User, setP2User] = useState('');
  const [p2Pubg, setP2Pubg] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [submittingInsc, setSubmittingInsc] = useState(false);
  const [successInsc, setSuccessInsc] = useState<Inscription | null>(null);

  // Read current profile so we can auto-fill Player 1 details
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      getDoc(doc(db, 'users', user.uid)).then(docSnap => {
        if (docSnap.exists()) {
          const prof = docSnap.data() as UserProfile;
          setP1User(prof.username || user.displayName || '');
          setP1Pubg(prof.pubgId || '');
          setWhatsapp(prof.whatsapp || '');
        }
      });
    }
  }, []);

  // Fetch Scrims in real-time
  useEffect(() => {
    const colName = 'scrims';
    const unsubscribe = onSnapshot(
      collection(db, colName),
      (snapshot) => {
        const list: ScrimRoom[] = [];
        snapshot.forEach((doc) => {
          list.push({ ...doc.data() as ScrimRoom, scrimId: doc.id });
        });
        // Sort by dateTime (closest first)
        list.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        setScrims(list);
        
        // Auto-select first upcoming scrim
        if (list.length > 0 && !selectedScrim) {
          const upcoming = list.find(s => s.status === 'upcoming');
          setSelectedScrim(upcoming || list[0]);
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, colName);
      }
    );

    return () => unsubscribe();
  }, [selectedScrim]);

  // Handle clipboard Copy feedback
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Submit duo registration form
  const handleRegisterDuo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScrim) return;
    const user = auth.currentUser;
    if (!user) {
      alert(language === 'pt' ? "Por favor, conecte-se com sua conta Google para registrar!" : "Please login with your Google account to register!");
      return;
    }

    setSubmittingInsc(true);
    const mockId = 'insc-' + Math.random().toString(36).substr(2, 9);
    const pixPayload = `00020101021126580014br.gov.bcb.pix0136furiadanoite-pix@furiadanoite.com.br5204000053039865405${selectedScrim.price.toFixed(2)}5802BR5915Furia Da Noite6009Sao Paulo62070503***6304`;

    const newInscription: Inscription = {
      inscriptionId: mockId,
      scrimId: selectedScrim.scrimId,
      userId: user.uid,
      player1Username: p1User,
      player1PubgId: p1Pubg,
      player2Username: p2User,
      player2PubgId: p2Pubg,
      whatsapp: whatsapp,
      status: 'pending',
      paymentPixCode: pixPayload,
      createdAt: new Date().toISOString()
    };

    const inscCol = 'inscriptions';
    try {
      // 1. Save Inscription to Firestore
      await setDoc(doc(db, inscCol, mockId), newInscription);

      // 2. Decrement available slots in the Scrim room
      const scrimRef = doc(db, 'scrims', selectedScrim.scrimId);
      await updateDoc(scrimRef, {
        availableSlots: increment(-1)
      });

      // 3. Update or set user profile options so they are persistent
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        pubgId: p1Pubg,
        whatsapp: whatsapp,
        username: p1User
      }).catch(err => {
        // If profile doesnt exist or lacks fields, write it
        setDoc(userRef, {
          uid: user.uid,
          email: user.email || '',
          username: p1User,
          pubgId: p1Pubg,
          whatsapp: whatsapp,
          role: 'user',
          createdAt: new Date().toISOString()
        }, { merge: true });
      });

      setSuccessInsc(newInscription);
      setFormStep(3);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${inscCol}/${mockId}`);
    } finally {
      setSubmittingInsc(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#0B0F19] text-white">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN - SCRIMS LIST */}
        <div className="w-full lg:w-2/5 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5 border-l-2 border-purple-500 pl-4">
            <h2 className="text-xl font-sans font-black tracking-tight uppercase">
              {t.scrims.agendaTitle}
            </h2>
            <p className="text-xs font-mono text-gray-400">
              {t.scrims.agendaSubtitle}
            </p>
          </div>

          {loading ? (
            // Skeleton loader
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 rounded-2xl bg-slate-900/40 border border-purple-500/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {scrims.length === 0 ? (
                <div className="py-12 border border-dashed border-purple-500/20 rounded-2xl text-center flex flex-col items-center justify-center p-6 text-gray-500 font-mono text-xs">
                  {t.scrims.noScrims}
                </div>
              ) : (
                scrims.map((scrim) => {
                  const isSelected = selectedScrim?.scrimId === scrim.scrimId;
                  const formattedDate = new Date(scrim.dateTime).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  const isFinished = scrim.status === 'finished';

                  return (
                    <button
                      key={scrim.scrimId}
                      onClick={() => {
                        setSelectedScrim(scrim);
                        setIsInscribing(false);
                        setFormStep(1);
                        setSuccessInsc(null);
                      }}
                      className={`relative w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                        isSelected
                          ? 'bg-purple-950/25 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                          : 'bg-slate-950/70 border-purple-500/10 hover:border-purple-500/30'
                      }`}
                    >
                      {/* Flag Indicator for Finished Scrims */}
                      {isFinished && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-800 text-gray-400 text-[9px] font-mono leading-none tracking-widest uppercase">
                          {t.scrims.badgeFinished}
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-lg border ${
                            isSelected ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900 text-purple-400 border-purple-500/10'
                          }`}>
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-sans font-bold text-gray-200">
                              {scrim.title}
                            </h4>
                            <span className="text-[10px] font-mono text-yellow-400 leading-none mt-1 inline-block">
                              🕒 {formattedDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4 border-t border-purple-500/[0.08] pt-3 text-[10px] font-mono text-gray-400">
                        <span>Format: <b className="text-gray-200">{scrim.format}</b></span>
                        
                        {!isFinished && (
                          <span className={`px-2 py-0.5 rounded ${
                            scrim.availableSlots <= 5 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                          }`}>
                            {scrim.availableSlots <= 0 
                              ? 'SOLD OUT' 
                              : language === 'pt' 
                                ? `${scrim.availableSlots} slots restantes` 
                                : `${scrim.availableSlots} slots left`
                            }
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - SCRIM DETAIL WITH VAULT / COUNTDOWN OR SIGNUP */}
        <div className="w-full lg:w-3/5">
          {selectedScrim ? (
            <div className="flex flex-col gap-6">
              
              {/* PRIMARY CARD DETAILS */}
              <div className="p-6 rounded-2xl border border-purple-500/20 bg-slate-950/50 backdrop-blur-md relative overflow-hidden flex flex-col gap-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -z-10" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/10 pb-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-[#22C55E] tracking-widest uppercase">
                      DUO SCRIM COMPETITIVO
                    </span>
                    <h3 className="text-2xl font-sans font-black uppercase text-white tracking-tight">
                      {selectedScrim.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 border border-purple-500/15 py-2 px-4 rounded-xl flex flex-col items-center">
                      <span className="text-[9px] font-mono text-gray-500">{t.scrims.valueLabel}</span>
                      <span className="text-sm font-sans font-extrabold text-[#22C55E]">
                        {selectedScrim.price === 0 ? t.scrims.freePrice : `R$ ${selectedScrim.price.toFixed(2)}`}
                      </span>
                    </div>

                    {!selectedScrim.leaderboard && (
                      <div className="bg-slate-900 border border-purple-500/15 py-2 px-4 rounded-xl flex flex-col items-center">
                        <span className="text-[9px] font-mono text-gray-500">{t.scrims.slotsLabel}</span>
                        <span className="text-sm font-sans font-extrabold text-red-500">
                          {selectedScrim.availableSlots <= 5 ? `${selectedScrim.availableSlots}!` : selectedScrim.availableSlots}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* COUNTDOWN / PUBG LOBBY ID VAULT (DYNAMIC REAL-TIME REVEAL) */}
                {selectedScrim.status === 'upcoming' && (
                  <LobbyVault scrim={selectedScrim} handleCopy={handleCopy} copiedKey={copiedKey} />
                )}

                {/* REGISTER INLINE ACTION */}
                {selectedScrim.status === 'upcoming' && (
                  <div className="flex flex-col gap-3">
                    {!isInscribing ? (
                      <button
                        id="btn-trigger-register"
                        disabled={selectedScrim.availableSlots <= 0}
                        onClick={() => {
                          if (!auth.currentUser) {
                            alert(language === 'pt' ? "Por favor, conecte-se com sua conta Google primeiro!" : "Please login with Google first!");
                            return;
                          }
                          setIsInscribing(true);
                          setFormStep(1);
                        }}
                        className="w-full p-4 rounded-xl bg-purple-600 hover:bg-purple-500 font-mono font-bold text-xs tracking-widest text-white uppercase text-center transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50"
                      >
                        {selectedScrim.availableSlots <= 0 
                          ? t.scrims.soldOutButton 
                          : t.scrims.registerDuoButton
                        }
                      </button>
                    ) : (
                      <div className="p-4 md:p-6 rounded-xl border border-purple-500/20 bg-slate-950/90 shadow-2xl animate-fade-in flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b border-purple-500/10 pb-3">
                          <h4 className="text-xs font-mono font-bold text-[#A855F7]">
                            {t.scrims.stepTitle} {formStep} OF 3
                          </h4>
                          <button
                            onClick={() => setIsInscribing(false)}
                            className="text-gray-400 hover:text-white font-mono text-[10px]"
                          >
                            [ {t.scrims.cancelLabel} ]
                          </button>
                        </div>

                        {formStep === 1 && (
                          <div className="flex flex-col gap-4">
                            <span className="text-xs text-gray-400">
                              {language === 'pt' ? 'Insira as credenciais do' : 'Enter the credentials for'} <b>{language === 'pt' ? 'Jogador 1 (Você)' : 'Player 1 (You)'}</b>:
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-mono text-gray-500 uppercase">PUBG Nickname</label>
                                <input
                                  type="text"
                                  value={p1User}
                                  onChange={e => setP1User(e.target.value)}
                                  placeholder="Ex: FN_Scylla"
                                  className="p-3 rounded-lg border border-purple-500/10 bg-slate-900/60 text-sm font-mono focus:outline-none focus:border-purple-500"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-mono text-gray-500 uppercase">{language === 'pt' ? 'ID de Personagem PUBG' : 'PUBG Character ID'}</label>
                                <input
                                  type="text"
                                  value={p1Pubg}
                                  onChange={e => setP1Pubg(e.target.value)}
                                  placeholder="Ex: 519283401"
                                  className="p-3 rounded-lg border border-purple-500/10 bg-slate-900/60 text-sm font-mono focus:outline-none focus:border-purple-500"
                                />
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-mono text-gray-500 uppercase">{language === 'pt' ? 'WhatsApp para Contato (Duo Leader)' : 'WhatsApp for Contact (Duo Leader)'}</label>
                              <input
                                  type="text"
                                  value={whatsapp}
                                  onChange={e => setWhatsapp(e.target.value)}
                                  placeholder={language === 'pt' ? 'DDD + Número' : 'Country code + Number'}
                                  className="p-3 rounded-lg border border-purple-500/10 bg-slate-900/60 text-sm font-mono focus:outline-none focus:border-purple-500"
                              />
                            </div>

                            <button
                              disabled={!p1User || !p1Pubg || !whatsapp}
                              onClick={() => setFormStep(2)}
                              className="w-full mt-2 p-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-mono font-bold text-center uppercase"
                            >
                              {language === 'pt' ? 'Próximo Passo (Dados do Parceiro)' : 'Next Step (Partner Details)'}
                            </button>
                          </div>
                        )}

                        {formStep === 2 && (
                          <div className="flex flex-col gap-4">
                            <span className="text-xs text-gray-400">
                              {language === 'pt' ? 'Insira as credenciais do' : 'Enter the credentials for'} <b>{language === 'pt' ? 'Jogador 2 (Seu Parceiro)' : 'Player 2 (Your Partner)'}</b>:
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-mono text-gray-500 uppercase">{language === 'pt' ? 'PUBG Nickname do Parceiro' : 'Partner PUBG Nickname'}</label>
                                <input
                                  type="text"
                                  value={p2User}
                                  onChange={e => setP2User(e.target.value)}
                                  placeholder="Ex: FN_DragonPlayer"
                                  className="p-3 rounded-lg border border-purple-500/10 bg-slate-900/60 text-sm font-mono focus:outline-none focus:border-purple-500"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-mono text-gray-500 uppercase">{language === 'pt' ? 'ID de Personagem do Parceiro' : 'Partner Character ID'}</label>
                                <input
                                  type="text"
                                  value={p2Pubg}
                                  onChange={e => setP2Pubg(e.target.value)}
                                  placeholder="Ex: 510931485"
                                  className="p-3 rounded-lg border border-purple-500/10 bg-slate-900/60 text-sm font-mono focus:outline-none focus:border-purple-500"
                                />
                              </div>
                            </div>

                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => setFormStep(1)}
                                className="w-1/3 p-3 rounded-lg border border-purple-500/20 hover:bg-slate-900 text-xs font-mono uppercase text-center"
                              >
                                {language === 'pt' ? 'Voltar' : 'Back'}
                              </button>
                              <button
                                disabled={!p2User || !p2Pubg || submittingInsc}
                                onClick={handleRegisterDuo}
                                className="w-2/3 p-3 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 text-xs font-mono font-bold text-center uppercase flex items-center justify-center gap-1"
                              >
                                {submittingInsc ? (language === 'pt' ? 'Sincronizando...' : 'Syncing...') : (language === 'pt' ? 'Gerar Inscrição & Pagar' : 'Generate Inscription & Pay')}
                              </button>
                            </div>
                          </div>
                        )}

                        {formStep === 3 && successInsc && (
                          <div className="flex flex-col items-center text-center gap-4 py-3">
                            <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
                            <h5 className="text-base font-sans font-black text-gray-100 uppercase">
                              {language === 'pt' ? 'Inscrição Gerada com Sucesso!' : 'Inscription Generated Successfully!'}
                            </h5>
                            <p className="text-xs text-gray-400 font-mono leading-relaxed max-w-sm">
                              {language === 'pt' 
                                ? <>Seu Duo <b>{successInsc.player1Username} & {successInsc.player2Username}</b> foi reservado. Realize o seu Pix abaixo para confirmar a sua vaga de forma automática.</>
                                : <>Your Duo <b>{successInsc.player1Username} & {successInsc.player2Username}</b> has been reserved. Complete the payment below to confirm your slot automatically.</>
                              }
                            </p>

                            <div className="w-full bg-slate-900 p-4 border border-purple-500/15 rounded-xl flex flex-col gap-3">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="text-gray-500">{language === 'pt' ? 'Valor da Inscrição' : 'Fee Amount'}:</span>
                                <span className="text-green-400 font-extrabold">R$ {selectedScrim.price.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="text-gray-500">{language === 'pt' ? 'ID Inscrição' : 'Inscription ID'}:</span>
                                <span className="text-gray-200">{successInsc.inscriptionId}</span>
                              </div>
                              
                              <div className="h-px bg-slate-800 my-1" />
                              
                              <div className="flex flex-col items-center gap-2">
                                {/* SVG Pix QR Code Mock */}
                                <div className="p-2.5 bg-white rounded-lg">
                                  <svg className="w-32 h-32" viewBox="0 0 100 100" fill="black">
                                    <path d="M5 5h10v10H5zm20 0h10v10H25zm50 0h15v15H75zm-70 70h15v15H5zm70 0h15v15H75zM20 20h20v5H20zm10 25h15v5H30zm40 10h15v10H70z" />
                                    <path d="M12 12h5v5h-5zm30 30h5v5h-5zm25 15h5v5h-5z" fill="#8B5CF6" />
                                    <rect x="45" y="45" width="10" height="10" fill="black" />
                                  </svg>
                                </div>
                                <span className="text-[10px] font-mono text-[#22C55E]">{language === 'pt' ? 'Código do Pix Copia-e-Cola abaixo:' : 'Pix Copypaste code below:'}</span>
                                <div className="flex items-center w-full gap-2">
                                  <input
                                    type="text"
                                    readOnly
                                    value={successInsc.paymentPixCode}
                                    className="p-2 sm:p-2.5 rounded bg-slate-950 text-[10px] font-mono text-gray-400 flex-1 border border-purple-500/10 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleCopy(successInsc.paymentPixCode, 'copypaste')}
                                    className="p-2.5 sm:p-3 rounded bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-semibold"
                                  >
                                    {copiedKey === 'copypaste' ? (language === 'pt' ? 'Copiado!' : 'Copied!') : <Copy className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setIsInscribing(false);
                                setFormStep(1);
                                setSuccessInsc(null);
                              }}
                              className="w-full mt-2 py-3 bg-purple-600/10 hover:bg-[#121826] border border-purple-500/20 text-xs font-mono font-bold rounded-lg text-center"
                            >
                              {language === 'pt' ? 'Voltar para Detalhes' : 'Back to Details'}
                            </button>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECONDARY CARD Standings / LEADERBOARD */}
              {selectedScrim.leaderboard && selectedScrim.leaderboard.length > 0 ? (
                <div className="p-6 rounded-2xl border border-purple-500/10 bg-slate-950/40 backdrop-blur-md flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-purple-500/10 pb-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400 animate-pulse" />
                      <h4 className="text-sm font-mono font-bold tracking-widest text-[#A855F7] uppercase">
                        {t.scrims.leaderboardTitle}
                      </h4>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-mono">
                      <thead>
                        <tr className="border-b border-purple-500/10 text-gray-500 uppercase tracking-wider h-10">
                          <th className="py-2 px-3 text-center">Pos</th>
                          <th className="py-2 px-3">Duo Team</th>
                          <th className="py-2 px-3">{language === 'pt' ? 'Jogadores' : 'Players'}</th>
                          <th className="py-2 px-3 text-center">Kills</th>
                          <th className="py-2 px-3 text-center">{language === 'pt' ? 'Pontos' : 'Points'}</th>
                          <th className="py-2 px-3 text-center">{language === 'pt' ? 'Destaque' : 'Highlight'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedScrim.leaderboard.map((item, idx) => (
                          <tr
                            key={idx}
                            className={`border-b border-purple-200/[0.04] h-12 hover:bg-purple-500/[0.02] transition-colors duration-150 ${
                              idx === 0 ? 'bg-yellow-500/5 text-yellow-300 font-semibold' : ''
                            }`}
                          >
                            <td className="py-2 px-3 text-center">
                              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${item.placement}`}
                            </td>
                            <td className="py-2 px-3 max-w-[150px] truncate">{item.teamName}</td>
                            <td className="py-2 px-3 text-gray-400 text-[11px] truncate">
                              {item.player1} + {item.player2}
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-gray-300">{item.kills}</td>
                            <td className="py-2 px-3 text-center font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">{item.points}</td>
                            <td className="py-2 px-3 text-center">
                              {item.mvp ? (
                                <span className="px-2 py-0.5 rounded bg-green-500 text-slate-950 text-[9px] font-mono leading-none font-black tracking-widest uppercase shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                                  MVP
                                </span>
                              ) : (
                                <span className="text-gray-700">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : selectedScrim.status === 'finished' ? (
                <div className="p-6 border border-dashed border-purple-500/15 rounded-2xl text-center text-gray-500 font-mono text-xs flex items-center justify-center py-10">
                  {language === 'pt' 
                    ? 'Os resultados e tabela oficial deste treino estão aguardando apuração do administrador.' 
                    : 'The official results and standings of this training room are awaiting administrator processing.'
                  }
                </div>
              ) : (
                <div className="p-6 border border-dashed border-purple-500/15 rounded-2xl text-center text-gray-500 font-mono text-xs flex flex-col items-center justify-center p-6 gap-2">
                  <span>{language === 'pt' ? 'Inscrições abertas para este match room diário PUBG Mobile Duo TPP.' : 'Open inscriptions for this daily PUBG Mobile Duo TPP match room.'}</span>
                  <span className="text-[10px] text-purple-400/80">{language === 'pt' ? 'Resultados serão postados imediatamente após o término do MD3.' : 'Results will be posted immediately after the end of the Best of 3.'}</span>
                </div>
              )}

            </div>
          ) : (
            <div className="h-44 border border-dashed border-purple-500/10 rounded-2xl flex items-center justify-center text-gray-500 font-mono text-xs text-center py-10">
              {language === 'pt' ? 'Selecione uma Scrim para carregar seu status e cronogramas.' : 'Select a Scrim to load its status and schedule.'}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// REAL-TIME VAULT TIMER COMPONENT
function LobbyVault({ scrim, handleCopy, copiedKey }: { scrim: ScrimRoom; handleCopy: (txt: string, lbl: string) => void; copiedKey: string | null }) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const calculateTime = () => {
      const matchTime = new Date(scrim.dateTime).getTime();
      const now = Date.now();
      const diffMs = matchTime - now;

      if (diffMs <= 0) {
        setTimeLeft(0);
        setIsUnlocked(true);
      } else {
        const remainingSeconds = Math.floor(diffMs / 1000);
        setTimeLeft(remainingSeconds);
        // Unlock 15 mins before (15 * 60 = 900 seconds)
        setIsUnlocked(remainingSeconds <= 900);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [scrim.dateTime]);

  const formatCountdown = (totalSeconds: number) => {
    if (totalSeconds <= 0) return "00:00:00";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  return (
    <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 ${
      isUnlocked
        ? 'bg-green-500/5 border-green-500/30'
        : 'bg-slate-900/90 border-[#8B5CF6]/30 shadow-[inset_0_0_10px_rgba(139,92,246,0.1)]'
    }`}>
      
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg flex items-center justify-center ${
          isUnlocked ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-purple-950/40 text-purple-400'
        }`}>
          {isUnlocked ? <Key className="w-5 h-5" /> : <Clock className="w-5 h-5 animate-pulse" />}
        </div>
        
        <div className="text-left">
          <h4 className="text-xs font-mono font-bold text-gray-200">
            {isUnlocked ? (language === 'pt' ? '🔓 CREDENCIAIS DA SALA REVELADAS!' : '🔓 ROOM CREDENTIALS REVEALED!') : (language === 'pt' ? '🔒 COFRE DE PROVA COMPROMISSADA' : '🔒 SECURE MATCH ROOM VAULT')}
          </h4>
          <p className="text-[10px] font-mono text-gray-400 leading-normal mt-1 max-w-sm">
            {isUnlocked 
              ? (language === 'pt' ? 'Insira estes dados no menu Lobbies do PUBG Mobile.' : 'Enter these credentials in the PUBG Mobile Custom Lobby menu.')
              : (language === 'pt' ? 'O ID e Senha da sala serão liberados automaticamente exatamente 15 minutos antes da partida.' : 'The room ID and Password will be auto-released exactly 15 minutes before match start.')
            }
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-w-[150px] bg-slate-950/70 p-3 rounded-lg border border-purple-500/10">
        {isUnlocked ? (
          <div className="flex flex-col gap-2 w-full text-xs font-mono">
            <div className="flex justify-between items-center gap-2">
              <span className="text-gray-500 uppercase text-[9px]">Lobby ID:</span>
              <button
                onClick={() => handleCopy(scrim.lobbyId || 'N/A', 'lobbyid')}
                className="flex items-center gap-1.5 text-white bg-purple-600/20 hover:bg-purple-600/40 p-1.5 rounded"
              >
                <b className="text-[#22C55E] tracking-wider text-[11px]">{scrim.lobbyId || 'AGUARDANDO'}</b>
                <Copy className="w-3 h-3" />
              </button>
            </div>
            
            <div className="flex justify-between items-center gap-2">
              <span className="text-gray-500 uppercase text-[9px]">Senha:</span>
              <button
                onClick={() => handleCopy(scrim.lobbyPassword || 'N/A', 'lobbypas')}
                className="flex items-center gap-1.5 text-white bg-purple-600/20 hover:bg-purple-600/40 p-1.5 rounded"
              >
                <b className="text-[#22C55E] tracking-wider text-[11px]">{scrim.lobbyPassword || 'AGUARDANDO'}</b>
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center font-mono">
            <span className="text-[9px] text-[#A855F7] tracking-wider leading-none font-bold uppercase block">{language === 'pt' ? 'REVELAÇÃO EM' : 'UNLOCKS IN'}</span>
            <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-red-400 inline-block mt-1 animate-pulse">
              {formatCountdown(timeLeft)}
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
