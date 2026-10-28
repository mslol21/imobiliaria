const { Client } = require('pg');

const connectionString =
  'postgresql://postgres.yxzzdeyftddvnywglefy:sqdIrWgKVn21@aws-0-us-east-2.pooler.supabase.com:5432/postgres';

async function setup() {
  console.log('--- VINCULANDO USUÁRIO ADMIN AO PERFIL E PERMISSÕES ---');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // 1. Inserir ou atualizar perfil para o usuário admin@admin.com
    const profileSql = `
      INSERT INTO public.profiles (id, full_name, email, role, is_active)
      VALUES (
        '9b40757a-6aed-43ff-82b2-a92857c02bdb',
        'Administrador',
        'admin@admin.com',
        'admin',
        TRUE
      )
      ON CONFLICT (id) DO UPDATE 
      SET is_active = TRUE, role = 'admin', full_name = 'Administrador', email = 'admin@admin.com';
    `;
    await client.query(profileSql);
    console.log('✓ Perfil de administrador cadastrado com sucesso!');

    // 2. Criar trigger automático para novos usuários criados no Supabase Auth
    const triggerSql = `
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      BEGIN
        INSERT INTO public.profiles (id, full_name, email, role, is_active)
        VALUES (
          NEW.id,
          COALESCE(NEW.raw_user_meta_data->>'full_name', 'Administrador'),
          NEW.email,
          'admin',
          TRUE
        )
        ON CONFLICT (id) DO UPDATE 
        SET email = EXCLUDED.email, is_active = TRUE, role = 'admin';
        RETURN NEW;
      END;
      $$;

      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `;
    await client.query(triggerSql);
    console.log('✓ Trigger automático de criação de perfil configurado!');

    // 3. Confirmar e listar perfis
    const res = await client.query('SELECT id, full_name, email, role, is_active, created_at FROM public.profiles;');
    console.log('\nPerfis ativos no banco de dados:', res.rows);

  } catch (err) {
    console.error('❌ Erro ao configurar admin:', err);
  } finally {
    await client.end();
  }
}

setup();
