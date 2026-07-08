# Controle_Financeiro
Projeto dedicado à criação de um controle financeiro mobile-first, com integração futura ao Power Automate, Office Scripts e planilha Excel como banco de dados.

## Proposta de funcionamento
- O aplicativo mobile será usado para registrar lançamentos de receita e despesa.
- Os dados serão enviados para um endpoint do Power Automate.
- O Power Automate irá escrever os registros em uma planilha.
- O Office Scripts ou fórmulas da própria planilha serão responsáveis por gerar resumos, histórico e dashboards.
- A aplicação web funciona como camada de entrada e visualização simples, enquanto a planilha vira a fonte de verdade.

## Arquitetura prevista
- Front-end: aplicação web simples em JavaScript puro.
- Persistência local: fallback via localStorage para uso offline ou testes.
- Integração: camada de serviço para consumir o Power Automate.
- Banco de dados: planilha Excel/OneDrive.
- Relatórios: Office Scripts e dashboards na própria planilha.

## Fluxo principal
1. Usuário registra um lançamento no celular.
2. O app envia o dado para o fluxo do Power Automate.
3. O fluxo grava o registro na planilha.
4. A planilha atualiza dashboards e resumos.
5. O app pode consultar o resumo via endpoint do Power Automate.

## Deploy no Cloudflare Pages

Este projeto foi reestruturado para funcionar como um site estático no Cloudflare Pages.

- O build gera ou usa a pasta `dist/` contendo `index.html`, `assets/`, `manifest.json` e `sw.js`.
- No painel do Cloudflare Pages, configure:
  - Build command: `npm run build`
  - Build output directory: `dist`
- Não é necessário usar `worker.js` nem `site.bucket` para um Pages estático.
- O arquivo `wrangler.toml` agora contém apenas a configuração Pages:

```toml
name = "controle-financeiro"
pages_build_output_dir = "./dist"
```

Exemplo local para gerar e publicar via CLI:

```powershell
npm run build
npm run deploy:pages
```

Se preferir usar apenas o painel do Pages, mantenha a configuração acima e não defina um deploy command extra.

