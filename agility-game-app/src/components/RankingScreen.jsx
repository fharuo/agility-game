import { useEffect, useState } from 'react';
import CornerDecos from './CornerDecos';
import { getTopRanking, getPlayerRank } from '../utils/leads';
import nucleaLogo from '../assets/logo-nuclea.png';

function formatScore(ms) {
  if (!ms && ms !== 0) return '—';
  return (ms / 1000).toFixed(2) + 's';
}

function ordinal(n) {
  return `${n}°`;
}

const PLACE_LABELS = ['1° lugar', '2° lugar', '3° lugar'];
const BORDER_COLORS = ['var(--lime)', 'var(--cyan)', 'var(--purple)'];
const BOX_SHADOWS = [
  '3px 3px 0 var(--lime), 5px 5px 0 var(--purple)',
  '3px 3px 0 var(--cyan), 5px 5px 0 var(--purple)',
  '3px 3px 0 var(--purple), 5px 5px 0 var(--lime)',
];

export default function RankingScreen({ currentName, currentScore, onContinue }) {
  const [top, setTop]           = useState([]);
  const [playerRank, setPlayerRank] = useState(null);

  useEffect(() => {
    setTop(getTopRanking(3));
    if (currentName && currentScore != null) {
      setPlayerRank(getPlayerRank(currentName, currentScore));
    }
  }, [currentName, currentScore]);

  const playerInTop3 = playerRank != null && playerRank <= 3;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'clamp(32px,7%,64px) clamp(28px,8%,64px)',
    }}>
      <CornerDecos />

      {/* Title */}
      <h1
        className="glitch"
        style={{
          fontSize: 'clamp(2.5rem, min(10vw, 6dvh), 5rem)',
          lineHeight: 1,
          letterSpacing: '0.04em',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        RANKING
      </h1>

      {/* Player's own result — always visible */}
      {currentName && currentScore != null && (
        <div style={{
          zIndex: 1,
          width: '100%',
          background: 'rgba(198,241,53,0.08)',
          border: '2px solid var(--lime)',
          borderRadius: '14px',
          padding: 'clamp(14px,4%,24px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 0 18px rgba(198,241,53,0.15)',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(0.7rem,2.5vw,0.85rem)', fontStyle: 'italic' }}>
            seu resultado
          </span>
          <span
            className="glitch"
            style={{ fontSize: 'clamp(2rem, min(9vw, 5dvh), 3.5rem)', lineHeight: 1 }}
          >
            {ordinal(playerRank ?? '?')} lugar
          </span>
          <span style={{ color: 'var(--lime)', fontWeight: 700, fontSize: 'clamp(1rem,4vw,1.4rem)', fontStyle: 'italic' }}>
            {formatScore(currentScore)}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.7rem,2.5vw,0.85rem)', fontStyle: 'italic' }}>
            {currentName}
          </span>
        </div>
      )}

      {/* Top 3 list */}
      <div style={{ zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 'clamp(10px,3%,18px)' }}>
        {[0, 1, 2].map(idx => {
          const entry = top[idx];
          const isCurrentUser = entry && entry.nome === currentName && entry.score === currentScore;
          return (
            <div
              key={idx}
              className="ranking-box"
              style={{
                borderColor: BORDER_COLORS[idx],
                boxShadow: BOX_SHADOWS[idx],
                background: isCurrentUser ? 'rgba(198,241,53,0.08)' : 'transparent',
                padding: 'clamp(12px,3%,18px) clamp(16px,4%,24px)',
              }}
            >
              {entry ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(0.7rem,2.5vw,0.9rem)', flexShrink: 0 }}>
                    {PLACE_LABELS[idx]}
                  </span>
                  <span style={{ flex: 1, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'clamp(0.8rem,3vw,1rem)' }}>
                    {entry.nome}
                    {isCurrentUser && <span style={{ color: 'var(--lime)', marginLeft: '6px' }}>← você</span>}
                  </span>
                  <span style={{ color: 'var(--lime)', fontStyle: 'normal', flexShrink: 0, fontSize: 'clamp(0.8rem,3vw,1rem)' }}>
                    {formatScore(entry.score)}
                  </span>
                </div>
              ) : (
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>{PLACE_LABELS[idx]}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Logo + continue */}
      <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
        <img src={nucleaLogo} alt="Núclea" style={{ width: 'clamp(100px,30%,160px)', height: 'auto', display: 'block', margin: '0 auto' }} />
        <button className="btn-submit" onClick={onContinue} style={{ maxWidth: '280px' }}>
          Continuar
        </button>
      </div>
    </div>
  );
}
