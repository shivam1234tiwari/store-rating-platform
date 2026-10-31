const express = require('express');
const { getStats, addUser, addStore, getUsers, getStores } = require('../controllers/admin.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const { validateUserInput } = require('../middleware/validate.middleware');

const router = express.Router();
router.use(verifyToken, requireRole(['admin']));

router.get('/stats', getStats);
router.post('/users', validateUserInput, addUser);
router.post('/stores', validateUserInput, addStore);
router.get('/users', getUsers);
router.get('/stores', getStores);

module.exports = router;
