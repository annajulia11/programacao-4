const { Router } = require('express');
const ctrl = require('../controllers/aldeiaController');
const { autenticar } = require('../middleware/auth');

const router = Router();

router.use(autenticar);

router.get('/', ctrl.listar);
router.get('/:chave', ctrl.buscar);

module.exports = router;
