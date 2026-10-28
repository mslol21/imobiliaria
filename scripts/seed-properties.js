const { Client } = require('pg');
const { DEV_PREVIEW_PROPERTIES } = require('./dev-preview-data.cjs');

const connectionString =
  'postgresql://postgres.yxzzdeyftddvnywglefy:sqdIrWgKVn21@aws-0-us-east-2.pooler.supabase.com:5432/postgres';

async function seed() {
  console.log('--- POVOANDO BANCO SUPABASE COM 10 IMÓVEIS REAIS ---');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // 1. Atualizar site_settings para remover qualquer marca fictícia
    await client.query(`
      UPDATE public.site_settings
      SET 
        agency_name = '',
        agency_slogan = 'Explore oportunidades para comprar ou alugar com segurança, transparência e atendimento especializado.',
        about_title = 'Consultoria Imobiliária com Segurança e Clareza',
        about_history = 'Nossa consultoria atua na curadoria criteriosa de imóveis residenciais e corporativos, conectando clientes a propriedades com arquitetura contemporânea, localização consolidada e segurança documental.',
        about_positioning = 'Trabalhamos com portfólio selecionado, visitas agendadas e assessoria integral desde a primeira visita até a formalização do contrato.',
        updated_at = NOW();
    `);
    console.log('✓ Configurações institucionais atualizadas sem marca fictícia!');

    // 2. Limpar propriedades anteriores se houver
    await client.query('DELETE FROM public.property_images;');
    await client.query('DELETE FROM public.property_features;');
    await client.query('DELETE FROM public.properties;');

    // 3. Inserir as 10 propriedades
    for (const prop of DEV_PREVIEW_PROPERTIES) {
      const insertPropSql = `
        INSERT INTO public.properties (
          id, reference_code, title, slug, property_type, purpose,
          description, short_description, zip_code, state, city,
          neighborhood, street, street_number, complement, latitude,
          longitude, hide_exact_address, sale_price, rent_price,
          condo_fee, iptu_price, iptu_periodicity, usable_area,
          built_area, total_area, bedrooms, suites, bathrooms,
          parking_spots, floor_number, is_furnished, is_pet_friendly,
          is_high_end, amenities, highlights, availability_status,
          publication_status, is_featured, views_count, meta_title,
          meta_description, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
          $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
          $41, $42, $43, $44
        );
      `;

      await client.query(insertPropSql, [
        prop.id,
        prop.reference_code,
        prop.title,
        prop.slug,
        prop.property_type,
        prop.purpose,
        prop.description,
        prop.short_description,
        prop.zip_code,
        prop.state,
        prop.city,
        prop.neighborhood,
        prop.street,
        prop.street_number,
        prop.complement,
        prop.latitude,
        prop.longitude,
        prop.hide_exact_address,
        prop.sale_price,
        prop.rent_price,
        prop.condo_fee,
        prop.iptu_price,
        prop.iptu_periodicity,
        prop.usable_area,
        prop.built_area,
        prop.total_area,
        prop.bedrooms,
        prop.suites,
        prop.bathrooms,
        prop.parking_spots,
        prop.floor_number,
        prop.is_furnished,
        prop.is_pet_friendly,
        prop.is_high_end,
        prop.amenities || [],
        prop.highlights || [],
        prop.availability_status,
        prop.publication_status,
        prop.is_featured,
        prop.views_count,
        prop.meta_title,
        prop.meta_description,
        prop.created_at,
        prop.updated_at,
      ]);

      // Inserir imagens de cada propriedade
      if (prop.images && prop.images.length > 0) {
        for (const img of prop.images) {
          await client.query(`
            INSERT INTO public.property_images (
              property_id, storage_path, url, alt_text,
              is_cover, display_order, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7);
          `, [
            prop.id,
            img.storage_path,
            img.url,
            img.alt_text,
            img.is_cover,
            img.display_order,
            img.created_at
          ]);
        }
      }

      console.log(`✓ Imóvel inserido: [${prop.reference_code}] ${prop.title}`);
    }

    // 4. Verificação final
    const propCount = await client.query('SELECT count(*) FROM public.properties;');
    const imgCount = await client.query('SELECT count(*) FROM public.property_images;');
    console.log(`\n🎉 SUCESSO TOTAL!`);
    console.log(`Propriedades no banco: ${propCount.rows[0].count}`);
    console.log(`Fotos associadas: ${imgCount.rows[0].count}`);

  } catch (err) {
    console.error('❌ Erro durante o povoamento:', err);
  } finally {
    await client.end();
  }
}

seed();
