const { Router } = require('express');
const { registrar, login, eu } = require('../controllers/authController');
const { autenticar } = require('../middleware/auth');

const router = Router();

router.post('/registrar', registrar); // pública
router.post('/login', login);         // pública
router.get('/eu', autenticar, eu);    // protegida

module.exports = router;
