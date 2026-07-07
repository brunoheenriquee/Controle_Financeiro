import { storage } from '../storage.js';

export class PowerAutomateService {
  constructor(baseUrl = null) {
    this.baseUrl = baseUrl || storage.get('powerAutomateUrl') || '';
  }

  isConfigured() {
    return Boolean(this.baseUrl);
  }

  setBaseUrl(url) {
    this.baseUrl = url;
    storage.set('powerAutomateUrl', url);
  }

  async request(method, endpoint, body = null) {
    if (!this.baseUrl) {
      return null;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`Falha ao consumir endpoint ${endpoint}`);
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