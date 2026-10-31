const express = require('express');
const { getDashboard } = require('../controllers/owner.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(verifyToken, requireRole(['store_owner']));

router.get('/dashboard', getDashboard);

module.exports = router;
