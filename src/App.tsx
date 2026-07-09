import { useState, useEffect, useRef } from 'react'
import { useTranslation, LANGS, type Lang } from './i18n'

const API = 'https://furiadanoite.com.br/api'

const api = async (path: string, opts: RequestInit = {}, token?: string) => {
  const headers: any = { 'Content-Type': 'application/json', ...(opts.headers || {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const r = await fetch(`${API}${path}`, { ...opts, headers })
  const d = await r.json()
  if (!r.ok) throw new Error(d.detail || 'Erro')
  return d
}

// ── Types ─────────────────────────────────────────────────────────────────────
type Seat = { slot: number; nick1?: string; nick2?: string; status: 'empty' | 'pendente' | 'confirmado' }
type Scrim = {
  scrim_id: string; title: string; date_time: string; region: string
  prize: number; inscritos: number; status: string; arte_url?: string
  organizer_email?: string; lucro_organizador?: number
}
type User = {
  user_id: string; email: string; username: string; nick_pubg: string
  role: string; apoiador: boolean; apoiador_ate?: string
}
type Inscricao = {
  insc_id: string; slot: number; nick1: string; nick2: string
  email: string; whatsapp: string; status: 'pendente' | 'confirmado'
}

// ── Components fora do App() para evitar bug de re-render ─────────────────────

function InscModal({ scrim, onClose, onInscrever, selectedPair }: {
  scrim: Scrim; onClose: () => void; onInscrever: (f: any) => Promise<any>; selectedPair?: [number, number] | null
}) {
  const [form, setForm] = useState({ nick1: '', nick2: '', email: '', whatsapp: '' })
  const [result, setResult] = useState<any>(null)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))
  const submit = async () => {
    setLoading(true); setErr('')
    try { const r = await onInscrever({ ...form, slot1: selectedPair?.[0], slot2: selectedPair?.[1] }); setResult(r) }
    catch (e: any) { setErr(e.message) }
    setLoading(false)
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#1a1a2e', border: '1px solid #7c3aed', borderRadius: 12, padding: '2rem', width: 420, maxWidth: '95vw', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>✕</button>
        <h3 style={{ color: '#7c3aed', marginBottom: '.5rem' }}>✈ Inscrever DUO</h3>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.83rem', marginBottom: '1.5rem' }}>{scrim.title}</p>
        {selectedPair && (
          <div style={{ background: 'rgba(124,58,237,.15)', border: '1px solid #7c3aed', borderRadius: 8, padding: '10px 14px', marginBottom: '1.2rem', textAlign: 'center' }}>
            <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '.9rem' }}>
              🪑 Assentos {selectedPair[0]} & {selectedPair[1]}
            </span>
            <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '.75rem', display: 'block', marginTop: 2 }}>lado {selectedPair[0] <= 50 ? 'esquerdo' : 'direito'}</span>
          </div>
        )}
        {result ? (
          <div style={{ color: '#00ff6a', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: '1rem' }}>✅</div>
            <p>DUO inscrito — Assentos <strong>#{result.slot}</strong>!</p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,.6)', marginTop: 8 }}>Aguarde confirmação do PIX pelo organizador.</p>
            <button onClick={onClose} style={{ marginTop: '1.5rem', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer' }}>Fechar</button>
          </div>
        ) : (
          <>
            {[
              ['nick1', 'Nick Player 1 (assento ' + (selectedPair?.[0] ?? '?') + ')'],
              ['nick2', 'Nick Player 2 (assento ' + (selectedPair?.[1] ?? '?') + ')'],
              ['email', 'E-mail'],
              ['whatsapp', 'WhatsApp'],
            ].map(([k, label]) => (
              <div key={k} style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', display: 'block', marginBottom: 4 }}>{label}</label>
                <input value={(form as any)[k]} onChange={set(k)}
                  style={{ width: '100%', background: '#0d0d1a', border: '1px solid #333', borderRadius: 8, padding: '10px 12px', color: '#fff', boxSizing: 'border-box' }} />
              </div>
            ))}
            {err && <p style={{ color: '#ff4444', fontSize: '.85rem' }}>{err}</p>}
            <button onClick={submit} disabled={loading} style={{ width: '100%', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', cursor: 'pointer', fontWeight: 700, marginTop: 8 }}>
              {loading ? 'Inscrevendo...' : 'CONFIRMAR INSCRIÇÃO — R$15'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function ScrimCard({ s, onSelect }: { s: Scrim; onSelect: () => void }) {
  const dt = new Date(s.date_time)
  const statusColor = s.status === 'open' ? '#00ff6a' : '#ff4444'
  return (
    <div onClick={onSelect} style={{
      background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 12,
      padding: '1.5rem', cursor: 'pointer', transition: 'border-color .2s',
      display: 'flex', gap: '1rem', alignItems: 'flex-start'
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#7c3aed')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a4a')}>
      {s.arte_url
        ? <img src={s.arte_url} alt="arte" style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
        : <div style={{ width: 64, height: 64, borderRadius: 8, background: '#7c3aed22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>✈</div>
      }
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ color: '#fff', margin: 0, fontSize: '1rem' }}>{s.title}</h3>
          <span style={{ color: statusColor, fontSize: '.75rem', fontWeight: 700 }}>{s.status.toUpperCase()}</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.85rem', margin: '4px 0' }}>
          📅 {dt.toLocaleString('pt-BR')} · 🌍 {s.region}
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: 8 }}>
          <span style={{ color: '#00ff6a', fontSize: '.85rem' }}>🏆 R${s.prize}</span>
          <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem' }}>👥 {s.inscritos}/50 duos</span>
        </div>
      </div>
    </div>
  )
}

function BarChart({ data }: { data: { mes: string; valor: number }[] }) {
  const max = Math.max(...data.map(d => d.valor), 1)
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 160, padding: '0 8px' }}>
      {data.map(d => (
        <div key={d.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ color: '#00ff6a', fontSize: '.7rem', fontWeight: 700 }}>
            {d.valor > 0 ? `R$${d.valor.toFixed(0)}` : ''}
          </span>
          <div style={{
            width: '100%', background: '#7c3aed',
            height: `${Math.max((d.valor / max) * 120, 4)}px`,
            borderRadius: '4px 4px 0 0', transition: 'height .4s'
          }} />
          <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '.65rem' }}>{d.mes}</span>
        </div>
      ))}
    </div>
  )
}

// ── Tipo de assento estendido ─────────────────────────────────────────────────
type SeatStatus = 'empty' | 'pendente' | 'confirmado'
type AirSeat = { seat: number; nick?: string; status: SeatStatus }

function AirplaneMap({ seats, onSelectPair }: {
  seats: AirSeat[]
  onSelectPair?: (s1: number, s2: number) => void
}) {
  // 100 assentos: lado esquerdo 1-50 (pares: 1+2, 3+4...), lado direito 51-100 (pares: 51+52, 53+54...)
  const getSeat = (n: number): AirSeat => seats.find(s => s.seat === n) || { seat: n, status: 'empty' }

  const seatColor = (st: SeatStatus) =>
    st === 'confirmado' ? '#1d4ed8' : st === 'pendente' ? '#fbbf24' : '#1e293b'
  const seatBorder = (st: SeatStatus) =>
    st === 'confirmado' ? '#3b82f6' : st === 'pendente' ? '#f59e0b' : '#334155'
  const seatIcon = (st: SeatStatus) =>
    st === 'confirmado' ? '✓' : st === 'pendente' ? '⏳' : ''

  const canSelect = (s1: AirSeat, s2: AirSeat) =>
    s1.status === 'empty' && s2.status === 'empty' && !!onSelectPair

  const Seat = ({ n }: { n: number }) => {
    const s = getSeat(n)
    return (
      <div title={s.nick ? s.nick : `Assento ${n}`}
        style={{
          width: 28, height: 28, borderRadius: 5,
          background: seatColor(s.status),
          border: `1px solid ${seatBorder(s.status)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.6rem', color: s.status === 'confirmado' ? '#fff' : s.status === 'pendente' ? '#000' : '#475569',
          fontWeight: 700, flexShrink: 0,
          boxShadow: s.status !== 'empty' ? '0 0 6px rgba(59,130,246,.4)' : 'none',
        }}>
        {seatIcon(s.status) || n}
      </div>
    )
  }

  const PairRow = ({ a, b, row }: { a: number; b: number; row: number }) => {
    const sa = getSeat(a), sb = getSeat(b)
    const clickable = canSelect(sa, sb)
    return (
      <div
        onClick={() => clickable && onSelectPair!(a, b)}
        style={{
          display: 'flex', gap: 3, alignItems: 'center',
          cursor: clickable ? 'pointer' : 'default',
          padding: '2px 3px', borderRadius: 6,
          background: clickable ? 'rgba(124,58,237,.0)' : 'transparent',
          transition: 'background .15s',
        }}
        onMouseOver={e => { if (clickable) (e.currentTarget as HTMLDivElement).style.background = 'rgba(124,58,237,.25)' }}
        onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
        title={clickable ? `Selecionar par ${a} & ${b}` : ''}
      >
        <Seat n={a} />
        <Seat n={b} />
      </div>
    )
  }

  // 25 fileiras por lado
  const leftRows: [number, number][] = Array.from({ length: 25 }, (_, i) => [i * 2 + 1, i * 2 + 2])
  const rightRows: [number, number][] = Array.from({ length: 25 }, (_, i) => [51 + i * 2, 52 + i * 2])

  return (
    <div style={{ fontFamily: "'Exo 2', sans-serif" }}>
      {/* Legenda */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', fontSize: '.75rem', flexWrap: 'wrap' }}>
        {[['#1d4ed8', '#3b82f6', 'Confirmado'], ['#fbbf24', '#f59e0b', 'Pendente'], ['#1e293b', '#334155', 'Disponível']].map(([bg, border, label]) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,.5)' }}>
            <span style={{ width: 14, height: 14, background: bg, border: `1px solid ${border}`, borderRadius: 3, display: 'inline-block' }} />
            {label}
          </span>
        ))}
        {onSelectPair && <span style={{ color: 'rgba(124,58,237,.8)', fontSize: '.72rem' }}>👆 Clique no par para inscrever</span>}
      </div>

      {/* Avião */}
      <div style={{ display: 'flex', gap: 0, justifyContent: 'center', alignItems: 'flex-start', maxWidth: 480, margin: '0 auto' }}>

        {/* Números esquerda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingTop: 2, marginRight: 6 }}>
          {leftRows.map(([a], i) => (
            <div key={i} style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <span style={{ color: '#475569', fontSize: '.65rem', width: 16, textAlign: 'right' }}>{Math.floor((a - 1) / 2) + 1}</span>
            </div>
          ))}
        </div>

        {/* Lado esquerdo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {leftRows.map(([a, b]) => <PairRow key={a} a={a} b={b} row={a} />)}
        </div>

        {/* Corredor */}
        <div style={{ width: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '0 4px' }}>
          <div style={{ color: '#7c3aed', fontSize: '.55rem', letterSpacing: 1, writingMode: 'vertical-rl', transform: 'rotate(180deg)', opacity: .5, paddingTop: 4 }}>CORREDOR</div>
        </div>

        {/* Lado direito */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {rightRows.map(([a, b]) => <PairRow key={a} a={a} b={b} row={a} />)}
        </div>

        {/* Números direita */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingTop: 2, marginLeft: 6 }}>
          {rightRows.map(([a], i) => (
            <div key={i} style={{ height: 32, display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: '.65rem', width: 16 }}>{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resumo */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
        {(() => {
          const conf = seats.filter(s => s.status === 'confirmado').length
          const pend = seats.filter(s => s.status === 'pendente').length
          const livre = 100 - conf - pend
          return [
            [`${conf}`, 'Confirmados', '#3b82f6'],
            [`${pend}`, 'Pendentes', '#fbbf24'],
            [`${livre}`, 'Disponíveis', '#475569'],
          ].map(([v, l, c]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ color: c, fontWeight: 700, fontSize: '1.1rem' }}>{v}</div>
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.7rem' }}>{l}</div>
            </div>
          ))
        })()}
      </div>
    </div>
  )
}

function SlotGrid({ seats }: { seats: Seat[] }) {
  // Compatibilidade retroativa — converte Seat[] para AirSeat[]
  const airSeats: AirSeat[] = seats.map(s => ({ seat: s.slot, nick: s.nick1 ? `${s.nick1} & ${s.nick2}` : undefined, status: s.status }))
  return <AirplaneMap seats={airSeats} />
}

function Dashboard({
  user, token, logout, dashTab, setDashTab, dashScrims, setDashScrims,
  createScrimForm, setCreateScrimForm, success, setSuccess, error, setError, loading, setLoading
}: any) {
  const [dashData, setDashData] = useState<any>(null)
  const [activeScrimDetail, setActiveScrimDetail] = useState<string | null>(null)
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [editModal, setEditModal] = useState<Scrim | null>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [staffEmail, setStaffEmail] = useState('')
  const [staffScrim, setStaffScrim] = useState<string | null>(null)
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null)

  useEffect(() => {
    api('/dashboard', {}, token).then(setDashData).catch(() => { })
  }, [token])

  const doCreateScrim = async () => {
    setLoading(true); setError(''); setSuccess('')
    try {
      const endpoint = user?.role === 'admin' ? '/admin/scrims' : '/scrims'
      const d = await api(endpoint, {
        method: 'POST',
        body: JSON.stringify({ ...createScrimForm, prize: parseFloat(createScrimForm.prize) })
      }, token)
      setSuccess(`Scrim "${d.title}" criada! ID: ${d.scrim_id}`)
      const scrims = await api('/scrims', {}, token)
      setDashScrims(scrims)
      api('/dashboard', {}, token).then(setDashData)
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }

  const uploadArte = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const r = await fetch(`${API}/upload/arte`, {
        method: 'POST', body: fd,
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.detail || 'Erro no upload')
      setCreateScrimForm((f: any) => ({ ...f, arte_url: d.url }))
    } catch (e: any) { setError(e.message) }
    setUploading(false)
  }

  const loadInscricoes = async (scrimId: string) => {
    try {
      const d = await api(`/scrims/${scrimId}/inscricoes`, {}, token)
      setInscricoes(d); setActiveScrimDetail(scrimId)
    } catch (e: any) { setError(e.message) }
  }

  const [palpites, setPalpites] = useState<Record<string, number>>({});
  const [meuPalpite, setMeuPalpite] = useState<string | null>(null);

  const registrarPalpite = async (scrimId: string, nick: string) => {
    await api(`/scrims/${scrimId}/palpites`, { method: 'POST', body: JSON.stringify({ nick_apostado: nick }) }, token);
    carregarPalpites(scrimId);
  };

  const carregarPalpites = async (scrimId: string) => {
    const d = await api(`/scrims/${scrimId}/palpites`, {}, token);
    setPalpites(d.contagem || {});
    setMeuPalpite(d.meu_palpite);
  };

  const confirmarInscricao = async (scrimId: string, inscId: string) => {
    try {
      await api(`/scrims/${scrimId}/inscricoes/${inscId}/confirmar`, { method: 'PATCH' }, token)
      loadInscricoes(scrimId)
    } catch (e: any) { setError(e.message) }
  }

  const doEditScrim = async () => {
    if (!editModal) return
    try {
      await api(`/scrims/${editModal.scrim_id}`, { method: 'PATCH', body: JSON.stringify(editForm) }, token)
      setSuccess('Scrim atualizada!')
      setEditModal(null)
      const s = await api('/scrims', {}, token); setDashScrims(s)
    } catch (e: any) { setError(e.message) }
  }

  const doDeleteScrim = async (scrimId: string, title: string) => {
    if (!confirm(`Excluir a scrim "${title}"? Esta ação não pode ser desfeita.`)) return
    try {
      await api(`/scrims/${scrimId}`, { method: 'DELETE' }, token)
      setSuccess('Scrim excluída.')
      const s = await api('/scrims', {}, token); setDashScrims(s)
    } catch (e: any) { setError(e.message) }
  }

  const doAntecipar = async (scrimId: string) => {
    if (!confirm('Antecipar o encerramento desta scrim? Os slots serão fechados para novas inscrições.')) return
    try {
      const d = await api(`/scrims/${scrimId}/antecipar`, { method: 'POST' }, token)
      setSuccess(`Scrim encerrada antecipadamente! ${d.confirmados} duos confirmados.`)
      const s = await api('/scrims', {}, token); setDashScrims(s)
    } catch (e: any) { setError(e.message) }
  }

  const doAddStaff = async (scrimId: string) => {
    if (!staffEmail.trim()) return
    try {
      await api(`/scrims/${scrimId}/staff`, { method: 'POST', body: JSON.stringify({ email: staffEmail }) }, token)
      setSuccess(`Staff adicionado: ${staffEmail}`)
      setStaffEmail(''); setStaffScrim(null)
    } catch (e: any) { setError(e.message) }
  }

  const doPdf = async (scrim: Scrim) => {
    setDownloadingPdf(scrim.scrim_id)
    try {
      const r = await fetch(`${API}/scrims/${scrim.scrim_id}/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Erro') }
      const blob = await r.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `scrim_${scrim.scrim_id}.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) { setError(e.message) }
    setDownloadingPdf(null)
  }

  const statusBadge = (s: string) => {
    const map: Record<string, [string, string]> = {
      open: ['#00ff6a', 'ABERTA'],
      encerrada: ['#7c3aed', 'ENCERRADA'],
      cancelada: ['#ff4444', 'CANCELADA'],
    }
    const [c, l] = map[s] || ['#888', s.toUpperCase()]
    return <span style={{ background: c + '22', color: c, border: `1px solid ${c}`, borderRadius: 4, padding: '2px 8px', fontSize: '.72rem', fontWeight: 700 }}>{l}</span>
  }

  const tabs = [['scrims', 'MINHAS SCRIMS'], ['criar', 'CRIAR SCRIM'], ['financeiro', 'FINANCEIRO'], ['perfil', 'PERFIL']]
  const tabStyle = (k: string) => ({
    background: 'none', border: 'none', borderBottom: `2px solid ${dashTab === k ? '#7c3aed' : 'transparent'}`,
    color: dashTab === k ? '#fff' : 'rgba(255,255,255,.4)', padding: '10px 0',
    fontFamily: "'Barlow Condensed', sans-serif", fontSize: '.85rem',
    letterSpacing: 2, cursor: 'pointer', marginRight: '2rem', transition: 'all .2s'
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ color: '#fff', margin: 0 }}>Olá, {user.username} 👊</h2>
            <p style={{ color: 'rgba(255,255,255,.4)', margin: '4px 0 0', fontSize: '.85rem' }}>
              {user.apoiador
                ? `✅ Apoiador ativo até ${new Date(user.apoiador_ate).toLocaleDateString('pt-BR')}`
                : '🔒 Plano Free — <a href="#">Seja Apoiador</a>'}
            </p>
          </div>
          <button onClick={logout} style={{ background: 'none', border: '1px solid #333', color: 'rgba(255,255,255,.4)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: '.85rem' }}>
            Sair
          </button>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid #2a2a4a', marginBottom: '2rem' }}>
          {tabs.map(([k, l]) => <button key={k} style={tabStyle(k)} onClick={() => setDashTab(k)}>{l}</button>)}
        </div>

        {error && <div style={{ background: '#ff444422', border: '1px solid #ff4444', borderRadius: 8, padding: '12px 16px', color: '#ff4444', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ background: '#00ff6a22', border: '1px solid #00ff6a', borderRadius: 8, padding: '12px 16px', color: '#00ff6a', marginBottom: '1rem' }}>{success}</div>}

        {/* ── TAB: MINHAS SCRIMS ── */}
        {dashTab === 'scrims' && (
          <div>
            {dashScrims.filter((s: Scrim) => s.organizer_email === user.email || user.role === 'admin').length === 0
              ? <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.3)', padding: '4rem' }}>
                  <div style={{ fontSize: 48, marginBottom: '1rem' }}>✈</div>
                  <p>Nenhuma scrim criada ainda.</p>
                  <button onClick={() => setDashTab('criar')} style={{ marginTop: '1rem', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer' }}>
                    CRIAR PRIMEIRA SCRIM
                  </button>
                </div>
              : dashScrims
                  .filter((s: Scrim) => s.organizer_email === user.email || user.role === 'admin')
                  .map((s: Scrim) => {
                    const isCancelada = s.status === 'cancelada'
                    const isEncerrada = s.status === 'encerrada'
                    const isOpen = s.status === 'open'
                    return (
                      <div key={s.scrim_id} style={{ background: '#1a1a2e', border: `1px solid ${isCancelada ? '#ff444444' : '#2a2a4a'}`, borderRadius: 12, padding: '1.2rem', marginBottom: '1rem' }}>
                        {/* Header da scrim */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {s.arte_url && <img src={s.arte_url} alt="arte" style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }} />}
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <strong style={{ color: '#fff' }}>{s.title}</strong>
                                {statusBadge(s.status)}
                              </div>
                              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.8rem', margin: 0 }}>
                                📅 {new Date(s.date_time).toLocaleString('pt-BR')} · 🌍 {s.region} · 🏆 R${s.prize}
                              </p>
                              <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.75rem', margin: '2px 0 0' }}>ID: {s.scrim_id}</p>
                            </div>
                          </div>
                          {/* Ações */}
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                            {/* PDF sempre disponível */}
                            <button onClick={() => doPdf(s)} disabled={downloadingPdf === s.scrim_id}
                              style={{ background: '#00ff6a22', border: '1px solid #00ff6a', color: '#00ff6a', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: '.78rem', fontWeight: 700 }}>
                              {downloadingPdf === s.scrim_id ? '⏳' : '📄 PDF'}
                            </button>
                            {/* Ver inscrições */}
                            {!isCancelada && (
                              <button onClick={() => activeScrimDetail === s.scrim_id ? setActiveScrimDetail(null) : loadInscricoes(s.scrim_id)}
                                style={{ background: '#7c3aed22', border: '1px solid #7c3aed', color: '#7c3aed', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: '.78rem' }}>
                                👥 Inscrições
                              </button>
                            )}
                            {/* Editar — só se open */}
                            {isOpen && (
                              <button onClick={() => { setEditModal(s); setEditForm({ title: s.title, date_time: s.date_time, region: s.region, prize: s.prize }) }}
                                style={{ background: '#1a1a2e', border: '1px solid #555', color: 'rgba(255,255,255,.7)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: '.78rem' }}>
                                ✏️ Editar
                              </button>
                            )}
                            {/* Antecipar — só open com badge de progresso */}
                            {isOpen && (
                              <button onClick={() => doAntecipar(s.scrim_id)}
                                title="Disponível com ≥35 confirmados"
                                style={{ background: '#fbbf2422', border: '1px solid #fbbf24', color: '#fbbf24', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: '.78rem', fontWeight: 700 }}>
                                ⚡ Antecipar
                              </button>
                            )}
                            {/* Staff — só se open */}
                            {isOpen && (
                              <button onClick={() => setStaffScrim(staffScrim === s.scrim_id ? null : s.scrim_id)}
                                style={{ background: '#1a1a2e', border: '1px solid #555', color: 'rgba(255,255,255,.5)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: '.78rem' }}>
                                🛡️ Staff
                              </button>
                            )}
                            {/* Excluir — só sem pagantes */}
                            {!isEncerrada && (
                              <button onClick={() => doDeleteScrim(s.scrim_id, s.title)}
                                style={{ background: '#ff444422', border: '1px solid #ff4444', color: '#ff4444', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: '.78rem' }}>
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Barra de progresso slots */}
                        {isOpen && (
                          <div style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '.75rem' }}>Slots: {s.inscritos}/50</span>
                              <span style={{ color: s.inscritos >= 35 ? '#00ff6a' : '#fbbf24', fontSize: '.75rem', fontWeight: 700 }}>
                                {s.inscritos >= 35 ? '✅ Pode antecipar!' : `${35 - s.inscritos} para antecipar`}
                              </span>
                            </div>
                            <div style={{ height: 6, background: '#0d0d1a', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', borderRadius: 3, background: s.inscritos >= 35 ? '#00ff6a' : 'linear-gradient(90deg,#7c3aed,#fbbf24)', width: `${(s.inscritos / 50) * 100}%`, transition: 'width .4s' }} />
                            </div>
                            {/* Aviso prazo */}
                            <p style={{ color: 'rgba(255,100,100,.6)', fontSize: '.72rem', margin: '4px 0 0' }}>
                              ⏱️ Prazo máximo: 10 dias a partir da criação. Cancelado automaticamente se não atingir 35 confirmados.
                            </p>
                          </div>
                        )}

                        {/* Painel Staff */}
                        {staffScrim === s.scrim_id && (
                          <div style={{ background: '#12122a', borderRadius: 8, padding: '1rem', marginTop: '1rem', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ color: 'rgba(255,255,255,.5)', fontSize: '.8rem' }}>🛡️ Adicionar Staff (máx. 2):</span>
                            <input value={staffEmail} onChange={e => setStaffEmail(e.target.value)} placeholder="email@exemplo.com"
                              style={{ flex: 1, minWidth: 200, background: '#0d0d1a', border: '1px solid #333', borderRadius: 6, padding: '6px 10px', color: '#fff', fontSize: '.85rem' }} />
                            <button onClick={() => doAddStaff(s.scrim_id)}
                              style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontSize: '.8rem', fontWeight: 700 }}>
                              ADICIONAR
                            </button>
                          </div>
                        )}

                        {/* Painel de inscrições */}
                        {activeScrimDetail === s.scrim_id && (
                          <div style={{ background: '#12122a', border: '1px solid #2a2a4a', borderRadius: 8, padding: '1rem', marginTop: '1rem' }}>
                            <h4 style={{ color: '#fff', margin: '0 0 1rem' }}>Inscrições — {s.title}</h4>
                            {inscricoes.length === 0
                              ? <p style={{ color: 'rgba(255,255,255,.4)' }}>Nenhuma inscrição ainda.</p>
                              : <div style={{ overflowX: 'auto' }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.83rem' }}>
                                    <thead>
                                      <tr style={{ color: 'rgba(255,255,255,.4)', textAlign: 'left' }}>
                                        {['Slot', 'Nick 1', 'Nick 2', 'WhatsApp', 'Status', 'Ação'].map(h => (
                                          <th key={h} style={{ padding: '8px', borderBottom: '1px solid #2a2a4a' }}>{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {inscricoes.map((i) => (
                                        <tr key={i.insc_id} style={{ borderBottom: '1px solid #1a1a2e' }}>
                                          <td style={{ padding: '8px', color: '#7c3aed', fontWeight: 700 }}>#{i.slot}</td>
                                          <td style={{ padding: '8px', color: '#fff' }}>{i.nick1}</td>
                                          <td style={{ padding: '8px', color: '#fff' }}>{i.nick2}</td>
                                          <td style={{ padding: '8px', color: 'rgba(255,255,255,.5)' }}>{i.whatsapp}</td>
                                          <td style={{ padding: '8px' }}>
                                            <span style={{ color: i.status === 'confirmado' ? '#00ff6a' : '#fbbf24', fontWeight: 700 }}>
                                              {i.status === 'confirmado' ? '✅ PIX OK' : '⏳ PENDENTE'}
                                            </span>
                                          </td>
                                          <td style={{ padding: '8px' }}>
                                            {i.status === 'pendente' && (
                                              <button onClick={() => confirmarInscricao(s.scrim_id, i.insc_id)}
                                                style={{ background: '#00ff6a', color: '#000', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: '.75rem', fontWeight: 700 }}>
                                                CONFIRMAR PIX
                                              </button>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                            }
                          </div>
                        )}
                      </div>
                    )
                  })
            }
          </div>
        )}

        {/* ── TAB: CRIAR SCRIM ── */}
        {dashTab === 'criar' && (
          <div style={{ maxWidth: 560 }}>
            {!user.apoiador && user.role !== 'admin' && (
              <div style={{ background: '#7c3aed22', border: '1px solid #7c3aed', borderRadius: 12, padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: '1rem' }}>🔒</div>
                <h3 style={{ color: '#fff', margin: '0 0 .5rem' }}>Recurso exclusivo para Apoiadores</h3>
                <p style={{ color: 'rgba(255,255,255,.5)', margin: '0 0 1.5rem', fontSize: '.9rem' }}>Assine por R$35/mês e crie scrims ilimitadas, gerencie inscrições e receba seu lucro direto no PIX.</p>
                <a href="https://buy.stripe.com/eVqcN493G9Yn1Eh8pucV202" target="_blank" rel="noreferrer"
                  style={{ display: 'inline-block', background: '#7c3aed', color: '#fff', textDecoration: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 700 }}>
                  SER APOIADOR — R$35/MÊS
                </a>
<a href="https://checkout.infinitepay.io/furiadanoite2026/6UpMBhkySi" target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: "transparent", color: "#00ff6a", textDecoration: "none", borderRadius: 8, padding: "10px", fontWeight: 700, marginTop: 8, border: "1px solid #00ff6a", fontSize: ".9rem" }}>Pagar com Pix (InfinitePay)</a>
              </div>
            )}
            {(user.apoiador || user.role === 'admin') && (
              <>
                <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Nova Scrim</h3>
                {/* Arte/Logo da Scrim */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', display: 'block', marginBottom: 8 }}>Arte / Logo da Scrim</label>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {createScrimForm.arte_url
                      ? <img src={createScrimForm.arte_url} alt="arte" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', border: '2px solid #7c3aed' }} />
                      : <div style={{ width: 80, height: 80, borderRadius: 8, background: '#1a1a2e', border: '2px dashed #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#555' }}>🖼</div>
                    }
                    <div>
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => e.target.files?.[0] && uploadArte(e.target.files[0])} />
                      <button onClick={() => fileRef.current?.click()} disabled={uploading}
                        style={{ background: '#1a1a2e', border: '1px solid #7c3aed', color: '#7c3aed', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: '.85rem' }}>
                        {uploading ? 'Enviando...' : '📤 Upload Arte'}
                      </button>
                      <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.75rem', margin: '4px 0 0' }}>PNG, JPG ou WEBP • Max 5MB</p>
                    </div>
                  </div>
                </div>
                {[
                  ['title', 'Nome da Scrim', 'text', 'Ex: Scrim DUO Season 5'],
                  ['date_time', 'Data e Hora', 'datetime-local', ''],
                  ['prize', 'Prêmio Total (R$)', 'number', '200'],
                ].map(([k, label, type, placeholder]) => (
                  <div key={k} style={{ marginBottom: '1rem' }}>
                    <label style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', display: 'block', marginBottom: 4 }}>{label}</label>
                    <input type={type} placeholder={placeholder}
                      value={(createScrimForm as any)[k]}
                      onChange={e => setCreateScrimForm((f: any) => ({ ...f, [k]: e.target.value }))}
                      style={{ width: '100%', background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 8, padding: '10px 12px', color: '#fff', boxSizing: 'border-box' }} />
                  </div>
                ))}
                {/* Região */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', display: 'block', marginBottom: 4 }}>Região</label>
                  <select value={createScrimForm.region} onChange={e => setCreateScrimForm((f: any) => ({ ...f, region: e.target.value }))}
                    style={{ width: '100%', background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 8, padding: '10px 12px', color: '#fff' }}>
                    {['SA', 'NA', 'EU', 'ASIA', 'ME', 'KRJP'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                {/* Calculadora */}
                <div style={{ background: '#12122a', border: '1px solid #2a2a4a', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem' }}>
                  <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.8rem', margin: '0 0 .5rem' }}>📊 Previsão (50 duos × R$15)</p>
                  {(() => {
                    const total = 50 * 15
                    const liquido = total - parseFloat(createScrimForm.prize || '0')
                    const taxa = liquido * 0.35
                    const lucro = liquido - taxa
                    return (
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {[['Total Bruto', `R$${total}`], ['Taxa FdN (35%)', `R$${taxa.toFixed(0)}`], ['Seu Lucro', `R$${lucro.toFixed(0)}`]].map(([l, v]) => (
                          <div key={l} style={{ flex: 1 }}>
                            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.75rem' }}>{l}</div>
                            <div style={{ color: l === 'Seu Lucro' ? '#00ff6a' : '#fff', fontWeight: 700, fontSize: '1.1rem' }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
                <button onClick={doCreateScrim} disabled={loading}
                  style={{ width: '100%', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '14px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}>
                  {loading ? 'Criando...' : 'CRIAR SCRIM ✈'}
                </button>
              </>
            )}
          </div>
        )}

        {/* ── TAB: FINANCEIRO ── */}
        {dashTab === 'financeiro' && (
          <div>
            <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>📊 Painel Financeiro</h3>
            {!dashData
              ? <p style={{ color: 'rgba(255,255,255,.4)' }}>Carregando dados...</p>
              : (
                <>
                  {/* Gráfico de faturamento */}
                  <div style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <h4 style={{ color: '#fff', margin: '0 0 1rem' }}>Faturamento Mensal</h4>
                    <BarChart data={dashData.faturamento_mensal} />
                  </div>
                  {/* Scrims futuras com previsão */}
                  <div style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 12, padding: '1.5rem' }}>
                    <h4 style={{ color: '#fff', margin: '0 0 1rem' }}>🔮 Previsão — Próximas Scrims</h4>
                    {dashData.scrims_futuras.length === 0
                      ? <p style={{ color: 'rgba(255,255,255,.4)' }}>Nenhuma scrim futura cadastrada.</p>
                      : dashData.scrims_futuras.map((s: any) => (
                          <div key={s.scrim_id} style={{ borderBottom: '1px solid #2a2a4a', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <strong style={{ color: '#fff' }}>{s.title}</strong>
                              <span style={{ color: '#00ff6a', fontWeight: 700 }}>R${s.receita_confirmada.toFixed(0)}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                              {[
                                ['✅ Confirmados', s.slots_confirmados, '#00ff6a'],
                                ['⏳ Pendentes', s.slots_pendentes, '#fbbf24'],
                                ['⬜ Vazios', s.slots_vazios, '#555'],
                              ].map(([l, v, c]) => (
                                <div key={String(l)} style={{ flex: 1, background: '#0d0d1a', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                                  <div style={{ color: c as string, fontWeight: 700, fontSize: '1.2rem' }}>{v}</div>
                                  <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.7rem' }}>{l}</div>
                                </div>
                              ))}
                            </div>
                            {/* Barra de progresso */}
                            <div style={{ height: 8, background: '#0d0d1a', borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{
                                height: '100%', borderRadius: 4,
                                background: 'linear-gradient(90deg, #00ff6a, #7c3aed)',
                                width: `${(s.slots_confirmados / 50) * 100}%`,
                                transition: 'width .4s'
                              }} />
                            </div>
                            <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.75rem', margin: '4px 0 0' }}>
                              {((s.slots_confirmados / 50) * 100).toFixed(0)}% confirmado
                            </p>
                          </div>
                        ))
                    }
                  </div>
                </>
              )
            }
          </div>
        )}

        {/* ── TAB: PERFIL ── */}
        {dashTab === 'perfil' && (
          <div style={{ maxWidth: 400 }}>
            <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Meu Perfil</h3>
            {[
              ['Username', user.username], ['Nick PUBG', user.nick_pubg],
              ['E-mail', user.email], ['Role', user.role],
              ['Apoiador', user.apoiador ? `✅ Ativo até ${new Date(user.apoiador_ate).toLocaleDateString('pt-BR')}` : '❌ Não ativo'],
            ].map(([l, v]) => (
              <div key={l} style={{ marginBottom: '1rem', padding: '12px 16px', background: '#1a1a2e', borderRadius: 8 }}>
                <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.75rem', marginBottom: 2 }}>{l}</div>
                <div style={{ color: '#fff' }}>{v}</div>
              </div>
            ))}
            {!user.apoiador && (
              <>
<a href="https://buy.stripe.com/eVqcN493G9Yn1Eh8pucV202" target="_blank" rel="noreferrer"
                style={{ display: 'block', textAlign: 'center', background: '#7c3aed', color: '#fff', textDecoration: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, marginTop: '1rem' }}>
                🚀 SER APOIADOR — R$35/MÊS
              </a>
<a href="https://checkout.infinitepay.io/furiadanoite2026/6UpMBhkySi" target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: "transparent", color: "#00ff6a", textDecoration: "none", borderRadius: 8, padding: "10px", fontWeight: 700, marginTop: 8, border: "1px solid #00ff6a", fontSize: ".9rem" }}>Pagar com Pix (InfinitePay)</a>
</>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL EDITAR SCRIM ── */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#1a1a2e', border: '1px solid #7c3aed', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480 }}>
            <h3 style={{ color: '#fff', margin: '0 0 1.5rem' }}>✏️ Editar Scrim</h3>
            {[
              ['title', 'Nome da Scrim', 'text'],
              ['date_time', 'Data e Hora', 'datetime-local'],
              ['prize', 'Prêmio Total (R$)', 'number'],
            ].map(([k, label, type]) => (
              <div key={k} style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', display: 'block', marginBottom: 4 }}>{label}</label>
                <input type={type} value={editForm[k] || ''}
                  onChange={e => setEditForm((f: any) => ({ ...f, [k]: e.target.value }))}
                  style={{ width: '100%', background: '#0d0d1a', border: '1px solid #2a2a4a', borderRadius: 8, padding: '10px 12px', color: '#fff', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', display: 'block', marginBottom: 4 }}>Região</label>
              <select value={editForm.region || 'SA'} onChange={e => setEditForm((f: any) => ({ ...f, region: e.target.value }))}
                style={{ width: '100%', background: '#0d0d1a', border: '1px solid #2a2a4a', borderRadius: 8, padding: '10px 12px', color: '#fff' }}>
                {['SA', 'NA', 'EU', 'ASIA', 'ME', 'KRJP'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: '1.5rem' }}>
              <button onClick={doEditScrim} style={{ flex: 1, background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', cursor: 'pointer', fontWeight: 700 }}>
                SALVAR
              </button>
              <button onClick={() => setEditModal(null)} style={{ flex: 1, background: 'none', border: '1px solid #333', color: 'rgba(255,255,255,.4)', borderRadius: 8, padding: '12px', cursor: 'pointer' }}>
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Pages fora do App ─────────────────────────────────────────────────────────
function LoginPage({ onLogin, onGoRegister }: { onLogin: (t: string, u: User) => void; onGoRegister: () => void }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false)
  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))
  const submit = async () => {
    setLoading(true); setErr('')
    try { const d = await api('/auth/login', { method: 'POST', body: JSON.stringify(form) }); onLogin(d.token, d.user) }
    catch (e: any) { setErr(e.message) }
    setLoading(false)
  }
  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a2e', border: '1px solid #7c3aed', borderRadius: 16, padding: '2.5rem', width: 380, maxWidth: '95vw' }}>
        <img src="/LOGO.png" alt="FdN" style={{ width: 64, display: 'block', margin: '0 auto 1.5rem' }} />
        <h2 style={{ color: '#fff', textAlign: 'center', margin: '0 0 1.5rem' }}>Entrar</h2>
        {['email', 'password'].map(k => (
          <div key={k} style={{ marginBottom: '1rem' }}>
            <label style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', display: 'block', marginBottom: 4 }}>
              {k === 'email' ? 'E-mail' : 'Senha'}
            </label>
            <input type={k === 'password' ? 'password' : 'email'} value={(form as any)[k]} onChange={set(k)}
              style={{ width: '100%', background: '#0d0d1a', border: '1px solid #333', borderRadius: 8, padding: '10px 12px', color: '#fff', boxSizing: 'border-box' }} />
          </div>
        ))}
        {err && <p style={{ color: '#ff4444', fontSize: '.85rem' }}>{err}</p>}
        <button onClick={submit} disabled={loading}
          style={{ width: '100%', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', cursor: 'pointer', fontWeight: 700, marginTop: 8 }}>
          {loading ? 'Entrando...' : 'ENTRAR'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'rgba(255,255,255,.4)', fontSize: '.85rem' }}>
          Não tem conta?{' '}
          <button onClick={onGoRegister} style={{ background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer', fontSize: '.85rem' }}>Cadastrar</button>
        </p>
      </div>
    </div>
  )
}

function RegisterPage({ onLogin, onGoLogin }: { onLogin: (t: string, u: User) => void; onGoLogin: () => void }) {
  const [form, setForm] = useState({ email: '', password: '', username: '', nick_pubg: '', cpf: '', whatsapp: '', role: 'lider_independente', clan_name: '' })
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false)
  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))
  const submit = async () => {
    setLoading(true); setErr('')
    try { const d = await api('/auth/register', { method: 'POST', body: JSON.stringify(form) }); onLogin(d.token, d.user) }
    catch (e: any) { setErr(e.message) }
    setLoading(false)
  }
  const fields: [string, string, string][] = [
    ['username', 'Username', 'text'], ['nick_pubg', 'Nick PUBG Mobile', 'text'],
    ['email', 'E-mail', 'email'], ['password', 'Senha', 'password'],
    ['cpf', 'CPF', 'text'], ['whatsapp', 'WhatsApp', 'tel'],
  ]
  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
      <div style={{ background: '#1a1a2e', border: '1px solid #7c3aed', borderRadius: 16, padding: '2.5rem', width: 420, maxWidth: '95vw' }}>
        <img src="/LOGO.png" alt="FdN" style={{ width: 64, display: 'block', margin: '0 auto 1.5rem' }} />
        <h2 style={{ color: '#fff', textAlign: 'center', margin: '0 0 1.5rem' }}>Criar Conta</h2>
        {fields.map(([k, label, type]) => (
          <div key={k} style={{ marginBottom: '1rem' }}>
            <label style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', display: 'block', marginBottom: 4 }}>{label}</label>
            <input type={type} value={(form as any)[k]} onChange={set(k)}
              style={{ width: '100%', background: '#0d0d1a', border: '1px solid #333', borderRadius: 8, padding: '10px 12px', color: '#fff', boxSizing: 'border-box' }} />
          </div>
        ))}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', display: 'block', marginBottom: 4 }}>Tipo de Conta</label>
          <select value={form.role} onChange={set('role')}
            style={{ width: '100%', background: '#0d0d1a', border: '1px solid #333', borderRadius: 8, padding: '10px 12px', color: '#fff' }}>
            <option value="lider_independente">Líder Independente</option>
            <option value="lider_cla">Líder de Clã (cria clã)</option>
            <option value="membro">Membro de Clã</option>
          </select>
        </div>
        {(form.role === 'lider_cla' || form.role === 'membro') && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', display: 'block', marginBottom: 4 }}>
              {form.role === 'lider_cla' ? 'Nome do Clã (novo)' : 'Nome do Clã (para entrar)'}
            </label>
            <input value={form.clan_name} onChange={set('clan_name')}
              style={{ width: '100%', background: '#0d0d1a', border: '1px solid #333', borderRadius: 8, padding: '10px 12px', color: '#fff', boxSizing: 'border-box' }} />
          </div>
        )}
        {err && <p style={{ color: '#ff4444', fontSize: '.85rem' }}>{err}</p>}
        <button onClick={submit} disabled={loading}
          style={{ width: '100%', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', cursor: 'pointer', fontWeight: 700, marginTop: 8 }}>
          {loading ? 'Cadastrando...' : 'CRIAR CONTA'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'rgba(255,255,255,.4)', fontSize: '.85rem' }}>
          Já tem conta?{' '}
          <button onClick={onGoLogin} style={{ background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer', fontSize: '.85rem' }}>Entrar</button>
        </p>
      </div>
    </div>
  )
}

// ── Passaporte Gamer ────────────────────────────────────────────────────────
function PassaporteGamer({ user, token }: { user: User; token: string | null }) {
  const [p, setP] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    api(`/passaporte/${user.user_id}`, {}, token || undefined)
      .then(d => { if (active) setP(d) })
      .catch(() => { if (active) setP(null) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [user.user_id])

  const criarPassaporte = async () => {
    setCreating(true); setErr('')
    try {
      const nickname = user.nick_pubg || user.username
      const d = await api(`/passaporte/?usuario_id=${user.user_id}&nickname=${encodeURIComponent(nickname)}`, { method: 'POST' }, token || undefined)
      setP(d)
    } catch (e: any) { setErr(e.message) }
    setCreating(false)
  }

  if (loading) {
    return <div className="section"><p style={{ color: 'rgba(255,255,255,.4)' }}>Carregando Passaporte...</p></div>
  }

  if (!p) {
    return (
      <div className="section" style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Orbitron'", marginBottom: '1rem' }}>🎫 Passaporte Gamer</h2>
        <p style={{ color: 'rgba(255,255,255,.5)', marginBottom: '2rem', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          Você ainda não tem um Passaporte Gamer. Crie o seu e comece a construir seu histórico competitivo na FdN.
        </p>
        {err && <p style={{ color: '#ff4444', marginBottom: '1rem' }}>{err}</p>}
        <button className="btn-primary" onClick={criarPassaporte} disabled={creating}>
          {creating ? 'Criando...' : 'CRIAR MEU PASSAPORTE'}
        </button>
      </div>
    )
  }

  const rep = p.reputacao || {}
  const contas = p.contas_conectadas || []
  const stats = p.estatisticas || []
  const hist = p.historico_competitivo || []
  const conquistas = p.conquistas || []
  const times = p.times || []

  return (
    <div className="section">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <div style={{ width: 80, height: 80, borderRadius: 16, background: 'linear-gradient(135deg,#7c3aed,#3b0764)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Orbitron'", fontWeight: 900, fontSize: '1.8rem', flexShrink: 0 }}>
          {p.nickname?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontFamily: "'Orbitron'", margin: 0 }}>{p.nickname}</h2>
          <p style={{ color: 'var(--gray)', fontSize: '.85rem', letterSpacing: 1, textTransform: 'uppercase' }}>
            Passaporte Gamer · Nível {p.nivel_conta}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--card)', border: '1px solid #2a2a4a', borderRadius: 12, padding: '1.5rem' }}>
          <p style={{ color: 'var(--gray)', fontSize: '.75rem', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '.8rem' }}>Reputação</p>
          <p style={{ fontFamily: "'Orbitron'", fontSize: '2.2rem', fontWeight: 900, color: 'var(--green)', margin: 0 }}>
            {rep.score ?? 100}<span style={{ fontSize: '1rem', color: 'var(--gray)' }}>/100</span>
          </p>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid #2a2a4a', borderRadius: 12, padding: '1.5rem' }}>
          <p style={{ color: 'var(--gray)', fontSize: '.75rem', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '.8rem' }}>Contas conectadas</p>
          {contas.length === 0
            ? <p style={{ color: 'var(--gray)', fontSize: '.85rem' }}>Nenhuma conta conectada ainda</p>
            : contas.map((c: any) => (
              <p key={c.plataforma} style={{ fontSize: '.85rem', marginBottom: 4 }}>
                {c.status === 'verificado' ? '✅' : '⏳'} {c.nome_exibicao}
              </p>
            ))
          }
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid #2a2a4a', borderRadius: 12, padding: '1.5rem' }}>
          <p style={{ color: 'var(--gray)', fontSize: '.75rem', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '.8rem' }}>Times</p>
          {times.length === 0
            ? <p style={{ color: 'var(--gray)', fontSize: '.85rem' }}>Você ainda não faz parte de nenhum time</p>
            : times.map((t: any) => (
              <p key={t.time_id} style={{ fontSize: '.85rem', marginBottom: 4 }}>{t.papel === 'capitao' ? '👑 ' : ''}{t.nome}</p>
            ))
          }
        </div>
      </div>

      {conquistas.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: "'Orbitron'", fontSize: '1.1rem', marginBottom: '1rem' }}>Conquistas</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.7rem' }}>
            {conquistas.map((c: any) => (
              <span key={c.id} style={{ background: 'var(--card)', border: '1px solid #2a2a4a', borderRadius: 20, padding: '8px 16px', fontSize: '.85rem' }}>
                🏅 {c.nome}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: "'Orbitron'", fontSize: '1.1rem', marginBottom: '1rem' }}>Histórico competitivo</h3>
        {hist.length === 0
          ? <p style={{ color: 'var(--gray)', fontSize: '.85rem' }}>Nenhum resultado registrado ainda. Participe de uma Sala pra começar seu histórico!</p>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              {hist.map((h: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card)', border: '1px solid #2a2a4a', borderRadius: 10, padding: '.8rem 1.2rem' }}>
                  <div>
                    <p style={{ fontSize: '.9rem', fontWeight: 700, margin: 0 }}>{h.campeonato_nome}</p>
                    <p style={{ fontSize: '.75rem', color: 'var(--gray)', margin: 0 }}>{h.jogo}</p>
                  </div>
                  <span style={{ fontFamily: "'Orbitron'", fontWeight: 900, color: h.colocacao === 1 ? '#facc15' : 'var(--gray)' }}>
                    {h.colocacao}º
                  </span>
                </div>
              ))}
            </div>
          )
        }
      </div>

      {stats.length > 0 && (
        <div>
          <h3 style={{ fontFamily: "'Orbitron'", fontSize: '1.1rem', marginBottom: '1rem' }}>Estatísticas por jogo</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '1rem' }}>
            {stats.map((s: any) => (
              <div key={s.jogo} style={{ background: 'var(--card)', border: '1px solid #2a2a4a', borderRadius: 12, padding: '1.2rem' }}>
                <p style={{ fontWeight: 700, marginBottom: '.6rem' }}>{s.jogo}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', color: 'var(--gray)' }}>
                  <span>{s.partidas_jogadas} partidas</span>
                  <span>{s.partidas_jogadas ? Math.round((s.vitorias / s.partidas_jogadas) * 100) : 0}% vitórias</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── App Principal ─────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('home')
  const [token, setToken] = useState<string | null>(localStorage.getItem('fdn_token'))
  const [user, setUser] = useState<User | null>(null)
  const [filaCount, setFilaCount] = useState(0)
  const [filaJogos, setFilaJogos] = useState<any[]>([])
  const [filaJogo, setFilaJogo] = useState('pubg_mobile')
  const [filaNick, setFilaNick] = useState('')
  const [filaWhatsapp, setFilaWhatsapp] = useState('')
  const [filaEnviado, setFilaEnviado] = useState(false)

  useEffect(() => {
    fetch(`${API}/jogos`).then(r => r.json()).then(setFilaJogos).catch(() => {})
  }, [])

  useEffect(() => {
    fetch(`${API}/fila/count?jogo=${filaJogo}`).then(r => r.json()).then(d => setFilaCount(d.total || 0)).catch(() => {})
  }, [filaJogo, filaEnviado])

  async function enviarFila(e: any) {
    e.preventDefault()
    if (!filaNick || !filaWhatsapp) return
    await fetch(`${API}/fila`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nick: filaNick, whatsapp: filaWhatsapp, jogo: filaJogo }),
    })
    setFilaEnviado(true)
    setFilaNick('')
    setFilaWhatsapp('')
  }

  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('fdn_lang') as Lang
    if (saved && ['pt','en','es'].includes(saved)) return saved
    const nav = navigator.language || ''
    if (nav.startsWith('es')) return 'es'
    return 'pt'
  })
  const tr = useTranslation(lang)
  const changeLang = (l: Lang) => { setLang(l); localStorage.setItem('fdn_lang', l) }
  const [scrims, setScrims] = useState<Scrim[]>([])
  const [seats, setSeats] = useState<AirSeat[]>([])
  const [selectedPair, setSelectedPair] = useState<[number, number] | null>(null)
  const [activeScrim, setActiveScrim] = useState<Scrim | null>(null)
  const [inscModal, setInscModal] = useState(false)
  const [dashScrims, setDashScrims] = useState<Scrim[]>([])
  const [createScrimForm, setCreateScrimForm] = useState({ title: '', date_time: '', region: 'SA', prize: '200', arte_url: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dashTab, setDashTab] = useState<string>('scrims')
  const pollRef = useRef<ReturnType<typeof setInterval>>()

  // Carrega usuário ao iniciar
  useEffect(() => {
    if (token) {
      api('/auth/me', {}, token).then(u => setUser(u)).catch(() => { setToken(null); localStorage.removeItem('fdn_token') })
      api('/scrims').then(setScrims).then(() => api('/scrims').then(setDashScrims)).catch(() => { })
    } else {
      api('/scrims').then(setScrims).catch(() => { })
    }
  }, [token])

  // Dispara conversao do Google Ads quando o usuario vira Apoiador (uma unica vez por conta)
  useEffect(() => {
    if (user?.apoiador && user?.email) {
      const flagKey = `fdn_conv_ads_${user.email}`
      if (!localStorage.getItem(flagKey)) {
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'conversion', {
            send_to: 'AW-18248737055/8oVYCKe8w8scEJ_C1v1D',
            value: 35.0,
            currency: 'BRL',
            transaction_id: user.email
          })
        }
        localStorage.setItem(flagKey, '1')
      }
    }
  }, [user])

  // Polling de seats quando há scrim ativa — 100 assentos
  useEffect(() => {
    if (activeScrim) {
      const load = () => api(`/scrims/${activeScrim.scrim_id}/assentos`).then(d => {
        const s: AirSeat[] = Array.from({ length: 100 }, (_, i) => {
          const ins = d.inscricoes.find((x: any) => x.slot === i + 1)
          return ins
            ? { seat: i + 1, nick: `${ins.nick1} & ${ins.nick2}`, status: ins.status as SeatStatus }
            : { seat: i + 1, status: 'empty' as SeatStatus }
        })
        setSeats(s)
      })
      load()
      pollRef.current = setInterval(load, 5000)
    } else {
      clearInterval(pollRef.current)
    }
    return () => clearInterval(pollRef.current)
  }, [activeScrim])

  const logout = () => { setToken(null); setUser(null); localStorage.removeItem('fdn_token'); setPage('home') }
  const handleLogin = (t: string, u: User) => { setToken(t); setUser(u); localStorage.setItem('fdn_token', t); setPage('dashboard') }

  // Páginas restritas a Apoiadores
  const RESTRICTED = ['scrims', 'reels', 'dashboard']
  const isApoiador = user?.apoiador || user?.role === 'admin' || user?.email === 'admin@furiadanoite.com.br'

  const navigate = (dest: string) => {
    if (RESTRICTED.includes(dest)) {
      if (!user) { setPage('login'); return }
      if (!isApoiador) { setPage('pendente'); return }
    }
    if (dest === 'passaporte' && !user) { setPage('login'); return }
    setPage(dest)
  }

  const doInscrever = async (form: any) => {
    const d = await api(`/scrims/${activeScrim!.scrim_id}/inscrever`, { method: 'POST', body: JSON.stringify(form) })
    return d
  }

  const confirmed = seats.filter(s => s.status === 'confirmed').length
  const arrecadado = confirmed * (activeScrim?.price_per_duo || 15)

  // CSS Global
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Barlow+Condensed:wght@400;600;700&family=Exo+2:wght@400;600&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    :root{--purple:#7c3aed;--green:#00ff6a;--bg:#0d0d1a;--card:#1a1a2e;--gray:rgba(255,255,255,.4);--white:#fff}
    body{background:var(--bg);color:var(--white);font-family:'Exo 2',sans-serif}
    .nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(13,13,26,.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(124,58,237,.2);display:flex;align-items:center;padding:0 1.2rem;height:64px;gap:1rem}
    .nav-logo{height:36px;cursor:pointer;flex-shrink:0}
    .nav-links{display:flex;gap:0;margin-left:auto}
    .nav-link{background:none;border:none;color:var(--gray);padding:6px 10px;font-family:'Barlow Condensed',sans-serif;font-size:.82rem;letter-spacing:1.5px;cursor:pointer;transition:color .2s;text-transform:uppercase;white-space:nowrap}
    .nav-link:hover,.nav-link.active{color:var(--white)}
    .nav-cta{display:none}
    .nav-login{margin-left:.5rem;background:var(--purple);border:none;color:#fff;border-radius:8px;padding:7px 14px;font-family:'Barlow Condensed',sans-serif;font-size:.82rem;letter-spacing:1.5px;cursor:pointer;font-weight:700;white-space:nowrap;flex-shrink:0}
    .lang-toggle{display:flex;gap:2px;margin-left:.4rem;background:rgba(255,255,255,.05);border-radius:8px;padding:3px;flex-shrink:0}
    .lang-btn{background:none;border:none;color:rgba(255,255,255,.4);border-radius:6px;padding:4px 6px;font-family:'Barlow Condensed',sans-serif;font-size:.72rem;cursor:pointer;transition:all .15s;white-space:nowrap}
    .lang-btn.active{background:var(--purple);color:#fff}
    .lang-btn:hover:not(.active){color:#fff;background:rgba(124,58,237,.3)}
    .page{padding-top:64px}
    .hero{min-height:92vh;display:flex;align-items:center;justify-content:center;text-align:center;position:relative;overflow:hidden}
    .hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%, rgba(124,58,237,.3) 0%, transparent 70%)}
    .hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(124,58,237,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.05) 1px,transparent 1px);background-size:40px 40px}
    .hero-content{position:relative;z-index:1;max-width:700px;padding:2rem}
    .hero-logo{width:140px;margin-bottom:2rem;filter:drop-shadow(0 0 30px rgba(124,58,237,.6));animation:pulse 3s ease-in-out infinite}
    @keyframes pulse{0%,100%{filter:drop-shadow(0 0 20px rgba(124,58,237,.5))}50%{filter:drop-shadow(0 0 50px rgba(124,58,237,.9))}}
    .hero-title{font-family:'Orbitron',sans-serif;font-size:clamp(3rem,8vw,5.5rem);font-weight:900;line-height:1;margin-bottom:1.5rem;background:linear-gradient(135deg,#fff 0%,#7c3aed 50%,#00ff6a 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .hero-sub{color:rgba(255,255,255,.6);font-size:1.1rem;line-height:1.7;margin-bottom:2.5rem}
    .hero-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-bottom:3rem}
    .btn-primary{background:var(--purple);color:#fff;border:none;border-radius:10px;padding:14px 32px;font-family:'Barlow Condensed',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;font-weight:700;transition:all .2s}
    .btn-primary:hover{background:#6d28d9;transform:translateY(-2px)}
    .btn-outline{background:none;color:#fff;border:1px solid rgba(255,255,255,.3);border-radius:10px;padding:14px 32px;font-family:'Barlow Condensed',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;transition:all .2s}
    .btn-outline:hover{border-color:#fff}
    .hero-stats{display:flex;gap:3rem;justify-content:center;flex-wrap:wrap}
    .hero-stat-num{font-family:'Orbitron',sans-serif;font-size:2rem;font-weight:900;color:var(--purple)}
    .hero-stat-label{color:var(--gray);font-size:.8rem;letter-spacing:1px}
    .section{padding:4rem 2rem;max-width:1200px;margin:0 auto}
    .banner{background:linear-gradient(135deg,#12122a,#1a1a3e);border-top:1px solid rgba(124,58,237,.2);border-bottom:1px solid rgba(124,58,237,.2);padding:4rem 2rem;text-align:center}
    .banner-tag{color:var(--purple);font-family:'Barlow Condensed',sans-serif;letter-spacing:4px;font-size:.85rem;margin-bottom:1rem}
    .banner-title{font-family:'Orbitron',sans-serif;font-size:clamp(1.5rem,4vw,2.5rem);font-weight:900;margin-bottom:1rem}
    .banner-title em{color:var(--green);font-style:normal}
    .scrim-list{display:flex;flex-direction:column;gap:1rem}
    .apoiador-card{background:#1a1a2e;border:1px solid #2a2a4a;border-radius:12px;padding:2rem;text-align:center}
    .apoiador-price{font-family:'Orbitron',sans-serif;font-size:2.5rem;font-weight:900;color:var(--purple);margin:1rem 0}
    .plane-section{background:#12122a;border-radius:16px;padding:2rem;margin-bottom:2rem}
  `

  // Nav links — paywall: Scrims visível para todos, mas restrito no acesso
  const navLinks: [string, string, boolean][] = [
    ['home', tr('nav_home'), false],
    ['scrims', tr('nav_scrims'), true],
    ['passaporte', 'Passaporte', false],
    ['apoiadores', tr('nav_supporters'), false],
    ['reels', tr('nav_reels'), true],
    ['loja', tr('nav_shop'), false],
  ]

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <img src="/LOGO.png" alt="FdN" className="nav-logo" onClick={() => setPage('home')} />
        <div className="nav-links">
          {navLinks.map(([k, l, restricted]) => {
            const locked = restricted && !isApoiador
            return (
              <button key={k}
                className={`nav-link${page === k ? ' active' : ''}`}
                onClick={() => navigate(k)}
                style={{ opacity: locked ? 0.45 : 1 }}
                title={locked ? 'Exclusivo para Apoiadores' : ''}>
                {locked ? '🔒 ' : ''}{l}
              </button>
            )
          })}
        </div>
        <button className="nav-cta" onClick={() => setPage('apoiadores')}>{tr('nav_cta')}</button>
        {user
          ? <button className="nav-login" onClick={() => navigate('dashboard')}>{tr('nav_panel')}</button>
          : <button className="nav-login" onClick={() => setPage('login')}>{tr('nav_login')}</button>
        }
        <div className="lang-toggle">
          {LANGS.map(l => (
            <button key={l.code} className={`lang-btn${lang === l.code ? ' active' : ''}`} onClick={() => changeLang(l.code)}>
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="page">
        {/* LOGIN */}
        {page === 'login' && <LoginPage onLogin={handleLogin} onGoRegister={() => setPage('register')} />}
        {page === 'register' && <RegisterPage onLogin={handleLogin} onGoLogin={() => setPage('login')} />}

        {/* CADASTRO PENDENTE */}
        {page === 'pendente' && (
          <div style={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ maxWidth: 480, textAlign: 'center' }}>
              <div style={{ fontSize: 72, marginBottom: '1.5rem' }}>🔒</div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#fff', marginBottom: '1rem', fontSize: '1.8rem' }}>
                ACESSO RESTRITO
              </h2>
              <p style={{ color: 'rgba(255,255,255,.6)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '1rem' }}>
                {user
                  ? `Olá, ${user.username}! Seu cadastro está pendente de ativação.`
                  : 'Você precisa estar cadastrado para acessar essa área.'}
                <br />
                Para desbloquear a plataforma completa, assine o plano <strong style={{ color: '#7c3aed' }}>Apoiador FdN</strong> por apenas <strong style={{ color: '#00ff6a' }}>R$35/mês</strong>.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <a href="https://buy.stripe.com/eVqcN493G9Yn1Eh8pucV202"
                  target="_blank" rel="noreferrer"
                  style={{ display: 'block', width: '100%', maxWidth: 360, background: '#7c3aed', color: '#fff', textDecoration: 'none', borderRadius: 10, padding: '14px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', letterSpacing: 2, fontWeight: 700, textAlign: 'center' }}>
                  🚀 ASSINAR AGORA — R$35/MÊS
                </a>
<a href="https://checkout.infinitepay.io/furiadanoite2026/6UpMBhkySi" target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: "transparent", color: "#00ff6a", textDecoration: "none", borderRadius: 8, padding: "10px", fontWeight: 700, marginTop: 8, border: "1px solid #00ff6a", fontSize: ".9rem" }}>Pagar com Pix (InfinitePay)</a>
                <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.8rem' }}>
                  Após o pagamento, seu acesso é liberado automaticamente.
                </p>
                <button onClick={() => setPage('home')}
                  style={{ background: 'none', border: '1px solid #333', color: 'rgba(255,255,255,.4)', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: '.85rem' }}>
                  Voltar para o início
                </button>
                {user && (
                  <button onClick={logout}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.2)', cursor: 'pointer', fontSize: '.75rem', marginTop: '-8px' }}>
                    Sair da conta
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {page === 'dashboard' && user && isApoiador && (
          <Dashboard
            user={user} token={token} logout={logout}
            dashTab={dashTab} setDashTab={setDashTab}
            dashScrims={dashScrims} setDashScrims={setDashScrims}
            createScrimForm={createScrimForm} setCreateScrimForm={setCreateScrimForm}
            success={success} setSuccess={setSuccess}
            error={error} setError={setError}
            loading={loading} setLoading={setLoading}
          />
        )}

        {/* PASSAPORTE GAMER */}
        {page === 'passaporte' && user && (
          <PassaporteGamer user={user} token={token} />
        )}

        {/* HOME */}
        {page === 'home' && (
          <>
            <section className="hero">
              <div className="hero-bg" />
              <div className="hero-grid" />
              <div className="hero-content">
                <img src="/LOGO.png" alt="Furia da Noite" className="hero-logo" />
                <p style={{ color: 'var(--purple)', fontFamily: "'Barlow Condensed'", letterSpacing: 4, fontSize: '.9rem', marginBottom: '1rem' }}>
                  {tr('hero_tag')}
                </p>
                <h1 className="hero-title">FURIA<br />DA <span>NOITE</span></h1>
                <p className="hero-sub">{tr('hero_sub')}</p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={() => navigate('scrims')}>{tr('hero_cta_scrims')}</button>
                  <button className="btn-outline" onClick={() => setPage('apoiadores')}>{tr('hero_cta_create')}</button>
                </div>
                <div className="hero-stats">
                  {[['50+', tr('hero_stat_scrims')], ['R$200', tr('hero_stat_prize')], ['50', tr('hero_stat_duos')], ['R$15', tr('hero_stat_entry')]].map(([n, l]) => (
                    <div key={l} className="hero-stat">
                      <div className="hero-stat-num">{n}</div>
                      <div className="hero-stat-label">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <div style={{ background: '#0f0f1a', border: '1px solid #7c3aed44', borderRadius: 16, padding: '2rem', margin: '3rem auto', maxWidth: 700, textAlign: 'center' }}>
  <h3 style={{ color: '#fff', margin: '0 0 .5rem', fontFamily: "'Orbitron', sans-serif" }}>
    ⚡ {filaCount} jogador{filaCount === 1 ? '' : 'es'} esperando sala agora
  </h3>
  <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.85rem', marginBottom: '1.5rem' }}>
    Nao tem grupo pra jogar? Entre na fila e seja chamado por um organizador em tempo real.
  </p>
  {filaEnviado ? (
    <p style={{ color: '#00ff6a', fontWeight: 700 }}>✅ Voce entrou na fila! Fique de olho no WhatsApp.</p>
  ) : (
    <form onSubmit={enviarFila} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 560 }}>
        {filaJogos.map((j: any) => (
          <button key={j.id} type="button" onClick={() => setFilaJogo(j.id)}
            style={{ background: filaJogo === j.id ? '#8b5cf6' : '#1a1a2e', color: '#fff', border: filaJogo === j.id ? '1px solid #8b5cf6' : '1px solid #333', borderRadius: 20, padding: j.id === 'pubg_mobile' ? '12px 22px' : '8px 14px', fontWeight: j.id === 'pubg_mobile' ? 700 : 400, fontSize: j.id === 'pubg_mobile' ? 15 : 12, cursor: 'pointer' }}>
            {j.nome}
          </button>
        ))}
      </div>
      <input value={filaNick} onChange={e => setFilaNick(e.target.value)} placeholder="Seu nick"
        style={{ background: '#1a1a2e', color: '#fff', border: '1px solid #333', borderRadius: 8, padding: '10px 12px', width: 140 }} />
      <input value={filaWhatsapp} onChange={e => setFilaWhatsapp(e.target.value)} placeholder="WhatsApp"
        style={{ background: '#1a1a2e', color: '#fff', border: '1px solid #333', borderRadius: 8, padding: '10px 12px', width: 140 }} />
      <button type="submit"
        style={{ background: '#00ff6a', color: '#000', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>
        QUERO JOGAR AGORA
      </button>
    </form>
  )}
</div>
<div className="banner">
              <p className="banner-tag">{tr('banner_tag')}</p>
              <h2 className="banner-title">{tr('banner_title')}<em>{tr('banner_title_em')}</em></h2>
              <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: '2rem', lineHeight: 1.7 }}>
                {tr('banner_desc')}
              </p>
              <a href="https://buy.stripe.com/eVqcN493G9Yn1Eh8pucV202" target="_blank" rel="noreferrer"
                style={{ display: 'inline-block', background: '#7c3aed', color: '#fff', textDecoration: 'none', borderRadius: 10, padding: '14px 36px', fontFamily: "'Barlow Condensed'", fontSize: '1rem', letterSpacing: 2, fontWeight: 700 }}>
                {tr('banner_cta')}
              </a>
<a href="https://checkout.infinitepay.io/furiadanoite2026/6UpMBhkySi" target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: "transparent", color: "#00ff6a", textDecoration: "none", borderRadius: 8, padding: "10px", fontWeight: 700, marginTop: 8, border: "1px solid #00ff6a", fontSize: ".9rem" }}>Pagar com Pix (InfinitePay)</a>
            </div>
          </>
        )}

        {/* SCRIMS */}
        {page === 'scrims' && (
          <div className="section">
            <h2 style={{ fontFamily: "'Orbitron'", marginBottom: '2rem' }}>✈ SCRIMS</h2>
            {activeScrim ? (
              <div>
                <button onClick={() => setActiveScrim(null)} style={{ background: 'none', border: '1px solid #333', color: 'rgba(255,255,255,.6)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '.85rem' }}>
                  ← Voltar para lista
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      {activeScrim.arte_url && <img src={activeScrim.arte_url} alt="arte" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} />}
                      <div>
                        <h3 style={{ color: '#fff', fontFamily: "'Orbitron'", margin: 0 }}>{activeScrim.title}</h3>
                        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem', margin: '4px 0 0' }}>
                          📅 {new Date(activeScrim.date_time).toLocaleString('pt-BR')} · 🌍 {activeScrim.region}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                      {[['🏆 Prêmio', `R$${activeScrim.prize}`], ['💰 Inscrição', 'R$15/duo'], ['👥 Slots', `${activeScrim.inscritos}/50`], ['💵 Confirmado', `R$${arrecadado}`]].map(([l, v]) => (
                        <div key={l} style={{ background: '#1a1a2e', borderRadius: 8, padding: '12px 16px', flex: 1, minWidth: 120 }}>
                          <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.75rem' }}>{l}</div>
                          <div style={{ color: '#fff', fontWeight: 700 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="plane-section">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ color: '#fff', margin: 0 }}>✈ Avião — 100 assentos / 50 DUOs</h4>
                        <span style={{ color: 'rgba(255,255,255,.3)', fontSize: '.75rem' }}>
                          {seats.filter(s => s.status === 'confirmado').length}/100 confirmados
                        </span>
                      </div>
                      {selectedPair && (
                        <div style={{ background: 'rgba(124,58,237,.15)', border: '1px solid #7c3aed', borderRadius: 8, padding: '10px 14px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#fff', fontSize: '.85rem' }}>
                            ✅ Par selecionado: <strong style={{ color: '#7c3aed' }}>Assento {selectedPair[0]} & {selectedPair[1]}</strong>
                          </span>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => setInscModal(true)} className="btn-primary" style={{ padding: '6px 16px', fontSize: '.82rem' }}>
                              CONFIRMAR INSCRIÇÃO
                            </button>
                            <button onClick={() => setSelectedPair(null)} style={{ background: 'none', border: '1px solid #333', color: 'rgba(255,255,255,.4)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: '.8rem' }}>
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                      <AirplaneMap
                        seats={seats}
                        onSelectPair={(a, b) => { setSelectedPair([a, b]); setInscModal(true) }}
                      />
                    </div>
                  </div>
                  {/* Info lateral */}
                  <div style={{ background: '#1a1a2e', borderRadius: 12, padding: '1.5rem' }}>
                    <h4 style={{ color: '#fff', margin: '0 0 1rem' }}>Como funciona</h4>
                    {['Clique em "Inscrever meu DUO"', 'Preencha os nicks e contato', 'Receba confirmação por WhatsApp', 'Apareça no avião e jogue!'].map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                        <span style={{ background: '#7c3aed', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                        <span style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', lineHeight: 1.5 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="scrim-list">
                {scrims.length === 0
                  ? <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.3)', padding: '4rem' }}>
                      <div style={{ fontSize: 48, marginBottom: '1rem' }}>✈</div>
                      <p>Nenhuma scrim disponível no momento.</p>
                    </div>
                  : scrims.map(s => <ScrimCard key={s.scrim_id} s={s} onSelect={() => setActiveScrim(s)} />)
                }
              </div>
            )}
          </div>
        )}

        {/* APOIADORES */}
        {page === 'apoiadores' && (
          <div className="section">
            <h2 style={{ fontFamily: "'Orbitron'", textAlign: 'center', marginBottom: '3rem' }}>{tr('ap_title')}</h2>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <div className="apoiador-card">
                <p style={{ color: 'var(--purple)', fontFamily: "'Barlow Condensed'", letterSpacing: 3, marginBottom: '.5rem' }}>{tr('ap_tag')}</p>
                <div className="apoiador-price">{tr('ap_price')}<span style={{ fontSize: '1rem', color: 'rgba(255,255,255,.4)' }}>{tr('ap_per')}</span></div>
                <ul style={{ listStyle: 'none', textAlign: 'left', margin: '1.5rem 0', lineHeight: 2 }}>
                  {['✅ Crie scrims ilimitadas', '✅ Cobranças automáticas via PIX', '✅ Dashboard financeiro completo', '✅ Gráficos de previsão e faturamento', '✅ Controle de slots e confirmações', '✅ Arte personalizada por scrim', '✅ Suporte prioritário'].map(i => (
                    <li key={i} style={{ color: 'rgba(255,255,255,.7)', fontSize: '.9rem' }}>{i}</li>
                  ))}
                </ul>
                <a href="https://buy.stripe.com/eVqcN493G9Yn1Eh8pucV202" target="_blank" rel="noreferrer"
                  style={{ display: 'block', textAlign: 'center', background: '#7c3aed', color: '#fff', textDecoration: 'none', borderRadius: 10, padding: '14px', fontFamily: "'Barlow Condensed'", fontSize: '1.1rem', letterSpacing: 2, fontWeight: 700 }}>
                  {tr('ap_cta')} — R$35/MÊS
                </a>
<a href="https://checkout.infinitepay.io/furiadanoite2026/6UpMBhkySi" target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: "transparent", color: "#00ff6a", textDecoration: "none", borderRadius: 8, padding: "10px", fontWeight: 700, marginTop: 8, border: "1px solid #00ff6a", fontSize: ".9rem" }}>Pagar com Pix (InfinitePay)</a>
                <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.75rem', marginTop: '1rem' }}>{tr('ap_pay')}</p>
              </div>
            </div>
          </div>
        )}

        {/* REELS */}
        {page === 'reels' && (
          <div className="section">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontFamily: "'Orbitron'", marginBottom: '1rem' }}>{tr('reels_title')}</h2>
              <p style={{ color: 'rgba(255,255,255,.5)', marginBottom: '1.5rem' }}>{tr('reels_sub')}</p>
              <a href="https://www.instagram.com/duo.furiadanoite/" target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', color: '#fff', textDecoration: 'none', borderRadius: 10, padding: '12px 28px', fontFamily: "'Barlow Condensed'", fontSize: '1rem', letterSpacing: 2, fontWeight: 700 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                {tr('reels_follow')}
              </a>
            </div>
            {/* GALERIA */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[
                { src: '/reels/reels_01_dragon_ball.jpg', label: tr('reels_scrim_art'), desc: 'Edição Especial Dragon Ball Super · 18/08' },
                { src: '/reels/reels_02_scrim_post.jpg', label: tr('reels_scrim_art'), desc: 'Scrim DUO · R$380 em premiação' },
                { src: '/reels/reels_03_gameplay1.jpg', label: tr('reels_gameplay'), desc: 'Participante LaplataB...' },
                { src: '/reels/reels_04_gameplay2.jpg', label: tr('reels_evidence'), desc: 'MIB·MORENA & CREMOSOsz999' },
                { src: '/reels/reels_05_gameplay3.jpg', label: tr('reels_evidence'), desc: 'eT·AZEITONA & eT·POTEITO' },
              ].map((img, i) => (
                <a key={i} href="https://www.instagram.com/duo.furiadanoite/" target="_blank" rel="noreferrer"
                  style={{ display: 'block', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(124,58,237,.2)', position: 'relative', aspectRatio: '1', cursor: 'pointer', textDecoration: 'none' }}>
                  <img src={img.src} alt={img.desc} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .3s' }}
                    onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 50%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem' }}>
                    <span style={{ color: 'var(--purple)', fontFamily: "'Barlow Condensed'", fontSize: '.75rem', letterSpacing: 2, textTransform: 'uppercase' }}>{img.label}</span>
                    <span style={{ color: '#fff', fontSize: '.85rem', marginTop: 2 }}>{img.desc}</span>
                    <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '.72rem', marginTop: 4 }}>@duo.furiadanoite</span>
                  </div>
                </a>
              ))}
              {/* Card "ver mais" */}
              <a href="https://www.instagram.com/duo.furiadanoite/" target="_blank" rel="noreferrer"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 12, border: '2px dashed rgba(124,58,237,.3)', aspectRatio: '1', gap: '1rem', textDecoration: 'none', color: 'rgba(255,255,255,.4)', transition: 'border-color .2s' }}
                onMouseOver={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = '#7c3aed')}
                onMouseOut={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(124,58,237,.3)')}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="rgba(124,58,237,.6)"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span style={{ fontFamily: "'Barlow Condensed'", letterSpacing: 2, fontSize: '.9rem' }}>@duo.furiadanoite</span>
              </a>
            </div>
          </div>
        )}

        {/* LOJA */}
        {page === 'loja' && (
          <div className="section">
            <h2 style={{ fontFamily: "'Orbitron'", marginBottom: '2rem' }}>{tr('shop_title')}</h2>
            <p style={{ color: 'rgba(255,255,255,.4)' }}>{tr('shop_soon')}</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#0a0a14', borderTop: '1px solid rgba(124,58,237,.15)', padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
        <img src="/LOGO.png" alt="FdN" style={{ height: 40, marginBottom: '1rem', opacity: .7 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <span style={{ color: 'rgba(255,255,255,.3)', fontSize: '.8rem' }}>{tr('footer_follow')}:</span>
          <a href="https://www.instagram.com/duo.furiadanoite/" target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontSize: '.85rem', fontFamily: "'Barlow Condensed'", letterSpacing: 1, transition: 'color .2s' }}
            onMouseOver={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#fff')}
            onMouseOut={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,.6)')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            @duo.furiadanoite
          </a>
        </div>
        <p style={{ color: 'rgba(255,255,255,.15)', fontSize: '.75rem' }}>© 2024 Fúria da Noite · {tr('footer_rights')}</p>
      </footer>

      {/* MODAL DE INSCRIÇÃO */}
      {inscModal && activeScrim && (
        <InscModal scrim={activeScrim} onClose={() => { setInscModal(false); setSelectedPair(null) }} onInscrever={doInscrever} selectedPair={selectedPair} />
      )}
    </>
  )
}
