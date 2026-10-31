const express = require('express');
const { register, login, updatePassword } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validateUserInput } = require('../middleware/validate.middleware');

const router = express.Router();

router.post('/register', validateUserInput, register);
router.post('/login', login);
router.patch('/password', verifyToken, validateUserInput, updatePassword);

module.exports = router;
