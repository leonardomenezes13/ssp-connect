const pool = require('../config/database');

// GET /tickets — usuário vê apenas os próprios; admin vê todos
async function getAll(req, res) {
  const { status, category_id, destination_id, user_id } = req.query;

  const validStatuses = ['ABERTO', 'EM_ATENDIMENTO', 'CONCLUIDO', 'CANCELADO'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status inválido.' });
  }

  let query = `
    SELECT
      t.id, t.title, t.description, t.status, t.created_at,
      u.id AS user_id, u.name AS user_name,
      d.id AS destination_id, d.name AS destination_name,
      c.id AS category_id, c.name AS category_name
    FROM tickets t
    JOIN users u ON t.user_id = u.id
    JOIN destinations d ON t.destination_id = d.id
    JOIN categories c ON t.category_id = c.id
    WHERE 1=1
  `;

  const params = [];

  // Usuário comum só vê os próprios chamados
  if (req.user.role === 'USER') {
    query += ' AND t.user_id = ?';
    params.push(req.user.id);
  } else {
    // Admin pode filtrar por usuário
    if (user_id) {
      query += ' AND t.user_id = ?';
      params.push(user_id);
    }
  }

  if (status) {
    query += ' AND t.status = ?';
    params.push(status);
  }
  if (category_id) {
    query += ' AND t.category_id = ?';
    params.push(category_id);
  }
  if (destination_id) {
    query += ' AND t.destination_id = ?';
    params.push(destination_id);
  }

  query += ' ORDER BY t.created_at DESC';

  try {
    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (err) {
    console.error('Erro ao listar chamados:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

// POST /tickets — usuário abre chamado
async function create(req, res) {
  const { title, description, category_id, destination_id } = req.body;

  if (!title || !category_id || !destination_id) {
    return res.status(400).json({ message: 'Título, categoria e destino são obrigatórios.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO tickets (title, description, status, user_id, destination_id, category_id)
       VALUES (?, ?, 'ABERTO', ?, ?, ?)`,
      [title, description || null, req.user.id, destination_id, category_id]
    );

    return res.status(201).json({
      message: 'Chamado aberto com sucesso.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Erro ao criar chamado:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

// GET /tickets/:id — exibe detalhes do chamado
async function getById(req, res) {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT
        t.id, t.title, t.description, t.status, t.created_at,
        u.id AS user_id, u.name AS user_name,
        d.id AS destination_id, d.name AS destination_name,
        c.id AS category_id, c.name AS category_name
       FROM tickets t
       JOIN users u ON t.user_id = u.id
       JOIN destinations d ON t.destination_id = d.id
       JOIN categories c ON t.category_id = c.id
       WHERE t.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Chamado não encontrado.' });
    }

    const ticket = rows[0];

    // Usuário só pode ver os próprios chamados
    if (req.user.role === 'USER' && ticket.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Calcular posição na fila (se status ABERTO ou EM_ATENDIMENTO)
    let position = null;
    if (ticket.status === 'ABERTO' || ticket.status === 'EM_ATENDIMENTO') {
      const [[{ pos }]] = await pool.query(
        `SELECT COUNT(*) AS pos FROM tickets
         WHERE status IN ('ABERTO', 'EM_ATENDIMENTO')
         AND created_at <= (SELECT created_at FROM tickets WHERE id = ?)`,
        [ticket.id]
      );
      position = pos;
    }

    return res.json({ ...ticket, position });
  } catch (err) {
    console.error('Erro ao buscar chamado:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

// PUT /tickets/:id/status — admin altera status
async function updateStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['ABERTO', 'EM_ATENDIMENTO', 'CONCLUIDO', 'CANCELADO'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Status inválido. Use: ${validStatuses.join(', ')}`,
    });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM tickets WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Chamado não encontrado.' });
    }

    await pool.query('UPDATE tickets SET status = ? WHERE id = ?', [status, id]);
    return res.json({ message: 'Status atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

// DELETE /tickets/:id — admin cancela/remove chamado
async function remove(req, res) {
  const { id } = req.params;

  try {
    const [existing] = await pool.query('SELECT id FROM tickets WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Chamado não encontrado.' });
    }

    await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
    return res.json({ message: 'Chamado removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover chamado:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

module.exports = { getAll, create, getById, updateStatus, remove };
