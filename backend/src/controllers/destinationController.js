const pool = require('../config/database');

// GET /destinations — lista destinos
async function getAll(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, created_at FROM destinations ORDER BY name ASC'
    );
    return res.json(rows);
  } catch (err) {
    console.error('Erro ao listar destinos:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

// POST /destinations — cria destino
async function create(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Nome é obrigatório.' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM destinations WHERE name = ?',
      [name]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Já existe um destino com esse nome.' });
    }

    const [result] = await pool.query(
      'INSERT INTO destinations (name) VALUES (?)',
      [name]
    );

    return res.status(201).json({
      message: 'Destino criado com sucesso.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Erro ao criar destino:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

// PUT /destinations/:id — edita destino
async function update(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Nome é obrigatório.' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM destinations WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Destino não encontrado.' });
    }

    await pool.query('UPDATE destinations SET name = ? WHERE id = ?', [name, id]);
    return res.json({ message: 'Destino atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar destino:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

// DELETE /destinations/:id — remove destino
async function remove(req, res) {
  const { id } = req.params;

  try {
    const [existing] = await pool.query(
      'SELECT id FROM destinations WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Destino não encontrado.' });
    }

    await pool.query('DELETE FROM destinations WHERE id = ?', [id]);
    return res.json({ message: 'Destino removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover destino:', err);
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        message: 'Não é possível remover: destino está sendo usado em chamados ou usuários.',
      });
    }
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

module.exports = { getAll, create, update, remove };
