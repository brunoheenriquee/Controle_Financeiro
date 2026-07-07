import { storage } from '../storage.js';

export class PowerAutomateService {
  constructor(baseUrl = null) {
    this.baseUrl = this.normalizeUrl(baseUrl || storage.get('powerAutomateUrl') || '');
  }

  normalizeUrl(url) {
    if (!url) return '';
    return url.trim().replace(/\/+$/, '');
  }

  isConfigured() {
    return Boolean(this.baseUrl);
  }

  setBaseUrl(url) {
    const normalized = this.normalizeUrl(url);
    this.baseUrl = normalized;
    storage.set('powerAutomateUrl', normalized);
  }

  clearBaseUrl() {
    this.baseUrl = '';
    storage.remove('powerAutomateUrl');
  }

  async request(method, endpoint, body = null) {
    if (!this.baseUrl) {
      throw new Error('Power Automate não configurado');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Falha ao consumir endpoint ${endpoint}: ${message || response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    return contentType.includes('application/json') ? response.json() : response.text();
  }

  async listLancamentos() {
    return (await this.request('GET', '/lancamentos')) || [];
  }

  async createLancamento(lancamento) {
    return this.request('POST', '/lancamentos', lancamento);
  }

  async getResumo() {
    return (await this.request('GET', '/resumo')) || {
      receitas: 0,
      despesas: 0,
      saldo: 0,
      total: 0
    };
  }
}