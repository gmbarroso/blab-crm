# Análise inicial e plano de migração

Inspeção realizada antes de criar arquivos em 12/11/2026.

## Evidências

O workspace continha somente os diretórios vazios e somente leitura `.git`, `.agents`, `.codex` e `.aws`. `git status` informou que o diretório não era um repositório Git. Não havia package.json, lockfile, configurações, código, páginas, componentes, estilos ou assets. Não foi possível identificar versões ou conflitos do projeto v0 mencionado no escopo. Node disponível: 22.15.0; pnpm: 10.20.0; binários PostgreSQL: 16.

Foi solicitado o caminho/repositório original ao usuário. A implementação avançou na fundação independente da interface ausente. Não foi recriado um CRM visual nem foram inventadas páginas comerciais.

## Plano apresentado

1. Preparar monorepo pnpm/Turbo e configurações TypeScript.
2. Receber e migrar os fontes originais para apps/web preservando imports e design; enquanto ausentes, usar somente telas mínimas para validar autenticação.
3. Configurar Prisma/PostgreSQL e migration de User/Organization/OrganizationMember.
4. Implementar Credentials Auth.js, Argon2id e bootstrap manual idempotente.
5. Resolver sessão, vínculo e permissões no servidor.
6. Integrar nome/organização/logout ao shell mínimo.
7. Executar testes unitários e integração em cluster PostgreSQL descartável.
8. Documentar operação, deploy, limitações e verificações.

## Quando o v0 estiver disponível

Inventariar package.json, lockfile, aliases, app router, estilos globais, assets, fontes, temas, bibliotecas e componentes antes de mover arquivos. Comparar versões com o lockfile atual e resolver conflitos caso a caso. Mover o app para apps/web/src e public para apps/web/public; ajustar imports e configs preservando o design. Manter componentes específicos no app, separar demonstrativos e envolver páginas privadas com os guards existentes. Testar navegação, temas e breakpoints com referências originais. Só substituir o shell mínimo após essa comparação. Não é possível afirmar preservação visual sem os arquivos de origem.
