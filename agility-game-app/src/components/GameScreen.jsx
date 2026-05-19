import { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_ROUNDS  = 10;
const BETWEEN_DELAY = 700;

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

export default function GameScreen({ onFinish }) {
  const [countdown, setCountdown] = useState(3);
  const [phase, setPhase]         = useState('countdown');
  const [activeId, setActiveId]   = useState(null);
  const [round, setRound]         = useState(0);
  const [totalMs, setTotalMs]     = useState(0);

  const litAtRef   = useRef(null);
  const totalMsRef = useRef(0);
  const activeRef  = useRef(null);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) {
      const t = setTimeout(() => lightNext(null), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  function lightNext(excludeId) {
    const next = pickNext(excludeId);
    activeRef.current = next;
    setActiveId(next);
    setPhase('lit');
    litAtRef.current = performance.now();
  }

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
      setTimeout(() => onFinish(Math.round(totalMsRef.current)), 800);
      return;
    }

    setPhase('waiting');
    setTimeout(() => lightNext(id), BETWEEN_DELAY);
  }, [phase, round, onFinish]);

  const totalDisplay = round > 0 ? (totalMs / 1000).toFixed(2) + 's' : '—';

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      padding: '5cqw 6cqw',
      gap: '3cqw',
    }}>

      <h1 className="glitch" style={{ fontSize: '9cqw', lineHeight: 1, textAlign: 'center', letterSpacing: '0.04em', zIndex: 1 }}>
        AGILIZE<br />SUA CARREIRA
      </h1>

      {/* Progress counter */}
      <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '3cqw' }}>
        <div className="timer-box">{round}/{TOTAL_ROUNDS}</div>
        {round > 0 && (
          <span style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '2.5cqw' }}>
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
          zIndex: 50, flexDirection: 'column', gap: '3cqw',
        }}>
          <span className="glitch" style={{ fontSize: '28cqw', lineHeight: 1 }}>
            {countdown > 0 ? countdown : 'GO!'}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '3cqw' }}>
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
          zIndex: 50, flexDirection: 'column', gap: '3cqw',
        }}>
          <span className="glitch" style={{ fontSize: '14cqw', lineHeight: 1, textAlign: 'center' }}>
            CONCLUÍDO!
          </span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', fontSize: '3.5cqw' }}>
            Total: {totalDisplay}
          </span>
        </div>
      )}

      {/* Circle grid */}
      <div style={{
        flex: 1, width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: 'repeat(5, 1fr)',
        alignItems: 'center', justifyItems: 'center',
        zIndex: 1, minHeight: 0,
      }}>
        {BUTTONS.map(btn => (
          <div
            key={btn.id}
            style={{
              gridColumn: btn.col, gridRow: btn.row,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '1.5cqw', width: '100%',
            }}
          >
            <button
              className={`circle-btn ${btn.colorClass} ${phase === 'lit' && activeId === btn.id ? 'active' : 'inactive'}`}
              onClick={() => handleCircleClick(btn.id)}
              aria-label={btn.label}
            />
            <span style={{
              fontSize: '1.8cqw',
              color: 'rgba(255,255,255,0.75)',
              textAlign: 'center', lineHeight: 1.2,
              whiteSpace: 'pre-line',
            }}>
              {btn.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
