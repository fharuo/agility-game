const KEY = 'nuclea_leads';

export function getLeads() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveLead(lead) {
  const leads = getLeads();
  leads.push({ ...lead, date: new Date().toLocaleDateString('pt-BR') });
  localStorage.setItem(KEY, JSON.stringify(leads));
}

export function getTopRanking(n = 10) {
  return getLeads()
    .filter(l => l.score != null)
    .sort((a, b) => a.score - b.score)
    .slice(0, n);
}

// Returns 1-based position of a player in the full sorted ranking
export function getPlayerRank(nome, score) {
  const sorted = getLeads()
    .filter(l => l.score != null)
    .sort((a, b) => a.score - b.score);
  const idx = sorted.findIndex(l => l.nome === nome && l.score === score);
  return idx === -1 ? null : idx + 1;
}

export function exportCSV() {
  const leads = getLeads();
  if (!leads.length) return;

  const headers = ['Nome', 'Email', 'Telefone', 'Conhecia a Nuclea', 'Score total (ms)', 'Data'];
  const rows = leads.map(l => [
    l.nome   ?? '',
    l.email  ?? '',
    l.telefone ?? '',
    l.conhecia ? 'Sim' : 'Não',
    l.score  ?? '',
    l.date   ?? '',
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `nuclea_leads_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
