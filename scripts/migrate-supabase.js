const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString =
  'postgresql://postgres.yxzzdeyftddvnywglefy:sqdIrWgKVn21@aws-0-us-east-2.pooler.supabase.com:5432/postgres';

async function run() {
  console.log('--- CONECTANDO AO SUPABASE POSTGRESQL (us-east-2) ---');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✓ Conectado ao banco com sucesso!');

    // 1. Executar migration 0001
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '0001_initial_schema.sql');
    if (fs.existsSync(migrationPath)) {
      console.log('Executando migration: 0001_initial_schema.sql...');
      const sql = fs.readFileSync(migrationPath, 'utf8');
      await client.query(sql);
      console.log('✓ Migration 0001_initial_schema.sql executada com sucesso!');
    }

    // 2. Executar seed se existir
    const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('Executando seed de demonstração...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await client.query(seedSql);
      console.log('✓ Seed executado com sucesso!');
    }

    // 3. Verificar tabelas criadas
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('✓ Tabelas públicas criadas:', tablesRes.rows.map(r => r.table_name));

    // 4. Contagem de imóveis
    const countRes = await client.query('SELECT count(*) FROM properties;');
    console.log('✓ Total de imóveis cadastrados:', countRes.rows[0].count);

    // 5. Contagem de imagens
    const imgCount = await client.query('SELECT count(*) FROM property_images;');
    console.log('✓ Total de fotos cadastradas:', imgCount.rows[0].count);

    // 6. Configurações salvas
    const settingsRes = await client.query('SELECT agency_name, phone, whatsapp FROM site_settings LIMIT 1;');
    console.log('✓ Configurações institucionais:', settingsRes.rows[0]);

  } catch (err) {
    console.error('❌ Erro durante migração:', err);
    process.exit(1);
  } finally {
    await client.end();
    console.log('--- MIGRAÇÃO CONCLUÍDA COM SUCESSO ---');
  }
}

run();
