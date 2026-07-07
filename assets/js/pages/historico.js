import { FinanceService } from '../services/financeService.js';
import { PowerAutomateService } from '../services/powerAutomateService.js';
import { storage } from '../storage.js';
import { currency } from '../utils.js';

export async function renderHistorico(el) {
  const financeService = new FinanceService(storage);
  const powerAutomateService = new PowerAutomateService();
  const lancamentos = powerAutomateService.isConfigured()
    ? await powerAutomateService.listLancamentos()
    : financeService.getLancamentos().slice().reverse();

  el.innerHTML = `
    <section class="layout-grid">
      <div class="card list-card">
        <h2>Histórico de lançamentos</h2>
        <p class="muted">${powerAutomateService.isConfigured() ? 'Dados carregados via Power Automate' : 'Dados carregados localmente'}</p>
        <ul class="recent-list">
          ${lancamentos.length > 0 ? lancamentos.map((item) => `
            <li class="recent-item">
              <div class="r-left">
                <div class="r-desc">${item.descricao || '-'}</div>
                <div class="r-meta">${item.categoria || 'Sem categoria'} • ${item.data || ''}</div>
              </div>
              <div class="r-right">
                <div class="r-value">${currency(Number(item.valor || 0))}</div>
                <div class="r-type">${item.tipo || ''}</div>
              </div>
            </li>
          `).join('') : '<li class="recent-item"><div class="r-left"><div class="r-desc">Nenhum lançamento registrado.</div></div></li>'}
        </ul>
      </div>
    </section>
  `;
}
