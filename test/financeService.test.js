import test from 'node:test';
import assert from 'node:assert/strict';
import { FinanceService } from '../assets/js/services/financeService.js';

function createStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    get(key) { return store.get(key) ?? null; },
    set(key, value) { store.set(key, value); }
  };
}

test('adiciona lançamento e calcula resumo', () => {
  const storage = createStorage();
  const service = new FinanceService(storage);

  service.addLancamento({ tipo: 'receita', descricao: 'Salário', valor: 3000, categoria: 'Salário' });
  service.addLancamento({ tipo: 'despesa', descricao: 'Aluguel', valor: 1200, categoria: 'Moradia' });

  const resumo = service.getResumo();

  assert.equal(resumo.receitas, 3000);
  assert.equal(resumo.despesas, 1200);
  assert.equal(resumo.saldo, 1800);
  assert.equal(resumo.total, 2);
});
