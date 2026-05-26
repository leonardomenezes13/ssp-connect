const pool = require('../config/database');

// GET /categories — lista categorias
async function getAll(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, created_at FROM categories ORDER BY name ASC'
    );
    return res.json(rows);
  } catch (err) {
    console.error('Erro ao listar categorias:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

// POST /categories — cria categoria
async function create(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Nome é obrigatório.' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Já existe uma categoria com esse nome.' });
    }

    const [result] = await pool.query(
      'INSERT INTO categories (name) VALUES (?)',
      [name]
    );

    return res.status(201).json({
      message: 'Categoria criada com sucesso.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Erro ao criar categoria:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

// PUT /categories/:id — edita categoria
async function update(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Nome é obrigatório.' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM categories WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }

    await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    return res.json({ message: 'Categoria atualizada com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar categoria:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

// DELETE /categories/:id — remove categoria
async function remove(req, res) {
  const { id } = req.params;

  try {
    const [existing] = await pool.query(
      'SELECT id FROM categories WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return res.json({ message: 'Categoria removida com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover categoria:', err);
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        message: 'Não é possível remover: categoria está sendo usada em chamados.',
      });
    }
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

module.exports = { getAll, create, update, remove };
