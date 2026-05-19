import { useState, useRef } from 'react';
import CornerDecos from './CornerDecos';
import { exportCSV } from '../utils/leads';
import nucleaLogo from '../assets/logo-nuclea.png';

const LOGO_CLICKS_REQUIRED = 5;
const ADMIN_PASSWORD = 'admin123';

export default function StartScreen({ onStart }) {
  const [logoClicks, setLogoClicks]       = useState(0);
  const [showAdmin, setShowAdmin]         = useState(false);
  const [adminStep, setAdminStep]         = useState('password');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const clickTimerRef = useRef(null);

  function handleLogoClick() {
    const next = logoClicks + 1;
    setLogoClicks(next);
    clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => setLogoClicks(0), 2000);
    if (next >= LOGO_CLICKS_REQUIRED) {
      setLogoClicks(0);
      setAdminStep('password');
      setPasswordInput('');
      setPasswordError(false);
      setShowAdmin(true);
    }
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAdminStep('panel');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  }

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '8cqw 7cqw',
    }}>
      <CornerDecos />

      {/* Logo — 5 clicks triggers admin */}
      <div
        style={{ zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center', cursor: 'default', userSelect: 'none', marginTop: '6cqw' }}
        onClick={handleLogoClick}
      >
        <img src={nucleaLogo} alt="Núclea" style={{ width: '52cqw', height: 'auto' }} />
      </div>

      {/* Main title */}
      <div style={{ zIndex: 1, textAlign: 'center' }}>
        <h1 className="glitch" style={{ fontSize: '13cqw', lineHeight: 1, letterSpacing: '0.04em' }}>
          JOGO DA<br />AGILIDADE
        </h1>
      </div>

      {/* START button */}
      <div style={{ zIndex: 1, width: '100%' }}>
        <button className="btn-layered" onClick={onStart}>
          <div className="btn-layered-inner">START</div>
        </button>
      </div>

      {/* Admin overlay */}
      {showAdmin && (
        <div className="admin-overlay">
          <button className="admin-close" onClick={() => setShowAdmin(false)}>✕</button>

          {adminStep === 'password' ? (
            <>
              <p className="admin-title">ACESSO RESTRITO</p>
              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '4cqw', width: '100%' }}>
                <div className="field-group">
                  <label className="field-label">Senha:</label>
                  <input
                    className="field-input"
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    autoFocus
                    onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
                  />
                  {passwordError && (
                    <span style={{ color: '#ff5555', fontSize: '2.5cqw', fontStyle: 'italic' }}>Senha incorreta</span>
                  )}
                </div>
                <button type="submit" className="btn-submit">Entrar</button>
              </form>
            </>
          ) : (
            <>
              <p className="admin-title">PAINEL ADMIN</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '2.8cqw', textAlign: 'center' }}>
                Exporte todos os leads coletados em CSV
              </p>
              <button className="btn-submit" onClick={exportCSV}>
                ↓ Exportar CSV
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
