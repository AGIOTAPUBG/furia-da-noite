import React, { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ScrimRoom, ProductItem, NewsPost, MatchLeaderboard } from '../types';
import { STARTER_SCRIMS, STARTER_PRODUCTS, STARTER_NEWS } from '../lib/starterData';
import { motion } from 'motion/react';
import { PlusCircle, Save, Database, Sparkles, Trash2, Edit, ToggleLeft, ToggleRight, List, Lock, CheckCircle } from 'lucide-react';

export default function AdminPanel() {
  const user = auth.currentUser;
  const isAuthorized = user?.email?.toLowerCase() === 'prhdeoliveira@gmail.com';

  const [scrims, setScrims] = useState<ScrimRoom[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Database Seeding state
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  // 1. New Scrim State
  const [scrimTitle, setScrimTitle] = useState('');
  const [scrimDate, setScrimDate] = useState('');
  const [scrimFormat, setScrimFormat] = useState('DUO / TPP / MD3');
  const [scrimPrice, setScrimPrice] = useState('10.00');
  const [scrimSlots, setScrimSlots] = useState('25');
  const [scrimLobbyId, setScrimLobbyId] = useState('');
  const [scrimLobbyPass, setScrimLobbyPass] = useState('');
  const [scrimSaving, setScrimSaving] = useState(false);

  // 2. Results Manager State
  const [selectedResultsScrim, setSelectedResultsScrim] = useState<ScrimRoom | null>(null);
  const [teamName, setTeamName] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [kills, setKills] = useState('0');
  const [placement, setPlacement] = useState('1');
  const [points, setPoints] = useState('0');
  const [isMvp, setIsMvp] = useState(false);
  const [matchLeaderboard, setMatchLeaderboard] = useState<MatchLeaderboard[]>([]);

  // Fetch match details and shops
  useEffect(() => {
    if (!isAuthorized) return;

    const unsubScrims = onSnapshot(collection(db, 'scrims'), (snap) => {
      const list: ScrimRoom[] = [];
      snap.forEach(d => list.push({ ...d.data() as ScrimRoom, scrimId: d.id }));
      // nearest dates first
      list.sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      setScrims(list);
      setLoading(false);
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      const list: ProductItem[] = [];
      snap.forEach(d => list.push({ ...d.data() as ProductItem, productId: d.id }));
      setProducts(list);
    });

    return () => {
      unsubScrims();
      unsubProducts();
    };
  }, [isAuthorized]);

  // Read leaderboards when selecting a finished match
  useEffect(() => {
    if (selectedResultsScrim) {
      setMatchLeaderboard(selectedResultsScrim.leaderboard || []);
    }
  }, [selectedResultsScrim]);

  if (!user) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center p-6 bg-[#0B0F19]">
        <Lock className="w-12 h-12 text-red-500 animate-pulse" />
        <h3 className="text-xl font-sans font-black uppercase text-gray-200 mt-4">Acesso Bloqueado</h3>
        <p className="text-xs font-mono text-gray-500 max-w-sm mt-2 leading-relaxed">
          Por favor, conecte-se com sua conta Google de proprietário para validar credenciais administrativas.
        </p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center p-6 bg-[#0B0F19]">
        <Lock className="w-12 h-12 text-yellow-500" />
        <h3 className="text-xl font-sans font-black uppercase text-gray-200 mt-4">Acesso Restrito</h3>
        <p className="text-xs font-mono text-gray-500 max-w-md mt-2 leading-relaxed">
          Sua conta <b>({user.email})</b> não pertence à lista de proprietários autorizados da plataforma Fúria da Noite. 
          Contate prhdeoliveira@gmail.com para solicitar elevação de privilégios.
        </p>
      </div>
    );
  }

  // Database Seeder handler
  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedSuccess(false);
    try {
      // 1. Seed Scrims
      for (const s of STARTER_SCRIMS) {
        await setDoc(doc(db, 'scrims', s.scrimId), s);
      }
      // 2. Seed Products
      for (const p of STARTER_PRODUCTS) {
        await setDoc(doc(db, 'products', p.productId), p);
      }
      // 3. Seed News
      for (const n of STARTER_NEWS) {
        await setDoc(doc(db, 'news', n.newsId), n);
      }
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 5000);
    } catch (err) {
      console.error("Seeding failed: ", err);
      alert("Falha ao semear coleções Firestore. Verifique permissões das regras.");
    } finally {
      setSeeding(false);
    }
  };

  // Scrim Creator Form Submit
  const handleCreateScrim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrimTitle || !scrimDate) {
      alert("Preencha o título e horário!");
      return;
    }

    setScrimSaving(true);
    const mockId = 'scrim-' + Math.random().toString(36).substr(2, 9);
    
    const newScrim: ScrimRoom = {
      scrimId: mockId,
      title: scrimTitle,
      dateTime: new Date(scrimDate).toISOString(),
      format: scrimFormat,
      price: parseFloat(scrimPrice) || 0,
      totalSlots: parseInt(scrimSlots) || 25,
      availableSlots: parseInt(scrimSlots) || 25,
      lobbyId: scrimLobbyId || undefined,
      lobbyPassword: scrimLobbyPass || undefined,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };

    const scrimCol = 'scrims';
    try {
      await setDoc(doc(db, scrimCol, mockId), newScrim);
      setScrimTitle('');
      setScrimDate('');
      setScrimLobbyId('');
      setScrimLobbyPass('');
      alert("Sala Scrim criada com sucesso!");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${scrimCol}/${mockId}`);
    } finally {
      setScrimSaving(false);
    }
  };

  // Toggle Scrim Match Status finished/upcoming
  const handleToggleScrimStatus = async (scrim: ScrimRoom) => {
    const nextStatus = scrim.status === 'upcoming' ? 'finished' : 'upcoming';
    try {
      await updateDoc(doc(db, 'scrims', scrim.scrimId), {
        status: nextStatus
      });
    } catch (err) {
      console.error("Status toggle error: ", err);
    }
  };

  // Delete Scrim Room completely
  const handleDeleteScrim = async (id: string) => {
    if (!window.confirm("Deseja apagar essa sala permanentemente?")) return;
    try {
      await deleteDoc(doc(db, 'scrims', id));
    } catch (err) {
      console.error("Delete error: ", err);
    }
  };

  // Add squad leaderboard record
  const handleAddLeaderboardRow = () => {
    if (!teamName || !player1 || !player2) {
      alert("Insira os dados da Dupla!");
      return;
    }

    const row: MatchLeaderboard = {
      placement: parseInt(placement) || 1,
      teamName,
      player1,
      player2,
      kills: parseInt(kills) || 0,
      points: parseInt(points) || 0,
      mvp: isMvp
    };

    // Sort leaderboard by placement automatically
    const updated = [...matchLeaderboard, row];
    updated.sort((a,b) => a.placement - b.placement);
    setMatchLeaderboard(updated);

    // Reset row form
    setTeamName('');
    setPlayer1('');
    setPlayer2('');
    setKills('0');
    setPoints('0');
    setIsMvp(false);
  };

  // Save the entire stands leaderboard update
  const handleSaveLeaderboards = async () => {
    if (!selectedResultsScrim) return;
    try {
      await updateDoc(doc(db, 'scrims', selectedResultsScrim.scrimId), {
        leaderboard: matchLeaderboard,
        status: 'finished'
      });
      alert(`Resultados da Scrim "${selectedResultsScrim.title}" salvos e sincronizados com sucesso!`);
    } catch (err) {
      alert("Erro ao salvar tabela de pontos.");
      console.error(err);
    }
  };

  // Toggle Shop item visibility online/offline
  const handleToggleProductVisibility = async (prod: ProductItem) => {
    try {
      await updateDoc(doc(db, 'products', prod.productId), {
        visible: !prod.visible
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Adjust product prices
  const handleUpdateProductPrice = async (prod: ProductItem, newPrice: number) => {
    try {
      await updateDoc(doc(db, 'products', prod.productId), {
        price: newPrice
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#0B0F19] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex flex-col gap-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-purple-500/15 pb-6">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-sans font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-purple-500 leading-none">
              Painel Administrativo Fúria
            </h2>
            <p className="text-xs font-mono text-gray-500 mt-1.5 leading-none">
              Gerencie Lobbies PUBG Mobile, atualize rankings oficiais de Copas diárias e controle a vitrine de produtos.
            </p>
          </div>

          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-500/30 bg-purple-950/20 hover:bg-purple-600 text-xs font-mono font-bold uppercase transition disabled:opacity-50"
          >
            <Database className="w-4 h-4 text-purple-400" />
            {seeding ? 'Semeando Banco...' : 'Reiniciar Banco (Starter Data)'}
          </button>
        </div>

        {/* FEEDBACK POPUP */}
        {seedSuccess && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 text-xs font-mono text-[#22C55E]">
            <CheckCircle className="w-5 h-5" />
            <span>Banco de dados alimentado com sucesso! Scrims, Produtos e News prontas para visualização.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* SCRIM MATCH ROOM CREATOR */}
          <div className="p-6 bg-slate-950/40 rounded-2xl border border-purple-500/10 flex flex-col gap-5 text-left">
            <h3 className="text-base font-sans font-black uppercase text-[#A855F7] border-b border-purple-500/15 pb-3 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-purple-400" />
              1. Declarar Novo Match Room / Scrim
            </h3>

            <form onSubmit={handleCreateScrim} className="flex flex-col gap-4 text-xs font-mono">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase text-gray-500">Título do Treino</label>
                <input
                  type="text"
                  required
                  value={scrimTitle}
                  onChange={e => setScrimTitle(e.target.value)}
                  placeholder="Ex: Scrim Diária Elite Duo #248"
                  className="p-3 bg-slate-900 border border-purple-500/10 rounded-lg focus:outline-none focus:border-purple-500 text-sm text-gray-100 placeholder:text-gray-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase text-gray-500">Dia & Horário</label>
                  <input
                    type="datetime-local"
                    required
                    value={scrimDate}
                    onChange={e => setScrimDate(e.target.value)}
                    className="p-3 bg-slate-900 border border-purple-500/10 rounded-lg focus:outline-none focus:border-purple-500 text-sm text-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase text-gray-500">Formato / Mapas</label>
                  <input
                    type="text"
                    required
                    value={scrimFormat}
                    onChange={e => setScrimFormat(e.target.value)}
                    placeholder="Ex: DUO / TPP / MD3 (Erangel)"
                    className="p-3 bg-slate-900 border border-purple-500/10 rounded-lg focus:outline-none focus:border-purple-500 text-sm text-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase text-gray-500">Valor Inscrição (BRL)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={scrimPrice}
                    onChange={e => setScrimPrice(e.target.value)}
                    placeholder="Ex: 10.00"
                    className="p-3 bg-slate-900 border border-purple-500/10 rounded-lg focus:outline-none focus:border-purple-500 text-sm text-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase text-gray-500">Capacidade de Slots</label>
                  <input
                    type="number"
                    required
                    value={scrimSlots}
                    onChange={e => setScrimSlots(e.target.value)}
                    placeholder="Ex: 25"
                    className="p-3 bg-slate-900 border border-purple-500/10 rounded-lg focus:outline-none focus:border-purple-500 text-sm text-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-purple-500/[0.05] pt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase text-[#22C55E]">PUBG Custom Lobby ID</label>
                  <input
                    type="text"
                    value={scrimLobbyId}
                    onChange={e => setScrimLobbyId(e.target.value)}
                    placeholder="Inserir ID do lobby para revelação"
                    className="p-3 bg-slate-900 border border-[#22C55E]/20 rounded-lg focus:outline-none focus:border-[#22C55E] text-sm text-gray-300 placeholder:text-gray-600"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase text-[#22C55E]">Lobby Password (Senha)</label>
                  <input
                    type="text"
                    value={scrimLobbyPass}
                    onChange={e => setScrimLobbyPass(e.target.value)}
                    placeholder="Senha de acesso"
                    className="p-3 bg-slate-900 border border-[#22C55E]/20 rounded-lg focus:outline-none focus:border-[#22C55E] text-sm text-gray-300 placeholder:text-gray-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={scrimSaving}
                className="w-full mt-2 p-4 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold uppercase transition tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(139,92,246,0.3)] disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {scrimSaving ? 'Salvando Sala...' : 'Cadastrar Room na Agenda'}
              </button>
            </form>
          </div>

          {/* RESULTS POINT INPUTSTANDINGS */}
          <div className="p-6 bg-slate-950/40 rounded-2xl border border-purple-500/10 flex flex-col gap-5 text-left">
            <h3 className="text-base font-sans font-black uppercase text-[#22C55E] border-b border-purple-500/15 pb-3 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-green-400" />
              2. Sincronizar Placar & Standings Copa
            </h3>

            <div className="flex flex-col gap-4 text-xs font-mono">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase text-gray-500">Selecione a Scrim Correspondente</label>
                <select
                  onChange={(e) => {
                    const match = scrims.find(s => s.scrimId === e.target.value);
                    setSelectedResultsScrim(match || null);
                  }}
                  className="p-3 bg-slate-900 border border-purple-500/10 rounded-lg focus:outline-none text-sm text-gray-300"
                >
                  <option value="">-- Escolher treinos --</option>
                  {scrims.map(s => (
                    <option key={s.scrimId} value={s.scrimId}>
                      {s.title} ({s.status === 'finished' ? 'ENCERRADA' : 'EM AGENDAMENTO'})
                    </option>
                  ))}
                </select>
              </div>

              {selectedResultsScrim && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/10 flex flex-col gap-4">
                  <div className="flex justify-between items-center text-[10px] text-purple-400 border-b border-purple-500/10 pb-2">
                    <span>EDITANDO TABELA COPA: <b>{selectedResultsScrim.title}</b></span>
                    <button
                      onClick={() => handleToggleScrimStatus(selectedResultsScrim)}
                      className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold font-mono text-[9px]"
                    >
                      FORÇAR STATUS: {selectedResultsScrim.status === 'upcoming' ? 'CONCLUIR' : 'MARCAR BREVE'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase text-gray-500">Dupla Team Name</label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={e => setTeamName(e.target.value)}
                        placeholder="Ex: FÚRIA | Dragon"
                        className="p-2.5 bg-slate-950 border border-purple-500/10 rounded focus:outline-none text-xs text-gray-200"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase text-gray-500">Posição de Standings (Placement)</label>
                      <input
                        type="number"
                        min="1"
                        value={placement}
                        onChange={e => setPlacement(e.target.value)}
                        className="p-2.5 bg-slate-950 border border-purple-500/10 rounded focus:outline-none text-xs text-gray-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase text-gray-500">Player 1 Nick</label>
                      <input
                        type="text"
                        value={player1}
                        onChange={e => setPlayer1(e.target.value)}
                        placeholder="NickPlayer_1"
                        className="p-2.5 bg-slate-950 border border-purple-500/10 rounded focus:outline-none text-xs text-gray-200"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase text-gray-500">Player 2 Nick</label>
                      <input
                        type="text"
                        value={player2}
                        onChange={e => setPlayer2(e.target.value)}
                        placeholder="NickPlayer_2"
                        className="p-2.5 bg-slate-950 border border-purple-500/10 rounded focus:outline-none text-xs text-gray-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase text-gray-500">Kills Totais</label>
                      <input
                        type="number"
                        min="0"
                        value={kills}
                        onChange={e => setKills(e.target.value)}
                        className="p-2.5 bg-slate-950 border border-purple-500/10 rounded focus:outline-none text-xs text-gray-200"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase text-gray-500">Pontos Finais (Kills+Colocação)</label>
                      <input
                        type="number"
                        min="0"
                        value={points}
                        onChange={e => setPoints(e.target.value)}
                        className="p-2.5 bg-slate-950 border border-purple-500/10 rounded focus:outline-none text-xs text-gray-200"
                      />
                    </div>
                    <div className="flex flex-col justify-end gap-1.5 pb-2">
                      <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-gray-300 uppercase">
                        <input
                          type="checkbox"
                          checked={isMvp}
                          onChange={e => setIsMvp(e.target.checked)}
                          className="w-4 h-4 rounded border-purple-500 text-purple-600 bg-slate-900"
                        />
                        Destaque MVP
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleAddLeaderboardRow}
                    className="w-full py-2.5 rounded bg-green-600 hover:bg-green-500 text-slate-950 text-xs font-bold uppercase transition"
                  >
                    Adicionar Dupla na Lista
                  </button>

                  {/* ACTIVE PREVIEW */}
                  {matchLeaderboard.length > 0 && (
                    <div className="flex flex-col gap-2 border-t border-purple-500/[0.05] pt-3">
                      <span className="text-[9px] text-gray-400">FILA ATUAL SALVANDO:</span>
                      <div className="max-h-24 overflow-y-auto text-[10px] font-mono flex flex-col gap-1">
                        {matchLeaderboard.map((m, idx) => (
                          <div key={idx} className="flex justify-between p-1 rounded bg-slate-950/80">
                            <span>#{m.placement} <b>{m.teamName}</b> ({m.kills} kills)</span>
                            <span className="text-[#22C55E] font-bold">{m.points} pts {m.mvp && '⭐️'}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        onClick={handleSaveLeaderboards}
                        className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 font-bold uppercase tracking-wider rounded-xl text-center text-white mt-1"
                      >
                        Salvar e Atualizar Classificação
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

        </div>

        {/* SHOP MERCHANDISE & PRICING MANAGERS */}
        <section className="p-6 bg-slate-950/40 rounded-2xl border border-purple-500/10 flex flex-col gap-4 text-left">
          <h3 className="text-base font-sans font-black uppercase text-[#A855F7] border-b border-purple-500/15 pb-3">
            3. Catálogo Gamer de Preços & Visibilidade
          </h3>

          <div className="overflow-x-auto text-xs font-mono">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-500/10 text-gray-500 uppercase h-10 tracking-widest text-[10px]">
                  <th className="py-2 px-3">Nome do Produto</th>
                  <th className="py-2 px-3">Categoria</th>
                  <th className="py-2 px-3 text-center">Valor Comercial</th>
                  <th className="py-2 px-3 text-center">Visibilidade</th>
                  <th className="py-2 px-3 text-center">Controle</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-600">Sem itens registrados.</td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.productId} className="border-b border-purple-500/[0.04] h-14 hover:bg-slate-900/10">
                      <td className="py-2 px-3 font-semibold text-gray-200">{p.name}</td>
                      <td className="py-2 px-3 uppercase text-purple-400 font-bold text-[10px]">{p.type}</td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={p.price.toString()}
                          onBlur={(e) => handleUpdateProductPrice(p, parseFloat(e.target.value) || 0)}
                          className="w-20 p-1.5 bg-slate-900 text-center rounded text-xs text-white border border-purple-500/10"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleToggleProductVisibility(p)}
                            className="text-gray-400 hover:text-white"
                          >
                            {p.visible ? (
                              <span className="px-2 py-0.5 rounded bg-green-500/15 text-green-400 font-bold uppercase text-[9px]">EXIBINDO</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-400 font-bold uppercase text-[9px]">OCULTADO</span>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleToggleProductVisibility(p)}
                            className="text-gray-500 hover:text-purple-400 p-1 rounded"
                            title="Alternar Visibilidade"
                          >
                            {p.visible ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-gray-600" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* MATCH LIST (CRUD OPERATIONS REMINDER) */}
        <section className="p-6 bg-slate-950/40 rounded-2xl border border-purple-500/10 flex flex-col gap-4 text-left">
          <h3 className="text-base font-sans font-black uppercase text-gray-200 border-b border-purple-500/15 pb-3">
            Estatísticas Gerais & Gerenciamento de Salas Ativas ({scrims.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scrims.map((scrim) => (
              <div
                key={scrim.scrimId}
                className="p-4 rounded-xl border border-purple-500/10 bg-slate-950 flex flex-col gap-3 justify-between"
              >
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-purple-400">
                    <span>{scrim.scrimId}</span>
                    <span className="uppercase text-[#22C55E]">{scrim.status}</span>
                  </div>
                  <h4 className="text-sm font-sans font-bold text-gray-100 mt-1 lines-clamp-1">{scrim.title}</h4>
                  <p className="text-[10px] text-gray-500 font-mono mt-1">Horário: {new Date(scrim.dateTime).toLocaleString('pt-BR')}</p>
                </div>

                <div className="flex justify-between items-center border-t border-purple-500/[0.05] pt-3 mt-1">
                  <span className="text-xs font-semibold text-green-400 font-mono">R$ {scrim.price.toFixed(2)}</span>
                  <button
                    onClick={() => handleDeleteScrim(scrim.scrimId)}
                    className="p-2 bg-red-500/10 hover:bg-red-500 hover:text-white rounded text-red-400 transition"
                    title="Deletar Sala"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
