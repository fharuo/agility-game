import { useState, useEffect, useRef, useCallback } from 'react';

const GAME_DURATION = 30; // seconds

const BUTTONS = [
  { id: 0, label: 'Meios de\nPagamento',                  colorClass: 'circle-purple', col: 2, row: 1 },
  { id: 1, label: 'Dados',                                 colorClass: 'circle-lime',   col: 1, row: 2 },
  { id: 2, label: 'Conectividade',                         colorClass: 'circle-cyan',   col: 3, row: 2 },
  { id: 3, label: 'Registro\nde Ativos',                   colorClass: 'circle-purple', col: 2, row: 3 },
  { id: 4, label: 'Antifraude',                            colorClass: 'circle-cyan',   col: 1, row: 4 },
  { id: 5, label: 'Inteligência\nde Dados',                colorClass: 'circle-lime',   col: 3, row: 4 },
  { id: 6, label: 'Infraestrutura\np/ Transações Digitais', colorClass: 'circle-purple', col: 2, row: 5 },
];

function pickNext(current) {
  const others = BUTTONS.filter(b => b.id !== current);
  return others[Math.floor(Math.random() * others.length)].id;
}

export default function GameScreen({ onFinish }) {
  const [timeLeft, setTimeLeft]       = useState(GAME_DURATION);
  const [activeId, setActiveId]       = useState(() => Math.floor(Math.random() * BUTTONS.length));
  const [totalMs, setTotalMs]         = useState(0);
  const [hits, setHits]               = useState(0);
  const [started, setStarted]         = useState(false);
  const [countdown, setCountdown]     = useState(3);

  const litAtRef   = useRef(null);
  const gameOver   = useRef(false);
  const totalMsRef = useRef(0);
  const hitsRef    = useRef(0);

  // Countdown before game starts
  useEffect(() => {
    if (countdown <= 0) {
      setStarted(true);
      litAtRef.current = performance.now();
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Main game timer
  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          gameOver.current = true;
          // Delay to show 00 before navigating
          setTimeout(() => onFinish(totalMsRef.current, hitsRef.current), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, onFinish]);

  const handleCircleClick = useCallback((id) => {
    if (!started || gameOver.current || id !== activeId) return;

    const now      = performance.now();
    const reaction = litAtRef.current ? now - litAtRef.current : 0;

    totalMsRef.current += reaction;
    hitsRef.current    += 1;
    setTotalMs(totalMsRef.current);
    setHits(hitsRef.current);

    const next = pickNext(id);
    setActiveId(next);
    litAtRef.current = performance.now();
  }, [started, activeId]);

  const timerDisplay = String(timeLeft).padStart(2, '0');

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'clamp(24px,5%,48px) clamp(16px,5%,40px)',
      gap: 'clamp(12px,3%,24px)',
    }}>

      {/* Title */}
      <h1
        className="glitch"
        style={{
          fontSize: 'clamp(2rem, 9vw, 4.5rem)',
          lineHeight: 1,
          textAlign: 'center',
          letterSpacing: '0.04em',
          zIndex: 1,
        }}
      >
        AGILIZE<br />SUA CARREIRA
      </h1>

      {/* Timer */}
      <div style={{ zIndex:1 }}>
        <div className="timer-box">{timerDisplay}</div>
      </div>

      {/* Countdown overlay */}
      {!started && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(30,30,30,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          flexDirection: 'column',
          gap: '16px',
        }}>
          <span
            className="glitch"
            style={{ fontSize:'clamp(5rem,22vw,10rem)', lineHeight:1 }}
          >
            {countdown > 0 ? countdown : 'GO!'}
          </span>
          <span style={{ color:'rgba(255,255,255,0.5)', fontStyle:'italic', fontSize:'clamp(0.8rem,3vw,1rem)' }}>
            Toque no círculo que acender!
          </span>
        </div>
      )}

      {/* Circle grid */}
      <CircleGrid
        activeId={activeId}
        started={started}
        onCircleClick={handleCircleClick}
      />

      {/* Tap hint */}
      {started && (
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'clamp(0.65rem,2.5vw,0.85rem)', fontStyle:'italic', textAlign:'center', zIndex:1 }}>
          Toque no círculo que acender o mais rápido possível!
        </p>
      )}
    </div>
  );
}

/* Renders the 7 circles in a 3-column CSS grid layout matching the mockup */
function CircleGrid({ activeId, started, onCircleClick }) {
  /*
    Grid rows 1-5, cols 1-3:
    row1: col2 = Meios de Pagamento
    row2: col1 = Dados, col3 = Conectividade
    row3: col2 = Registro de Ativos
    row4: col1 = Antifraude, col3 = Inteligência de Dados
    row5: col2 = Infraestrutura p/ Transações Digitais
  */
  return (
    <div style={{
      flex: 1,
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: 'repeat(5, 1fr)',
      alignItems: 'center',
      justifyItems: 'center',
      zIndex: 1,
      minHeight: 0,
    }}>
      {BUTTONS.map(btn => (
        <CircleButton
          key={btn.id}
          btn={btn}
          isActive={started && activeId === btn.id}
          onClick={() => onCircleClick(btn.id)}
        />
      ))}
    </div>
  );
}

function CircleButton({ btn, isActive, onClick }) {
  return (
    <div
      style={{
        gridColumn: btn.col,
        gridRow: btn.row,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        width: '100%',
      }}
    >
      <button
        className={`circle-btn ${btn.colorClass} ${isActive ? 'active' : 'inactive'}`}
        style={{ width: 'clamp(52px,14vw,80px)', height: 'clamp(52px,14vw,80px)' }}
        onClick={onClick}
        aria-label={btn.label}
      />
      <span style={{
        fontSize: 'clamp(0.55rem,2vw,0.75rem)',
        color: 'rgba(255,255,255,0.75)',
        textAlign: 'center',
        lineHeight: 1.2,
        whiteSpace: 'pre-line',
        maxWidth: '90px',
      }}>
        {btn.label}
      </span>
    </div>
  );
}
