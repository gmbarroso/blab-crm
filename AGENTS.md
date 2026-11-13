# Instruções de desenvolvimento — B.lab CRM

- Leia README.md e docs/architecture.md antes de alterar a arquitetura.
- Preserve componentes, estilos, temas e navegação existentes. A interface recebida na branch feat/frontend-crm-ui está em apps/web; preserve sua identidade visual e mantenha os dados de demonstração separados do banco real.
- Mantenha frontend e backend na mesma aplicação Next.js. Não adicione API separada, microserviços ou dependências sem caso concreto.
- Componentes da aplicação ficam em apps/web. Use packages/ui somente para primitivas compartilháveis reais.
- Componentes React não acessam Prisma. Repositórios acessam dados, serviços concentram regras, Actions/Handlers validam entrada e autorização.
- Client Components não importam código de servidor. Use server-only e mantenha segredos fora do navegador.
- Toda operação privada precisa validar sessão, vínculo e permissão no servidor. Não confie em organizationId do cliente. Filtre entidades comerciais futuras por organização em todas as queries.
- Não use mocks ou dados demonstrativos em funcionalidades reais. Dublês são permitidos em testes unitários, com integração isolada cobrindo o banco real.
- Não duplique regras de negócio, autenticação ou permissões.
- Nunca altere migrations antigas já aplicadas. Crie novas migrations e revise o SQL. Não execute resets ou migrations destrutivas em bancos reais.
- Bootstrap permanece explícito, idempotente e sem senhas fixas. Nunca registre credenciais ou hashes em logs.
- Execute pnpm lint, pnpm typecheck e pnpm test após mudanças. Para alterações de banco/autenticação, execute pnpm test:integration em cluster descartável. Não use produção em testes.
- Valide pnpm build para mudanças de integração e mantenha README/docs atualizados com limitações reais.
- Não implemente módulos comerciais sem solicitação explícita. Não invente persistência ou recursos externos já configurados.
