// Configuração do Supabase
const SUPABASE_URL = 'https://xwsmuqiiavkkjaqblczw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_e1LrPkUJ_Vo0f3j18dl8zQ_u4l1sbDY';

export class SupabaseService {
  constructor() {
    this.url = SUPABASE_URL;
    this.key = SUPABASE_KEY;
  }

  async request(method, endpoint, body = null) {
    const url = `${this.url}/rest/v1${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.key,
        'Authorization': `Bearer ${this.key}`
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro Supabase (${response.status}): ${error || response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    return contentType.includes('application/json') ? response.json() : response.text();
  }

  // ========== LANÇAMENTOS ==========
  async listLancamentos(limit = null) {
    let endpoint = '/lancamentos?order=data.desc';
    if (limit) endpoint += `&limit=${limit}`;
    return (await this.request('GET', endpoint)) || [];
  }

//TODO: ajustar listLancamentos para usar o getCategoriaById para retornar o nome da categoria em vez do ID, ou fazer um join com a tabela de categorias.

  async createLancamento(lancamento) {
    const payload = {
      data: lancamento.data,
      valor: Number(lancamento.valor),
      tipo: lancamento.tipo,
      categoria_id: lancamento.categoriaId || null,
      observacao: lancamento.observacao || ''
    };
    return this.request('POST', '/lancamentos', payload);
  }

  async deleteLancamento(id) {
    return this.request('DELETE', `/lancamentos?id=eq.${id}`);
  }

  async updateLancamento(id, lancamento) {
    const payload = {
      data: lancamento.data,
      valor: Number(lancamento.valor),
      tipo: lancamento.tipo,
      categoria_id: lancamento.categoriaId || null,
      observacao: lancamento.observacao || ''
    };
    return this.request('PATCH', `/lancamentos?id=eq.${id}`, payload);
  }

  // ========== CATEGORIAS ==========
  async listCategorias(tipo = null) {
    let endpoint = '/categorias?order=label.asc';
    if (tipo) endpoint += `&tipo=eq.${tipo}`;
    return (await this.request('GET', endpoint)) || [];
  }

  async getCategoriaById(id) {
    const result = await this.request('GET', `/categorias?id=eq.${id}`);
    return result && result.length > 0 ? result[0] : null;
  }

  // ========== RESUMO ==========
  async getResumo() {
    const lancamentos = await this.listLancamentos();

    const receitas = lancamentos
      .filter((item) => item.tipo === 'receita')
      .reduce((sum, item) => sum + Number(item.valor), 0);

    const despesas = lancamentos
      .filter((item) => item.tipo === 'despesa')
      .reduce((sum, item) => sum + Number(item.valor), 0);

    return {
      receitas,
      despesas,
      saldo: receitas - despesas,
      total: lancamentos.length
    };
  }

  // ========== MIGRAÇÃO ==========
  async migrateFromLocalStorage(storageData) {
    const state = storageData ? JSON.parse(storageData) : { lancamentos: [] };
    const lancamentos = state.lancamentos || [];

    if (lancamentos.length === 0) {
      console.log('Nenhum dado local para migrar');
      return { success: true, migrated: 0 };
    }

    console.log(`Migrando ${lancamentos.length} lançamentos...`);

    const migrated = [];
    const failed = [];

    for (const lancamento of lancamentos) {
      try {
        await this.createLancamento({
          data: lancamento.data || new Date().toISOString().slice(0, 10),
          valor: lancamento.valor,
          tipo: lancamento.tipo,
          categoriaId: lancamento.categoriaId,
          observacao: lancamento.observacao
        });
        migrated.push(lancamento.id);
      } catch (error) {
        failed.push({ id: lancamento.id, error: error.message });
      }
    }

    return {
      success: failed.length === 0,
      migrated: migrated.length,
      failed: failed.length,
      errors: failed
    };
  }
}
