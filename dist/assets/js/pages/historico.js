import { SupabaseService } from '../services/supabaseService.js';
import { currency } from '../utils.js';

export async function renderHistorico(el) {
  const supabaseService = new SupabaseService();
  let lancamentos = [];

  try {
    lancamentos = await supabaseService.listLancamentos();
  } catch (error) {
    console.error('Erro ao carregar lançamentos:', error);
  }

  el.innerHTML = `
    <section class="layout-grid">
      <div class="card list-card">
        <h2>Histórico de lançamentos</h2>
        <p class="muted">Dados sincronizados via Supabase</p>
        <ul class="recent-list">
          ${lancamentos.length > 0 ? lancamentos.map((item) => {
            const categoriaLabel = item.categoria_id 
              ? `Cat. ${item.categoria_id}` 
              : 'Sem categoria';
            return `
            <li class="recent-item">
              <div class="r-left">
                <div class="r-desc">${item.observacao || '-'}</div>
                <div class="r-meta">${categoriaLabel} • ${item.data || ''}</div>
              </div>
              <div class="r-right">
                <div class="r-value">${currency(Number(item.valor || 0))}</div>
                <div class="r-type">${item.tipo || ''}</div>
              </div>
            </li>
          `;
          }).join('') : '<li class="recent-item"><div class="r-left"><div class="r-desc">Nenhum lançamento registrado.</div></div></li>'}
        </ul>
      </div>
    </section>
  `;
}
