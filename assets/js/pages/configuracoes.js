import { PowerAutomateService } from '../services/powerAutomateService.js';

export function renderConfiguracoes(el) {
  const service = new PowerAutomateService();

  el.innerHTML = `
    <section class="layout-grid">
      <div class="card config-card">
        <h2>Configurações</h2>
        <p class="muted">Defina o endpoint do Power Automate para sincronizar os lançamentos e o resumo com sua planilha.</p>
        <form id="power-automate-form">
          <label for="power-automate-url">URL do Power Automate</label>
          <input id="power-automate-url" name="url" type="url" placeholder="https://seu-fluxo.azurewebsites.net" value="${service.baseUrl || ''}" />
          <div class="form-actions">
            <button type="submit">Salvar</button>
            <button type="button" id="power-automate-test" class="secondary">Testar conexão</button>
            <button type="button" id="power-automate-clear" class="secondary">Limpar</button>
          </div>
          <p class="config-feedback" aria-live="polite">${service.isConfigured() ? 'Power Automate configurado. Os dados serão carregados remotamente.' : 'Nenhum endpoint configurado. O app usará o modo local.'}</p>
        </form>
      </div>
    </section>
  `;

  const form = el.querySelector('#power-automate-form');
  const urlInput = el.querySelector('#power-automate-url');
  const feedback = el.querySelector('.config-feedback');
  const testButton = el.querySelector('#power-automate-test');
  const clearButton = el.querySelector('#power-automate-clear');

  const setFeedback = (message, status = 'info') => {
    feedback.textContent = message;
    feedback.dataset.status = status;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = urlInput.value.trim();
    if (!url) {
      setFeedback('Informe um endereço válido antes de salvar.', 'error');
      return;
    }

    service.setBaseUrl(url);
    setFeedback('URL salva com sucesso. Quando o endpoint estiver ativo, a Home utilizará o Power Automate.', 'success');
  });

  testButton.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) {
      setFeedback('Informe a URL para testar a conexão.', 'error');
      return;
    }

    service.setBaseUrl(url);
    setFeedback('Testando conexão...', 'info');
    try {
      await service.getResumo();
      setFeedback('Conexão bem-sucedida. O Power Automate está respondendo corretamente.', 'success');
    } catch (error) {
      setFeedback(`Falha ao testar conexão: ${error.message}`, 'error');
    }
  });

  clearButton.addEventListener('click', () => {
    service.clearBaseUrl();
    urlInput.value = '';
    setFeedback('Configuração removida. O app retornou ao modo local.', 'info');
  });
}
