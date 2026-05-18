import { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_ROUNDS   = 10;
const BETWEEN_DELAY  = 700; // ms pause between one press and the next light-up

const BUTTONS = [
  { id: 0, label: 'Meios de\nPagamento',                   colorClass: 'circle-purple', col: 2, row: 1 },
  { id: 1, label: 'Dados',                                  colorClass: 'circle-lime',   col: 1, row: 2 },
  { id: 2, label: 'Conectividade',                          colorClass: 'circle-cyan',   col: 3, row: 2 },
  { id: 3, label: 'Registro\nde Ativos',                    colorClass: 'circle-purple', col: 2, row: 3 },
  { id: 4, label: 'Antifraude',                             colorClass: 'circle-cyan',   col: 1, row: 4 },
  { id: 5, label: 'Inteligência\nde Dados',                 colorClass: 'circle-lime',   col: 3, row: 4 },
  { id: 6, label: 'Infraestrutura\np/ Transações Digitais', colorClass: 'circle-purple', col: 2, row: 5 },
];

function pickNext(excludeId) {
  const others = BUTTONS.filter(b => b.id !== excludeId);
  return others[Math.floor(Math.random() * others.length)].id;
}

// phase: 'countdown' | 'waiting' | 'lit' | 'done'
export default function GameScreen({ onFinish }) {
  const [countdown, setCountdown] = useState(3);
  const [phase, setPhase]         = useState('countdown');
  const [activeId, setActiveId]   = useState(null);
  const [round, setRound]         = useState(0);       // 0–9 completed rounds
  const [totalMs, setTotalMs]     = useState(0);

  const litAtRef   = useRef(null);
  const totalMsRef = useRef(0);
  const activeRef  = useRef(null); // mirrors activeId for use inside timeouts

  // ── Countdown 3-2-1-GO ──────────────────────────────────────
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) {
      // Brief "GO!" display, then start first round
      const t = setTimeout(() => lightNext(null), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // ── Light a new random button ────────────────────────────────
  function lightNext(excludeId) {
    const next = pickNext(excludeId);
    activeRef.current = next;
    setActiveId(next);
    setPhase('lit');
    litAtRef.current = performance.now();
  }

  // ── Player taps a circle ─────────────────────────────────────
  const handleCircleClick = useCallback((id) => {
    if (phase !== 'lit' || id !== activeRef.current) return;

    const reaction = performance.now() - litAtRef.current;
    totalMsRef.current += reaction;
    setTotalMs(totalMsRef.current);

    const nextRound = round + 1;
    setRound(nextRound);
    setActiveId(null);
    activeRef.current = null;

    if (nextRound >= TOTAL_ROUNDS) {
      setPhase('done');
      // Short pause so player sees the last tap, then finish
      setTimeout(() => onFinish(Math.round(totalMsRef.current)), 800);
      return;
    }

    // Pause before lighting next button
    setPhase('waiting');
    setTimeout(() => lightNext(id), BETWEEN_DELAY);
  }, [phase, round, onFinish]);

  const totalDisplay = round > 0
    ? (totalMs / 1000).toFixed(2) + 's'
    : '—';

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'clamp(24px,5%,48px) clamp(16px,5%,40px)',
      gap: 'clamp(10px,2.5%,20px)',
    }}>

      {/* Title */}
      <h1
        className="glitch"
        style={{
          fontSize: 'clamp(1.4rem, min(6vw, 3.5dvh), 2.5rem)',
          lineHeight: 1,
          textAlign: 'center',
          letterSpacing: '0.04em',
          zIndex: 1,
        }}
      >
        AGILIZE<br />SUA CARREIRA
      </h1>

      {/* Progress + avg */}
      <div style={{ zIndex:1, display:'flex', alignItems:'center', gap:'16px' }}>
        <div className="timer-box" style={{ minWidth:'unset', padding:'8px 20px', fontSize:'clamp(1rem,4vw,1.4rem)' }}>
          {round}/{TOTAL_ROUNDS}
        </div>
        {round > 0 && (
          <span style={{ color:'rgba(255,255,255,0.5)', fontStyle:'italic', fontSize:'clamp(0.7rem,2.5vw,0.9rem)' }}>
            total {totalDisplay}
          </span>
        )}
      </div>

      {/* Countdown overlay */}
      {phase === 'countdown' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(30,30,30,0.88)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, flexDirection: 'column', gap: '16px',
        }}>
          <span className="glitch" style={{ fontSize:'clamp(5rem,22vw,10rem)', lineHeight:1 }}>
            {countdown > 0 ? countdown : 'GO!'}
          </span>
          <span style={{ color:'rgba(255,255,255,0.5)', fontStyle:'italic', fontSize:'clamp(0.8rem,3vw,1rem)' }}>
            Toque no círculo que acender!
          </span>
        </div>
      )}

      {/* Done overlay */}
      {phase === 'done' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(30,30,30,0.88)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, flexDirection: 'column', gap: '12px',
        }}>
          <span className="glitch" style={{ fontSize:'clamp(2rem,10vw,4rem)', lineHeight:1, textAlign:'center' }}>
            CONCLUÍDO!
          </span>
          <span style={{ color:'rgba(255,255,255,0.6)', fontStyle:'italic' }}>
            Total: {totalDisplay}
          </span>
        </div>
      )}

      {/* Circle grid */}
      <CircleGrid
        activeId={activeId}
        interactive={phase === 'lit'}
        onCircleClick={handleCircleClick}
      />
    </div>
  );
}

function CircleGrid({ activeId, interactive, onCircleClick }) {
  return (
    <div style={{
      flex: 1, width: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: 'repeat(5, 1fr)',
      alignItems: 'center', justifyItems: 'center',
      zIndex: 1, minHeight: 0,
    }}>
      {BUTTONS.map(btn => (
        <CircleButton
          key={btn.id}
          btn={btn}
          isActive={interactive && activeId === btn.id}
          onClick={() => onCircleClick(btn.id)}
        />
      ))}
    </div>
  );
}

function CircleButton({ btn, isActive, onClick }) {
  return (
    <div style={{
      gridColumn: btn.col, gridRow: btn.row,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '6px', width: '100%',
    }}>
      <button
        className={`circle-btn ${btn.colorClass} ${isActive ? 'active' : 'inactive'}`}
        style={{ width: 'clamp(52px,14vw,80px)', height: 'clamp(52px,14vw,80px)' }}
        onClick={onClick}
        aria-label={btn.label}
      />
      <span style={{
        fontSize: 'clamp(0.55rem,2vw,0.75rem)',
        color: 'rgba(255,255,255,0.75)',
        textAlign: 'center', lineHeight: 1.2,
        whiteSpace: 'pre-line', maxWidth: '90px',
      }}>
        {btn.label}
      </span>
    </div>
  );
}
