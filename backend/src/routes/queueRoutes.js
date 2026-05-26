const express = require('express');
const router = express.Router();
const { getQueue, getMyPosition } = require('../controllers/queueController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(authMiddleware);

router.get('/', adminMiddleware, getQueue);
router.get('/my-position/:ticketId', getMyPosition);

module.exports = router;
