export class FinanceService {
  constructor(storage) {
    this.storage = storage;
  }

  getState() {
    const raw = this.storage.get('financeState');
    if (!raw) {
      return { lancamentos: [], categorias: [], contas: [], cartoes: [] };
    }

    return JSON.parse(raw);
  }

  saveState(state) {
    this.storage.set('financeState', JSON.stringify(state));
  }

  addLancamento(lancamento) {
    const state = this.getState();
    const normalized = {
      id: crypto.randomUUID(),
      ...lancamento,
      valor: Number(lancamento.valor),
      data: lancamento.data || new Date().toISOString().slice(0, 10)
    };

    state.lancamentos.push(normalized);
    this.saveState(state);
    return normalized;
  }

  getLancamentos() {
    return this.getState().lancamentos || [];
  }

  getResumo() {
    const lancamentos = this.getLancamentos();
    const receitas = lancamentos
      .filter((item) => item.tipo === 'receita')
      .reduce((sum, item) => sum + item.valor, 0);

    const despesas = lancamentos
      .filter((item) => item.tipo === 'despesa')
      .reduce((sum, item) => sum + item.valor, 0);

    return {
      receitas,
      despesas,
      saldo: receitas - despesas,
      total: lancamentos.length
    };
  }
}
