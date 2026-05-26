const bcrypt = require('bcrypt');
const pool = require('../config/database');

// GET /users - lista todos (somente admin)
async function getAll(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.role, u.created_at,
              d.id AS destination_id, d.name AS destination_name
       FROM users u
       LEFT JOIN destinations d ON u.destination_id = d.id
       ORDER BY u.name ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error('Erro ao listar usuarios:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

// POST /users - cria usuario (somente admin)
async function create(req, res) {
  const { name, password, role, destination_id } = req.body;
  const destinationId = destination_id === '' || destination_id === undefined
    ? null
    : destination_id;

  if (!name || !password || !role) {
    return res.status(400).json({ message: 'Nome, senha e perfil sao obrigatorios.' });
  }

  if (!['USER', 'ADMIN'].includes(role)) {
    return res.status(400).json({ message: 'Perfil invalido. Use USER ou ADMIN.' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE name = ?', [name]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Ja existe um usuario com esse nome.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, password, role, destination_id) VALUES (?, ?, ?, ?)',
      [name, hashedPassword, role, destinationId]
    );

    return res.status(201).json({
      message: 'Usuario criado com sucesso.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Erro ao criar usuario:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

// PUT /users/:id - edita usuario (somente admin)
async function update(req, res) {
  const { id } = req.params;
  const { name, password, role, destination_id } = req.body;
  const destinationId = destination_id === '' || destination_id === undefined
    ? null
    : destination_id;

  if (role && !['USER', 'ADMIN'].includes(role)) {
    return res.status(400).json({ message: 'Perfil invalido. Use USER ou ADMIN.' });
  }

  try {
    const [existing] = await pool.query('SELECT id, name, role FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Usuario nao encontrado.' });
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await pool.query(
      `UPDATE users SET
        name = ?,
        password = COALESCE(?, password),
        role = ?,
        destination_id = ?
       WHERE id = ?`,
      [
        name || existing[0].name,
        hashedPassword,
        role || existing[0].role,
        destinationId,
        id,
      ]
    );

    return res.json({ message: 'Usuario atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar usuario:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

// DELETE /users/:id - remove usuario (somente admin)
async function remove(req, res) {
  const { id } = req.params;

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Usuario nao encontrado.' });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return res.json({ message: 'Usuario removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover usuario:', err);
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        message: 'Nao e possivel remover: usuario possui chamados vinculados.',
      });
    }
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

module.exports = { getAll, create, update, remove };
