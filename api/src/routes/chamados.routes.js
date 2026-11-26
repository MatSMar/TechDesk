import { Router } from 'express';
import {
  listarChamados,
  buscarChamadoPorId,
  criarChamado,
  substituirChamado,
  atualizarParcialChamado,
  removerChamado,
  listarInteracoesChamado,
  adicionarInteracaoChamado
} from '../controllers/chamados.controller.js';

const router = Router();

router.get('/', listarChamados);
router.get('/:id', buscarChamadoPorId);
router.post('/', criarChamado);
router.put('/:id', substituirChamado);
router.patch('/:id', atualizarParcialChamado);
router.delete('/:id', removerChamado);

router.get('/:id/interacoes', listarInteracoesChamado);
router.post('/:id/interacoes', adicionarInteracaoChamado);

export default router;