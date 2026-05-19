import CornerDecos from './CornerDecos';
import nucleaLogo from '../assets/logo-nuclea.png';

export default function ThankYouScreen({ onRestart }) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '8cqw 8cqw',
      textAlign: 'center',
    }}>
      <CornerDecos />

      <div style={{ zIndex: 1 }}>
        <img src={nucleaLogo} alt="Núclea" style={{ width: '32cqw', height: 'auto', display: 'block', margin: '0 auto' }} />
      </div>

      <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6cqw' }}>
        <h1 className="glitch" style={{ fontSize: '11cqw', lineHeight: 1.05, letterSpacing: '0.04em' }}>
          OBRIGADO<br />POR SUA<br />PARTICIPAÇÃO
        </h1>

        <p style={{
          fontFamily: "'ABCFavoritMono', monospace",
          fontWeight: 400, fontStyle: 'italic',
          fontSize: '3cqw', lineHeight: 1.65,
          color: 'rgba(255,255,255,0.85)',
          maxWidth: '75cqw',
        }}>
          Fique de olho no ranking que ao final do dia os{' '}
          <strong style={{ color: 'var(--lime)' }}>3 primeiros</strong>{' '}
          serão premiados
        </p>
      </div>

      <div style={{ zIndex: 1, width: '100%' }}>
        <button className="btn-submit" onClick={onRestart}>
          Jogar novamente
        </button>
      </div>
    </div>
  );
}
