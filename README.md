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

## Deploy estático no Netlify

Este projeto agora está configurado para rodar como um site estático no Netlify.

- O build gera ou usa a pasta `dist/` contendo `index.html`, `assets/`, `manifest.json` e `sw.js`.
- O Netlify detecta o deploy pelo arquivo `netlify.toml`.
- As configurações do Netlify já estão definidas em `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

### Como publicar

Opção 1: usar o painel do Netlify

1. Conecte seu repositório GitHub/GitLab/Bitbucket ao Netlify.
2. Defina o build command: `npm run build`
3. Defina o publish directory: `dist`
4. Salve e implante.

Opção 2: usar a CLI do Netlify

```powershell
npm run build
npx netlify deploy --prod --dir=dist
```

> Se você usar a CLI, instale o Netlify CLI globalmente ou execute com `npx`.

### Observação

Este projeto agora é um site estático puro. O `worker.js` e a configuração do Cloudflare não são necessários para o deploy no Netlify.

