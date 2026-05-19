import { useEffect, useState } from 'react';
import CornerDecos from './CornerDecos';
import { getTopRanking, getPlayerRank } from '../utils/leads';
import nucleaLogo from '../assets/logo-nuclea.png';

function formatScore(ms) {
  if (!ms && ms !== 0) return '—';
  return (ms / 1000).toFixed(2) + 's';
}

const PLACE_LABELS  = ['1° lugar', '2° lugar', '3° lugar'];
const BORDER_COLORS = ['var(--lime)', 'var(--cyan)', 'var(--purple)'];
const BOX_SHADOWS   = [
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

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '7cqw 8cqw',
    }}>
      <CornerDecos />

      <h1 className="glitch" style={{ fontSize: '13cqw', lineHeight: 1, letterSpacing: '0.04em', textAlign: 'center', zIndex: 1 }}>
        RANKING
      </h1>

      {/* Player's own result */}
      {currentName && currentScore != null && (
        <div style={{
          zIndex: 1, width: '100%',
          background: 'rgba(198,241,53,0.08)',
          border: '2px solid var(--lime)',
          borderRadius: '3cqw',
          padding: '4cqw 5cqw',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '1.5cqw',
          boxShadow: '0 0 20px rgba(198,241,53,0.15)',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '2.5cqw', fontStyle: 'italic' }}>
            seu resultado
          </span>
          <span className="glitch" style={{ fontSize: '10cqw', lineHeight: 1 }}>
            {playerRank ?? '?'}° lugar
          </span>
          <span style={{ color: 'var(--lime)', fontWeight: 700, fontSize: '5cqw', fontStyle: 'italic' }}>
            {formatScore(currentScore)}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '2.5cqw', fontStyle: 'italic' }}>
            {currentName}
          </span>
        </div>
      )}

      {/* Top 3 */}
      <div style={{ zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '2.5cqw' }}>
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
              }}
            >
              {entry ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2cqw' }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '2.5cqw', flexShrink: 0 }}>
                    {PLACE_LABELS[idx]}
                  </span>
                  <span style={{ flex: 1, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '2.8cqw' }}>
                    {entry.nome}
                    {isCurrentUser && <span style={{ color: 'var(--lime)', marginLeft: '1.5cqw' }}>← você</span>}
                  </span>
                  <span style={{ color: 'var(--lime)', fontStyle: 'normal', flexShrink: 0, fontSize: '2.8cqw' }}>
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
      <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3cqw', width: '100%' }}>
        <img src={nucleaLogo} alt="Núclea" style={{ width: '28cqw', height: 'auto', display: 'block', margin: '0 auto' }} />
        <button className="btn-submit" onClick={onContinue}>Continuar</button>
      </div>
    </div>
  );
}
