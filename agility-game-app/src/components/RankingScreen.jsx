import { useEffect, useState } from 'react';
import CornerDecos from './CornerDecos';
import { getTopRanking } from '../utils/leads';
import nucleaLogo from '../assets/logo-nuclea.png';

function formatScore(ms) {
  if (!ms && ms !== 0) return '—';
  return (ms / 1000).toFixed(2) + 's';
}

const MEDALS = ['🥇', '🥈', '🥉'];
const PLACE_LABELS = ['1° lugar', '2° lugar', '3° lugar'];

export default function RankingScreen({ currentName, onContinue }) {
  const [top, setTop] = useState([]);

  useEffect(() => {
    setTop(getTopRanking(3));
  }, []);

  function placeLabel(idx) {
    return PLACE_LABELS[idx] ?? `${idx + 1}° lugar`;
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'clamp(40px,8%,80px) clamp(28px,8%,64px)',
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

      {/* Top 3 list */}
      <div style={{ zIndex:1, width:'100%', display:'flex', flexDirection:'column', gap:'clamp(14px,4%,28px)' }}>
        {[0, 1, 2].map(idx => {
          const entry = top[idx];
          const isCurrentUser = entry && entry.nome === currentName;
          return (
            <div
              key={idx}
              className="ranking-box"
              style={{
                borderColor: idx === 0 ? 'var(--lime)' : idx === 1 ? 'var(--cyan)' : 'var(--purple)',
                boxShadow: idx === 0
                  ? '3px 3px 0 var(--lime), 5px 5px 0 var(--purple)'
                  : idx === 1
                  ? '3px 3px 0 var(--cyan), 5px 5px 0 var(--purple)'
                  : '3px 3px 0 var(--purple), 5px 5px 0 var(--lime)',
                background: isCurrentUser ? 'rgba(198,241,53,0.08)' : 'transparent',
              }}
            >
              {entry ? (
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'12px' }}>
                  <span style={{ color:'rgba(255,255,255,0.55)', fontSize:'clamp(0.75rem,3vw,1rem)' }}>
                    {placeLabel(idx)}
                  </span>
                  <span style={{ flex:1, textAlign:'center', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {entry.nome}
                    {isCurrentUser && <span style={{ color:'var(--lime)', marginLeft:'6px' }}>← você</span>}
                  </span>
                  <span style={{ color:'var(--lime)', fontStyle:'normal' }}>
                    {formatScore(entry.score)}
                  </span>
                </div>
              ) : (
                <span style={{ color:'rgba(255,255,255,0.3)' }}>{placeLabel(idx)}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Logo + continue */}
      <div style={{ zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'24px', width:'100%' }}>
        <img src={nucleaLogo} alt="Núclea" style={{ width:'clamp(120px,35%,200px)', height:'auto', display:'block', margin:'0 auto' }} />
        <button className="btn-submit" onClick={onContinue} style={{ maxWidth:'280px' }}>
          Continuar
        </button>
      </div>
    </div>
  );
}
