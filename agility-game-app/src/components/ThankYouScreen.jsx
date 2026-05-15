import CornerDecos from './CornerDecos';

export default function ThankYouScreen({ onRestart }) {
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
      textAlign: 'center',
    }}>
      <CornerDecos />

      {/* Logo */}
      <div style={{ zIndex:1 }}>
        <span className="nuclea-logo">NÚCLEA</span>
      </div>

      {/* Main message */}
      <div style={{ zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'clamp(20px,5%,40px)' }}>
        <h1
          className="glitch"
          style={{
            fontSize: 'clamp(2.4rem,11vw,5rem)',
            lineHeight: 1.05,
            letterSpacing: '0.04em',
          }}
        >
          OBRIGADO<br />POR SUA<br />PARTICIPAÇÃO
        </h1>

        <p style={{
          fontFamily: "'ABCFavoritMono', monospace",
          fontWeight: 400,
          fontStyle: 'italic',
          fontSize: 'clamp(0.85rem,3.5vw,1.15rem)',
          lineHeight: 1.65,
          color: 'rgba(255,255,255,0.85)',
          maxWidth: '320px',
        }}>
          Fique de olho no ranking que ao final do dia os{' '}
          <strong style={{ color:'var(--lime)' }}>3 primeiros</strong>{' '}
          serão premiados
        </p>
      </div>

      {/* Restart */}
      <div style={{ zIndex:1, width:'100%', maxWidth:'280px' }}>
        <button className="btn-submit" onClick={onRestart}>
          Jogar novamente
        </button>
      </div>
    </div>
  );
}
