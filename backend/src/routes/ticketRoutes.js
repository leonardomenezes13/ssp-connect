const express = require('express');
const router = express.Router();
const {
  getAll,
  create,
  getById,
  updateStatus,
  remove,
} = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(authMiddleware);

router.get('/', getAll);
router.post('/', (req, res, next) => {
  if (req.user.role !== 'USER') {
    return res.status(403).json({ message: 'Apenas usuários comuns podem abrir chamados.' });
  }
  return create(req, res, next);
});
router.get('/:id', getById);
router.put('/:id/status', adminMiddleware, updateStatus);
router.delete('/:id', adminMiddleware, remove);

module.exports = router;
