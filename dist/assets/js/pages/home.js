import { SupabaseService } from '../services/supabaseService.js';
import { currency } from '../utils.js';

export async function renderHome(el) {
  const supabaseService = new SupabaseService();
  let resumo = { receitas: 0, despesas: 0, saldo: 0, total: 0 };
  let lancamentos = [];

  try {
    resumo = await supabaseService.getResumo();
    lancamentos = await supabaseService.listLancamentos(8);
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }

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
      <p class="muted">Sincronizado via Supabase</p>
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