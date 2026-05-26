const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(authMiddleware);

router.get('/', getAll); // qualquer autenticado pode listar (necessário para abrir chamado)
router.post('/', adminMiddleware, create);
router.put('/:id', adminMiddleware, update);
router.delete('/:id', adminMiddleware, remove);

module.exports = router;
