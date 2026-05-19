import { useState } from 'react';
import CornerDecos from './CornerDecos';
import nucleaLogo from '../assets/logo-nuclea.png';

export default function LeadScreen({ onSubmit }) {
  const [nome, setNome]         = useState('');
  const [email, setEmail]       = useState('');
  const [telefone, setTelefone] = useState('');
  const [conhecia, setConhecia] = useState(null);

  const canSubmit = nome.trim() && email.trim() && telefone.trim() && conhecia !== null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ nome: nome.trim(), email: email.trim(), telefone: telefone.trim(), conhecia });
  }

  function formatPhone(val) {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2)  return digits;
    if (digits.length <= 7)  return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  }

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      padding: '7cqw 7cqw',
      gap: '5cqw',
    }}>
      <CornerDecos />

      <div style={{ zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <img src={nucleaLogo} alt="Núclea" style={{ width: '32cqw', height: 'auto' }} />
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '4.5cqw', width: '100%', flex: 1, justifyContent: 'center' }}
      >
        <div className="field-group">
          <label className="field-label">Nome Completo:</label>
          <input className="field-input" type="text" value={nome} autoComplete="name" onChange={e => setNome(e.target.value)} />
        </div>

        <div className="field-group">
          <label className="field-label">Email:</label>
          <input className="field-input" type="email" value={email} autoComplete="email" onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="field-group">
          <label className="field-label">Telefone Celular:</label>
          <input
            className="field-input"
            type="tel"
            value={telefone}
            autoComplete="tel"
            inputMode="numeric"
            onChange={e => setTelefone(formatPhone(e.target.value))}
          />
        </div>

        <div className="field-group" style={{ gap: '2.5cqw' }}>
          <label className="field-label">Você já conhecia a Núclea?</label>
          <div className="yesno-group">
            <button type="button" className={`btn-yesno${conhecia === true  ? ' selected' : ''}`} onClick={() => setConhecia(true)}>SIM</button>
            <button type="button" className={`btn-yesno${conhecia === false ? ' selected' : ''}`} onClick={() => setConhecia(false)}>NÃO</button>
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={!canSubmit} style={{ marginTop: '2cqw' }}>
          JOGAR
        </button>
      </form>
    </div>
  );
}
