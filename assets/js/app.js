import { router } from './router.js';
import { openNewLancamentoModal } from './components/modal.js';

function updateActiveNav() {
	const hash = (location.hash || '#home').replace('#', '');
	document.querySelectorAll('nav.main-nav a, nav.bottom-nav a').forEach(a => {
		a.classList.toggle('active', (a.dataset.route === hash));
	});
}

window.addEventListener('DOMContentLoaded', () => {
	router();
	updateActiveNav();
	setupFab();
	document.body.addEventListener('click', (event) => {
		const anchor = event.target.closest('a[data-route]');
		if (!anchor) return;
		event.preventDefault();
		const route = anchor.dataset.route;
		if (route) {
			location.hash = `#${route}`;
			router();
			updateActiveNav();
		}
	});
	window.addEventListener('hashchange', () => {
		router();
		updateActiveNav();
	});
});

function setupFab() {
	const fab = document.querySelector('.bn-fab');
	if (!fab) return;
	fab.addEventListener('click', (e) => {
		e.preventDefault();
		openNewLancamentoModal();
	});
}