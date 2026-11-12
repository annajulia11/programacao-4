const { Router } = require('express');
const ctrl = require('../controllers/missaoController');
const { autenticar } = require('../middleware/auth');

const router = Router();

// Requisito D: todas as rotas de dados exigem autenticação
router.use(autenticar);

router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscar);
router.post('/', ctrl.criar);
router.put('/:id', ctrl.atualizar);
router.delete('/:id', ctrl.remover);

module.exports = router;
