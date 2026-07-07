import { FinanceService } from '../services/financeService.js';
import { PowerAutomateService } from '../services/powerAutomateService.js';
import { storage } from '../storage.js';
import { router } from '../router.js';

const ID = 'app-modal-root';

function ensureRoot() {
	let root = document.getElementById(ID);
	if (!root) {
		root = document.createElement('div');
		root.id = ID;
		document.body.appendChild(root);
	}
	return root;
}

export function openNewLancamentoModal() {
	const root = ensureRoot();
	root.innerHTML = modalHtml();
	root.classList.add('modal-open');

	const closeButtons = root.querySelectorAll('.modal-close-icon, .modal-cancel');
	closeButtons.forEach((button) => button.addEventListener('click', closeModal));

	root.onclick = (ev) => {
		const backdrop = ev.target.closest('.modal-backdrop');
		if (backdrop && !ev.target.closest('.modal-content')) {
			closeModal();
		}
	};

	const form = root.querySelector('#modal-lancamento-form');
	form.addEventListener('submit', async (ev) => {
		ev.preventDefault();
		const data = Object.fromEntries(new FormData(form));
		const payload = {
			id: crypto.randomUUID(),
			descricao: data.descricao,
			data: data.data || new Date().toISOString().slice(0, 10),
			valor: Number(data.valor),
			tipo: data.tipo,
			categoria: data.categoria || 'Sem categoria',
			conta: data.conta || 'Padrão',
			observacao: data.observacao || ''
		};

		const pa = new PowerAutomateService();
		const fs = new FinanceService(storage);

		try {
			if (pa.isConfigured()) {
				await pa.createLancamento(payload);
			} else {
				fs.addLancamento(payload);
			}
			closeModal();
			router();
		} catch (e) {
			alert('Erro ao salvar lançamento: ' + e.message);
		}
	});

	// focus first field
	setTimeout(() => {
		const input = root.querySelector('#modal-lancamento-form [name="descricao"]');
		if (input) input.focus();
	}, 80);
}

export function closeModal() {
	const root = document.getElementById(ID);
	if (!root) return;
	root.classList.remove('modal-open');
	root.innerHTML = '';
}

function modalHtml() {
	return `
		<div class="modal-backdrop">
			<div class="modal-content" role="dialog" aria-modal="true">
				<button class="modal-close-icon" aria-label="Fechar">✕</button>
				<h3>Novo lançamento</h3>
				<form id="modal-lancamento-form">
					<input name='descricao' placeholder='Descrição' required />
					<input name='data' type='date' required />
					<input name='valor' type='number' step='0.01' placeholder='Valor' required />
					<select name='tipo'>
						<option value='receita'>Receita</option>
						<option value='despesa'>Despesa</option>
					</select>
					<input name='categoria' placeholder='Categoria' />
					<input name='conta' placeholder='Conta' />
					<textarea name='observacao' placeholder='Observação'></textarea>
					<div class="modal-actions">
						<button type="button" class="modal-cancel">Cancelar</button>
						<button type="submit" class="modal-save">Salvar</button>
					</div>
				</form>
			</div>
		</div>
	`;
}

export function openModal() { }