export function renderConfiguracoes(el) {
  el.innerHTML = `
    <section class="layout-grid">
      <div class="card config-card">
        <h2>Configurações</h2>
        <p class="muted">Banco de dados Supabase configurado e ativo</p>
        <form id="config-form">
          <div class="config-feedback" data-status="success">
            ✓ Supabase está sincronizado e funcionando corretamente. Todos os seus lançamentos são salvos em tempo real na nuvem.
          </div>
          <div style="margin-top: 1rem; padding: 1rem; background: rgba(15,23,42,0.04); border-radius: 12px;">
            <p style="margin: 0; font-size: 0.9rem; color: var(--muted);">
              <strong>Informações do projeto:</strong><br/>
              Banco: PostgreSQL (Supabase)<br/>
              URL: https://xwsmuqiiavkkjaqblczw.supabase.co<br/>
              Estado: Ativo e sincronizado
            </p>
          </div>
        </form>
      </div>
    </section>
  `;
}
