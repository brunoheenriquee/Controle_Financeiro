import { SupabaseService } from '../services/supabaseService.js';
import { storage } from '../storage.js';
import { router } from '../router.js';
import { categories } from '../constants/categories.js';

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
	const tipoInput = root.querySelector('#lancamento-tipo');
	const categoriaWrapper = root.querySelector('#categoria-wrapper');

	if (tipoInput && categoriaWrapper) {
		tipoInput.addEventListener('change', () => {
			categoriaWrapper.classList.toggle('hidden', tipoInput.value !== 'despesa');
		});
	}

	form.addEventListener('submit', async (ev) => {
		ev.preventDefault();
		const data = Object.fromEntries(new FormData(form));
		const payload = {
			data: data.data || new Date().toISOString().slice(0, 10),
			valor: Number(data.valor),
			tipo: data.tipo,
			categoriaId: tipoInput.value === 'despesa' && data.categoria ? Number(data.categoria) : null,
			observacao: data.observacao || ''
		};

		const supabaseService = new SupabaseService();

		try {
			await supabaseService.createLancamento(payload);
			closeModal();
			router();
		} catch (e) {
			alert('Erro ao salvar lançamento: ' + e.message);
		}
	});

	// focus first field
	setTimeout(() => {
		const input = root.querySelector('#modal-lancamento-form [name="data"]');
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
					<input name='data' type='date' required />
					<input name='valor' type='number' step='0.01' placeholder='Valor' required />
					<select name='tipo' id='lancamento-tipo'>
						<option value='receita'>Receita</option>
						<option value='despesa'>Despesa</option>
					</select>
					<div id='categoria-wrapper' class='hidden'>
						<select name='categoria' id='lancamento-categoria'>
							<option value=''>Selecione uma categoria</option>
							${categories.map(category => `<option value='${category.id}'>${category.label}</option>`).join('')}
						</select>
					</div>
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