const express = require('express');
const { getStores, submitRating } = require('../controllers/user.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(verifyToken, requireRole(['user']));

router.get('/stores', getStores);
router.post('/stores/:storeId/rating', submitRating);

module.exports = router;
