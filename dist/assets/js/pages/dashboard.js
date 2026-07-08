import { SupabaseService } from '../services/supabaseService.js';
import { currency } from '../utils.js';

export async function renderDashboard(el) {
  const supabaseService = new SupabaseService();
  let resumo = { receitas: 0, despesas: 0, saldo: 0, total: 0 };
  
  try {
    resumo = await supabaseService.getResumo();
  } catch (error) {
    console.error('Erro ao carregar resumo:', error);
  }

  el.innerHTML = `
    <section class="layout-grid">
      <div class="card summary-card">
        <h2>Dashboard</h2>
        <p class="muted">Resumo em tempo real</p>
        <div class="summary-values">
          <div>
            <strong>Saldo</strong>
            <div class="value">${currency(resumo.saldo || 0)}</div>
          </div>
          <div>
            <strong>Receitas</strong>
            <div class="value">${currency(resumo.receitas || 0)}</div>
          </div>
          <div>
            <strong>Despesas</strong>
            <div class="value">${currency(resumo.despesas || 0)}</div>
          </div>
        </div>
      </div>
      <div class="card list-card">
        <h2>Visão geral</h2>
        <div class="dashboard-grid">
          <div class="dashboard-metric">
            <span class="metric-label" style="font-size: 0.55rem;">Total de lançamentos</span>
            <strong>${resumo.total || 0}</strong>
          </div>
          <div class="dashboard-metric">
            <span class="metric-label">Receita líquida</span>
            <strong>${currency((resumo.receitas || 0) - (resumo.despesas || 0))}</strong>
          </div>
          <div class="dashboard-metric">
            <span class="metric-label">Status</span>
            <strong>${resumo.saldo >= 0 ? 'Positivo' : 'Negativo'}</strong>
          </div>
        </div>
      </div>
    </section>
  `;
}
