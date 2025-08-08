const knex = require('knex');
require('dotenv').config();

const config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};

const db = knex(config);

async function popularRAsExistentes() {
  try {
    console.log('🔄 Populando RAs para matrículas existentes...\n');
    
    // Buscar todas as matrículas sem RA
    const matriculas = await db('matricula_aluno')
      .leftJoin('turma', 'matricula_aluno.turma_id', 'turma.turma_id')
      .leftJoin('serie', 'turma.serie_id', 'serie.serie_id')
      .leftJoin('ano_letivo', 'matricula_aluno.ano_letivo_id', 'ano_letivo.ano_letivo_id')
      .select(
        'matricula_aluno.matricula_aluno_id',
        'ano_letivo.ano',
        'serie.nome_serie',
        'matricula_aluno.created_at'
      )
      .whereNull('matricula_aluno.ra')
      .orderBy('matricula_aluno.created_at', 'asc');
    
    console.log(`📋 Encontradas ${matriculas.length} matrículas sem RA`);
    
    if (matriculas.length === 0) {
      console.log('✅ Todas as matrículas já possuem RA!');
      return;
    }
    
    // Agrupar por ano e série para gerar sequenciais únicos
    const rasPorAnoSerie = {};
    
    for (const matricula of matriculas) {
      const ano = matricula.ano || 2025; // fallback para 2025
      // Extrair número da série do nome (ex: "1ª série" → 1)
      const serie = matricula.nome_serie ? parseInt(matricula.nome_serie.match(/\d+/)?.[0]) || 1 : 1;
      const chave = `${ano}_${serie}`;
      
      if (!rasPorAnoSerie[chave]) {
        // Buscar o próximo sequencial disponível para este ano/série
        const ultimoRA = await db('matricula_aluno')
          .leftJoin('turma', 'matricula_aluno.turma_id', 'turma.turma_id')
          .leftJoin('serie', 'turma.serie_id', 'serie.serie_id')
          .leftJoin('ano_letivo', 'matricula_aluno.ano_letivo_id', 'ano_letivo.ano_letivo_id')
          .where('ano_letivo.ano', ano)
          .whereRaw('serie.nome_serie ~ ?', [`^${serie}`]) // série começa com o número
          .whereNotNull('matricula_aluno.ra')
          .orderBy('matricula_aluno.ra', 'desc')
          .first('matricula_aluno.ra');
        
        let proximoSequencial = 1;
        
        if (ultimoRA && ultimoRA.ra) {
          // Extrair o sequencial do último RA
          const sequencialAtual = parseInt(ultimoRA.ra.slice(-3));
          proximoSequencial = sequencialAtual + 1;
        }
        
        rasPorAnoSerie[chave] = proximoSequencial;
      }
      
      // Gerar RA no formato: ANOSERIENNN
      const ra = `${ano}${serie}${rasPorAnoSerie[chave].toString().padStart(3, '0')}`;
      
      // Atualizar a matrícula com o RA
      await db('matricula_aluno')
        .where('matricula_aluno_id', matricula.matricula_aluno_id)
        .update({ ra });
      
      console.log(`✅ Matrícula ${matricula.matricula_aluno_id.slice(0, 8)}... → RA: ${ra}`);
      
      // Incrementar o sequencial para a próxima matrícula
      rasPorAnoSerie[chave]++;
    }
    
    console.log('\n🎉 RAs populados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao popular RAs:', error.message);
  } finally {
    await db.destroy();
  }
}

popularRAsExistentes();
