const pool = require('../config/database');

// GET /queue — admin vê a fila completa
async function getQueue(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT
        t.id, t.title, t.status, t.created_at,
        u.id AS user_id, u.name AS user_name,
        d.id AS destination_id, d.name AS destination_name,
        c.id AS category_id, c.name AS category_name
       FROM tickets t
       JOIN users u ON t.user_id = u.id
       JOIN destinations d ON t.destination_id = d.id
       JOIN categories c ON t.category_id = c.id
       WHERE t.status IN ('ABERTO', 'EM_ATENDIMENTO')
       ORDER BY t.created_at ASC`
    );

    const queue = rows.map((ticket, index) => ({
      ...ticket,
      position: index + 1,
    }));

    return res.json(queue);
  } catch (err) {
    console.error('Erro ao buscar fila:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

// GET /queue/my-position/:ticketId — usuário vê a posição do chamado
async function getMyPosition(req, res) {
  const { ticketId } = req.params;

  try {
    // Verificar se o chamado pertence ao usuário
    const [ticketRows] = await pool.query(
      'SELECT id, status, user_id FROM tickets WHERE id = ?',
      [ticketId]
    );

    if (ticketRows.length === 0) {
      return res.status(404).json({ message: 'Chamado não encontrado.' });
    }

    const ticket = ticketRows[0];

    if (ticket.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    if (!['ABERTO', 'EM_ATENDIMENTO'].includes(ticket.status)) {
      return res.json({ position: null, message: 'Chamado não está na fila.' });
    }

    const [[{ position }]] = await pool.query(
      `SELECT COUNT(*) AS position FROM tickets
       WHERE status IN ('ABERTO', 'EM_ATENDIMENTO')
       AND created_at <= (SELECT created_at FROM tickets WHERE id = ?)`,
      [ticketId]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM tickets
       WHERE status IN ('ABERTO', 'EM_ATENDIMENTO')`
    );

    return res.json({ position, total });
  } catch (err) {
    console.error('Erro ao buscar posição na fila:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

module.exports = { getQueue, getMyPosition };
