import connection from '../connection';

export interface TurmaSlot {
  slot_id?: string;
  turma_id: string;
  numero: number;
  hora_inicio: string;
  hora_fim: string;
}

const TABLE = 'turma_slot';

const TurmaSlotModel = {
  async listarPorTurma(turmaId: string): Promise<TurmaSlot[]> {
    return connection(TABLE).where({ turma_id: turmaId }).orderBy('numero');
  },

  async upsert(turmaId: string, numero: number, hora_inicio: string, hora_fim: string): Promise<TurmaSlot> {
    const existing = await connection(TABLE).where({ turma_id: turmaId, numero }).first();
    if (existing) {
      await connection(TABLE)
        .where({ turma_id: turmaId, numero })
        .update({ hora_inicio, hora_fim, updated_at: connection.fn.now() });
      return connection(TABLE).where({ turma_id: turmaId, numero }).first();
    }
    const [created] = await connection(TABLE)
      .insert({ turma_id: turmaId, numero, hora_inicio, hora_fim })
      .returning('*');
    return created;
  },

  async deletarPorTurma(turmaId: string): Promise<void> {
    await connection(TABLE).where({ turma_id: turmaId }).delete();
  },
};

export default TurmaSlotModel;
