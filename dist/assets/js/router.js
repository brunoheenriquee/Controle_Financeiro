import { renderHome } from './pages/home.js';
import { renderHistorico } from './pages/historico.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderConfiguracoes } from './pages/configuracoes.js';
import { renderCategorias } from './pages/categorias.js';

const routes = {
  home: renderHome,
  historico: renderHistorico,
  dashboard: renderDashboard,
  configuracoes: renderConfiguracoes,
  categorias: renderCategorias
};

export async function router() {
  const el = document.getElementById('app');
  if (!el) return;
  const hash = (location.hash || '#home').replace('#', '');
  const render = routes[hash] || routes.home;
  try {
    await render(el);
  } catch (e) {
    el.innerHTML = `<p>Erro ao carregar a página: ${e.message}</p>`;
  }
}

export function navigate(route) {
  location.hash = `#${route}`;
}