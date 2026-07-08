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

O projeto agora foi reestruturado para publicar diretamente a pasta `dist/` no Cloudflare Pages.

- A build step usa o script em `scripts/build-static.js` para garantir que o conteúdo estático seja publicado a partir de `dist/`.
- No painel do Cloudflare Pages, configure:
  - Build command: `npm run build`
  - Build output directory: `dist`
- O arquivo `wrangler.toml` foi alinhado para apontar o bucket estático para `./dist`.

Exemplo local para gerar e publicar:

```powershell
# build locally (optional, script already exists)
npm run build

# add and push dist
git add dist
git commit -m "Add built static site for direct deploy"
git push
```

After pushing, trigger your Cloudflare deployment; no remote Node build will be required.

