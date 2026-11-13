-- Auth.js/Prisma acessam estas tabelas pelo servidor. A API pública não recebe acesso.
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrganizationMember" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "User", "Organization", "OrganizationMember" FROM PUBLIC;

-- Roles do Supabase podem não existir em PostgreSQL local ou nos testes.
DO $$
DECLARE
  api_role TEXT;
BEGIN
  FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
      EXECUTE format('REVOKE ALL ON TABLE "User", "Organization", "OrganizationMember" FROM %I', api_role);
    END IF;
  END LOOP;
END $$;
