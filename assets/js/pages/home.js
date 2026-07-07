import { FinanceService } from '../services/financeService.js';
import { PowerAutomateService } from '../services/powerAutomateService.js';
import { storage } from '../storage.js';
import { currency } from '../utils.js';

export async function renderHome(el) {
  const financeService = new FinanceService(storage);
  const powerAutomateService = new PowerAutomateService();

  el.innerHTML = homeTemplate();

  const resumo = powerAutomateService.isConfigured()
    ? await powerAutomateService.getResumo()
    : financeService.getResumo();

  const lancamentos = powerAutomateService.isConfigured()
    ? await powerAutomateService.listLancamentos()
    : financeService.getLancamentos().slice().reverse();

  const resumoEl = el.querySelector('#resumo');
  const ultimosEl = el.querySelector('#ultimos');

  if (resumoEl) {
    resumoEl.innerHTML = `
      <h2>Resumo</h2>
      <div class="summary-values">
        <div><strong>Saldo</strong><div class="value">${currency(resumo.saldo || 0)}</div></div>
        <div><strong>Receitas</strong><div class="value">${currency(resumo.receitas || 0)}</div></div>
        <div><strong>Despesas</strong><div class="value">${currency(resumo.despesas || 0)}</div></div>
      </div>
      <p class="muted">${powerAutomateService.isConfigured() ? 'Sincronizado via Power Automate' : 'Modo local (offline)'}</p>
    `;
  }

  if (ultimosEl) {
    ultimosEl.innerHTML = `
      <h2>Últimos lançamentos</h2>
      <ul class="recent-list">
        ${(lancamentos || []).slice(0, 8).map((item) => `<li class="recent-item"><div class="r-left"><div class="r-desc">${item.descricao || '-'}</div><div class="r-meta">${item.categoria || ''} • ${item.data || ''}</div></div><div class="r-right"><div class="r-value">${currency(Number(item.valor || 0))}</div><div class="r-type">${item.tipo || ''}</div></div></li>`).join('')}
      </ul>
    `;
  }
}

function homeTemplate() {
  return `
    <section class="layout-grid">
      <div id="resumo" class="card summary-card">
        <h2>Resumo</h2>
        <p>Carregando resumo...</p>
      </div>
      <div id="ultimos" class="card list-card">
        <h2>Últimos lançamentos</h2>
        <p>Carregando lançamentos...</p>
      </div>
    </section>
  `;
}